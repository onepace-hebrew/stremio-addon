#!/usr/bin/env node
/**
 * build-static.js — generate the static Stremio addon served by GitHub Pages.
 *
 * A Stremio addon is just HTTP GET endpoints returning JSON, so it can be fully static:
 *   docs/manifest.json                       — the addon manifest
 *   docs/subtitles/series/<ID>.json          — the subtitles response per episode id
 * GitHub Pages (source: main /docs) serves these with CORS, so users install
 *   https://onepace-hebrew.github.io/stremio-addon/manifest.json
 * and never download or run anything. Regenerated from mapping.json on every push.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'mapping.json'), 'utf8'));

const manifest = {
  id: 'community.onepace.hebrew',
  version: '1.0.0',
  name: 'One Pace Hebrew Subtitles',
  description:
    "Hebrew subtitles for One Pace. SRT works in Stremio's default player; the styled " +
    'ASS version is best viewed in mpv. Translation by the One Pace Hebrew community ' +
    '(That One Gerbil).',
  logo: 'https://onepace.net/images/one-pace-logo.png',
  resources: ['subtitles'],
  types: ['series'],
  catalogs: [],
  behaviorHints: { configurable: false },
};

// Reset docs/ subtitle output (keep index.html if present is fine — we rewrite it).
fs.rmSync(path.join(DOCS, 'subtitles'), { recursive: true, force: true });
fs.mkdirSync(path.join(DOCS, 'subtitles', 'series'), { recursive: true });

// .nojekyll: stop GitHub Pages' Jekyll from touching our files/paths.
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

fs.writeFileSync(path.join(DOCS, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

const ids = Object.keys(mapping).sort();
for (const id of ids) {
  const e = mapping[id];
  const subtitles = [];
  if (e.srt) subtitles.push({ id: `${id}-he-srt`, url: e.srt, lang: 'heb' });
  if (e.ass) subtitles.push({ id: `${id}-he-ass`, url: e.ass, lang: 'heb' });
  fs.writeFileSync(
    path.join(DOCS, 'subtitles', 'series', `${id}.json`),
    JSON.stringify({ subtitles, cacheMaxAge: 86400 }, null, 2) + '\n',
  );
}

const rows = ids
  .map((id) => `<li><code>${id}</code> — ${mapping[id].arc} ep ${mapping[id].ep}</li>`)
  .join('\n      ');
fs.writeFileSync(
  path.join(DOCS, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>One Pace Hebrew Subtitles — Stremio addon</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 3rem auto; padding: 0 1rem; line-height: 1.5; }
    code { background: #f0f0f0; padding: .1em .3em; border-radius: 4px; }
    a.btn { display:inline-block; background:#7b5cff; color:#fff; padding:.6em 1em; border-radius:8px; text-decoration:none; }
  </style>
</head>
<body>
  <h1>One Pace Hebrew Subtitles 🏴‍☠️</h1>
  <p>A Stremio addon serving Hebrew subtitles for One Pace.</p>
  <p><strong>Install:</strong> copy this URL into Stremio → Add-ons → "Add-on Repository URL":</p>
  <p><code>https://onepace-hebrew.github.io/stremio-addon/manifest.json</code></p>
  <p><a class="btn" href="stremio://onepace-hebrew.github.io/stremio-addon/manifest.json">➕ Install in Stremio</a></p>
  <p>Use the <strong>SRT</strong> track in Stremio's default player; pick the <strong>ASS</strong> track in mpv for full styling.
     Needs the One Pace stream addon installed.</p>
  <h2>Available episodes (${ids.length})</h2>
  <ul>
      ${rows}
  </ul>
  <p>Hebrew translation: <strong>That One Gerbil</strong>. Source: <a href="https://github.com/onepace-hebrew/stremio-addon">github.com/onepace-hebrew/stremio-addon</a></p>
</body>
</html>
`,
);

console.log(`build-static: wrote docs/manifest.json + ${ids.length} subtitle responses (${ids.join(', ')})`);
