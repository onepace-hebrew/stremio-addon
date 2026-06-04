#!/usr/bin/env node
'use strict';

/**
 * build-mapping.js
 *
 * Scans subtitles/main/<NN Arc>/<ep>/ for Hebrew subtitle files ("<stem> he.srt"
 * and optional "<stem> he.ass") and writes a deterministic mapping.json keyed by
 * the Stremio episode id (<ARC_CODE>_<episode-number>).
 *
 * The ids match the au2001/onepace-stremio stream addon so this subtitles addon
 * lines up with the streams users are already watching.
 *
 * On Beamup the addon is serverless and cannot serve local files, so the mapping
 * points at PUBLIC raw.githubusercontent.com URLs of this repo.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Raw GitHub base for this repo (org/repo/branch). Spaces get URL-encoded below.
const RAW_BASE =
  'https://raw.githubusercontent.com/onepace-hebrew/stremio-addon/main/subtitles';

// Arc folder name -> Stremio arc code. Extend this as more arcs are added.
// Keys are the exact "<NN Arc>" folder names under subtitles/main/.
const ARC_CODES = {
  '16 Water Seven': 'WS',
  '17 Enies Lobby': 'EN',
  // Future arcs, e.g.:
  // '18 Thriller Bark': 'TB',
  // '19 Sabaody Archipelago': 'SA',
};

const SUBTITLES_ROOT = path.join(__dirname, '..', 'subtitles');
const MAIN_ROOT = path.join(SUBTITLES_ROOT, 'main');
const MAPPING_PATH = path.join(__dirname, '..', 'mapping.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// URL-encode a repo-relative path, encoding spaces as %20 but keeping slashes.
function encodeRelPath(relPath) {
  return relPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function rawUrl(arc, ep, filename) {
  const rel = `main/${arc}/${ep}/${filename}`;
  return `${RAW_BASE}/${encodeRelPath(rel)}`;
}

// Parse the integer episode number from an episode folder name (e.g. "01" -> 1).
function parseEpNumber(epFolder) {
  const n = parseInt(epFolder, 10);
  return Number.isNaN(n) ? null : n;
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function build() {
  const mapping = {};
  const warnings = [];

  if (!fs.existsSync(MAIN_ROOT)) {
    console.error(`No subtitles directory found at ${MAIN_ROOT}`);
    return { mapping, warnings };
  }

  for (const arc of listDirs(MAIN_ROOT).sort()) {
    const arcCode = ARC_CODES[arc];
    if (!arcCode) {
      warnings.push(`Skipping arc "${arc}" - no ARC_CODES entry.`);
      continue;
    }

    const arcDir = path.join(MAIN_ROOT, arc);
    for (const epFolder of listDirs(arcDir).sort()) {
      const epNum = parseEpNumber(epFolder);
      if (epNum === null) {
        warnings.push(`Skipping "${arc}/${epFolder}" - episode folder is not numeric.`);
        continue;
      }

      const epDir = path.join(arcDir, epFolder);
      const files = fs.readdirSync(epDir);

      // Find the Hebrew SRT: "<stem> he.srt"
      const srtFile = files.find((f) => /\she\.srt$/i.test(f));
      if (!srtFile) {
        warnings.push(`Skipping "${arc}/${epFolder}" - no "<stem> he.srt" found.`);
        continue;
      }

      // Optional Hebrew ASS: "<stem> he.ass"
      const assFile = files.find((f) => /\she\.ass$/i.test(f)) || null;

      const id = `${arcCode}_${epNum}`;
      mapping[id] = {
        arc,
        ep: epNum,
        srt: rawUrl(arc, epFolder, srtFile),
        ass: assFile ? rawUrl(arc, epFolder, assFile) : null,
      };
    }
  }

  return { mapping, warnings };
}

// Produce a deterministic JSON string with sorted top-level keys.
function stringifySorted(mapping) {
  const sorted = {};
  for (const key of Object.keys(mapping).sort()) {
    sorted[key] = mapping[key];
  }
  return JSON.stringify(sorted, null, 2) + '\n';
}

function main() {
  const { mapping, warnings } = build();
  const out = stringifySorted(mapping);
  fs.writeFileSync(MAPPING_PATH, out, 'utf8');

  const ids = Object.keys(mapping).sort();
  console.log(`Wrote ${MAPPING_PATH}`);
  console.log(`Mapped ${ids.length} episode(s):`);
  for (const id of ids) {
    const entry = mapping[id];
    console.log(`  ${id}  ->  ${entry.arc} ep ${entry.ep}  (ass: ${entry.ass ? 'yes' : 'no'})`);
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { build, stringifySorted, ARC_CODES, rawUrl, encodeRelPath };
