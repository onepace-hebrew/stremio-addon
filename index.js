#!/usr/bin/env node
'use strict';

/**
 * One Pace Hebrew Subtitles - Stremio addon
 *
 * Serverless-friendly (Beamup): returns PUBLIC raw.githubusercontent.com URLs
 * from mapping.json rather than serving local files.
 *
 * Episode ids follow the au2001/onepace-stremio stream addon scheme:
 *   <ARC_CODE>_<episode-number>   e.g. WS_19, WS_20, EN_1
 */

const fs = require('fs');
const path = require('path');
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// Load the generated mapping (id -> { arc, ep, srt, ass }).
let MAPPING = {};
try {
  MAPPING = JSON.parse(fs.readFileSync(path.join(__dirname, 'mapping.json'), 'utf8'));
} catch (err) {
  console.error('Could not read mapping.json - run `npm run build-mapping` first.', err.message);
  MAPPING = {};
}

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.1',
  name: 'One Pace Hebrew Subtitles',
  description:
    'Hebrew subtitles for One Pace — the fan-made recut of One Piece. Pick the Hebrew ' +
    'track and watch. AI-generated; may contain errors.',
  logo: 'https://onepace-hebrew.github.io/stremio-addon/icon.png',
  resources: ['subtitles'],
  types: ['series'],
  catalogs: [],
};

const builder = new addonBuilder(manifest);

// ---------------------------------------------------------------------------
// ID resolution
// ---------------------------------------------------------------------------

// Match a trailing <ARC>_<ep> token, e.g. "WS_19", "EN_1".
// ARC code is letters (case-insensitive), ep is digits.
const ID_TOKEN_RE = /([A-Za-z]+_\d+)(?!.*[A-Za-z]+_\d+)/; // last occurrence

// Try to resolve an incoming Stremio id (or filename) to a mapping key.
function resolveId(rawId, extra) {
  if (!rawId && !(extra && extra.filename)) return null;

  const candidates = [];
  if (rawId) candidates.push(String(rawId));
  if (extra && extra.filename) candidates.push(String(extra.filename));

  for (const candidate of candidates) {
    // 1) Exact match (also case-insensitive on the arc letters).
    if (MAPPING[candidate]) return candidate;

    // 2) Strip a known prefix scheme like "onepace:" or "series:".
    const stripped = candidate.replace(/^(onepace|series)[:_-]/i, '');
    if (MAPPING[stripped]) return stripped;

    // 3) Extract a trailing <ARC>_<ep> token from anywhere in the string.
    const m = candidate.match(ID_TOKEN_RE);
    if (m) {
      const token = m[1];
      if (MAPPING[token]) return token;
      // Normalize arc code to uppercase (ids are stored uppercase).
      const upper = token.replace(/^([A-Za-z]+)/, (s) => s.toUpperCase());
      if (MAPPING[upper]) return upper;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Subtitles handler
// ---------------------------------------------------------------------------

builder.defineSubtitlesHandler((args) => {
  const id = resolveId(args.id, args.extra);

  if (!id || !MAPPING[id]) {
    return Promise.resolve({ subtitles: [] });
  }

  const entry = MAPPING[id];
  const subtitles = [];

  // SRT first - works in Stremio's default player.
  if (entry.srt) {
    subtitles.push({ id: `${id}-he-srt`, url: entry.srt, lang: 'heb' });
  }

  // ASS second - styled, best in mpv. Skip if absent.
  if (entry.ass) {
    subtitles.push({ id: `${id}-he-ass`, url: entry.ass, lang: 'heb' });
  }

  return Promise.resolve({ subtitles, cacheMaxAge: 86400 });
});

// ---------------------------------------------------------------------------
// Serve (Beamup sets PORT; defaults to 7000 locally)
// ---------------------------------------------------------------------------

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port });

console.log(`One Pace Hebrew Subtitles addon running on port ${port}`);
console.log(`Manifest: http://127.0.0.1:${port}/manifest.json`);
