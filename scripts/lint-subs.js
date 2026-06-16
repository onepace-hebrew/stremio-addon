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

function lintFile(rel) {
  const srt = fs.readFileSync(path.join(REPO, rel), 'utf8');
  const cs = cues(srt);
  const issues = [];
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
  summary.push({ rel, n: issues.length, issues });
}

summary.sort((a, b) => b.n - a.n);
for (const { rel, n, issues } of summary) {
  console.log(`\n${rel}  — ${n} issue(s)`);
  for (const it of issues.slice(0, 8)) console.log(`   - ${it}`);
  if (issues.length > 8) console.log(`   … +${issues.length - 8} more`);
}
console.log(`\n${bad}/${files.length} files flagged${filter ? ` (filter "${filter}")` : ''}.`);
