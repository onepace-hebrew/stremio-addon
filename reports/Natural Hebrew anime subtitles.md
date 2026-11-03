# Making One Pace's Hebrew sound spoken

**Our subtitles read as translated for two reasons that leave different fingerprints: the model maps English phrases one-to-one (grammar frames, idioms, discourse markers, stock anime formulas), and when a line feels formal it reaches for written Hebrew; our review gate then never asks about register.** In the June 2026 bulk run (`subtitles/main/**`, 257 files), a native-style read found about **1 clearly unnatural line in 8** (12.8 per 100 lines; 27 per 100 counting milder stiffness), roughly 20× a human episode read at the same threshold, with a signature of literary function words led by **האם** (the written yes/no question particle) at 13× the human rate ([main sample][nsm]; [marker study][mf]). The newer pipeline (`subtitles/fedew/**`, 85 files) has stripped most of that layer and improves with each process change (about 20 problem lines per 100 in June episodes, about 6 after the Impel Down rewrite pass and the October batch sheets, 2.5 after the two-reader native gate), but English frames, literal idioms and collocations, false friends and a "formal = literary" reflex in polite and authority voices still ship ([fedew sample][nsf]). Israeli professionals abandoned the elevated subtitle register decades ago; Netflix, Amazon, the old Channel 1 editors and the Hebrew fansub guides all ask for each character's living spoken register, idiom-for-idiom rendering, and condensing by cutting words rather than raising the register ([Weissbrod][weissbrod]; [Netflix Hebrew guide][nf-ttsg]; [Gazit][gazit]; [Qsubs][qsubs]). The highest-leverage fixes are better questions, not more examples: voice cards built from word lists with a "formal ≠ literary" ceiling, a register question in the blind-review prompt, and a lint of 16 literary markers that score ≥80% precision with near-zero use in the human files. That lint will clear about 1,800 spots in main/, but it sees only about 1 problem line in 6, so a register-aware blind read, ordered by arc, stays the main cleanup tool.

## Seven causes, ranked: English phrase-mapping first, written Hebrew second

Ranked by share of flagged lines, then by how directly the evidence ties the cause to our process.

### 1. The English phrase gets translated, not the scene (about half of all flags)
- **Biggest family in both corpora.** English-syntax calques are **34%** of confirmed fedew flags and **25%** of main flags; literal idioms and wrong collocations add **13–14%**; wrong word sense **10%** ([fedew sample][nsf]; [main sample][nsm]).
- **Same in our own fix history.** Of 297 labeled past fixes, constructions and connectives are **28%**, idioms and collocations **25%**, false friends **15%** ([fix taxonomy][pft]).
- **A fixed marker dictionary.** In 22,544 aligned cue pairs: "Well" → ובכן 38/45, "Indeed" → אכן 12/15, "though" → אם כי 24/25, "by" → על ידי 36/36, "In that case" → במקרה כזה 8/8 ([marker study][mf]).
- **Anime formulas arrive pre-frozen.** "As expected of X" is the English gloss of Japanese さすが, which has "no perfect translation" ([Tofugu][tofugu]); Hebrew built from the gloss («כצפוי מ…», "as is anticipated of…") is translated twice over ([anime translationese][at]).
- **The relay strips voice first.** English subtitles standardise Japanese role language ([Heerink][heerink]). Research names the leak "transfer of relay-language features not acceptable in the target language" ([Gottlieb, via Al Teneiji][gottlieb]) and finds interference the most robust sign of translationese ([Wintner][wintner]).
- **Evidence: strongest.** Measured on cue-aligned data; every researcher found it.

### 2. A written-Hebrew default (the main/ signature)
- **Bookish words and morphology** are **34%** of main flags and **28%** of fedew flags ([main][nsm]; [fedew][nsf]).
- **Not driven by content.** On content-matched East Blue episodes האם is still 5.12 vs 0.43 per 1,000 lines, and ארור ("accursed") 2.97 vs 0.29 ([marker study][mf]).
- **A known Hebrew failure.** Translated Hebrew dialogue long used "a mixed artificial language": spoken words "embedded in a high-style grammatical context" ([Ben-Shahar 1998][bs98]). The "elevated language" norm ruled Israeli TV subtitles until it "almost vanished" ([Weissbrod][weissbrod]).
- **Plausibly a training-data habit (untested).** Real Hebrew subtitles are themselves formal: האם runs 126.7 per 100k tokens in OPUS, vs 17.2 in our recent AI and 9.5 in the human files ([OPUS phrase-book][opb]).
- **Prompts can move it.** fedew runs האם at 0.77 per 1,000 lines against main's 7.23, and אנא ("please", liturgical) at 0.13 against 1.16 ([marker study][mf]).

### 3. Voice cards say "formal" but never say which words
- **Adjectives only:** "Jinbe: short, heavy, formal", "Magellan: dry warden", "Crocodile: cold" ([_INSTRUCTIONS.txt][instr] l.20–23; [skill][skill] step 2).
- **Formal cards produce literary Hebrew.** Lines for Jinbe, Magellan and Crocodile ended bookish in **8 of 24** fix rows (33%), against **6 of 273** (2.2%) for everyone else; voice-tagged rewrites went bookish 23% of the time, calque-tagged ones 9%; Ivankov's "theatrical" card produced 0 of 29 ([fix taxonomy][pft]).
  - «כסוהר, זו חרפה.» ("As warden, it is an ignominy.")
  - «תנו לי לבחור היכן אמות!» ("Let me choose whither I shall die!")
  - «מי השולט בכלא הזה!» ("Who is the ruler of this prison!"), which replaced a better «מי הבוס בכלא הזה!»
- **Polite turns literary too:** Brook's «לבקש מחילה» ("to beg pardon"), Kalifa's «להישבות בקסם המראה שלי» ("to be captivated by my looks"), Kizaru's «יהיה אשר יהיה» ("come what may") ([fedew][nsf]).
- **Casual mouths catch it as well:** **34 of 62** bookish flags in the fedew sample belong to Luffy, Zoro, Franky, Usopp and friends, e.g. Luffy's «אם כי» ("albeit") ([fedew][nsf]).
- **Why words, not adjectives:** about 80% of register variation in Hebrew is lexical ([Ravid & Berman][ravid]).
- **Evidence: medium.** Only 24 rows for the formal trio, but three notes point the same way.

### 4. The blind-review gate never asks about register, and exempts villains
- **The prompt hunts calques only** and says "Do NOT flag … theatrical villain speech that is natural for the genre" ([_NATIVE_REVIEW.txt][nr] l.38–44).
- **Bookish lines pass.** The blind reads caught **1 bookish line in 92** fixes; three bookish voice rewrites passed the full IM_7 read ([fix taxonomy][pft]).
- **What the gate leaves behind.** After two readers and a re-read, MA_1 still holds **9 confirmed lines (2.5 per 100)**; 7 were never touched and all 7 are formal register, e.g. Sengoku's «הוצאתו להורג של האיש הזה קובעת הכל» ("his-execution of this man decides all", a double possessive) ([fedew][nsf]).
- **The readers share blind spots.** The two MA_1 readers overlapped on 21 of about 27 flags each: same model, same prompt ([fedew][nsf]).
- **Evidence: strong** (the review records plus a residual read).

### 5. Calques get "fixed" with one higher word
- **14 of 297 fixes (4.7%)** traded a calque for a bookish form, clustered in voice rewrites ([fix taxonomy][pft]).
- **The parent's own fixes did it, and round 2 passed them:**
  - «אנשים שלי!» → «אנשיי!» ("my-men!")
  - «אני אקח לו את הראש» → «אני אערוף לו את הראש» ("I shall behead him")
  - «תקראו לי ג'ינביי!» → «שמי ג'ינביי!» ("my-name is Jinbe")
- **Natives restructure instead:** «חבר'ה!» ("guys!"), «אני אוריד לו את הראש» ("I'll take his head off").

### 6. Near-miss idioms and English collocations
- **One wrong word breaks an idiom:** «נושם בעורף» (the idiom is נושף; OPUS 159 hits vs 2), «יצא לנו מזל» (שיחק לנו המזל 98 vs 2), «נגמר לנו» for "we're done for" (0% of OPUS "done for" lines; it means "we ran out") ([OPUS phrase-book][opb]; [Avneon dictionary][avneon]).
- **Worse than plain words.** The reader recognises the template and stops at the mismatch; Ben-Shahar calls these "deviated fixed expressions" ([Ben-Shahar 1998][bs98]).
- **Invisible to word lists.** 89 of the 92 lines the native reviews rewrote contained no lint marker at all ([marker study][mf]).

### 7. Long exposition amplifies everything, and the backlog was never re-processed
- **Length:** flags climb from **5.7 per 100** (1–4 words) to **14.5** (5–9 words) and **27.0** (10+ words) ([fedew][nsf]).
- **Scene type:** exposition runs 39–65 per 100, e.g. Kawamatsu on the Ringo graves (WA29#33–49) and CP9 briefing Iceburg (W710#15–124) ([main][nsm]).
- **Backlog:** every main/ file comes from one bulk commit (53ac8d6, 2026-06-09) with only mechanical passes since. The "English tells" written on 2026-10-18 were never applied back: «נגמר לנו», «אסיר תודה» ("grateful") and «ימים רחוקים» ("days long gone") still ship in fedew ([main][nsm]; [fedew][nsf]).

### What is not the cause
- **The 44-character limit.** Literary markers are rarer on full lines (2.07 per 1,000 words at ≥38 characters vs 2.93 under 30), and bookish swaps save 0–5 characters; מדוע ("why") is even longer than למה ([fix taxonomy][pft]; [style guides][sg]).
- **Missing slang.** The AI already over-uses יאללה (up to 13× the human) and יופי (9×). The human's colour comes from curses and particles: «לעזאזל איתך» ("damn you"), «ממזר», «חתיכת…» ("you piece of…"), «בחיי» ("jeez"), «אין מצב», «ככה», «בגלל ש» ([marker study][mf]).
- **Grammar in general.** Object suffixes are a non-issue (0.04 per 1,000 lines); possessive suffixes are at parity on content-matched episodes ([marker study][mf]).

### Where the notes disagree, and which evidence wins
- **OPUS shows habit, not naturalness.** Its majority renders "I'm most grateful" as אסיר תודה (74%), "will be executed" in the passive (55%) and "Yes, sir" as «כן אדוני» (72%) ([OPUS phrase-book][opb]). Use it to spot outliers (our כצפוי מ at 3.0 vs OPUS 0.01 per 100k tokens; ארור 50.6 vs 8.9), never to approve a form.
- **The human gold is a floor, not a ceiling.** That One Gerbil is also a fan relay from English, with subtitle-isms of its own (הו, לעזאזל at 17.2 per 1,000 lines, «הבחור הזה» "this guy", «זה רע!» "this is bad!") ([anime translationese][at]). Its zeros count against literary words; its positives don't prove a form natural. With 20 files (~7,000 lines, mostly East Blue), zeros below ~0.3 per 1,000 can't be tested.
- **"Formal grammar is fine" vs the lint.** Netflix's live action uses איני/אינו ("am/is not") and «עליי ל־» ("I must") about twice per 1,000 lines ([One Piece sources][ops]). In our show the human uses them 0–0.14 per 1,000, and 15–19 of 20 AI hits read bookish ([marker study][mf]). Same-show, precision-tested evidence wins: lint them, with a short formal-voice allowlist.
- **Possessive suffixes.** "Not a differentiator" ([One Piece sources][ops]) vs "2× the human in main" ([marker study][mf]). Content-matched parity settles it: lint only the kinship/crew subset and double possessives.
- **«הולך להיות» ("going to be").** "58 AI lines vs 2 human" ([One Piece sources][ops]) is unnormalized; per 1,000 lines it is 0.53 main, 0.16 fedew, 0.29 human ([marker study][mf]). Target only the passive «הולך להיות מוצא להורג» and "I'm going to be King" (→ «אהיה»).
- **"Too few spoken markers."** The 6.5 vs 10.7 per 1,000 gap ([translation studies][ts]) is inflated by אחי, which in the gold is Johnny and Yosaku's "aniki" for Zoro (8.6 vs 1.06 per 1,000, a content effect) ([marker study][mf]). Don't add slang to close it.
- **«לאחר כך».** Called an always-wrong hybrid ([marker study][mf]); but ל + אחר כך ("for later") is ordinary speech, and the cited hit «תשאיר את השטויות האלו לאחר כך!» ("leave this nonsense for later!") is that sense ([register map][rm]). The register map's reading is stronger: split the rule by sense.

## Israeli professionals dropped the elevated register long ago

### What the record shows
- **The elevated norm is history.** Channel 1 subtitles "often elevated" the register, with language editors enforcing it; today "the norm … has almost vanished" ([Weissbrod][weissbrod]).
- **Even then, the rule was to sound spoken.** A Channel 1 editor wrote that subtitles must be phrased "in the style of the living language", must not rise above conversational register, and should avoid bound pronouns such as «ביתו» ("his-house") and «הכרתיו» ("I-knew-him") ([Gazit][gazit]).
- **Platforms demand register matching.** Netflix: "replicate tone, register, class, formality" and "refrain from adhering to English/source language syntax" ([Netflix Hebrew guide][nf-ttsg]). It rejects lines that are "grammatically correct" but "not natural to the viewer", judged by a native who doesn't know the source ([Netflix QC][nf-qc]).
- **The pivot rule.** Through an English bridge, the target must represent the Japanese, "not the English pivot file", and pivots must carry notes on register, formality, tone and intent ([Netflix templates][nf-tpl]). Our One Pace English is an unannotated pivot written for English viewers.
- **Dubbing goes colloquial.** Netflix's Hebrew dubbing guide recommends spoken language unless the work is a period piece ([Netflix Hebrew dubbing][nf-dub]). One Piece isn't one.
- **Idiom for idiom, fillers out.** Amazon's Hebrew guide asks for "established or standard target-language expressions" and says to omit fillers like "you know, well, okay" ([Amazon][amazon]). Transtitles' Yifat Shomer calls literal translation "the most common mistake" ([Makor Rishon][shomer]).
- **The bookish words have names.** Qsubs' guide: kids, gang members and "most of us day to day" never say «היכן», «מדוע», «האם» or «מנין לך» ("where", "why", the question particle, "whence"); and don't go "too Israeli" either (סבבה, אשכרה) ([Qsubs][qsubs]). The Academy: of two synonyms the everyday one wins, and the rare one can be "ridiculous and pretentious" ([Academy][academy]).

### What anime and dubbing translators do
- **Deverbalise.** "just as I'd expect of a maou I chose" becomes "I knew I picked the right maou" ([Leonoudakis][leon]).
- **Delete English scaffolding.** Yair's fansub guide: English opens with "well" where the Japanese has nothing, so ובכן is filler; drop האם in casual questions; "Let me go!" is «תעזבו אותי!», not «תנו לי ללכת!» ([Yair][yair]).
- **Give voice with a light touch.** One or two markers per character type, not costume grammar ([Crossleaf][crossleaf]). Spoken high Hebrew easily sounds like a Gashashim sketch ([Bar-Zik][barzik]). "Don't make a small child talk like an aristocrat" ([Paradise Subs][paradise]).
- **Test by ear.** A Pokémon dubbing translator: "we are writing *spoken* language, not written", and she reads every role aloud ([Tapuz][tapuz]). Qsubs' "dry proofread" reads the Hebrew alone to catch Anglicisms ([Qsubs][qsubs]).
- **Cut, don't raise.** Subtitlers admit that space pushes them to «אנו» ("we", literary) and «מכוניתו» ("his-car") ([Makor Rishon][shomer]; [Beit Berl][beitberl]); Gazit condensed by deleting fillers instead ([Gazit][gazit]). Our 44-character lines rarely need the trade.
- **Update dated words.** Gili Bar-Hillel's new *Catcher in the Rye* swapped «חירבנתי» for «פישלתי» ("I screwed up"), dropped the stale «פושטקים», and kept «סבבה» and «אחלה» so not everything comes out «נפלא» ([Rosenthal on Bar-Hillel][barhillel]).

### What official Hebrew One Piece does
- **Netflix's live action** (16 episodes, 9,634 cues): zero כצפוי, zero אסיר תודה, zero passive "going to be"; it says «לא פלא ש…» ("no wonder…") and «אני אהיה מלך הפיראטים» 11 times out of 11 ([One Piece sources][ops]; [Netflix files][nf-la]).
- **Even official subs slip.** Netflix's *Arcane* has «מכוער» ("ugly") for "get ugly", «לחצנו יד» ("we shook hands") and «ארורה» ("damned"); the One Piece live action turns "street urchin" into «קיפוד הרחוב» ("street hedgehog") ([dubbing note][hd]; [fansub note][hf]). Imitating professionals isn't enough; we need our own calque list.

## One phrase table: the English trigger, our calque, what Israelis say

- **Merged** from twelve notes, duplicates collapsed, split into eight families for scanning.
- **"Our calque"** is a form that ships in our files unless marked "—".
- **Rewrites** are AI judgments built on the owner's fixes, the native reviews, the human gold and Netflix's Hebrew; spot-check before any batch rewrite.
- **House spelling applies** (עלי, זו, האלו, הכל). "Formal" voices = Jinbe, Sengoku, Rayleigh, Mihawk, narrators; "rough" = Zoro, Franky, Buggy's men, brawlers.

### A. Anime stock phrases that arrive through English

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| As expected of X / I'd expect no less from X | כצפוי מ… / כמצופה מ… / לא ציפיתי לפחות מ… | אין עליך / לא סתם… / ברור, זה… / מה ציפית? זה… / לא פלא | Praise vs grudging; formal: כיאה ל…. Human 0, Netflix 0; ours 27 lines |
| Nothing less than you'd expect from X | לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים | לא סתם הוא הפליג עם מלך הפיראטים | Owner-flagged (`wano 01 he.ass`) |
| As expected, I can't move (resigned さすが) | — | וכמו שחשבתי, אני כבר לא מסוגל לזוז | Zoro, TB_20 |
| To think that… / Who'd have thought | לחשוב ש… / מעולם לא חשבתי ש… | מי היה מאמין ש… / לא ייאמן ש… / לא חשבתי ש… | Rough: בחיים לא חשבתי. Gold uses לחשוב ש 4× (ruling 1) |
| Unforgivable! | בלתי נסלח / אין מחילה / זה לא ייסלח | אתה תשלם על זה / זה עבר כל גבול / זה לא יעבור בשקט | Keep "I'd never forgive myself" |
| I won't forgive you! | לא אסלח לך | אתה תשלם על זה | Ruling 5 |
| Prepare yourself / Prepare to die | התכונן למות / להכין את עצמך | אתה גמור / הלך עליך / עכשיו אתה בצרות | An order to the crew (תתכוננו) is fine |
| Get ready for me, world! | תתכונן לקראתי, עולם | עולם, תתכונן, אני בא / עולם, הנה אני בא | Owner-flagged MA_5:61 |
| I'll be your opponent | אני אהיה היריב שלך | היריב שלך זה אני / אתה מתעסק איתי עכשיו | Formal: אני אעמוד מולך |
| How convenient / this is convenient for us | הבהלה הזאת ממש נוחה לנו / כמה נוח | הבלגן הזה רק משחק לטובתנו / בדיוק מה שהיינו צריכים | Owner-flagged IM_9:74; rough: נפל לנו בול |
| Big Sis! / Big Bro! / Aniki | אחות גדולה / אח גדול | אחותי / בוס / אחי | Or just the name. 137 AI lines; אח גדול evokes the reality show |
| Leave it to me! | תשאיר את זה לי / תשאיר את זה עלי | סמוך עלי / עלי / אני על זה / זה עלי | 8 of 16 literal |
| Long time no see | עבר זמן / עבר זמן רב | מזמן לא התראינו / כמה זמן | 7 of 8 lines literal |
| Welcome back (casual) | ברוך שובך / ברוכים השבים | חזרתם / הנה אתם | Kuja court ceremony may keep it |
| Takes me back / brings back memories | מחזיר ימים / ימים רחוקים / זה מחזיר אותי אחורה | איזה זיכרונות / כמה זמן לא ראיתי את זה | OPUS: מחזיר ימים 0 hits. MA_6:33 still ships |
| Take X's head | לקחת את הראש / לכרות / לערוף / אקטע | להוריד לו את הראש | The skill's own gate example uses אקטע |
| Don't be ridiculous / Don't screw with me | אל תהיה מגוחך | אל תצחיק אותי / די עם השטויות / אתה צוחק עלי? | OPUS majority is the calque (41%) |
| What was that?! (challenging an insult) | מה זה היה? | מה אמרת? / תחזור על זה | Fine when it's about a noise |
| Who do you take me for?! | מי את חושבת שאני? | מה, את לא מכירה אותי? / את יודעת עם מי את מדברת? | |
| Well, if it isn't X! | אם זה לא… / אם אין זה… | תראו מי פה / תראו מי הגיע | IM_3 |
| Very well (assent) | טוב מאוד | בסדר / טוב / נו, טוב | טוב מאוד = "very good". Formal: בסדר גמור / כרצונך |
| Hurry up and V | תזדרז ותבריא כבר / תזדרז ותצא | תבריא כבר / יאללה, תבריא / צא כבר | 41 corpus hits, human 0 |
| If you have time to X, then Y | אם יש לך זמן לדאוג, לך לבדוק | במקום לדאוג, לך תבדוק | |
| Taste the power of X | קבל טעימה מכוח… | תראה מה בני אדם מסוגלים לעשות / קבל את זה | |
| I'm a Spike Human | אני אדם קוצים | אכלתי את פרי הקוצים | |
| A cornered rat bites | עכבר לכוד הוא דבר מפחיד | גם עכבר בפינה יכול לנשוך | Fixed in IM_5:152; keep the pattern |

### B. Discourse markers and connectives

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| Well, (opener) | ובכן | טוב / נו / אז / תראה | Or drop it. main 4.37 vs human 1.72 per 1,000; hesitant ובכן… is gold usage (ruling 1) |
| Now, / Now then (discourse) | עכשיו, | טוב / נו / מהר / יאללה | Line-initial: fedew 20.6 vs human 5.5 per 10k |
| Indeed / Truly | אכן | נכון / בדיוק / באמת / בהחלט / כן | "I did say that" → כן, אמרתי |
| Though (incl. sentence-final) | אם כי | אבל / רק ש… / למרות ש… | 24 of 25 hits translate "though" |
| However | אולם / אך | אבל | |
| Anyway / In any case | בכל אופן | בכל מקרה | The gold's EL04 choice |
| In that case | במקרה כזה | אם ככה / אז | |
| I mean / You mean | כלומר | זאת אומרת / אני מתכוון | |
| …, after all | אחרי הכל (at the end) / בכלל / בסוף | הרי… (clause start) / בסך הכל | Gold uses אחרי הכל at our rate: low priority |
| …, but that's all | אבל זה הכל | אבל רק בקושי / וזהו | |
| That's all in the past | זה הכל בעבר | זה כבר מאחוריי | |
| More importantly, | יותר חשוב / חשוב מזה | עזוב את זה / חוץ מזה / בכל מקרה | 9 of 10 literal |
| Once again (opener) | שוב, ברוך הבא אלינו | אז ברוך הבא לצוות | MA_1:16 still ships |
| Whatever happens / whatever the case | מה שיהיה / יהיה אשר יהיה | בכל מקרה / לא משנה מה | |
| To be honest / to tell the truth | אם להיות כנה / בכנות / למען האמת | האמת / האמת היא ש… | |
| I see. | אני רואה / אני מבין | הבנתי / אה, ככה / אז ככה | אני רואה = literal sight |
| I wonder if | אני תוהה אם | מעניין אם | |
| Come to think of it | אם לחשוב על זה / כשחושבים על זה | רגע, בעצם / אגב | |
| Understood. | מובן / הובן | הבנתי / ברור / קיבלתי | Soldiers: כן, המפקד |
| you know (tag) | אתה יודע (at the end) | הלו / נו / נכון? | Or drop it |
| Is that so? | כך זה? | באמת? / אה, ככה? | |
| With that, (= and now) | עם זה | ועכשיו / זהו, עכשיו | |
| just (filler) | פשוט | רק / כבר | Or drop it; 235 of 270 hits are "just". Style cap, not a lint |
| too (line-final) | אני רוצה נשק חזק יותר גם | גם אני רוצה נשק חזק יותר | גם goes before the word it modifies |
| Before all that | — | קודם כל | |
| I guess / I suppose | אני מניח | כנראה / נראה לי / בטח | Human parity: vary it, don't ban it |
| because (casual speaker) | מכיוון ש / מאחר ש | כי / בגלל ש | Human parity overall; a voice issue (Luffy) |

### C. English grammar frames

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| X is going to be executed | אייס הולך להיות מוצא להורג / אייס יוצא להורג היום | הולכים להוציא את אייס להורג / מוציאים את אייס להורג היום | News-style past הוצא להורג is fine |
| I'm going to be King / It's going to be hard | שאני הולך להיות מלך הפיראטים / זה לא הולך להיות קל | אני אהיה מלך הפיראטים / זה לא יהיה קל | Netflix: 11 of 11 |
| was X-ed by Y | לופי נרדף על ידי בנות הכפר / נהפכנו לקרח על ידי אאוקיג'י | בנות הכפר רודפות אחרי לופי / אאוקיג'י הקפיא אותנו | Name the doer |
| By whom?! | על ידי מי? | מי ירה בה? | |
| We must / you must | עלינו לעזוב / מה עלי לעשות? | אנחנו חייבים לעזוב / מה אני אמור לעשות? | |
| must be (epistemic) | אתה חייב להיות אונימארו / זה חייב להיות תגבורות | אתה בטח אונימארו / זו בטח תגבורת | |
| You must be crazy | אתה חייב להיות משוגע | השתגעת? / אתה בטח משוגע | |
| Is it…? / Do you…? | האם הכל מוכן? | הכל מוכן? | Drop האם; or open with רגע / מה |
| X and Y both | הצי ופיראטי זקן לבן שניהם… | גם הצי וגם פיראטי זקן לבן… | |
| Time for X to | זמן לקפטן באגי להשתלט | הגיע הזמן שקפטן באגי ישתלט | |
| X could still be alive | — | יכול להיות שהוא עוד חי | |
| I couldn't be happier | אני לא יכול להיות מאושר יותר | אני כל כך שמח | |
| sure did / sure is | בטח עשיתם שם תעלול מטורף | איזה תעלול מטורף עשיתם / ממש / באמת | בטח reads "probably" |
| I can't help but V | אני לא יכול שלא לחשוב | אני בטוח ש… / אי אפשר לא לצחוק | |
| Why don't you two V | למה ששניכם לא תרדו? | למה שלא תרדו? / אז תרדו כבר | למה ש… = "why would" |
| on the verge of | על סף להפוך לעבדים | כמעט נהיינו עבדים | |
| Did I hear you wrong? | שמעתי אותך לא נכון? | לא שמעתי טוב? | |
| Never mind me! | לא חשוב עלי | עזבי אותי, העיקר שאת בסדר | Not Hebrew as written |
| Let me go! | תנו לי ללכת | תעזבו אותי | |
| Let him join us! | בואו שהוא יצטרף אלינו | שיצטרף אלינו | |
| Stand in my way and I'll… | תעמוד בדרכי, ואקח… | אם תעמוד בדרכי, אקח… | A bare imperative reads as an order |
| -ing or abstract-noun subject | פתירת תעלומה כזו היא… | זה כל הכיף בקרב, לא? לפצח את הסוד | Make the doer the subject; split long lines |
| X is all about Y | בגדי חוץ זה הכל המלמלה / הכל סובב סביב חיוכים | בבגדי חוץ, המלמלות זה העיקר / עכשיו הכל זה חיוכים | |
| (You) must be hungry | בטח רעב | אתה בטח רעב | A present-tense verb needs its subject |
| you two | אתם שניכם / על אתכם שניים | שניכם / עליכם, שניכם | |
| thank you for -ing | תודה לך שדאגת לי | תודה שדאגת לי | |
| their own | של עצמם | שלהם | |
| They said WHAT?! | הם אמרו מה? | מה הם אמרו? | |
| X, you say? | ארלונג, אתם אומרים? | ארלונג, אה? | Gold uses it twice: cap, don't ban |

### D. Idioms and collocations

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| We're done for | נגמר לנו / נגמר להם | הלך עלינו / אנחנו גמורים / אכלנו אותה | נגמר לנו = "we ran out". IM_4:17, IM_4:391, MA_6:35 still ship |
| We got lucky | יצא לנו מזל | שיחק לנו המזל / היה לנו מזל | OPUS: 2 vs 98 vs 6,915 |
| Breathing down our necks | נושם בעורף | נושף לנו בעורף | Dictionary form |
| Just around the corner | כבר נושם בעורף | ממש מעבר לפינה / כבר כאן | IM_9:87, owner-flagged |
| Lend (me) strength | השאלתי לך קצת כוח / תשאילי לי את כוחך | נתתי לך קצת כוח / תני לי מהכוח שלך | |
| Drop your guard / I let my guard down | להוריד את השמירה / המשמר / הורדתי את ההגנה | אל תוריד את הגארד / לא שמתי לב / נתפסתי לא מוכן | |
| One step behind | היינו צעד אחד מאחור | הם הקדימו אותנו | |
| Unleash hell on HQ | נפתח גיהנום במפקדת הצי | בואו נהפוך את מפקדת הצי לגיהנום | |
| Ugly side effects / it'll get ugly | תופעות לוואי מכוערות / זה יהיה מכוער | תופעות לוואי קשות / זה ייגמר רע | Netflix's Arcane has the same calque |
| Your emotions are carrying you away | הרגש סוחב אתכם | אתם נסחפים | |
| What is X thinking?! | על מה הממשלה חושבת? | מה הממשלה חושבת לעצמה? | |
| There's no escape | אין בריחה | אין לאן לברוח | |
| We fell for it | נפלנו בה | נפלנו בפח | |
| Contact was cut | נפסק הקשר | נותק הקשר | |
| I gave up the title | זנחתי את התואר | ויתרתי על התואר | |
| That was close! | בקושי | היה קרוב / כמעט | |
| Watch your tone | תשמור על הטון שלך | תיזהר איך אתה מדבר | |
| Caught my eye | משהו כאן תפס את עיני | משהו פה קפץ לי לעין | |
| There's no way (that) | אין שום דרך ש… | אין מצב ש… | |
| I'd bet my life on it | אני מוכן לשים את חיי על זה | אני מוכן להתערב על החיים שלי | |
| Hands off! | ידיים מלוכלכות מחוץ ל… | תורידו את הידיים מ… | |
| Kids will be kids | ילדים כבר ילדים | ילדים זה ילדים | |
| Without further ado | ללא דחיינות | בלי הקדמות מיותרות | |
| Make an exception | לעשות יוצא מן הכלל | לעשות חריג | |
| Lecture me | לטפוח לי מוסר | להטיף לי מוסר | |
| A heap of trouble | ערמה של צרות | הסתבכת לא רע / צרה צרורה | |
| While we're at it | כל עוד אנחנו בעניין | וכבר שאנחנו בזה | |
| Fight back | להחזיר מלחמה | להילחם / להשיב מלחמה | |
| One thing after another | זה דבר אחרי דבר | צרה אחרי צרה | |
| No laughing matter | זה לא עניין מצחיק | זה לא צחוק | |
| Trump card | קלף הניצחון | הקלף המנצח | |
| Push your luck | אל תמתחו את המזל שלכם | אל תמתחו את החבל | |
| I had terrible luck / bad luck | היה לי מזל נורא / מזל ביש | לא היה לי שום מזל / חוסר מזל / איזו באסה | |
| What's with X? | מה עם…? / מה העניין עם…? | מה הקטע של…? | AM_5:311 reads "what about these birds?" |
| What got into him? | מה עבר על הזקן הזה? | מה נכנס בזקן הזה? | |
| Heaven decides | בידי השמיים | בידי שמיים | No article |
| I made a decision | עשיתי החלטה | קיבלתי החלטה / טעיתי | |
| Discovery after discovery | גילוי רודף גילוי, וכולם מטלטלים | גילוי אחרי גילוי, וכולם בהלם | Also מטלטלים → מטולטלים |
| Had me on pins and needles | הוא הוציא אותי מהקיפאון | הוא ממש הלחיץ אותי | |

### E. False friends and wrong word sense

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| We were undercover | היינו במחתרת | היינו סוכנים סמויים | מחתרת = resistance movement |
| You beat (defeated) X | הכית את… | ניצחת את… | הכית = "you hit" |
| I got cocky | התנשאתי | עפתי על עצמי | התנשאתי = "I was condescending" |
| Show yourself! | תראה את עצמך | צא מהמחבוא / תתגלה | Means "look at yourself" |
| Wrong one! | לא נכון | לא זאת | Means "untrue" |
| Allow me to go | תן לי ללכת | אני אלך | Means "release me" |
| with my life | בחיי | בכל מחיר | Reads "I swear" |
| careless (of myself) | רשלן | לא שמתי לב / פספסתי | |
| Don't be unreasonable | אל תהיי כזו בלתי סבירה | נו, אל תגזימי | |
| You're not stopping here | אתה לא נעצר פה | אתה לא מתכוון לעצור פה, נכון? | Reads "not being arrested" |
| security (staff) | מאבטחים | סוהרים / שומרים | |
| the front line | השורה הראשונה | הקו הראשון | |
| a trick (feat) | תרגיל | משהו מדהים | תרגיל = a con |
| misfire | התקלקלו / כשלו | פספסו / לא נורו | |
| nosy | סקרן | חטטן | |
| helpless (= hopeless) | חסרי אונים | חסרי תקנה | |
| simple-minded | ריקים | פשוטים / טיפשים | |
| Knight of the Sea (Jinbe) | בכור הים | אביר הים | "Firstborn of the sea"; six he.json files, see bugs |
| pawns / puppets | כפיות | בובות | כפיות = spoons |
| Right! (acknowledging) | נכון | טוב / סגור / כן | נכון = "correct" |
| Disappear! | תתעלם | תיעלם | "Ignore!" vs "vanish!" |
| But I digress | אבל אני מסתטה | אבל לא משנה / נעזוב את זה | |
| a nice figure (body) | יש לי דמות יפה | יש לי גוף יפה | דמות = character |
| the royal family | המשפחה המלוכנית | משפחת המלוכה | מלוכני = monarchist |
| just (a moment ago) | עכשיו | הרגע / קודם | |
| You won't escape with just a burn | לא תסתפק בכוויה | זה לא ייגמר בכוויה | Reads "won't settle for" |
| Duck! | כופף | תתכופף | |

### F. Bookish words with an everyday twin

| English trigger | Bookish (ours) | Spoken | Notes |
|---|---|---|---|
| Is it…? (yes/no question) | האם | (drop it) | 13× human. OK in introspective monologue |
| where / how / why / whence | היכן / כיצד / מדוע / מאין | איפה / איך / למה / מאיפה | |
| is not / am not / are not | אינו / אינני / אינך | הוא לא / אני לא / אתה לא | Present tense only, even in writing |
| now / just now / for now / from now on / so far | כעת / זה עתה / לעת עתה / מעתה / עד כה | עכשיו / הרגע / בינתיים / מעכשיו / עד עכשיו | |
| so (+ adjective) | כה | כל כך | |
| please | אנא | בבקשה | Or drop it. Ritual prayer may keep אנא |
| to say | לומר | להגיד | |
| Impossible! / Could it be…? | לא ייתכן / האם ייתכן…? | אין מצב / לא יכול להיות / רגע, זה…? | Still 0.77 per 1,000 in fedew |
| after / afterwards | לאחר / לאחר מכן | אחרי / אחר כך / אחרי זה | |
| that / when | אשר / כאשר | ש / כש | |
| we | אנו | אנחנו | Proclamations may keep אנו |
| had better | מוטב | עדיף / כדאי | |
| disgrace | חרפה | בושה / ביזיון / מביך / כתם | Human 0 |
| ordered | ציווה | אמר / נתן הוראה / הורה | OPUS: הורה 50%, ציווה 7%. Owner-flagged MA_7:71 |
| grateful / be grateful | אסיר תודה | תודה רבה / אני מודה לך / אני חייב לך / תגיד תודה ש… | Human 0, Netflix 0 |
| abandoned / gave up | זנח | ויתר על / עזב | |
| suddenly | לפתע | פתאום | |
| completely | לחלוטין | לגמרי | |
| moreover | יתרה מזאת | וחוץ מזה | |
| from now on | מכאן ואילך | מעכשיו | |
| these days | בימים אלה | היום / בזמן האחרון | |
| first (of all) | ראשית | קודם כל | |
| only | בלבד | רק | |
| also | כמו כן | וגם | |
| I won't let | לא אניח / לא אאפשר | לא אתן | |
| no way, never | בשום פנים | בחיים לא / אין מצב | |
| this is | זוהי | זו | |
| in vain / rather | לשווא / למדי | סתם / די | |
| Behold! / Beware! | הביטו / היזהר | תראו / הנה / תיזהר / זהירות | |
| thanks to you | תודות לכם / הודות לך | בזכותכם / בזכותך | |
| conceived a child | הוליד | נולד לו | MA_1:351 |
| defeat (bring down) | להכריע | להפיל / לנצח | |
| the boss | השולט | הבוס | Revert IM_3:509 |
| we'll leisurely find out | נברר בנחת | יהיה לנו כל הזמן שבעולם לברר | |
| yearn | לייחל | לרצות / לקוות | |
| fool | אוויל / שוטה | אידיוט / טיפש | |
| honestly | בכנות | האמת | |
| as for me | ובאשר לי | ואני | |
| do as you please | תעשו כרצונכם | תעשו מה שבא לכם | |
| carry | תישא | תיקח / תחזיק | |
| lest | פן | אחרת / שלא | |
| feminine commands | עצרי / מהרי / עשי / ספרי / המתיני | תעצרי / תמהרי / תעשי / תספרי / חכי | ~100 in main vs 2 in the gold |
| Die! | מות | תמות | |
| my men / my friends / his friends / your father | אנשיי / ידידיי / חבריו / אביך | חבר'ה / החבר'ה שלי / החברים שלו / אבא שלך | Keep frozen: בכל ליבי, את חייו, בעקבותיו, לדעתי |
| the execution of this man | הוצאתו להורג של האיש הזה | ההוצאה להורג של האיש הזה | Never a suffix plus של |

### G. Curses, insults and interjections

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| Damn you! | ארור אתה / ארור שכמוך | לעזאזל איתך / יא ממזר | The gold's choice, 2.87 per 1,000 |
| damn X (adjective) | כריש ארור / מטומטמים ארורים | כריש מחורבן / יא מטומטמים / חתיכת אידיוט | Ours 50.6 vs gold 6.3 per 100k tokens; villains may keep ארור sparingly |
| Damn it! | ארור | לעזאזל / שיט / אוף | Frustration: אוף |
| Damn you (to hell) | לעזאזל אותך / לעזאזל עליה | לך לעזאזל / שתלך לעזאזל | לעזאזל takes no object |
| Damn that Kuma! | לעזאזל ברתולומיו קומא | שיילך לעזאזל, הקומא הזה | |
| You bastard! | מנוול שכמוך | יא מנוול / חתיכת מנוול | שכמוך for villains only (ruling 9) |
| Villain! (vocative) | נבל | מנוול / חלאה | |
| Sons of bitches | בני כלבה | בני זונות / מנוולים | Match the English strength |
| Oh? / Ho? (intrigued) | אוהו? / אוה | הממ? / או? / מה יש לנו פה? | 240 main lines, gold 0 |
| Good grief / Oh my | אוי ואבוי | אוף / נו באמת / וואי | An elder (Nyon) may keep it |
| Oh my God | אלוהים אדירים | וואו / לא יכול להיות / אמאל'ה | |
| Well, well… | הנה הנה | תראו תראו | |
| What in the world | מה… בעולם | מה לעזאזל / מה זה? | |
| Hey, big trouble! | היי, צרה גדולה | חבר'ה, יש בעיה רצינית | |
| What a relief | איזו הקלה | איזה מזל / פיו | |
| Good job / Well done | עבודה טובה | כל הכבוד / יפה מאוד / תותח | |
| Don't get cocky | אל תהיה שחצן / אל תתחספפי | אל תתלהב / אל תתחצפי | תתחספפי is a non-word |
| Get out of my sight! | תסתלקי מעיני | תסתלקי לי מהעיניים / עופי מפה | |
| freaking dumbass | אידיוט ארור | יא טמבל | |
| Small fry / trash | דגיגים | אפסים / חלאות | |
| How rude! / Why, you! | — | איזו חוצפה / איך אתה מעז? | |
| This is bad! | זה רע | זה לא טוב / אוי לא / יש לנו בעיה | The gold uses זה רע 7× (ruling 1) |

### H. Address and politeness

| English trigger | Our calque | Natural Hebrew | Notes |
|---|---|---|---|
| Yes, sir! (soldiers, guards) | כן, אדוני | כן, המפקד / קיבלתי / לפקודתך | IDF usage and the gold (ruling 7) |
| sir (butler, waiter, servant) | — | אדוני | Keep for service roles |
| …, men! / My men! | אנשים / אנשים שלי / אנשיי | חבר'ה / כולם / חיילים | Commander's אנשיי: ruling 8 |
| Please (politeness filler) | בבקשה תובילו את הדרך / המתיני בבקשה | אחריכם / חכי רגע / רק רגע | Hebrew uses בבקשה less than English |
| Sorry (quick) | אני מצטער | סליחה / מצטער | Keep אני מצטער for real remorse |
| Congratulations | ברכותיי | כל הכבוד / מזל טוב | |
| this guy / that guy (こいつ) | הבחור הזה | הוא / זה / הטיפוס הזה | 248 lines; formal: האיש הזה |
| Old man! (to a stranger) | זקן | דוד / אדוני | Rude in Hebrew (ruling 10) |
| Luffy-kun | — | לופי | Drop -kun |
| Sink the Moby Dick! Kill Whitebeard! | הטביעו את המובי דיק / תהרגו את זקן לבן | להטביע את המובי דיק / להרוג את זקן לבן | One command system per order |

### Keep these: they already read naturally
- «אבא» for Whitebeard's "Pops/Old man" (46 of 46) and «אני סומך עליך» ("I'm counting on you") ([fix taxonomy][pft]).
- «אין מצב», «מה קורה פה?», «זה היה קרוב», «אין טעם», «תחזיק מעמד», «איך אתה מעז» ([OPUS phrase-book][opb]).
- Better than the OPUS majority: «מעניין אם» (not «אני תוהה»), «אל תזלזל בי» (not «אל תמעיט בערכי»), «זוז לי מהדרך» (not «זוז מדרכי»), «הצלחנו» (not «עשינו זאת») ([OPUS phrase-book][opb]).

## Prevention: word-list voice cards, a register question, sixteen safe lints

### Voice cards and batch prompt sheets
Files: [_INSTRUCTIONS.txt][instr], [_IM_BATCH.txt][imb], and every future batch sheet.
- **New card format:** register in three words, a **SAY** list (5 words), a **NEVER** list (5 words), one model line.
- **One ceiling line on every sheet:** "Formal = complete sentences, no slang, polite address (אדוני, אדון X, סליחה, בבקשה). Formal ≠ literary."
- **Global NEVER list for non-comic speakers:** היכן, כיצד, מדוע, אינו/אינה/אינני, הנני, אשר, counterfactual לו, ציווה, הכריע, חרפה, יתרה מזאת, כצפוי/כמצופה, אסיר תודה, suffixed possessives on ordinary nouns ([character voice][cv]).
- **Pompous exception:** Celestial Dragons, Hannyabal, Disco, Ivankov's announcements and Kumadori may use one elevated item per line, because there it is the joke ([character voice][cv]).
- **Replace the bad model pair** at [_INSTRUCTIONS.txt][instr] l.16, which shipped as IM_5:0: «רע פה. יותר מידי מסוכן» → «זה לא טוב. מסוכן פה מידי!» ("This is bad. It's too dangerous here!").
- **Add a register column to `docs/characters.json`.** It is the equivalent of Netflix's required "formality tables" ([Netflix general requirements][nf-gen]).

Example cards, tightened from [character voice][cv]:
- **Jinbe:** calm, complete, short.
  - SAY: «אני חייב לך», «תסמוך עלי», «אל תדאג», «לא אתן ל…», «חובתי» (sparingly)
  - NEVER: יאללה, אחי, היכן, אינה/אינני, אכן, חרפה, ציווה
  - Model: «ביבשה אני פחות חזק, אבל...» ("On land I'm weaker, but…")
- **Magellan:** bureaucratic-cold, menacing understatement.
  - SAY: «בסמכותי כסוהר», «זה מביך», «זה לא יקרה», «תדווחו», «כתם על אימפל דאון»
  - NEVER: חרפה, בנחת, להכריע, הנני, אשר
  - Model: «בתור סוהר, זה מביך אותי מאוד.» ("As warden, this embarrasses me greatly.")
- **Sengoku:** news-anchor Hebrew, barked orders.
  - SAY: «זו פקודה», «חייבים», «אסור לנו», «בכל מחיר», «זה לא מקובל», «אל תצחיק אותי»
  - NEVER: «ראשו של…», חרפה, «אני פוקד עליך», «אל תהיה מגוחך»
  - Model: «תנתק את השידור המגוחך הזה! זו פקודה!» ("Cut that ridiculous broadcast! That's an order!")
- **Marines and prison guards:** IDF register.
  - SAY: «כן, המפקד!», «קיבלתי!», «לפקודתך!», «אש!», «להתקדם!»
  - NEVER: «כן, אדוני!» by reflex; a classical and a future-tense command in one order
- **Brook, Robin, Rayleigh:** polite but modern.
  - SAY: «בבקשה», «סלחו לי», «הרשו לי», «טוב,»
  - NEVER: «תהיה זאת חרפה», «לו יכולתי», «יתרה מזאת», ובכן as an opener
- **Luffy, Zoro, Nami, Franky, Usopp:** casual.
  - NEVER: מעולם, ובכן, אכן, כאשר, אם כי, מכיוון ש, suffixed pronouns

### The skill
File: [SKILL.md][skill].
- **Step 2 (voice card):** replace "3–5 words of register" with the SAY/NEVER/model-line format and the "formal ≠ literary" line.
- **Gate 7.1 example:** it teaches «אני אקטע לו את הראש» ("I'll sever his head"); use «אני אוריד לו את הראש» to match the take-X's-head rule.
- **New gate 7.4, register:** does the line contain a word from the NEVER list, and is this speaker allowed it? Read it aloud as the character: would a Hebrew dub actor say it?
- **New fix rule:** fix a flagged line by re-voicing it, usually with more, shorter, everyday words; never by swapping in one higher word; then check the new line against the NEVER list.
- **New condensing rule:** cut fillers, vocatives, subject pronouns and context-confirming clauses before reaching for אנו, אינו or a suffixed noun.
- **Self-check:** add the register lint and the English-trigger check once they exist.

### docs/translation-learnings.md
File: [translation-learnings.md][learn].
- **§1.5 "English tells":** add the phrase-table families above (or link a new `docs/translation-phrasebook.md`) and a "human-zero literary words, linted" list.
- **Keep "no phrase is banned" for human-parity items:** אני מניח, אחרי הכל, זה הכל, a bare הולך להיות, תודה לך, מה לעזאזל, אני מצטער, ללא, עבור, ביותר, מעולם, מכיוון ש ([marker study][mf]).
- **Don't over-apply l.69.** «אני אסיר תודה לך» → «אני מודה לך» stands, but a standalone «תודה לך.» is fine; the human uses it 10× more often than the AI.
- **Drop one stiff "good" example** from §1.5: «אתה בהחלט תופס מעצמך יחסית לאיש מת!» ("you surely think highly of yourself for a dead man") tells the model elevated is fine ([fix taxonomy][pft]).
- **Add three rules:** idioms exact or plain («נושף בעורף», never «נושם»); formal ≠ literary; condense by cutting.
- **Pending rulings:** «זה רע!» (l.57), «הו/או» and «בנאדם!» (l.53, §2 rule 6), and the credit line (l.156).

### The native-review prompt
File: [_NATIVE_REVIEW.txt][nr].
- **Narrow the exemption at l.44** to "short shouted exclamations and attack calls"; delete "theatrical villain speech".
- **Add a register question after l.38:** "Also flag any line that sounds written, literary, biblical, legal or newsreader-like rather than spoken (e.g. היכן, אינו, חרפה, ייתכן, כצפוי, שכמותך, אנשיי, questions that open with האם, suffixed possessives, double possessives), even when it is grammatical, unless the character is a deliberate archaic stylist."
- **Add the dub test:** "Read each line aloud as that character. Would a Hebrew dub actor say it?"
- **Step 3 triage:** "Fix by re-voicing the line, never by swapping in one higher-register word. Check every fix against the register question."
- **Round 2** uses the same prompt, so up-register fixes get caught.
- **Prime one reader.** Make one of the two round-1 readers register-primed instead of a second generic reader; the generic pair overlapped on 21 of about 27 flags.
- **Keep it blind.** Never show lint or n-gram flags to the readers; that anchors them ([n-gram study][ng]).

### Lint rules with measured precision and human-file rates
Today [lint-subs.js][lint] scans only `subtitles/*he.srt` for names, terms, nif'al spelling, word splits and duplicate cues. It has no register rules.
- **Build a register lint** that reads dialogue only (he.json where it exists; otherwise .ass styles `Main|Flashback|Thought|Secondary|Narrator|Roger`), skips human ` He.ass` folders, excludes names (הינה is Hina, ואנו is Wano, בל is Bell-mère), prints the human rate beside each hit, and takes a speaker allowlist from the voice cards (cues.json `name` where filled).
- **Tier A warns with a suggested fix; Tier B is a per-episode density flag.** Full regexes: [lint_rules_rates.tsv][rules]. Precision is one AI reader's judgment on 12–20 sampled hits per rule ([marker study][mf]).

**Tier A: ≥80% precision, near-zero in the human files (per 1,000 dialogue lines)**

| Rule | Pattern | Human | main | fedew | Precision | Exceptions / fix |
|---|---|---|---|---|---|---|
| A01 | האם | 0.43 | 7.23 | 0.77 | 19/20 | Drop it; introspective monologue OK |
| A02 | אנא | 0 | 1.16 | 0.13 | 17/20 | Servants, proclamations |
| A03 | עתה | 0 | 0.81 | 0.32 | 20/20 | Includes זה עתה, לעת עתה, מעתה |
| A04 | ייתכן | 0 | 0.70 | 0.77 | 16/20 | Still high in fedew; lab reports OK |
| A05 | עלינו ל… | 0 | 0.88 | 0.23 | ~15/17 | "must" + infinitive; excludes אוסר עליכם, נגזר עלי, מוטל עלי |
| A06 | אכן | 0.14 | 1.22 | 0.80 | 17/20 | Pompous samurai |
| A07 | אינו / אינך / אינני | 0.14 | 1.25 | 0.39 | 19/20 | Official broadcasts |
| A08 | ארור אתה / ארור שכמוך | 0 | 0.78 | 0.39 | 15/15 | Also a line-initial lone curse |
| A09 | כה | 0 | 0.47 | 0.10 | 20/20 | Includes עד כה |
| A11 | לומר | 0 | 1.64 | 0.68 | 16/20 | "How shall I put it" tolerable |
| A12 | אם כי | 0 | 0.57 | 0.84 | 19/20 | Still high in fedew |
| A13 | אולם | 0 | 0.71 | 0.03 | 17/20 | "however" only; exclude halls |
| A14 | כעת | 0 | 0.13 | 0.06 | 10/12 | Narration |
| A15 | אסיר תודה | 0 | 0.30 | 0.55 | 14/15 | Still high in fedew |
| A17 | לאחר | 0.14 | 0.64 | 0.10 | 16/20 | Flashback narrator; the "for later" sense is fine |
| A18 | היזהר / היזהרו | 0 | 0.34 | 0.16 | 13/15 | → תיזהר / זהירות |

**Tier B: 40–79% precision, a density flag for review**

| Rule | Pattern | Human | main | fedew | Precision | Note |
|---|---|---|---|---|---|---|
| B01 | על ידי | 0.72 | 2.46 | 1.51 | ~10/15 | Prefer the active voice |
| B02 | ובכן | 1.72 | 4.37 | 2.09 | ~50% | Cap it; the gold uses it in 9 of 20 files |
| B03 | בכל אופן | 0.14 | 0.43 | 1.19 | ~10/20 | → בכל מקרה |
| B04 | במקרה כזה | 0 | 0.39 | 0.29 | 8/12 | → אם ככה |
| B05 | כלומר | 0 | 1.24 | 0.93 | ~10/20 | → זאת אומרת |
| B06 | לכאן | 0.72 | 3.79 | 5.15 | ~50% | → הנה / לפה |
| B07 | ארור (adjective) | 0.29 | 1.10 | 1.51 | ~40% | Vary: מחורבן, חתיכת |
| B10 | אנו | 0 | 0.21 | 0.03 | 9/15 | Excluding Wano |
| B11 | מוצא / יוצא / הוצא להורג | 0 | 0.24 | 0.16 | 9/15 | Passive verb; past news-style OK |
| B12 | מובן | 0 | 0.76 | 0.13 | 14/20 | As a whole reply → הבנתי / קיבלתי |
| B13 | אביך / חבריו / אנשיי / ספינתו | 0.29 | 2.57 | 1.22 | 12/20 | Allowlist frozen phrases |

**Candidate rules with near-zero human use but no precision sample yet**
- **כצפוי מ / כמצופה מ / לא ציפיתי לפחות / לא פחות ממה ש:** human 0; AI 27 + 3 lines; the owner's own flagged family ([One Piece sources][ops]).
- **ציווה / ציוו / ציווית:** human 0; AI 9 hits. **חרפה:** human 0; AI 13 ([marker study][mf]; [register map][rm]).
- **שכמותך:** human 0; fedew 11.0 and main 2.0 per 10k lines (ruling 9). **תזדרז ו…:** human 0; fedew 10.7 per 10k, 41 hits ([fedew][nsf]).
- **אוהו / אוה:** human 0; 240 main lines. **Feminine formal commands** (עצרי, מהרי, עשי…): 2 in the gold vs about 100 in main ([main][nsm]).
- **Owner-ruled phrases:** «נגמר לנו!» / «נגמר להם!» at clause end; «מחזיר ימים» / «ימים רחוקים»; «נושם בעורף»; «מסתטה» ([fedew][nsf]; [OPUS phrase-book][opb]).
- **«כן, אדוני»:** human 0; 2.7 per 1,000 in IM+MA. **«אחות גדולה» / «אח גדול» as vocatives:** human 0.11 vs AI 0.86 per 1,000 ([character voice][cv]; [anime translationese][at]).
- **Line-initial «עכשיו,»:** human 5.5 vs fedew 20.6 and main 16.3 per 10k lines ([fedew][nsf]).
- **One-token register collision:** a literary word in a line that also carries spoken markers (אני לא, איפה, של, a future-tense command) ([register map][rm]).
- **Grammar checks:** זו/אלה before a masculine noun; הצי with a plural verb; a word split across `\N` with fragments longer than one letter (today's lint only catches one-letter fragments).

**Do not lint (the human uses these as much or more)**
- תודה לך, מה לעזאזל, אני מצטער, אני מניח, אחרי הכל, זה הכל, a bare הולך להיות.
- ללא, עבור, כלפי, באמצעות, אף ("even"), מאשר, ביותר, מעולם, מכיוון ש.
- Formal commands in general («התחבא!», «הסתלק!», «סלח לי!»), possessive suffixes in general, בוודאות, מסוגל, בתור.
- יאללה and פשוט are over-used but not bookish: a style cap, not a lint ([marker study][mf]).

**What the lint will and won't do**
- **Volume:** Tier A flags **1,819** spots in main (18.8 per 1,000 lines), **196** in fedew (6.3) and **6** in the human files (0.86) ([marker study][mf]).
- **Recall:** it caught **3 of 92** lines the native reviews rewrote and **2 of 8** of the owner's examples; regexes find **at most ~17%** of what a native reader flags in both samples ([marker study][mf]; [main][nsm]; [fedew][nsf]).
- **Role:** a backlog cleaner for main/ and a guardrail for new episodes. It does not replace the blind read.

## Cleanup: about 1,800 mechanical fixes in main/, then blind reads by arc

### Problem rates by corpus

| Corpus | Files / dialogue lines | Native-style read (per 100 lines) | Tier-A lint hits (per 1,000 lines) | Episodes above the human max |
|---|---|---|---|---|
| Human gold (` He.ass`) | 20 / 6,974 | 0.6 clear, 5.9 strict (Arlong Park 06) | 0.86 (median 0, max 5.4) | — |
| main/ AI, June bulk | 257 / 96,586 | 12.8 clear (CI 9–17), 27.0 strict (CI 22–32) | 18.8 (episode median 16.9) | 219 of 257 |
| fedew/ AI | 85 / 31,063 | 11.0 confirmed, 2.0 high-confidence | 6.3 (episode median 4.6) | 42 of 85 |

Sources: [main sample][nsm], [fedew sample][nsf], [marker study][mf]. The two reads used different readers and thresholds, so compare each corpus with its own human control, not with each other.

- **main/ in absolute terms:** about **12,500 clearly unnatural lines** (CI 8,800–16,400) and **~26,000** counting milder ones, roughly 50 + 50 per episode ([main][nsm]).
- **fedew by production date:** June EL_15 **19.9** and TB_9 **21.3** per 100; August SAB_7 **11.6**; IM_4 after its rewrite pass **5.4**; MA_6 from the October sheets **6.0**; MA_1 after the native gate **2.5** ([fedew][nsf]).
- **Implication:** the 63 June–August fedew episodes (Enies Lobby, Post-Enies Lobby, Thriller Bark, Sabaody) likely hold 40–80 such lines each.

### Problem rates by arc
Tier-A lint hits per 1,000 dialogue lines ([arc density][arcd]); for fedew also the 18-regex "tells" scan per 10,000 lines ([fedew][nsf]).

| main/ arc | Episodes | Tier A /1k |
|---|---|---|
| Reverie | 3 | 34.8 |
| Loguetown | 3 | 31.1 |
| Whisky Peak | 2 | 30.2 |
| Reverse Mountain | 2 | 28.3 |
| Skypiea | 26 | 27.7 |
| Wano | 60 | 22.6 |
| Cover stories | 3 | 21.9 |
| Little Garden | 5 | 21.2 |
| Post War | 8 | 19.7 |
| Return to Sabaody | 3 | 19.2 |
| Drum Island | 8 | 18.7 |
| Water Seven | 20 | 18.6 |
| Alabasta | 16 | 18.3 |
| Enies Lobby (main cut) | 9 | 17.0 |
| Baratie | 1 | 16.5 |
| Whole Cake Island | 39 | 16.2 |
| Jaya | 8 | 12.4 |
| Arlong Park | 9 | 11.0 |
| Egghead | 24 | 8.4 |
| Syrup Village | 1 | 2.2 |
| Romance Dawn | 4 | 1.6 |
| Orange Town | 2 | 0.0 |

| fedew/ arc | Episodes | Tier A /1k | Tells /10k |
|---|---|---|---|
| Sabaody | 11 | 8.8 | 102 |
| Thriller Bark | 22 | 8.2 | 148 |
| Enies Lobby | 24 | 7.5 | 124 |
| Post-Enies Lobby | 5 | 7.1 | 103 |
| Amazon Lily | 5 | 3.5 | 48 |
| Impel Down | 10 | 1.8 | 81 |
| Marineford | 8 | 1.3 | 36 |

- **Human arcs run 0–3.3** on the same Tier-A scale.
- **Worst main/ episodes:** Wano 27 (55.2), Wano 22 (49.8), Reverie 02 (48.9), Skypiea 09 (48.6), Whisky Peak 01 (47.5) ([episode density][density]).
- **Worst fedew episodes:** Thriller Bark 13 (20.2), Sabaody 02 (17.2), Sabaody 03 (16.3), Post-Enies Lobby 02 (16.0), Enies Lobby 21 (15.6) ([marker study][mf]).
- **Part of the Wano, Skypiea and Reverie density is in-character** (samurai, priests, nobles), so אנא, אכן and אינו hits there need a keep-for-voice option. האם and לומר have no such excuse.
- **Orange Town and Romance Dawn are unexplained low.** Use them to check that the lint doesn't over-fire.

### What each detection method can and cannot catch

| Method | Catches | Misses | Measured | Use it for |
|---|---|---|---|---|
| Tier-A lexical lint | Literary function words, curse formulas | Idioms, collocations, false friends, English frames | ≥80% precision; recall 3 of 92 review rewrites | main/ backlog; guardrail on new episodes |
| Tier-B density flags | Over-used neutral-formal words | Same as Tier A | 40–79% precision | Ranking episodes for review |
| English trigger + Hebrew calque pairing | Stock phrases, discourse markers, false friends, idioms with a known English cue | Anything without a listed trigger | High by design, unmeasured; needs `cues.json` (56 fedew episodes) | fedew now; main/ and PEN after fetching the English |
| N-gram anti-collocation (550M OPUS tokens) | Word-salad calques and grammar slips with common words, e.g. «לעזאזל אותך», «על אתכם שניים», «בטח רעב»; formatting bugs | Bookish-but-grammatical lines; rare content words; all six of the owner's examples | Precision 72% in the top 50, 60% in the top 100, ~35% in ranks 101–500; AUC 0.67; recall ≤14% | One-off sweep of the top 200 |
| Near-miss idiom finder | Some typos and calques («אני סיכוי», «ניסיתי לדבר אותו מזה») | «נושם בעורף» | ~25–30% precision | Optional |
| SLOR, Wikipedia register, unseen-bigram rate | Nothing useful | — | AUC 0.56–0.61, near chance | Don't use |
| Hebrew spell-check (OOV) | Non-words («מפתחרת», «איפטל», «תוקיעו») | Real-word errors | Untested | main/ backlog |
| Agreement lint vs the character registry | Gender/number slips (~1.5 per 100 main lines) | Unregistered speakers | Existing `lint-gender.js` | main/ backlog |
| Register-aware blind read | All of the above plus voice, idiom and collocation | Relay errors only the English reveals (false friends); triage with the English open | Rewrites ~10% of lines; gated MA_1 at 2.5 per 100 vs ungated MA_6 at 6.0 (not a controlled pair) | Every new episode; the backlog in arc order |
| The owner watching | Everything | — | — | The final call; ~10 spot checks per lint rule |

Sources: [n-gram study][ng], [marker study][mf], [main sample][nsm], [fedew sample][nsf], [anime translationese][at].

### Order of work
1. **Rulings first.** Rulings 1, 2, 4 and 7 below decide what several lints may touch.
2. **Patch the gate and the cards** (prevention section) before translating anything new.
3. **Fix the verified bugs** (bugs section).
4. **Run the Tier-A sweep on main/,** worst arcs first and האם first (698 hits, 38% of main's Tier A). main/ has no he.json, so edit `.ass` and `.srt` identically. Have the owner confirm about 10 hits per rule before batch suggestions.
5. **Run the high-precision non-lexical regexes on main/:** אוהו/אוה (240 lines), חרבן (39), מפתחרת (6), feminine formal commands, Latin-letter dialogue, «בשום פנים», «לא אניח», «X, אתה אומר?», «מה… בעולם» ([main][nsm]).
6. **Apply the owner-ruled phrases corpus-wide:** נגמר לנו/להם, מחזיר ימים/ימים רחוקים, אסיר תודה, כצפוי מ/לא ציפיתי לפחות, ציווה, כן אדוני, בכור הים, נושם בעורף.
7. **Sweep the n-gram list once:** fix ranks 1–200 of [ngram-flags.tsv][ngflags] (score ≥1.6; about 90 real fixes, 1–2 hours) and add discovered names to the allowlist ([n-gram study][ng]).
8. **Run the English-trigger pass** on fedew he.json + cues.json; fetch the English for Post-Enies Lobby and main/ from one-pace-public-subtitles first.
9. **Blind register-aware reads, by arc.** fedew: Sabaody → Thriller Bark → Enies Lobby → Post-Enies Lobby, then Amazon Lily, Impel Down, Marineford. main/: Reverie → Loguetown → Whisky Peak → Reverse Mountain → Skypiea → Wano, then down the arc table. Inside an episode, read exposition and 10+-word lines first.
10. **Mechanical errors last:** spell-check, agreement lint, זו/אלה with masculine nouns, split words, pre-flipped punctuation.
- **Budget note:** any fedew he.json edit makes `build` refuse until the changed lines are re-read blind ([skill][skill] self-check 8), so plan those re-reads into each batch.

## Twelve rulings only the owner can make

1. **Gold forms that some notes call stiff or subtitle-ese.**
   - The human gold uses «זה רע!» (7×), hesitant «ובכן...» (12×, 9 of 20 files), «שמי הוא X» (7×), «לחשוב ש…» (4×), «הו/או» for "Oh" (62 per 10k lines), «בנאדם!» for "Whoa", «X, אתה אומר?», «מעולם» (13×), «לעזאזל» (17.2 per 1,000) and «תודה לך».
   - Against them: learnings §1.5 already overrides the gold on «זה רע!»; the fansub note says «הו!» isn't spoken Hebrew ([fansub note][hf]); Israeli critics mock the reflexive «לעזאזל» as subtitle-ese ([Walla][walla24]), and «לעזאזל.» is among OPUS's most frequent whole lines ([OPUS top lines][topsent]).
   - Options: **(a)** the gold rules, never lint these; **(b)** the house is stricter than the gold, avoid them in new episodes and leave the old ones; **(c)** by voice, e.g. «מעולם» and «ובכן...» only for formal speakers.
2. **The formal-voice ceiling** for Jinbe, Sengoku, Whitebeard, Rayleigh, Mihawk, Magellan and narrators.
   - **(a) Strict:** formal = no slang, never literary ([character voice][cv]; [fix taxonomy][pft]).
   - **(b) One marked item per line:** אינני, «עליי ל־», or a classical command («זכור», «הנח»), the way *Spirited Away*'s dignified Haku says «זכרי, אני חבר שלך.» ("Remember, I'm your friend.") ([dubbing note][hd]).
   - **(c) Full formal grammar** for these speakers ([style guides][sg] R7).
   - Lines to rule on: «שמי ג'ינביי!», «אסור לכם להתרשל», «לא אסבול שום טעות!», «אני מודה לך.», «חובתי», Whitebeard's «בני» ("my son").
3. **Terminology vs Netflix's official Hebrew** ([One Piece sources][ops]). Options for each term: keep the house term, adopt Netflix's, but never mix.
   - **Marines:** הצי (house and gold; 1,389 lines) vs המארינס (Netflix 130 hits; Hebrew Wikipedia).
   - **Seven Warlords:** שבעת לוחמי הים (house) vs שבעת אדוני הים (Netflix) vs שיצ'יבוקאי (fans).
   - **Gum-Gum attacks:** translated (house; Wikipedia's «אקדח גומי־גומי») vs transliterated (Netflix's «גאם גאם פיסטול»).
   - **Baratie:** ברטי (house) vs באראטיה (fans, Wikipedia).
   - No ruling needed, just normalise: ממשלת העולם → הממשלה העולמית, פרי שד → פרי שטן, גום-גום → גומי-גומי, סגן-אדמירל → סגן אדמירל.
4. **The translator credit on AI files.** 281 of the 343 lowercase `he.ass` files carry «תרגום לעברית — That One Gerbil», copied from the human file's credit line (learnings l.156). Options: **(a)** replace it with a project/AI credit on AI files; **(b)** keep it as house convention; **(c)** a dual credit. Option (b) credits a human for AI errors.
5. **«לא אסלח לך» ("I won't forgive you").** Keep it as shonen-standard (OPUS 74%, one gold use) ([OPUS phrase-book][opb]), or rewrite to «אתה תשלם על זה!» except when forgiveness is the real topic ([anime translationese][at]; [fansub note][hf]).
6. **Slang dosage.** AI יאללה runs up to 13× the human; the gold has no סבבה, וואלה or תכלס but does use אשכרה (1.15 per 1,000) ([marker study][mf]). Options: cap יאללה per episode and keep it to street voices; allow סבבה/אחלה for rough voices (as Bar-Hillel did) or ban them (Qsubs: not "too Israeli").
7. **«כן, המפקד!» vs «כן, אדוני!»** for Marines and guards. The gold and IDF usage say המפקד ([Maariv][maariv]); the OPUS majority says אדוני (72%). Also decide whether Impel Down guards say «כן, אדון סוהר!».
8. **A commander's «אנשיי!» and the possessive allowlist.** The gate's fix put «אנשיי!» into MA_1:323, and the marker study's allowlist accepts it from a leader; the fix taxonomy calls it bookish (→ «חבר'ה!»). Decide the allowlist: «בכל ליבי», «את חייו», «בעקבותיו», «לדעתי», and whether «אנשיי!» joins.
9. **«X שכמוך / שכמותך».** A living insult frame for villains (Netflix's *Blue Eye Samurai*: «כפריות רזות שכמותכן») ([dubbing note][hd]) or a tic (64 corpus hits, gold 0) ([fedew][nsf]). Options: villains only; a per-episode cap; replace with «יא X!».
10. **«זקן!» for おっさん ("old man", to a stranger).** Rude in Hebrew. Options: «דוד!», «אדוני», or keep it where the rudeness is deliberate ([anime translationese][at]).
11. **«לאחר כך» meaning "for later".** Normal speech ([register map][rm]) or an error ([marker study][mf])?
12. **Patch or re-translate the worst main/ arcs?** Patching clears the lexical layer cheaply but leaves idioms and frames. The current pipeline reaches human-level marker rates (Impel Down 1.8, Marineford 1.3 per 1,000) yet still leaves 2.5–6 problem lines per 100, and it needs English cues for the main/ cuts. Options: **(a)** patch everything; **(b)** re-translate Reverie, Loguetown, Whisky Peak, Reverse Mountain and Skypiea, patch the rest; **(c)** re-translate everything over time.

## Bugs found along the way: credits, a regression, non-words, gender slips

How to read the references:
- `IM_7:451` = entry `i=451` in `scripts/onepace-translations/IM_7.he.json` (the English is the same `i` in `IM_7.cues.json`).
- `AP05#66` = dialogue index 66 in the main sample's extraction: AP05 = `subtitles/main/06 Arlong Park/05/arlongpark 05 he.ass`; AL13 = Alabasta 13; SK13 = Skypiea 13; W710 = Water Seven 10; WCI20 = Whole Cake Island 20; WA29 = Wano 29. Full rows: [main-flags.tsv][mainflags].
- `wano 06:49` = physical line in that `he.ass`. `EL24 0:26:51` = timestamp in the fedew Enies Lobby 24 files.

### Credits
- **281 of the 343 lowercase `he.ass` files** credit «תרגום לעברית — That One Gerbil» (my count at HEAD `14ba532`), e.g. EL_15 event 0, and mid-episode at 0:20:20 in `subtitles/main/14 Skypiea/07/skypiea 07 he.ass` ([fedew][nsf]; [One Piece sources][ops]). See ruling 4.

### Regressions and records that don't match the files
- **EL24 0:26:51** (`subtitles/fedew/17 Enies Lobby/24/`, `.srt` cue 340 and the `.ass`): "Hey! Are you guys demons?!" was overwritten in commit 17200fb with «בדיוק מה שציפינו ממך, קפטן!» ("just what we expected of you, captain!"); still there at HEAD. Restore «היי! מה אתם, שדים?!» ([fix taxonomy][pft]).
- **MA_1:16:** the review record says the "once again" opener was fixed, but he.json still says «שוב, ברוך הבא אלינו.» ("Again, welcome to us.") (verified at HEAD; [fedew][nsf]).
- **IM_5:177:** the rewrite log says «תחזיר!» ("give it back!"); the file has «בחזרה!» ([fix taxonomy][pft]).
- **IM_6:341:** the rewrite log says «בכור הים» → «אביר הים»; the file still says «בכור הים».
- **IM_5:0:** ships the instruction sheet's awkward model line «רע פה. יותר מידי מסוכן!».
- **Audit trail:** rewrite logs keep only 12 examples per episode (of up to 93 changes), 2 of 72 don't match the shipped text, and quality passes edited `.srt`/`.ass` with no blind re-read, which is how the EL24 regression shipped ([fix taxonomy][pft]).

### Mistranslations and wrong terms
- **«בכור הים»** ("firstborn of the sea") for Jinbe's "Knight of the Sea" in six he.json files: IM_2:420, IM_6:341, IM_7, IM_9, MA_5, MA_6:96. «אביר הים» appears in none, and the term is missing from the glossary (my grep at HEAD; this corrects the fedew note's claim that four of those files already use «אביר הים»).
- **TB_9:162** «כפי התאומים» vs the glossary's «כיפות התאומים» (Twin Capes) ([fedew][nsf]).
- **main sample** ([main][nsm]):
  - WCI20#200 «אתה חייב מוות» ("you owe death", for "You must have a death wish")
  - WCI20#258 «יאללה תחרא!» (for "Screw him!")
  - WCI20#72 «פחי אדם» ("human trash cans", for "scumbags")
  - WA29#141 «אנו...!» ("we…!", for "C'mon...!")
  - SK13#365 «בקושי!» ("barely!", for "That was close!")
  - W710#13 «במחתרת» ("in the underground", for "undercover")
  - W710#63 «אל תתנהג» ("don't behave", for "No misbehaving")
  - AP05#317 «נשמע!» reads "sounds!" (for "Let's hear it!")
- **fedew Enies Lobby re-translation** ([fix taxonomy][pft]):
  - EL22 «מה עבר על הזקן הזה?» ("what has he been through", for "what got into him")
  - EL22 «הכל הופך לחום!» ("everything turns brown")
  - EL22 «האזרחים» ("the citizens", for "you peasants"; the contempt is lost)
  - EL17 «לופי, קדימה.» now means "Luffy, forward" instead of "Luffy is just ahead"
  - EL24 0:11:07 «על האנשים של עצמם» ("their own people", the fix made it worse)
- **fedew sample** ([fedew][nsf]): TB_9:388 «תראה את עצמך!» ("look at yourself"); TB_9:196 «בחיי» ("I swear", for "with my life"); SAB_7:210 «תן לי ללכת» ("release me", for "Allow me to go"); IM_4:99 «לא תסתפק בכוויה» ("you won't settle for a burn"); IM_9:87 «נושם בעורף».

### Non-words and typos
- **main sample** ([main][nsm]): «מפתחרת» (AP05#93, #309; 6 corpus-wide), «איפטל/תיפטל» (WCI20#111, #122), «תוקיעו» (WCI20#157, #160), «הדמית» (WCI20#163; → «חתונת הדמים», "the blood wedding"), «בדחתי» (WA29#122), «ניסיית» (SK13#119, #205), «אמטרה» (AL13#178), «בלגרום» (AL13#154), «לגן» (AL13#85), «ללחום» (SK13#288), «המשקפי» (AL13#244), «רחק» (SK13#114), «מניוול» (W710#333), «קוזרי» (WA29#213), and the wrong binyan in «ייתפסו/ייהרגו» (SK13#257).
- **«חרבן»** (non-standard "swordsman"): 39 occurrences in AI files at HEAD (my count).
- **AM_2:347** «אל תתחספפי!» → «אל תתחצפי!» ("don't be cheeky") ([anime translationese][at]).
- **«מטלטלים»** → «מטולטלים» in the owner's flagged «גילוי רודף גילוי» line ([dubbing note][hd]).
- **Untranslated English:** AP05#177–178 ([main][nsm]).

### Split words and broken formatting
- **About 12 lines split a word across `\N`,** e.g. `wano 39 he.ass` «הסמ / וראים» and «הפ / יראטים», `wano 19:163` «ואנח / נו» ([n-gram study][ng]). A spot check of wano 39 finds more: «העו / למית», «פתא / ום», «הנס / יכה», «ווי / יטביירד», «לנק / וט». [lint-subs.js][lint] only catches one-letter fragments, and only in `.srt`.
- **446 lines in 7 AI files start with pre-flipped (visual-order) punctuation,** mostly `romancedawn 01 he.ass` (247) and `wano 48 he.ass` (186); `romancedawn 02 he.ass:69` has its words in reverse order ([n-gram study][ng]).

### Gender and number slips
- **WA29:** Hiyori addressed or speaking in the masculine in 12 lines (#8, #10, #21, #24, #25, #39, #50, #193, #219, #221, #227, #232) ([main][nsm]).
- **AP05#312** gives Arlong a feminine verb; **AL13#267** makes Cobra female; Nami is addressed as male in **AP05#297, AL13#96, AL13#104** ([main][nsm]).
- **«הצי» with a plural verb:** AP05#54, #219, #269, #311 ([main][nsm]).
- **About 32 agreement errors** in the 2,054 sampled main lines (~1.5 per 100) ([main][nsm]).
- **`skypiea 07 he.ass`:** «זו החצי השנייה» → «זה החצי השני»; «זו רק לוח» → «זה רק לוח»; «היה קומה שנייה» → «הייתה קומה שנייה» ([One Piece sources][ops]).
- **Demonstratives:** `wano 06:49` «זו הסיפור», `waterseven 04:85` «אלה בעיה», `wano 12:125` «הייתה זו מצב קרוב» ([n-gram study][ng]).

### Term inconsistencies (AI `he.ass` at HEAD, my counts)
- ממשלת העולם 34 vs הממשלה העולמית 110; פרי שד 11; גום-גום 32; סגן-אדמירל 28; and «כחול המזרחי» without its ה ([One Piece sources][ops]).

## Conclusion

The model is replaying the history of Hebrew translation. Ben-Shahar found that 1950s–60s translators drew their dialogue from literary norms rather than from speech and produced "a mixed artificial language"; a model trained on edited written Hebrew does the same, and its repair reflex, the one-word "lexical upgrade", is the same move that era rewarded ([Ben-Shahar 1998][bs98]). The encouraging finding is that this layer responds to instructions: the pipeline changes since June brought האם under 1 per 1,000 lines and the confirmed problem rate from about 20 per 100 (June episodes) to 2.5 (the native-gated MA_1). What remains is phrasing, not vocabulary: idioms, collocations, English frames, and register in formal mouths. Those yield only to a reader who has been asked the right question, so the next gains come from changing the questions (cards, gate, triage), while lints mop up the June backlog.

Neither reference corpus can settle naturalness alone. OPUS records Israeli subtitle habit, including its translationese, and the human gold is itself a relay with its own tics, so both are better at saying "nobody writes this" than "this is natural". That leaves the owner's ear as the calibration point, and the twelve rulings above are what turn it into rules the pipeline can enforce.

## Next actions

1. **Rule on the open questions,** starting with 1 (gold forms), 2 (formal ceiling), 4 (credit) and 7 (כן, המפקד).
2. **Patch [_NATIVE_REVIEW.txt][nr]:** narrow the villain exemption, add the register question and the dub test, and add the re-voice triage rule.
3. **Rewrite the voice cards** in [_INSTRUCTIONS.txt][instr] and [_IM_BATCH.txt][imb] as SAY/NEVER/model line; fix the l.16 model pair; update [SKILL.md][skill] step 2 and the gate 7.1 example.
4. **Fix the verified bugs:** EL24 0:26:51, MA_1:16, «בכור הים» in six files plus a glossary entry, TB_9:162, the term variants, and the credit line once ruled.
5. **Add the register lint** (Tier A warnings, Tier B density) and spot-check about 10 hits per rule.
6. **Sweep main/ with Tier A,** starting with האם in Reverie, Loguetown, Whisky Peak, Reverse Mountain, Skypiea and Wano.
7. **Fix n-gram ranks 1–200** and apply the owner-ruled phrases corpus-wide.
8. **Run register-aware blind reads by arc,** starting with fedew Sabaody, Thriller Bark, Enies Lobby and Post-Enies Lobby, exposition scenes first.
9. **Update [translation-learnings.md][learn] §1.5** with the phrase table and the human-zero lint list.

[nsm]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/native-sample-main.md
[nsf]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/native-sample-fedew.md
[mf]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/marker-frequencies.md
[pft]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/past-fixes-taxonomy.md
[ng]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/ngram-detector.md
[opb]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/opus-phrasebook.md
[rm]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/register-map.md
[cv]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/character-voice.md
[at]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/anime-translationese.md
[sg]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/style-guides.md
[ts]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/translation-studies-research.md
[hf]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/hebrew-anime-fansubs.md
[hd]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/hebrew-dubbing-and-official-animation.md
[ops]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/one-piece-hebrew-sources.md
[ngflags]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/ngram-flags.tsv
[mainflags]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/main-flags.tsv
[rules]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/marker-frequencies_lint_rules_rates.tsv
[arcd]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/marker-frequencies_arc_density.tsv
[density]: ../research_notes/Natural%20Hebrew%20anime%20subtitles/marker-frequencies_episode_density.tsv
[nr]: ../scripts/onepace-translations/_NATIVE_REVIEW.txt
[instr]: ../scripts/onepace-translations/_INSTRUCTIONS.txt
[imb]: ../scripts/onepace-translations/_IM_BATCH.txt
[skill]: ../.claude/skills/translating-one-pace-hebrew/SKILL.md
[learn]: ../docs/translation-learnings.md
[lint]: ../scripts/lint-subs.js
[weissbrod]: https://doi.org/10.52034/lanstts.v6i.177
[bs98]: https://doi.org/10.7202/002059ar
[gazit]: https://hebrew-academy.org.il/wp-content/uploads/2025/07/lla49-2-p.85-89.pdf
[nf-ttsg]: https://partnerhelp.netflixstudios.com/hc/en-us/articles/220636427-Hebrew-Timed-Text-Style-Guide
[nf-tpl]: https://partnerhelp.netflixstudios.com/hc/en-us/articles/219375728-Timed-Text-Style-Guide-Subtitle-Templates
[nf-qc]: https://partnerhelp.netflixstudios.com/hc/en-us/articles/214969868-Why-are-Netflix-s-standards-for-Subtitles-and-Closed-Captions-so-high
[nf-dub]: https://partnerhelp.netflixstudios.com/hc/en-us/articles/9786887342611-Dubbing-Creative-Guidelines-Films-Series-Hebrew
[nf-gen]: https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements
[nf-la]: https://wizdom.xyz/api/search?action=by_id&imdb=tt11737520
[amazon]: https://m.media-amazon.com/images/G/01/CooperWebsite/dvp/downloads/AmazonPrimeVideo_Localization_and_Technical_Style_Guides_September_2026.zip
[qsubs]: http://www.qsubs.net/index.php?showtopic=44907
[yair]: https://docs.google.com/document/d/1023mPe-6GPE8KDUMwgmz-YICAlZEIXtkEZrHCpjuHXg/edit?usp=sharing
[paradise]: https://paradisesubs.net/%d7%94%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%9e%d7%9c%d7%90-%d7%9c%d7%a4%d7%90%d7%a0%d7%a1%d7%90%d7%91%d7%a8-%d7%94%d7%9e%d7%aa%d7%97%d7%99%d7%9c/
[beitberl]: https://www.slideshare.net/slideshow/ss-13110774/13110774
[shomer]: https://www.makorrishon.co.il/culture/article/259707
[gottlieb]: https://doi.org/10.82366/453
[wintner]: https://coling2016.anlp.jp/doc/tutorial/slides/T5/Coling2016.pdf
[heerink]: http://hdl.handle.net/1887/63751
[ravid]: https://www.jbe-platform.com/content/journals/10.1075/pc.17.1.04rav
[academy]: https://hebrew-academy.org.il/%D7%A2%D7%9C-%D7%A2%D7%A0%D7%99%D7%99%D7%A0%D7%99-%D7%A0%D7%99%D7%A1%D7%95%D7%97-%D7%90%D7%95-%D7%A0%D7%99%D7%A1%D7%95%D7%97-%D7%A2%D7%A0%D7%99%D7%99%D7%A0%D7%99/
[barhillel]: https://www.ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2023/31323.aspx
[tofugu]: https://www.tofugu.com/japanese/sasuga/
[leon]: https://lostintranslationhub.substack.com/p/how-translation-in-anime-is-done
[crossleaf]: https://crossleaf.app/blog/old-man-speech-light-novels
[barzik]: https://www.numenore.com/1465/
[tapuz]: https://www.tapuz.co.il/threads/%D7%9C%D7%9B%D7%9C-%D7%90%D7%95%D7%94%D7%91%D7%99-%D7%94%D7%93%D7%99%D7%91%D7%95%D7%91%D7%99%D7%9D-%D7%91%D7%90%D7%A9%D7%A8-%D7%94%D7%9D.11744526/
[avneon]: https://www.milononline.net/%D7%A0%D7%95%D7%A9%D7%A3_%D7%91%D7%A2%D7%95%D7%A8%D7%A4%D7%95
[maariv]: https://www.maariv.co.il/news/israel/article-580629
[walla24]: https://www.walla.co.il/entertainment/tv/3645014
[topsent]: https://github.com/orgtre/top-open-subtitles-sentences/blob/main/bld/top_sentences/he_top_sentences.csv
