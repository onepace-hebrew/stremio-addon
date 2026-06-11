#!/usr/bin/env node
'use strict';

/**
 * strip-ass-for-stremio.js
 *
 * Makes generated .ass files loadable in Stremio. Stremio feeds external
 * subtitles through a VTT conversion pipeline that silently fails on huge
 * typeset fansub scripts (per-syllable ED karaoke, per-frame sign animation,
 * vector drawings). The human-translated He.ass files that DO load are
 * dialogue+signs only (~600 events / ~100KB); this script reduces our
 * generated files to that proven profile.
 *
 * Drops Dialogue events that:
 *   - use a karaoke-family style (Karaoke*, Lyrics*, Romaji*, Kanji*,
 *     Translation*, Musical) or carry Effect "fx" (karaoke-template output —
 *     song episodes emit one event PER LETTER under arbitrary style names)
 *   - contain vector drawing mode (\p1..\p9) — unrenderable as text
 *   - last under 150 ms, but only when a file has >400 such events (per-frame
 *     animation floods come in thousands; the working human files keep ~250
 *     short sign-fade events, so small counts are left alone)
 *   - exceed 2000 chars (mega \clip/\t chains; human files max out at ~300)
 * Comment events are dropped too — they never render (Aegisub automation
 * templates; one Wano file carries 4MB of them).
 * Everything else (headers, styles, dialogue, signs) is preserved verbatim.
 *
 * Skips human-translated files (basename ends in " He.ass", capital H) —
 * those are ground truth and already load fine.
 *
 * Usage: node scripts/strip-ass-for-stremio.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const KARAOKE_STYLE = /karaoke|lyrics|romaji|kanji|furigana|translation|musical/i;
const DRAWING_TAG = /\\p[1-9]/;
const MIN_DURATION_MS = 150;
const SHORT_EVENT_FLOOD = 400;
const MAX_TEXT_CHARS = 2000;

const dryRun = process.argv.includes('--dry-run');

// "0:25:33.12" -> ms
function toMs(t) {
  const m = t.match(/^(\d+):(\d{2}):(\d{2})\.(\d{2})$/);
  if (!m) return null;
  return ((+m[1] * 60 + +m[2]) * 60 + +m[3]) * 1000 + +m[4] * 10;
}

function classify(line, dropShort) {
  // Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
  const parts = line.split(',');
  const style = parts[3] || '';
  const effect = parts[8] || '';
  const text = parts.slice(9).join(',');

  if (KARAOKE_STYLE.test(style) || effect === 'fx') return 'karaoke';
  if (DRAWING_TAG.test(text)) return 'drawing';
  if (text.replace(/\{[^}]*\}/g, '').replace(/\\N|\\h/g, '').trim() === '') return 'empty';
  if (text.length > MAX_TEXT_CHARS) return 'mega';
  if (dropShort) {
    const s = toMs(parts[1]);
    const e = toMs(parts[2]);
    if (s !== null && e !== null && e - s < MIN_DURATION_MS) return 'perFrame';
  }
  return null;
}

function isShortEvent(line) {
  const parts = line.split(',');
  const s = toMs(parts[1]);
  const e = toMs(parts[2]);
  return s !== null && e !== null && e - s < MIN_DURATION_MS;
}

function stripFile(absPath) {
  const raw = fs.readFileSync(absPath, 'utf8');
  const lines = raw.split('\n');
  const kept = [];
  let dropped = 0;
  const dropReasons = { karaoke: 0, drawing: 0, perFrame: 0, mega: 0, comment: 0, empty: 0 };

  const shortCount = lines.filter(
    (l) => l.startsWith('Dialogue:') && isShortEvent(l)
  ).length;
  const dropShort = shortCount > SHORT_EVENT_FLOOD;

  for (const line of lines) {
    if (line.startsWith('Comment:')) {
      dropped++;
      dropReasons.comment++;
      continue;
    }
    if (!line.startsWith('Dialogue:')) {
      kept.push(line);
      continue;
    }
    const reason = classify(line, dropShort);
    if (reason) {
      dropped++;
      dropReasons[reason]++;
    } else {
      kept.push(line);
    }
  }

  if (dropped === 0) return null;
  const out = kept.join('\n');
  if (!dryRun) fs.writeFileSync(absPath, out, 'utf8');
  return {
    dropped,
    dropReasons,
    beforeKB: Math.round(raw.length / 1024),
    afterKB: Math.round(out.length / 1024),
  };
}

function main() {
  // git ls-files gives exact-case names (the working tree is on a
  // case-insensitive FS, so globbing could conflate "he.ass" with "He.ass").
  const tracked = execFileSync('git', ['ls-files', 'subtitles/*.ass'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

  // Generated files only: " he.ass" lowercase. " He.ass" = human ground truth.
  const targets = tracked.filter((f) => f.endsWith('he.ass') && !f.endsWith(' He.ass'));

  let changed = 0;
  for (const rel of targets) {
    const res = stripFile(path.join(REPO_ROOT, rel));
    if (!res) continue;
    changed++;
    const r = res.dropReasons;
    console.log(
      `${rel}\n  ${res.beforeKB}KB -> ${res.afterKB}KB, dropped ${res.dropped} ` +
        `(karaoke ${r.karaoke}, drawing ${r.drawing}, per-frame ${r.perFrame}, mega ${r.mega}, comment ${r.comment}, empty ${r.empty})`
    );
  }
  console.log(`\n${dryRun ? '[dry-run] ' : ''}${changed}/${targets.length} files changed`);
}

main();
