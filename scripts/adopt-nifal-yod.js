#!/usr/bin/env node
'use strict';

/**
 * adopt-nifal-yod.js
 *
 * Standardises nif'al infinitives on the Academy of the Hebrew Language
 * spelling: the i-vowel takes a yod, so לְהִלָּחֵם is written להילחם, not להלחם.
 * The Academy's published examples name these exact forms (להיכנס / ייכנס /
 * תיכנס), and it rules the nif'al infinitive of נהנה as ליהנות.
 *
 * docs/translation-learnings.md §1.6 prescribes the opposite (no yod) and
 * flags itself as "sometimes non-Academy — follow it anyway". That section
 * accurately DESCRIBES the human translator's habit; it does not describe
 * correct Hebrew. This script aligns our own generated output with the
 * standard and leaves his files alone.
 *
 * NOT swept, deliberately:
 *   להראות  — hif'il "to show", a DIFFERENT VERB from nif'al להיראות
 *             "to appear". All 55 uses in the corpus are "to show someone".
 *   להמשך   — the noun המשך with a ל prefix ("the key to the continuation"),
 *             not an infinitive at all.
 *   להתבשל  — hitpa'el "to cook", never takes the yod. The 2 להיתבשל in the
 *             corpus are the error, and are corrected the other way here.
 *
 * The 20 human " He.ass" files are ground truth and are never modified, so
 * their whole episode directory (the .srt beside them included) is skipped.
 * The .he.json translation inputs ARE swept — otherwise the next
 * build-onepace-episode.js run would silently reintroduce the old spelling.
 *
 * Idempotent. Usage: node scripts/adopt-nifal-yod.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

// no-yod -> with-yod. Every entry verified present in the corpus and checked
// for collision with a same-spelled hif'il/noun before being added.
const ADD_YOD = [
  ['להלחם', 'להילחם'], ['להשאר', 'להישאר'], ['להכנס', 'להיכנס'],
  ['להפרד', 'להיפרד'], ['להפטר', 'להיפטר'], ['להמנע', 'להימנע'],
  ['להרגע', 'להירגע'], ['להזהר', 'להיזהר'], ['להתקל', 'להיתקל'],
  ['להמתח', 'להימתח'], ['להפגע', 'להיפגע'], ['להשמע', 'להישמע'],
  ['להכנע', 'להיכנע'], ['להתפס', 'להיתפס'], ['להזכר', 'להיזכר'],
  ['להאחז', 'להיאחז'], ['להתקע', 'להיתקע'], ['להכשל', 'להיכשל'],
  ['להגמר', 'להיגמר'], ['להפצע', 'להיפצע'], ['להטבע', 'להיטבע'],
  ['להשבע', 'להישבע'], ['להמלט', 'להימלט'], ['להפגש', 'להיפגש'],
  ['להעלם', 'להיעלם'], ['להאבק', 'להיאבק'], ['להסחף', 'להיסחף'],
  ['להנצל', 'להינצל'], ['להרדם', 'להירדם'], ['להשבר', 'להישבר'],
  ['להנות', 'ליהנות'],
];

// the one correction in the other direction: hitpa'el must NOT take the yod
const DROP_YOD = [['להיתבשל', 'להתבשל']];

// Hebrew prefixes attach in front of the ל, so allow one before the match.
function rx(form) {
  return new RegExp(`(?<![א-ת])([ושכמב]?)${form}(?![א-ת])`, 'g');
}

function targetFiles() {
  const tracked = execFileSync('git', ['ls-files', '-z', 'subtitles', 'scripts/onepace-translations'], {
    cwd: REPO_ROOT,
    maxBuffer: 1 << 28,
  }).toString().split('\0').filter(Boolean);

  // any directory holding a human " He.ass" is off limits, .srt included
  const humanDirs = new Set(
    tracked.filter((f) => / He\.ass$/.test(f)).map((f) => path.dirname(f))
  );

  return {
    files: tracked.filter(
      (f) => /\.(ass|srt)$/i.test(f) || /\.he\.json$/.test(f)
    ).filter((f) => !humanDirs.has(path.dirname(f))),
    skipped: humanDirs.size,
  };
}

const { files, skipped } = targetFiles();
const totals = new Map();
const touched = new Set();
let hits = 0;

for (const rel of files) {
  const abs = path.join(REPO_ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  let text = before;

  for (const [from, to] of [...ADD_YOD, ...DROP_YOD]) {
    let n = 0;
    text = text.replace(rx(from), (m, prefix) => { n++; return prefix + to; });
    if (n) {
      totals.set(from + ' → ' + to, (totals.get(from + ' → ' + to) || 0) + n);
      hits += n;
    }
  }

  if (text !== before) {
    touched.add(rel);
    if (!dryRun) fs.writeFileSync(abs, text, 'utf8');
  }
}

console.log(dryRun ? 'DRY RUN — nothing written\n' : 'Applied\n');
for (const [pair, n] of [...totals].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${pair}`);
}
console.log(`\n  ${hits} replacements across ${touched.size} files`);
console.log(`  ${skipped} human-translation directories skipped (never modified)`);
