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
  TB_18: { arc: '19 Thriller Bark', nn: '18', stem: 'thrillerbark 18 he', epLabel: 'Thriller Bark 18' },
  TB_19: { arc: '19 Thriller Bark', nn: '19', stem: 'thrillerbark 19 he', epLabel: 'Thriller Bark 19' },
  TB_20: { arc: '19 Thriller Bark', nn: '20', stem: 'thrillerbark 20 he', epLabel: 'Thriller Bark 20' },
  TB_21: { arc: '19 Thriller Bark', nn: '21', stem: 'thrillerbark 21 he', epLabel: 'Thriller Bark 21' },
  TB_22: { arc: '19 Thriller Bark', nn: '22', stem: 'thrillerbark 22 he', epLabel: 'Thriller Bark 22' },
  SAB_1: { arc: '20 Sabaody Archipelago', nn: '01', stem: 'sabaody 01 he', epLabel: 'Sabaody Archipelago 01' },
  SAB_2: { arc: '20 Sabaody Archipelago', nn: '02', stem: 'sabaody 02 he', epLabel: 'Sabaody Archipelago 02' },
  SAB_3: { arc: '20 Sabaody Archipelago', nn: '03', stem: 'sabaody 03 he', epLabel: 'Sabaody Archipelago 03' },
  SAB_4: { arc: '20 Sabaody Archipelago', nn: '04', stem: 'sabaody 04 he', epLabel: 'Sabaody Archipelago 04' },
  SAB_5: { arc: '20 Sabaody Archipelago', nn: '05', stem: 'sabaody 05 he', epLabel: 'Sabaody Archipelago 05' },
  SAB_6: { arc: '20 Sabaody Archipelago', nn: '06', stem: 'sabaody 06 he', epLabel: 'Sabaody Archipelago 06' },
  SAB_7: { arc: '20 Sabaody Archipelago', nn: '07', stem: 'sabaody 07 he', epLabel: 'Sabaody Archipelago 07' },
  SAB_8: { arc: '20 Sabaody Archipelago', nn: '08', stem: 'sabaody 08 he', epLabel: 'Sabaody Archipelago 08' },
  SAB_9: { arc: '20 Sabaody Archipelago', nn: '09', stem: 'sabaody 09 he', epLabel: 'Sabaody Archipelago 09' },
  SAB_10: { arc: '20 Sabaody Archipelago', nn: '10', stem: 'sabaody 10 he', epLabel: 'Sabaody Archipelago 10' },
  SAB_11: { arc: '20 Sabaody Archipelago', nn: '11', stem: 'sabaody 11 he', epLabel: 'Sabaody Archipelago 11' },
  AM_1: { arc: '21 Amazon Lily', nn: '01', stem: 'amazonlily 01 he', epLabel: 'Amazon Lily 01' },
  AM_2: { arc: '21 Amazon Lily', nn: '02', stem: 'amazonlily 02 he', epLabel: 'Amazon Lily 02' },
  AM_3: { arc: '21 Amazon Lily', nn: '03', stem: 'amazonlily 03 he', epLabel: 'Amazon Lily 03' },
  AM_4: { arc: '21 Amazon Lily', nn: '04', stem: 'amazonlily 04 he', epLabel: 'Amazon Lily 04' },
  AM_5: { arc: '21 Amazon Lily', nn: '05', stem: 'amazonlily 05 he', epLabel: 'Amazon Lily 05' },
  IM_1: { arc: '22 Impel Down', nn: '01', stem: 'impeldown 01 he', epLabel: 'Impel Down 01' },
  IM_2: { arc: '22 Impel Down', nn: '02', stem: 'impeldown 02 he', epLabel: 'Impel Down 02' },
  IM_3: { arc: '22 Impel Down', nn: '03', stem: 'impeldown 03 he', epLabel: 'Impel Down 03' },
  IM_4: { arc: '22 Impel Down', nn: '04', stem: 'impeldown 04 he', epLabel: 'Impel Down 04' },
  IM_5: { arc: '22 Impel Down', nn: '05', stem: 'impeldown 05 he', epLabel: 'Impel Down 05' },
  IM_6: { arc: '22 Impel Down', nn: '06', stem: 'impeldown 06 he', epLabel: 'Impel Down 06' },
  IM_7: { arc: '22 Impel Down', nn: '07', stem: 'impeldown 07 he', epLabel: 'Impel Down 07' },
  IM_8: { arc: '22 Impel Down', nn: '08', stem: 'impeldown 08 he', epLabel: 'Impel Down 08' },
  IM_9: { arc: '22 Impel Down', nn: '09', stem: 'impeldown 09 he', epLabel: 'Impel Down 09' },
  IM_10: { arc: '22 Impel Down', nn: '10', stem: 'impeldown 10 he', epLabel: 'Impel Down 10' },
  MA_1: { arc: '23 Marineford', nn: '01', stem: 'marineford 01 he', epLabel: 'Marineford 01' },
  MA_2: { arc: '23 Marineford', nn: '02', stem: 'marineford 02 he', epLabel: 'Marineford 02' },
  MA_3: { arc: '23 Marineford', nn: '03', stem: 'marineford 03 he', epLabel: 'Marineford 03' },
  MA_4: { arc: '23 Marineford', nn: '04', stem: 'marineford 04 he', epLabel: 'Marineford 04' },
  MA_5: { arc: '23 Marineford', nn: '05', stem: 'marineford 05 he', epLabel: 'Marineford 05' },
  MA_6: { arc: '23 Marineford', nn: '06', stem: 'marineford 06 he', epLabel: 'Marineford 06' },
  MA_7: { arc: '23 Marineford', nn: '07', stem: 'marineford 07 he', epLabel: 'Marineford 07' },
  MA_8: { arc: '23 Marineford', nn: '08', stem: 'marineford 08 he', epLabel: 'Marineford 08' },
};

// Events DROPPED at extract (never in cues/he.json): fansub staff credits +
// PEN's "Rainbow Star lyrics" OP (kept here for PEN index stability).
const DROP_STYLES = new Set(['Credits', 'Rainbow Star lyrics']);
// Impel Down's OP is exploded into karaoke/kanji/translation layers — drop them
// at extract so cue indices stay dialogue-only (never in cues/he.json).
// Anchored on purpose: older "OP11 Lyrics" / "Jungle P lyrics" stay indexed
// (SKIP_STYLE hides them) so existing he.json indices do not shift.
const DROP_STYLE_RE = /^(Karaoke|Kanji|Translation)(\s|$|-)/i;
// Marineford's OP is "OP13-Karaoke" / "OP13-Kanji" / "OP13-Credits" (hyphen,
// not the anchored form above). Drop the whole OP13-* family. "OP11 Lyrics"
// uses a space, so it does not match.
const DROP_OP_LAYER = /^OP\d+-/i;
// Real spoken/sign styles. Anything else with mostly per-letter or vector
// events is an animated attack-name typeset (style "Ace", "Moria", "Luffy
// Gear Third"...). Hebrew cannot sit in a Latin per-glyph layout, and the
// flood breaks Stremio's VTT path — drop the whole style.
const DIALOGUE_STYLE = /^(Main|Thoughts|Flashbacks|Narrator|Secondary|Title|Note|Gold|Default|Italics)(-|$)|caption/i;
// Styles that WERE extracted (so indices are stable) but are skip-emitted at
// build — never shown. Opening-theme karaoke (TB "Jungle P lyrics"/"Lyrics",
// SAB "OP11 Lyrics") + fansub staff credits that aren't the exact "Credits"
// style (SAB "OP11 Credits"). Any "...lyrics"/"...credits" style.
const SKIP_STYLE = /lyric|credits/i;

// Font per style role (matches the human He.ass set; the Worker embeds these three).
const ROLE_FONT = {
  Main: 'Guttman Yad-Brush', Secondary: 'Guttman Yad-Brush', Flashbacks: 'Guttman Yad-Brush',
  Thoughts: 'Guttman Yad-Brush', Narrator: 'Guttman Yad-Brush', Note: 'Guttman Yad-Brush', Gold: 'Guttman Yad-Brush',
  Captions: 'Guttman Kav', 'Captions small': 'Guttman Kav', 'TS paper': 'Guttman Kav', 'Rainbow Star lyrics': 'Guttman Kav',
  Title: 'Guttman Aharoni', Credits: 'Guttman Aharoni', "Binks' Sake title": 'Guttman Aharoni',
};
const SIGN_FALLBACK = 'Guttman Kav';

// ---- helpers ----------------------------------------------------------------

async function ghJson(url) {
  // Anonymous API is 60 req/h; GITHUB_TOKEN=$(gh auth token) lifts it.
  const auth = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const res = await fetch(url, { headers: { 'User-Agent': 'onepace-hebrew/1.0', Accept: 'application/vnd.github+json', ...auth } });
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

function parseDialogues(enText) {
  const out = [];
  let inEvents = false;
  for (const line of enText.replace(/^﻿/, '').split(/\r?\n/)) {
    if (/^\[Events\]/.test(line)) { inEvents = true; continue; }
    if (/^\[/.test(line)) inEvents = false;
    if (!inEvents || !line.startsWith('Dialogue:')) continue;
    const p = line.slice('Dialogue:'.length).split(',');
    out.push({ style: p[3].trim(), name: p[4].trim(), start: p[1].trim(), end: p[2].trim(), prefix: p.slice(0, 9), text: p.slice(9).join(',') });
  }
  return out;
}

function isTypesetNoise(text) {
  if (/\\p[1-9]/.test(text)) return true;
  const v = text.replace(/\{[^}]*\}/g, '').replace(/\\N|\\h/g, '').trim();
  return v.length <= 3;
}

// Styles whose events are per-letter attack titles or vector drawings.
function typesetStyles(events) {
  const buckets = new Map();
  for (const e of events) {
    if (DROP_STYLES.has(e.style) || DROP_STYLE_RE.test(e.style) || DROP_OP_LAYER.test(e.style)) continue;
    if (DIALOGUE_STYLE.test(e.style) || SKIP_STYLE.test(e.style)) continue;
    if (!buckets.has(e.style)) buckets.set(e.style, []);
    buckets.get(e.style).push(e.text);
  }
  const drop = new Set();
  for (const [style, texts] of buckets) {
    if (texts.length < 8) continue;
    const noisy = texts.filter(isTypesetNoise).length;
    if (noisy / texts.length >= 0.6) drop.add(style);
  }
  return drop;
}

function isDroppedStyle(style, typeset) {
  return DROP_STYLES.has(style) || DROP_STYLE_RE.test(style) || DROP_OP_LAYER.test(style) || typeset.has(style);
}

// the kept Dialogue events, in order, with a stable cue index
function keptCues(enText) {
  const events = parseDialogues(enText);
  const typeset = typesetStyles(events);
  const out = [];
  let i = 0;
  for (const e of events) {
    if (isDroppedStyle(e.style, typeset)) continue;
    out.push({ i: i++, style: e.style, name: e.name, start: e.start, end: e.end, prefix: e.prefix, text: e.text });
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
  const typeset = typesetStyles(parseDialogues(enText));
  const enLines = enText.replace(/^﻿/, '').split(/\r?\n/);

  const out = [], srt = [];
  const problems = [];
  const warnings = [];
  let inEvents = false, ci = 0, srtN = 0;
  for (const line of enLines) {
    if (/^\[Events\]/.test(line)) { inEvents = true; out.push(line); continue; }
    if (/^\[/.test(line)) inEvents = false;

    if (line.startsWith('Style:')) {
      const p = line.split(',');
      const name = p[0].slice('Style:'.length).trim();
      p[1] = ROLE_FONT[name] || SIGN_FALLBACK;
      // Unknown style -> Guttman Kav (sign default). Non-fatal: new arcs keep
      // adding sign/caption styles (Map/Bounty/Supernova/Hentai…). Just a warning.
      if (!ROLE_FONT[name] && !SKIP_STYLE.test(name)) warnings.push(`unknown style "${name}" -> ${SIGN_FALLBACK}`);
      out.push(p.join(','));
      continue;
    }
    if (inEvents && line.startsWith('Comment:')) continue;
    if (inEvents && line.startsWith('Dialogue:')) {
      const p = line.slice('Dialogue:'.length).split(',');
      const style = p[3].trim();
      if (isDroppedStyle(style, typeset)) continue; // not indexed → no ci++
      if (SKIP_STYLE.test(style)) { ci++; continue; } // OP lyrics / fansub credits: indexed but not shown
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
  [...new Set(warnings)].forEach((w) => console.log(`  ! ${w}`));
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
