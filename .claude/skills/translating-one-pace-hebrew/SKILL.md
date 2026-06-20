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
- **`docs/characters.json`** — the canonical character registry (Hebrew spelling + gender + English aliases). SINGLE SOURCE OF TRUTH; the lint and QA pass read it. The table below mirrors it for quick reference.
- When fixing/adapting: the matching `main/` Hebrew (same arc, different cut — align by CONTENT, not timestamp) as the meaning/phrasing source.

## Process (per episode)
1. **Context first.** For every line decide WHO speaks and WHO is addressed (one/many, male/female). Conjugate gender + number to the **scene**, not the English. Carry context across cue boundaries AND across the previous/next episode (a scene split between episodes keeps the same speakers, names, terms). See **Gender & number** below — it's the #1 recurring error.
2. **Natural Hebrew.** Spoken Israeli register. Restructure inverted English rhetoric; localize idioms (see learnings §1.5). Never word-for-word.
3. **Names** — use the registry spelling EXACTLY, identically in every episode. Keep `CP9` and rank letters A/B/C in Latin. `-san` → אדון.
4. **Attacks/techniques** → Hebrew (גומי-גומי…, גילוח, גוף ברזל, בעיטת סופה). **Terms** → glossary. Remove ALL leftover English / foreign chars from dialogue.
5. **Structure (when editing existing files):** keep ALL timings and every sign/Caption/Title/Credits event and override tag (`{...}`, `\pos`, `\fad`, `\t`, colors, `\N`, layered events) **byte-identical** — change only dialogue text + its wrapping. Re-wrap at **word boundaries**, ≤44 chars/line, max 2 lines — **never split a word**. Leading U+202B (‫) on each dialogue line and after each `\N`. UTF-8 BOM on `.ass`. No niqqud, no Hebrew maqaf (U+05BE), no italics. Exactly one translator credit.

## Character registry (spelling + gender) — keep identical across ALL episodes
**Canonical = `docs/characters.json`** (this table mirrors it). Add a new character THERE (he spelling + gender + every English/Hebrew alias), not just here. Gender drives every verb/adjective/pronoun/numeral.

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

## Gender & number — the #1 recurring error
Hebrew inflects **verbs, adjectives, pronouns, AND numerals** for the gender (m/f) and number (sg/pl) of the subject, the addressee, and the referent. English erases nearly all of it, so this is where AI output breaks. Procedure:

1. **English is the oracle — translate FROM it.** The English line's `he/she/they/him/her/his/her` and the names tell you the gender/number. Never infer gender from the Hebrew alone (that's how flips propagate). For the fedew episodes the One Pace English source is `JoeGeC/one-pace-subs` (fetch by blob sha; see [[fedew-holes-and-english-source]]).
2. **Speaker→addressee map first.** Before translating a scene, fix WHO speaks and WHO is addressed (one/many, m/f). Carry it across cues and episode boundaries.
3. **The `you` decision:** one male → `אתה`; one female → `את`; group with any male → `אתם`; all-female → `אתן`. Conjugate the verb/imperative to match (`תרוץ`/`תרוצי`, `קח`/`קחי`, `אתה יודע`/`את יודעת`).
4. **Female speakers** (Robin, Nami, Kalifa, Kokoro, Chimney, Olvia — registry) take feminine self-forms: `אני בטוחה`, `אני מוכנה`, `עשיתי זאת בעצמי`.
5. **Grammatical vs real gender:** a pronoun may agree with a Hebrew noun's grammatical gender (`מטרה` is f → `אותה`) OR the real person. When English uses `he/she` for a **person**, match the person (male target → `אהרוג אותו`, not `אותה`).
6. **Number from the scene, not English `you`:** "you guys"/"you all"/multiple on-screen → plural; a single addressee → singular. Numerals agree too (`שני אנשים` m / `שתי רגליים` f).
7. **Never mix genders for one referent inside a line** (`מת` + `מתקוממת`).

## Self-check before done (REQUIRED)
1. `node scripts/lint-subs.js "subtitles/.../<ep>"` → resolve flagged word-splits, dup cues, untranslated English. (Long single-lines that have no `\N` in the source are OK — they wrap in-player.)
2. `node scripts/lint-gender.js "subtitles/.../<ep>"` → resolve flagged gender flips / name+verb mismatches.
3. **Name consistency:** the lint flags off-registry spellings (e.g. סול, ספנדם). Zero allowed.
4. **Gender/number QA pass (the real gate):** re-read EACH cue against the **English source line** + the registry. For every verb/adjective/pronoun/numeral, confirm it agrees with the scene's speaker/addressee/referent. This catches the internally-consistent-but-wrong gender that no lint can. Fix in `.ass` AND `.srt` identically.
5. **.srt ↔ .ass** dialogue text consistent.

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
