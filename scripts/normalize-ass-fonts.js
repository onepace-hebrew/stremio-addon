#!/usr/bin/env node
'use strict';

/**
 * normalize-ass-fonts.js
 *
 * Makes generated .ass files use the SAME fonts as the human-translated
 * He.ass ground truth, so they render identically in players that have the
 * official One Pace font pack installed.
 *
 * The human He.ass files draw from a fixed font set, one per style role:
 *   - Guttman Yad-Brush  -> dialogue (Main/Thoughts/Narrator/Flashbacks/
 *                           Secondary/Note)
 *   - Guttman Kav        -> on-screen captions / signs / typeset
 *   - Guttman Aharoni    -> titles & credits
 *   - Impress BT Pace    -> warnings
 * A handful of generated he.ass files inherited bespoke fansub fonts that no
 * official He.ass uses (the song/typeset leftovers from the source scripts).
 * This rewrites those Fontname fields to the official equivalent for the same
 * style role. Song styles (Duality/Rubik) are dropped by
 * strip-ass-for-stremio.js, so their remap is cosmetic — it just keeps the
 * file free of any non-official font name.
 *
 * Only the Fontname field of "Style:" lines is touched; dialogue text and
 * every other field are preserved verbatim.
 *
 * Skips human-translated files (basename ends in " He.ass", capital H).
 *
 * Usage: node scripts/normalize-ass-fonts.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

// Non-official font -> official font for the same style role.
const FONT_MAP = {
  'Guttman Hatzvi': 'Guttman Aharoni', // Title-207+
  'Guttman-CourMir': 'Guttman Kav', // Captions-207+
  'Dry Brush': 'Guttman Kav', // Captions Wano
  Candara: 'Guttman Kav', // Typeset things
  Duality: 'Guttman Yad-Brush', // Karaoke/Lyrics/Kanji (dropped by strip)
  Rubik: 'Guttman Yad-Brush', // furigana (dropped by strip)
};

// "Style: Name,Fontname,Fontsize,..." -> remap Fontname (field index 1).
function remapStyleLine(line) {
  if (!line.startsWith('Style:')) return line;
  const parts = line.split(',');
  if (parts.length < 2) return line;
  const font = parts[1];
  if (Object.prototype.hasOwnProperty.call(FONT_MAP, font)) {
    parts[1] = FONT_MAP[font];
    return parts.join(',');
  }
  return line;
}

function normalizeFile(absPath) {
  const raw = fs.readFileSync(absPath, 'utf8');
  const lines = raw.split('\n');
  let changed = 0;
  const out = lines
    .map((line) => {
      const next = remapStyleLine(line);
      if (next !== line) changed++;
      return next;
    })
    .join('\n');

  if (changed === 0) return null;
  if (!dryRun) fs.writeFileSync(absPath, out, 'utf8');
  return { changed };
}

function main() {
  // git ls-files gives exact-case names (case-insensitive FS would otherwise
  // conflate "he.ass" with "He.ass").
  const tracked = execFileSync('git', ['ls-files', 'subtitles/*.ass'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

  // Generated files only: " he.ass" lowercase. " He.ass" = human ground truth.
  const targets = tracked.filter((f) => f.endsWith('he.ass') && !f.endsWith(' He.ass'));

  let changed = 0;
  for (const rel of targets) {
    const res = normalizeFile(path.join(REPO_ROOT, rel));
    if (!res) continue;
    changed++;
    console.log(`${rel}\n  remapped ${res.changed} style font(s)`);
  }
  console.log(`\n${dryRun ? '[dry-run] ' : ''}${changed}/${targets.length} files changed`);
}

main();
