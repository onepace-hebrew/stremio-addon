# Native-reader sample of recent fedew AI Hebrew: rate and typology of bookish / translated-sounding lines

Sample: EL_15, TB_9, SAB_7, IM_4, MA_6, MA_1 (2,014 dialogue lines). Every flag, with its English, trigger, rewrite and post-triage verdict, is in `fedew-flags.tsv` (same folder, 245 rows).

How to read citations: `TB_9:103` means entry `i=103` of `scripts/onepace-translations/TB_9.he.json` (English: same `i` in `TB_9.cues.json`). EL_15 has no he.json, so `EL_15:139` is the 0-based Dialogue event 139 of `subtitles/fedew/17 Enies Lobby/15/enieslobby 15 he.ass`. Its English is the official `[One Pace][407-408] Enies Lobby 15 [1080p].ass` (one-pace/one-pace-public-subtitles, blob 13d3d90), aligned by start time (243 of 244 events matched; the unmatched one is the credit line).

Whose judgment: every "unnatural" call below is **my own judgment**. I am an AI model reading as a stand-in for a native Israeli viewer, not a human Israeli. To calibrate it, I checked each recurring pattern against the human-gold files (rule from memory `translation-prevention`: "check a proposed tell against the human files before banning it").

---

## 1. How widespread are bookish or translated-sounding lines in recent fedew episodes?

### Takeaway
I flagged 245 of 2,014 dialogue lines on a blind, Hebrew-only read. After checking the English and the human baseline, 221 stand: **11.0 per 100 lines**, of which 40 are high-confidence "what did I just read" lines (**2.0 per 100**). The rate depends almost entirely on **when the episode was made**. June-era EL_15 and TB_9 sit at about 20 per 100. SAB_7 (August) is at 11.6. IM_4, which had a rewrite pass, and MA_6, from the October batch, are near 6. MA_1, after the two-reader native gate, is at 2.5.

### Cited Findings
- **Method.** Each episode was read in order, Hebrew only (`node scripts/build-onepace-episode.js review-input <ID>`; EL_15 was extracted from the .ass). Flags were saved to scratch files *before* I opened any English. Only after that did I open the English, record the trigger and a rewrite, and assign a verdict. No flags were added while the English was open. The one exception is EL_15:141, which I had decided blind but left out of the lock file by mistake.
- **Per-episode results** (lines = rendered dialogue lines: Main, Thoughts, Flashbacks and Secondary styles; lyrics, captions, titles and credits excluded):

| Episode | Made (commit) | Review it had | Lines | Blind flags | High | Confirmed | Confirmed/100 | High/100 |
|---|---|---|---|---|---|---|---|---|
| EL_15 | 2026-06-16 `ccd8a49` | gender/number QA only (`85041f0`) | 241 | 54 | 9 | 48 | 19.9 | 3.7 |
| TB_9 | 2026-06-25 `4907af8` | none | 414 | 93 | 19 | 88 | 21.3 | 4.6 |
| SAB_7 | 2026-08-29 `f337370` | none | 327 | 44 | 5 | 38 | 11.6 | 1.5 |
| IM_4 | 2026-09-21 `28262c3` | un-calque/voice rewrite, 50/401 lines changed (`IM_4.rewrite-log.txt`) | 373 | 22 | 3 | 20 | 5.4 | 0.8 |
| MA_6 | 2026-10-06 `08bc5ff` | none (made after the batch instructions with "three gates on first write" existed: `_INSTRUCTIONS.txt`, `_IM_BATCH.txt`; I did not confirm which file the MA batch used) | 301 | 20 | 3 | 18 | 6.0 | 1.0 |
| MA_1 | `08bc5ff` + 2026-10-18 `a04d2aa` | native gate: 2 blind readers + 1 re-read, "43 lines rewritten" | 358 | 12 | 1 | 9 | 2.5 | 0.3 |
| **All** | | | **2,014** | **245** | **40** | **221** | **11.0** | **2.0** |

- **What "confirmed" excludes** (`fedew-flags.tsv`, column `verdict`). I flagged 24 lines by ear but did not count them:
  - **house-norm (16):** the human gold uses the same form at the same rate or higher, or a house rule prescribes it.
  - **weak (5)** and **contested (1)**: details in the TSV.
  - **voice-ok (2):** archaic speech that fits the character (Kuma, Ryuma).
- **Arc-level signal from a corpus scan supports the same gradient.** I summed 18 regex "tells" that are frequent in AI files and rare in human ones (§5), per 10k rendered lines of fedew AI files:

| Arc | Tells per 10k lines |
|---|---|
| Enies Lobby | 124 |
| Post-Enies Lobby | 103 |
| Thriller Bark | 148 |
| Sabaody | 102 |
| Amazon Lily | 48 |
| Impel Down | 81 |
| Marineford | 36 |

  (Scan of every `git ls-files subtitles/fedew` ` he.ass`; script and output in scratch, method in §5.)

### Inferences
- (Mine) The 63 fedew episodes made in June–August (EL, PEN, TB, SAB) probably carry about 10–20 bookish or translated lines per 100. At roughly 400 lines per episode, that is 40–80 lines per episode, 8–20 of them the jarring kind. Of everything in the sample, these episodes are the most likely to bother the user.
- (Mine) The process changes compound. The IM rewrite pass and the newer batch instructions cut the rate about 3.5 times (about 21 → 6 per 100). The native gate cut it about 2.5 times more (6 → 2.5). The gate works, but only MA_1 and IM_7 have been through it.
- (Mine) Rules written on 2026-10-18 (learnings §1.5) were never applied retroactively. Lines on that list, or on the user's own list, still ship in unreviewed episodes:
  - `נגמר לנו/להם`: IM_4:17, IM_4:391, MA_6:35
  - `אסיר תודה`: TB_9:400
  - "takes me back" rendered `ימים רחוקים`: MA_6:33

### Gaps
- These are one reader's judgments. The IM_7 calibration in `_NATIVE_REVIEW.txt` shows that one reader misses a lot: a second reader found 12 new issues. Treat my rates as **lower bounds**.
- The user has not ruled on any of these flags. My categories and confidence levels are mine.
- MA_6 vs MA_1 is not a controlled comparison (different content and different speakers).
- Side observations I did not investigate:
  - EL_15 event 0 reads `תרגום לעברית — That One Gerbil`, a human-translator credit inside an AI file.
  - Two term drifts: TB_9:162 `כפי התאומים` vs the glossary's `כיפות התאומים` (`docs/translation-glossary.json` "Twin Capes"); MA_6:96 `בכור הים` for "Knight of the Sea", while IM_2, IM_6, IM_9 and MA_5 use `אביר הים`.

---

## 2. What types of unnaturalness are there, and which English patterns trigger them?

### Takeaway
Two families make up most of the problem: **English syntax kept in Hebrew** (B, 34% of confirmed flags) and **written-register vocabulary or morphology in speech** (A, 28%). Literal idioms (C, 13%) and wrong word senses from polysemous English (F, 10%) come next. Among high-confidence flags, A leads (18 of 40) and B follows (13). Almost every flag traces back to a recognisable English pattern, so the problem can be fixed by rule.

### Cited Findings
- **Category split, confirmed flags (n=221):** B 76 (34%) · A 62 (28%) · C 29 (13%) · F 21 (10%) · E 12 (5%) · I 8 (4%) · G 7 (3%) · H 3 · D 3. High-confidence (n=40): A 18, B 13, C 5, F 2, G 1, D 1 (`fedew-flags.tsv`).
- **G is undercounted.** When a casual character used a bookish word, I coded it A. 34 of the 62 A flags are in the mouths of casual or young speakers (Luffy, Zoro, Franky, Usopp, Sanji, Chopper, Nami, Buggy, Bon Clay, Kid), so in practice they are register mismatches.

**A — bookish vocabulary or morphology** (English trigger → Hebrew → natural rewrite):
- TB_9:80 Zoro, "have been confirmed" → `...אומתו, אוסופ?` → `אז ראית את הזומבים של לופי והטבח, אוסופ?`
- TB_9:103 Franky, "go out in public" → `אם תצא לרשות הרבים...` (a legal term) → `אם תסתובב ככה ברחוב...`
- TB_9:234 Luffy, "Though, I wanna see mine." → `אם כי, אני רוצה לראות את שלי.` → `אבל את שלי דווקא בא לי לראות.`
- TB_9:186 Brook, "As for myself..." → `ובאשר לי...` → `ואני...`
- Suffix possessives:
  - EL_15:139 Kalifa, "whose entire body lathers" → `שכל גופה מקציף` (`גופה` also reads as "corpse") → `כל הגוף שלי מקציף`
  - IM_4:271 Sadi → `צימאונם לדם` → `הם כבר מתים לטעום דם...`
  - MA_1:341 Sengoku, "The execution of this man..." → `הוצאתו להורג של האיש הזה קובעת הכל.` (suffix plus `של`, a double possessive) → `להוצאה להורג של האיש הזה יש חשיבות עליונה.`
- Literary set phrases:
  - SAB_7:207 Kizaru `יהיה אשר יהיה` → `בכל מקרה`
  - TB_9:310 Usopp `תעשו כרצונכם` → `תעשו מה שבא לכם`
  - TB_9:352 Hogback `אירוע מכונן` → `חתונה זה דבר שקורה פעם בחיים`
  - TB_9:400 `אסיר תודה` → `מודה לי`

**B — English syntax calques:**
- Gerund or abstract subjects:
  - EL_15:109 "Isn't solving a mystery like that one of the true joys of..." → `פתירת תעלומה כזו היא לא אחת מההנאות האמיתיות של קרב...?` → `זה כל הכיף בקרב נגד משתמשי פרי שטן, לא? לפצח את הסוד.`
  - TB_9:113 "Having such insignificant existence and acting all chivalrous" → `להחזיק בקיום כל כך חסר משמעות ולהתנהג באבירות` → `לחיות חיים כאלה בלי שום טעם, ועוד לשחק אותה ג'נטלמן`
- Fixed English frames:
  - EL_15:98 "Did I hear you wrong?" → `שמעתי אותך לא נכון?` → `לא שמעתי טוב?`
  - TB_9:146 "I can't help but think" → `אני לא יכול שלא לחשוב ש` → `אני בטוח ש...`
  - TB_9:217 "Now that we're fully aware of the situation" → `עכשיו כשאנחנו מודעים לגמרי למצב` → `טוב, עכשיו כשהכל ברור`
  - SAB_7:333 "on the verge of becoming slaves" → `על סף להפוך לעבדים` → `כמעט נהיינו עבדים`
  - SAB_7:326 "Never mind me!" → `לא חשוב עלי!` (not Hebrew) → `עזבי אותי! העיקר שאת בסדר!`
  - SAB_7:295 "I got a good glimpse of the insanity that makes X so notorious" → `קיבלתי הצצה טובה לטירוף שבגללו... ידוע לשמצה` → `עכשיו ראיתי מקרוב את הטירוף ש... מפורסם בו`
- "Hurry up and V":
  - EL_15:58 `תזדרז ותבריא כבר` → `תבריא כבר`
  - IM_4:259 `תזדרז ותצא` → `צא כבר`
- "too" placed last:
  - TB_9:227 `אתה בא גם` → `גם אתה בא`
  - TB_9:280 `קרוקודייל היה גם` → `גם קרוקודייל היה`
  - TB_9:266 `אני אלך גם עם סאנג'י` changes the meaning → `גם אני הולך עם סאנג'י`
- Tag and hedge calques:
  - TB_9:104 "you know" → `אתה שלד מדבר, אתה יודע.` → `הלו, אתה שלד מדבר.`
  - TB_9:84 "I see." → `אני מבין.` → `אה, הבנתי.`
  - MA_1:100 "Why don't you two just get off?" → `למה ששניכם לא תרדו?` (`למה ש` means "why would") → `אז שניכם פשוט תרדו.`

**C — literal idioms and wrong collocations:**
- SAB_7:151 "a heap of trouble" → `הכנסת את עצמך לערמה של צרות` → `הסתבכת לא רע`
- TB_9:102 "while we're at it" → `כל עוד אנחנו בעניין` → `וכבר שאנחנו בזה`
- EL_15:40 "fight back" → `להחזיר מלחמה` (a mixed idiom) → `להילחם`
- The user's own patterns, recurring:
  - MA_6:33 "That sure takes me back" → `ימים רחוקים...` → `איזה זיכרונות...` (the same trigger the gate fixed at MA_1:173)
  - "we're done for" → `נגמר לנו/להם` (IM_4:17, IM_4:391, MA_6:35) → `הלך עלינו` / `הם גמורים`
- More idiom calques:
  - SAB_7:192 "one thing after the other" → `זה דבר אחרי דבר` → `צרה אחרי צרה`
  - SAB_7:220 "It's all about smiles" → `הכל סובב סביב חיוכים` → `עכשיו הכל זה חיוכים`
  - SAB_7:213 "no laughing matter" → `זה לא עניין מצחיק` → `זה לא צחוק`
  - MA_6:42 "come to take my head" → `באת על הראש שלי` → `באת בשביל הראש שלי`
  - IM_4:126 "trump card" → `קלף הניצחון` → `הקלף המנצח`

**F — wrong sense of a polysemous English word:**
- TB_9:388 "Show yourself!" → `תראה את עצמך!` (means "look at yourself!") → `צא מהמחבוא!`
- IM_4:99 "you won't escape with just a burn" → `לא תסתפק בכוויה` ("won't settle for") → `זה לא ייגמר בכוויה`
- EL_15:14 "Wrong one!" → `לא נכון!` → `לא זאת!`
- SAB_7:210 "Allow me to go" → `תן לי ללכת` ("release me") → `אני אלך`
- TB_9:196 "with my life" → `בחיי` (reads as "I swear") → `בכל מחיר`
- Single-word senses:
  - TB_9:117 "nosy" → `סקרן`
  - IM_4:334 "helpless" (meaning hopeless) → `חסרי אונים`
  - MA_6:67 "simple-minded" → `ריקים`
  - MA_6:96 "Knight" → `בכור`
  - EL_15:69 and EL_15:232 discourse "Now," → temporal `עכשיו`
  - MA_1:31 "after all" → `בסוף`

**D — anime stock phrases:**
- TB_9:368 "I expect no less from the Ghost Princess" → `לא ציפיתי לפחות מנסיכת הרפאים` (the user's `כצפוי מ` family) → `נסיכת הרפאים, מה אפשר לומר.`
- TB_9:76 "unforgivable" → `ממש בלתי נסלח!` → `על זה הוא עוד ישלם!`
- SAB_7:61 "Who do you take me for?!" → `מי את חושבת שאני?!` → `מה, את לא מכירה אותי?!`

**E — wordy, not condensed:**
- EL_15:229 "the only feeling... is a sense of guilt" → `ההרגשה היחידה... היא תחושת אשמה` → `כל מה שתרגישי זה אשמה`
- Double hedges:
  - TB_9:142 `אני משער שהוא בטח`
  - SAB_7:202 `אני מאמין שייתכן ש`

**G — register mismatch:**
- TB_9:184 Brook, "overcome the challenges of the Grand Line" → `להתגבר על האתגרים` (corporate) → `הקו הגדול היה חזק מאיתנו`
- TB_9:297 Luffy `זה מובן מאליו!` → `ברור!`
- SAB_7:280 Kid `אין ספק בכך` → `אין ספק`
- MA_6:80 Whitebeard `תנהלו את כל הפיראטים` (managerial) → `תפקדו על...`

**H — interjections:**
- EL_15:206 "Good grief!" → `אוי ואבוי!` → `וואי!` / `אוף`
- IM_4:193 "freaking dumbass" → `אידיוט ארור` → `יא טמבל`
- TB_9:44 "Hey, big trouble!" → `היי, צרה גדולה!` → `חבר'ה, יש בעיה רצינית!`

**I — other: garbled or over-condensed** (new in the October batch):
- MA_6:11 "I'll take the outstretched hand that saves me" → `יד ששולחים להציל, אני תופס...` → `אם מושיטים לי יד להציל אותי, אני אתפוס אותה...`
- MA_6:95 "sharp intuition won't be enough to stop fate" → `חוש חד לא עוצר גורל!`, a pseudo-proverb
- MA_6:286 Mihawk → `הילד שהובטח לדור הבא...`
- EL_15:66 and EL_15:68 Kumadori: a three-line English sentence recast so that its predicate is orphaned (`תשוב, צבועים בארגמן`)

### Inferences
- (Mine) Most of A and B share one root: the line is built **from the English noun phrase**, not from what the character *does*. Spoken Hebrew carries meaning in verbs. Nominalisations, suffix possessives and "the X of Y" chains are written-register tools.
- (Mine) F errors are invisible to a Hebrew-only reader who doesn't suspect a relay, and invisible to a lint. They are detectable from the **English side**: a list of polysemous triggers ("Show yourself", "Wrong", "simple", "Allow me", "with my life", "Now,", "just", "after all") can be checked against the Hebrew.
- (Mine) Category I is a new failure mode. The newest batch over-corrects toward short, punchy lines and drops the subject, the verb or the relative clause, until the line becomes a riddle.

### Gaps
- One line often fits two categories. I recorded only the primary one, so the distribution is approximate.
- I did not flag attack names or captions (house convention), and I did not flag Kumadori's kabuki register unless the meaning broke.

---

## 3. What still slips through the native-review gate? (MA_1 residual)

### Takeaway
After two blind readers and one re-read (43 lines rewritten), MA_1 still has **9 confirmed lines (2.5 per 100), 1 of them high-confidence**. That is about a sixth of all the issues the gate and I found together. Seven of the nine are lines the gate never touched, and all seven are **formal-register** lines: authority figures, narration, polite speech. They read as "correct but bookish", and the gate prompt does not ask about that. One of the nine was **made more bookish by the gate's own fix**.

### Cited Findings
- **The gate's record** (`scripts/onepace-translations/MA_1.native-review.txt`):
  - Round 1: two readers, "R1 27 flags, R2 26, 21 shared, union 32. All fixed."
  - Round 2 re-read: 9 more fixed, 2 kept.
  - Commit `a04d2aa`: "43 lines rewritten".
- **My blind read** (done before opening that record): 12 flags. After the English and the record: **9 confirmed, 2 weak, 1 contested** (`fedew-flags.tsv`, MA_1 rows).
- **Untouched by the gate (7):**
  - MA_1:341 (high) `הוצאתו להורג של האיש הזה קובעת הכל.` A double possessive in Sengoku's speech.
  - MA_1:351 Sengoku `הוליד ילד`. Biblical "begat", for "conceived a child".
  - MA_1:7 `הביא אותך הנה`. Archaic directional `הנה`, for "destined to come here".
  - MA_1:11 `החיים והמוות בידי השמיים`. The idiom is `בידי שמיים`.
  - MA_1:31 "after all" → `בסוף`.
  - MA_1:100 "Why don't you" → `למה ששניכם לא תרדו?`
  - MA_1:346 "What's this all about?" → `על מה כל זה?`
- **Fixed, but the calque survived (1):** MA_1:16. The record says `"once again" opener → ברוך הבא`, but the shipped line is still `שוב, ברוך הבא אלינו.`
- **Introduced by the gate (1):** MA_1:323. The record says `אנשים שלי → אנשיי`. The fix swapped an analytic-possessive calque for the bookish suffix form. Natural: `חבר'ה!`
- **Gate fixes I still flagged, but weakly:**
  - MA_1:54. The gate chose `ל → בשביל`; colloquial `בשביל` meaning "considering" does exist, so this one is contested.
  - MA_1:266. The gate's fix `זקן לבן או לא` is better than the old line, but still an "X or not" frame.
- **The gate prompt** (`_NATIVE_REVIEW.txt`) asks for lines "a native Hebrew speaker would NOT say out loud... odd... only makes sense if you imagine some other language behind it". It tells readers *not* to flag "theatrical villain speech that is natural for the genre". It never asks whether a line is **too formal or literary for this speaker**.

### Inferences
- (Mine) The two readers agreed on 21 of about 27 flags each. That suggests they share blind spots: same model, same prompt. A third reader of the same kind adds little. A reader primed with an explicit **register checklist** (literary words, suffix possessives, `האם`-questions, double possessives) would catch the kind of residual I found.
- (Mine) The fixer works with the English open and sometimes "un-calques" by moving *toward* written Hebrew: MA_1:323 `אנשיי`, and the `שמי ג'ינביי` fix at MA_1:68, which is fine for Jinbe but is the same reflex. Fixes need the same register check as first drafts.
- (Mine) A residual of about 0.3 high-confidence lines per 100 (about 1 per episode) is probably below what the user will notice. Medium formal-register lines at about 2 per 100 (about 7 per episode) are exactly what the user describes as "bookish".

### Gaps
- The record lists line numbers and short reasons, not the old text. I could not see what the 32 round-1 flags looked like before the fixes, except where the reason quotes them.
- I am a single reader; the gate's own calibration says a fresh reader always finds more.

---

## 4. Do flags cluster on particular speakers or scene types?

### Takeaway
Flags cluster by **scene type and line length** more than by character. They pile up in expository or backstory monologues and power explanations, and they climb steeply with line length. By character there are two distinct failure modes:
- **Casual characters** get bookish words (register mismatch).
- **Formal or polite characters** get English syntax rendered as literary Hebrew ("polite" turned into "archaic").

### Cited Findings
- **Line length** (confirmed flags per 100 lines, all six episodes):
  - 1–4 words: 5.7 (57 of 1,006)
  - 5–9 words: 14.5 (126 of 867)
  - 10+ words: 27.0 (38 of 141)
- **Scene clusters** (confirmed flags / lines in the scene):
  - TB_9 Franky questions Brook in flashback (i=97–200): 35/104, a third of the lines.
  - EL_15 Nami vs Kalifa, where Kalifa explains her power (i=96–182): 23/87.
  - EL_15 Spandam explains the bridge (i=209–237): 7/29.
  - TB_9 Sanji's Laboon recap (i=162–168): 5/7.
  - MA_1 Sengoku's reveal about Ace's father (i=339–372): 3/34. Fewer, but it holds the episode's only high flag.
- **By speaker group** (confirmed):
  - Formal or theatrical speakers, 112 flags: B 41, A 27, C 18, F 11.
  - Casual or young speakers, 104 flags: A 34, B 32, C 10, F 10.
  - Top speakers: Franky 18, Brook 17, Kalifa 14, Sanji 14, Luffy 12, Rayleigh 11, Nami 9, Usopp 8, Zoro 7.
- **Bookish words in casual mouths:**
  - Zoro: `אומתו` (TB_9:80), `לפני זמן מה` (TB_9:289), `לפתע` (TB_9:442), `נניח בצד את העובדה ש` (TB_9:431)
  - Luffy: `אם כי` (TB_9:234), `מכיוון ש` (TB_9:254), `סחור-סחור` (IM_4:211)
  - Franky: `לרשות הרבים`, `זוכים לבוז`, `צר לי לומר`, `אסיר תודה` (TB_9:103, 106, 129, 400)
  - Usopp: `כרצונכם`, `תישא`, `אין שום ערובה` (TB_9:310, 287, 294)
  - Bon Clay: `אכן`, `אין לנו צורך ב` (IM_4:95, 208)
- **Polite rendered as literary:**
  - Brook: `בלתי מקוימת`, `מוטל עלי לעדכן אותו`, `לבקש מחילה`, `ובאשר לי` (TB_9:123, 124, 149, 186)
  - Kalifa: `להישבות בקסם המראה שלי`, `מה האימה שבכוח הזה` (EL_15:153, 166)
  - Kizaru: `יהיה אשר יהיה` (SAB_7:207)
  - Rayleigh: SAB_7:150, 151, 283, 289
- **Comedy** is not clean. The Buggy and Bon Clay banter in IM_4 (i=193–216) has 6 flags in about 24 lines, mostly A and H. **Fight shouting** and attack calls carry almost no flags.

### Inferences
- (Mine) Brook's TB_9 backstory and Kalifa's explanation are the long, talky stretches where the AI renders polite English 1:1. In Japanese and English those characters are *polite*. Polite Hebrew is standard spoken Hebrew with `סליחה`/`בבקשה`/`תודה`, not the written register.
- (Mine) A lint that knows the speaker (cues.json has a `name` field in TB, and in some IM/MA episodes) and flags literary words in casual mouths would be high-precision. The voice cards in `_INSTRUCTIONS.txt` (Luffy "blunt", Buggy "loud coward", and so on) already define the casual set.

### Gaps
- Speaker names come from the `name` field only in TB_9. For the other episodes I attributed speakers from context, and some (marked `?` in the TSV) are guesses.
- Six episodes are too few to separate character effects from scene effects statistically.

---

## 5. Which recurring patterns will repeat across the corpus, and which can a search detect?

### Takeaway
Many of my patterns are **far more frequent in AI files than in the human gold**, so a word or regex scan can triage all ~340 AI episodes. Several of my "tells", though, are **used just as much by the human translator** (`הו`, `בהחלט`, `בוודאי`, `ובכן...`, `זה רע!`, `כמה + adj`). That makes them house-norm and they should not be banned. Regexes catch only about 1 in 6 of the lines I flagged, so the scan triages; it does not replace a register-aware blind read.

### Cited Findings
- **Corpus scan:** every Dialogue line (lyrics, captions, titles and credits excluded) of 20 human ` He.ass` files (9,027 lines, mostly East Blue arcs in `subtitles/main`, plus EL04), 86 fedew AI ` he.ass` (36,447 lines) and 257 main/ AI ` he.ass` (121,010 lines). Files listed with `git ls-files subtitles`; the scan matches the exact case of ` He.ass` (capital H = human) vs ` he.ass` (AI).
- **Discriminating patterns** (rate per 10k lines; human vs fedew AI vs main/ AI; total AI hits):

| Pattern | Human | fedew AI | main AI | AI hits |
|---|---|---|---|---|
| line-initial `האם` | 3.3 | 5.2 | **44.0** | 552 |
| `אכן` | 1.1 | 6.6 | 9.6 | 140 |
| `אינו/אינני/אינך…` | 1.1 | 2.2 | 7.0 | 93 |
| line-initial `עכשיו,` (discourse "Now,") | 5.5 | 20.6 | 16.3 | 272 |
| `לעולם לא/אל` | 7.8 | 15.1 | 19.2 | 287 |
| `אם כי` | 0 | 6.6 | 4.5 | 79 |
| `שכמותך` | 0 | 11.0 | 2.0 | 64 |
| `תזדרז ו-V` ("hurry up and") | 0 | 10.7 | 0.2 | 41 |
| `אסיר תודה` | 0 | 4.4 | 2.2 | 43 |
| `זמן מה` / `לעת עתה` | 0 / 0 | 2.7 / 1.4 | 3.8 / 2.6 | 56 / 36 |
| suffix `כוחך/כוחו…` / `חבריו/חבריי…` | 0 / 0 | 3.3 / 1.6 | 3.5 / 1.2 | 54 / 21 |
| `כצפוי מ` / `לא ציפיתי לפחות` | 0 | 3.8 | 0.4 | 19 |
| `אני מבין.` (I see) | 2.2 | 6.9 | 2.6 | 57 |
| tag `, אתה יודע / את יודעת` at line end | 1.1 | 3.3 | 2.0 | 36 |
| `לחלוטין` | 2.2 | 4.4 | 5.0 | 76 |
| `מכיוון ש/מאחר ש` | 4.4 | 7.1 | 7.7 | 119 |
| `X ארור` (damn X) | 0 | 2.7 | 1.2 | 24 |
| `אוי ואבוי` | 0 | 2.5 | 0.6 | 16 |
| `מה העניין עם` | 0 | 2.2 | 0.2 | 10 |
| `בלתי נסלח` | 0 | 1.6 | 0.7 | 14 |
| `גם` at line end | 4.4 | 6.0 | 10.1 | 144 |
| `נגמר לנו/להם!` | 0 | 0.8 | 0.1 | 4 |

- **Not discriminating:** the human gold uses these as often as the AI, or more:

| Pattern | Human | fedew AI | main AI |
|---|---|---|---|
| `הו` interjection | 62.0 | 41.2 | 11.8 |
| `בהחלט` | 33.2 | 23.0 | 11.2 |
| `בוודאי` | 14.4 | 1.9 | 6.9 |
| `ובכן` | 13.3 | 17.0 | 33.7 (main is 2.5×) |
| `זה רע!` | 5.5 | 5.5 | 5.5 |
| `כמה` + adj exclamation | 3.3 | 4.9 | 2.4 |
| `, אתה אומר?!` | 2.2 | 1.6 | 0.7 |
| `לחמוק מזה` | 2.2 | 0.3 | 0.3 |
| causative `גרם ל-X ל-V` | 6.6 | 3.6 | 8.6 |
| `בצורה` + adj | 1.1 | 1.4 | 1.2 |
| clefts | 2.2 | 1.9 | 2.1 |
| `מעולם לא` | 15.5 | 18.7 | 18.7 |
| `כתמיד` | 1.1 | 1.1 | 0.5 |

  Human examples: `הו? אתה רוצה להלחם בי?`, `זה רע! הם דוחקים את זורו לפינה!`, `כמה פתטי...!`, `משקל, אתה אומר?`, `בנאדם! זו הייתה הפתעה!`. These are why my `הו`, `ובכן...`, `בנאדם!`, `זה רע!` and `כמה+adj` flags are marked `house-norm` in the TSV.
- **House rules behind some of these:** learnings §2 rule 6 prescribes `הו/או` for "Oh" (`docs/translation-learnings.md`), and the batch instructions map `Whoa → בנאדם!` (`scripts/onepace-translations/_INSTRUCTIONS.txt`). Learnings §1.5 lists `זה רע!` → `זה לא טוב!` as a fix, yet the human gold uses `זה רע!` at the AI's rate.
- **Recall:** the 20 strongest regexes produce 37 hits across the six sampled episodes, against 221 confirmed flags, so they catch **at most about 17%** of what I flagged. Not every hit is on a flagged line, so true recall is lower.
  - Hits per episode: EL_15 7, TB_9 19, SAB_7 3, IM_4 5, MA_6 1, MA_1 2.
  - The ranking of the episodes by regex density roughly matches my ranking (Spearman ≈ 0.7, n=6). SAB_7 is under-detected: its problems are syntax and idiom calques, not vocabulary.
- **The 10 most common recurring patterns in my sample** (likely corpus-wide, with fix type):
  1. Literary function words and adverbs in speech (`לפתע, אם כי, מכיוון ש, לחלוטין, אכן, לעת עתה, זמן מה, ככל ש…כך, ובאשר ל, יהיה אשר יהיה, כרצונך, מוטב, צר לי, תישא, האם`). About 25 sample flags. **Searchable.**
  2. Suffix possessives on everyday nouns, and double possessives (`חבריו, כוחך, תקוותך, גופה, צימאונם, בראשו, אנשיי, הוצאתו…של`). About 12. **Searchable** with a stem list.
  3. Gerund or abstract-noun subjects and noun chains in exposition (EL_15:109, TB_9:113, TB_9:296, SAB_7:295, MA_1:341). About 12. Needs a reader.
  4. English idioms rendered literally (heap of trouble, done for, takes me back, fight back, what's with, it's all about, no laughing matter, one thing after another, trump card). About 29. **Searchable from the English side** with an idiom table.
  5. Polysemous English words in the wrong sense (Show yourself, Wrong!, Allow me, with my life, simple, nosy, helpless, Knight, after all, just, discourse "Now,"). About 21. **Searchable from the English side**.
  6. Discourse and tag calques (sentence-final `אתה יודע`, `אני מבין.`, `עכשיו,`, `למה ש…לא`, "X or not", "I'd say", "I have no complaints but"). About 14. Partly searchable.
  7. "Hurry up and V" (`תזדרז ו…`): 3 in the sample, 41 in the corpus. **Searchable.**
  8. `גם` placement and other English word order (TB_9:227, 266, 280; SAB_7:263). Partly searchable (line-final `גם`).
  9. Anime stock phrases (`לא ציפיתי לפחות/כצפוי מ`, `בלתי נסלח`, `מי את חושבת שאני`, `X שכמותך`, `X ארור`). **Searchable.**
  10. Over-condensed lines that read as riddles (MA_6:11, 95, 286). New in the October batch; needs a reader.

### Inferences
- (Mine) The main/ AI corpus (121k lines, outside my sample's scope) has a different signature from fedew: line-initial `האם` at 13× the human rate, `אינו` at 6×, `ובכן` at 2.5×. That is formal-literary Hebrew more than English calque. If the user's complaint covers main/ too, these three words are the cheapest first sweep.
- (Mine) The fedew signature leans toward calque: `תזדרז ו`, `שכמותך`, `כצפוי מ`, `אוי ואבוי`, `מה העניין עם`, all concentrated in EL and TB.
- (Mine) A human-baseline ratio, as in the table, is the right way to decide which patterns become lint errors (ratio ≥ 3 and human rate ≈ 0) and which become warnings. Patterns the human gold uses freely (`הו`, `בהחלט`, `בוודאי`) need a user ruling before anyone touches them.

### Gaps
- The human gold is small (20 files) and mostly East Blue, which has fewer formal characters than later arcs. A zero there is weak evidence for rare patterns.
- I did not check precision: how many regex hits are acceptable in context. `לעולם לא`, `מכיוון ש` and `ובכן` have many legitimate uses.
- The counting script and its raw output are in my scratch folder, not in the repo: `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/native-fedew/corpus_count.js`, plus `corpus_count2.js` and `corpus_count3.js`. The regexes are as named in the tables.

---

## Actionable rules for our translator

Ranked by expected impact (frequency in the sample × how jarring × corpus prevalence). Format: **pattern → why it is unnatural → natural alternative(s) → example** (`fedew-flags.tsv` has the full set).

1. **Build exposition around verbs, not English noun phrases. Split long lines.**
   - **Why:** the flag rate climbs from 5.7 per 100 (1–4 words) to 27 per 100 (10+ words). Gerund subjects, "the X of Y" chains and abstract nouns are written register in Hebrew.
   - **Instead:** make the doer the subject, use a finite verb, cut "of" chains, and allow two short sentences.
   - **Examples:**
     - EL_15:109 `פתירת תעלומה כזו היא לא אחת מההנאות האמיתיות של קרב...?` → `זה כל הכיף בקרב נגד משתמשי פרי שטן, לא? לפצח את הסוד.`
     - TB_9:296 `זה מגבלת הזמן הסופית שלנו!` → `בזריחה נגמר לנו הזמן!`
   - **Check:** if the English subject is an "-ing" phrase, or the line has two or more `של`, rewrite it.

2. **Keep literary function words out of dialogue.**
   - **Why:** they are written-Hebrew markers. Many are discriminating in the corpus, at human rate 0 or AI ≥ 3×.
   - **Banned outright** for casual and young speakers. For anyone else, at most one per line, and only if the voice card says formal or archaic (Jinbe, Ryuma, Kumadori, Hawkins).
   - **Replacements:**
     - `לפתע` → `פתאום`
     - `אם כי` → `אבל` / `למרות ש`
     - `מכיוון ש/מאחר ש` → `כי`
     - `לחלוטין` → `לגמרי`
     - `אכן` → `נכון` / `בדיוק`
     - `לעת עתה` → `בינתיים` / `כרגע`
     - `לפני זמן מה` → `קודם`
     - `זמן מה` → `קצת זמן`
     - `ככל ש… כך` → `כמה ש…, יותר…`
     - `בזה אחר זה` → `אחד אחרי השני`
     - `זה מזה` → drop it, or `אחד מהשני`
     - `ובאשר לי` → `ואני`
     - `יהיה אשר יהיה` → `בכל מקרה`
     - `כרצונך/כרצונכם` → `מה שבא לך/לכם`
     - `מוטב` → `עדיף`
     - `צר לי לומר` → `לא נעים לי (להגיד)`
     - `תישא` → `תיקח` / `תחזיק`
     - directional `הנה` → `לכאן`
     - `אסיר תודה` → `מודה`
     - `ויהי מה` → `לא משנה מה`
     - `הוליד` → `נולד לו`
     - line-initial `האם` → drop it (intonation and `?` carry the question)
     - `אינו/אינני` → `הוא לא` / `אני לא`
   - **Examples:**
     - TB_9:234 (Luffy) `אם כי, אני רוצה לראות את שלי.` → `אבל את שלי דווקא בא לי לראות.`
     - TB_9:80 (Zoro) `אומתו` → `ראית`

3. **Possessives: use `X של` in speech. Never use suffix plus `של`.**
   - **Why:** suffixed everyday nouns (`חבריו`, `כוחך`, `תקוותך`, `צימאונם`, `בראשו`) are written register (human rate 0), and some are ambiguous (`גופה` = "her body" or "corpse"). A double possessive (`הוצאתו להורג של האיש הזה`) is a red flag.
   - **Instead:** `החברים שלו`, `הכוח שלך`, `את הראש`. Or rephrase without a possessive (`לתלות תקוות ב…`).
   - **Exceptions:** frozen idioms such as `סיכנה את חייה`, `לדעתי`, `בעצמו`, and an aristocrat's `בני`.
   - **Also:** when un-calquing `אנשים שלי`, **restructure**. Do not suffix: write `חבר'ה!`, not `אנשיי!` (the gate's own slip at MA_1:323).

4. **Never render English idioms word for word. Use the Hebrew idiom from a table.**
   - **Why:** the literal version is grammatical but means something else, or nothing.
   - **Table** (extend it as idioms come up):
     - done for → `הלך עלינו` / `אנחנו גמורים`. Never `נגמר לנו`, which means "we ran out of".
     - takes me back → `איזה זיכרונות`. Never `מחזיר ימים` / `ימים רחוקים`.
     - as expected of / I expect no less from → `ככה זה עם X`, `X, מה אפשר לומר`. Never `כצפוי מ` / `לא ציפיתי לפחות מ`.
     - heap of trouble → `הסתבכת לא רע` / `צרה צרורה`
     - fight back → `להילחם` (or `להשיב מלחמה`). Never `להחזיר מלחמה`.
     - get away with it → `עוד תשלם על זה` / `זה לא יעבור לך בשקט`
     - while we're at it → `וכבר שאנחנו בזה`
     - what's with X → `מה הקטע עם X`
     - it's all about X → `הכל זה X` / `העיקר זה X`
     - no laughing matter → `זה לא צחוק`
     - one thing after another → `צרה אחרי צרה`
     - trump card → `הקלף המנצח`
     - life or death → `חיים ומוות`
     - let my guard down → `נתפסתי לא מוכן`
     - what are you playing at → `מה את עושה?!`
     - it's X's doing → `אלה ה-X`
     - Heaven decides → `בידי שמיים` (no article)
   - **Example:** SAB_7:151 `הכנסת את עצמך לערמה של צרות` → `הסתבכת לא רע, האצ'י.`

5. **False friends: check the English word's sense before choosing the Hebrew.**
   - **Why:** the relay through English passes on the wrong sense. A Hebrew-only reader sees a line that is grammatical but wrong.
   - **List:**
     - Show yourself → `צא מהמחבוא` / `תתגלה`. Never `תראה את עצמך`, which means "look at yourself".
     - Wrong (one)! → `לא זאת!`
     - Allow me to go → `אני אלך`. Never `תן לי ללכת`, which means "release me".
     - with my life → `בכל מחיר`. Never `בחיי`, which reads as "I swear".
     - simple (lowly) → `סתם`
     - nosy → `חטטן`
     - helpless (hopeless) → `חסרי תקנה`
     - troublesome → `מעצבנים` / `של צרות`
     - simple-minded → `פשוטים` / `טיפשים`
     - Knight → `אביר`
     - after all → `בסך הכל`
     - just (a moment ago) → `קודם` / `הרגע`
     - won't escape with just X → `זה לא ייגמר ב-X`
     - discourse "Now," / "Now then" → `טוב,` / `נו,` / `הנה`. Not temporal `עכשיו`.
   - **Example:** TB_9:388 `תראה את עצמך!` → `צא מהמחבוא!`

6. **Drop English frames, tags and hedges.**
   - **Why:** each one is legal Hebrew that only makes sense if you remember the English.
   - **Rules:**
     - "hurry up and V" → V + `כבר`, or `יאללה` + V. Not `תזדרז ו-V` (41 corpus hits, human 0).
     - "I can't help but think" → `אני בטוח ש` / `נראה לי ש`
     - Sentence-final "you know" → drop it, or open with `הלו,` / `נו,`
     - "I see." → `הבנתי` / `אה, ככה`
     - "Why don't you V" → `למה שלא תV?` / `אז תV`. Never split `ש…לא` around the subject.
     - "X or not" → `גם אם זה X`
     - "Did I hear you wrong?" → `לא שמעתי טוב?`
     - "on the verge of -ing" → `כמעט` + past tense
     - "Never mind me" → `עזוב אותי` / `העיקר ש…`
     - "too" → `גם` goes **before** the word it modifies (`גם אתה בא`)
     - One hedge per line (not `אני משער שהוא בטח`)
   - **Example:** EL_15:58 `תזדרז ותבריא כבר` → `יאללה, תבריא כבר.`

7. **Polite is not literary: formal or polite characters still speak modern Hebrew.**
   - **Why:** Brook, Kalifa, Rayleigh, Kizaru, Hawkins and Sengoku are polite in the source. The AI turns polite English into written Hebrew (`בלתי מקוימת`, `מוטל עלי`, `מחילה`, `להישבות בקסם`, `יהיה אשר יהיה`).
   - **Instead:** standard spoken Hebrew plus politeness markers (`סליחה`, `בבקשה`, `תודה`, `אדון/גברת`). Keep archaic register only for characters whose voice card says so (Kumadori's kabuki, Ryuma), and even there the line must parse.
   - **Example:** TB_9:123 Brook `כדי לא להשאיר את ההבטחה שלנו בלתי מקוימת...` → `וכדי שההבטחה שלנו לא תישאר באוויר...`

8. **Casual voices get casual words: a speaker-aware register check.**
   - **Why:** bookish words in the mouths of Luffy, Zoro, Franky, Usopp, Sanji, Nami, Chopper, Buggy, Bon Clay or Kid are the most jarring mismatches. They are 34 of the 62 A flags.
   - **Instead:** before writing a line for one of these voices, check it against rule 2's list. Corporate or managerial words (`אתגרים`, `לנהל`, `מגבלת זמן`, `מודעים למצב`) count too, in any mouth. See TB_9:184, Brook: `להתגבר על האתגרים` → `הקו הגדול היה חזק מאיתנו`.
   - **Example:** TB_9:106 Franky `דברים מכוערים תמיד זוכים לבוז.` → `מה שמכוער, כולם שונאים.`

9. **Anime stock phrases and insult forms.**
   - **Why:** these are translated-anime clichés that Israelis don't say.
   - **Instead:**
     - "unforgivable" → `על זה הוא עוד ישלם` / `זה לא יעבור בשקט`
     - "Who do you take me for?!" → `את יודעת עם מי את מדברת?!`
     - "damn X" → `X מחורבן` / `יא X`. Not `X ארור`.
     - "you X!" → `יא X!`. Not `X שכמותך` (64 corpus hits, human 0).
     - "Good grief" → `אוף` / `נו באמת` / `וואי`. Not `אוי ואבוי`.
   - **Example:** TB_9:368 `לא ציפיתי לפחות מנסיכת הרפאים.` → `נסיכת הרפאים, מה אפשר לומר.`

10. **Shorten without making riddles.**
    - **Why:** the newest batch over-condenses. It fronts the object, drops the subject or verb, and creates pseudo-proverbs.
    - **Instead:** keep subject and verb, and read the line alone: would a viewer get it at a glance? If not, add the two words back.
    - **Example:** MA_6:11 `יד ששולחים להציל, אני תופס...` → `אם מושיטים לי יד להציל אותי, אני אתפוס אותה...`

**Process changes that follow from these findings** (for the gate and for corpus detection):
- **(a)** Add a register question to the blind-reader prompt in `_NATIVE_REVIEW.txt`: "Is this too formal or literary for this speaker? Flag literary words, suffix possessives, `האם`-questions and double possessives even when the line is grammatical." Without it, formal-register lines pass (MA_1 residual, §3).
- **(b)** Apply the same register check to the *fixes* (MA_1:323).
- **(c)** Run the discriminating-pattern scan (§5) over all ~340 AI episodes to rank which ones to review first: TB, EL, PEN and SAB in fedew, and line-initial `האם`/`אינו`/`ובכן` in main/. Expect it to catch only about 1 in 6 problem lines.
- **(d)** Apply the user-ruled fixes corpus-wide now: `נגמר לנו/להם`, `מחזיר ימים`/`ימים רחוקים`, `אסיר תודה`, `כצפוי מ`/`לא ציפיתי לפחות`.
- **(e)** Ask the user to rule on the house-norm interjections my ear flags but the human gold uses: `הו?`, `בנאדם!` for "Whoa!", hesitation `ובכן...`, `זה רע!`, `כמה + adj`. Do this before anyone bans or keeps them.
