#!/usr/bin/env node
'use strict';

/**
 * lint-subs.js
 *
 * Flags MECHANICAL translation breakage in the Hebrew .srt files — the kind
 * seen in bad AI output (EL11): words split across a line break, duplicated
 * adjacent cues (e.g. the translator credit twice), dialogue left in English,
 * and over-long lines. It does NOT judge translation quality (literal vs
 * natural) — that's the translator/prompt's job; this only catches objective
 * breakage so a broken episode can't ship unnoticed.
 *
 * Usage: node scripts/lint-subs.js [pathSubstr]   (filter to matching files)
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const MAX_LINE = 48; // rendered chars/line (learnings says ~44; flag clear overflow)
const HEB = /[֐-׿]/;
const HEB_LETTER = /^[א-ת]$/;
const RLE = /‫/g;
const CREDIT = 'תרגום לעברית'; // the top-of-episode translator credit text

// Off-registry name spellings (wrong -> canonical). Keeps names consistent
// across episodes — see .claude/skills/translating-one-pace-hebrew. Matched as
// a word (optional single Hebrew prefix), not as a substring.
const NAME_VARIANTS = {
  סול: 'סאול', // Saul
  ספנדם: 'ספאנדם', // Spandam
  ספנדאם: 'ספאנדם',
  "אוקיג'י": "אאוקיג'י", // Aokiji
  לבון: 'לאבון', // Laboon — the ע/ח lookbehind in the word match keeps עלבון/חלבון out
  // 2026-11-03: main/ (June bulk) drifted from docs/characters.json
  ווייטבירד: 'זקן לבן', וייטבירד: 'זקן לבן', בלאקבירד: 'זקן שחור', ויגהפאנק: 'וגאפאנק',
  קרוקודיל: 'קרוקודייל', דוואל: 'דובאל', אבסאלום: 'אבסלום', "צ'ארלוס": "צ'רלוס",
  דאלטון: 'דלטון', טשיגי: 'טאשיגי', דרגון: 'דראגון',
};

// Terms settled against the official Hebrew (docs/translation-canon.json →
// adopted_from_upstream). Same word-match rule as the names above.
const TERM_VARIANTS = {
  לוויתן: 'לווייתן', // whale — ktiv male wants the second yod
  'לוג פוז': 'לוג-פוז', // Log Pose
  'חגורה השקטה': 'רצועה השקטה', // Calm Belt — a strip of sea, not a garment
  'חגורה שקטה': 'רצועה שקטה',
  'חגורות שקטות': 'רצועות שקטות',
  // 2026-11-03: one spelling per term, the human gold's where it has one
  'ממשלת העולם': 'הממשלה העולמית', // World Government
  'פרי שד': 'פרי שטן', // Devil Fruit
  'פירות שד': 'פירות שטן',
  'גום-גום': 'גומי-גומי', // Gum-Gum
  'סגן-אדמירל': 'סגן אדמירל', // Vice Admiral
  'בכור הים': 'אביר הים', // Knight of the Sea (Jinbe), not "firstborn"
};

// Nif'al infinitives keep their yod (Academy spelling) — see
// docs/translation-learnings.md §1.6, reversed 2026-08-29. Deliberately absent:
// להראות (hif'il "to show", a different verb), להמשך (noun), להתבשל (hitpa'el).
const NIFAL_NO_YOD = {
  להלחם: 'להילחם', להשאר: 'להישאר', להכנס: 'להיכנס', להפרד: 'להיפרד',
  להפטר: 'להיפטר', להמנע: 'להימנע', להרגע: 'להירגע', להזהר: 'להיזהר',
  להתקל: 'להיתקל', להמתח: 'להימתח', להפגע: 'להיפגע', להשמע: 'להישמע',
  להכנע: 'להיכנע', להתפס: 'להיתפס', להזכר: 'להיזכר', להאחז: 'להיאחז',
  להתקע: 'להיתקע', להכשל: 'להיכשל', להגמר: 'להיגמר', להפצע: 'להיפצע',
  להטבע: 'להיטבע', להשבע: 'להישבע', להמלט: 'להימלט', להפגש: 'להיפגש',
  להעלם: 'להיעלם', להאבק: 'להיאבק', להסחף: 'להיסחף', להנצל: 'להינצל',
  להרדם: 'להירדם', להשבר: 'להישבר', להנות: 'ליהנות',
};

// The "Miss" honorific must become גברת. It only counts when a name follows —
// that lookahead, plus the narrow prefix set, is what separates the honorific
// from the verbs that merely contain the same three letters (ממיס / להמיס
// "melt", תעמיס "burden") and from הוומיס (Homies, Whole Cake Island).
const MISS_RE = /(?<![א-ת])(?:כש|[ולש])?מיס(?=[ ־][א-ת])/;

// Register: book Hebrew the human gold almost never uses (≤0.14 per 1,000 lines)
// and that reads written in our AI files (the measured rules hit ≥80% of
// sampled lines). Warnings, not errors: a deliberately pompous speaker may keep
// one. Research 2026-11-03, reports/Natural Hebrew anime subtitles.md; owner
// rulings and the NEVER list in docs/translation-learnings.md §1.8.
const REGISTER = [
  [/(?<![א-ת])ו?האם(?![א-ת])(?=[^?]*\?)/, 'האם', 'drop it: a spoken question needs no particle'],
  [/(?<![א-ת])ו?(?:היכן|כיצד|מדוע)(?![א-ת])/, 'היכן/כיצד/מדוע', 'איפה / איך / למה'],
  [/(?<![א-ת])[ושה]?אינ(?:ני|נו|נה|ך|ו|ה|ם|ן|כם|כן)(?![א-ת])/, 'אינו', 'אני לא / הוא לא / אתה לא'],
  [/(?<![א-ת])ו?(?:הנני|הנך|הינו|הינם)(?![א-ת])/, 'הנני/הינו', 'אני / הוא'], // הינה is Hina
  [/(?<![א-ת])ו?אשר(?![א-ת])/, 'אשר', 'ש…'],
  [/(?<![א-ת])ו?אנא(?![א-ת])/, 'אנא', 'בבקשה, or drop it'],
  [/(?<![א-ת])[ומלכ]?עתה(?![א-ת])/, 'עתה', 'עכשיו / הרגע / בינתיים / מעכשיו'],
  [/(?<![א-ת])ו?כעת(?![א-ת])/, 'כעת', 'עכשיו'],
  [/(?<![א-ת])[וש]?י?יתכן(?![א-ת])/, 'ייתכן', 'יכול להיות / אין מצב'],
  [/(?:^|[,.!?…:"–-]\s*|(?<![א-ת])(?:אז|ו?לכן|כי|מה|אולי)\s+)ו?על(?:יי|י|יך|ייך|יו|יה|ינו|יכם|יכן|יהם)\s+ל(?!גבי|כן|פני|יד)[א-ת]{2,}/, 'עלינו ל…', 'צריך / חייבים / אני אמור'],
  [/(?<![א-ת])ו?אכן(?![א-ת])/, 'אכן', 'נכון / באמת / בדיוק'],
  [/(?<![א-ת])ו?כה(?![א-ת])/, 'כה', 'כל כך / עד עכשיו'],
  [/(?<![א-ת])[וש]?לומר(?![א-ת])/, 'לומר', 'להגיד'],
  [/(?<![א-ת])ו?אם כי(?![א-ת])/, 'אם כי', 'אבל / רק ש…'],
  [/(?<![א-ת])ו?אולם(?![א-ת])(?!\s+ה)(?!\s+(?:משפט|כניסה|אירועים|תצוגה))/, 'אולם', 'אבל'], // not the hall
  [/(?<![א-ת])ו?לאחר(?![א-ת])(?!\s+כך)/, 'לאחר', 'אחרי / אחר כך'], // לאחר כך = "for later", fine
  [/(?<![א-ת])ו?הי?זהר(?:ו|י)?(?![א-ת])/, 'היזהר', 'תיזהר / זהירות'],
  [/(?<![א-ת])ו?אסיר(?:ת|י|ות)?\s+תודה/, 'אסיר תודה', 'תודה / אני מודה לך / אני חייב לך'],
  [/(?<![א-ת])ו?(?:כצפוי|כמצופה)(?![א-ת])|לא ציפיתי (?:ל)?פחות|לא פחות ממה ש(?:אפשר|ניתן|הייתי|היה) (?:ל)?צפות/, 'כצפוי מ…', 'לא סתם… / אין עליך / מה ציפית? זה…'],
  [/(?<![א-ת])[וש]?צי?וו(?:ה|ית|יתי|ינו)?(?![א-ת])/, 'ציווה', 'אמר / הורה / נתן הוראה'],
  [/(?<![א-ת])[ולבה]?חרפה(?![א-ת])/, 'חרפה', 'בושה / ביזיון / מביך'],
  [/(?<![א-ת])[ולש]?(?:הכריע|הכריעה|הכריעו|להכריע)(?![א-ת])/, 'הכריע', 'להפיל / לנצח'],
  [/(?<![א-ת])ו?יתרה מזאת/, 'יתרה מזאת', 'וחוץ מזה'],
  [/ארור(?:ה|ים|ות)?\s+(?:אתה|את|אתם|אתן|שכמוך|שכמותך|שכמותכם)(?![א-ת])|^ארור(?:ה|ים|ות)?(?=[!.…,]|$)/, 'ארור אתה', 'לעזאזל איתך / יא ממזר / לעזאזל!'],
  [/(?<![א-ת])(?:שכמוך|שכמותך|שכמותכם|שכמותכן)(?![א-ת])/, 'שכמוך', 'villains only; else יא X! / חתיכת X'],
  [/(?<![א-ת])[ולה]?(?:אנשיי|אנשיו|חבריי|חבריו|ידידיי|אביך|אביו)(?![א-ת])/, 'אנשיי', "החבר'ה שלי / האנשים שלו / אבא שלך"],
  [/(?<![א-ת])[ושה]?מוצא(?:ת|ים|ות)? להורג/, 'מוצא להורג', 'הולכים להוציא את X להורג'],
  [/נגמר (?:לנו|להם|לך|לכם|לי)(?=\s*[!.?…]|$)/, 'נגמר לנו (done for)', 'הלך עלינו / אנחנו גמורים'],
  [/מחזיר(?:ה)? ימים|ימים רחוקים/, 'מחזיר ימים', 'איזה זיכרונות'],
  [/נוש(?:ם|מת|מים|מות) (?:(?:לנו|לי|לך|לכם|להם|לו|לה) )?בעורף/, 'נושם בעורף', 'נושף בעורף (the idiom) / ממש מעבר לפינה'],
  [/(?<![א-ת])כן,? אדוני(?![א-ת])/, 'כן, אדוני', 'soldiers and guards: כן, המפקד! (אדוני is for butlers and waiters)'],
  [/(?<![א-ת])תזדרז(?:י|ו)?\s+ו[א-ת]/, 'תזדרז ו…', 'drop תזדרז: תבריא כבר / צא כבר'],
  [/(?<![א-ת])אוהו?(?![א-ת])/, 'אוהו', 'הממ? / או? / מה יש לנו פה?'],
  [/(?<![א-ת])(?:עצרי|מהרי|עשי|המתיני|הקשיבי|הביטי|זכרי|הניחי|סלחי)(?![א-ת])/, 'עצרי', 'תעצרי / תמהרי / תעשי / חכי'],
];

const filter = process.argv[2] || '';

function cues(srt) {
  // SRT blocks: index / timing / text-lines...
  return srt.split(/\r?\n\r?\n/).map((block) => {
    const lines = block.split(/\r?\n/).filter((l) => l !== '');
    const t = lines.findIndex((l) => l.includes('-->'));
    if (t === -1) return null;
    return { textLines: lines.slice(t + 1).map((l) => l.replace(RLE, '').trim()) };
  }).filter(Boolean);
}

// Episode directories holding a human " He.ass". Those translations are ground
// truth and are never rewritten, so the nif'al-yod rule (which reflects OUR
// output standard, not his habit) is not enforced on them or the .srt beside
// them. See docs/translation-learnings.md §1.6.
const HUMAN_DIRS = new Set(
  execFileSync('git', ['ls-files', '-z', 'subtitles'], { cwd: REPO, maxBuffer: 1 << 28 })
    .toString().split('\0').filter((f) => / He\.ass$/.test(f))
    .map((f) => path.dirname(f))
);

function lintFile(rel) {
  const srt = fs.readFileSync(path.join(REPO, rel), 'utf8');
  const cs = cues(srt);
  const issues = [];
  const isHuman = HUMAN_DIRS.has(path.dirname(rel));
  let prevText = null;
  cs.forEach((c, i) => {
    const text = c.textLines.join(' ');
    // duplicate adjacent cue — only flag the credit or longer lines (short
    // interjections like "מה?!"/"אוסופ!" legitimately repeat in dialogue).
    if (text && text === prevText && (text.includes(CREDIT) || text.length > 12))
      issues.push(`dup cue #${i + 1}: "${text.slice(0, 30)}"`);
    prevText = text;

    c.textLines.forEach((line, li) => {
      const toks = line.split(/\s+/).filter(Boolean);
      // word split across the break: a line ending OR a non-first line starting
      // with a lone 1-letter Hebrew word (prefixes ב/ל/כ/ו/ש/ה/מ never stand alone)
      if (toks.length && HEB_LETTER.test(toks[toks.length - 1]) && li < c.textLines.length - 1)
        issues.push(`mid-word break (line ends in 1 letter) #${i + 1}: "${line}"`);
      if (li > 0 && toks.length && HEB_LETTER.test(toks[0]))
        issues.push(`mid-word break (line starts with 1 letter) #${i + 1}: "${line}"`);
      // over-long line
      if (line.length > MAX_LINE) issues.push(`long line ${line.length}c #${i + 1}: "${line.slice(0, 40)}…"`);
    });

    // dialogue left untranslated: mostly Latin, has letters, not the credit
    const letters = text.replace(/[^A-Za-zא-ת]/g, '');
    const latin = (text.match(/[A-Za-z]/g) || []).length;
    if (letters.length >= 4 && latin / letters.length > 0.6 && !text.includes(CREDIT))
      issues.push(`untranslated (Latin) #${i + 1}: "${text.slice(0, 40)}"`);

    // off-registry name spellings (word match, optional single Hebrew prefix)
    for (const [wrong, right] of Object.entries(NAME_VARIANTS)) {
      if (wrong === 'סול' && /סול קינג|-סול|סול-|הסול(?![א-ת])/.test(text)) continue; // Brook's Soul King, the note "sol"
      const re = new RegExp(`(?<![א-ת])[בהוכלמש]?${wrong}(?![א-ת])`, 'g');
      if (re.test(text)) issues.push(`name "${wrong}" → use "${right}" #${i + 1}`);
    }

    // off-canon term spellings (same word match)
    for (const [wrong, right] of Object.entries(TERM_VARIANTS)) {
      const re = new RegExp(`(?<![א-ת])[בהוכלמש]?${wrong}(?![א-ת])`, 'g');
      if (re.test(text)) issues.push(`term "${wrong}" → use "${right}" #${i + 1}`);
    }

    if (MISS_RE.test(text)) issues.push(`honorific "מיס" → use "גברת" #${i + 1}`);

    // nif'al infinitive missing its yod (one Hebrew prefix may precede)
    for (const [wrong, right] of (isHuman ? [] : Object.entries(NIFAL_NO_YOD))) {
      const re = new RegExp(`(?<![א-ת])[ושכמב]?${wrong}(?![א-ת])`, 'g');
      if (re.test(text)) issues.push(`nif'al "${wrong}" → use "${right}" #${i + 1}`);
    }

    for (const [re, word, hint] of (isHuman ? [] : REGISTER))
      if (re.test(text)) issues.push(`register "${word}" → ${hint} #${i + 1}: "${text.slice(0, 40)}"`);
  });

  // structural .ass guard: Hebrew must live in the Text field, NEVER in Effect.
  // A dropped comma between the Effect and Text fields once put every cue's
  // Hebrew into Effect, so Text was empty and the cue rendered blank ("holes").
  const assAbs = path.join(REPO, rel.replace(/\.srt$/, '.ass'));
  if (fs.existsSync(assAbs)) {
    let inEv = false, n = 0;
    for (const l of fs.readFileSync(assAbs, 'utf8').split(/\r?\n/)) {
      if (/^\[Events\]/.test(l)) { inEv = true; continue; }
      if (/^\[/.test(l)) inEv = false;
      if (!inEv || !l.startsWith('Dialogue:')) continue;
      n++;
      const parts = l.slice('Dialogue:'.length).split(',');
      if (HEB.test(parts[8] || '')) issues.push(`ASS cue #${n}: Hebrew in Effect field (text leaked out of Text — missing comma?)`);
    }
  }
  return issues;
}

module.exports = { REGISTER };
if (require.main !== module) return;

if (filter === '--test') {
  const assert = require('assert');
  const hits = (t) => REGISTER.filter(([re]) => re.test(t)).map(([, w]) => w);
  for (const [t, want] of [
    ['האם הכל מוכן?', ['האם']],
    ['האם של רובין', []],
    ['עלינו לברוח מכאן!', ['עלינו ל…']],
    ['מה עלי לעשות?', ['עלינו ל…']],
    ['תסמוך עלי לגבי זה.', []],
    ['תשאיר את זה לאחר כך!', []],
    ['לאחר מכן הלכנו.', ['לאחר']],
    ['להיזהר זה חשוב.', []],
    ['היזהר!', ['היזהר']],
    ['הם כבר נושמים לנו בעורף!', ['נושם בעורף']],
    ['נגמר לנו!', ['נגמר לנו (done for)']],
    ['נגמר לנו הזמן.', []],
    ['כן, אדוני!', ['כן, אדוני']],
    ['אבא ציווה לשמור עליו!', ['ציווה']],
    ['כצפוי מכל כוחות הצי.', ['כצפוי מ…']],
    ['ככה זה.', []],
    ['אולם המשפט', []],
    ['אולם, אני לא מסכים.', ['אולם']],
    ['הינה, את פה!', []],
    ['אני אוהב בשר!', []],
  ]) assert.deepStrictEqual(hits(t), want, t);
  console.log('register rules: ok');
  process.exit(0);
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
  summary.push({ rel, n: issues.length, issues });
}

summary.sort((a, b) => b.n - a.n);
for (const { rel, n, issues } of summary) {
  console.log(`\n${rel}  — ${n} issue(s)`);
  for (const it of issues.slice(0, 8)) console.log(`   - ${it}`);
  if (issues.length > 8) console.log(`   … +${issues.length - 8} more`);
}
console.log(`\n${bad}/${files.length} files flagged${filter ? ` (filter "${filter}")` : ''}.`);
