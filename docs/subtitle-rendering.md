# Subtitle tracks & rendering (worker.js)

How the Cloudflare Worker serves the Hebrew tracks, and why. Hard-won; don't re-derive.

## Tracks served (per episode)

Only **two** are advertised in the subtitles list. Most players render no per-track
`label` — every entry shows as a generic "Hebrew" — so extra tracks were just
indistinguishable duplicates the user kept landing on wrong. The `/vtt` and `/ass`
endpoints still work; they're simply not listed.

**ONE** track is advertised (v1.0.40+): duplicate tracks show as indistinguishable
"Hebrew" entries and the user kept landing on the wrong one, and one episode showed
plain-SRT (small) while the next showed the bumped ASS (big) → "why is E03 huge".

| Track label | URL | For |
|---|---|---|
| `עברית` | `/ass/<TOK>.ass` | styled; logical text **except centered titles** (see below) |

Unlisted but live: `/vtt/<TOK>.vtt`, the github raw `.srt`, and `/ass-vlc/<TOK>.ass`
(all signs pre-reversed — **deprecated, kept only as a one-line revert**; see below).
Dropping SRT means Stremio's **built-in mpv shows no Hebrew** (it can't fetch external
`.ass`) — external player (VLC/ExoPlayer) only.

URLs carry `?v=<manifest.version>` (cache-bust every deploy); list `cacheMaxAge=60s`.

## The `/ass` pipeline (`normalize` + `injectFonts`)

Source `.ass` is served almost verbatim. Edits:
1. **Embed fonts** — inject `[Fonts]` with **Gveret Levin** (SIL OFL) renamed 3×: `Guttman Yad-Brush`, `Guttman Kav`, `Guttman Aharoni` (the families the styles use). Without this, VLC/libass shows **boxes** (no Hebrew glyphs on device). In `embedded-font.js` (base64).
2. **Strip inline `\fn`** — exotic sign fonts (Roboto/Kakumin Web…) not on device → use style font (= embedded).
3. **Dialogue size bump** — `DIALOGUE_STYLE` matches the conversation styles `Main/Thoughts/Narrator/Secondary/Flashbacks…` **with OR without** the `-207-`/`-207+` suffix. Some episodes (e.g. EL11) author dialogue with the plain `Main` (~55) instead of `Main-207-` (~82). Size = `max(round(size×1.3), 105)` so both regimes land readable (82→107, 55→105). **Critical for `/ass-vlc`:** if dialogue isn't matched here it's treated as a *sign* → visual-ordered (reversed Hebrew) **and** un-bumped (tiny). That exact regex-too-strict bug shipped once; don't reintroduce the `-207`-only form.
4. **Sign-text size bump** — `SIGN_TEXT_STYLE` (Title/Captions/Note…) bumped ×1.3 (no floor; they're short). Episode/scene titles + location captions otherwise render tiny with Gveret Levin.
5. **Cap sign `\fscx/\fscy` > 100** — typeset 125–175% zoom overflowed screen for Hebrew; downscales kept.
6. Range/HEAD + `Accept-Ranges` (ffmpeg range-probes the URL; 200-without-ranges ANR'd Stremio). BOM-prefixed UTF-8.

## Signs: LOGICAL everywhere EXCEPT the centered episode TITLE

VLC Android applies the Unicode bidi algorithm to **almost everything** — bottom
dialogue (`an2`), `\pos`/`\move` signs, AND top/bottom alignment signs. Proof: a
pre-reversed `\an8` Note rendered *reversed* on a real VLC TV, and serving it
**logical** rendered it *correct* (user-confirmed PEN_2 17:48). So pre-reversing
those double-reverses them — serve logical.

The **one exception is the vertically-centered episode Title (`an5`)**: VLC draws it
left-to-right (NOT bidi'd) → reversed unless pre-flipped. User-confirmed on PEN_4
title @5:56 (logical = reversed) and historically E16/17/22/23/24 titles.

**Rule (worker `normalize`, v1.0.41):** flip a cue to visual order (`signTextToVisual`)
iff `TITLE_STYLE` matches **and** it's not `\pos`/`\move`-anchored. Everything else —
dialogue, notes, captions, `\pos` titles — stays logical. The legacy `visual=true`
path (`/ass-vlc`) still flips *all* signs; it's dead code kept as a one-line revert.

Why titles differ: only `an5` (vertical-middle) signs hit VLC's no-bidi path; `an2`/
`an8` and `\pos` do not. If a non-title centered sign ever shows reversed, widen
`TITLE_STYLE` (or key off effective alignment 4/5/6) — do **not** go back to
flipping all signs (that re-breaks notes/captions).

## Player matrix

- **VLC Android** → `/ass`. Styled + correct; logical text, centered Title pre-flipped.
- **ExoPlayer** → `/ass`. Correct RTL but plain (ignores embedded font/outline). NOTE: bidis the Title too, so the pre-flipped title is reversed here — acceptable trade (user is on VLC; ExoPlayer is secondary).
- **mpv / VLC desktop** → `/ass`. Full styling; dialogue/signs correct, pre-flipped title double-reversed (same trade).
- **Built-in mpv (Stremio)** → **can't fetch external ASS** (direct-HTTPS fetch ANRs/crashes). No Hebrew (SRT dropped).

## Don't re-try (dead ends)

- **Pre-reversing ALL signs to "visual order"** (`/ass-vlc`): VLC Android DOES bidi dialogue, `\pos` signs, AND `an2`/`an8` signs, so flipping those double-reverses → reversed. Only the centered `an5` Title needs flipping. Do not flip the rest.
- Repositioning signs (strip `\pos`, force `\an`): splits **layered fill+outline events** (same `\pos`) into **doubled** text.
- Strip bidi controls alone / prepend RLM / force RTL base / VLC subtitle-encoding setting: no effect.
- Render-cost tags (`\blur`) are a red herring (official He.ass uses them, works).
- **The Android emulator can't validate signs** — its VLC plays video but renders **no subtitle overlay** (SwiftShader GPU). Only a real device confirms sign rendering.
