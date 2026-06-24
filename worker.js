// Cloudflare Worker — the dynamic Stremio subtitles endpoint.
//
// Why a Worker (not GitHub Pages): Stremio requests subtitles at
//   /subtitles/series/<id>.json  OR  /subtitles/series/<id>/<extra...>.json
// where <extra> carries videoHash/videoSize/filename. A static host only has the
// base file, so the extra-path 404s and no subtitles show. This Worker matches ANY
// such path, extracts the <ARC>_<ep> id token (e.g. WS_19, EN_1) from whatever
// Stremio sends, and returns the Hebrew tracks. Free, no cold-start.
//
// AUTO-UPDATE: the id->files mapping is fetched at runtime from the repo's raw
// mapping.json (short-cached), NOT bundled at deploy time. So when CI rebuilds
// mapping.json after new subtitles land, the Worker serves the new episodes within
// minutes WITHOUT a redeploy. The bundled import is only a cold-start fallback if
// the fetch ever fails.

import bundledMapping from './mapping.json';
import { assToVtt } from './ass-to-vtt.js';
import { FONTS_BLOCK_B64 } from './embedded-font.js';
import bidiFactory from 'bidi-js';

const bidi = bidiFactory();

// ASS [Fonts] block: a Hebrew font (Gveret Levin, SIL OFL) embedded three
// times, internal family renamed to each Guttman family the One Pace styles
// use (Yad-Brush, Kav, Aharoni). Injected into every served .ass so libass
// renders Hebrew via the styles' EXISTING font names — no text/style rewriting,
// so the source's RTL marks, sign positioning and alignment are preserved. VLC
// on Android otherwise shows boxes (no Hebrew glyphs). Decoded once per isolate.
const FONTS_BLOCK = atob(FONTS_BLOCK_B64);

const MAPPING_URL =
  'https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/mapping.json';
const MAPPING_TTL_MS = 5 * 60 * 1000; // refresh at most every 5 min per isolate

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.41',
  name: 'One Pace Hebrew Subtitles',
  description:
    'Hebrew subtitles for One Pace — the fan-made recut of One Piece. Pick the Hebrew ' +
    'track and watch. AI-generated; may contain errors.',
  logo: 'https://onepace-hebrew.github.io/stremio-addon/icon.png',
  resources: ['subtitles'],
  // Different One Pace stream addons label the same <ARC>_<ep> ids under
  // different content types — au2001/fedew04 use 'series', onepace-premium uses
  // 'anime'. Stremio only queries a subtitles addon for its declared types, so
  // we must cover all three or playback under the "wrong" type shows no Hebrew.
  // No idPrefixes (left undefined = match all ids of these types).
  types: ['series', 'anime', 'movie'],
  catalogs: [],
  behaviorHints: { configurable: false },
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const json = (obj) =>
  new Response(JSON.stringify(obj), {
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
  });

// In-isolate cache of the latest mapping.
let cache = { at: 0, data: null };

async function getMapping() {
  const now = Date.now();
  if (cache.data && now - cache.at < MAPPING_TTL_MS) return cache.data;
  try {
    const res = await fetch(MAPPING_URL, {
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        cache = { at: now, data };
        return data;
      }
    }
  } catch (_) {
    // fall through to whatever we have
  }
  return cache.data || bundledMapping;
}

// Pull the <ARC>_<ep> token (WS_19, EN_1, RO_1...) out of whatever id Stremio sends
// ("WS_19", "onepace:WS_19", a series-prefixed form, etc.) and return its Hebrew tracks.
function subtitlesFor(idSegment, mapping, origin) {
  const token = (String(idSegment).match(/[A-Za-z]+_\d+/g) || []).pop();
  const entry = token && mapping[token.toUpperCase()];
  const out = [];
  if (entry) {
    // Only TWO tracks advertised: plain SRT + the styled track. The `label`
    // field is the official per-track name (stremio-core#947, v0.55.0+) but most
    // clients ignore it and show every entry as the same generic "Hebrew" — so
    // extra tracks (a VTT, a second styled ASS) were just indistinguishable
    // duplicates the user couldn't tell apart and kept landing on the wrong one.
    // The /vtt and /ass endpoints still exist and work — they're simply not
    // listed. The styled track (id kept as -ass-vlc) serves all-logical text
    // with the embedded font + size bumps; VLC bidis it all. See normalizeForVlc.
    // ONE track only: the styled .ass, served all-logical (signs + dialogue) with
    // the embedded font + size bumps. VLC/ExoPlayer bidi it correctly. Signs were
    // never pre-reversed here — a pre-reversed \an8 sign still rendered reversed on
    // VLC Android, i.e. VLC DOES bidi signs, so pre-reversing double-reverses them.
    // SRT/VTT dropped per request (no duplicate tracks). Trade-off: Stremio's
    // built-in mpv can't fetch an external .ass (TLS ANR) → no Hebrew there; use an
    // external player (VLC/ExoPlayer). New id (-he-logical) forces a clean refetch.
    if (entry.ass) {
      out.push({
        id: `${token}-he-logical`,
        url: `${origin}/ass/${token.toUpperCase()}.ass?v=${manifest.version}`,
        lang: 'heb',
        label: 'עברית',
      });
    }
  }
  return out;
}

// Fetch the episode's .ass and convert to WebVTT. Edge-cached.
async function vttFor(token, mapping) {
  const entry = mapping[token.toUpperCase()];
  if (!entry || !entry.ass) return null;
  const res = await fetch(entry.ass, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) return null;
  return assToVtt(await res.text());
}

// Conversation styles (bottom dialogue); everything else is a "sign". The base
// NAME (Main/Thoughts/Flashbacks/…) may carry ANY variant suffix — episodes use
// "-207-", "-207+", "-720p", or no suffix (EL11's plain "Main", size 55). Match
// the name + any "-suffix" — otherwise the VLC track mis-classifies that
// dialogue as a sign and visual-orders it (reversed) and skips the size bump
// (tiny); that's exactly what "Flashbacks-720p" hit. Anchored so sign names
// (Captions/Title/Note/Credits) never match.
const DIALOGUE_STYLE =
  /^(Main|Thoughts|Narrator|Secondary|Flashbacks|FlashbacksSecondary|FlashbackThoughts|FlashbackSecondary|Roger[ -]Monologue)(-.*)?$/;
const BIDI_CTRL = /[‎‏‪-‮⁦-⁩؜]/g;

// Readable typeset-sign styles (episode/scene titles, location captions, notes).
// These render small with the embedded Gveret Levin too, so bump them like
// dialogue. Same "any -suffix" rule. Credits/Warning/song styles left at size.
const SIGN_TEXT_STYLE = /^(Title|Captions|Caption|Note|Narration|Sign)(-.*)?$/;
// Episode-title styles. VLC Android bidis dialogue, \pos signs, and even top/
// bottom signs (Note@an8 renders correct LOGICAL — user-confirmed PEN_2 17:48),
// but NOT vertically-centered titles (an5) → those it draws LTR = reversed.
// So titles (only, non-\pos) are PRE-FLIPPED to visual even on the logical track.
// Every reversed-sign report in this project has been an episode title.
const TITLE_STYLE = /^(Title|Titles|EpisodeTitle)(-.*)?$/;

// Bump style fontsize — the embedded Gveret Levin renders small at the authored
// sizes. Dialogue: ×1.3 with a floor so the small "plain" regime lands readable
// (82→107, 55→105 at 1080p). The floor SCALES with PlayResY (105 is a 1080p
// number = 9.7% of height); a 720p episode floors at 70 so it isn't oversized.
// Sign text (titles, captions, notes): ×1.3, no floor (short, low overflow risk).
function tuneStyleLine(line, sizeFloor) {
  const p = line.slice('Style:'.length).split(',');
  if (p.length < 3) return line;
  const name = p[0].trim();
  const sz = Number(p[2]);
  if (!sz) return line;
  if (DIALOGUE_STYLE.test(name)) p[2] = String(Math.max(Math.round(sz * 1.3), sizeFloor));
  else if (SIGN_TEXT_STYLE.test(name)) p[2] = String(Math.round(sz * 1.3));
  else return line;
  return 'Style:' + p.join(',');
}

// Drop event \fscx/\fscy UPSCALES (>100) on signs: the typeset 125–175% scaling
// overflows the screen for the (different-length) Hebrew. Downscales (<=100)
// are kept. Layered fill+outline events scale identically, so they still
// overlap exactly — no doubling.
function capSignScale(t) {
  return t.replace(/\\fsc([xy])([\d.]+)/g, (m, _a, v) => (Number(v) > 100 ? '' : m));
}

// One display line (no tags) -> visual order, RTL base, with bracket mirroring.
function lineToVisual(line) {
  if (!line) return line;
  const levels = bidi.getEmbeddingLevels(line, 'rtl');
  const chars = Array.from(line);
  for (const [i, c] of bidi.getMirroredCharactersMap(line, levels)) chars[i] = c;
  for (const [s, e] of bidi.getReorderSegments(line, levels)) {
    const slice = chars.slice(s, e + 1).reverse();
    for (let i = 0; i < slice.length; i++) chars[s + i] = slice[i];
  }
  return chars.join('');
}

// Sign event Text -> visual order: drop bidi control marks, keep {override}
// blocks in place, visual-order each text run per \N line.
function signTextToVisual(t) {
  return t
    .replace(BIDI_CTRL, '')
    .split(/(\{[^}]*\})/)
    .map((tok) => (tok.startsWith('{') || tok === '' ? tok : tok.split('\\N').map(lineToVisual).join('\\N')))
    .join('');
}

// Shared normalization: drop inline \fn, bump dialogue size, cap sign upscale.
// visual=true also converts SIGN text to visual order (VLC track) so VLC's
// no-bidi sign rendering reads correctly; dialogue stays logical (VLC bidis it
// fine). Positioning/alignment/layered events otherwise preserved.
function normalize(assText, visual) {
  // Dialogue size floor scales with the script's resolution (105 = a 1080p px).
  const playResY = Number((assText.match(/^PlayResY:\s*(\d+)/m) || [])[1]) || 1080;
  const sizeFloor = Math.max(60, Math.round(105 * (playResY / 1080)));
  return assText
    .replace(/\\fn[^\\}]*/g, '')
    // Strip inline italic toggles. They're often vestigial (e.g. "תום-{\i0}סאן
    // {\i1}.") and fragment a dialogue line into separate bidi runs, which VLC
    // reorders → the trailing word jumps to the front ("Robin-chan" bug).
    // Style-level italics (Italic field) are unaffected.
    .replace(/\\i[01]/g, '')
    .replace(/\{\}/g, '')
    .split('\n')
    .map((line) => {
      if (line.startsWith('Style:')) return tuneStyleLine(line, sizeFloor);
      if (!line.startsWith('Dialogue:')) return line;
      const head = line.match(/^(Dialogue:(?:[^,]*,){9})/);
      if (!head) return line;
      const style = head[1].split(',')[3].trim();
      if (DIALOGUE_STYLE.test(style) || style === 'Warning') return line;
      let txt = capSignScale(line.slice(head[1].length));
      // PRE-FLIP only what VLC won't bidi itself. VLC bidis \pos/\move text,
      // bottom dialogue, and top/bottom signs (Note@an8 was correct LOGICAL) —
      // pre-flipping any of those double-reverses them. The ONE exception is the
      // centered episode TITLE (an5): VLC draws it LTR (reversed) unless pre-
      // flipped. So titles flip on BOTH tracks; the legacy `visual` track also
      // flips the other signs (kept only as a one-line-revert fallback).
      const posAnchored = /\\(pos|move)\b/.test(txt);
      const flip = !posAnchored && (TITLE_STYLE.test(style) || (visual && SIGN_TEXT_STYLE.test(style)));
      if (flip) txt = signTextToVisual(txt);
      return head[1] + txt;
    })
    .join('\n');
}
const normalizeForEmbed = (t) => normalize(t, false);
// VLC track: dialogue logical (VLC bidis bottom text), \pos/\move signs logical
// (VLC bidis those too), and NON-\pos signs (alignment/margin-positioned titles
// & the like) PRE-FLIPPED to visual order — VLC does not bidi those, so the file
// must carry them reversed. See the posAnchored split in normalize(). Confirmed:
// E24 title (non-\pos) was reversed when left logical; E20 \pos captions were
// reversed when pre-flipped.
const normalizeForVlc = (t) => normalize(t, true);

// Insert the [Fonts] block before [Events] (a top-level section, standard
// placement between styles and events).
function injectFonts(assText) {
  const block = FONTS_BLOCK + '\n';
  const idx = assText.indexOf('[Events]');
  if (idx === -1) return assText + '\n' + block;
  return assText.slice(0, idx) + block + assText.slice(idx);
}

// Returns the episode .ass as UTF-8 bytes (BOM-prefixed): drop inline \fn,
// embed the Hebrew [Fonts] block, leave everything else (positioning,
// alignment, RTL marks) intact. res.text() drops the source BOM; re-add one.
async function assFor(token, mapping, vlc) {
  const entry = mapping[token.toUpperCase()];
  if (!entry || !entry.ass) return null;
  const res = await fetch(entry.ass, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) return null;
  const norm = vlc ? normalizeForVlc : normalizeForEmbed;
  const text = injectFonts(norm(await res.text()));
  return new TextEncoder().encode('\uFEFF' + text);
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    if (path === '/' || path.endsWith('/manifest.json')) return json(manifest);

    // /vtt/<ARC>_<ep>.vtt — the episode's .ass converted to WebVTT
    const v = path.match(/^\/vtt\/([A-Za-z]+_\d+)\.vtt$/);
    if (v) {
      const vtt = await vttFor(v[1], await getMapping());
      if (vtt === null) return new Response('not found', { status: 404, headers: CORS });
      return new Response(vtt, {
        headers: {
          'content-type': 'text/vtt; charset=utf-8',
          'cache-control': 'public, max-age=3600',
          ...CORS,
        },
      });
    }

    // /ass/<ARC>_<ep>.ass — the episode's raw .ass, proxied + edge-cached.
    // Behaves like a static file host (Accept-Ranges + 206 + HEAD): mpv hands
    // the .ass URL straight to ffmpeg, which opens it with a range probe. A
    // server that answers 200-without-Accept-Ranges stalls ffmpeg's seekable
    // HTTP path long enough to ANR Stremio's UI thread (it killed the app on
    // a 32-bit Android/libmpv build). raw.githubusercontent does support
    // ranges; match that so the direct fetch completes immediately.
    // /ass-vlc/ serves the same file with signs in visual order (for VLC's
    // no-bidi sign rendering); /ass/ is the standard logical-order file.
    const a = path.match(/^\/(ass|ass-vlc)\/([A-Za-z]+_\d+)\.ass$/);
    if (a) {
      const buf = await assFor(a[2], await getMapping(), a[1] === 'ass-vlc');
      if (buf === null) return new Response('not found', { status: 404, headers: CORS });
      const total = buf.byteLength;
      // No registered MIME for SSA/ASS; players detect by the .ass URL
      // extension. text/x-ssa is the de-facto type and harmless here.
      const base = {
        'content-type': 'text/x-ssa; charset=utf-8',
        'accept-ranges': 'bytes',
        'cache-control': 'public, max-age=3600',
        ...CORS,
      };

      const range = request.headers.get('Range');
      const m = range && range.match(/^bytes=(\d*)-(\d*)$/);
      if (m && !(m[1] === '' && m[2] === '')) {
        // Three forms: "start-end", "start-" (to EOF), "-suffix" (last N bytes).
        let start, end;
        if (m[1] === '') {
          start = Math.max(0, total - Number(m[2]));
          end = total - 1;
        } else {
          start = Number(m[1]);
          end = m[2] === '' || Number(m[2]) >= total ? total - 1 : Number(m[2]);
        }
        if (start > end) {
          return new Response('range not satisfiable', {
            status: 416,
            headers: { ...base, 'content-range': `bytes */${total}` },
          });
        }
        const len = end - start + 1;
        return new Response(request.method === 'HEAD' ? null : buf.slice(start, end + 1), {
          status: 206,
          headers: { ...base, 'content-range': `bytes ${start}-${end}/${total}`, 'content-length': String(len) },
        });
      }

      return new Response(request.method === 'HEAD' ? null : buf, {
        status: 200,
        headers: { ...base, 'content-length': String(total) },
      });
    }

    // /subtitles/<type>/<id>.json  OR  /subtitles/<type>/<id>/<extra...>.json
    // <type> is series|anime|movie — Stremio uses the playing content's type,
    // which varies by stream addon (onepace-premium serves One Pace as 'anime').
    const m = path.match(/^\/subtitles\/[^/]+\/(.+)\.json$/);
    if (m) {
      const idSegment = m[1].split('/')[0]; // strip any /<extra...> suffix
      const mapping = await getMapping();
      // Short 60s fresh window so a new deploy's track list (with the bumped
      // ?v= ASS url) reaches clients within a minute instead of being stranded
      // on a stale list. Long stale windows so playback never stalls on a
      // slow/failed refetch. Mirrors the OpenSubtitles v3 addon shape.
      return json({
        subtitles: subtitlesFor(idSegment, mapping, url.origin),
        cacheMaxAge: 60,
        staleRevalidate: 14400,
        staleError: 604800,
      });
    }

    return json({ subtitles: [] });
  },
};
