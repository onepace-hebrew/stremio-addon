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

const MAPPING_URL =
  'https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/mapping.json';
const MAPPING_TTL_MS = 5 * 60 * 1000; // refresh at most every 5 min per isolate

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.4',
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
    if (entry.srt) out.push({ id: `${token}-he-srt`, url: entry.srt, lang: 'heb' });
    if (entry.ass) {
      out.push({
        id: `${token}-he-vtt`,
        url: `${origin}/vtt/${token.toUpperCase()}.vtt`,
        lang: 'heb',
      });
      // Third entry: raw .ass. Dead on desktop (server pipeline rejects it,
      // stremio-bugs#2312) but Android/TV apps have an SSA/ASS support
      // toggle (bottom of the Playback settings section) that renders it in
      // ExoPlayer — with the file's own styling, including black outline.
      out.push({ id: `${token}-he-ass`, url: entry.ass, lang: 'heb' });
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

    // /subtitles/<type>/<id>.json  OR  /subtitles/<type>/<id>/<extra...>.json
    // <type> is series|anime|movie — Stremio uses the playing content's type,
    // which varies by stream addon (onepace-premium serves One Pace as 'anime').
    const m = path.match(/^\/subtitles\/[^/]+\/(.+)\.json$/);
    if (m) {
      const idSegment = m[1].split('/')[0]; // strip any /<extra...> suffix
      const mapping = await getMapping();
      // 1h, not 24h: clients cache this response, so a long TTL strands users
      // on stale track lists for a day after a fix ships.
      return json({ subtitles: subtitlesFor(idSegment, mapping, url.origin), cacheMaxAge: 3600 });
    }

    return json({ subtitles: [] });
  },
};
