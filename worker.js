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
  version: '1.0.24',
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
    // SRT first — always works. Second entry: our own ass->VTT conversion
    // served by this Worker. Stremio cannot ingest external .ass at all
    // (server pipeline rejects every .ass — stremio-bugs#2312, all
    // platforms), but external VTT loads fine — the conversion keeps cue
    // positioning (top-screen signs etc.), which raw srt loses.
    // label: official per-track display name (stremio-core#947, v0.55.0+);
    // older clients ignore the field and just show "Hebrew" three times.
    if (entry.srt) {
      out.push({ id: `${token}-he-srt`, url: entry.srt, lang: 'heb', label: 'עברית (SRT)' });
    }
    if (entry.ass) {
      out.push({
        id: `${token}-he-vtt`,
        url: `${origin}/vtt/${token.toUpperCase()}.vtt`,
        lang: 'heb',
        label: 'עברית + שלטים (VTT)',
      });
      // Third entry: raw .ass. Dead on desktop (server pipeline rejects it,
      // stremio-bugs#2312) but Android/TV apps have an SSA/ASS support
      // toggle (bottom of the Playback settings section) that renders it in
      // ExoPlayer — with the file's own styling, including black outline.
      // Served via the Worker (/ass/...), NOT raw github: edge-cached delivery
      // is fast+steady, so the player doesn't stall mid-load on a slow
      // raw.githubusercontent fetch (the intermittent freeze on libmpv).
      out.push({
        id: `${token}-he-ass`,
        // ?v=<version> busts client/edge caches on every deploy — a new URL the
        // player has never cached, so fixes can't be masked by a stale .ass.
        url: `${origin}/ass/${token.toUpperCase()}.ass?v=${manifest.version}`,
        lang: 'heb',
        label: 'עברית מעוצב (ASS)',
      });
      // Was: same styled ASS with signs pre-converted to visual order, for an
      // older VLC Android that didn't bidi sign text. That VLC now bidis
      // everything, so this track serves the SAME logical output as /ass (see
      // normalizeForVlc). Kept as a distinct id so users' saved selection holds.
      out.push({
        id: `${token}-he-ass-vlc`,
        url: `${origin}/ass-vlc/${token.toUpperCase()}.ass?v=${manifest.version}`,
        lang: 'heb',
        label: 'עברית מעוצב (VLC)',
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

// Conversation styles (bottom dialogue); everything else is a "sign".
// Episodes use either the "-207-"/"-207+" style set OR the plain names (e.g.
// EL11's dialogue is the plain "Main", size 55). Match BOTH — otherwise the
// VLC track mis-classifies dialogue as a sign and visual-orders it (reversed)
// and skips the size bump (tiny). Suffix optional; anchored so "Captions"/
// "Title"/"Note"/"Credits" never match.
const DIALOGUE_STYLE =
  /^(Main|Thoughts|Narrator|Secondary|Flashbacks|FlashbacksSecondary|FlashbackThoughts|FlashbackSecondary)(-207[-+])?$/;
const BIDI_CTRL = /[‎‏‪-‮⁦-⁩؜]/g;

// Bump dialogue style fontsize — the embedded Gveret Levin renders small at the
// authored sizes. Two style regimes exist: "-207-" dialogue is ~82, the plain
// set (e.g. EL11's "Main") is ~55. A flat ×1.3 leaves the plain set tiny (72),
// so floor the result: 82→107, 55→105. Both land readable + consistent.
// Sign/title sizes are handled per-event (capSignScale).
function tuneStyleLine(line) {
  const p = line.slice('Style:'.length).split(',');
  if (p.length < 3 || !DIALOGUE_STYLE.test(p[0].trim())) return line;
  const sz = Number(p[2]);
  if (sz) p[2] = String(Math.max(Math.round(sz * 1.3), 105));
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
  return assText
    .replace(/\\fn[^\\}]*/g, '')
    .split('\n')
    .map((line) => {
      if (line.startsWith('Style:')) return tuneStyleLine(line);
      if (!line.startsWith('Dialogue:')) return line;
      const head = line.match(/^(Dialogue:(?:[^,]*,){9})/);
      if (!head) return line;
      const style = head[1].split(',')[3].trim();
      if (DIALOGUE_STYLE.test(style) || style === 'Warning') return line;
      let txt = capSignScale(line.slice(head[1].length));
      if (visual) txt = signTextToVisual(txt);
      return head[1] + txt;
    })
    .join('\n');
}
const normalizeForEmbed = (t) => normalize(t, false);
// VLC Android now applies the bidi algorithm to ALL subtitle text (it didn't
// when the visual-order fix was built). Proof: on the VLC track, logical-order
// dialogue (with its RLE marks) renders correctly — so VLC IS bidi-ing. Signs
// pre-converted to visual order then get bidi'd AGAIN → reversed. So serve signs
// logical too (RLE kept), and let VLC's bidi handle them like it does dialogue.
// signTextToVisual/lineToVisual kept for easy revert if VLC's behavior flips back.
const normalizeForVlc = (t) => normalize(t, false);

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
