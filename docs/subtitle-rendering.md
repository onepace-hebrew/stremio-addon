# Subtitle tracks & rendering (worker.js)

How the Cloudflare Worker serves the Hebrew tracks, and why. Hard-won; don't re-derive.

## Tracks served (per episode)

Only **two** are advertised in the subtitles list. Most players render no per-track
`label` — every entry shows as a generic "Hebrew" — so extra tracks were just
indistinguishable duplicates the user kept landing on wrong. The `/vtt` and `/ass`
endpoints still work; they're simply not listed.

| Track label | URL | For |
|---|---|---|
| `עברית` | github raw `.srt` | universal, plain text |
| `עברית מעוצב` | `/ass/<TOK>.ass` | styled; **all text logical** (dialogue + signs) |

Unlisted but live: `/vtt/<TOK>.vtt` (ass→VTT, keeps positioning) and `/ass-vlc/<TOK>.ass`
(signs pre-reversed — **deprecated, kept only as a one-line revert**; see below).

URLs carry `?v=<manifest.version>` (cache-bust every deploy); list `cacheMaxAge=60s`.

## The `/ass` pipeline (`normalize` + `injectFonts`)

Source `.ass` is served almost verbatim. Edits:
1. **Embed fonts** — inject `[Fonts]` with **Gveret Levin** (SIL OFL) renamed 3×: `Guttman Yad-Brush`, `Guttman Kav`, `Guttman Aharoni` (the families the styles use). Without this, VLC/libass shows **boxes** (no Hebrew glyphs on device). In `embedded-font.js` (base64).
2. **Strip inline `\fn`** — exotic sign fonts (Roboto/Kakumin Web…) not on device → use style font (= embedded).
3. **Dialogue size bump** — `DIALOGUE_STYLE` matches the conversation styles `Main/Thoughts/Narrator/Secondary/Flashbacks…` **with OR without** the `-207-`/`-207+` suffix. Some episodes (e.g. EL11) author dialogue with the plain `Main` (~55) instead of `Main-207-` (~82). Size = `max(round(size×1.3), 105)` so both regimes land readable (82→107, 55→105). **Critical for `/ass-vlc`:** if dialogue isn't matched here it's treated as a *sign* → visual-ordered (reversed Hebrew) **and** un-bumped (tiny). That exact regex-too-strict bug shipped once; don't reintroduce the `-207`-only form.
4. **Sign-text size bump** — `SIGN_TEXT_STYLE` (Title/Captions/Note…) bumped ×1.3 (no floor; they're short). Episode/scene titles + location captions otherwise render tiny with Gveret Levin.
5. **Cap sign `\fscx/\fscy` > 100** — typeset 125–175% zoom overflowed screen for Hebrew; downscales kept.
6. Range/HEAD + `Accept-Ranges` (ffmpeg range-probes the URL; 200-without-ranges ANR'd Stremio). BOM-prefixed UTF-8.

## Signs: serve LOGICAL (the `/ass-vlc` pre-reversal was wrong)

For a long time signs were pre-reversed to "visual order" (`/ass-vlc`, `bidi-js`) on the theory that VLC Android draws sign text **without** bidi. **That was wrong** and caused the recurring "sign is reversed again" reports: a pre-reversed `\an8` Note still rendered reversed on a real VLC Android TV (2026-06-24, user-confirmed). A pre-reversed sign can only look reversed if VLC **does** apply the Unicode bidi algorithm to it — so pre-reversing **double-reverses** it.

**Fix (v1.0.39): serve everything LOGICAL.** The styled track points at `/ass` (signs + dialogue both logical). VLC Android bidis it all correctly, exactly like mpv/desktop. No per-style reversal, no `\pos`-split heuristic — the whole fragile class is gone. `/ass-vlc` + `signTextToVisual` + `bidi-js` are dead code, kept only so the track URL can be reverted in one line if a real regression ever appears.

## Player matrix

- **VLC Android** → `/ass` (logical). Styled + correct, signs included (bidis everything).
- **ExoPlayer** → `/ass`. Correct RTL but plain (ignores embedded font/outline).
- **mpv / VLC desktop** → `/ass`. Full styling, correct.
- **Built-in mpv (Stremio)** → **can't fetch external ASS** (direct-HTTPS fetch ANRs/crashes). Use SRT/VTT.

## Don't re-try (dead ends)

- **Pre-reversing signs to "visual order" for VLC** (`/ass-vlc`): VLC Android DOES bidi signs, so this double-reverses them → reversed. Serve logical. This was the single biggest time-sink; do not bring it back.
- Repositioning signs (strip `\pos`, force `\an`): splits **layered fill+outline events** (same `\pos`) into **doubled** text.
- Strip bidi controls alone / prepend RLM / force RTL base / VLC subtitle-encoding setting: no effect.
- Render-cost tags (`\blur`) are a red herring (official He.ass uses them, works).
- **The Android emulator can't validate signs** — its VLC plays video but renders **no subtitle overlay** (SwiftShader GPU). Only a real device confirms sign rendering.
