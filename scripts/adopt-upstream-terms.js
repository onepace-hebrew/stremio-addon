#!/usr/bin/env node
'use strict';

/**
 * adopt-upstream-terms.js
 *
 * One-shot corpus sweep that adopts the term decisions confirmed against the
 * official One Pace Hebrew files (one-pace/one-pace-public-subtitles, arcs
 * Arlong Park 08-09 + Reverse Mountain 01-02, synced upstream 2026-06-19).
 *
 * Each rule below is a literal substring replacement, ordered longest-first.
 * Hebrew prefixes (ו/ש/ל/כש/ה/ב/מ) attach to the front of a word, so a plain
 * substring swap carries them through untouched: "ומיס רביעי" -> "וגברת יום
 * רביעי", "הלוויתן" -> "הלווייתן". That is why these are strings and not
 * word-boundary regexes -- Hebrew has no space before a prefix.
 *
 * The one rule that CANNOT be a plain substring is Laboon: לבון is also the
 * tail of עלבון (insult) and חלבון (protein), so it carries a lookbehind.
 *
 * Idempotent: re-running finds 0 hits. Usage:
 *   node scripts/adopt-upstream-terms.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

// Ordered. Longest / most specific first so a shorter rule can never eat the
// prefix of a longer one.
const RULES = [
  // --- ktiv male: "whale" was misspelled with a single yod everywhere ---
  { group: 'whale', from: 'לוויתן', to: 'לווייתן' },

  // --- Laboon: upstream spells it לאבון; our registry had לבון as primary ---
  { group: 'Laboon', re: /(?<![עח])לבון/g, to: 'לאבון' },

  // --- device name, hyphenated upstream ---
  { group: 'Log Pose', from: 'לוג פוז', to: 'לוג-פוז' },

  // --- Calm Belt: a strip of ocean (רצועה), not a garment (חגורה) ---
  { group: 'Calm Belt', from: 'חגורה השקטה', to: 'רצועה השקטה' },
  { group: 'Calm Belt', from: 'חגורות שקטות', to: 'רצועות שקטות' },
  { group: 'Calm Belt', from: 'חגורה שקטה', to: 'רצועה שקטה' },

  // --- honorific: Miss -> גברת, per the rule distilled from the human files.
  // Baroque Works weekday code names are translated (upstream: Miss Wednesday
  // -> גברת יום רביעי); non-weekday code names keep their transliteration and
  // only get the honorific + spelling normalised. Verb forms that merely
  // contain the letters מיס (להמיס / ממיס / תעמיס "melt, burden") are never
  // touched, because every rule here carries the following name with it.
  { group: 'Miss Wednesday', from: 'מיס ורנסדיי', to: 'גברת יום רביעי' },
  { group: 'Miss Wednesday', from: 'מיס ווינסדיי', to: 'גברת יום רביעי' },
  { group: 'Miss Wednesday', from: 'מיס וונסדיי', to: 'גברת יום רביעי' },
  { group: 'Miss Wednesday', from: 'מיס וונסדי', to: 'גברת יום רביעי' },
  { group: 'Miss Wednesday', from: 'מיס רביעי', to: 'גברת יום רביעי' },

  { group: 'Miss Monday', from: 'מיס מאנדיי', to: 'גברת יום שני' },
  { group: 'Miss Monday', from: 'מיס מונ', to: 'גברת יום ש' }, // cut-off line
  { group: 'Miss Friday', from: 'מיס פריידיי', to: 'גברת יום שישי' },
  { group: 'Miss All Sunday', from: 'מיס אול-סאנדיי', to: 'גברת כל יום ראשון' },
  { group: 'Miss All Sunday', from: 'מיס אול סאנדיי', to: 'גברת כל יום ראשון' },

  { group: 'Miss (other agents)', from: 'מיס מרי כריסמס', to: 'גברת מרי כריסמס' },
  { group: 'Miss (other agents)', from: 'מיס דאבלפינגר', to: 'גברת דאבלפינגר' },
  { group: 'Miss (other agents)', from: 'מיס גולדן וויק', to: 'גברת גולדן וויק' },
  { group: 'Miss (other agents)', from: 'מיס גולדן ויק', to: 'גברת גולדן וויק' },
  { group: 'Miss (other agents)', from: 'מיס ולנטיין', to: 'גברת ולנטיין' },
  { group: 'Miss (other agents)', from: 'מיס יום האב', to: 'גברת יום האב' },

  { group: 'Miss + name', from: 'מיס הינה', to: 'גברת הינה' },
  { group: 'Miss + name', from: 'מיס קוקורו', to: 'גברת קוקורו' },
  { group: 'Miss + name', from: 'מיס קוניס', to: 'גברת קוניס' },
  { group: 'Miss + name', from: 'מיס נאמי', to: 'גברת נאמי' },
  { group: 'Miss + name', from: 'מיס ניווטת', to: 'גברת הנווטת' },
];

function subtitleFiles() {
  const out = execFileSync('git', ['ls-files', '-z', 'subtitles'], {
    cwd: REPO_ROOT,
    maxBuffer: 1 << 28,
  }).toString();
  return out.split('\0').filter((f) => /\.(ass|srt)$/i.test(f));
}

const totals = new Map();
const touched = new Set();
let hits = 0;

for (const rel of subtitleFiles()) {
  const abs = path.join(REPO_ROOT, rel);
  const before = fs.readFileSync(abs, 'utf8');
  let text = before;

  for (const rule of RULES) {
    let n = 0;
    if (rule.re) {
      text = text.replace(rule.re, () => { n++; return rule.to; });
    } else {
      const parts = text.split(rule.from);
      n = parts.length - 1;
      if (n) text = parts.join(rule.to);
    }
    if (n) {
      totals.set(rule.group, (totals.get(rule.group) || 0) + n);
      hits += n;
    }
  }

  if (text !== before) {
    touched.add(rel);
    if (!dryRun) fs.writeFileSync(abs, text, 'utf8');
  }
}

console.log(dryRun ? 'DRY RUN — nothing written\n' : 'Applied\n');
for (const [group, n] of [...totals].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${group}`);
}
console.log(`\n  ${hits} replacements across ${touched.size} files`);
