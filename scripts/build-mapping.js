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
//
// Codes match the One Pace stream addons (au2001/onepace-stremio and the
// current fedew04/OnePaceStremio) which share the <ARC>_<ep> id namespace.
//
// Only arcs whose per-arc episode count matches the stream addon's cut are
// listed — those map 1:1 (folder number == addon episode number) and stay in
// sync. Arcs whose One Pace cut diverges from the addon (Baratie, Alabasta,
// Enies Lobby, Wano, Egghead) are intentionally OMITTED until each episode is
// title/timing-aligned to the addon ids; a blind numeric map there would
// mislabel/desync subtitles.
const ARC_CODES = {
  '01 Romance Dawn': 'RO',
  '02 Orange Town': 'OR',
  '03 Syrup Village': 'SY',
  '04 Gaimon': 'GA',
  '05 Baratie': 'BA', // folders 01-08 → BA_1..8 (content-verified 1:1; folder 09 is a re-timed dup of BA_8 "The Fourth", maps to a phantom BA_9 the addon never requests)
  '06 Arlong Park': 'AR',
  '07 Loguetown': 'LO',
  '08 Reverse Mountain': 'RM',
  '09 Whisky Peak': 'WH',
  '10 Little Garden': 'LI',
  '11 Drum Island': 'DI',
  '12 Alabasta': 'AL', // identical cut to addon; folders 01-04,10-21 → same-numbered AL ids (AL_5-9 absent from repo). content-verified
  '13 Jaya': 'JA',
  '14 Skypiea': 'SK',
  '16 Water Seven': 'WS',
  // '17 Enies Lobby' (EN) intentionally OMITTED: fedew04 (our source of truth)
  // cuts EN as 25 episodes; this repo's Hebrew is timed to an 18-ep cut, so the
  // ids don't align and would serve drifted/wrong subs on fedew. (It DID align
  // 1:1 on onepace-premium, which sources subs from this repo — but fedew is the
  // target now.) Needs a manual re-time to fedew's 25 boundaries to ever map.
  '24 Post War': 'PW',
  '25 Return to Sabaody': 'RTS',
  '30 Whole Cake Island': 'WC',
  '31 Reverie': 'REV',
  '32 Wano': 'WA', // folders 01-57 → WA_1..57 (content-verified clean prefix; addon WA_58/59 absent from repo)
  '33 Egghead': 'EH', // 20 folders == 20 released fedew04 ids, canonical order → 1:1
  // STILL DEFERRED — genuine re-segmentation, NOT mappable by number:
  //   '17 Enies Lobby' (EN): our 10 Hebrew episodes are an 18-ep recut that
  //   COMBINES 2-3 addon episodes each; every .ass is timed to our combined
  //   episode's 0:00, so no EN_<n> id can be served in-sync. Needs a manual
  //   re-split/re-time to the 25 addon boundaries, not a lookup.
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

      // Find the Hebrew SRT: "<stem> he.srt". A folder may also hold an
      // "<stem> extended he.srt" / "<stem> alternate he.srt" variant cut —
      // prefer the standard one so the id maps to the canonical episode the
      // addon serves.
      const pickHe = (re) => {
        const all = files.filter((f) => re.test(f));
        const standard = all.find((f) => !/\b(extended|alternate)\b/i.test(f));
        return standard || all[0] || null;
      };
      const srtFile = pickHe(/\she\.srt$/i);
      if (!srtFile) {
        warnings.push(`Skipping "${arc}/${epFolder}" - no "<stem> he.srt" found.`);
        continue;
      }

      // Optional Hebrew ASS: "<stem> he.ass"
      const assFile = pickHe(/\she\.ass$/i);

      const id = `${arcCode}_${epNum}`;
      mapping[id] = {
        arc,
        ep: epNum,
        srt: rawUrl(arc, epFolder, srtFile),
        ass: assFile ? rawUrl(arc, epFolder, assFile) : null,
      };
    }
  }

  // Explicit per-id overrides for episodes whose Hebrew is timed to a cut that
  // differs from the repo's main/ layout. Used for fedew-cut arcs (e.g. Enies
  // Lobby) re-translated from fedew's own embedded English so they sync on
  // fedew04 (the source-of-truth addon). Files live under subtitles/fedew/ to
  // not collide with the repo's main/ cut. Each value is a subtitles-relative
  // path stem (no extension); both <stem>.srt and <stem>.ass must exist.
  const ID_OVERRIDES = {
    'EN_1': 'fedew/17 Enies Lobby/01/enieslobby 01 he',
    'EN_2': 'fedew/17 Enies Lobby/02/enieslobby 02 he',
    'EN_3': 'fedew/17 Enies Lobby/03/enieslobby 03 he',
    'EN_4': 'fedew/17 Enies Lobby/04/enieslobby 04 he',
    'EN_5': 'fedew/17 Enies Lobby/05/enieslobby 05 he',
    'EN_6': 'fedew/17 Enies Lobby/06/enieslobby 06 he',
    'EN_7': 'fedew/17 Enies Lobby/07/enieslobby 07 he',
    'EN_8': 'fedew/17 Enies Lobby/08/enieslobby 08 he',
    'EN_9': 'fedew/17 Enies Lobby/09/enieslobby 09 he',
    'EN_10': 'fedew/17 Enies Lobby/10/enieslobby 10 he',
    'EN_11': 'fedew/17 Enies Lobby/11/enieslobby 11 he',
    'EN_12': 'fedew/17 Enies Lobby/12/enieslobby 12 he',
    'EN_13': 'fedew/17 Enies Lobby/13/enieslobby 13 he',
    'EN_14': 'fedew/17 Enies Lobby/14/enieslobby 14 he',
    'EN_15': 'fedew/17 Enies Lobby/15/enieslobby 15 he',
    'EN_16': 'fedew/17 Enies Lobby/16/enieslobby 16 he',
    'EN_17': 'fedew/17 Enies Lobby/17/enieslobby 17 he',
    'EN_18': 'fedew/17 Enies Lobby/18/enieslobby 18 he',
    'EN_19': 'fedew/17 Enies Lobby/19/enieslobby 19 he',
    'EN_20': 'fedew/17 Enies Lobby/20/enieslobby 20 he',
    'EN_21': 'fedew/17 Enies Lobby/21/enieslobby 21 he',
    'EN_22': 'fedew/17 Enies Lobby/22/enieslobby 22 he',
    'EN_23': 'fedew/17 Enies Lobby/23/enieslobby 23 he',
    'EN_24': 'fedew/17 Enies Lobby/24/enieslobby 24 he',
    'EN_25': 'fedew/17 Enies Lobby/25/enieslobby 25 he',
    // Post-Enies Lobby (PEN, fedew04 cut) — translated from the One Pace English.
    'PEN_1': 'fedew/18 Post-Enies Lobby/01/postenieslobby 01 he',
    'PEN_2': 'fedew/18 Post-Enies Lobby/02/postenieslobby 02 he',
    'PEN_3': 'fedew/18 Post-Enies Lobby/03/postenieslobby 03 he',
    'PEN_4': 'fedew/18 Post-Enies Lobby/04/postenieslobby 04 he',
    'PEN_5': 'fedew/18 Post-Enies Lobby/05/postenieslobby 05 he',
    // Thriller Bark (TB, fedew04 cut) — translated from the One Pace English.
    'TB_1': 'fedew/19 Thriller Bark/01/thrillerbark 01 he',
    'TB_2': 'fedew/19 Thriller Bark/02/thrillerbark 02 he',
    'TB_3': 'fedew/19 Thriller Bark/03/thrillerbark 03 he',
    'TB_4': 'fedew/19 Thriller Bark/04/thrillerbark 04 he',
    'TB_5': 'fedew/19 Thriller Bark/05/thrillerbark 05 he',
    'TB_6': 'fedew/19 Thriller Bark/06/thrillerbark 06 he',
  };
  for (const [id, stem] of Object.entries(ID_OVERRIDES)) {
    const parts = stem.split('/');
    const ep = parseEpNumber(parts[parts.length - 2]);
    mapping[id] = {
      arc: parts.slice(0, -2).join('/'),
      ep,
      srt: `${RAW_BASE}/${encodeRelPath(stem + '.srt')}`,
      ass: `${RAW_BASE}/${encodeRelPath(stem + '.ass')}`,
    };
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
