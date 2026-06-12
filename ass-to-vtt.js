// ASS -> WebVTT converter for the Worker's /vtt/<id>.vtt endpoint.
//
// Why: Stremio cannot ingest external .ass at all (server VTT pipeline 500s
// on every .ass — upstream stremio-bugs#2312), but external WebVTT loads
// fine. Converting ourselves keeps what VTT can carry: cue timing, line
// breaks, and approximate positioning (top-of-screen signs via line:%,
// horizontal placement via position:%). Fonts/colors/karaoke can't survive
// the format — that ceiling is Stremio's, not ours.
//
// Conversion rules:
// - Dialogue events only; karaoke-family styles are already stripped from
//   the repo files by scripts/strip-ass-for-stremio.js.
// - Skip: Warning-style events and any event scaled to invisibility
//   (\fscx0/\fscy0) — they are invisible in libass but would show as text
//   in VTT; empty events; exact (start,end,text) duplicates (signs are
//   layered 2-3x for border/fill, which VTT would render as repeated text);
//   Credits-style events (staff credits are stored in reversed visual
//   letter order for the ass renderer — gibberish as plain VTT text).
// - No cue position settings: Stremio's server strips them on desktop and
//   ExoPlayer scatters text with them on TV (tested both) — plain bottom
//   cues render best. Signs/captions ride as normal cues.
// - \N -> newline, \h -> space, all other override tags dropped.
// - RTL marks (U+202B) in the text are preserved.

'use strict';

const TIME_RE = /^(\d+):(\d{2}):(\d{2})\.(\d{2})$/;

function toVttTime(t) {
  const m = TIME_RE.exec(t);
  if (!m) return null;
  return `${m[1].padStart(2, '0')}:${m[2]}:${m[3]}.${m[4]}0`;
}

function plainText(text) {
  return text
    .replace(/\{[^}]*\}/g, '')
    .replace(/\\N/g, '\n')
    .replace(/\\h/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

/**
 * Convert an .ass script (string) to a WebVTT string.
 */
function assToVtt(ass) {
  let playResX = 0;
  let playResY = 0;
  const cues = [];
  const seen = new Set();

  for (const line of ass.split(/\r?\n/)) {
    if (!playResX) {
      const mx = /^PlayResX:\s*(\d+)/.exec(line);
      if (mx) playResX = +mx[1];
    }
    if (!playResY) {
      const my = /^PlayResY:\s*(\d+)/.exec(line);
      if (my) playResY = +my[1];
    }
    if (!line.startsWith('Dialogue:')) continue;

    // Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
    const parts = line.split(',');
    if (parts.length < 10) continue;
    const start = toVttTime(parts[1]);
    const end = toVttTime(parts[2]);
    const style = parts[3] || '';
    const rawText = parts.slice(9).join(',');
    if (!start || !end) continue;
    if (/^(warning|credits)/i.test(style)) continue;
    if (/\\fsc[xy]0(?![\d.])/.test(rawText)) continue;

    const text = plainText(rawText);
    if (!text) continue;
    const key = `${start}|${end}|${text}`;
    if (seen.has(key)) continue;
    seen.add(key);

    cues.push({ start, end, settings: '', text });
  }

  cues.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));

  // BOM forces UTF-8 in Stremio server's charset detection — without it the
  // Hebrew gets read as latin-1 and double-encoded.
  const out = ['﻿WEBVTT', ''];
  cues.forEach((c, i) => {
    out.push(String(i + 1));
    out.push(`${c.start} --> ${c.end}${c.settings}`);
    out.push(c.text);
    out.push('');
  });
  return out.join('\n');
}

export { assToVtt };
