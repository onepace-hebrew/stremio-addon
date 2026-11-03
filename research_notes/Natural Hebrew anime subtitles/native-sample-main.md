# Native-reader sample of the older bulk AI episodes (subtitles/main): how much of the Hebrew is unnatural, and what kind

**Who judged.** All naturalness verdicts are mine (Claude, reading the Hebrew the way a native Israeli viewer would). They are not the user's rulings. For calibration I compare them with the human gold files and with the house native-review records.

**Sample.** Six AI episodes from the middle of six arcs (lowercase ` he.ass`):

| code | file |
|---|---|
| AP05 | `subtitles/main/06 Arlong Park/05/arlongpark 05 he.ass` |
| AL13 | `subtitles/main/12 Alabasta/13/alabasta 13 he.ass` |
| SK13 | `subtitles/main/14 Skypiea/13/skypiea 13 he.ass` |
| W710 | `subtitles/main/16 Water Seven/10/waterseven 10 he.ass` |
| WCI20 | `subtitles/main/30 Whole Cake Island/20/wci 20 he.ass` |
| WA29 | `subtitles/main/32 Wano/29/wano 29 he.ass` |
| AP06H (control, human) | `subtitles/main/06 Arlong Park/06/arlongpark 06 He.ass` |

**Citation format.** `AP05#66` means dialogue index 66 in the extraction command the coordinator gave (0-based; Dialogue rows minus Caption/Title/Credit/Warning/Sign/Song/Karaoke/Note/OP/ED styles; index 0 is the credit line). Every flag is in `main-flags.tsv`, next to this file: 603 rows with episode, file, line, Hebrew line, category, second category, rewrite, confidence and note.

**Method.**
1. I read each episode in order, Hebrew only.
2. I flagged with a category (A–I) and a confidence: high means nearly any native would stop at the line; medium means a stiff or bookish choice a good subtitler would change.
3. I then opened the official English (one-pace/one-pace-public-subtitles, `en.ass` blobs fetched with `gh api`), only for 41 lines whose meaning I was unsure of, and only to write correct rewrites. I added no flags while reading the English.
4. Last, I measured my threshold on a human-translated control episode and counted the recurring patterns across the whole repo.

---

## 1. How widespread is unnatural Hebrew in the old bulk AI episodes? (calibrated rate)

### Takeaway
About **1 line in 8** is clearly unnatural: 12.8 high-confidence naturalness flags per 100 dialogue lines, 95% CI about 9–17. About **1 line in 4** counting milder bookish or stiff choices: 27.0 per 100, CI about 22–32. On a human-translated episode of the same arc, the same reader at the same threshold flags 0.6 (high) and 5.9 (strict) per 100. So the old bulk is about 20× the human level for clear problems and about 5× overall. Spread over the 257 main/ AI files (97,970 dialogue lines), that is roughly 12,500 clear lines and roughly 26,000 lines in all.

### Cited Findings
- **All six sampled files come from the June bulk run and have had only mechanical passes since.** `git log` shows each was created in commit 53ac8d6 "Add Hebrew subtitles for all 277 episodes" (2026-06-09). Later commits are ee8c6ac (terminology), a5adb86 (strip bloat), and on some files c933f19 (nif'al yod) and f337370 (term canon). None were native-reviewed. — `git log -- subtitles/main/<episode>`
- **Per-episode results.** 2,054 dialogue lines read (credit lines excluded) and 603 flags: 294 high, 309 medium. — `main-flags.tsv`

| episode | lines read | flags (high / med) | all flags per 100 | high per 100 | naturalness only, excl. cat. I (all / high) per 100 |
|---|---|---|---|---|---|
| AP05 | 450 | 144 (72 / 72) | 32.0 | 16.0 | 29.8 / 14.2 |
| AL13 | 276 | 92 (51 / 41) | 33.3 | 18.5 | 30.8 / 17.0 |
| SK13 | 377 | 97 (45 / 52) | 25.7 | 11.9 | 23.3 / 10.6 |
| W710 | 365 | 114 (49 / 65) | 31.2 | 13.4 | 29.9 / 13.4 |
| WCI20 | 309 | 65 (27 / 38) | 21.0 | 8.7 | 18.4 / 6.8 |
| WA29 | 277 | 91 (50 / 41) | 32.9 | 18.1 | 29.2 / 15.2 |
| **Total** | **2,054** | **603 (294 / 309)** | **29.4** | **14.3** | **27.0 / 12.8** |

- **Spread between episodes.** I computed this from the per-episode naturalness rates.
  - High-confidence: mean 12.9, SD 3.65, 95% CI (t, n=6) 9.0–16.7 per 100.
  - Strict: mean 26.9, SD 4.96, CI 21.7–32.1 per 100.
  - WCI20 is lowest: its wedding scene is mostly short exclamations and comedy. AL13 and WA29 are highest: Usopp's weapon manual, Crocodile, and Kawamatsu's Ringo exposition.
- **Human control, same arc (AP06H, the episode right after AP05).** 354 lines read, 21 naturalness flags (5.9 per 100), only 2 of them high (0.6 per 100), plus 3 lines with unknown words.
  - The 2 high flags:
    - #94 «זה יהיה אותך!» (accusative after a copula)
    - #141 «אבל אבירות מפיראט בוודאות נאמרת בדרך אגב.» (garbled)
  - Medium flags, of the same kinds I flag in the AI files: #27 and #74 «ובכן», #92 and #136 «הנה» for "here", #101 «להאמין למראה עיניי», #116 «תגידו שלום לראיה שלכם», #145 «תקועות ממש», #148 «שלמשוך אותי ישחרר אותן», #159 «וזה בלי להזכיר», #160 «אלו חדשות ישנות», #185, #261 «עדיין» for "still", #273 «אני גם אבוא», #283 «אני אבוא גם», #301, #334, #45, #142, #143 «צורמני».
  - Unknown words: #20 «מזטים», #136 and #137 «מושתנת». — `arlongpark 06 He.ass`
- **My threshold matches the house reviewer's.** One blind reader flagged 26 of 614 lines (4.2 per 100) on the human gold EL04. My 5.9 per 100 on human AP06 is close. — `scripts/onepace-translations/_NATIVE_REVIEW.txt` (Calibration section)
- **Newer pipeline, for comparison** (fedew/, reviewed with two blind readers):
  - IM_7: 32 + 14 flags over two rounds on a 470-line episode, about 10 per 100. Commit f42f8b0: "46 lines rewritten". — `scripts/onepace-translations/IM_7.native-review.txt`
  - MA_1: 32 + 10 flags on 375 lines, about 11 per 100. Commit a04d2aa: "43 lines rewritten". — `scripts/onepace-translations/MA_1.native-review.txt`
- **Where flags cluster** (my counts over index ranges):
  - Kawamatsu explaining the Ringo graves, WA29#33–49: 65 per 100 (35 high).
  - Villagers' revolt speeches, AP05#350–399: 44 per 100 (20 high).
  - CP9 exposition to Iceburg, W710#15–124: 39 per 100 (18 high).
  - Nami's flashback, AP05#1–176: 27 per 100.
  - WCI20 wedding, #86–240: 20 per 100. — `main-flags.tsv`
- **The English check changed little.**
  - Dropped: AP05#105 (EN says "Arlong's flag", so «דגל ארלונג» is faithful), SK13#237 (EN "rancher", so «מגדל בהמות» is fine), W710#176.
  - Recategorised: AP05#317 «נשמע!» is EN "Let's hear it!", and it reads as "sounds".
  - Confirmed mistranslations: WCI20#200 «אתה חייב מוות» (EN "You must have a death wish"), WCI20#258 «יאללה תחרא!» (EN "Screw him!"), WCI20#72 «פחי אדם» (EN "scumbags"), WA29#141 «אנו...!» (EN "C'mon...!"), SK13#365 «בקושי!» (EN "That was close!"), W710#13 «במחתרת» (EN "undercover"), W710#63 «אל תתנהג» (EN "No misbehaving").
- **Flags I lowered or dropped because the human gold uses the same form** (counted with my regex over the 20 human He.ass files):
  - «ובכן» (12×, mostly the hesitant «ובכן...»)
  - «שמי הוא X» (7×)
  - «לחשוב ש...» "To think that" (4×)
  - «האם» in the dramatic lines of the Zoro–Mihawk duel (3×, baratie 03)
  - «נבל» as a noun (4×)
  - «מעולם» (13×, about the AI rate). I dropped WCI20#260/261/263 for this.
  - «עבור» (18×)
  - «ללא» only in fixed phrases: ללא ספק, ללא תשלום, ללא פגע.
  - Masculine «עשה/אמור/שמור» imperatives (43×)
  - «זה רע!» (7×)
  - «כלבה» as an insult for a woman

### Inferences
- **Corpus size of the problem (my extrapolation).** main/ has 257 AI files and 97,970 dialogue lines, about 381 per file. Five files are "extended/alternate" near-duplicates. At the sample rates that gives about 12,500 clear lines (CI about 8,800–16,400) and about 26,000 strict (CI about 21,000–31,000). Per average episode: about 50 clear lines plus about 50 milder ones.
- **Hand review cannot cover this.** The house review (two blind readers plus a second round) takes about 40–45 fixes per episode on the newer output. The old bulk has 2–3× that under the strict reading. Fixing it needs rule-based search and replace for the regex-detectable patterns (section 3), with native review saved for exposition-heavy and speech-heavy scenes, where flags reach 40–65 per 100.
- **The old bulk is clearly worse than the newer fedew output** at a similar threshold (12.8 per 100 from a single reader vs about 10–11 per 100 from two readers on IM_7/MA_1). The marker counts in section 3 agree: most bookish markers are 2–9× rarer in fedew. So the skill/learnings work since June has helped. But some markers have not moved at all (ארור, אסיר תודה, X אתה אומר, לחשוב ש).
- **The worst offenders are not the shouting lines.** They are explanations, oaths and polite or formal speech, where the model reaches for written Hebrew.

### Gaps
- **One reader.** I am a single reader, and an AI imitating a native viewer. Agreement with the user's own judgment is unknown. The medium tier especially (formal register for CP9, samurai, Ohm, Crocodile; «כך» vs «ככה»; possessive suffixes) needs the user's ruling.
- **Six episodes.** Untouched: the early AI arcs (Romance Dawn–Little Garden), Jaya, Enies Lobby AI files, Post War, Return to Sabaody, Reverie, Egghead. The CI covers sampling between episodes only, not reader bias.
- **Control.** It is one human episode from one human subtitler (circa early arcs). The gold has its own calques (#94, #141), so "human level" is not zero.
- **No audio or video.** I inferred speaker identity and tone from the text. A few agreement verdicts, e.g. who says AL13#267, rest on plot knowledge.

---

## 2. What types of unnaturalness, with concrete lines and natural rewrites

### Takeaway
Bookish vocabulary and morphology (A, 34% of flags) and English syntax calques (B, 25%) dominate. Next come literal idioms and wrong collocations (C, 14%) and wrong word sense (F, 10%). Japanese/anime stock phrases (D) are rare (1%). Register mismatch (G) is rarely the main problem, but it explains why many A flags hurt: written-register words end up in the mouths of Luffy, Zoro, Franky, Paulie, Nami and kids. About 8% of flags are plain errors (I), not register: agreement, non-words, untranslated English.

### Cited Findings
- **Category distribution** (primary category; high/medium; "+n" = times it was the second category). — `main-flags.tsv`

| cat | meaning | flags | high / med | share | +2nd |
|---|---|---|---|---|---|
| A | bookish/literary vocabulary or morphology | 206 | 88 / 118 | 34.2% | +23 |
| B | English syntax calque / word order / pronoun-possessive overuse | 153 | 75 / 78 | 25.4% | +24 |
| C | literal idiom / wrong collocation | 84 | 53 / 31 | 13.9% | +7 |
| F | wrong word sense | 61 | 32 / 29 | 10.1% | +9 |
| I | other (agreement, non-words, untranslated, garbled) | 49 | 31 / 18 | 8.1% | +15 |
| H | unnatural interjection/exclamation/insult | 28 | 9 / 19 | 4.6% | +7 |
| E | wordy / nominal / no condensation | 14 | 5 / 9 | 2.3% | +6 |
| D | Japanese/anime stock phrase | 6 | 1 / 5 | 1.0% | +1 |
| G | register mismatch with the character | 2 | 0 / 2 | 0.3% | +11 |

- **Per episode** (primary category counts, order A B C D E F G H I):
  - AP05: 45 35 21 3 3 15 1 11 10
  - AL13: 26 30 15 1 2 7 0 4 7
  - SK13: 34 24 11 1 3 12 0 3 9
  - W710: 38 31 15 0 6 13 1 5 5
  - WCI20: 20 16 9 1 0 7 0 4 8
  - WA29: 43 17 13 0 0 7 0 1 10

**Examples by category** (line → my rewrite):

- **A. Bookish words and morphology.** Written-register function words, archaic forms, bound possessives, and formal imperatives in casual speech.
  - AP05#66
    «האם נילחם עכשיו, עד הנשימה האחרונה?!»
    → «נילחם עכשיו, עד הנשימה האחרונה?!»
  - AP05#63
    «גילינו היכן נמצאים פיראטי ארלונג!»
    → «גילינו איפה פיראטי ארלונג!»
  - AP05#161
    «מכאן ואילך, אלחם לבד!»
    → «מעכשיו אני נלחמת לבד!»
  - AP05#181
    «בימים אלה, הים מלא בהם!»
    → «היום הים מלא בהם!»
  - AP05#232
    «לא אניח לכם לקחת את הכסף הזה!»
    → «אני לא אתן לכם לקחת את הכסף הזה!»
  - AP05#368
    «אשקוד שוב!»
    → «אני אתחיל לחסוך מחדש!»
  - W710#47
    «מר אייסברג, לאמיתו של דבר, גיבשנו השערה לא מזמן.»
    → «אדון אייסברג, האמת היא שלא מזמן העלינו השערה.»
  - W710#124
    «יתרה מזאת...»
    → «וחוץ מזה...»
  - W710#104 (Franky)
    «האם אלה לא התוכניות שראינו לאותו נשק עתיק?!»
    → «רגע, אלה לא התוכניות של הנשק העתיק ההוא?!»
  - WA29#46
    «הם עם להביהם לנצח.»
    → «והם נשארים עם החרבות שלהם לנצח.»
  - WA29#104
    «...פן אמות מייסורי גרגרנות...»
    → «...אחרת אמות מרעב...»
  - SK13#229
    «מות!»
    → «תמות!»
  - SK13#140
    «עכשיו, מהרי ועלי.»
    → «יאללה, תעלי מהר.»
  - WA29#222 and #230 (Zoro)
    «ובכן...»
    → «טוב...»
- **B. English syntax calques.**
  - AP05#9
    «הם אמרו מה?!»
    → «מה הם אמרו?!»
  - AP05#256
    «ארלונג, אתם אומרים?»
    → «ארלונג, אה?»
  - AP05#288
    «על ידי מי?!»
    → «מי ירה בה?!»
  - AL13#69
    «אני תוהה אם ויוי והאחרים בסדר.»
    → «מעניין אם ויוי והאחרים בסדר.»
  - AL13#252
    «זה חייב להיות תגבורות...»
    → «זאת בטח תגבורת...»
  - WA29#58
    «אתה חייב להיות אונימארו!»
    → «אתה בטח אונימארו!»
  - AL13#72
    «אני רוצה נשק חזק יותר גם!»
    → «גם אני רוצה נשק חזק יותר!»
  - W710#69
    «עם זה, אספר לך את שאר ההשערה שלנו.»
    → «ועכשיו, אספר לך את ההמשך.»
  - WCI20#217
    «אני רואה... אנחנו מוקפים...»
    → «אני מבין... אנחנו מוקפים...»
  - SK13#31
    «זה אפילו מפחיד יותר!»
    → «זה עוד יותר מפחיד!»
  - AP05#154
    «אם אבקש מאף אחד עזרה»
    → «אם אבקש עזרה ממישהו»
  - AP05#54 «הצי לא יעזרו לנו»: plural verb carried over from "the Marines"; also #219, #269, #311.
- **C. Literal idioms and wrong collocations.**
  - SK13#365
    «בקושי!» (EN "That was close!")
    → «היה קרוב!»
  - AP05#225
    «תשמור על הטון שלך.»
    → «תיזהר איך אתה מדבר.»
  - AP05#245
    «עשינו עצמנו שלא ידענו.»
    → «עשינו את עצמנו שאנחנו לא יודעים.»
  - AP05#441
    «אני מוכן לשים את חיי על זה.»
    → «אני מוכן להתערב על החיים שלי.»
  - AL13#180
    «משהו כאן תפס את עיני»
    → «משהו פה קפץ לי לעין»
  - AL13#140
    «אין שום דרך שאנצח ככה!»
    → «אין מצב שאני מנצחת ככה!»
  - W710#242
    «לטפוח לי מוסר»
    → «להטיף לי מוסר»
  - WCI20#141
    «אל תוריד את השמירה.»
    → «אל תוריד את הגארד.»
    The native review also rejected «להוריד את המשמר» (IM_7#177).
  - WCI20#150
    «ללא דחיינות, הנה הכלה והחתן!»
    → «בלי הקדמות מיותרות...»
  - SK13#292
    «אוכל לעשות יוצא מן הכלל.»
    → «...לעשות חריג.»
  - AP05#231
    «ידיים מלוכלכות מחוץ לפרדס המנדרינות של בל-מר!»
    → «תורידו את הידיים המלוכלכות שלכם מהפרדס של בל-מר!»
  - WA29#187
    «אני מאחל לך בהצלחה!»
    → «בהצלחה לך!»
- **F. Wrong word sense** (dictionary first sense, false friends, look-alike verbs).
  - W710#13
    «היינו במחתרת» (= underground resistance; EN "undercover")
    → «היינו סוכנים סמויים»
  - SK13#19
    «הכית את גדאטסו» (= hit)
    → «ניצחת את גדאטסו»
  - SK13#12
    «התנשאתי יותר מידי» (= was condescending)
    → «עפתי על עצמי»
  - AP05#171
    «לצ'פר» (= to treat)
    → «להשוויץ»
  - AP05#417
    «תתעלם!» (= ignore)
    → «תיעלם!»
  - W710#312
    «כופף!»
    → «תתכופף!»
  - W710#290
    «הקושי»
    → «הקשיות»
  - W710#353
    «המצתות» (= lighters)
    → «הפתילים»
  - WA29#267
    «השתמש בהם כפיות» (= spoons)
    → «כמו בבובות»
  - WA29#123
    «כשהבטנות מלאות» (= linings)
    → «צבא צועד על קיבתו»
  - AL13#74
    «יש לי דמות יפה»
    → «יש לי גוף יפה»
  - AL13#271
    «המשפחה המלוכנית» (= monarchist)
    → «משפחת המלוכה»
  - AP05#37
    «אני רק שואל אותה» (reads "asking her")
    → «לוקח אותה בהשאלה»
- **H. Interjections and insults that Israelis don't use.**
  - AP05#318–319
    «ארור! ארור!»
    → «לעזאזל! לעזאזל!»
  - AP05#268
    «נבלי ממשלה ארורים!»
    → «מנוולים של הממשלה!»
  - AP05#27, #236, #308, #335
    «אוהו?»
    → «הממ?» or «מה יש לנו פה?»
  - W710#155
    «הנה הנה...»
    → «תראו תראו...»
  - W710#145
    «בני כלבה»
    → «בני זונות»
  - AL13#6
    «...א?!»
    → «...אה?!»
  - AP05#323
    «אבל, היי.»
    → «אבל מה לעשות,»
- **E. Wordy or nominal phrasing.**
  - AL13#233
    «שורדים על ידי שימוש בשכל»
    → «שורדים עם הראש»
  - W710#316
    «אפשרי על ידי בעיטה מהירה מספיק כדי ליצור רוח חדה.»
    → «אם בועטים מספיק מהר, נוצרת רוח חדה כמו להב.»
  - AP05#355
    «נשבענו לסבול בסבלנות»
    → «נשבענו לשתוק ולסבול»
  - AL13#135
    «מתחילים בהורדת שמירת האויב»
    → «קודם גורמים לאויב להוריד את הגארד»
- **D. Japanese stock frames.**
  - WCI20#16
    «אם יש לך זמן לדאוג, לך לבדוק למטה!»
    → «במקום לדאוג, לך תבדוק למטה!»
  - AP05#112
    «בלתי נסלח!»
    → «איך יכולת?! זה שפל!»
  - AP05#168, #433: «אחות גדולה» as a vocative
  - AL13#118
    «אני אדם קוצים»
    → «אכלתי את פרי הקוצים»
- **G. Register.** These are mostly second categories on A/B flags. Examples: «האם» from Luffy (W710#217) and Franky (#104); «כמו כן» from Zoro (W710#265); «הפסק/הפסיקו» from Paulie (W710#167, #177); «ובכן» from Zoro (WA29#222). G is primary twice: «נכון מאוד!» from a fishman thug (AP05#448), and «מגניב» from the cold, formal Lucci (W710#356).
- **I. Plain errors, outside the naturalness brief.** 64 flags carry I as the first or second category.
  - **About 32 agreement errors** (gender, number, person).
    - 12 in WA29 alone, mostly Hiyori addressed or speaking in the masculine: #8, #10, #21, #24, #25, #39, #50, #193, #219, #221, #227, #232.
    - Arlong given a feminine verb (AP05#312).
    - Cobra speaking as female (AL13#267).
    - Nami addressed as male (AP05#297, AL13#96, #104).
  - **About 20 non-words or broken forms**, e.g. «מפתחרת» (AP05#93, #309), «איפטל/תיפטל» (WCI20#111, #122), «תוקיעו» (WCI20#157, #160), «הדמית» (WCI20#163), «בדחתי» (WA29#122), «ניסיית» (SK13#119, #205), «אמטרה» (AL13#178), «בלגרום» (AL13#154), «לגן» (AL13#85), «ללחום» (SK13#288), «המשקפי» (AL13#244), «רחק» (SK13#114), «מניוול» (W710#333), «קוזרי» (WA29#213), and the wrong-binyan pair «ייתפסו/ייהרגו» (SK13#257).
  - **2 untranslated English lines:** AP05#177–178.
- **What the AI gets right** (for balance; these read like native subtitles):
  - WA29#114 «יאללה! עוד יום של שוד קברים!»
  - WA29#240 «קעקועי הסהר הם פשוט טרנד!»
  - WA29#27 «מבוגרים לא מתנפחים כמו דג פוגו.»
  - W710#273 «לעשות מה שבא לכם ולתלות את זה על אחרים...!»
  - W710#138 «אידיוט! חדר לא נכון! זה זה שלידו!»
  - SK13#172 «הי, תעפי גבוה יותר! הולכים לאכול אותנו!»

### Inferences
- **The unnaturalness is systematic, not random.** It has three sources:
  1. A written-Hebrew default for function words and morphology: האם, היכן, אולם, ובכן, אינו, זוהי, formal imperatives, bound possessives such as להביהם and קבריהם.
  2. 1:1 mapping of English discourse and modal words: must be → חייב להיות, I wonder → אני תוהה, I see → אני רואה, with that → עם זה, even → אפילו, too → line-final גם.
  3. Taking the first dictionary sense: undercover → מחתרת, beat → הכה, cocky → מתנשא, pawn → כפית.

  Sources 1 and 2 are listable and partly regex-detectable. Source 3 needs a reader, or a false-friends list.
- **"Formal character" is where the model overshoots.** CP9, Kawamatsu, Ohm, Crocodile, Gan Fall and Pagaya get literary Hebrew, not polite standard Hebrew. Meanwhile casual characters inherit the same function words. The user's target ("formal old warrior keeps a voice, never archaic") needs an explicit "formal ≠ literary" rule (rule 8 below).
- **Agreement errors in old main/.** "Gender/number agreement solved" holds for the new pipeline, not for the shipped old main/ files. That is about 1.5 per 100 lines in this sample, and it is cheap to catch.

### Gaps
- Categories overlap. I put the second category in `category2`, so counts by first category understate B and G.
- I could not tell from text alone whether some formal lines are deliberate character voice (Ohm's sermons, Lucci, Kalifa, Crocodile). I left most of those unflagged or medium, and noted the reason in the TSV.

---

## 3. Which patterns recur across the corpus and can be found by search?

### Takeaway
The ten most common recurring problems are listed below with corpus-wide counts. Several are high-precision regex targets in main/: «אוהו/אוה», «האם», «ארור», «חרבן», «מפתחרת», non-words, Latin-letter lines, «אסיר תודה», «X, אתה אומר?». Others need human triage because they are sometimes legitimate («כך», «ללא», «ובכן», «חייב להיות», «לחשוב ש»). Some patterns persist in the newer fedew output (ארור, אסיר תודה, לחשוב ש, «X, אתה אומר?»), so the current lint and skill do not cover them yet.

### Cited Findings
**Corpus counts.** These are lines matching each regex, with the same dialogue filter and credit lines excluded.
- Corpus sizes: main AI = 257 files / 97,970 lines; fedew AI = 86 files / 31,423 lines; human gold = 20 He.ass files / 6,977 lines.
- Counts are line co-occurrences, not verified flags. Script: `patterns.js` (scratchpad); my measurement.

| pattern | main AI n (per 1k) | fedew AI n (per 1k) | human n (per 1k) |
|---|---|---|---|
| «האם» question particle | 620 (6.33) | 22 (0.70) | 3 (0.43) |
| «ובכן» | 408 (4.16) | 62 (1.97) | 12 (1.72) |
| «כך» standalone, not «כל כך» | 511 (5.22) | 109 (3.47) | 16 (2.29) |
| «ככה» (baseline) | 352 (3.59) | 184 (5.86) | 48 (6.88) |
| «לעזאזל» (baseline curse) | 866 (8.84) | 363 (11.55) | 120 (17.20) |
| «ארור/ה/ים» | 211 (2.15) | 67 (2.13) | 2 (0.29) |
| «אוהו/אוה» | 240 (2.45) | 1 (0.03) | 0 |
| «על ידי» (passive agent) | 235 (2.40) | 47 (1.50) | 5 (0.72) |
| «חייב/ת/ים להיות» (often epistemic "must be") | 127 (1.30) | 17 (0.54) | 1 (0.14) |
| «אכן» | 118 (1.20) | 25 (0.80) | 1 (0.14) |
| line-final «גם / גם כן» | 143 (1.46) | 23 (0.73) | 4 (0.57) |
| «נבל/נבלים/נבלי» | 104 (1.06) | 9 (0.29) | 4 (0.57) |
| «אינו/אינה/אינך...» | 87 (0.89) | 8 (0.25) | 1 (0.14) |
| «בלבד» | 76 (0.78) | 14 (0.45) | 0 |
| «אולם» (however) | 74 (0.76) | 4 (0.13) | 1 (0.14) |
| «מכיוון ש / כיוון ש» | 74 (0.76) | 12 (0.38) | 4 (0.57) |
| «תוהה» (I wonder) | 61 (0.62) | 4 (0.13) | 3 (0.43) |
| «כה» (so) | 45 (0.46) | 3 (0.10) | 0 |
| «חרבן» (non-standard "swordsman") | 37 (0.38) | 1 (0.03) | 0 |
| «היכן/כיצד/מדוע» | 36 (0.37) | 2 (0.06) | 2 (0.29) |
| «זוהי» | 35 (0.36) | 2 (0.06) | 1 (0.14) |
| «אסיר/ת תודה» | 28 (0.29) | 17 (0.54) | 0 |
| «לא אניח / לא אאפשר» | 28 (0.29) | 1 (0.03) | 0 |
| «לחשוב ש» (To think that) | 28 (0.29) | 14 (0.45) | 4 (0.57) |
| «אני רואה» + punctuation (I see) | 26 (0.27) | 4 (0.13) | 0 |
| «בשום פנים» | 26 (0.27) | 0 | 0 |
| «בני כלבה / כלבה» | 22 (0.22) | 10 (0.32) | 4 (0.57, all «כלבה» at women) |
| «ראשית» | 22 (0.22) | 5 (0.16) | 0 |
| «תרפה/תרפי/הרפה» | 16 (0.16) | 2 (0.06) | 0 |
| «מה... בעולם» (what in the world) | 14 (0.14) | 2 (0.06) | 0 |
| «X, אתה/את/אתם אומר?» | 9 (0.09) | 6 (0.19) | 2 (0.29) |
| «מפתחרת» (non-word) | 6 | 0 | 0 |

- **Feminine formal imperatives are a main/ habit; the masculine ones are not a usable signal.**
  - Masculine «עשה/אמור/שמור» appear in the gold too (19/16/8 uses), so they cannot separate AI from human.
  - Feminine forms: main AI has «עצרי» 38×, «מהרי» 25×, «עשי» 11×, «ספרי» 9×, «שמרי» 9×, «אמרי» 5×. The gold has «עצרי» 1× and «שמרי» 1×. — my counts
- **The house rule and the gold disagree on «זה רע!».** The rule in `docs/translation-learnings.md` §1.5 says «זה רע!» → «זה לא טוב!», but the older human files use «זה רע!» 7× (e.g. syrupvillage 02 #45, #57). — `grep-human.js` output

**The 10 most common recurring patterns** (from the sample flags plus the corpus counts):
1. Written-register function words in speech: «האם» (6.3 per 1k, 15× the gold), «ובכן», «אולם», «היכן/כיצד/מדוע», «זוהי», «אינו», «אכן», «בלבד», «כה», «ראשית», «מכאן ואילך», «בימים אלה», «יתרה מזאת», «לא אניח/אאפשר», «בשום פנים».
2. «כך» over «ככה». main AI runs 1.45:1, the gold 1:3.
3. Curses and interjections: «ארור» (7× the gold, unchanged in fedew), «אוהו?/אוה» (main-only, 240 lines), «נבל!» as a vocative, «בני כלבה», «הנה הנה».
4. English modal and discourse calques: «חייב להיות» (epistemic), «אני תוהה», «אני רואה...», «לחשוב ש», «X, אתה אומר?», «עם זה», «מה לא בסדר עם», «זה מרגיש», «אפילו» + comparative.
5. Word order and particles carried over from English: line-final «גם/גם כן» (2.6× the gold), «מה היה זה», «רגע רק», «אני גם X».
6. Passive and nominal English: «על ידי» (3.3× the gold), «בהורדת...», «לארגן מסירת...», «על ניסיון ל...», infinitive subject + «יהיה».
7. Formal and archaic imperatives and verb forms for casual speakers: feminine «עצרי/מהרי/עשי/ספרי/המתיני/הביני», «תרפה», «מות!», «הרחיקי».
8. Literal idioms. There is no single regex, but a list of observed calques is greppable: «תשמור על הטון/הלשון», «להוריד את השמירה/המשמר», «לשים מאמץ», «תפס את עיני», «רחוק מדי», «היו בטוחים», «אין שום דרך ש», «ידיים מ...», «מה... בעולם», «עשינו עצמנו».
9. Wrong-sense words and false friends. This needs a list plus a reader: מחתרת, הכה, התנשא, לאתגר, לשגר, להיאבק, נגמרנו, לעמת, תתעלם/תיעלם, כופף, קושי/קשיות, מצתות, כפיות, בטנות, חיצוניים, מלוכני, דמות, אבסורדי.
10. Non-words, coinages and English leftovers: «חרבן» (37 lines), «מפתחרת» (6), «איפטל», «תוקיעו», «הדמית», «בדחתי», «ניסיית» and others, plus Latin-letter dialogue lines.

### Inferences
- **High-precision regexes, safe to batch-flag for rewrite:** «אוהו/אוה», «האם» at the start of a question, «ארור» as a standalone expletive, «חרבן», «מפתחרת», «בשום פנים!», «לא אניח», «אסיר תודה», «X, אתה אומר?», «מה... בעולם», «תרפה», feminine formal imperatives, and Latin-letter dialogue lines. Some regexes catch legitimate uses: «האם» = "the mother", «אולם» = hall, deontic «חייב להיות». Each still needs a one-second human look, but the true-positive rate should be high (my judgment, not measured).
- **Ratio checks, not bans:** «כך/ככה», «על ידי», «ללא» (fine in fixed phrases), «ובכן» (fine as hesitation), «לחשוב ש», «שמי הוא» (the gold uses both).
- **Missing in the current lint:** «ארור», «אסיר תודה» and «לחשוב ש» are as frequent or more frequent in the newer fedew output, so the current lint and skill don't catch them. — compare with `docs/translation-learnings.md` §1.5 and `scripts/lint-subs.js`. I did not read lint-subs.js in full.
- **Spell-check idea.** An OOV pass with a Hebrew spell-checker (e.g. hspell) over all AI dialogue would probably surface most of the non-word class. This is my suggestion; I did not test it.

### Gaps
- Regex counts are not verified flags. Precision per pattern was not measured.
- The human gold (20 files) covers only Romance Dawn–Arlong Park plus EL04, with a different cast, so per-1k comparisons for exposition-type markers are rough.
- The main AI counts include the 5 extended/alternate near-duplicate files in main/ (not deduplicated).

---

## Actionable rules for our translator

### Takeaway
Ten rules, ranked by expected impact (frequency in the sample × how badly the line stops the viewer × how easily the rule can be checked). The categories that rules 1–4 target (A, B, C, H) make up about 78% of the flags. Only part of that can be searched for: the lexical markers of rules 1 and 3 hit 100 of the 603 flags (17%). Rules 1, 3, 7 and 10 can mostly be enforced by search or lint.

### Cited Findings
Each rule: **pattern → why it's unnatural → natural alternatives → example.** Examples are from the sample; rewrites and judgments are mine.

1. **No written-register function words in dialogue.**
   - Pattern: «האם», «היכן/כיצד/מדוע», «אולם», «ובכן» (except a hesitant «ובכן...»), «יתרה מזאת», «מכאן ואילך», «בימים אלה», «זוהי», «אינו/אינה/אינך», «אכן», «בלבד», «כה», «ראשית», «אם כך», «כמו כן», «מכיוון ש», «לא אניח / לא אאפשר», «בשום פנים».
   - Why: these mark written or news Hebrew. Spoken Hebrew asks with intonation and uses short everyday words. This is the largest class (A = 34% of flags; «האם» is at 15× the gold rate).
   - Alternatives: «האם» → intonation, or «רגע, ...», «מה, ...». «היכן/כיצד/מדוע» → «איפה/איך/למה». «אולם» → «אבל». «ובכן» → «טוב/נו». «יתרה מזאת» → «וחוץ מזה». «מכאן ואילך» → «מעכשיו». «בימים אלה» → «היום / בזמן האחרון». «זוהי» → «זאת». «אינו» → «לא». «אכן» → «נכון / באמת». «בלבד» → «רק». «כה» → «כל כך». «ראשית» → «קודם כל». «אם כך» → «אז». «כמו כן» → «וגם». «מכיוון ש» → «כי». «לא אניח» → «לא אתן». «בשום פנים» → «בחיים לא / אין מצב».
   - Examples:
     - W710#217
       «האם לא בניתם ספינות ביחד?!»
       → «לא בניתם ספינות ביחד?!»
     - WA29#42
       «נכון. יתרה מזאת, הקברים מסומנים תמיד בחרבות.»
       → «נכון. וחוץ מזה, תמיד מסמנים את הקברים בחרבות.»
2. **Don't map English discourse and modal words one-to-one.**
   - Pattern: epistemic "must be" → «חייב להיות»; "I wonder if" → «אני תוהה אם»; "I see" → «אני רואה»; "To think that" → «לחשוב ש»; "X, you say?" → «X, אתה אומר?»; "with that" → «עם זה»; "what's wrong with" → «מה לא בסדר עם»; "it feels warm" → «זה מרגיש חמים»; "even scarier" → «אפילו מפחיד יותר»; "too" → line-final «גם»; "you know" → «יודעת...»; "That's no longer the case" → «זה כבר לא המצב».
   - Why: each is a legal word-for-word rendering. Hebrew expresses the same function with different words or word order (B = 25% of flags).
   - Alternatives: «בטח / כנראה»; «מעניין אם»; «אה, הבנתי / אני מבין»; «מי היה מאמין ש...»; «X, אה?»; «ועכשיו / ככה»; «מה הקטע של»; «חמים פה»; «עוד יותר מפחיד»; «גם» before the subject («גם אני...»); «את יודעת...»; «זה נגמר».
   - Examples:
     - WA29#58
       «אתה חייב להיות אונימארו!»
       → «אתה בטח אונימארו!»
     - AL13#162
       «אני תוהה אם אני הולכת למות ככה.»
       → «אוי... אני הולכת למות פה?»
3. **Curses, insults and interjections must be ones Israelis say.**
   - Pattern: «ארור!» or «ה...הארור הזה»; «נבל!» as a vocative; «בני כלבה»; «אוהו?», «אוה», «אוה?»; «הנה הנה»; «א?!»; «אבל, היי»; «אוי לי».
   - Why: these come from dubbing and literature. The gold never uses «ארור» as a standalone curse and never uses «אוהו». The AI uses «לעזאזל» at half the gold rate and fills the gap with «ארור».
   - Alternatives: «לעזאזל / שיט / מחורבן / מעצבן»; «מנוול / חלאה»; «בני זונות / מנוולים»; «הממ? / או? / מה יש לנו פה?»; «תראו תראו»; «אה?!»; «מה לעשות»; «אוי ואבוי».
   - Example: AP05#318–319
     «ארור... ארור! ארור!»
     → «לעזאזל... לעזאזל! לעזאזל!»
4. **Translate idioms by function, not by words.**
   - Pattern: a literal English idiom.
   - Why: the result is grammatical but nonexistent or odd in Hebrew (C = 14%).
   - Observed pairs, English → Hebrew:
     - "That was close" → «היה קרוב / כמעט»
     - "Watch your tone/tongue" → «תיזהר איך אתה מדבר»
     - "drop your guard" → «להוריד את הגארד / להתרשל»
     - "caught my eye" → «קפץ לי לעין»
     - "going too far" → «מוגזם»
     - "seek revenge" → «לנקום»
     - "be safe" → «תשמרו על עצמכם»
     - "bet my life on it" → «מתערב על החיים שלי»
     - "there's no way that" → «אין מצב ש»
     - "hands off" → «תוריד את הידיים / אל תיגע»
     - "without further ado" → «בלי הקדמות»
     - "make an exception" → «לעשות חריג»
     - "put him in his place" → «העמדתי אותו במקומו»
     - "what in the world" → «מה לעזאזל»
     - "a taste of hell" → «נראה להם מה זה גיהנום»
     - "long face" → «פרצוף חמוץ»
     - "inside job" → «מישהו מבפנים»
     - "no harm done" → «מה זה כבר משנה»
     - "go on ahead" → «אני ממשיכה»
     - "kids will be kids" → «ילדים זה ילדים»
     - "pretend not to know" → «לעשות את עצמנו לא יודעים»
     - "lecture me" → «להטיף לי מוסר»
     - "an army marches on its stomach" → «צבא צועד על קיבתו»
   - Example: AP05#95
     «את בראש שלך?»
     → «השתגעת?!»
5. **Check the word sense, not the dictionary's first entry.**
   - Pattern: false friends and look-alike verbs: «מחתרת» (undercover), «הכה» (beat), «התנשא» (got cocky), «לאתגר» (to fight), «לשגר» (send off), «להיאבק» (squirm), «נגמרנו» (we're through), «לעמת» (confront), «להתחמק» (get away), «תתעלם/תיעלם», «כופף/תתכופף», «הרחיקי/התרחקי», «קושי/קשיות», «מצתות», «כפיות», «בטנות», «עיזבון», «חיצוניים», «מלוכני», «דמות», «אבסורדי» (of a person), «שואל» (borrow, said of a person).
   - Why: F = 10% of flags, and the most likely to make a viewer stop and ask "what did I just read?".
   - Alternatives: «סוכנים סמויים», «ניצח», «עפתי על עצמי», «הלכנו עליו», «לחסל», «להשתולל», «זה נגמר», «לחצתי על», «לצאת מזה», «תיעלם», «תתכופף», «תתרחקי», «קשיות», «פתילים», «בובות», «קיבה», «ירושה», «זרים», «משפחת המלוכה», «גוף», «מטורף», «לוקח בהשאלה».
   - Example: W710#13
     «היינו במחתרת חמש שנים.»
     → «היינו סוכנים סמויים חמש שנים.»
6. **Imperatives: spoken future forms for casual speech.**
   - Pattern: bare formal imperatives, especially feminine («עצרי, מהרי, עשי, ספרי, המתיני, הביני, עזבי, הרחיקי»), plus «תרפה/תרפי», «מות!», «הפסק/הפסיקו» from rough characters.
   - Why: the gold almost never uses feminine bare imperatives (2 uses vs about 100 in main AI). Spoken Hebrew uses «תעצרי, תמהרי, תעשי, תגידי, תחכי, תעזבי, תתרחקי».
   - Keep bare imperatives for military or short shouted commands («קדימה! זוז! שב! לך! תן! בוא! חפרו!») and for deliberately formal speakers.
   - Example: SK13#140
     «עכשיו, מהרי ועלי.»
     → «יאללה, תעלי מהר.»
7. **Turn passive and nominal English into an active verb with a subject.**
   - Pattern: «על ידי» (including «על ידי מי?!»); nominalizations such as «בהורדת שמירת האויב», «לארגן מסירת התוכניות», «על ניסיון להבין», «אחרי שינוי שמו»; an infinitive subject + «יהיה / זה» («לחסל אותך קודם יהיה הדרך המהירה ביותר»).
   - Why: Hebrew speech is verbal and active. These read as an English sentence frame (E plus part of B; «על ידי» is 3.3× the gold rate).
   - Alternatives: name the doer («מי ירה בה?!»), use a finite verb («אחרי שהוא שינה את השם שלו»), use «אם / כש» clauses («אם בועטים מספיק מהר, נוצרת רוח חדה»).
   - Example: AL13#14
     «לחסל אותך קודם יהיה הדרך המהירה ביותר לסיים את העבודה.»
     → «הכי מהר לגמור את העבודה זה לחסל אותך קודם.»
8. **Formal is not literary: give each character a spoken register.**
   - Pattern: formal or polite characters (CP9, Kawamatsu, Ohm, Crocodile, Gan Fall, Pagaya, Kalifa, Cobra) get literary morphology: «פן», «להביהם», «קבריהם», «עם הלידה», «במוות», «להכניעם», «לאמיתו של דבר», «גיבשנו השערה», «כשלתי בניצול המודיעין», «נגוזת». Casual characters (Luffy, Zoro, Franky, Paulie, Nami, Usopp, kids, thugs) get «האם / ובכן / כמו כן / הפסק / אסיר תודה».
   - Why: the target is a formal old warrior who is never archaic. Formal in spoken Hebrew means polite full sentences, «אדון/גברת», «רבותיי», «אני מבין», «אין צורך», «הרשה לי». It does not mean Biblical or newspaper morphology. Exposition scenes reach 39–65 flags per 100 lines because of this.
   - Example: WA29#45
     «במוות, החרבות שנשאו מסמנות את קבריהם.»
     → «וכשהם מתים, החרבות שלהם מסמנות את הקברים.» (Kawamatsu stays formal but speaks.)
9. **Unpack Japanese stock frames.**
   - Pattern: "If you have time to X, then Y"; "Unforgivable!"; "Big Sister/Aneki" as a vocative; "I'm a Spike Human" (toge-ningen); "young lady!" (ojou-san).
   - Why: they make sense only to anime-subtitle readers (D = 1%; low frequency, but it stands out).
   - Alternatives: «במקום X, Y»; «איך יכולת?! / זה שפל!»; the name or «אחותי»; «אכלתי את פרי הקוצים»; «ילדה!».
   - Example: WCI20#16
     «אם יש לך זמן לדאוג, לך לבדוק למטה!»
     → «במקום לדאוג, לך תבדוק למטה!»
10. **Mechanical checks on the old corpus.** These are errors rather than register problems, but cheap to fix.
    - Run a Hebrew spell-check (OOV) pass for non-words: «מפתחרת», «חרבן», «איפטל», «תוקיעו», «הדמית», «בדחתי», «ניסיית», «אמטרה», «בלגרום».
    - Flag any dialogue line with Latin letters that is not an attack name or a credit (AP05#177–178).
    - Run an agreement lint against the character-gender registry on old main/ (Hiyori in WA29: 12 lines).
    - Lint «הצי» + a plural verb (AP05#54, #219, #269, #311), «איזה/איזו» against the noun's gender, «זאת/זו» + masculine noun, and wrong binyan («ייתפסו» for active "catch").
    - Why: these make the viewer stop and ask "what?", like naturalness problems do, and they are fully automatable.
    - Example: WCI20#163
      «החתונה הדמית החלה!»
      → «חתונת הדמים התחילה!»

### Inferences
- **Order of work.** If only one thing is done to the old corpus, run rules 1 and 3 as search and rewrite. Their markers hit only 17% of the flags (100 of 603), but they include the most visible ones («האם», «ארור», «אוהו») and are the cheapest and lowest-risk to fix. Most of the remaining 83% (B, C, F calques) need a reader or a growing calque list.
- **Translator prompt.** Rules 2, 4 and 5 belong in the prompt as "known calques / false friends" lists, and should grow from every native review.
- **Native review focus.** Rule 8 needs a reader. Point native review at exposition and speech scenes first, since flag density there is 2–3× the episode average.
- **Lint additions.** «ארור», «אסיר תודה», «לחשוב ש» and «X, אתה אומר?» are still produced by the newer pipeline (fedew rates equal or higher), so add them to `scripts/lint-subs.js` and to the skill learnings, not only to the old-corpus cleanup.

### Gaps
- The impact ranking is my estimate. The user has not ruled on the medium-tier items: possessive suffixes, «כך», formal speakers.
- Precision of each search rule on the full corpus was not measured; it needs a spot-check of about 50 random hits per pattern before any batch rewrite.
- The gold's own habits (e.g. «שמי הוא», «לחשוב ש», «זה רע!») conflict with stricter native taste and with `docs/translation-learnings.md` §1.5. The user should decide which side the house takes.
