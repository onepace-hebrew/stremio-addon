#!/usr/bin/env node
// ngram-detector.js — flag Hebrew subtitle lines whose word combinations are rare/absent in real
// Hebrew subtitles (OPUS OpenSubtitles v2024 mono) or skew to written/encyclopedic Hebrew (OPUS wikimedia).
// Node >= 18, no dependencies. Research prototype (2026-11-03).
//
// Usage (WORK = any scratch dir; corpora are .txt.gz files, one sentence per line):
//   curl -o he.txt.gz https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/mono/he.txt.gz      (1.7 GB)
//   node ngram-detector.js extract <repoDir> <WORK>            # our lines (AI he.ass + human He.ass) + bad/good pairs from git
//   node --max-old-space-size=7000 ngram-detector.js count <WORK> he.txt.gz os   # ~15 min, counts only our n-grams
//   node ngram-detector.js count   <WORK> <wikimedia he.txt.gz> wiki # optional written-Hebrew corpus (register column)
//   node ngram-detector.js score   <WORK> <outDir> [--top 500] # outDir/ngram-flags.tsv + WORK/eval-summary.txt
//   node ngram-detector.js line    <WORK> "<hebrew line>"      # explain the score of one line
//   node ngram-detector.js lexicon <WORK> [hits.tsv]           # bookish-marker hits per 1000 lines per arc (+ every hit)
//   node ngram-detector.js keyness <WORK> <out.tsv> [--top 300] # words/bigrams the AI over-uses vs real subtitles
//   node ngram-detector.js nearmiss <WORK> <corpus.txt.gz> <out.tsv> [maxLines] # experimental; low precision
// Only n-grams that occur in OUR lines are counted, so memory stays bounded (~1-2 GB peak).
// Score = max over the line's bigrams/trigrams of log10((E+1)/(obs+1)) for n-grams seen <= 3 times, where E is the
// count expected from the parts (bigram: c(a)c(b)/N; trigram: c(ab)c(bc)/c(b)). Names/terms are skipped via
// docs/*.json, an automatic over-use filter and ngram-allowlist.txt (next to this script).
// Measured 2026-11-03 (see ngram-detector.md): precision@50 72%, @100 60% (my judgment); ranks 101-500 ~35%.
// Triage: fix the top ~100-200 lines (score >= ~1.6) directly; it catches a narrow class (word-salad calques and
// grammar slips with common words), ~2-15% of what a blind native review finds, so it does NOT replace that review.
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

// ---------------------------------------------------------------- tokenizer
const SPELL = { // house spellings vs common variants -> one key, applied to BOTH corpora
  'הכול': 'הכל', 'האלה': 'האלו', 'כאלה': 'כאלו', 'מידי': 'מדי', 'דיי': 'די', 'עליי': 'עלי', 'אליי': 'אלי',
  'אוקיינוס': 'אוקינוס', 'מיליון': 'מליון', 'מיליוני': 'מליוני', 'וואו': 'וואו', 'ואו': 'וואו',
};
const PREF = /^[ושהבכלמ]{0,3}$/;
const canonCache = new Map();
function canon(t) {
  let c = canonCache.get(t);
  if (c !== undefined) return c;
  c = t;
  for (const k in SPELL) {
    if (t.length >= k.length && t.endsWith(k) && PREF.test(t.slice(0, t.length - k.length))) { c = t.slice(0, t.length - k.length) + SPELL[k]; break; }
  }
  if (canonCache.size < 2e6) canonCache.set(t, c);
  return c;
}
function normalize(s) {
  return s
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\\[Nn]/g, ' / ').replace(/\\h/g, ' ')        // ASS line break = soft boundary (see SOFT)
    .replace(/[־׀׃]/g, ' ')            // maqaf, paseq, sof pasuq -> space
    .replace(/[֑-ׇ]/g, '')                 // nikud + cantillation
    .replace(/[​-‏‪-‮⁦-⁩؜﻿]/g, '') // direction marks
    .replace(/[׳‘’`´]/g, "'")
    .replace(/[״“”„]/g, '"');
}
const SEG = /[.!?…;:¶]+|(?:^|\s)[-–—]+(?=\s|[א-ת])|\s[-–—]+$/;
const TOK = /[א-תa-zA-Z0-9]+(?:['"][א-תa-zA-Z0-9]+)*(?:(?<=[גזצתץ])')?/g;
// returns array of sentences, each an array of canonical tokens
const TOK_COMPOUND = /[\u05D0-\u05EAa-zA-Z0-9]+(?:['"\-][\u05D0-\u05EAa-zA-Z0-9]+)*(?:(?<=[גזצתץ])')?/g;
function toksOf(seg, compounds = false) { // compounds: keep בל-מר / כפוי-טובה / מ-מה as one (rare -> skipped) token
  const m = seg.match(compounds ? TOK_COMPOUND : TOK);
  if (!m) return [];
  return m.map(t => /^[0-9]+$/.test(t) ? '#' : canon(/[a-zA-Z]/.test(t) ? t.toLowerCase() : t));
}
// returns array of sentences (hard boundaries . ! ? … ; : \N-dash), each an array of canonical tokens.
// sentences(text, true) returns each sentence as an array of chunks split at soft boundaries
// (comma, line break " / ", dash, free-standing quote) — used for scoring, never for counting.
const SOFT = /,|\s\/\s|\s[-–—]+\s|[–—]|(?:^|\s)"|"(?=\s|$)/;
function sentences(text, soft = false) {
  const out = [];
  for (const seg of normalize(text).split(SEG)) {
    if (!seg) continue;
    if (!soft) { const t = toksOf(seg); if (t.length) out.push(t); continue; }
    const chunks = seg.split(SOFT).map(x => toksOf(x, true)).filter(t => t.length);
    if (chunks.length) out.push(chunks);
  }
  return out;
}
const BOS = '<s>', EOS = '</s>';

// ---------------------------------------------------------------- extract
const DLG_SKIP = /Caption|Title|Credit|Warning|Sign|Song|Karaoke|Note|^OP|^ED/i;
const DLG_KEEP = /^(Main|Flashback|Thought|Secondary|Narrator|Finale|Family Main)/i; // drops lyrics, ED, SFX/attack-name styles
function assDialogue(src) {
  const rows = []; let n = 0; const lines = src.split(/\r?\n/);
  for (let ln = 0; ln < lines.length; ln++) {
    const l = lines[ln];
    if (!l.startsWith('Dialogue:')) continue;
    const p = l.split(',');
    if (DLG_SKIP.test(p[3]) || !DLG_KEEP.test(p[3])) continue;
    const text = p.slice(9).join(',').replace(/\{[^}]*\}/g, '').replace(/‫/g, '').replace(/\\N/g, ' / ');
    rows.push({ assLine: ln + 1, idx: n++, text });
  }
  return rows;
}
function git(repo, args) { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 }); }
function cmdExtract(repo, work) {
  fs.mkdirSync(work, { recursive: true });
  const files = git(repo, ['ls-files']).split('\n').filter(f => /^subtitles\/.* he\.ass$/i.test(f));
  const ours = [];
  for (const f of files) {
    const kind = / He\.ass$/.test(f) ? 'human' : 'ai';
    for (const r of assDialogue(git(repo, ['show', 'HEAD:' + f]))) ours.push({ file: f, kind, ...r });
  }
  // an AI-named file whose lines are mostly copies of a human file = human port (fedew EL04) -> not AI
  const humanSet = new Set(ours.filter(x => x.kind === 'human').map(x => x.text.trim()));
  for (const f of new Set(ours.filter(x => x.kind === 'ai').map(x => x.file))) {
    const r = ours.filter(x => x.file === f);
    if (r.filter(x => humanSet.has(x.text.trim())).length > 0.5 * r.length) r.forEach(x => { x.kind = 'human-port'; });
  }
  // the original AI translation of Enies Lobby 04 (before it was replaced by the human port) = matched AI-vs-human episode
  try {
    for (const r of assDialogue(git(repo, ['show', 'cf2521b:subtitles/fedew/17 Enies Lobby/04/enieslobby 04 he.ass']))) ours.push({ file: 'cf2521b:enieslobby 04 he.ass', kind: 'ai-el04', ...r });
  } catch (e) { console.error('no cf2521b EL04: ' + e.message); }
  // known bad -> good pairs
  const pairs = [];
  const dir = 'scripts/onepace-translations';
  for (const f of git(repo, ['ls-files', dir]).split('\n').filter(f => f.endsWith('.rewrite-log.txt'))) {
    for (const l of fs.readFileSync(path.join(repo, f), 'utf8').split('\n')) {
      const p = l.split(' | ');
      if (p.length === 5 && /^\d+$/.test(p[0]) && p[4].trim() !== 'you_or_attack')
        pairs.push({ src: path.basename(f) + ':' + p[0], tag: p[4].trim(), bad: p[2].replace(/\\N/g, ' / '), good: p[3].replace(/\\N/g, ' / ') });
    }
  }
  for (const c of ['f42f8b0', 'a04d2aa']) {
    for (const f of git(repo, ['show', '--name-only', '--format=', c]).split('\n').filter(f => f.endsWith('.he.json'))) {
      const a = JSON.parse(git(repo, ['show', c + '^:' + f])), b = JSON.parse(git(repo, ['show', c + ':' + f]));
      const bi = new Map(b.map(x => [x.i, x.he]));
      for (const x of a) { const y = bi.get(x.i); if (y !== undefined && y !== x.he) pairs.push({ src: c + ':' + path.basename(f) + ':' + x.i, tag: 'native-review', bad: x.he.replace(/\\N/g, ' / '), good: y.replace(/\\N/g, ' / ') }); }
    }
  }
  for (const f of git(repo, ['show', '--name-only', '--format=', '17200fb']).split('\n').filter(f => f.endsWith('he.ass'))) {
    const a = assDialogue(git(repo, ['show', '17200fb^:' + f])), b = assDialogue(git(repo, ['show', '17200fb:' + f]));
    if (a.length !== b.length) continue;
    a.forEach((x, i) => { if (x.text !== b[i].text) pairs.push({ src: '17200fb:' + path.basename(f) + ':' + i, tag: 'quality-pass', bad: x.text, good: b[i].text }); });
  }
  // term tokens (names, invented One Piece terms) from the repo registries
  const terms = new Set();
  for (const f of ['docs/characters.json', 'docs/translation-glossary.json', 'docs/translation-canon.json']) {
    (function walk(x, k) {
      if (typeof x === 'string') { if (/^(he|he_aliases|human|ai)$/.test(k)) for (const s of sentences(x)) s.forEach(t => terms.add(t)); }
      else if (Array.isArray(x)) x.forEach(y => walk(y, k));
      else if (x && typeof x === 'object') for (const [kk, v] of Object.entries(x)) walk(v, kk);
    })(JSON.parse(fs.readFileSync(path.join(repo, f), 'utf8')), '');
  }
  const same = p => JSON.stringify(sentences(p.bad)) === JSON.stringify(sentences(p.good));
  const pairsKept = pairs.filter(p => !same(p)); pairs.length = 0; pairs.push(...pairsKept);
  fs.writeFileSync(path.join(work, 'ours.json'), JSON.stringify(ours));
  fs.writeFileSync(path.join(work, 'pairs.json'), JSON.stringify(pairs, null, 0));
  fs.writeFileSync(path.join(work, 'terms.json'), JSON.stringify([...terms]));
  const kinds = {}; ours.forEach(x => { kinds[x.kind] = (kinds[x.kind] || 0) + 1; });
  console.log(`files ${files.length}, lines ${JSON.stringify(kinds)}, pairs ${pairs.length}, term tokens ${terms.size}`);
}

// ---------------------------------------------------------------- count
function ngramsOf(toks) { // toks already with BOS/EOS
  const g = [];
  for (let i = 0; i < toks.length; i++) {
    g.push(toks[i]);
    if (i + 1 < toks.length) g.push(toks[i] + ' ' + toks[i + 1]);
    if (i + 2 < toks.length) g.push(toks[i] + ' ' + toks[i + 1] + ' ' + toks[i + 2]);
  }
  return g;
}
function targetLines(work) {
  const ours = JSON.parse(fs.readFileSync(path.join(work, 'ours.json'), 'utf8'));
  const pairs = JSON.parse(fs.readFileSync(path.join(work, 'pairs.json'), 'utf8'));
  return ours.map(x => x.text).concat(pairs.map(p => p.bad), pairs.map(p => p.good));
}
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
const K = 64; // KMV sketch size for distinct-neighbour counts
function kmvAdd(arr, h) { // arr: Uint32Array(K+1), arr[K] = fill count; keeps K smallest distinct hashes sorted asc
  let n = arr[K];
  if (n === K && h >= arr[K - 1]) return;
  // binary search
  let lo = 0, hi = n;
  while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < h) lo = m + 1; else hi = m; }
  if (lo < n && arr[lo] === h) return;
  const end = n === K ? K - 1 : n;
  for (let j = end; j > lo; j--) arr[j] = arr[j - 1];
  arr[lo] = h; if (n < K) arr[K] = n + 1;
}
function kmvEst(arr) { const n = arr[K]; if (n < K) return n; return Math.round((K - 1) / (arr[K - 1] / 4294967296)); }

async function cmdCount(work, corpus, name, maxLines) {
  const tgt = new Map(); // ngram -> count
  for (const t of targetLines(work)) for (const s of sentences(t)) for (const g of ngramsOf([BOS, ...s, EOS])) tgt.set(g, 0);
  const vocab = [...tgt.keys()].filter(k => !k.includes(' '));
  const right = new Map(vocab.map(w => [w, new Uint32Array(K + 1)])), left = new Map(vocab.map(w => [w, new Uint32Array(K + 1)]));
  console.error(`targets ${tgt.size}, vocab ${vocab.length}`);
  let N = 0, nLines = 0, nSent = 0, nDup = 0; const t0 = Date.now();
  // exact-duplicate filter for long lines (re-uploaded subtitle files): 2-hash Bloom filter, 2^32 bits
  const bloom = new Uint8Array(1 << 29);
  const h2 = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0; return h; };
  const seenBefore = line => { const a = fnv(line), b = h2(line); const ia = a >>> 3, ib = b >>> 3, ma = 1 << (a & 7), mb = 1 << (b & 7); const hit = (bloom[ia] & ma) && (bloom[ib] & mb); bloom[ia] |= ma; bloom[ib] |= mb; return !!hit; };
  const stream = fs.createReadStream(corpus).pipe(zlib.createGunzip());
  stream.setEncoding('utf8');
  let buf = '';
  const doLine = (line) => {
    nLines++;
    const ss = sentences(line);
    if (ss.reduce((n, s) => n + s.length, 0) >= 6 && seenBefore(ss.map(s => s.join(' ')).join('|'))) { nDup++; return; }
    for (const s of ss) {
      nSent++;
      const toks = [BOS, ...s, EOS];
      N += s.length;
      for (let i = 0; i < toks.length; i++) {
        const a = toks[i];
        const ca = tgt.get(a);
        if (i + 1 < toks.length) { // neighbour sketches
          const b = toks[i + 1];
          const ra = right.get(a); if (ra) kmvAdd(ra, fnv(b));
          const lb = left.get(b); if (lb) kmvAdd(lb, fnv(a));
        }
        if (ca === undefined) continue;
        tgt.set(a, ca + 1);
        if (i + 1 >= toks.length) continue;
        const ab = a + ' ' + toks[i + 1];
        const cab = tgt.get(ab);
        if (cab === undefined) continue;
        tgt.set(ab, cab + 1);
        if (i + 2 >= toks.length) continue;
        const abc = ab + ' ' + toks[i + 2];
        const cabc = tgt.get(abc);
        if (cabc !== undefined) tgt.set(abc, cabc + 1);
      }
    }
  };
  outer: for await (const chunk of stream) {
    buf += chunk;
    let i, start = 0;
    while ((i = buf.indexOf('\n', start)) !== -1) {
      doLine(buf.slice(start, i)); start = i + 1;
      if (maxLines && nLines >= maxLines) break outer;
      if (nLines % 5e6 === 0) console.error(`${name}: ${nLines / 1e6}M lines, ${(N / 1e6).toFixed(0)}M tokens, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    buf = buf.slice(start);
  }
  if (buf && !(maxLines && nLines >= maxLines)) doLine(buf);
  const counts = {}; for (const [k, v] of tgt) if (v) counts[k] = v;
  const R = {}, L = {}; for (const w of vocab) { const r = kmvEst(right.get(w)), l = kmvEst(left.get(w)); if (r) R[w] = r; if (l) L[w] = l; }
  fs.writeFileSync(path.join(work, `counts-${name}.json`), JSON.stringify({ name, corpus, N, nLines, nSent, nDup, counts, R, L }));
  console.error(`${name}: done, ${nLines} lines (${nDup} long duplicates skipped), ${nSent} sentences, ${N} tokens, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// ---------------------------------------------------------------- score
const CFG = {
  minUni: 30,        // a token rarer than this in OS = name / invented term / typo -> n-grams with it are skipped
  termMaxUni: 5000,  // registry term tokens are skipped unless they are common Hebrew words (e.g. הצי)
  maxObs: 3,         // an n-gram is only suspicious if seen <= maxObs times
  nameRatio: 100,    // AI uses the token >= 100x more often than OpenSubtitles -> treat as a name/term
};
// formatting bugs worth fixing anyway: a word split across the ASS line break, text that starts with ! ? . (reversed RTL line)
function formatIssues(text, c) {
  const out = [];
  if (/^[\s\u202B\u200F]*[!?.,]+[\s]*[\u05D0-\u05EA]/.test(text) && !/^[\s\u202B\u200F]*\.\.\./.test(text)) out.push('reversed?');
  const m = normalize(text).split(/\s\/\s/);
  for (let i = 0; i + 1 < m.length; i++) {
    const a = (m[i].match(/[\u05D0-\u05EA]+$/) || [''])[0], b = (m[i + 1].match(/^[\u05D0-\u05EA]+/) || [''])[0];
    if (a && b && c(b) < 30 && c(a + b) >= 100) out.push('split:' + a + '|' + b);
  }
  return out.join(' ');
}
function endsSentence(text) { const t = text.replace(/\\N|[\s\u202B\u200F"'»]+$/g, ''); return /[.!?]$/.test(t) && !/(\.\.\.|…)$/.test(t); }
const CURRENCY_BEFORE = /^(#|[וה]{0,2}(מליון|מליוני|מליארד|אלף|אלפים|מאות|מאה|עשרה|עשר|חמישים|שלושים|מליונים))$/; // בלי = Beli (One Piece currency)
const HOUSE_SKIP = new Set(['ווי', 'ושווי', 'שווי']); // Ivankov's ווי (= אני) is a house convention
function loadCounts(work, name) { const f = path.join(work, `counts-${name}.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; }
function makeScorer(work) {
  const os = loadCounts(work, 'os'), wiki = loadCounts(work, 'wiki');
  const terms = new Set(JSON.parse(fs.readFileSync(path.join(work, 'terms.json'), 'utf8')));
  const C = os.counts, N = os.N;
  const c = g => C[g] || 0;
  const isTerm = t => { if (terms.has(t)) return true; for (let k = 1; k <= 3 && k < t.length - 1; k++) { if (!PREF.test(t.slice(0, k))) break; if (terms.has(t.slice(k))) return true; } return false; };
  // auto name/term filter: a token our AI uses >= CFG.nameRatio times more often than real subtitles do (לופי, אורוצ'י...)
  const auto = new Set();
  const oursFile = path.join(work, 'ours.json');
  if (fs.existsSync(oursFile)) {
    const tf = new Map(); let T = 0;
    for (const r of JSON.parse(fs.readFileSync(oursFile, 'utf8'))) if (r.kind === 'ai') for (const s of sentences(r.text)) for (const t of s) { T++; tf.set(t, (tf.get(t) || 0) + 1); }
    for (const [t, n] of tf) if (n >= 5 && (n / T) / ((c(t) + 1) / N) >= CFG.nameRatio) auto.add(t);
  }
  // allowlist: one token or n-gram per line (# comments) — names the registries miss (ואנו = Wano), accepted phrases
  const allow = new Set();
  for (const f of [path.join(__dirname, 'ngram-allowlist.txt'), process.env.NGRAM_ALLOW || ''].filter(f => f && fs.existsSync(f)))
    for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const x = l.replace(/#.*/, '').trim(); if (x) allow.add(sentences(x).flat().join(' ')); }
  const skip = t => t !== BOS && t !== EOS && (c(t) < CFG.minUni || (isTerm(t) && c(t) < CFG.termMaxUni) || t === '#' || /[a-z]/.test(t) || auto.has(t) || allow.has(t));
  // opts.bos: this cue starts a sentence (previous cue ended with . ! ?); EOS is added only if this cue ends one.
  function scoreLine(text, opts = { bos: true }) {
    const res = { score: 0, worst: '', obs: 0, exp: 0, ngKind: '', unseen: 0, nb: 0, reg: 0, regWorst: '', oov: [], finds: [] };
    text = text.replace(/([0-9]|מליון|מליארד|אלף|אלפים)([\s\u200F\u202B,]|\\N|\/)*בלי/g, '$1 beli'); // בלי = Beli (currency)
    res.format = formatIssues(text, c);
    const sents = sentences(text, true), endsTerm = endsSentence(text);
    // SLOR (Pauls & Klein 2012; Lau, Clark & Lappin 2017): (log P_lm - log P_unigram) / length, with a stupid-backoff
    // trigram LM (Brants et al. 2007) over the reference counts; computed on hard sentences, names/terms excluded.
    let lmSum = 0, lmN = 0, minLocal = 0, minLocalAt = '';
    const hard = sentences(text);
    hard.forEach((s, k) => {
      const toks = [...(k > 0 || opts.bos ? [BOS] : []), ...s, ...(k < hard.length - 1 || endsTerm ? [EOS] : [])];
      const sk = toks.map((t, i) => t !== BOS && t !== EOS && (skip(t) || (t === 'בלי' && i > 0 && CURRENCY_BEFORE.test(toks[i - 1])) || HOUSE_SKIP.has(t)));
      const cu = t => (t === BOS || t === EOS) ? os.nSent : c(t);
      for (let i = 0; i < toks.length; i++) {
        const w = toks[i];
        if (w === BOS || sk[i]) continue;
        const pu = cu(w) / N;
        let p;
        const v = i > 0 && !sk[i - 1] ? toks[i - 1] : null, u = v && i > 1 && !sk[i - 2] ? toks[i - 2] : null;
        const c3 = u ? c(u + ' ' + v + ' ' + w) : 0, c2 = v ? c(v + ' ' + w) : 0;
        if (c3 > 0) p = c3 / c(u + ' ' + v);
        else if (c2 > 0) p = (u ? 0.4 : 1) * c2 / cu(v);
        else p = (u ? 0.16 : v ? 0.4 : 1) * pu;
        const local = Math.log10(p) - Math.log10(pu);
        lmSum += local; lmN++;
        if (local < minLocal) { minLocal = local; minLocalAt = (u ? u + ' ' : '') + (v ? v + ' ' : '') + w; }
      }
    });
    res.slor = lmN ? lmSum / lmN : 0; res.minLocal = minLocal; res.minLocalAt = minLocalAt;
    sents.forEach((chunks, k) => {
      chunks.forEach((chunk, j) => {
        const first = j === 0 && (k > 0 || opts.bos), last = j === chunks.length - 1 && (k < sents.length - 1 || endsTerm);
        const toks = [...(first ? [BOS] : []), ...chunk, ...(last ? [EOS] : [])];
        const sk = toks.map((t, i) => skip(t) || (t === 'בלי' && i > 0 && CURRENCY_BEFORE.test(toks[i - 1])) || HOUSE_SKIP.has(t));
        for (const t of chunk) if (c(t) < CFG.minUni && !isTerm(t) && t !== '#' && !/[a-z]/.test(t)) res.oov.push(t);
        for (let i = 0; i + 1 < toks.length; i++) {
          const a = toks[i], b = toks[i + 1];
          if (sk[i] || sk[i + 1]) continue;
          if (a === BOS && b === EOS) continue;
          const ab = a + ' ' + b, cab = c(ab);
          const ca = a === BOS ? os.nSent : c(a), cb = b === EOS ? os.nSent : c(b);
          res.nb++; if (cab === 0) res.unseen++;
          // bigram: observed vs independence expectation c(a)c(b)/N
          consider(res, ab, cab, ca * cb / N, a === BOS ? 'bos' : b === EOS ? 'eos' : 'bi');
          // trigram: observed vs Markov expectation c(ab)c(bd)/c(b)
          if (i + 2 < toks.length && !sk[i + 2] && b !== EOS) {
            const d = toks[i + 2], bd = b + ' ' + d, cbd = c(bd), abd = ab + ' ' + d, cabd = c(abd);
            if (cab > 0 && cbd > 0) consider(res, abd, cabd, cab * cbd / Math.max(cb, 1), 'tri');
          }
          // register: frequent in written Hebrew (wikimedia), rare in subtitles
          if (wiki && a !== BOS && b !== EOS) {
            const fw = (wiki.counts[ab] || 0) / wiki.N * 1e6, fo = cab / N * 1e6;
            const r = Math.log10((fw + 0.05) / (fo + 0.05));
            if (r > res.reg) { res.reg = r; res.regWorst = ab; }
          }
        }
        if (wiki) chunk.forEach((t, i) => {
          if (sk[i + (first ? 1 : 0)]) return;
          const fw = (wiki.counts[t] || 0) / wiki.N * 1e6, fo = c(t) / N * 1e6;
          const r = Math.log10((fw + 0.5) / (fo + 0.5));
          if (r > res.reg) { res.reg = r; res.regWorst = t; }
        });
      });
    });
    return res;
  }
  function consider(res, g, obs, E, kind) {
    if (obs > CFG.maxObs || allow.has(g)) return;
    const s = Math.log10((E + 1) / (obs + 1));
    res.finds.push({ g, obs, E: +E.toFixed(2), s: +s.toFixed(3), kind });
    if (s > res.score) { res.score = s; res.worst = g; res.obs = obs; res.exp = E; res.ngKind = kind; }
  }
  return { scoreLine, c, os, wiki, skip, isTerm, auto, allow };
}

function cmdLine(work, text) {
  const sc = makeScorer(work);
  console.log(JSON.stringify(sc.scoreLine(text)));
  for (const s of sentences(text)) {
    const toks = [BOS, ...s, EOS]; // (diagnostic view ignores soft boundaries)
    for (let i = 0; i < toks.length; i++) {
      const w = toks[i];
      const row = [w, sc.c(w), sc.skip(w) ? 'SKIP' : ''];
      if (i + 1 < toks.length) row.push(w + ' ' + toks[i + 1], sc.c(w + ' ' + toks[i + 1]));
      if (i + 2 < toks.length) row.push(sc.c(w + ' ' + toks[i + 1] + ' ' + toks[i + 2]));
      console.log(row.join('\t'));
    }
  }
}

function cmdScore(work, outDir, top) {
  const sc = makeScorer(work);
  const ours = JSON.parse(fs.readFileSync(path.join(work, 'ours.json'), 'utf8'));
  const pairs = JSON.parse(fs.readFileSync(path.join(work, 'pairs.json'), 'utf8'));
  const rows = ours.map((x, i) => ({ ...x, ...sc.scoreLine(x.text, { bos: i === 0 || ours[i - 1].file !== x.file || endsSentence(ours[i - 1].text) }) }));
  const lines = [];
  const stat = (arr, f) => arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0;
  for (const kind of ['ai', 'human', 'ai-el04', 'human-port']) {
    const r = rows.filter(x => x.kind === kind && x.nb > 0);
    lines.push(`${kind}: lines ${r.length}, mean score ${stat(r, x => x.score).toFixed(3)}, unseen-bigram rate ${(r.reduce((s, x) => s + x.unseen, 0) / r.reduce((s, x) => s + x.nb, 0)).toFixed(4)}, ` +
      [0.5, 1, 1.5, 2].map(t => `>=${t}: ${(100 * r.filter(x => x.score >= t).length / r.length).toFixed(2)}%`).join(', ') +
      (sc.wiki ? `, reg>=1: ${(100 * r.filter(x => x.reg >= 1).length / r.length).toFixed(2)}%` : '') + `, mean SLOR ${stat(r, x => x.slor).toFixed(3)}`);
  }
  const pr = [], cmp = { score: [0, 0, 0], slor: [0, 0, 0] };
  const sp = pairs.map(p => ({ p, a: sc.scoreLine(p.bad), b: sc.scoreLine(p.good) }));
  for (const { p, a, b } of sp) {
    cmp.score[a.score > b.score ? 0 : a.score === b.score ? 1 : 2]++;
    cmp.slor[a.slor < b.slor - 1e-9 ? 0 : Math.abs(a.slor - b.slor) <= 1e-9 ? 1 : 2]++;
    pr.push([p.src, p.tag, a.score.toFixed(2), b.score.toFixed(2), a.slor.toFixed(2), b.slor.toFixed(2), a.worst, b.worst, p.bad, p.good].join('\t'));
  }
  lines.push(`pairs ${pairs.length}: anti-collocation score bad>good ${cmp.score[0]}, tie ${cmp.score[1]}, bad<good ${cmp.score[2]}; SLOR bad<good ${cmp.slor[0]}, tie ${cmp.slor[1]}, bad>good ${cmp.slor[2]}`);
  for (const t of [0.5, 1, 1.5, 2]) lines.push(`  score>=${t}: bad flagged ${sp.filter(x => x.a.score >= t).length}/${pairs.length}, good flagged ${sp.filter(x => x.b.score >= t).length}/${pairs.length}`);
  fs.writeFileSync(path.join(work, 'pairs-scored.tsv'), pr.join('\n') + '\n');
  const ai = rows.filter(x => x.kind === 'ai').sort((a, b) => b.score - a.score);
  const seen = new Set(); const out = ['file\tass_line\tdlg_idx\tscore\tworst_ngram\tobs\texpected\tkind\tslor\tmin_local\treg\treg_worst\tformat\ttext'];
  for (const r of ai) {
    if (out.length > top) break;
    out.push([r.file, r.assLine, r.idx, r.score.toFixed(2), r.worst, r.obs, r.exp.toFixed(1), r.ngKind, r.slor.toFixed(2), r.minLocal.toFixed(2), r.reg.toFixed(2), r.regWorst, r.format, r.text].join('\t'));
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'ngram-flags.tsv'), out.join('\n') + '\n');
  fs.writeFileSync(path.join(work, 'all-scored.json'), JSON.stringify(rows));
  fs.writeFileSync(path.join(work, 'eval-summary.txt'), lines.join('\n') + '\n');
  console.log(lines.join('\n'));
}

// ---------------------------------------------------------------- keyness
// Words/bigrams our AI uses far more often than real Hebrew subtitles do ("pet phrases"), by log-likelihood G2
// (Dunning 1993 / Rayson & Garside 2000). Names and invented terms are filtered; an item must occur in >= 3 episodes.
function cmdKeyness(work, outFile, top) {
  const sc = makeScorer(work);
  const ours = JSON.parse(fs.readFileSync(path.join(work, 'ours.json'), 'utf8'));
  const cnt = { ai: new Map(), human: new Map() }, tot = { ai: 0, human: 0 }, eps = new Map();
  for (const r of ours) {
    if (r.kind !== 'ai' && r.kind !== 'human') continue;
    for (const s of sentences(r.text)) {
      tot[r.kind] += s.length;
      for (let i = 0; i < s.length; i++) {
        const gs = [s[i]]; if (i + 1 < s.length) gs.push(s[i] + ' ' + s[i + 1]);
        for (const g of gs) {
          if (g.split(' ').some(t => sc.skip(t) || HOUSE_SKIP.has(t))) continue;
          cnt[r.kind].set(g, (cnt[r.kind].get(g) || 0) + 1);
          if (r.kind === 'ai') { let e = eps.get(g); if (!e) eps.set(g, e = new Set()); e.add(r.file); }
        }
      }
    }
  }
  const N = sc.os.N, out = [];
  for (const [g, a] of cnt.ai) {
    if (a < 5 || eps.get(g).size < 3) continue;
    const parts = g.split(' ');
    if (parts.some(t => t.length < 2 || /['"]/.test(t))) continue;                 // stutters (מ-מה), clipped words
    if (parts.length === 2 && parts[1].startsWith(parts[0])) continue;             // stutter bigram
    if (/תרגום|לעברית|כתוביות/.test(g)) continue;                                   // credit lines
    const b = sc.c(g), c = tot.ai, d = N;
    const E1 = c * (a + b) / (c + d), E2 = d * (a + b) / (c + d);
    const G2 = 2 * (a * Math.log(a / E1) + (b ? b * Math.log(b / E2) : 0));
    const lr = Math.log2(((a + 0.5) / c) / ((b + 0.5) / d));
    if (lr <= 1) continue; // at least 2x over-used vs real subtitles
    const h = cnt.human.get(g) || 0, lrh = Math.log2(((h + 0.5) / tot.human) / ((b + 0.5) / d));
    if (Math.log2(((a + 0.5) / c) / ((h + 0.5) / tot.human)) < 1) continue; // and >= 2x vs the human One Piece files (topic control)
    out.push({ g, a, eps: eps.get(g).size, os: b, G2, lr, h, lrh });
  }
  out.sort((x, y) => y.G2 - x.G2);
  const lines = ['ngram\tai_count\tai_episodes\tos_count\tG2\tlog2_ratio_ai_vs_os\thuman_count\tlog2_ratio_human_vs_os'];
  for (const o of out.slice(0, top)) lines.push([o.g, o.a, o.eps, o.os, o.G2.toFixed(0), o.lr.toFixed(2), o.h, o.lrh.toFixed(2)].join('\t'));
  fs.writeFileSync(outFile, lines.join('\n') + '\n');
  console.log(`ai tokens ${tot.ai}, human tokens ${tot.human}, os tokens ${N}; wrote ${Math.min(top, out.length)} of ${out.length} over-used items`);
}

// ---------------------------------------------------------------- register lexicon
// Bookish/calqued markers our AI uses far more than both OpenSubtitles and the human He.ass files (chosen from the
// keyness run + hand review, 2026-11-03). Prints hits per 1000 lines per arc and writes every hit line to a TSV.
const REGISTER_LEXICON = ['ארור', 'ארורים', 'ארורה', 'ארור אתה', 'שתקו', 'מהרו', 'מהרי', 'כמצופה', 'כצפוי', 'אם כי', 'זה עתה', 'עתה',
  'אולם', 'לשווא', 'אגרום', 'אני מתחנן', 'מובן', 'אסיר תודה', 'למדי', 'אנא', 'ובכן', 'אכן'];
function cmdLexicon(work, outFile) {
  const ours = JSON.parse(fs.readFileSync(path.join(work, 'ours.json'), 'utf8'));
  const lex = new Set(REGISTER_LEXICON), arc = {}, hits = ['file\tass_line\tmarker\ttext'];
  for (const r of ours) {
    if (r.kind !== 'ai' && r.kind !== 'human') continue;
    const k = r.kind === 'human' ? 'HUMAN He.ass' : r.file.split('/').slice(1, 3).join('/');
    const a = arc[k] = arc[k] || { n: 0, h: 0 }; a.n++;
    for (const s of sentences(r.text)) for (let i = 0; i < s.length; i++) for (const g of [s[i], s[i] + ' ' + (s[i + 1] || '')]) if (lex.has(g)) { a.h++; if (r.kind === 'ai') hits.push([r.file, r.assLine, g, r.text].join('\t')); }
  }
  Object.entries(arc).sort((x, y) => y[1].h / y[1].n - x[1].h / x[1].n).forEach(([k, a]) => console.log(`${(1000 * a.h / a.n).toFixed(1)}\t${a.n}\t${k}`));
  if (outFile) fs.writeFileSync(outFile, hits.join('\n') + '\n');
}

// ---------------------------------------------------------------- near-miss
// "נושם בעורף" vs the idiom "נושף בעורף": for every rare bigram (a b) in the AI lines whose words are both common,
// stream the corpus again and find bigrams a' b / a b' where a' is one edit away from a (substitution, or an
// internal insertion/deletion — edge prefix/suffix changes are skipped because they are mostly inflection) and the
// variant is >= 20x more frequent. Edit-distance-1 matching uses the SymSpell deletion-neighbourhood trick.
const NEARMISS_MIN_SHARE = +(process.env.NEARMISS_MIN_SHARE || 0.1);
function dels(w) { const o = new Set([w]); for (let i = 0; i < w.length; i++) o.add(w.slice(0, i) + w.slice(i + 1)); return o; }
function edgeOnly(a, b) { // true if a and b differ only by adding/removing one letter at the start or end
  if (Math.abs(a.length - b.length) !== 1) return false;
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  return l.slice(1) === s || l.slice(0, -1) === s;
}
async function cmdNearmiss(work, corpus, outFile, maxLines) {
  const sc = makeScorer(work);
  const ours = JSON.parse(fs.readFileSync(path.join(work, 'ours.json'), 'utf8'));
  const cand = new Map(); // "a b" -> {a, b, obs, rows:[]}
  for (const r of ours) {
    if (r.kind !== 'ai') continue;
    for (const chunks of sentences(r.text, true)) for (const ch of chunks) for (let i = 0; i + 1 < ch.length; i++) {
      const a = ch[i], b = ch[i + 1];
      if (sc.skip(a) || sc.skip(b) || HOUSE_SKIP.has(a) || HOUSE_SKIP.has(b) || a.length < 3 || b.length < 3) continue;
      const g = a + ' ' + b, o = sc.c(g);
      if (o > 20 || sc.c(a) < 300 || sc.c(b) < 300) continue;
      let x = cand.get(g); if (!x) cand.set(g, x = { a, b, obs: o, rows: [] });
      if (x.rows.length < 3) x.rows.push(r.file.split('/').pop() + ':' + r.assLine + ' ' + r.text);
    }
  }
  const leftKey = new Map(), rightKey = new Map(); // del(a)+' '+b -> [g] ; a+' '+del(b) -> [g]
  const push = (m, k, g) => { const l = m.get(k); if (l) l.push(g); else m.set(k, [g]); };
  for (const [g, x] of cand) { for (const d of dels(x.a)) push(leftKey, d + ' ' + x.b, g); for (const d of dels(x.b)) push(rightKey, x.a + ' ' + d, g); }
  const rightAnchors = new Set([...cand.values()].map(x => x.b)), leftAnchors = new Set([...cand.values()].map(x => x.a));
  console.error(`candidates ${cand.size}`);
  const hits = new Map(); // g -> Map(variant -> count)
  const add = (g, v) => { let m = hits.get(g); if (!m) hits.set(g, m = new Map()); m.set(v, (m.get(v) || 0) + 1); };
  const stream = fs.createReadStream(corpus).pipe(zlib.createGunzip()); stream.setEncoding('utf8');
  let buf = '', n = 0; const t0 = Date.now();
  const doLine = line => {
    for (const s of sentences(line)) for (let i = 0; i + 1 < s.length; i++) {
      const x = s[i], y = s[i + 1];
      if (rightAnchors.has(y)) for (const d of dels(x)) { const l = leftKey.get(d + ' ' + y); if (l) for (const g of l) { const c0 = cand.get(g); if (x !== c0.a && !edgeOnly(x, c0.a)) add(g, x + ' ' + y); } }
      if (leftAnchors.has(x)) for (const d of dels(y)) { const l = rightKey.get(x + ' ' + d); if (l) for (const g of l) { const c0 = cand.get(g); if (y !== c0.b && !edgeOnly(y, c0.b)) add(g, x + ' ' + y); } }
    }
  };
  outer: for await (const chunk of stream) {
    buf += chunk; let i, st = 0;
    while ((i = buf.indexOf('\n', st)) !== -1) { doLine(buf.slice(st, i)); st = i + 1; if (++n >= maxLines && maxLines) break outer; if (n % 1e7 === 0) console.error(`${n / 1e6}M lines ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
    buf = buf.slice(st);
  }
  const frac = maxLines ? Math.min(1, n / (sc.os.nLines || n)) : 1; // variant counts come from the first n lines only
  const out = ['ratio\tobserved\tbigram\tlikely_meant\tvariant_count_in_sample\tshare_of_fixed_word\texamples'];
  const res = [];
  for (const [g, m] of hits) {
    const x = cand.get(g);
    const [v, vc] = [...m.entries()].sort((p, q) => q[1] - p[1])[0];
    const est = vc / frac, ratio = est / (x.obs + 1);
    // the fixed word must be bound to the variant (idiom-like): >= MIN_SHARE of its occurrences sit in the variant
    const [va, vb] = v.split(' '), fixed = va === x.a ? x.a : x.b, share = est / Math.max(sc.c(fixed), 1);
    if (vc >= 20 && ratio >= 20 && share >= NEARMISS_MIN_SHARE) res.push([ratio, x.obs, g, v, vc, share.toFixed(3), x.rows.join(' || ')]);
  }
  res.sort((p, q) => q[0] - p[0]);
  fs.writeFileSync(outFile, out.concat(res.map(r => [r[0].toFixed(0), ...r.slice(1)].join('\t'))).join('\n') + '\n');
  console.error(`near-miss flags ${res.length} (sampled ${n} lines, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}

// ---------------------------------------------------------------- main
const [cmd, ...args] = require.main === module ? process.argv.slice(2) : ['lib'];
const topArg = args.indexOf('--top');
if (cmd === 'lib') { /* required as a module */ }
else if (cmd === 'extract') cmdExtract(args[0], args[1]);
else if (cmd === 'count') cmdCount(args[0], args[1], args[2], +(args[3] || 0)).catch(e => { console.error(e); process.exit(1); });
else if (cmd === 'score') cmdScore(args[0], args[1], topArg >= 0 ? +args[topArg + 1] : 500);
else if (cmd === 'line') cmdLine(args[0], args[1]);
else if (cmd === 'keyness') cmdKeyness(args[0], args[1], topArg >= 0 ? +args[topArg + 1] : 300);
else if (cmd === 'lexicon') cmdLexicon(args[0], args[1]);
else if (cmd === 'nearmiss') cmdNearmiss(args[0], args[1], args[2], +(args[3] || 0)).catch(e => { console.error(e); process.exit(1); });
else { console.error('usage: see header'); process.exit(2); }
module.exports = { sentences, canon, makeScorer, endsSentence, CFG };
