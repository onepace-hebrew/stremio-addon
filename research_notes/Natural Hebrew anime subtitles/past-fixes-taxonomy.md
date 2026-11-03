# Our own correction history: labeled dataset and taxonomy of unnatural Hebrew

Scope: every recoverable past naturalness fix in this repo (old Hebrew → new Hebrew, with the English source), categorized and counted. The notes cover the English triggers behind the fixes, whether the fixes themselves read naturally, and hypotheses H1–H4.
Companion data: `fixes.tsv` in this folder (297 labeled rows, columns explained under Q1).
Sources are cited as commit hashes or repo paths, not URLs. All "quality" ratings and suggested rewrites are **my judgment** (an AI reviewer reading the data), not the user's. The user should spot-check them.

---

## Q1. What past naturalness fixes exist, and how was the dataset built?

### Takeaway
There are 297 labeled fix pairs. 191 are "core" fixes: both native reviews, six one-line calque fixes, the logged examples from the translator's own rewrite pass, and the Enies Lobby 24/25 quality pass. The other 106 come from a random 150-row sample of the 2,268-cue Enies Lobby re-translation. Only two episodes (IM_7, MA_1) have ever had the blind Hebrew-only read. Most of the translator's own rewrites (392 lines in IM_3–8) were never committed in "before" form, so only 72 logged examples of them survive.

### Cited Findings
- **Native review IM_7**: 44 he.json lines changed. Round 1 was one reader on the full episode, with 32 flags plus 3 found by the parent. Round 2 was a fresh reader on the changed lines ±3 cues: 14 flags, 12 of them on lines round 1 had passed. Changes in f42f8b0; record in [IM_7.native-review.txt](../../scripts/onepace-translations/IM_7.native-review.txt).
- **Native review MA_1**: 42 he.json lines changed. Round 1 used two readers ("R1 27 flags, R2 26, 21 shared, union 32. All fixed"). Round 2 had 10 flags, 1 on a changed line, 8 fixed and 2 kept. Changes in a04d2aa; record in [MA_1.native-review.txt](../../scripts/onepace-translations/MA_1.native-review.txt).
- **One-line calque fixes** in AM_1 288, AM_4 476, IM_6 119, MA_8 13, PEN_3 492 and SAB_1 420. The commit message lists them as `passive "going to be", "that's all", "grateful to you", body calques` (commit f42f8b0).
- **Translator self-rewrite logs IM_3–IM_8**: the "three gates" pass changed 392 of 2,873 lines before commit 28262c3. By tag: calque 244, voice 130, you_or_attack 18. Each log keeps only 12 example rows (72 total). I kept 56 and excluded 16: 5 attack-name rows, 7 gender/number/person rows, 2 Ivankov ווי-convention rows and 2 terminology rows ([IM_3–8.rewrite-log.txt](../../scripts/onepace-translations/)).
- **Quality pass EL24/EL25** (commit 17200fb, "Quality pass: E24 (55) + E25 (10)"): 65 changed srt cues, 43 kept. Excluded: 5 wrap/orthography, 4 honorific/nickname, 3 terminology, 1 attack, 3 number/agreement, 1 house interjection (ואו→בנאדם), 1 orthography, 4 neutral.
- **Re-translation EL10–24** (commit ccd8a49, "literal English calque … into natural spoken Israeli Hebrew, adapted from the good main/ Hebrew"): 2,268 changed srt cues. Of these, 53 are wrap/orthography only, about 302 look inflection-only (gender/number, by heuristic), and 1,913 are content changes. From a random sample of 150 content changes I kept 106. The 44 excluded: 11 attack names, 8 names/terms, 11 garbled machine translation or unverifiable alignment, 6 gender/number, 2 interjection mappings, 6 neutral. About 71% of content changes were naturalness or accuracy fixes, which extrapolates to roughly 1,350 such cues in that commit.
- **Commits checked and excluded** (names, terms, orthography, gender, punctuation, attack names): b898279, 79aef88, 1467933, 2490e96, 4907af8 (Laboon/Hatchan/Miss All Sunday sync), 1e0b47a (honorific), c933f19 (nif'al yod), ee8c6ac and 480cf35 (terminology/orthography sweeps), 826ad77 (trailing periods), 85041f0, 3eb2d83 and 3c719df (gender/number), 83e9323 (names), 070a748 and 14ba532 (typeset attack names). Commit 08bc5ff mentions "calque rewrites" made before commit, which can't be recovered.
- **Where the English comes from.** For he.json rows it is `<ID>.cues.json` at the same commit; I added PEN_3 492 from the mirror ("Thank you for looking after me!", 0:28:23). For srt rows I paired cues by timing overlap with the JoeGeC/one-pace-subs mirror, which has the 25-episode Enies Lobby cut. The official repo only has the 10-episode main cut. The EL10 English is offset in places; 5 rows are marked "(alignment uncertain)".
- **Data-integrity findings:**
  - The rewrite logs don't match shipped text in 2 of 72 examples. IM_6 341's log says «בכור הים» ("firstborn of the sea") became «אביר הים» ("Knight of the Sea"), but HEAD still ships «בכור הים», a mistranslation. IM_5 177's log says «תחזיר!» but HEAD has «בחזרה!» ([IM_6.he.json](../../scripts/onepace-translations/IM_6.he.json)).
  - **A regression from 17200fb is still in HEAD**, in both .srt and .ass. At EL24 0:26:51 the line "Hey! Are you guys demons?!" (old «היי! אתם שדים?!», correct) was overwritten with a near-duplicate of the previous cue, «בדיוק מה שציפינו ממך, קפטן!» ("just what we expected of you, captain").

### `fixes.tsv` columns
- `commit, episode, i, english, old_he, new_he, category, note`, as requested. For srt-sourced rows, `i` is `t=<start time>`.
- Extra columns: `category2`, `english_trigger`, `trigger_family`, `speaker` (inferred from cue context), `new_quality`, `better_rewrite_if_new_is_off`, `source`.
- `note` carries the native-review reason or rewrite-log tag where one exists.

### Inferences
- The only signal that is independent of the English is the blind read. It covers 2 of the 61 he.json episodes, and pre-gate episodes only warn (commit cf2fe53).
- Everything else in the history was fixed by a writer looking at the English.

### Gaps
- The full before/after of the 392 IM_3–8 rewrites and of 08bc5ff's pre-commit calque rewrites isn't in git. Only the 72 logged examples exist, and the logger may have picked them non-randomly.
- The EN_4 AI→human replacement in 480cf35 (255 differing lines, distilled in `docs/translation-learnings.md`) is a human-vs-AI comparison, not one of our fixes, so I didn't label it.
- Speaker names are empty in cues.json. I inferred speakers from context and confirmed only the ones used for H1.

---

## Q2. Taxonomy and counts

### Takeaway
The biggest groups are English-structure calques (B, 28%) and literal idioms or wrong collocations (C, 25%). Wrong word sense (F) is the largest single category at 15%. Pure bookish vocabulary (A) is 9% of fixes. In the recent Claude pipeline, the blind reader almost never flags bookishness: A is 1 of 92 native-review and one-liner fixes. The bookish problem is therefore under-represented in our fix history rather than rare.

### Category definitions (refined from A–I)

| Code | Definition |
|---|---|
| A | Bookish/literary vocabulary or morphology (האם in speech, כיצד, אתמהה, עבור, כוחך, כבוד הוא לי…) |
| B1 | English word order kept |
| B2 | English grammatical construction: passive "going to be + pp", "X and Y both", cleft "the one who", "could still be", "time for X to", nominalizations |
| B3 | Pronoun/possessive/article mapping (my men, thank you for, you two, their own, missing possessor) |
| B4 | **New:** discourse marker or connective calque (after all, that's all, more importantly, once again, you know, to be honest, whatever happens) |
| C1 | Literal idiom or metaphor (lend strength, drop your guard, one step behind, takes me back) |
| C2 | Wrong collocation, i.e. the wrong verb–noun pairing (יצא לנו מזל, תופעות לוואי מכוערות, נפסק הקשר) |
| D | Japanese/anime stock phrase carried over (take X's head, To think…, As expected of, Leave it to me, My men!) |
| E | Wordy, no condensation |
| F | Wrong word sense / false friend |
| G | Register mismatch with the character's voice (in either direction) |
| H | Unnatural interjection, exclamation or insult |
| J | **New:** grammar/valency slip (missing object or article, wrong binyan, wrong preposition, dropped subject) |
| I | Other (garbled machine translation, split-sentence partner, regression) |

### Counts (primary category)

| Code | All (n=297) | Core (n=191) | Native review + one-liners (n=92) | EL10–24 sample (n=106) |
|---|---|---|---|---|
| F | 46 (15.5%) | 26 | 10 | 20 |
| C2 | 45 (15.2%) | 31 | 18 | 14 |
| B2 | 40 (13.5%) | 24 | 15 | 16 |
| C1 | 29 (9.8%) | 19 | 11 | 10 |
| A | 27 (9.1%) | 12 | 1 | 15 |
| B4 | 25 (8.4%) | 18 | 12 | 7 |
| G | 20 (6.7%) | 16 | 0 | 4 |
| J | 17 (5.7%) | 15 | 14 | 2 |
| H | 15 (5.1%) | 8 | 1 | 7 |
| B1 | 10 (3.4%) | 7 | 3 | 3 |
| B3 | 9 (3.0%) | 6 | 5 | 3 |
| E | 7 (2.4%) | 3 | 0 | 4 |
| D | 4 (1.3%) | 4 | 1 | 0 |
| I | 3 (1.0%) | 2 | 1 | 1 |

- **Family totals:** B 84 (28.3%), C 74 (24.9%), F 46, A 27, G 20, J 17, H 15, E 7, D 4, I 3.
- **Counting primary or secondary category:** F 58, C2 48, B2 44, A 36, C1 35, B4 27, G 21, H 18, J 18, E 13, B1 12, B3 12, D 8.
- Source: `fixes.tsv`. Each row was categorized by me against the English source.

### Representative fixes per category (old → new, gloss)
- **A:**
  - «אתמהה למה...» (biblical "I wonder") → «מעניין למה...» (ccd8a49, EL12).
  - «כבוד הוא לי לפגוש אותך!» (literary inversion, "honor is it to me") → «איזה כבוד לפגוש אותך!» (IM_6 183, rewrite log).
  - «הם המעיטו בערכו של הכלא» ("they diminished its worth") → «הם זלזלו בכלא» (IM_4 39).
  - «סול! האם אתה בסדר?!» (question particle האם in speech) → «סאול! אתה בסדר?!» (ccd8a49, EL10).
  - «כוחך הוא באמת של אדם על-אנושי» ("thy power is that of…") → «הכוח שלך ממש על-אנושי» (ccd8a49, EL13).
- **B1:**
  - «הצי ופיראטי זקן לבן שניהם מנסים…» ("the Navy and the WB Pirates both try") → «גם הצי וגם פיראטי זקן לבן מנסים…» (IM_7 66).
  - «אתם כולכם מוזרים גם» ("you all weird too") → «גם אתם כולכם מוזרים» (EL11).
- **B2:**
  - «אייס הולך להיות מוצא להורג» ("Ace is going to be executed") → «הולכים להוציא את אייס להורג» (IM_7 363).
  - «זמן לקפטן באגי להשתלט על העולם!» ("time for Captain Buggy to take over") → «הגיע הזמן שקפטן באגי ישתלט על העולם!» (MA_1 325).
  - «בגדי חוץ זה הכל המלמלה!» ("outdoor clothes is all the frill") → «בבגדי חוץ, המלמלות זה העיקר!» (AM_1 288).
- **B3:**
  - «תודה לך שדאגת לי!» ("thank you that you worried") → «תודה שדאגת לי!» (PEN_3 492).
  - «היי, אתם שניכם!» ("hey, you you-two") → «היי, שניכם!» (EL12).
  - «סיכנה את החיים» ("risked the life") → «סיכנה את חייה» (MA_1 357).
- **B4:**
  - «שרדת, אבל זה הכל.» ("you survived, but that's everything") → «שרדת, אבל רק בקושי.» (IM_7 38).
  - «הם אחרי אגרוף האש אייס בסוף?!» ("in the end") → «אז הם באמת באים בשביל אגרוף האש אייס?!» (IM_7 212).
  - «מה שיהיה, נשארו רק 3 שעות.» ("whatever will be") → «בכל מקרה, נשארו רק 3 שעות.» (MA_1 299).
- **C1:**
  - «השאלתי לך קצת כוח» ("lent you some strength") → «נתתי לך קצת כוח» (IM_7 23).
  - «נראה שהיינו צעד אחד מאחור» ("we were one step behind") → «נראה שהם הקדימו אותנו» (IM_7 253).
  - «נפתח גיהנום במפקדת הצי!» ("we'll open hell at HQ") → «בואו נהפוך את מפקדת הצי לגיהנום!» (MA_1 70).
  - «אה, זה מחזיר ימים!» ("that returns days") → «אה, איזה זיכרונות!» (MA_1 173).
  - «הוא הוציא אותי מהקיפאון» ("he unfroze me", for "had me on pins and needles") → «הוא ממש הלחיץ אותי שם» (EL24).
- **C2:**
  - «יצא לנו מזל» → «שיחק לנו המזל» ("we got lucky", MA_1 10).
  - «תופעות לוואי מכוערות» ("ugly side effects") → «קשות» (MA_1 26).
  - «נפסק הקשר» → «נותק הקשר» ("contact was cut", MA_1 114).
  - «זנחתי את התואר» ("I neglected the title") → «ויתרתי על התואר» (MA_1 69).
  - «נפלנו בה» → «נפלנו בפח» ("we fell for it", IM_7 365).
- **D:**
  - «לחשוב שהצלחת להוריד אותי על הברכיים…» ("To think you…") → «לא האמנתי שתצליח להכריע אותי…» (IM_5 151; the new verb is bookish).
  - «עכבר לכוד הוא דבר מפחיד» (Japanese proverb, literal) → «גם עכבר בפינה יכול לנשוך» ("even a cornered mouse bites", IM_5 152; a good localization).
- **E:**
  - «האסירים החשודים בסיוע לכובע הקש לופי הם כדלקמן…» ("the prisoners suspected… are as follows") → «החשודים בסיוע לכובע הקש לופי:» (IM_4 0).
- **F:**
  - «אל תהיי כזו בלתי סבירה» ("legally unreasonable") → «נו, אל תגזימי» (IM_7 169).
  - «אתה לא נעצר פה» (reads "you're not being arrested here") → «אתה לא מתכוון לעצור פה, נכון?» (IM_7 426).
  - «חכה רגע!» for "Leave it to me!" → «סמכו עליי!» (EL24).
  - «השורה הראשונה» → «הקו הראשון» ("front line", MA_1 304).
- **G:**
  - «יאללה.» (too street for Jinbe) → «קדימה.» (IM_8 94).
  - «אתה מנסה להתאבד?!» → «בא לך למות?!» ("tryna get killed", EL24).
  - In the other direction, «מי הבוס בכלא הזה!» → «מי השולט בכלא הזה!» (IM_3 509) made the line bookish; see Q4.
- **H:**
  - «דיבּ!» → «לעזאזל!» ("Dammit!", EL24).
  - «איזו שיחה, בחיי!» → «איזו שיחה מטורפת!» (MA_1 176).
  - «מה עם הבחור הזה?!» ("what about this guy?") → «מה הקטע של הבחור הזה?!» (IM_7 343).
  - «אוויל» (archaic "fool") → «אידיוט» (EL13).
- **J:**
  - «מלכעוס גם את זקן לבן» (wrong binyan) → «מלהכעיס» (IM_7 127).
  - «תמסרו לכל תושבי…» (no object) → «תעבירו את ההודעה לכל תושבי…» (IM_7 139).
  - «זה לא ישנה בטווח הארוך» → «זה לא ישנה כלום בטווח הארוך» (IM_7 470).

### Inferences
- **The two pipelines leave different residue.**
  - The old EL pipeline's "before" lines are heavy in A (14% of the sample) and F (19%). They are literal machine translation with formal function words (האם, כיצד, עבור, אתמהה, «הבן!» for "Got it!") and mistranslations.
  - The current Claude pipeline's residue, as caught by blind readers, is subtler: collocations C2 (20%), constructions B2 (16%), grammar/valency slips J (15%), discourse markers B4 (13%) and literal idioms C1 (12%).
- **The blind reader caught 1 bookish line in 92.** A (bookish) is only 1 of 92 native-review and one-liner fixes, even though Q4 shows bookish lines sitting in the same episodes. This is consistent with H4: the blind reader is a calque detector, not a register detector.
- **J at 15% shows what the blind reader adds.** These are grammar slips (missing objects, wrong binyan, dropped subjects) that the English-anchored writer reads straight past.

### Gaps
- Categories overlap (most rows carry two). Counts are by primary category. A second annotator would be needed to measure agreement.
- The 106-row sample is about ±7 points at 95% confidence for its largest categories.

---

## Q3. Which English patterns most often produced the bad Hebrew?

### Takeaway
The top trigger families are:
1. English grammatical constructions (26%).
2. Phrasal idioms and metaphors (21%).
3. Polysemous words (19%).
4. Discourse markers and connectives (9%).
5. Pronoun/possessive/article mapping (9%).

Anime-isms are only 2% of past fixes, but the current corpus shows they still mostly ship literally, and two of the user's six unreviewed examples belong to that family.

### Cited Findings: trigger families in the dataset (`trigger_family` column, n=297; core n=191 in brackets)

1. **T3, English grammatical constructions: 77 rows (25.9%) [44].**
   - "going to / gonna (+be)": 11 rows, e.g. «אייס הולך להיות מוצא להורג» (IM_7 363) and «אדון דובאל הולך להיות מאושר!» → «אדון דובאל יהיה בעננים!» (SAB_1 420).
   - Nominal/abstract English nouns: 11 rows (security, reputation, side effects, will to live, possibility of evil, imprecise aim, body's reaction, misconduct, willpower).
   - "There's no X / no way": 5. "the one who / I'll be the one to": 4. "X and Y both", "could still be", "time for X to" (2), "X is all about Y", "couldn't be happier", "What kind of X", "Shall we".
2. **T2, verb-phrase idioms and metaphors: 63 (21.2%) [43].** Examples: lend strength, drop your guard, one step behind, unleash hell, takes me back, run away with you, on pins and needles, in a pickle, get the lead out, it's about time, what got into him, you did it, a breath closer.
3. **T4, polysemous words / false friends: 56 (18.9%) [32].** Examples: careless→רשלן, unreasonable→בלתי סבירה, stopping→נעצר, security→מאבטחים, front row→שורה, trick→תרגיל, in exchange→בתמורה, misfire, Guts→הזרם, absurd→הפוך, reach→ההגעה.
4. **T1, discourse markers, connectives and tags: 27 (9.1%) [19].**
   - Counts: that's all / all that matters / all we can do (6), I suppose / I guess / To be honest (5), once / once again (4), more importantly (3), after all (2).
   - Single cases: you know (tag), …, that is, And with this, Before all that, not long after, Whatever happens, Also, It's just that, regardless.
5. **T6, pronoun / possessive / article / valency mapping: 27 (9.1%) [19].** Examples: My men!, thank you for, grateful to you, you two, their own, plus missing objects and articles.
6. **T8, voice-card choice with no English trigger: 19 (6.4%) [15].** These are lines the model re-colored for a character. 5 of the 19 became bookish (Q4).
7. **T7, exclamations and insults: 18 (6.1%).** Examples: Dammit, bastard, jerks, Moss Head, Why you, Shoot, How rude, Pirate guys.
8. **T5, anime/Japanese-isms: 7 (2.4%).** "take X's head" (4 rows, 2 of whose new versions are bookish: «לכרות», «אערוף»), "To think…", "Leave it to me", "My men!", the cornered-mouse proverb.
- **Where the fixes still fall short, by trigger:**
  - Of 4 "sure + verb" rows, 2 are still off: "sure did/does" became בטח/בטוח, i.e. "probably" (EL24, EL13).
  - Of 3 passive rows, 2 are still off.
  - Of 4 "take X's head" rows, 2 are still off.

### Cited Findings: how often the triggers still ship literally
Scope: 56 episodes with cues.json, 22,069 dialogue pairs, matched with a crude regex. Which renderings count as "bad" is my judgment.
- **"As expected (of) / expect no less"**: 14 English lines, 10 rendered כצפוי / כמצופה / «בדיוק כמו שציפיתי».
  - Examples: MA_5 60 «כצפוי מכל כוחות הצי.» (user-flagged), SAB_4 124 «כמצופה מצוות כובע הקש...», SAB_1 73 «בדיוק כמו שציפיתי מהנכד שלי!».
  - The human gold has **0** כצפוי/כמצופה in 6,231 dialogue lines; the AI has 13 in 24,378 ([markers scan, method below]).
  - The user's «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» is in `subtitles/main/32 Wano/01/wano 01 he.ass`, from the same trigger family.
- **"To think (that)…"**: 8 lines, 6 still «לחשוב ש...». The seventh is the IM_5 151 fix «לא האמנתי ש…». Examples: AM_5 117 «לחשוב שהוא יתנגד לזה כל כך...», SAB_3 73 «לחשוב שהם יגיעו עד כדי כך...».
- **"More importantly"**: 10 lines, 9 rendered יותר חשוב / חשוב יותר / חשוב מזה. SAB_8 127 even has «יותר חשוב מזה».
- **"Leave it to me/us"**: 16 lines. 8 are rendered «תשאיר/תשאירו את זה לי/עלי» and 5 use the natural «סמוך/סמכו עליי». Example: IM_3 121 «תשאיר את זה עלי, כובע הקש!».
- **"What's with X"**: 56 lines, 33 rendered מה עם / מה זה / מה הקטע. Example: AM_5 311 «מה עם הציפורים האלו?!», which reads as "what about these birds?".
- **"ordered" → ציווה**: MA_7 71 «אבא ציווה לשמור על האח של אייס בחיים!» (user-flagged). The AI has 3 lines with ציווה/ציוו/ציווית; the human has 0.
- **"take X's head"**: 10 lines, rendered with the verbs אקטע / לכרות / אערוף / חותך.
- **Not problems:**
  - "Pops/Old Man" → «אבא» (46/46) is natural for Whitebeard's crew.
  - "I'm counting on you" → «אני סומך עליך» (10/11) is natural Hebrew.
  - Not every anime-ism needs special handling.
- **The user's unreviewed examples, traced to their English:**
  - IM_9 87 "The boss of Hell is just around the corner" → «שליט הגיהנום כבר נושם בעורף». "Boss" became bookish שליט, the same move the voice rewrite made in IM_3 509, and the idiom is mangled (should be נושף בעורף).
  - IM_9 74 "All this panic is real convenient for us" → «הבהלה הזאת ממש נוחה לנו», a C2 collocation.
  - MA_5 61 "Get ready for me, world!" → «תתכונן לקראתי, עולם!», B2/D.
  - MA_5 60 "Vi'd expect no less from the Navy's full force" → «כצפוי מכל כוחות הצי», D.
  - MA_7 71 "ordered" → «ציווה», A.

### Inferences
- **Single English words matter less than English *frames*.** The frames here are clause-level constructions, phrasal verbs and connectives that Hebrew expresses with a different structure. That's why the blind readers' fixes are mostly restructurings ("הגיע הזמן ש…", "גם X וגם Y", "קודם כל").
- **Anime-isms are a small, closed, high-recurrence set.** They are worth a phrasebook (rules below) more than a general rule.
- Past fixes under-sample them because only 2 episodes were blind-read, and because the literal Hebrew is grammatical.

### Gaps
- The prevalence regexes are crude (e.g. "after all" → הרי is a good rendering but matched the marker). Treat the counts as "the English pattern is present and the literal Hebrew mapping was used", not as error counts.
- The human corpus (6,231 lines) is too small for rare items. A zero there means "not attested", not "forbidden".

---

## Q4. Were the fixes themselves natural, or did they swap a calque for a bookish form?

### Takeaway
Overall, 85% of fixes produced natural Hebrew: 77% natural and 8% formal-but-fitting. 4.7% (14 rows) traded a calque for a bookish/literary form or kept one, 7.7% (23) are still calques, and 2.7% (8) are wrong or regressed. The bookish trades cluster in two places:
- the translator's **voice** rewrites: 5 of 22 voice-tagged log examples, and 16% of all rewrite-log rows;
- speakers whose voice card says formal/dry/cold, i.e. Jinbe, Magellan and Crocodile: **8 of 24 rows, 33%**, against 6 of 273 (2.2%) for everyone else.

The blind-reader workflow gives the cleanest fixes (96.5% natural or fitting). Its two bookish fixes were the parent's own word choices, and the round-2 reader passed both.

### Cited Findings: quality of the NEW line by source (my judgment; `new_quality` column)

| Source | n | OK | OK-F | BOOK | CALQ | WRONG/WORSE |
|---|---|---|---|---|---|---|
| Rewrite log (translator, English open) | 56 | 36 (64%) | 5 | **9 (16%)** | 6 | 0 |
| Native review (blind reader → parent fix) | 86 | 74 (86%) | 9 | 2 (2.3%) | 1 | 0 |
| One-line calque fixes | 6 | 6 | 0 | 0 | 0 | 0 |
| Quality pass EL24/25 | 43 | 37 (86%) | 1 | 1 | 2 | 2 WORSE |
| EL10–24 re-translation sample | 106 | 76 (72%) | 8 | 2 | 14 (13%) | 4 WRONG, 2 WORSE |
| **All** | **297** | **229 (77.1%)** | **23 (7.7%)** | **14 (4.7%)** | **23 (7.7%)** | **8 (2.7%)** |

- **By rewrite-log tag:** voice-tagged 22 rows → OK 15, OK-F 2, **BOOK 5 (23%)**. Calque-tagged 33 → OK 21, OK-F 3, CALQ 6, BOOK 3 (9%).
- **By speaker:**
  - Magellan 10 rows → BOOK 4. Crocodile 4 → BOOK 2. Jinbe 10 → BOOK 2, OK-F 3.
  - Ivankov (card: "camp", theatrical) 29 → BOOK 0. The theatrical card did not produce literary words; the formal/dry/cold cards did.
- **By category, BOOK new lines:** G 5, D 3, B4 2, A 1, B3 1, F 1, I 1. Fixes of anime-isms (D) went bookish 3 times out of 4.

### Cited Findings: all 14 calque→bookish trades, with a natural rewrite (my judgment)
1. **IM_3 509 (Magellan), voice fix.** «מי הבוס בכלא הזה!» → «מי השולט בכלא הזה!» ("who the ruler is"). Better: «אני אראה לכם מי הבוס פה בכלא!»
2. **IM_5 19 (Magellan), voice fix.** «כסוהר, זה מאוד משפיל בשבילי.» → «כסוהר, זו חרפה.» ("as warden, it is an ignominy"). Better: «בתור הסוהר, זו בושה בשבילי.»
3. **IM_5 22 (Magellan), voice fix.** «…אקח את הזמן ללמוד איך…» → «…נברר בנחת איך…» ("we shall leisurely ascertain"). Better: «אחרי שאתפוס אותך, יהיה לי מלא זמן לברר איך בדיוק פרצת לכאן.»
4. **IM_5 151 (Magellan), "To think…".** «לחשוב שהצלחת להוריד אותי על הברכיים…» → «לא האמנתי שתצליח להכריע אותי…» ("to vanquish me"). Better: «מי היה מאמין שתצליח להפיל אותי על הברכיים...»
5. **IM_7 90 (Luffy), "To be honest".** «אם להיות כנה, …» → «בכנות, …» ("in sincerity"). Wrong for Luffy. Better: «האמת? אני אפילו לא יודע איך הוא נראה.»
6. **IM_7 414 (Crocodile), "take his head".** «לקחת את הראש של הזקן ההוא» → «לכרות לזקן ההוא את הראש» ("to cut off", biblical). Better: «...להוריד לזקן ההוא את הראש.»
7. **IM_7 451 (Jinbe), voice fix.** «תנו לי לבחור את מקום המוות שלי!» → «תנו לי לבחור היכן אמות!» ("whither I shall die"). Better: «בבקשה! תנו לי לבחור איפה למות!»
8. **IM_8 204 (Navy report).** «נראה שמתרחשת באימפל דאון מהומה חסרת תקדים.» → «באימפל דאון פורצת מהומה שכמותה עוד לא הייתה.» ("the like of which"). The old line already had the natural news phrase. Better: «באימפל דאון פרצה מהומה חסרת תקדים.»
9. **IM_8 343 (Jinbe), voice fix.** «למרות שאני לא כל כך טוב בלחימה ביבשה…» → «למרות שלחימה ביבשה אינה הצד החזק שלי…» ("is not my strong suit", with אינה). Better: «ביבשה אני פחות חזק, אבל...»
10. **MA_1 323 (Buggy!), parent's fix of a blind-reader flag.** «אנשים שלי!» → «אנשיי!» ("my men", synthetic possessive). The round-2 reader passed it. Better: «חבר'ה! הזמן כמעט הגיע!»
11. **IM_7 471 (Crocodile), parent's fix.** «אני אקח לו את הראש» → «אני אערוף לו את הראש» ("behead", legal/literary). Better: «ככה או ככה, אני אוריד לו את הראש.»
12. **EL24 0:23:10 (quality pass).** «היי, הם התקלקלו?» → «היי, אלה כשלו?» ("did those fail?", stiff and vague for "misfire"). Better: «היי, הם מפספסים? אף אחד מהמטחים שלהם לא פוגע בנו!»
13. **EL10 0:16:41 (Robin, re-translation).** «ללא קשר לכוונות הטובות שלך» → «לא משנה כמה טובות כוונותיכם» ("your intentions", synthetic). Better: «לא משנה כמה הכוונות שלכם טובות,»
14. **EL10 0:19:52 (Robin).** Garbled old line → «אף אחד מעולם לא נתן לי לייחל לזה.» ("to yearn for", literary). Better: «אף אחד אף פעם לא הרשה לי אפילו לרצות את זה.»

### Cited Findings: still-calque, wrong and regressed new lines (selection; full list in TSV)
- **Still calque:**
  - IM_5 0 «רע פה. יותר מידי מסוכן!». This is the model rewrite printed in _INSTRUCTIONS.txt, and «רע פה» is odd. Better: «זה לא טוב. מסוכן פה מידי!»
  - IM_6 187 «חבר שלי הורעל ממגלן» (passive kept, מ as agent). Better: «מגלן הרעיל את החבר שלי…»
  - IM_6 282 «בכלל, מי יחשוב…» (בכלל ≠ "after all"). Better: «מי בכלל היה מאמין שיש גן עדן כזה בתוך הגיהנום?»
  - MA_1 16 «שוב, ברוך הבא אלינו.» (English opener "once again"). Better: «אז ברוך הבא לצוות!»
  - EL24 «אני לא יכול להיות מאושר יותר!» ("I couldn't be happier"). Better: «אני... אני כל כך שמח!»
  - EL24 «בטח עשיתם שם תעלול אחד מטורף.» ("sure did" became "probably did"). Better: «איזה תעלול מטורף עשיתם שם!»
  - IM_8 408 «אנרכיסט בלי מין ברור שכמותך!». Better: «יא אנרכיסט חצי-חצי!»
- **Worse (the fix introduced the error):**
  - EL24 0:11:07 «על האנשים של עצמם» (calques "their own"; the old «שלהם» was natural).
  - EL24 0:26:51, the duplicated line described in Q1.
  - EL12 «אז אתה זה שהגעת?!» (the old «אז אתה זה שבא?!» was fine).
  - EL17 «לופי, קדימה.» (now means "Luffy, forward" instead of "Luffy is just ahead").
- **Wrong (the fix kept a wrong meaning):**
  - EL22 «מה עבר על הזקן הזה?» ("what has he been through", for "what got into him"). Better: «מה נכנס בזקן הזה?»
  - EL22 «הכל הופך לחום!» ("everything turns brown"). Better: «הכל משחיר!»
  - EL22 "you peasants" → «האזרחים» (the contempt is lost).

### Cited Findings: formal-but-fitting lines to watch (OK-F, 23 rows)
These are formal word choices I accepted for the speaker. They become wrong if the user wants a lower register ceiling:
- MA_1 68 «שמי ג'ינביי!» (Jinbe; «קוראים לי ג'ינביי!» is safer).
- IM_7 177 «אסור לכם להתרשל» (Momonga; alternative «לאבד ריכוז»).
- IM_7 181 «לא אסבול שום טעות!».
- IM_7 467 «אני מודה לך.» (Jinbe).
- IM_7 378 «כל מה שביכולתי».
- EL10 «עלינו להיות יסודיים בעבודתנו» (the fix changed חייבים to עלינו).
- EL20 «מעשיו הנפשעים של…» (the fix raised «ההתנהגות הפסולה»).
- MA_1 362 «עשתה דבר בלתי ייאמן» (Sengoku's public speech).

### Inferences
- **The writer's fix move is "lexical upgrade".** When the writer, model or parent, fixes a multiword calque, it often grabs a single high-register word: להכריע, לכרות, לערוף, להתרשל, לייחל, חרפה, השולט, שכמותה, היכן, אינה, בכנות, אנשיי, כוונותיכם.
  - A native subtitler instead restructures into everyday multiword phrasing: להפיל על הברכיים, להוריד את הראש, לאבד ריכוז, לרצות, בושה, הבוס, איפה, לא הצד החזק שלי, האמת, חבר'ה (my judgment).
- **Rough extrapolation, low confidence.** If the 22 logged voice examples are representative, about 23% of IM_3–8's 130 voice rewrites, roughly 30 lines, went bookish. The logged examples may not be random.
- **The pattern holds across pipelines.** The old EL pipeline's "fixes" adapted from main/ Hebrew also moved some lines up-register: עלינו, כפי ש, מעשיו הנפשעים, לייחל.

### Gaps
- Single annotator, and an AI rather than a native speaker; the BOOK/OK-F line is the most subjective call. Rows to have the user rule on first: «שמי ג'ינביי», «להתרשל», «לא אסבול», «בכנות», «מעולם לא».

---

## Q5. Hypotheses: which hold?

### Takeaway
H1 holds strongly, though n is small. H2 is not supported. H3 holds in part: anime-isms recur and ship literally, but they are a minor share of past fixes, and some are harmless. H4 holds. I also found four other causes: an awkward model rewrite in the instruction sheet, no lexical blacklist, the parent's fix-by-synonym habit, and a weak audit trail.

### Cited Findings

#### H1: "formal/heavy/dry" voice cards push the model to literary vocabulary. **Holds.**
- **Card wording.** [_IM_BATCH.txt](../../scripts/onepace-translations/_IM_BATCH.txt) and [_INSTRUCTIONS.txt](../../scripts/onepace-translations/_INSTRUCTIONS.txt) define register with adjectives only. Examples: "Jinbe: short, heavy, formal (no יאללה)", "Magellan: dry warden", "Crocodile: cold", "Guards/PA: clipped military".
  - Learnings rule 7 says "Each recurring speaker has a register (formal / street / theatrical / dry) — do not flatten everyone" ([translation-learnings.md §2](../../docs/translation-learnings.md)).
  - Nothing tells the model where formal stops and literary begins.
- **Data.**
  - Speakers with formal/dry/cold cards (Jinbe, Magellan, Crocodile): 8 of 24 rows ended bookish, vs 6 of 273 for everyone else.
  - Voice-tagged rewrites: 23% bookish, vs 9% for calque-tagged.
  - All 5 bookish voice fixes belong to Magellan (3) and Jinbe (2).
  - The theatrical card (Ivankov) produced 0 bookish lines in 29 rows.
- **Corpus comparison** (rate per 1,000 dialogue lines, human gold 6,231 lines vs AI he.json 24,378 lines; markers scan):
  - Literary items the human never or almost never uses: **אכן** 0.16 vs 0.82, **ייתכן** 0 vs 0.57, **שכמות-** 0 vs 0.74, **כצפוי/כמצופה** 0 vs 0.53, **עלינו/עליך + infinitive** 0 vs 0.33, **חרפה** 0 vs 0.33, **בנחת** 0 vs 0.16, **ציווה/ציוו** 0 vs 0.12, **ובכן** 1.28 vs 2.09.
  - Same rate in both: מעולם 1.93 vs 1.89, האם 0.48 vs 0.70.
  - I dropped my possessive-suffix and שמי counts as too noisy: ג'ינביי and the construct שמי ("skies of") match those regexes.
  - The evidence points to a short list of specific literary lexemes rather than synthetic morphology in general.
  - Method: python regex scan of 20 human ` He.ass` files (via `git ls-files`, deduped dialogue) vs all `*.he.json`; scripts in the scratchpad.

#### H2: the 44-character limit pushes compact synthetic forms (possessive suffixes, אינו). **Not supported.**
- **In the 14 bookish rows,** no old segment was over 42 characters and no new segment over 39. The literary form was chosen on lines with room to spare. «אינה הצד החזק שלי» is the same length as the line it replaced (39→39).
  - Possible weak exception: IM_7 90 went from 2 lines to 1 via «בכנות» (the sheet says "Prefer even lines").
- **Corpus:** literary-marker rate per 1,000 words is *lower* on full lines than on short ones. Single-line <30 chars: 2.93. Single-line 30–37: 2.38. Single-line ≥38: 2.07. Two-line: 1.62–2.42.
  - Marker set: אינו/אינה…, היכן, כיצד, אכן, ייתכן, שכמות-, חרפה, בנחת, ציווה, כצפוי, בטרם, אשר, מעולם, ובכן, עבור, כפי ש, עלינו/עליך, and a few suffixed nouns.
  - The set includes some noisy items (שמי), so read the trend, not the absolute values.

#### H3: the English source's own anime-isms drive calques. **Partly holds.**
- They are only 2.4% of past fixes (T5 7 rows; D 4 primary, 8 any).
- But they recur and still ship literally: As expected 10/14, To think 6/8, Leave it to me 8/16, more importantly 9/10, ordered→ציווה.
- 2 of the user's 6 unreviewed examples are this family.
- Fixes in this family went bookish 3 of 4 times (Q4).
- Some anime-isms translate naturally and need nothing: Old Man/Pops → אבא, counting on you → סומך עליך.

#### H4: the blind-reader prompt doesn't ask about register, so formal-but-grammatical lines pass. **Holds.**
- **The prompt** ([_NATIVE_REVIEW.txt](../../scripts/onepace-translations/_NATIVE_REVIEW.txt)):
  - It asks for "unnatural phrasing, wrong collocation, awkward word order, a wording that only makes sense if you imagine some other language behind it".
  - It explicitly exempts "theatrical villain speech that is natural for the genre".
  - It never mentions bookish, literary, archaic, written-register or too formal for the character.
- **Evidence:**
  - Three bookish lines from the translator's rewrite passed the IM_7 full-episode read: «תנו לי לבחור היכן אמות!» (451), «לכרות לזקן ההוא את הראש» (414) and «בכנות, …» (90). Line 90 sat inside round 2's ±3 window and passed again.
  - The parent's own bookish or formal fixes passed the round-2 re-read, which covers the changed lines ±3: «אנשיי!» (MA_1 323), «אערוף» (IM_7 471), «שמי ג'ינביי!» (MA_1 68), «להתרשל» (IM_7 177).
  - Of the 94 recorded flag entries in the two review records, none cites register or bookishness except one *keep* ("Iva's theatrical register"). A handful of fixes do lower register (זנחתי→ויתרתי, נגמר לנו→הלך עלינו), but the reasons describe them as calques or collocations.

#### Other causes found
1. **The instruction sheet teaches an awkward target.** The un-calque model pair «זה רע. מסוכן פה יותר מידי → רע פה. יותר מידי מסוכן» (_INSTRUCTIONS.txt gate 1) contradicts learnings §1.5 («זה רע!» → «זה לא טוב!»), and the awkward version shipped in IM_5 0.
2. **No lexical ceiling.** The "No phrase is banned" policy (learnings §1.5; commit cf2fe53) was based on calque phrases that the human uses at the same rate (אני מניח, אחרי הכל, זה הכל).
   - That reasoning does not extend to literary lexemes that are human-zero (כצפוי, ייתכן, שכמותך, ציווה, חרפה, עלינו+inf). Those are safe to lint.
3. **Fix-by-synonym in triage.** The parent fixes a reader flag "with the English open" (_NATIVE_REVIEW.txt step 3) and tends to swap in one formal word rather than re-voicing the line: להתרשל, לא אסבול, אערוף, אנשיי.
   - Round 2 then checks only for calque oddity (H4), so the up-register swap is never questioned.
4. **Stiff lines as positive examples.** Learnings §1.5 lists stiff human lines among its good examples, e.g. «אתה בהחלט תופס מעצמך יחסית לאיש מת!» ("you surely think highly of yourself for a dead man"). That signals elevated register is fine (my judgment).
5. **Weak audit trail.** Rewrite logs keep 12 examples of up to 93 changes, and 2 of 72 examples don't match the shipped text. Quality passes edit .srt/.ass without a blind re-read, which let the EL24 duplicate-line regression ship.

### Inferences
- The highest-leverage fix is to give voice cards a **lexical ceiling** and the blind reader a **register question**. Adding more calque examples won't address it.
- The literary lexemes are a short, closed, human-zero list, so a lint is safe here. The calque phrases (אני מניח etc.) were not.

### Gaps
- H1 rests on 24 rows for the formal-card trio. A planned check would rate all Jinbe/Magellan/Crocodile/Sengoku lines in IM/MA for bookishness, against a sample of other speakers.
- Whether «שמי», «מעולם», «להתרשל» and «לא אסבול» are acceptable for formal characters needs the user's ruling.

---

## Actionable rules for our translator (ranked by expected impact)

Format: **pattern** → why it's unnatural → natural alternative(s) → example from our data. All judgments are mine.

1. **Formal voice ≠ literary words (voice cards for Jinbe, Magellan, Crocodile, Sengoku, officers, narrators).**
   - **Why:** in spoken Israeli Hebrew, even a stiff officer marks formality through full sentences, no slang and polite address (אדוני, אדון X). Words like היכן, אינה, חרפה, בנחת, להכריע, לכרות, לערוף, השולט, בכנות, אנשיי belong to writing, scripture or law. In our data, a formal card produced 8 of the 14 bookish fixes.
   - **Alternative:** keep everyday words and use the card only to set the slang level and sentence completeness.
     - איפה, not היכן. לא, not אינו/אינה.
     - בושה, not חרפה. הבוס, not השולט.
     - להוריד את הראש, not לכרות/לערוף. להפיל, not להכריע.
     - האמת, not בכנות. חבר'ה/אנשים, not אנשיי.
     - קוראים לי X / אני X, not שמי X, except in a ceremonial introduction.
   - **Example:** «למרות שלחימה ביבשה אינה הצד החזק שלי…» → «ביבשה אני פחות חזק, אבל...».
   - Add one line to every card: "formal = no slang, NOT literary".

2. **Human-zero literary lexemes: block or flag them (lint, mechanical).**
   - **Pattern:** כצפוי, כמצופה, ייתכן, אכן, שכמות-, חרפה, ציווה, בנחת, היכן, כיצד, אתמהה, «הבן!», בטרם, אינו/אינה/אינם/אינני, עלינו/עליך + infinitive, לכרות/לערוף, להכריע ("defeat"), לייחל, אוויל, and nouns with -כם/-כן suffixes (כוונותיכם).
   - **Why:** none or almost none appear in the 6,231 human lines, while the AI uses several at 0.3–0.8 per 1,000 lines.
   - **Alternatives:**
     - כצפוי מ / כמצופה מ → «ידעתי שאפשר לסמוך על…», «לא סתם…».
     - ייתכן ש → «יכול להיות ש…».
     - אכן → «באמת» / «נכון».
     - ציווה → «אמר / הורה / ביקש».
     - עלינו ל- → «אנחנו חייבים / צריך».
   - **Example:** «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר לנו לשמור על האח של אייס בחיים!».
   - Allow exceptions for Kumadori/kabuki and for written signs.

3. **Fix by re-voicing, not by synonym (triage rule for parent and translator).**
   - **Pattern:** a flagged calque is replaced by one formal word.
   - **Why:** it trades one tell (translated) for another (bookish); 2 of the 3 bookish native-review fixes came from the parent.
   - **Alternative:** say the line the way the character would say it out loud, usually with more, shorter, everyday words. Then check whether the new line is something anyone would only ever write.
   - **Example:** «אנשים שלי!» → (bad fix) «אנשיי!» → (good fix) «חבר'ה!».

4. **Add a register question to the blind-reader prompt (_NATIVE_REVIEW.txt).**
   - **Why:** the prompt only hunts for calques. Every bookish line in the two reviewed episodes passed the blind reads (H4), and so did 4 parent fixes.
   - **Proposed addition:** "Also flag any line that sounds written, literary, biblical, legal or newsreader-like rather than spoken, for example היכן, אינו, חרפה, ייתכן, כצפוי, שכמותך, אנשיי, unless the character is a deliberate archaic stylist."
   - Re-read voice-tagged and parent-fixed lines with that question.
   - **Example:** «תנו לי לבחור היכן אמות!» would have been caught.

5. **Anime-ism phrasebook (closed list, highest recurrence).**
   - **Why:** these are Japanese stock phrases filtered through English. Rendered literally, they are grammatical but no Israeli says them.
   - **Mappings:**
     - "As expected of X / I'd expect no less" → «זה X בשבילך!» / «לא סתם קוראים לו…» / «ידעתי שאפשר לסמוך עליך!» (not כצפוי/כמצופה/«לא פחות ממה שאפשר לצפות»).
     - "To think (that)…" → «מי היה מאמין ש…» / «לא ייאמן ש…» (not «לחשוב ש…»).
     - "Take X's head" → «להוריד לו את הראש» (not לכרות/לערוף/לקחת את הראש).
     - "Leave it to me" → «סמוך עליי!» / «עליי!» / «אני על זה!» (not «תשאיר את זה לי»).
     - "Get ready for me, world!" → «עולם, אני בא!».
     - "ordered" → «אמר לנו / הורה».
     - "My men!" → «חבר'ה!».
     - "I welcome you once again" → «ברוך הבא לצוות!».
     - Keep: "Old Man" → אבא; "I'm counting on you" → «אני סומך עליך».
   - **Example:** «כצפוי מכל כוחות הצי. אסור לזלזל בהם.» → «ברור, זה כל הצי. אסור לזלזל בהם.»

6. **Discourse markers and connectives (B4, 9% of fixes).**
   - **Why:** English connectives map to Hebrew words with a different sense or position.
   - **Mappings:**
     - "after all" → «הרי…» / «בכל זאת» / «אז בסוף…», by sense; never a bare «בסוף», and not «בכלל».
     - "…, but that's all" → «…, אבל רק בקושי» / «וזהו».
     - "That's all in the past" → «זה כבר מאחוריי».
     - "more importantly" → «עזוב את זה,» / «חוץ מזה,» / «בכל מקרה,»; avoid «יותר חשוב,» as an opener.
     - "once again" as an opener → drop it, or put «שוב» inside the clause.
     - "whatever happens" → «בכל מקרה» (not «מה שיהיה»).
     - "before all that" → «קודם כל».
     - "you know" tag → «שמת לב?» / «נכון?» or drop.
     - "to be honest" → «האמת,».
     - "I suppose/I guess" → «נראה לי» / «כנראה» / «בטח». Occasional «אני מניח» is fine; the human uses it.
   - **Example:** «שרדת, אבל זה הכל.» → «שרדת, אבל רק בקושי.»

7. **English constructions → Hebrew structures (B2/B1, 17% of fixes).**
   - **Mappings:**
     - "is going to be + participle" → active 3rd plural: «הולכים להוציא את אייס להורג».
     - "is going to be ADJ" → future: «יהיה».
     - "X and Y both" → «גם X וגם Y».
     - "I'll be the one to" → «אני זה ש…».
     - "could still be alive" → «יכול להיות שהוא עוד חי».
     - "time for X to" → «הגיע הזמן ש…».
     - "There's no escape" → «אין לאן לברוח».
     - "It's not like they'd" → «ברור שלא…».
     - "X is all about Y" → «ב-X, Y זה העיקר».
     - "I couldn't be happier" → «אני כל כך שמח!».
     - "sure + verb" → «ממש / באמת», never «בטח / בטוח» (בטח reads "probably").
     - "their own people" → «האנשים שלהם».
     - Nominalized subjects ("my body's reaction is awkward") → a verb: «הגוף שלי מגיב מוזר».
   - **Example:** «אז זה מסביר את הסטייה שלנו מהיעד!» → «אז זה מסביר למה אנחנו מפספסים!»

8. **Verb–noun collocations and idioms (C1/C2, 25% of fixes; the largest family).**
   - **Why:** each English verb gets its dictionary equivalent, but Hebrew pairs that noun with a different verb.
   - **Check list from our fixes:**
     - מזל → «שיחק לנו המזל». קשר → «נותק».
     - תואר → «ויתרתי על». תופעות לוואי → «קשות».
     - נפלנו → «בפח». רעל → «לנטרל». נשימה → «הלך עלינו».
     - "lend strength" → «לתת כוח». "drop your guard" → «לאבד ריכוז».
     - "one step behind" → «הקדימו אותנו». "unleash hell" → «להפוך ל…גיהנום».
     - "takes me back" → «איזה זיכרונות». "in a pickle" → «בצרה צרורה». "it's about time" → «הגיע הזמן».
   - **Example:** «יצא לנו מזל הפעם.» → «שיחק לנו המזל.»

9. **Polysemy traps (F, 15%).**
   - **Mappings:**
     - careless → «לא שמתי לב / פספסתי» (not רשלן).
     - unreasonable, of a person → «אל תגזים» (not בלתי סביר).
     - "not stopping" → «לא עוצר» (not נעצר, "arrested").
     - security staff → «סוהרים / שומרים» (not מאבטחים).
     - front row of troops → «הקו הראשון».
     - "in exchange", meaning a cost → «המחיר».
     - "misfire" → «פספסו / לא נורו».
     - "trick" → «משהו מדהים» (תרגיל = a con).
     - "What got into him" → «מה נכנס בו» (not «מה עבר עליו»).
   - **Example:** «אל תהיי כזו בלתי סבירה...» → «נו, אל תגזימי...»

10. **Exclamations and insults (H/T7, 6%).**
    - **Mappings:**
      - "What's with X?!" → «מה הקטע של X?!» (not «מה עם X»).
      - "Why, you!" → «איך אתה מעז?!».
      - "You stupid… jerks!" → «איזה... מטומטמים!».
      - "How rude!" → «איזו חוצפה!».
      - "Pirate guys!" → «היי, פיראטים!».
      - Insults built on שכמותך → «יא + noun».
    - **Example:** «אנרכיסט בלי מין ברור שכמותך!» → «יא אנרכיסט חצי-חצי!»

11. **Housekeeping fixes surfaced by this audit (not translator rules).**
    - Restore EL24 0:26:51 «היי! מה אתם, שדים?!».
    - Fix IM_6 341 «בכור הים» → «אביר הים».
    - Replace the _INSTRUCTIONS.txt model rewrite «רע פה. יותר מידי מסוכן!» with «זה לא טוב. מסוכן פה מידי!».
    - Record every rewrite (not 12 examples) when a pass logs changes.
