#!/usr/bin/env node
'use strict';

/**
 * check-number.js
 *
 * Cross-references a fedew Enies Lobby episode's Hebrew against the One Pace
 * English source to flag NUMBER (singular/plural) errors — the subset that's
 * mechanically catchable: the English is EXPLICITLY plural ("you guys / you all
 * / you two / both of you") but the Hebrew addressed one person (אתה, no plural
 * marker). Bare "you" (the ~92% with no in-line signal) is NOT flagged here —
 * that needs the gender/number QA pass (context window + scene). High precision.
 *
 * English is the One Pace source (JoeGeC/one-pace-subs); cached under /tmp.
 *
 * Usage:
 *   node scripts/check-number.js 14      # one episode
 *   node scripts/check-number.js all     # all 25 fedew EL episodes
 */

const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const EN_CACHE = '/tmp/onepace-en';
const REPO_EN = 'JoeGeC/one-pace-subs';

const toS = (h) => { const m = h.match(/(\d+):(\d+):(\d+)\.(\d+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 100 : null; };
const clean = (t) => t.replace(/\{[^}]*\}/g, '').replace(/\\N/g, ' ').replace(/[‪-‮‎‏⁦-⁩]/g, '').trim();
const DIAL = /^(Main|Thoughts|Narrator|Secondary|Flashbacks|Default|Italics)(-207[-+])?$/;

const PL_EN = /\byou (guys|all|two|three|lot|people)\b|\b(all|both|each) of you\b|\by'?all\b/i;
const HE_SG = /(?:^|\s)אתה(?:\s|$|[!?.,])/;
const HE_PL = /(?:^|\s)(אתם|אתן|אתכם|אתכן)(?:\s|$|[!?.,])|(?:^|\s)(תעשו|תרוצו|רוצו|לכו|בואו|קחו|תקשיבו|עצרו|חכו|תפסיקו|תזדרזו|תילחמו)(?:\s|$|[!?.,])/;

function cuesFromAss(text, enSide) {
  return text.split(/\r?\n/).filter((l) => l.startsWith('Dialogue:')).map((l) => {
    const p = l.slice(9).split(',');
    return { st: toS(p[1]), style: p[3], txt: clean(p.slice(9).join(',')) };
  }).filter((e) => e.st != null && DIAL.test(e.style) && e.txt.length > 1 && (!enSide || /[A-Za-z]/.test(e.txt)));
}

async function ghJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'onepace-hebrew-subs/1.0', Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

async function englishFor(ep) {
  const nn = String(ep).padStart(2, '0');
  const cached = path.join(EN_CACHE, `EL${ep}_en.ass`);
  if (fs.existsSync(cached) && fs.statSync(cached).size > 1000) return fs.readFileSync(cached, 'utf8');
  fs.mkdirSync(EN_CACHE, { recursive: true });
  const treeCache = '/tmp/joegec-tree.json';
  let tree;
  if (fs.existsSync(treeCache)) tree = JSON.parse(fs.readFileSync(treeCache, 'utf8'));
  else { tree = await ghJson(`https://api.github.com/repos/${REPO_EN}/git/trees/main?recursive=1`); fs.writeFileSync(treeCache, JSON.stringify(tree)); }
  const re = new RegExp(`Enies Lobby ${nn} \\[\\d+p\\]\\.ass$`);
  const entry = tree.tree.find((x) => re.test(x.path) && !/zh-TW/.test(x.path));
  if (!entry) throw new Error(`no English source for EL${ep}`);
  const blob = await ghJson(`https://api.github.com/repos/${REPO_EN}/git/blobs/${entry.sha}`);
  const txt = Buffer.from(blob.content, blob.encoding).toString('utf8');
  fs.writeFileSync(cached, txt);
  return txt;
}

async function checkEpisode(ep) {
  const nn = String(ep).padStart(2, '0');
  const hePath = path.join(REPO, `subtitles/fedew/17 Enies Lobby/${nn}/enieslobby ${nn} he.ass`);
  if (!fs.existsSync(hePath)) return { ep, skipped: 'no Hebrew file' };
  let en;
  try { en = cuesFromAss(await englishFor(ep), true); } catch (e) { return { ep, skipped: e.message }; }
  const he = cuesFromAss(fs.readFileSync(hePath, 'utf8'), false);
  // alignment guard: if the cut doesn't line up, skip (avoids bogus pairs)
  const enMax = Math.max(...en.map((e) => e.st)), heMax = Math.max(...he.map((e) => e.st));
  if (Math.abs(enMax - heMax) > 60) return { ep, skipped: `cut mismatch (EN ${(enMax / 60).toFixed(1)}m vs HE ${(heMax / 60).toFixed(1)}m)` };
  const flags = [];
  for (const h of he) {
    if (!HE_SG.test(h.txt) || HE_PL.test(h.txt)) continue;
    let best = null, bd = 1.5;
    for (const e of en) { const d = Math.abs(e.st - h.st); if (d < bd) { bd = d; best = e; } }
    if (best && PL_EN.test(best.txt)) flags.push({ st: h.st, en: best.txt, he: h.txt });
  }
  return { ep, flags };
}

(async () => {
  const arg = process.argv[2] || 'all';
  const eps = arg === 'all' ? Array.from({ length: 25 }, (_, i) => i + 1) : [Number(arg)];
  let total = 0;
  for (const ep of eps) {
    const r = await checkEpisode(ep);
    if (r.skipped) { if (arg !== 'all') console.log(`EL${ep}: skipped — ${r.skipped}`); continue; }
    if (!r.flags.length) { if (arg !== 'all') console.log(`EL${ep}: no number mismatches.`); continue; }
    total += r.flags.length;
    console.log(`\nEL${String(ep).padStart(2, '0')} — ${r.flags.length} number mismatch(es) (EN plural, HE singular):`);
    for (const f of r.flags) {
      const t = `${(f.st / 60 | 0)}:${('0' + (f.st % 60 | 0)).slice(-2)}`;
      console.log(`   ${t}  EN: ${f.en.slice(0, 50)}\n         HE: ${f.he.slice(0, 50)}`);
    }
  }
  console.log(`\n${total} total number mismatch(es)${arg === 'all' ? ' across fedew Enies Lobby' : ''}.`);
})();
