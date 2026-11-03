#!/usr/bin/env node
'use strict';

/**
 * fix-subs.js
 *
 * Line fixes for episodes that have NO he.json source (subtitles/main/** and
 * fedew Enies Lobby): their .srt and .ass are edited together, so the two stay
 * identical. Episodes built from scripts/onepace-translations/<ID>.he.json are
 * fixed in the he.json and rebuilt instead (build-onepace-episode.js).
 *
 *   node scripts/fix-subs.js hits <pathSubstr> [ctx]   register-lint hits, each with ±ctx cues (default 3)
 *   node scripts/fix-subs.js show <pathSubstr>         every dialogue cue of the matching episodes
 *   node scripts/fix-subs.js en <pathSubstr>           main/ only: cue, official English, Hebrew (aligned by start time)
 *   node scripts/fix-subs.js apply <fixes.json>        [{ "file": "<…he.srt>", "cue": N, "old": "…", "new": "…" }]
 *
 * Cue text uses \N for a line break. `apply` refuses a fix unless `old` still
 * matches both files, and never touches a human (" He.ass") episode.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { REGISTER } = require('./lint-subs.js');

const REPO = path.join(__dirname, '..');
const RLE = '‫';
const norm = (s) => s.replace(/‫/g, '').replace(/\{[^}]*\}/g, '').split(/\\N|\n| \/ /).map((l) => l.trim()).join('\n').trim();
const unhonor = (s) => norm(s).replace(/ ?[-־](?:סאן|קון|צ'אן|סאמה|סמה|דונו|san|kun|chan|sama|dono)(?![א-תA-Za-z])/g, '');
const git = (args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n').filter(Boolean);
const HUMAN_DIRS = new Set(git(['ls-files', 'subtitles']).filter((f) => / He\.ass$/.test(f)).map(path.dirname));
const HE_JSON_BUILT = /^subtitles\/fedew\/(18|19|20|21|22|23) /;

function readSrt(rel) {
  const raw = fs.readFileSync(path.join(REPO, rel), 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const blocks = raw.replace(/^﻿/, '').split(/\r?\n\r?\n/).map((b) => b.split(/\r?\n/));
  return { raw, eol, bom: raw.startsWith('﻿'), blocks };
}
function cues(srt) { // [{ n, time, text, block }]
  return srt.blocks.map((lines) => {
    const t = lines.findIndex((l) => l.includes('-->'));
    if (t < 1) return null;
    return { n: Number(lines[t - 1]), time: lines[t], text: lines.slice(t + 1).filter((l) => l !== '').map((l) => l.replace(/‫/g, '').trim()).join('\\N'), lines, t };
  }).filter(Boolean);
}
const cs = (srtTime) => { const [h, m, s, ms] = srtTime.trim().split(/[:,]/).map(Number); return ((h * 60 + m) * 60 + s) * 100 + Math.round(ms / 10); };
const assCs = (t) => { const [h, m, s] = t.split(':'); return (Number(h) * 60 + Number(m)) * 6000 + Math.round(Number(s) * 100); };

function episodes(substr) {
  return git(['ls-files', 'subtitles/*he.srt'])
    .filter((f) => f.includes(substr) && !HUMAN_DIRS.has(path.dirname(f)) && !HE_JSON_BUILT.test(f));
}

function list(substr, onlyHits, ctx) {
  for (const rel of episodes(substr)) {
    const cs_ = cues(readSrt(rel));
    const hits = new Map();
    cs_.forEach((c, k) => {
      const words = REGISTER.filter(([re]) => re.test(c.text.replace(/\\N/g, ' '))).map(([, w, h]) => `${w} → ${h}`);
      if (words.length) hits.set(k, words);
    });
    if (onlyHits && !hits.size) continue;
    console.log(`\n=== ${rel}`);
    const keep = new Set();
    if (onlyHits) for (const k of hits.keys()) for (let d = -ctx; d <= ctx; d++) keep.add(k + d);
    let last = -2;
    cs_.forEach((c, k) => {
      if (onlyHits && !keep.has(k)) return;
      if (onlyHits && k !== last + 1) console.log('   …');
      last = k;
      console.log(`${hits.has(k) ? '>>' : '  '} ${c.n}\t${c.text}${hits.has(k) ? `\t[${hits.get(k).join(' | ')}]` : ''}`);
    });
  }
}

function apply(fixesPath) {
  const fixes = JSON.parse(fs.readFileSync(fixesPath, 'utf8'));
  const byFile = new Map();
  for (const f of fixes) (byFile.get(f.file) || byFile.set(f.file, []).get(f.file)).push(f);
  let ok = 0;
  const failed = [];
  for (const [rel, list_] of byFile) {
    if (HUMAN_DIRS.has(path.dirname(rel)) || HE_JSON_BUILT.test(rel) || !rel.endsWith(' he.srt')) { failed.push(`${rel}: not an editable AI .srt`); continue; }
    const srt = readSrt(rel);
    const assRel = rel.replace(/\.srt$/, '.ass');
    const assRaw = fs.readFileSync(path.join(REPO, assRel), 'utf8');
    const assEol = assRaw.includes('\r\n') ? '\r\n' : '\n';
    const ass = assRaw.split(/\r?\n/);
    const byN = new Map(cues(srt).map((c) => [c.n, c]));
    for (const f of list_) {
      const c = byN.get(f.cue);
      if (!c || norm(c.text) !== norm(f.old)) { failed.push(`${rel} #${f.cue}: old text not found`); continue; }
      const newLines = norm(f.new).split('\n');
      const at = cs(c.time.split('-->')[0]);
      const hitsAss = [];
      ass.forEach((l, k) => {
        if (!l.startsWith('Dialogue:')) return;
        const p = l.split(',');
        if (Math.abs(assCs(p[1]) - at) > 1 || norm(p.slice(9).join(',')) !== norm(f.old)) return;
        hitsAss.push(k);
      });
      // Some June .ass files still carry an honorific suffix (-סאן, -kun…) that
      // their .srt dropped: match those by start time + text without it.
      if (!hitsAss.length) ass.forEach((l, k) => {
        if (!l.startsWith('Dialogue:')) return;
        const p = l.split(',');
        if (Math.abs(assCs(p[1]) - at) > 1 || /Caption|Title|Sign|Credit|Note|Song/i.test(p[3])) return;
        if (unhonor(p.slice(9).join(',')) === unhonor(f.old)) hitsAss.push(k);
      });
      // Mid-line tags: italic/bold/reset toggles are dropped (house style: no
      // italics in dialogue); whole-line ones (\an, \q, \t colour fades, colours)
      // move to the start, since a rewritten line has no "same spot"; anything
      // else (\alpha, \fax, \k, \pos…) is typesetting → refuse.
      const DROP = /^\{(?:\\(?:i[01]?|b[01]?|r|fs\d*(?:\.\d+)?)|[^\\]*)\}$/; // italic/bold/reset toggles, or a {comment} (no backslash: never rendered)
      const HOIST = /^\{(?:\\(?:an\d|q\d|fad\(\d+,\d+\)|t\([^)]*\)|[1-4]?c&H[0-9A-Fa-f]+&))+\}$/;
      const midTags = (k) => (ass[k].split(',').slice(9).join(',').replace(/^(?:\{[^}]*\})*/, '').match(/\{[^}]*\}/g) || []);
      const inline = hitsAss.some((k) => midTags(k).some((t) => !DROP.test(t) && !HOIST.test(t)));
      if (!hitsAss.length || inline) { failed.push(`${rel} #${f.cue}: ${inline ? 'inline tags in .ass' : 'no matching .ass event'}`); continue; }
      for (const k of hitsAss) {
        const p = ass[k].split(',');
        const text = p.slice(9).join(',');
        const lead = text.match(/^(?:\{[^}]*\})*/)[0] + midTags(k).filter((t) => HOIST.test(t)).join('');
        ass[k] = `${p.slice(0, 9).join(',')},${lead}${newLines.map((l) => RLE + l).join('\\N')}`;
      }
      c.lines.splice(c.t + 1, c.lines.length - c.t - 1, ...newLines.map((l) => RLE + l));
      ok++;
    }
    fs.writeFileSync(path.join(REPO, rel), (srt.bom ? '﻿' : '') + srt.blocks.map((b) => b.join(srt.eol)).join(srt.eol + srt.eol));
    fs.writeFileSync(path.join(REPO, assRel), ass.join(assEol));
  }
  console.log(`${ok} applied, ${failed.length} refused`);
  for (const f of failed) console.log(`  - ${f}`);
}

// The official English of a main/ episode sits at the same path in the One Pace
// public subtitles repo ("… he.srt" → "… en.ass"). Cached like build-onepace-episode.js.
async function en(substr) {
  for (const rel of episodes(substr).filter((f) => f.startsWith('subtitles/main/'))) {
    const pub = rel.replace(/^subtitles\//, '').replace(/ he\.srt$/, ' en.ass');
    const cache = path.join('/tmp/onepace-en-official', pub);
    if (!fs.existsSync(cache)) {
      const res = await fetch(`https://raw.githubusercontent.com/one-pace/one-pace-public-subtitles/HEAD/${encodeURI(pub)}`);
      if (!res.ok) { console.log(`\n=== ${rel}\n(no English: HTTP ${res.status})`); continue; }
      fs.mkdirSync(path.dirname(cache), { recursive: true });
      fs.writeFileSync(cache, await res.text());
    }
    const enAt = new Map();
    for (const l of fs.readFileSync(cache, 'utf8').split(/\r?\n/)) {
      if (!l.startsWith('Dialogue:')) continue;
      const p = l.split(',');
      const text = p.slice(9).join(',').replace(/\{[^}]*\}/g, '').replace(/\\N/g, ' ').trim();
      if (text) (enAt.get(assCs(p[1])) || enAt.set(assCs(p[1]), []).get(assCs(p[1]))).push(text);
    }
    console.log(`\n=== ${rel}`);
    for (const c of cues(readSrt(rel))) {
      const at = cs(c.time.split('-->')[0]);
      const e = enAt.get(at) || enAt.get(at - 1) || enAt.get(at + 1) || [];
      console.log(`${c.n}\t${[...new Set(e)].join(' | ') || '-'}\t${c.text}`);
    }
  }
}

const [cmd, arg, ctx] = process.argv.slice(2);
if (cmd === 'hits') list(arg || '', true, Number(ctx || 3));
else if (cmd === 'show') list(arg || '', false, 0);
else if (cmd === 'en') en(arg || '');
else if (cmd === 'apply') apply(arg);
else { console.error('usage: fix-subs.js hits <pathSubstr> [ctx] | show <pathSubstr> | en <pathSubstr> | apply <fixes.json>'); process.exit(1); }
