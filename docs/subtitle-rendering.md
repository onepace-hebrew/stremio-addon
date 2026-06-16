# Subtitle tracks & rendering (worker.js)

How the Cloudflare Worker serves the Hebrew tracks, and why. Hard-won; don't re-derive.

## Tracks served (per episode)

| Track label | URL | For |
|---|---|---|
| `עברית (SRT)` | github raw `.srt` | universal, plain text |
| `עברית + שלטים (VTT)` | `/vtt/<TOK>.vtt` (ass→VTT) | desktop; keeps cue positioning |
| `עברית מעוצב (ASS)` | `/ass/<TOK>.ass` | bidi-correct players: **ExoPlayer, mpv, VLC desktop** |
| `עברית מעוצב (VLC)` | `/ass-vlc/<TOK>.ass` | **VLC Android** only |

URLs carry `?v=<manifest.version>` (cache-bust every deploy); list `cacheMaxAge=60s`.

## The `/ass` pipeline (`normalize` + `injectFonts`)

Source `.ass` is served almost verbatim. Edits:
1. **Embed fonts** — inject `[Fonts]` with **Gveret Levin** (SIL OFL) renamed 3×: `Guttman Yad-Brush`, `Guttman Kav`, `Guttman Aharoni` (the families the styles use). Without this, VLC/libass shows **boxes** (no Hebrew glyphs on device). In `embedded-font.js` (base64).
2. **Strip inline `\fn`** — exotic sign fonts (Roboto/Kakumin Web…) not on device → use style font (= embedded).
3. **Dialogue size ×1.3** — `-207-` conversation styles (Gveret Levin renders small).
4. **Cap sign `\fscx/\fscy` > 100** — typeset 125–175% zoom overflowed screen for Hebrew; downscales kept.
5. Range/HEAD + `Accept-Ranges` (ffmpeg range-probes the URL; 200-without-ranges ANR'd Stremio). BOM-prefixed UTF-8.

## The VLC Android fix (`/ass-vlc`)

VLC Android's libass renders **sign text without bidi → reversed** (dialogue is fine). The file is correct — mpv, VLC desktop, and Linux libass+fontconfig all render it right; it's that VLC build's bug, **not reproducible locally**.

Fix: `/ass-vlc` runs the **Unicode bidi algorithm** (`bidi-js`) over **sign** text → **visual order** (drop bidi-control marks, keep `{tags}`, reorder each `\N` line + mirror brackets). VLC's no-bidi left-to-right draw then shows correct Hebrew. **Dialogue stays logical** (VLC bidis it fine). Separate track because visual-order would **double-reverse** on correct players.

## Player matrix

- **VLC Android** → `(VLC)` track. Styled + correct.
- **ExoPlayer** → `(ASS)`. Correct RTL but plain (ignores embedded font/outline).
- **mpv / VLC desktop** → `(ASS)`. Full styling, correct.
- **Built-in mpv (Stremio)** → **can't fetch external ASS** (direct-HTTPS fetch ANRs/crashes). Use SRT/VTT.

## Don't re-try (dead ends)

- Repositioning signs (strip `\pos`, force `\an`): splits **layered fill+outline events** (same `\pos`) into **doubled** text; never fixed reversal.
- Strip bidi controls alone / prepend RLM / force RTL base / VLC subtitle-encoding setting: did not fix VLC Android.
- Render-cost tags (`\blur`) are a red herring (official He.ass uses them, works).
