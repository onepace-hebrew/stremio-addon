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

// ASS [Fonts] block embedding a Hebrew font (Gveret Levin, SIL OFL, internal
// family renamed to "Guttman Yad-Brush"). Injected into every served .ass so
// libass renders Hebrew even when the player's font set has no Hebrew glyphs
// (VLC on Android shows boxes otherwise). Decoded once per isolate.
const FONTS_BLOCK = atob(FONTS_BLOCK_B64);

const MAPPING_URL =
  'https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/mapping.json';
const MAPPING_TTL_MS = 5 * 60 * 1000; // refresh at most every 5 min per isolate

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.11',
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
        url: `${origin}/ass/${token.toUpperCase()}.ass`,
        lang: 'heb',
        label: 'עברית מעוצב (ASS)',
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

// Point every glyph at the embedded font so nothing falls back to the player's
// (Hebrew-less) default and renders as boxes. The styles reference fonts that
// aren't on the device (Guttman Kav/Aharoni, plus inline \fn signs like Kakumin
// Web); only the Main style matched the embed, so captions/signs still boxed.
//   - strip inline \fn overrides  -> spans use their style font
//   - rewrite each Style Fontname -> "Guttman Yad-Brush" (the embed; has full
//     Hebrew AND Latin, so English/credits still render)
//   - bump the -207- DIALOGUE family ~1.3x: Gveret Levin's glyphs sit ~0.55em,
//     so size 82 looked tiny. Captions/titles/signs keep their (large) sizes —
//     they're positioned to overlay on-screen text.
const EMBED_FAMILY = 'Guttman Yad-Brush';
const DIALOGUE_STYLE =
  /^(Main|Thoughts|Narrator|Secondary|Flashbacks|FlashbacksSecondary|FlashbackThoughts|FlashbackSecondary)-207/;

function normalizeForEmbed(assText) {
  // Strip Unicode bidi control chars. The source prefixes nearly every line
  // with an unterminated RLE (U+202B, no closing PDF); libass+FriBidi tolerates
  // it, but other renderers reverse the line. Removing them lets the renderer's
  // implicit bidi set direction from the text itself (Hebrew -> RTL).
  const text = assText
    .replace(/[‎‏‪-‮⁦-⁩؜]/g, '')
    .replace(/\\fn[^\\}]*/g, '');
  return text
    .split('\n')
    .map((line) => {
      if (line.startsWith('Style:')) {
        // Style: Name,Fontname,Fontsize,... (One Pace files use the standard order)
        const parts = line.slice('Style:'.length).split(',');
        if (parts.length < 3) return line;
        parts[1] = EMBED_FAMILY;
        if (DIALOGUE_STYLE.test(parts[0].trim())) {
          const sz = Number(parts[2]);
          if (sz) parts[2] = String(Math.round(sz * 1.3));
        }
        return 'Style:' + parts.join(',');
      }
      if (line.startsWith('Dialogue:')) {
        const head = line.match(/^(Dialogue:(?:[^,]*,){9})/);
        if (!head) return line;
        const prefix = head[1]; // "Dialogue: layer,start,end,Style,Name,...,Effect,"
        let txt = line.slice(prefix.length); // the Text field (may hold commas/{tags})
        const style = prefix.split(',')[3].trim();

        // Sign/caption/title events are typeset to overlay the original Japanese
        // (\pos + scale + rotation + clip). For Hebrew that overflows the screen,
        // and players that skip bidi on \pos'd text render it reversed (bottom
        // dialogue, which isn't positioned, renders fine). Strip the positioning/
        // transform tags so signs fall back to plain top subtitles: they fit,
        // wrap, and get normal bidi. Dialogue (and the invisible Warning marker)
        // keep their tags untouched.
        const isSign = !DIALOGUE_STYLE.test(style) && style !== 'Warning';
        if (isSign) {
          txt = txt
            .replace(/\\(?:pos|move|org|i?clip|t|fade?)\([^)]*\)/g, '')
            .replace(/\\fr[xyz]?-?[\d.]+/g, '')
            .replace(/\\fsc[xy]-?[\d.]+/g, '')
            .replace(/\\fsp-?[\d.]+/g, '')
            .replace(/\\an?\d+/g, '');
          // RLM (RTL base) + force top alignment so signs don't collide with
          // bottom dialogue.
          return prefix + '‏{\\an8}' + txt;
        }
        // Dialogue: just force RTL base with a leading RLM (U+200F, strong-RTL,
        // not a stateful embedding like the RLE we stripped).
        return prefix + '‏' + txt;
      }
      return line;
    })
    .join('\n');
}

// Insert the [Fonts] block before [Events] (a top-level section, standard
// placement between styles and events).
function injectFonts(assText) {
  const block = FONTS_BLOCK + '\n';
  const idx = assText.indexOf('[Events]');
  if (idx === -1) return assText + '\n' + block;
  return assText.slice(0, idx) + block + assText.slice(idx);
}

// Returns the episode .ass as UTF-8 bytes (BOM-prefixed) with the Hebrew font
// embedded, or null. res.text() decodes UTF-8 and drops the source BOM; we
// re-add a single BOM after injecting.
async function assFor(token, mapping) {
  const entry = mapping[token.toUpperCase()];
  if (!entry || !entry.ass) return null;
  const res = await fetch(entry.ass, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) return null;
  const text = injectFonts(normalizeForEmbed(await res.text()));
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
    const a = path.match(/^\/ass\/([A-Za-z]+_\d+)\.ass$/);
    if (a) {
      const buf = await assFor(a[1], await getMapping());
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
      // 1h, not 24h: clients cache this response, so a long TTL strands users
      // on stale track lists for a day after a fix ships.
      // cache fields mirror the official OpenSubtitles v3 addon: short fresh
      // window so fixes propagate, long stale windows so playback never
      // stalls on a slow/failed refetch.
      return json({
        subtitles: subtitlesFor(idSegment, mapping, url.origin),
        cacheMaxAge: 3600,
        staleRevalidate: 14400,
        staleError: 604800,
      });
    }

    return json({ subtitles: [] });
  },
};
