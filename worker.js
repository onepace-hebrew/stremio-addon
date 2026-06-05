// Cloudflare Worker — the dynamic Stremio subtitles endpoint.
//
// Why a Worker (not GitHub Pages): Stremio requests subtitles at
//   /subtitles/series/<id>.json  OR  /subtitles/series/<id>/<extra...>.json
// where <extra> carries videoHash/videoSize/filename. A static host only has the
// base file, so the extra-path 404s and no subtitles show. This Worker matches ANY
// such path, extracts the <ARC>_<ep> id token (e.g. WS_19, EN_1) from whatever
// Stremio sends, and returns the Hebrew tracks. Free, no cold-start. Deploys from
// this repo (mapping.json is bundled at build time).

import mapping from './mapping.json';

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.0',
  name: 'One Pace Hebrew Subtitles',
  description:
    'Hebrew subtitles for One Pace — the fan-made recut of One Piece. Pick the Hebrew ' +
    'track and watch. AI-generated; may contain errors.',
  logo: 'https://onepace-hebrew.github.io/stremio-addon/icon.png',
  resources: ['subtitles'],
  types: ['series'],
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

// Pull the <ARC>_<ep> token (WS_19, EN_1, RO_1...) out of whatever id Stremio sends
// ("WS_19", "onepace:WS_19", a series-prefixed form, etc.) and return its Hebrew tracks.
function subtitlesFor(idSegment) {
  const token = (String(idSegment).match(/[A-Za-z]+_\d+/g) || []).pop();
  const entry = token && mapping[token.toUpperCase()];
  const out = [];
  if (entry) {
    if (entry.srt) out.push({ id: `${token}-he-srt`, url: entry.srt, lang: 'heb' });
    if (entry.ass) out.push({ id: `${token}-he-ass`, url: entry.ass, lang: 'heb' });
  }
  return out;
}

export default {
  fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const path = decodeURIComponent(new URL(request.url).pathname);

    if (path === '/' || path.endsWith('/manifest.json')) return json(manifest);

    // /subtitles/series/<id>.json  OR  /subtitles/series/<id>/<extra...>.json
    const m = path.match(/^\/subtitles\/series\/(.+)\.json$/);
    if (m) {
      const idSegment = m[1].split('/')[0]; // strip any /<extra...> suffix
      return json({ subtitles: subtitlesFor(idSegment), cacheMaxAge: 86400 });
    }

    return json({ subtitles: [] });
  },
};
