#!/usr/bin/env node
'use strict';

/**
 * build-onepace-episode.js
 *
 * Builds a Hebrew .ass + .srt for a fedew episode that has NO existing fedew
 * Hebrew, by translating from the OFFICIAL One Pace English subtitles
 * (github.com/one-pace/one-pace-public-subtitles — the authoritative source).
 *
 * The mechanical English->Hebrew assembly lives HERE (committed + validated),
 * NOT in throwaway /tmp scripts. A dropped comma between the Effect and Text
 * fields once shipped from a /tmp copy and made every cue render blank ("holes");
 * the build now ASSERTS field structure so that can never ship silently again.
 *
 * Pipeline:
 *   1) extract <ID>  — fetch official English, write the per-cue work list
 *                      (scripts/onepace-translations/<ID>.cues.json) for translators.
 *   2) (translate)   — an agent / human produces scripts/onepace-translations/<ID>.he.json
 *                      = [{ "i": <cueIndex>, "he": "<visible Hebrew, \\N breaks, no tags/RLE>" }].
 *   3) build <ID>    — assemble subtitles/<arc>/<nn>/<stem>.{ass,srt} from the two.
 *
 * Usage:
 *   node scripts/build-onepace-episode.js extract PEN_2
 *   node scripts/build-onepace-episode.js build   PEN_2
 *   node scripts/build-onepace-episode.js build-all
 */

const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..');
const TR_DIR = path.join(__dirname, 'onepace-translations');
const EN_CACHE = '/tmp/onepace-en-official';
const OFFICIAL_REPO = 'one-pace/one-pace-public-subtitles';
const RLE = '‫';

// ID -> where it lives + how to find its official English. epLabel matches the
// official filename tail "<arc> NN [720p].ass".
const EPISODES = {
  PEN_1: { arc: '18 Post-Enies Lobby', nn: '01', stem: 'postenieslobby 01 he', epLabel: 'Post-Enies Lobby 01' },
  PEN_2: { arc: '18 Post-Enies Lobby', nn: '02', stem: 'postenieslobby 02 he', epLabel: 'Post-Enies Lobby 02' },
  PEN_3: { arc: '18 Post-Enies Lobby', nn: '03', stem: 'postenieslobby 03 he', epLabel: 'Post-Enies Lobby 03' },
  PEN_4: { arc: '18 Post-Enies Lobby', nn: '04', stem: 'postenieslobby 04 he', epLabel: 'Post-Enies Lobby 04' },
  PEN_5: { arc: '18 Post-Enies Lobby', nn: '05', stem: 'postenieslobby 05 he', epLabel: 'Post-Enies Lobby 05' },
  TB_1: { arc: '19 Thriller Bark', nn: '01', stem: 'thrillerbark 01 he', epLabel: 'Thriller Bark 01' },
  TB_2: { arc: '19 Thriller Bark', nn: '02', stem: 'thrillerbark 02 he', epLabel: 'Thriller Bark 02' },
  TB_3: { arc: '19 Thriller Bark', nn: '03', stem: 'thrillerbark 03 he', epLabel: 'Thriller Bark 03' },
  TB_4: { arc: '19 Thriller Bark', nn: '04', stem: 'thrillerbark 04 he', epLabel: 'Thriller Bark 04' },
  TB_5: { arc: '19 Thriller Bark', nn: '05', stem: 'thrillerbark 05 he', epLabel: 'Thriller Bark 05' },
  TB_6: { arc: '19 Thriller Bark', nn: '06', stem: 'thrillerbark 06 he', epLabel: 'Thriller Bark 06' },
  TB_7: { arc: '19 Thriller Bark', nn: '07', stem: 'thrillerbark 07 he', epLabel: 'Thriller Bark 07' },
  TB_8: { arc: '19 Thriller Bark', nn: '08', stem: 'thrillerbark 08 he', epLabel: 'Thriller Bark 08' },
  TB_9: { arc: '19 Thriller Bark', nn: '09', stem: 'thrillerbark 09 he', epLabel: 'Thriller Bark 09' },
  TB_10: { arc: '19 Thriller Bark', nn: '10', stem: 'thrillerbark 10 he', epLabel: 'Thriller Bark 10' },
  TB_11: { arc: '19 Thriller Bark', nn: '11', stem: 'thrillerbark 11 he', epLabel: 'Thriller Bark 11' },
  TB_12: { arc: '19 Thriller Bark', nn: '12', stem: 'thrillerbark 12 he', epLabel: 'Thriller Bark 12' },
  TB_13: { arc: '19 Thriller Bark', nn: '13', stem: 'thrillerbark 13 he', epLabel: 'Thriller Bark 13' },
  TB_14: { arc: '19 Thriller Bark', nn: '14', stem: 'thrillerbark 14 he', epLabel: 'Thriller Bark 14' },
  TB_15: { arc: '19 Thriller Bark', nn: '15', stem: 'thrillerbark 15 he', epLabel: 'Thriller Bark 15' },
  TB_16: { arc: '19 Thriller Bark', nn: '16', stem: 'thrillerbark 16 he', epLabel: 'Thriller Bark 16' },
  TB_17: { arc: '19 Thriller Bark', nn: '17', stem: 'thrillerbark 17 he', epLabel: 'Thriller Bark 17' },
};

// Events DROPPED at extract (never in cues/he.json): fansub staff credits +
// PEN's "Rainbow Star lyrics" OP (kept here for PEN index stability).
const DROP_STYLES = new Set(['Credits', 'Rainbow Star lyrics']);
// Other opening-theme karaoke styles (TB's "Jungle P lyrics" / "Lyrics") that
// WERE extracted (so indices are stable) but are skip-emitted at build — the OP
// song isn't shown. Any "...lyrics" style not already in DROP_STYLES.
const SONG_STYLE = /lyric/i;

// Font per style role (matches the human He.ass set; the Worker embeds these three).
const ROLE_FONT = {
  Main: 'Guttman Yad-Brush', Secondary: 'Guttman Yad-Brush', Flashbacks: 'Guttman Yad-Brush',
  Thoughts: 'Guttman Yad-Brush', Narrator: 'Guttman Yad-Brush', Note: 'Guttman Yad-Brush', Gold: 'Guttman Yad-Brush',
  Captions: 'Guttman Kav', 'Captions small': 'Guttman Kav', 'TS paper': 'Guttman Kav', 'Rainbow Star lyrics': 'Guttman Kav',
  Title: 'Guttman Aharoni', Credits: 'Guttman Aharoni',
};
const SIGN_FALLBACK = 'Guttman Kav';

// ---- helpers ----------------------------------------------------------------

async function ghJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'onepace-hebrew/1.0', Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

async function officialEnglish(ep) {
  fs.mkdirSync(EN_CACHE, { recursive: true });
  const cached = path.join(EN_CACHE, `${ep.epLabel}.ass`);
  if (fs.existsSync(cached) && fs.statSync(cached).size > 1000) return fs.readFileSync(cached, 'utf8');
  const treeCache = path.join(EN_CACHE, 'tree.json');
  let tree;
  if (fs.existsSync(treeCache)) tree = JSON.parse(fs.readFileSync(treeCache, 'utf8'));
  else { tree = await ghJson(`https://api.github.com/repos/${OFFICIAL_REPO}/git/trees/HEAD?recursive=1`); fs.writeFileSync(treeCache, JSON.stringify(tree)); }
  const re = new RegExp(`${ep.epLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\[\\d+p\\]\\.ass$`);
  const entry = tree.tree.find((x) => re.test(x.path));
  if (!entry) throw new Error(`no official English for "${ep.epLabel}"`);
  const blob = await ghJson(`https://api.github.com/repos/${OFFICIAL_REPO}/git/blobs/${entry.sha}`);
  const txt = Buffer.from(blob.content, blob.encoding).toString('utf8');
  fs.writeFileSync(cached, txt);
  return txt;
}

// the kept Dialogue events, in order, with a stable cue index
function keptCues(enText) {
  const out = [];
  let inEvents = false, i = 0;
  for (const line of enText.replace(/^﻿/, '').split(/\r?\n/)) {
    if (/^\[Events\]/.test(line)) { inEvents = true; continue; }
    if (/^\[/.test(line)) inEvents = false;
    if (!inEvents || !line.startsWith('Dialogue:')) continue;
    const p = line.slice('Dialogue:'.length).split(',');
    const style = p[3].trim();
    if (DROP_STYLES.has(style)) continue;
    out.push({ i: i++, style, name: p[4].trim(), start: p[1].trim(), end: p[2].trim(), prefix: p.slice(0, 9), text: p.slice(9).join(',') });
  }
  return out;
}

// keep leading {..} tag run, drop italics + \fn font overrides, drop emptied {}
function leadTags(t) {
  const m = t.match(/^(\{[^}]*\})+/);
  if (!m) return '';
  return m[0].replace(/\\i[01]/g, '').replace(/\\fn[^\\}]*/g, '').replace(/\{\}/g, '');
}
const addRle = (he) => RLE + he.replace(/\\N/g, '\\N' + RLE);

function srtTime(assT) {
  const m = assT.match(/(\d+):(\d+):(\d+)\.(\d+)/);
  if (!m) return '00:00:00,000';
  return `${String(+m[1]).padStart(2, '0')}:${m[2]}:${m[3]},${(m[4] + '00').slice(0, 2)}0`;
}

// ---- modes ------------------------------------------------------------------

async function extract(id) {
  const ep = EPISODES[id];
  if (!ep) throw new Error(`unknown id ${id}`);
  const cues = keptCues(await officialEnglish(ep)).map((c) => ({ i: c.i, style: c.style, name: c.name, text: c.text }));
  fs.mkdirSync(TR_DIR, { recursive: true });
  fs.writeFileSync(path.join(TR_DIR, `${id}.cues.json`), JSON.stringify(cues, null, 1));
  console.log(`${id}: extracted ${cues.length} cues -> scripts/onepace-translations/${id}.cues.json`);
}

async function build(id) {
  const ep = EPISODES[id];
  if (!ep) throw new Error(`unknown id ${id}`);
  const trPath = path.join(TR_DIR, `${id}.he.json`);
  if (!fs.existsSync(trPath)) throw new Error(`missing translation ${trPath} (run extract + translate first)`);
  const tr = new Map(JSON.parse(fs.readFileSync(trPath, 'utf8')).map((e) => [e.i, e.he]));

  const enText = await officialEnglish(ep);
  const cues = keptCues(enText);
  const enLines = enText.replace(/^﻿/, '').split(/\r?\n/);

  const out = [], srt = [];
  const problems = [];
  let inEvents = false, ci = 0, srtN = 0;
  for (const line of enLines) {
    if (/^\[Events\]/.test(line)) { inEvents = true; out.push(line); continue; }
    if (/^\[/.test(line)) inEvents = false;

    if (line.startsWith('Style:')) {
      const p = line.split(',');
      const name = p[0].slice('Style:'.length).trim();
      p[1] = ROLE_FONT[name] || SIGN_FALLBACK;
      if (!ROLE_FONT[name] && !SONG_STYLE.test(name)) problems.push(`unknown style "${name}" -> ${SIGN_FALLBACK}`);
      out.push(p.join(','));
      continue;
    }
    if (inEvents && line.startsWith('Comment:')) continue;
    if (inEvents && line.startsWith('Dialogue:')) {
      const p = line.slice('Dialogue:'.length).split(',');
      const style = p[3].trim();
      if (DROP_STYLES.has(style)) continue; // not indexed → no ci++
      if (SONG_STYLE.test(style)) { ci++; continue; } // OP theme: indexed but not shown
      const enField = p.slice(9).join(',');
      const he = tr.get(ci);
      if (he == null) { problems.push(`MISSING translation cue ${ci}`); ci++; continue; }
      if (he.trim() === '') { ci++; continue; } // intentionally blank -> emit nothing, never an empty event
      // CRITICAL: comma separates the 9 head fields (..,Effect) from Text.
      out.push(`Dialogue:${p.slice(0, 9).join(',')},${leadTags(enField)}${addRle(he)}`);
      srtN++;
      srt.push(`${srtN}\n${srtTime(p[1])} --> ${srtTime(p[2])}\n${he.split('\\N').map((x) => RLE + x).join('\n')}\n`);
      ci++;
      continue;
    }
    out.push(line);
  }
  if (ci !== cues.length) problems.push(`built ${ci} cues != ${cues.length} expected`);
  if (tr.size !== cues.length) problems.push(`translation has ${tr.size} entries != ${cues.length} expected`);

  const assBody = '﻿' + out.join('\n').replace(/\n*$/, '\n');
  validateAss(assBody, problems);
  if (problems.length) { throw new Error(`${id} build FAILED:\n  - ${problems.join('\n  - ')}`); }

  const dir = path.join(REPO, 'subtitles', 'fedew', ep.arc, ep.nn);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, ep.stem + '.ass'), assBody, 'utf8');
  fs.writeFileSync(path.join(dir, ep.stem + '.srt'), srt.join('\n'), 'utf8');
  console.log(`${id}: wrote ${srtN} cues -> subtitles/fedew/${ep.arc}/${ep.nn}/${ep.stem}.{ass,srt}`);
}

// Structural guard: the bug that caused the "holes". Every Dialogue line MUST
// have an EMPTY Effect field and a NON-EMPTY Text field (after tags). If the
// Hebrew ever lands in Effect again, this throws instead of shipping blanks.
function validateAss(assBody, problems) {
  let inEvents = false, n = 0;
  for (const line of assBody.split('\n')) {
    if (/^\[Events\]/.test(line)) { inEvents = true; continue; }
    if (/^\[/.test(line)) inEvents = false;
    if (!inEvents || !line.startsWith('Dialogue:')) continue;
    n++;
    const p = line.slice('Dialogue:'.length).split(',');
    const effect = p[8];
    const textVisible = p.slice(9).join(',').replace(/\{[^}]*\}/g, '').replace(/[‪-‮⁦-⁩]/g, '').trim();
    if (effect && effect.trim()) problems.push(`Dialogue #${n}: non-empty Effect field "${effect.slice(0, 20)}" (text leaked into Effect?)`);
    if (!textVisible) problems.push(`Dialogue #${n}: empty Text field`);
  }
}

// ---- main -------------------------------------------------------------------

(async () => {
  const [mode, id] = process.argv.slice(2);
  try {
    if (mode === 'extract' && id) await extract(id);
    else if (mode === 'build' && id) await build(id);
    else if (mode === 'extract-all') { for (const k of Object.keys(EPISODES)) await extract(k); }
    else if (mode === 'build-all') { for (const k of Object.keys(EPISODES)) await build(k); }
    else { console.error('usage: build-onepace-episode.js <extract|build|extract-all|build-all> [ID]'); process.exit(2); }
  } catch (e) { console.error(String(e.message || e)); process.exit(1); }
})();

module.exports = { keptCues, leadTags, validateAss, EPISODES, DROP_STYLES, ROLE_FONT };
