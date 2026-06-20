#!/usr/bin/env node
'use strict';

/**
 * lint-gender.js
 *
 * High-precision, mechanical BACKSTOP for Hebrew gender/number agreement errors
 * in the .srt files. It is intentionally NARROW: Hebrew morphology is rich and
 * full of homographs (את = "you-f" AND the accusative particle; -ה / -ת endings
 * are gendered OR root letters), so a broad checker would be noisy. This only
 * flags cases it can be confident about. The REAL gender gate is the
 * gender/number QA pass in .claude/skills/translating-one-pace-hebrew (re-read
 * each cue against the English source) — this catches a cheap subset early.
 *
 * Checks:
 *  1. A registry character NAME immediately followed by an opposite-gender past
 *     verb (e.g. "רובין אמר" — female name + masculine verb → should be אמרה).
 *  2. Singular + plural 2nd-person address mixed in one cue (אתה … אתם/אתן).
 *
 * Usage: node scripts/lint-gender.js [pathSubstr]
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const RLE = /‫/g;

// Character registry (Hebrew name → gender) — loaded from the single source of
// truth docs/characters.json (add new characters THERE, not here).
const REGISTRY = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/characters.json'), 'utf8')).characters;
const heNames = (g) => REGISTRY.filter((c) => c.gender === g).flatMap((c) => [c.he, ...(c.he_aliases || [])]);
const FEMALE = heNames('f');
const MALE = heNames('m');

// Common past-tense 3rd-person verbs, masculine vs the matching feminine.
const MASC_VERB = new Set([
  'אמר', 'עשה', 'הלך', 'בא', 'ראה', 'ידע', 'חשב', 'רצה', 'הגיע', 'נפל', 'קם',
  'ניצח', 'הפסיד', 'נלחם', 'ברח', 'צעק', 'נשאר', 'עזב', 'הביט', 'מצא', 'נתן',
  'לקח', 'שמע', 'הרג', 'מת', 'חזר', 'נכנס', 'יצא', 'אהב', 'הבין', 'הציל',
]);
const FEM_VERB = new Set([
  'אמרה', 'עשתה', 'הלכה', 'באה', 'ראתה', 'ידעה', 'חשבה', 'רצתה', 'הגיעה',
  'נפלה', 'קמה', 'ניצחה', 'הפסידה', 'נלחמה', 'ברחה', 'צעקה', 'נשארה', 'עזבה',
  'הביטה', 'מצאה', 'נתנה', 'לקחה', 'שמעה', 'הרגה', 'מתה', 'חזרה', 'נכנסה',
  'יצאה', 'אהבה', 'הבינה', 'הצילה',
]);

// Clearly-feminine 2nd/general PRESENT verbs (distinct spelling from masculine).
// "אתה <one of these>" = masc pronoun + fem verb → a gender flip. Ambiguous
// forms shared by m/f (רוצה, עושה, רואה, באה, מנסה) are deliberately excluded.
const FEM_PRESENT = new Set([
  'יודעת', 'הולכת', 'אומרת', 'חושבת', 'מבינה', 'יכולה', 'צריכה', 'מרגישה',
  'נראית', 'מדברת', 'שומעת', 'עומדת', 'יושבת', 'אוהבת', 'מנסת', 'זוכרת',
]);
// Construct/possessive words: if a NAME follows one of these (or any word
// ending in ת, the common construct marker), the verb agrees with that head
// noun, not the name — e.g. "משפחת פרנקי הצילה" (Franky's FAMILY saved, f).
const CONSTRUCT = new Set(['משפחת', 'של', 'עם', 'את', 'אנשי', 'ספינת', 'בית', 'בן', 'בת', 'אדון', 'הגברת']);
// NOTE: a sg+pl "you" check (אתה … אתם) was tried and removed — it false-fires
// on the legitimate, common pattern of addressing one person then the group
// ("זורו, גם אתה ... אתכם"). Number errors are left to the QA pass.

const filter = process.argv[2] || '';

function cues(srt) {
  return srt.split(/\r?\n\r?\n/).map((block) => {
    const lines = block.split(/\r?\n/).filter((l) => l !== '');
    const t = lines.findIndex((l) => l.includes('-->'));
    if (t === -1) return null;
    return { idx: lines[0], text: lines.slice(t + 1).map((l) => l.replace(RLE, '').trim()).join(' ') };
  }).filter(Boolean);
}

const stripPunct = (w) => w.replace(/[!?.,:;"'…״׳()-]/g, '');

function lintFile(rel) {
  const cs = cues(fs.readFileSync(path.join(REPO, rel), 'utf8'));
  const issues = [];
  cs.forEach((c, i) => {
    const toks = c.text.split(/\s+/).map(stripPunct).filter(Boolean);
    for (let j = 0; j < toks.length - 1; j++) {
      const name = toks[j];
      const next = toks[j + 1];
      // name + opposite-gender verb — skip when the name is a possessive/
      // construct modifier (prev word ends in ת or is a construct head), since
      // then the verb agrees with the head noun, not the name.
      const possessed = j > 0 && (toks[j - 1].endsWith('ת') || CONSTRUCT.has(toks[j - 1]));
      if (!possessed && FEMALE.includes(name) && MASC_VERB.has(next))
        issues.push(`#${i + 1} "${name} ${next}" — female name + masculine verb (use the feminine form)`);
      if (!possessed && MALE.includes(name) && FEM_VERB.has(next))
        issues.push(`#${i + 1} "${name} ${next}" — male name + feminine verb (use the masculine form)`);
      // "אתה" immediately followed by a feminine verb → gender flip.
      if (name === 'אתה' && FEM_PRESENT.has(next))
        issues.push(`#${i + 1} "אתה ${next}" — masculine "you" + feminine verb (gender flip)`);
    }
  });
  return issues;
}

const files = execFileSync('git', ['ls-files', 'subtitles/*he.srt'], { cwd: REPO, encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && f.includes(filter));

let bad = 0;
const summary = [];
for (const rel of files) {
  const issues = lintFile(rel);
  if (!issues.length) continue;
  bad++;
  summary.push({ rel, issues });
}
summary.sort((a, b) => b.issues.length - a.issues.length);
for (const { rel, issues } of summary) {
  console.log(`\n${rel}  — ${issues.length} issue(s)`);
  for (const it of issues.slice(0, 10)) console.log(`   - ${it}`);
  if (issues.length > 10) console.log(`   … +${issues.length - 10} more`);
}
console.log(`\n${bad}/${files.length} files flagged${filter ? ` (filter "${filter}")` : ''}.`);
