#!/usr/bin/env node
/**
 * build-static.js — generate the GitHub Pages landing page (docs/index.html).
 *
 * The ADDON itself is served by the Cloudflare Worker, not Pages:
 *   https://stremio-addon.onepace-hebrew.workers.dev/manifest.json
 * Stremio requests subtitles at /subtitles/series/<id>/<extra...>.json where
 * <extra> carries videoHash/etc. A static host only has the base file, so the
 * extra-path 404s and no subtitles show — that's why Pages can't host the addon.
 * The Worker matches any such path dynamically (see worker.js).
 *
 * Pages is therefore JUST the pretty front door. The page markup lives in
 * scripts/index.template.html (a designed, bilingual EN+Hebrew page with correct
 * RTL/LTR bidi and an inline-SVG favicon). This script injects the live Worker
 * URLs into that template and writes docs/index.html. We do NOT emit a static
 * manifest.json or subtitles/ here — a working-looking manifest with dead
 * subtitle endpoints would be a footgun. Regenerated on every push.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const TEMPLATE = path.join(__dirname, 'index.template.html');

const MANIFEST_URL = 'https://stremio-addon.onepace-hebrew.workers.dev/manifest.json';
const STREMIO_DEEPLINK = 'stremio://stremio-addon.onepace-hebrew.workers.dev/manifest.json';

// Remove any stale static addon endpoints from earlier versions — the Worker
// owns these now; leaving them would let someone install a dead Pages addon.
fs.rmSync(path.join(DOCS, 'manifest.json'), { force: true });
fs.rmSync(path.join(DOCS, 'subtitles'), { recursive: true, force: true });

fs.mkdirSync(DOCS, { recursive: true });
// .nojekyll: stop GitHub Pages' Jekyll from touching our files/paths.
fs.writeFileSync(path.join(DOCS, '.nojekyll'), '');

const template = fs.readFileSync(TEMPLATE, 'utf8');
const html = template
  .split('__MANIFEST_URL__')
  .join(MANIFEST_URL)
  .split('__STREMIO_DEEPLINK__')
  .join(STREMIO_DEEPLINK);

if (html.includes('__MANIFEST_URL__') || html.includes('__STREMIO_DEEPLINK__')) {
  throw new Error('build-static: a URL token was left unreplaced in the template');
}

fs.writeFileSync(path.join(DOCS, 'index.html'), html);

console.log(
  'build-static: wrote docs/index.html from template (Worker addon URL injected); ' +
    'removed stale docs/manifest.json + docs/subtitles',
);
