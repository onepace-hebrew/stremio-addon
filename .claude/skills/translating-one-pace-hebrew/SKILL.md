---
name: translating-one-pace-hebrew
description: Use when translating, re-translating, or fixing the Hebrew One Pace subtitles in this repo (subtitles/**/*.srt and *.ass) — producing or repairing an episode's Hebrew dialogue/signs.
---

# Translating One Pace to Hebrew

## Core principle
Translate the **scene**, not the English line. Natural spoken Israeli Hebrew; names and gender **consistent across the whole arc**; never a literal English calque. Gold standard = the human translation (That One Gerbil), distilled in `docs/translation-learnings.md`.

The recurring failures this skill prevents (all observed in real bad episodes): name drift across episodes (סאול→סול), gender flip mid-scene, plural↔singular guessed from ambiguous English "you", literal calque when context is dropped, words split across line breaks, untranslated English/attack names, lost context across an episode boundary.

## Load before translating (required reading)
- `docs/translation-learnings.md` — the full house-style rules. READ IT.
- `docs/translation-glossary.json` — terms (Marines=הצי, underling=כפוף, Enies Lobby=אניאס לובי, …).
- `docs/translation-canon.json` — canonical name spellings (20 human files).
- The **character registry** below (name spelling + gender).
- When fixing/adapting: the matching `main/` Hebrew (same arc, different cut — align by CONTENT, not timestamp) as the meaning/phrasing source.

## Process (per episode)
1. **Context first.** For every line decide WHO speaks and WHO is addressed (one/many, male/female). Conjugate gender + number to the **scene**, not the English. Carry context across cue boundaries AND across the previous/next episode (a scene split between episodes keeps the same speakers, names, terms).
2. **Natural Hebrew.** Spoken Israeli register. Restructure inverted English rhetoric; localize idioms (see learnings §1.5). Never word-for-word.
3. **Names** — use the registry spelling EXACTLY, identically in every episode. Keep `CP9` and rank letters A/B/C in Latin. `-san` → אדון.
4. **Attacks/techniques** → Hebrew (גומי-גומי…, גילוח, גוף ברזל, בעיטת סופה). **Terms** → glossary. Remove ALL leftover English / foreign chars from dialogue.
5. **Structure (when editing existing files):** keep ALL timings and every sign/Caption/Title/Credits event and override tag (`{...}`, `\pos`, `\fad`, `\t`, colors, `\N`, layered events) **byte-identical** — change only dialogue text + its wrapping. Re-wrap at **word boundaries**, ≤44 chars/line, max 2 lines — **never split a word**. Leading U+202B (‫) on each dialogue line and after each `\N`. UTF-8 BOM on `.ass`. No niqqud, no Hebrew maqaf (U+05BE), no italics. Exactly one translator credit.

## Character registry (spelling + gender) — keep identical across ALL episodes
Verify/extend against `canon.json`; gender drives every verb/adjective/pronoun.

| Character | Hebrew | Gender |
|---|---|---|
| Luffy | לופי | m |
| Zoro | זורו | m |
| Nami | נאמי | **f** |
| Usopp / Sogeking | אוסופ / סוגקינג | m |
| Sanji | סאנג'י | m |
| Chopper | צ'ופר | m |
| Robin | רובין | **f** |
| Franky | פרנקי | m |
| Saul | סאול | m |
| Olvia (Robin's mother) | אולביה | **f** |
| Clover (professor) | קלובר | m |
| Kuzan (= Aokiji) | קוזאן (= אאוקיג'י) | m |
| Spandine | ספנדיין | m |
| Spandam | ספאנדם | m |
| Lucci | לוצ'י | m |
| Kaku | קאקו | m |
| Jabra | ג'אברה | m |
| Kalifa | קאליפה | **f** |
| Blueno | בלואנו | m |
| Kumadori | קומאדורי | m |
| Fukuro | פוקורו | m |
| Kokoro | קוקורו | **f** |
| Chimney (girl) | צ'ימני | **f** |

(Female-named-but-… exceptions: none here. When a new character appears, fix one spelling + gender and add the row.)

## Self-check before done (REQUIRED)
1. `node scripts/lint-subs.js "subtitles/.../<ep>"` → resolve flagged word-splits, dup cues, untranslated English. (Long single-lines that have no `\N` in the source are OK — they wrap in-player.)
2. **Name consistency:** the lint flags off-registry spellings (e.g. סול, ספנדם). Zero allowed.
3. **Gender scan:** no mixed-gender inside one line (e.g. `מת` + `מתקוממת`); verbs/adjectives match the speaker/addressee per the registry.
4. **.srt ↔ .ass** dialogue text consistent.

## Common mistakes → fix
| Symptom | Fix |
|---|---|
| Name spelled differently in another ep (סול vs סאול) | Registry spelling, everywhere. |
| Male character gets feminine verb (Saul) | Track speaker; use registry gender. |
| Plural where scene is one person (or vice-versa) | Use the on-screen scene, not English "you". |
| "good time"=זמן טוב, "you look bad"=אתה נראה רע | Natural Hebrew, not calque. |
| Word broken across two lines | Wrap at word boundaries only. |
| Buster Call / attack names in English | Glossary / Hebrew. |
| Scene continues into next episode but names/terms change | Re-load registry + glossary every episode. |
