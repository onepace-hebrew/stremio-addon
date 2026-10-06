---
name: translating-one-pace-hebrew
description: Use when translating, re-translating, or fixing the Hebrew One Pace subtitles in this repo (subtitles/**/*.srt and *.ass) — producing or repairing an episode's Hebrew dialogue/signs.
---

# Translating One Pace to Hebrew

## Core principle
Translate the **scene**, not the English line. Natural spoken Israeli Hebrew; names and gender **consistent across the whole arc**; never a literal English calque. Gold standard = the human translation (That One Gerbil), distilled in `docs/translation-learnings.md`.

The recurring failures this skill prevents (all observed in real bad episodes): name drift across episodes (סאול→סול), gender flip mid-scene, plural↔singular guessed from ambiguous English "you", literal calque when context is dropped, words split across line breaks, untranslated English/attack names, lost context across an episode boundary.

## Load before translating (required reading)
- `docs/translation-learnings.md` — the full house-style rules.
- `docs/translation-glossary.json` — terms (Marines=הצי, underling=כפוף, Enies Lobby=אניאס לובי, …).
- `docs/translation-canon.json` — canonical name spellings (20 human files).
- **`docs/characters.json`** — the canonical character registry (Hebrew spelling + gender + English aliases). SINGLE SOURCE OF TRUTH; the lint and QA pass read it. The table below is a quick-reference excerpt (Enies Lobby cast); look everyone else up in the JSON.
- **`docs/character-genders.json`** — bulk gender oracle: 1433 English names → m/f, scraped from the One Piece wiki (`node scripts/fetch-character-genders.js` to refresh). To resolve a name's gender: try `characters.json` (alias-aware) first; if absent, look it up here (uses canonical wiki titles — e.g. Lucci→"Rob Lucci", Aokiji→"Kuzan", Iceberg→"Iceburg"), then add the character to `characters.json` with its Hebrew spelling.
- When fixing/adapting: the matching `main/` Hebrew (same arc, different cut — align by CONTENT, not timestamp) as the meaning/phrasing source.

## Process (per episode)
1. **Context first.** For every line decide WHO speaks and WHO is addressed (one/many, male/female). Conjugate gender + number to the **scene**: English names and he/she give gender, but a bare `you` gives neither gender nor number. Carry context across cue boundaries AND across the previous/next episode (a scene split between episodes keeps the same speakers, names, terms). See **Gender & number** below — it's the #1 recurring error.
2. **Voice card (before cue 0).** For each recurring speaker in this arc, 3–5 words of register (Jinbe: short, heavy, formal. Buggy: loud coward. Magellan: dry warden. Bon Clay: theatrical, male verbs, כובע-צ'אן. Iva: ווי, camp). Put it in the batch's prompt sheet under `scripts/onepace-translations/` (one sheet per arc batch, e.g. `_IM_BATCH.txt`). Apply it on every line of that speaker. Same mouth across the whole arc.
3. **Natural Hebrew.** Spoken Israeli register. Restructure inverted English rhetoric; localize idioms (see learnings §1.5). Never word-for-word.
4. **Names** — use the registry spelling EXACTLY, identically in every episode. Keep `CP9` and rank letters A/B/C in Latin. Honorifics: `-san` → אדון NAME (m) / גברת NAME (f), droppable where it reads stiff; `-sama` → אדון (m) / אדונתי (f superiors, Kuja) / גברת (f "Lady", Perona); `-chan` nicknames keep צ'אן (כובע-צ'אן).
5. **Attacks/techniques** → Hebrew (גומי-גומי…, גילוח, גוף ברזל, בעיטת סופה). **Terms** → glossary. Remove ALL leftover English / foreign chars from dialogue. **Split across cues:** each card is one piece in English order. `Gear Second / Rubber / Jet / Bazooka` → `גיר שני / גומי-גומי / סילון / בזוקה` — never swap, never restack the fruit name onto the last card if the previous cards already have it.
6. **Structure (when editing existing files):** keep ALL timings and every sign/Caption/Title/Credits event and override tag (`{...}`, `\pos`, `\fad`, `\t`, colors, `\N`, layered events) **byte-identical** — change only dialogue text + its wrapping. Re-wrap at **word boundaries**, ≤44 chars/line, max 2 lines — **never split a word**. Leading U+202B (‫) on each dialogue line and after each `\N`. UTF-8 BOM on `.ass`. No niqqud, no Hebrew maqaf (U+05BE), no italics. Exactly one translator credit.
7. **Three gates before build (required on the first write, not a later rewrite).** Walk every **dialogue** cue (skip captions/notes that already match house signs). Change the line or confirm it already passes. Do not ship a "literal draft" to fix later.
   1. **Un-calque.** If you can still hear the English word order, rewrite. `אני אהיה זה שייקח את הראש שלו` → `אני אקטע לו את הראש`. `הם כדלקמן` → drop it. `עכבר לכוד הוא דבר מפחיד` → `גם עכבר בפינה יכול לנשוך`. Short punches (`מה?!` / `אין מצב!`) stay.
   2. **Voice.** Does this line sound like that speaker's card, not a generic narrator? Jinbe does not say יאללה. Iva first-person is ווי, not אני. Crocodile is cold, not street.
   3. **You + split attacks.** Bare English `you` from the scene (±4 cues): one male `אתה`, one female `את`, mixed/male group `אתם`, all-female `אתן`. Named single addressee (`Straw Hat`, `Bon-chan`) stays singular even if a nearby line is plural. Split attack cards match English order (gate 5).

## Character registry (spelling + gender) — keep identical across ALL episodes
**Canonical = `docs/characters.json`** (this table is an excerpt, not the full cast). Add a new character THERE (he spelling + gender + every English/Hebrew alias), not just here. Gender drives every verb/adjective/pronoun/numeral.

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

## Gender & number — the #1 recurring error
Hebrew inflects **verbs, adjectives, pronouns, AND numerals** for the gender (m/f) and number (sg/pl) of the subject, the addressee, and the referent. English erases nearly all of it, so this is where AI output breaks. Procedure:

1. **English is the oracle — translate FROM it.** The English line's `he/she/they/him/her/his/her` and the names tell you the gender/number. Never infer gender from the Hebrew alone (that's how flips propagate). The English source is the official `one-pace/one-pace-public-subtitles`; for episodes built with `scripts/build-onepace-episode.js` it is already in `scripts/onepace-translations/<ID>.cues.json` (`check-number.js` still reads Enies Lobby English from the `JoeGeC/one-pace-subs` mirror; see [[fedew-holes-and-english-source]]).
2. **Speaker→addressee map first.** Before translating a scene, fix WHO speaks and WHO is addressed (one/many, m/f). Carry it across cues and episode boundaries.
3. **The `you` decision:** one male → `אתה`; one female → `את`; group with any male → `אתם`; all-female → `אתן`. Conjugate the verb/imperative to match (`תרוץ`/`תרוצי`, `קח`/`קחי`, `אתה יודע`/`את יודעת`).
4. **Female speakers** (every `"gender": "f"` row in `docs/characters.json`) take feminine self-forms: `אני בטוחה`, `אני מוכנה`, `עשיתי זאת בעצמי`.
5. **Grammatical vs real gender:** a pronoun may agree with a Hebrew noun's grammatical gender (`מטרה` is f → `אותה`) OR the real person. When English uses `he/she` for a **person**, match the person (male target → `אהרוג אותו`, not `אותה`).
6. **Number (sg/pl) — resolve the bare `you` with the surrounding cues.** English `you` is number-blind and ~92% of cases give NO in-line signal, so use the context window, in order:
   - **a. Explicit in the line** → use it: `you guys / you all / you two / both of you / all of you / y'all` → PLURAL (`אתם`; all-female `אתן`). `you two/both` = exactly that small group.
   - **b. Propagate from neighbors (±~4 cues).** An explicit signal sets the number for the whole exchange: a nearby `you guys` → the adjacent bare `you` are plural; a single named addressee (`Zoro, you…`) → adjacent bare `you` are singular. **Reset at a scene break** (large time gap, or speaker/addressee changes). ~43% of bare `you` get resolved this way.
   - **c. Default singular** when no signal — most scenes are one-on-one; flip to plural only when the scene clearly addresses a group (the crew together, a named group, a commander to his unit).
   - Numerals + plural verbs agree too (`שני אנשים` m / `שתי רגליים` f; `אתם יודעים`, imperative `קחו`/`רוצו`).
7. **Never mix genders for one referent inside a line** (`מת` + `מתקוממת`).

## Self-check before done (REQUIRED)
1. `node scripts/lint-subs.js "subtitles/.../<ep>"` → resolve flagged word-splits, dup cues, untranslated English. (Long single-lines that have no `\N` in the source are OK — they wrap in-player.)
2. `node scripts/lint-gender.js "subtitles/.../<ep>"` → resolve flagged gender flips / name+verb mismatches.
3. Enies Lobby (fedew) only: `node scripts/check-number.js <EL number>` → resolve cues where the English is explicitly plural (`you guys/all/two`) but the Hebrew went singular (`אתה`). Other arcs have no number script; the QA pass (step 5) covers this check.
4. **Name consistency:** `lint-subs` flags only a short list of known misspellings (`NAME_VARIANTS`, e.g. סול, ספנדם); check every other name against `docs/characters.json`. Zero off-registry spellings allowed.
5. **Gender/number QA pass (the real gate):** re-read EACH cue against the **English source line** + the registry, using a ±~4-cue context window for number/addressee. For every verb/adjective/pronoun/numeral, confirm it agrees with the scene's speaker/addressee/referent. This catches the internally-consistent-but-wrong gender/number that no lint can. Fix in `.ass` AND `.srt` identically.
6. **.srt ↔ .ass** dialogue text consistent.
7. **Three gates ran on this file** (un-calque, voice, you/attacks) before `build`. If the episode was translated by a subagent, the parent still spot-checks 8 calque-looking lines + every split attack sequence.

## Common mistakes → fix
| Symptom | Fix |
|---|---|
| Name spelled differently in another ep (סול vs סאול) | Registry spelling, everywhere. |
| Male character gets feminine verb (Saul) | Track speaker; use registry gender. |
| Plural where scene is one person (or vice-versa) | Use the on-screen scene, not English "you". |
| "good time"=זמן טוב, "you look bad"=אתה נראה רע | Natural Hebrew, not calque. |
| Everyone sounds like the same narrator | Voice card (process step 2); rewrite that speaker. |
| Jet/Bazooka swapped across two cards | One piece per cue, English order. |
| Word broken across two lines | Wrap at word boundaries only. |
| Buster Call / attack names in English | Glossary / Hebrew. |
| Scene continues into next episode but names/terms change | Re-load registry + glossary every episode. |
