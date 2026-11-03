# OPUS OpenSubtitles en→he phrase-book and register baseline for One Pace

Scope: how Israeli subtitlers (fan and professional) actually render the English lines and phrases that recur in our One Pace source, measured on the OPUS OpenSubtitles English–Hebrew parallel corpus. Also: a register baseline (how often bookish markers appear in real Hebrew subtitles), and a comparison with our AI Hebrew.

Files next to this note:
- `phrasebook.tsv`: 712 rows (536 full-line queries and 176 phrases).
  - Columns: kind, english, n_en_opus, top_hebrew_opus, our_renderings, verdict, opus_examples.
- `opus-register-baseline.tsv`: the marker rates for OPUS, our AI corpus and the 20 human files.
- `opus-markers.py`: the exact marker regexes, importable, stdlib only.
- `opus-inf-lexicon.txt`: the infinitive lexicon used by the two "+ infinitive" markers.
- Scripts and intermediate data are in `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/opus-phrasebook/work/` and `.../out/`. They are not in the repo.

Labels used below:
- **"My judgment"** is my own Hebrew judgment, not data.
- **"Native reviewer"** means the user's flagged fixes in the brief.

---

## Q1. Which data, what method, and how far can OPUS Hebrew be trusted?

### Takeaway
- **What OPUS is:** OPUS v2024 en–he is 58.8 M aligned subtitle sentence pairs.
- **What it shows:** what Israeli viewers are used to reading. It is not a gold standard:
  - it has OCR/RTL noise;
  - it contains some visibly machine-translated Hebrew;
  - it carries the long-standing "subtitle-ese" register.
- **What follows:** use OPUS counts as evidence of what is common. Use the native reviewer to decide what is natural.

### Cited Findings
- **Corpus:** OpenSubtitles v2024, en–he, Moses format.
  - 58,814,909 alignment pairs; 395 M English and 308 M Hebrew tokens (OPUS's own counts).
  - Released 2025-02-12. File: `en-he.txt.zip`, 1.59 GB. Sources: [OPUS API](https://opus.nlpl.eu/opusapi/?corpus=OpenSubtitles&source=en&target=he&preprocessing=moses&version=latest), [download](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip).
  - The v2018 file (950 MB) still exists. I used v2024 because the API marks it `latest`.
- **Sentence-aligned, not cue-aligned.** The corpus README says it uses "improved sentence alignment and better language checking". It also says alternative uploads of the same film are not merged into the plain-text sets ([README in the zip](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip); [Lison & Tiedemann 2016](http://stp.lingfil.uu.se/~joerg/paper/opensubs2016.pdf)).
  - So one OPUS "line" is roughly one sentence:
    - OPUS: 5.21 Hebrew tokens per line.
    - Our AI cues: 4.68 tokens per cue.
    - Human `He.ass` cues: 4.53 tokens per cue.
  - **Use the per-100k-token rates when comparing corpora.**
- **Noise I measured** (my counts over all 58.8 M Hebrew lines, [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip)):

  | Noise | Lines | Share |
  |---|---|---|
  | No Hebrew letter at all (English left untranslated, credits, music) | 280,056 | 0.48% |
  | Nikud | 97,280 | 0.17% |
  | Reversed leading punctuation (e.g. `?מה`, `-אני חייב ?`) | 75,546 | 0.13% |

  - Literal RLM marks rendered as the text `rlm`, e.g. `rlm; בליגה אומרים`.
  - ASS header residue on the English side, e.g. `282,0,Default,0000,…,As expected of you.`
  - I stripped nikud and RLM/LRM, normalised ״/׳, and dropped lines with no Hebrew.
- **Some OPUS Hebrew is clearly machine-translated** (word-salad Hebrew of the Google-Translate kind; sampled lines, [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip)):
  - "We're done for the day" → «אנחנו נעשינו ליום» (lit. "we were made to the day").
  - "We're done for now" → «אנחנו נעשים לעת עתה».
  - "I need you to prepare yourself for some blowback" → «אני זקוק לך להכין את עצמך Blowback כמה».
  - "Well, you can all rest assured, I sorted it, didn't I?" → «ובכן, אתה יכול כל סמוך ובטוח, אני מסודרים אותו, לא?».
- **OPUS includes Hebrew anime/donghua fansubs.**
  - The "as expected of" hits come from:
    - *My Hero Academia* ("As expected of Midoriya!");
    - *Code Geass* (ASS speaker fields `CG ON, Lelouch`);
    - *Naruto* ("Fire Country").
  - Chinese xianxia dramas also appear ("As expected of the only disciple of Venerable Lord"). [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip)
- **Method.**
  - English was normalised: lowercase, curly→straight apostrophes, punctuation removed, spaces collapsed.
  - Full-line queries are exact matches on the normalised English.
  - Phrase queries are word-boundary substring matches.
  - For phrases I drew a uniform random sample of up to ~4,000 aligned pairs (reservoir per chunk, merged proportionally). I counted Hebrew 1–3-grams in that sample. I ranked them by excess over a background sample (5.85 M Hebrew lines, every 10th line). Only n-grams with lift ≥ 4 and share ≥ 2% were kept.
  - The result is a "pattern share": the % of aligned lines that contain the Hebrew n-gram. It is not an exact alignment.
- **Queries.**
  - Our English is 21,107 dialogue cues from the 56 episodes that have `*.cues.json` (AM_1–5, IM_1–10, MA_1–8, SAB_1–11, TB_1–22) ([scripts/onepace-translations](../../scripts/onepace-translations/)).
  - Skipped styles: Caption|Title|Credit|Note|Sign plus lyrics/Bounty/Map/Supernova. These are non-dialogue; that is a refinement of the brief's skip list.
  - 536 full-line queries: the top 420 normalised lines (the count at rank 300 is only 3), the 68 seed phrases, and 108 recurring or flagged phrases from our n-gram list.
  - The PEN_1–5 `he.json` files have no `cues.json`, so they are not covered.

### Inferences
- **146 of the 536 full-line queries have fewer than 20 OPUS matches.** They are names, attack calls and One Piece specifics (e.g. "rubber", "gomu gomu no", "straw hat"). The phrase-book has nothing to say about them. The everyday reaction lines are very well covered:
  - "what": 253,637 aligned pairs;
  - "no way": 12,137;
  - "this is bad": 799.
- **Anime fansubs are inside OPUS but are a small minority.** For anime-specific English ("As expected of…", "I won't forgive you", "Prepare yourself!") the OPUS majority mostly reflects Hebrew anime fansub habits, not mainstream Israeli subtitling (my inference from the speaker fields and titles).

### Gaps
- The Moses format has no per-line film ID, year or uploader. So I could not:
  - separate professional (Netflix/HOT/yes) from fan subtitles;
  - weight by year;
  - de-duplicate the same subtitler reused across films.
- The XML release with document IDs would allow this. It is far larger and I did not download it.
- Machine-translated lines cannot be filtered without that metadata. I can only say they exist, from sampled examples. I have no rate.

---

## Q2. How do Israeli subtitlers render the short lines that recur most in our English? (full-line phrase-book)

### Takeaway
- **Our short reaction lines mostly match OPUS or are more colloquial than it.**
  - 323 full-line queries have ≥ 20 OPUS matches and an AI rendering in our 56 episodes.
  - Our most frequent rendering is OPUS's #1 in **211 (65%)**.
  - It is in OPUS's top 5 in **76 (24%)**.
  - It is rare in OPUS in **34 (11%)**. Most of those are gender/number variants or are deliberately more colloquial (יופי, יאללה, סמוך עליי).
- **The real misses are a handful of bookish or calqued one-liners:**
  - «כך זה» ("is that so");
  - «עבר זמן (רב)» ("long time no see");
  - «הובן» ("understood");
  - «אין מחילה» ("unforgivable");
  - «טוב מאוד» ("very well");
  - «ובכן» ("well");
  - «אכן» ("indeed");
  - «כן אדוני» ("yes sir").

### Cited Findings
Source for every OPUS figure: my counts on [OPUS v2024 en–he](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip). Ours: [scripts/onepace-translations/*.he.json](../../scripts/onepace-translations/). Format: OPUS top renderings (share of aligned lines with that exact English line) → ours (count).

**Matches or near-matches (keep):**
- "no way" (12,137): אין מצב 41% · אין סיכוי 24% · בשום אופן לא 4% → ours אין מצב ×33.
- "what's going on" (25,925): מה קורה 58% · מה קורה פה 11% · מה קורה כאן 6% → ours מה קורה פה ×17.
- "this is bad" (799): זה רע 59% · זה לא טוב 10% · זה גרוע 8% → ours זה רע ×8, זה לא טוב ×5.
- "that was close" (590): זה היה קרוב 83% → ours ×13.
- "it's no use" (387): אין טעם 54% → ours ×10.
- "what's wrong" (16,102): מה קרה 61% · מה לא בסדר 15% · מה הבעיה 7% → ours מה קרה ×5.
- "what the hell" (9,072): מה לעזאזל 63% · מה נסגר 5% · מה הקטע 3% → ours מה לעזאזל.
- "shut up" (18,958): שתוק 37% · תשתוק 14% · תשתקי 11% · תסתום 3% → ours שתוק/תשתוק.
- "hang in there" (773): תחזיק מעמד 41% → ours ×11.
- "be careful" (4,889): תיזהר 22% · תיזהרי 12% · היזהר 10% · הזהר 10% → ours תיזהר.
- "calm down" (6,815): תירגע 33% → ours תירגע.
- "how dare you" (2,340): איך אתה מעז 58% → ours same.
- "i'm counting on you" (218): אני סומך עליך 43% → ours same.
- "it's over" (5,168): זה נגמר 84% → ours נגמר/זה נגמר.

**Ours more colloquial than the OPUS majority (good; keep):**
- "alright" (9,115): בסדר 65% · טוב 12% · יופי 1% → ours יופי ×16. Right for "Alright!" cheers (my judgment).
- "leave it to me" (332): תשאיר את זה לי 27% · אני אטפל בזה 6% → ours סמוך עליי ×3, עליי.
- "do your best" (127): עשה כמיטב יכולתך 16% (calque) → ours תתאמץ ×3.
- "however" (308): עם זאת 20% · אבל 15% · אולם 6% → ours אבל ×8.
- "don't be ridiculous" (1,941 lines containing it): אל תהיה מגוחך 41% → ours דיי עם השטויות / אל תדבר שטויות.
- "we did it" (2,518): עשינו את זה 45% · עשינו זאת 19% · הצלחנו 18% → ours הצלחנו.

**Ours bookish or calqued where OPUS is plainer (fix):**
- **"is that so"** (2,386):
  - OPUS: באמת 50% · האמנם 13% · האומנם 8% · האם זה כך 7%.
  - Ours: «כך זה» ×2 ("thus it is"). This is a calque with literary word order.
- **"long time no see"** (695):
  - OPUS: מזמן לא התראינו 33% · הרבה זמן לא התראינו 18%.
  - Ours: «עבר זמן» ×2, «עבר זמן רב» ×1 ("much time has passed"). Also in sentences: «עבר זמן, כובע הקש!», «עבר זמן, זקן לבן!», «עבר המון זמן, קרוקו». Only 1 of 8 is מזמן לא התראינו.
- **"understood"** (4,393):
  - OPUS: מובן 50% · ברור 11% · הבנתי 10%.
  - Ours: הבנתי ×6, **הובן ×2** (stiff passive "it has been understood").
- **"unforgivable"** (46):
  - OPUS: בלתי נסלח 63%.
  - Ours: «**אין מחילה**» ("there is no pardon": archaic/religious); also «זה לא ייסלח».
- **"very well"** (4,294):
  - OPUS: בסדר גמור 37% · טוב מאוד 26% · בסדר 12%.
  - Ours: «טוב מאוד» ×2. As assent, "טוב מאוד" is a calque. In Hebrew it means "very good" (my judgment).
- **"yes sir"** (29,284):
  - OPUS: כן אדוני 72% · כן המפקד 17%.
  - Ours: כן אדוני ×13, כן המפקד ×3.
  - My judgment: Israeli soldiers say «כן, המפקד». «כן אדוני» to a commander is subtitle-ese, even though OPUS's majority uses it.
- **"well"** (bare line, 16,104):
  - OPUS: ובכן 32% · טוב 22% · נו 16%.
  - Ours: ובכן ×3 · נו ×3 · טוב ×2.
- **"indeed"** (2,872):
  - OPUS: אכן 57% · בהחלט 18%.
  - Ours: אכן ×4. Corpus-wide our אכן runs at 15.2/100k tokens vs 3.2 in the human files (Q4).
- **"here goes"** (384):
  - OPUS: הנה זה בא 35% (calque).
  - Ours: הנה זה בא ×2, יאללה מתחילים ×2.
- **"i let my guard down"** (25):
  - OPUS is scattered and partly machine-translated («אני אאכזב את השומר שלי»).
  - Ours: «הורדתי את ההגנה (שלי)» ×3, a calque.

**OPUS-common renderings that are themselves translationese (do NOT copy; my judgment):**
- **"i see"** (10,949):
  - אני מבין 40% · אני מבינה 19% · הבנתי 18% · **אני רואה 12%**.
  - "אני רואה" is a literal calque. Ours uses אני מבין/הבנתי.
- **"oh my"** (3,721):
  - אלוהים 17% · בחיי 13% · **הו שלי 6%** (word-for-word "oh my") · אוי 6% · אוי ואבוי 5%.
- **"i'm sorry"** (74,631):
  - אני מצטער 46% · אני מצטערת 27% · סליחה 9%.
  - My judgment: a quick apology in Israeli speech is «סליחה» or «מצטער» without אני. "אני מצטער" fits a heartfelt apology.
  - Ours is already mixed: סליחה in 9 of the first 10 "I'm sorry" lines, but 21 «אני מצטער/ת» occurrences corpus-wide.
- **"thank you"** (165,938):
  - תודה 76% · **תודה לך 11%**.
  - My judgment: "תודה לך" for a plain "thank you" is a calque.
  - Ours: תודה ×6. AI corpus-wide תודה לך = 0, but the human files use it (37.8/100k tokens). So it is tolerable, not a lint target.
- **"get out of my way"** (1,007):
  - **זוז מדרכי 11%** (bookish possessive) · זוז מהדרך שלי 11% · זוז לי מהדרך 5%.
  - Ours: תזוז לי מהדרך ✓.
- **"impossible"** (1,785):
  - בלתי אפשרי 63% · לא ייתכן 7% · לא יכול להיות 5%.
  - For a shocked exclamation, "לא יכול להיות!" or "אין מצב!" reads more natural than "בלתי אפשרי!" (my judgment).

### Inferences
- **Short reaction lines are not where the bookishness lives.** They are mostly fine, so a phrase-book of full lines will catch only a few cases. Most residual problems are inside longer sentences (Q3/Q5).
- **The OPUS majority is a ceiling, not a target.** It reliably flags our outliers, such as «כך זה» and «אין מחילה». Its own majority is still subtitle-ese for: אני רואה, אני מצטער, כן אדוני, הנה זה בא, עשה כמיטב יכולתך, טוב מאוד (as assent), זוז מדרכי.

### Gaps
- I compared one rendering per English line. A rendering that is fine for one speaker (e.g. formal Jinbe or a Marine PA) may be wrong for another. Speaker voice is outside this dataset.

---

## Q3. How are the recurring multi-word phrases rendered inside longer lines? (phrase patterns with real examples)

### Takeaway
- **Each common phrase has one or two dominant Hebrew patterns.** For most of our seed phrases, OPUS agrees with natural Israeli Hebrew. Examples:
  - אין לי מושג;
  - למי אכפת;
  - בקצב הזה;
  - רק עניין של זמן;
  - נמאס לי;
  - תחזיק מעמד;
  - אתה תשלם על זה.
- **The phrases where OPUS's majority is literal or bookish** are the ones our translator should handle by rule:
  - I guess, I wonder, I'm grateful, be executed, prepare yourself;
  - don't underestimate me, rest assured, I can't help but, come to think of it;
  - thanks to you, after all, well, indeed, as expected of.

### Cited Findings
Share = % of sampled aligned lines whose Hebrew contains the pattern. xN = lift over background Hebrew. Source: my counts on [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip). More examples per phrase are in `phrasebook.tsv` (column `opus_examples`).

- **"I guess"** (113,640 lines):
  - אני מניח 37% + אני מניחה 17% · כנראה 11%.
  - For sentence-initial "I guess…" (54,584): מניח/ה 56% · כנראה 13% · נראה לי 2% · אולי 1%.
  - Examples:
    - «כן, אני מניחה שכן» ("yeah, I suppose so");
    - «אני מניח שלא» ("I guess not");
    - «-כנראה, כן» ("probably, yeah").
  - "I take it / I presume / I suppose" (28,283): מניח/ה 62% · אני מבין ש- 6% · כנראה 3%.
- **"I wonder"** (16,846):
  - אני תוהה 42% · מעניין 35% (מעניין אם 11%).
  - Examples:
    - «אני תוהה אם זה בגלל שאני תמיד זוכה» ("I wonder if it's because I always win");
    - «מעניין למה הבעלים בנו את זה מלכתחילה» ("I wonder why the owners built it").
- **"I'm grateful"** (1,627):
  - תודה 75% of lines · **אני אסיר תודה 33%** · אסיר תודה 45%.
  - "you have my gratitude / I'm most grateful" (1,417): אסיר* 74% · מודה 13%.
  - "you should be grateful" (245): אסיר* 64%.
  - Example: «אני אסיר תודה על ההבנה שלך» ("I'm grateful for your understanding").
- **"be executed"** (962):
  - להורג 79% · **יוצא להורג 17%** · **מוצא להורג 9%** · להוציא 9%.
  - "will be executed" (298): passive יוצא/תוצא/יוצאו 55% vs active יוציאו/להוציא 8%.
  - "was executed" (444): הוצא/הוצאה/הוצאו 70% vs active הוציאו 3%.
  - Examples:
    - «הם יוצאו להורג» ("they will be executed");
    - «אשתי תהיה הראשונה להיות מוצא להורג» (a garbled calque);
    - active: «את מי מוציאים להורג?» ("who are they executing?").
- **"breathing down (my) neck"** (566):
  - **נושף 22%** · בעורפי 21% · נושף בעורפי 9% · בעורף 10% · נושם only 3%.
  - Examples:
    - «לכלן נושף בעורפי»;
    - «הלקוח כבר נושף לי בעורף» ("the client is already breathing down my neck").
- **"just around the corner"** (3,379): מעבר לפינה 62–63% · ממש מעבר לפינה 13%.
- **"brings back memories"** (180): מעלה 68% · זה מעלה זיכרונות 24–39% · זכרונות 30%.
  - Examples: «זה מעלה בי זיכרונות», «המקום הזה מעלה זכרונות».
  - Some: «זה מחזיר זכרונות».
- **"takes me back"** (247): **זה מחזיר אותי (אחורה/לאחור) 30–40%** · מזכיר 19%.
  - Examples: «זה מחזיר אותי לאחור», «לוקח אותי בחזרה» (pure calque).
- **"we got lucky"** (401): **היה לנו מזל 50%** · יש לנו מזל 14%.
  - Over the wider set (we got lucky / lucky for us / we were lucky, 3,196 lines): מזל ש/למזלנו 31% · יש לנו מזל 23% · היה לנו מזל 17% · שיחק לנו 0% · יצא לנו מזל 0%.
- **"we're done for / we're finished / it's over for us / we're doomed"** (2,146):
  - סיימנו 23% (mostly "done for the day") · אבודים 11% · גמורים 9% · הלך עלינו 6% · **נגמר לנו 0%**.
  - Example: «אם היא הולכת למשטרה עכשיו, אנחנו גמורים» ("…we're finished").
- **"prepare yourself"** (556):
  - **להכין את עצמך 16%** (calque) · תתכונן 10% · להתכונן 8%.
  - "prepare to die" (193): היכון 35% · תתכונן 28% · התכונן 20%.
  - "get ready" (9,910): תתכונן/תתכוננו 33% · להתכונן/להתארגן 29% · התכונן 5%.
- **"don't underestimate me"** (103):
  - **בערכי 37%** (אל תמעיט בערכי, "do not diminish my worth") · אל תזלזל בי 31%.
- **"get out of my way"** (1,944): מהדרך 33% · זוז 32% · **מדרכי 28%** · מהדרך שלי 15% · לי מהדרך 13%.
- **"rest assured"** (1,383):
  - **סמוך ובטוח 25%**, mostly «היה סמוך ובטוח» 17% (literary imperative of היה).
  - Example: «היה סמוך ובטוח, אמא».
- **"I can't help but"** (1,229):
  - **לא יכול שלא ל- 34%** (calque).
  - Example: «אני לא יכול שלא לחשוב שהחיים…».
- **"come to think of it"** (968): חושב על זה 26% · **כשחושבים על זה 20%** · כשאני (חושב על זה) 27%.
- **"in that case"** (sentence-initial, 2,570): אם כך/אם ככה 44% · במקרה כזה/הזה/זה 36% · אז 10%.
- **"thanks to you"** (4,397): **הודות לך 28%** · **בזכותך 23%** · **תודות לך 15%**.
- **"after all"** (sentence-final, 8,082): אחרי הכל 47% · בכל זאת 11% · בסופו של דבר 6% · הרי 2%.
- **"well,"** (sentence-initial, 773,800): **ובכן 22%** · טוב 19% · אז 7% · נו 3%.
- **"indeed"** (sentence-initial, 5,623): **אכן 54%** · בהחלט 18% · כן 10% · נכון 4%.
- **"just met / just got / just arrived"** (44,916): **זה עתה 0%** · הרגע 12% · עכשיו 8% · רק 23%.
- **"for now / for the time being"** (15,935): לעת עתה 31% · בינתיים 25% · כרגע 11% · לעכשיו 8%.
- **"to tell you the truth"** (3,706): «האמת…» 90% · **למען האמת 13%**.
- **"behold"** (2,660): הביטו/הבט 26% · ראו/תראו 14% · הנה 10%.
- **"ordered (me/us/you/him) to"** (1,305): **הורה/הורתה/הורו 50%** · פקד 10% · **ציווה 7%**.
- **"keep him/her/them alive"** (1,794): **להשאיר (אותו) בחיים 26%** · לשמור (על/אותו) בחיים 14% · יישאר בחיים 8% · להחזיק בחיים 5%.
- **"as expected (of/from)"** (481 lines in all of OPUS): **כצפוי 55%** · כמצופה 10% · כמו/כפי שציפיתי 3%.
  - "as expected of" (31): כצפוי 23% · כמצופה 10% · «אתה אכן…» 10% (Chinese-drama fansubs).
- **"I'd expect no less / nothing less"** (116): **לא הייתי מצפה/לא ציפיתי (לפחות) 48%** · פחות מזה/מכך 27% · כצפוי/כמצופה 2%.
- **"whatever the case/reason"** (298): לא משנה 36% · מה שלא יהיה 18% · בכל מקרה 9% · **יהיה אשר יהיה 2%**.
- **"since" (causal, sentence-initial)** (26,363): מאחר 10% · מכיוון 10% · כי 5% · היות/בגלל 1% each.
- **"was X-ed by…"** (passive with agent, 48,951): **על ידי 31%** · בידי 4% · מ- 15%.
- **"my men"** (4,840): אנשיי/אנשי 28% · האנשים שלי 20%.
- **"you damn X"** (3,000):
  - חתיכת 14% · **ארור 8%** · לעזאזל 6% · שכמוך 6% · מזדיין 4% · מטומטם 4%. Mostly the "damn" is simply dropped.
  - Adjectival "damn X" (58,662): ארור 8% · לעזאזל 8%; mostly dropped.
  - "freaking X" (9,101): ארור 1%.
- **"you fool(s)"** (7,581): אידיוט 46% · טיפש 19% · מטומטם 10% · שכמוך 10% · שוטה 2% · כסיל 0%.
- **Phrases where OPUS = natural (copy freely):**
  - "I have no idea" → אין לי מושג 79%
  - "who cares" → למי אכפת 68%
  - "at this rate" → בקצב הזה 78%
  - "a matter of time" → רק עניין של זמן 78%
  - "there's no time" → אין זמן 70%
  - "we have no choice" → אין לנו ברירה 66%
  - "I've had enough" → נמאס לי 36%
  - "long time no see" → מזמן לא התראינו 36–60%
  - "so that's how it is" → אז ככה זה 57%
  - "there's no such thing" → אין דבר כזה 55%
  - "even if I die" → גם אם אמות 39%
  - "you'll pay for this" → אתה תשלם על זה 47%
  - "how dare you" → איך אתה מעז 55%
  - "I'll protect (you)" → אני אגן עליך 28%
  - "piece of cake" → קלי קלות 51%
  - "no matter what" → לא משנה מה 54%
  - "all of a sudden" → פתאום 54% + ופתאום 16% (vs לפתע 19%)
  - "as soon as" → ברגע ש- 60%
  - "i'm the one who" → אני זה/זו ש- 42% (accepted cleft)
  - "what's with" → מה הקטע עם 11% / מה עם 10%

### Inferences
- **Some OPUS patterns are themselves calques or literary forms.** My judgment, consistent with the native reviewer's direction:
  - "I guess" → אני מניח
  - "I wonder" → אני תוהה
  - "I'm grateful" → אסיר תודה
  - passive "be executed" → יוצא להורג
  - "prepare yourself" → להכין את עצמך
  - "don't underestimate me" → אל תמעיט בערכי
  - "rest assured" → היה סמוך ובטוח
  - "I can't help but" → לא יכול שלא
  - "takes me back" → מחזיר אותי אחורה
  - "well" → ובכן
  - "indeed" → אכן
  - "behold" → הביטו
- **The colloquial alternative always appears in OPUS as a substantial minority.** So "natural" here does not mean slangy-rare; it is the second-most-common rendering. Examples:
  - כנראה, מעניין אם, בזכותך;
  - בינתיים, הרגע, האמת ש;
  - אל תזלזל בי, מזמן לא התראינו.

### Gaps
- Pattern shares come from n-grams, not word alignment. A pattern can co-occur with a phrase without translating it (e.g. «עושה» co-occurs with "what the hell" because of "what the hell are you doing").
- Shares for rare phrases (n < 100) are rough: "as expected of" n=31, "expect no less" n=41, "unforgivable" full-line n=46.

---

## Q4. Register baseline: how often do the candidate bookish markers occur in real Israeli subtitles?

### Takeaway
- **OPUS Hebrew is itself fairly formal.** It uses:
  - האם 65.9/10k lines;
  - ובכן 43;
  - אני מצטער 39;
  - אינני/אינו… 35;
  - ביותר 26;
  - ללא 20.5;
  - לאחר 15.
- **Our AI corpus (56 episodes) is lower than OPUS on most of these markers.** It is roughly at the human-file level.
- **But our AI over-uses a few specific items vs both OPUS and the human files** (per 100k tokens):
  - **ארור**: 50.6 (OPUS 8.9, human 6.3);
  - **אסיר תודה**: 14.2 (3.3, 0);
  - **passive execution** (מוצא/יוצא/הוצא להורג): 5.1 (0.6, 0);
  - **כצפוי מ-**: 3.0 (0.01, 0);
  - **אכן**: 15.2 (9.9, 3.2);
  - **ייתכן**: 12.1 (16.0, 0);
  - **על ידי**: 36.4 (31.8, 15.8);
  - **עתה** (זה עתה / לעת עתה): 7.1 (7.2, 0);
  - **ובכן**: 49.6 (82.7, 37.8);
  - **sentence "אחרי הכל"**: 22.3 (3.3; human also 22.1).

### Cited Findings
Denominators:
- **OPUS:** 58,534,853 Hebrew lines and 304,761,038 Hebrew tokens ([OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip), my counts).
- **Ours (AI):** 21,107 dialogue cues and 98,792 tokens ([*.he.json](../../scripts/onepace-translations/)).
- **Human:** 7,015 cues and 31,743 tokens, from the 20 ` He.ass` files via `git show HEAD:` (dialogue lines, using the brief's style filter).

The full table, with counts and per-10k-cue rates, is in `opus-register-baseline.tsv`. Selected rows are below. Per 10k lines is OPUS only; the next three columns are per 100k tokens.

| marker | OPUS /10k lines | OPUS /100k tok | ours AI /100k tok | human /100k tok |
|---|---|---|---|---|
| neg. copula אינני/אינך/אינו/אינה/איננו/איננה/אינכם/אינכן/אינן/אינם/איני | 34.9 | 67.0 | 5.1 | 3.2 |
| copula הנני/הנך/הינו/הינה… | 2.9 | 5.7 | 6.1* | 0 |
| האם | 65.9 | 126.7 | 17.2 | 9.5 |
| מדוע / כיצד / היכן / מאין | 9.2 / 3.6 / 9.5 / 0.9 | 17.7 / 7.0 / 18.2 / 1.7 | 0 / 0 / 1.0 / 0 | 0 / 3.2 / 3.2 / 0 |
| אשר / כאשר | 5.6 / 12.3 | 10.7 / 23.6 | 2.0 / 0 | 0 / 0 |
| אך / אולם | 17.0 / 1.4 | 32.7 / 2.6 | 0 / 1.0 | 3.2 / 3.2 |
| משום ש / מאחר ש(ו) / מכיוון ש(ו) / היות ש(ו) | 2.9 / 2.3 / 3.7 / 0.4 | 5.6 / 4.4 / 7.0 / 0.8 | 0 / 4.0 / 7.1 / 0 | 0 / 0 / 12.6 / 0 |
| אף (=even) | 10.3 | 19.7 | 23.3** | 47.3** |
| ובכן | 43.0 | 82.7 | 49.6 | 37.8 |
| הלא | 6.4 | 12.3 | 3.0 | 9.5 |
| כעת / עתה | 12.6 / 3.7 | 24.2 / 7.2 | 0 / 7.1 | 0 / 0 |
| אכן | 5.2 | 9.9 | 15.2 | 3.2 |
| כה | 6.6 | 12.6 | 1.0 | 0 |
| מעט | 9.0 | 17.3 | 13.2 | 12.6 |
| ביותר | 26.5 | 50.9 | 25.3 | 44.1 |
| לעולם לא | 13.7 | 26.3 | 31.4 | 22.1 |
| ללא / לאחר / עבור | 20.5 / 15.2 / 18.7 | 39.3 / 29.1 / 36.0 | 5.1 / 3.0 / 3.0 | 31.5 / 3.2 / 25.2 |
| למען / באמצעות / על ידי / כלפי | 12.0 / 3.3 / 16.6 / 2.5 | 23.1 / 6.3 / 31.8 / 4.9 | 5.1 / 0 / 36.4 / 3.0 | 6.3 / 15.8 / 15.8 / 18.9 |
| ביכולתי/באפשרותי/ברצוני… | 1.6 | 3.1 | 1.0 | 0 |
| ייתכן | 8.3 | 16.0 | 12.1 | 0 |
| יש ל+inf | 2.2 | 4.2 | 0 | 3.2 |
| עליך/עלינו/עליכם ל+inf | 11.7 | 22.5 | 5.1 | 0 |
| (ext.) עליו/עליה/עלי/עליי/עליהם ל+inf | 7.6 | 14.5 | 3.0 | 3.2 |
| הבה / אנא / נא | 1.2 / 5.8 / 2.2 | 2.3 / 11.2 / 4.3 | 0 / 2.0 / 2.0*** | 0 / 0 / 0 |
| התכונן(ו) / היזהר / הבט / חדל | 0.5 / 1.6 / 2.0 / 0.4 | 0.9 / 3.0 / 3.8 / 0.8 | 5.1 / 1.0 / 4.0 / 0 | 6.3 / 0 / 3.2 / 3.2 |
| possessive-suffixed nouns (curated) | 78.0 | 149.7 | 63.8 | 94.5 |
| object-suffixed verbs (curated) | 0.6 | 1.2 | 0 | 0 |
| מוצא/הוצא/יוצא להורג | 0.3 | 0.6 | 5.1 | 0 |
| ארור/ה/ים/ות | 4.6 | 8.9 | 50.6 | 6.3 |
| מה לעזאזל | 10.5 | 20.1 | 29.4 | 88.2 |
| אלוהים אדירים / לכל הרוחות / בשם אלוהים | 8.9 / 3.0 / 0.7 | 17.1 / 5.8 / 1.3 | 1.0 / 1.0 / 0 | 0 / 3.2 / 0 |
| אסיר(ת/י) תודה | 1.7 | 3.3 | 14.2 | 0 |
| תודה לך / (ext.) תודה לכם | 9.2 / 0.8 | 17.6 / 1.6 | 0 / 1.0 | 37.8 / 6.3 |
| אני מצטער/ת | 39.1 | 75.2 | 21.3 | 34.7 |
| כצפוי מ- | 0.007 | 0.01 | 3.0 | 0 |
| לא אסלח לך/לכם | 0.1 | 0.2 | 2.0 | 0 |
| control: אני מניח/ה | 19.0 | 36.6 | 37.5 | 28.4 |
| control: אחרי הכל/הכול | 1.7 | 3.3 | 22.3 | 22.1 |
| control: זה הכל/הכול | 7.4 | 14.1 | 3.0 | 18.9 |
| control: הולך/ת/ים/ות להיות | 5.4 | 10.5 | 1.0 | 6.3 |

Notes on the table:
- \* All AI copula hits are the character name הינה (Hina). The parallel marker study found the same ([marker-frequencies.md](marker-frequencies.md)). Treat this as 0.
- \*\* One Piece contamination: most AI and human "אף" hits are the noun "nose" (Buggy/Usopp "אף גדול", "אף אדום"), not "even". The OPUS figure also contains some "nose" hits.
- \*\*\* Both AI "נא" hits are "raw" (בשר נא), not "please".

**Formal-vs-colloquial share in OPUS.** Share = formal ÷ (formal + colloquial counterpart), computed from the same pass. This shows what Israeli subtitle readers actually meet:

| Formal vs. colloquial | Formal share |
|---|---|
| מדוע vs למה | 6% |
| כיצד vs איך | 3% |
| היכן vs איפה | 12% |
| כעת+עתה vs עכשיו | 10% |
| מעט vs קצת | 13% |
| אך+אולם vs אבל | 5% |
| דבר מה vs משהו | 0.1% |
| אנא+נא vs בבקשה | 10% |
| לאחר vs אחרי | 26% |
| היזהר vs תיזהר | 24% |
| התכונן vs תתכונן | 28% |
| עבור vs בשביל | 38% |
| ללא vs בלי | 42% |
| ביותר vs הכי | 42% |
| משום/מאחר/היות/מכיוון ש vs בגלל ש | 42% |
| לעולם לא vs אף פעם | 45% |
| אני מצטער vs סליחה | 56% |

- Curated synthetic possessives occur 456k times vs 4.6 M analytic של+suffix (שלי/שלך/שלו…), about 1:10.

**Extra OPUS counts** (per 100k tokens; second pass; [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip)):

| Pair (A vs B) | A | B |
|---|---|---|
| כנראה vs נראה לי | 32.8 | 27.4 |
| בעצם | 13.7 | — |
| חתיכת vs ארור | 14.5 | 8.9 |
| בינתיים vs לעת עתה | 7.65 | 2.19 |
| הרי (=after all) | 2.97 | — |
| זה עתה | 1.12 | — |
| הורה ל- vs ציווה (all forms) | 1.47 | 0.32 |
| פוקד/פקד על | 0.39 | — |
| ויתרתי על vs זנחתי/זנח/זנחה/זנחנו/זנחת | 0.58 | 0.19 |
| active להוציא…להורג vs passive מוצא להורג + יוצא/תוצא להורג | 0.63 | 0.11 + 0.21 |
| היה לנו/לי מזל vs שיחק לנו/לי המזל vs יצא לנו/לי מזל | 2.27 | 0.03 vs 2 hits in total |
| הלך עלינו/עליי vs אנחנו גמורים vs «נגמר לנו» with no object | 0.64 | 0.16 vs 0.11 |
| מעלה זיכרונות vs מחזיר (לי) זיכרונות vs איזה זיכרונות vs מחזיר ימים | 0.13 | 0.01 vs 0.01 vs 0 |
| נושף בעורף vs נושם בעורף | 159 hits | 2 hits |
| כמצופה מ- vs כצפוי (any) | 30 hits | 714 hits |
| אני מודה לך/לכם vs אסיר תודה | 1.31 | 3.3 |

**Exact definitions** (implemented in `opus-markers.py`):
- **Text normalisation:**
  - nikud U+0591–U+05BD and U+05BF–U+05C7 removed;
  - maqaf → `-`;
  - ״ → `"` and ׳ → `'`;
  - RLM/LRM/RLE/PDF removed.
- **Boundaries:** `B=(?<![א-ת])` and `E=(?![א-ת])`. Geresh is not a letter, so `ג'` splits.
  - The parallel study used `(?<![א-ת'׳])` instead, which differs only for words with an apostrophe.
- **Word markers** = `B[prefixes]?(?:w1|w2|…)E`. Prefixes per marker:
  - **ו only:** כיצד, מדוע, היכן (+מהיכן), מאין, האם, כאשר, אולם, אך, לפיכך, אפוא, שמא, פן, בטרם, טרם, הלא, בל, הואיל, כעת, עתה (+מעתה), אכן, כה, ביותר, ללא, בעת, עבור/בעבור, אודות, למען, באמצעות, כלפי, ייתכן/יתכן, and the imperatives.
  - **ו/ש:** neg. copula (plus איני — a refinement), copula, לאחר.
  - **ו/ב:** אשר. **מ is excluded** (מאשר = "than / approves").
  - **ו/ה/ב/ל:** מעט. **כ is excluded** (כמעט = "almost").
  - **ו/ה:** ארור*.
  - **No prefix:** ובכן, לבל, כדלקמן.
- **Multi-word and special rules:**
  - `ו?על כן`
  - `ו?משום ש[א-ת]`, `ו?מאחר (?:ש|ו)[א-ת]`, `ו?היות (?:ש|ו)[א-ת]`, `ו?מכיו?ון (?:ש|ו)[א-ת]`. Refinement: ו- variants added, because "מאחר ו/היות ו" is the common form.
  - `ו?אף` E, **not** followed by ` אחד|אחת|פעם|מקום` (excludes colloquial אף אחד/אף פעם; the noun "nose" cannot be excluded).
  - `ו?לעולם לא`, `ו?דבר מה`, `ו?(?:על ידי|ע"י)`.
  - `ו?(?:ביכולת|באפשרות|ברצונ)(?:י|ך|ו|ה|נו|כם|כן|ם|ן)`.
  - `ו?יש ` + INF. `ו?(?:עליך|עלייך|עלינו|עליכם|עליכן) ` + INF. Extended: `עליו|עליה|עלי|עליי|עליהם|עליהן`.
    - INF = the 1,726-token lexicon in `opus-inf-lexicon.txt`: tokens starting with ל seen ≥ 30 times after a modal verb (רוצה/צריך/יכול/מנסה/חייב/אסור/אפשר/מוכרח and their inflections), minus pronoun forms and a hand blacklist of nouns (לזה, למישהו, לארוחת, לחץ, לוח, לאנשים…).
    - Without this lexicon, "יש לזה" alone would add 6,913 false hits.
  - Imperatives: התכונן/התכונני/התכוננו · היזהר/הזהר/היזהרי/הזהרי/היזהרו/הזהרו · הישמר/הישמרי/הישמרו · הבט/הביטו/הביטי · חדל/חדלו/חדלי.
    - התכוננו and חדל(ו) are also past tense.
    - הבט is also the defective spelling of היבט ("aspect").
  - Possessives (curated): 1sg חבריי אנשיי ספינתי ליבי לבי ידיי כוחי גופי נשמתי חלומי אחיי ביתי; 2sg חבריך חברייך אנשיך ספינתך אביך אמך ליבך לבך ראשך ידיך ידייך עיניך עינייך כוחך גופך נשמתך חלומך ביתך שמך; 3ms חבריו אנשיו ספינתו אביו אמו ליבו לבו ראשו ידיו עיניו כוחו גופו נשמתו חייו חלומו ביתו; 1pl חברינו אנשינו ספינתנו חיינו ביתנו כוחנו.
    - Prefix [ובלמש]. Special cases: `[ובלש]?(?:אבי|אמי)` (no מאמי), `[ולמש]?עיניי` (no בעיניי), `[ולמש]?חייך` (no בחייך; bare חייך is also the verb "smiled").
    - Excluded as homographs: אחי, בני, חברי, חיי, ראשי, שמי, שמו.
  - Object suffixes (curated): להורגו להרגו להורגה להרגה להורגם להרגם להורגך להרגך להצילו להצילה להצילם להצילך לעצרו לעוצרו לעצרם לתופסו לתפסו לתופסם להביסו להביסם לנצחו לנצחם להשמידו להשמידם לראותו לראותה לשחררו לשחררם להחזירו להחזירה ראיתיו ראיתיה ראיתים הכרתיו הכרתיה אהרגך אהרוגך אהרגכם הרגוהו הרגתיו הרגתיה תפסוהו עצרוהו הצילוהו הצילני מצאתיו מצאתיה מצאנוהו אהבתיה אהבתיו. Prefix [וש].
  - Execution: `[וש]?(?:מוצא|מוצאת|מוצאים|מוצאות|הוצא|הוצאו|יוצא|יוצאו|יוצאת|תוצא|תוצאו|אוצא|נוצא) להורג`. The noun הוצאה להורג is deliberately excluded.
  - Subtitle-isms:
    - `[וה]?ארור(?:ה|ים|ות)?`
    - `ו?מה לעזאזל`
    - `(?:אלוהים|אלוקים|אלהים) אדירים`
    - `ו?לכל הרוחות`
    - `ו?בשם (?:אלוהים|אלוקים|אלהים)`
    - `אסיר(?:ת|י|ות)? תודה`
    - `ו?תודה לך`
    - `ו?אני מצטער(?:ת)?`
    - `ו?כצפוי מ[א-ת]`
    - `לא אסלח (?:לך|לכם)`
  - Controls:
    - `ו?אני מניח(?:ה)?`
    - `ו?אחרי הכו?ל`
    - `ו?זה הכו?ל` (שזה הכל is not counted)
    - `[וש]?(?:הולך|הולכת|הולכים|הולכות) להיות`
  - Colloquial counterparts (refinement):
    - למה, איפה/מאיפה, איך, עכשיו/מעכשיו, בלי, אחרי, הכי, קצת, אבל, בשביל, משהו
    - `ו?בגלל ש[א-ת]`, `ו?אף פעם`
    - תיזהר*, תתכונן*, בבקשה
    - `של(?:י|ך|ו|ה|נו|כם|כן|הם|הן)`, `ו?אני לא`, `ו?(?:הוא|היא) לא`
    - תודה, סליחה, לעזאזל, מזל
- **Counting unit:** occurrences (`findall`), not lines.

### Inferences
- **Gauge "bookish" against human-like levels, not against OPUS.** OPUS readers are used to some formal function words that our AI rarely uses: האם, אינני, כאשר, מדוע, כעת. So they are not why our lines feel off. The human files and our AI both sit well below OPUS on them.
- **The over-uses that stand out against both baselines are lexical/phrasal, not grammatical.** They also match the native reviewer's fixes:
  - ארור as an all-purpose insult adjective;
  - אסיר תודה;
  - passive execution;
  - כצפוי מ-;
  - sentence-final אחרי הכל;
  - אכן;
  - ייתכן;
  - זה עתה / לעת עתה;
  - passive על ידי.
- **Some "formal" items are normal subtitle Hebrew** and should not be linted:
  - ללא, ביותר, עבור, לעולם לא, מעט (עוד מעט / לא מעט are colloquial);
  - possessive idioms such as במו עיניי (72% of OPUS "with my own eyes").
  - OPUS uses them at 25–45% of their colloquial pair, and the human files use them too.

### Gaps
- I computed the AI rates on the 56 episodes with `cues.json` only (≈100k tokens). The parallel marker study covers all 342 AI files ([marker-frequencies.md](marker-frequencies.md)). Use their AI numbers where the two differ. Mine are a cross-check with identical regexes to the OPUS baseline.
- Rare markers (< 5 hits in our corpus) are statistically noisy at this size.

---

## Q5. Where is our Hebrew more bookish than the OPUS norm, and where is the OPUS norm itself translationese?

### Takeaway
- **OPUS backs the native reviewer's fixes, with one twist.**
  - For four of the six fixes, the reviewer's choice is the OPUS-common or idiomatic form, and the rejected form is rare. Examples: הלך עלינו, not «נגמר לנו»; היה לנו/שיחק לנו המזל, not יצא לנו מזל.
  - For two fixes (passive execution and אסיר תודה), OPUS's majority sides with the rejected form. **OPUS majority ≠ natural.**
- **Our most frequent remaining problems,** each with real lines:
  - ארור;
  - אסיר תודה;
  - כצפוי מ-;
  - ציווה/פוקד;
  - עבר זמן (רב);
  - במקרה כזה;
  - לא יכול שלא;
  - אם/כשחושבים על זה;
  - זה עתה / לעת עתה;
  - יהיה אשר יהיה;
  - תודות לכם;
  - אין מחילה;
  - הורדתי את ההגנה.

### Cited Findings
**Native-reviewer fixes vs OPUS** (counts from [OPUS v2024](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip)):
- **נגמר לנו → הלך עלינו** (MA_1 "I really thought we were going to die" is now «באמת חשבתי שהלך עלינו»).
  - OPUS: «הלך עלינו/עליי» 1,964 hits vs «נגמר לנו» with no object 330 (and «אנחנו גמורים» 498).
  - For "we're done for / finished / doomed" lines, «נגמר לנו» is 0%.
  - **Still in our files:**
    - IM_4#391 «אבל אם גם הסוהר מגלן יופיע, נגמר לנו!»;
    - MA_6#35 «נגמר לנו! בורחים!» ([IM_4.he.json](../../scripts/onepace-translations/IM_4.he.json), [MA_6.he.json](../../scripts/onepace-translations/MA_6.he.json)).
  - The TB_19 lines «נגמר לנו הזמן» ("we're out of time") are correct.
- **יצא לנו מזל → שיחק לנו המזל.**
  - OPUS: יצא לנו/לי מזל: 2 hits in 58.5 M lines.
  - שיחק לנו/לי המזל: 98 hits.
  - היה לנו/לי מזל: 6,915 hits; it is 50% of "we got lucky" lines.
- **זנחתי את התואר → ויתרתי על התואר.**
  - OPUS: ויתרתי על 1,782 vs זנח-family 575.
  - For "gave up/abandoned the title/position" (40 lines): נטש/עזב 52%, ויתר 18%, זנח 0%.
- **מחזיר ימים → איזה זיכרונות.**
  - OPUS: מחזיר ימים = 0 hits.
  - Commonest for "takes me back/brings back memories" (671 lines): מעלה זיכרונות 24%, then מחזיר אותי/לי 16% (calque).
  - The reviewer's «איזה זיכרונות» is only 22 hits in OPUS, but it is the natural exclamation (my judgment). **This is a case where natural ≠ common in subtitles.**
- **אייס הולך להיות מוצא להורג → הולכים להוציא את אייס להורג.**
  - For "will be executed" OPUS is 55% passive (יוצא/יוצאו להורג) vs 8% active.
  - Corpus-wide, active להוציא…להורג (1,928) beats passive מוצא (336) + יוצא/תוצא (641).
  - **Our remaining passives:**
    - «אז אייס יוצא להורג היום, בשלוש אחר הצהריים»;
    - «הצוותים של הברית יוצאו להורג»;
    - «הוחלט שאגרוף האש אייס… יוצא להורג!»;
    - «אם גולד רוג'ר הוצא להורג לפני 22 שנה»;
    - «לפני שהוצא להורג».
- **אני אסיר תודה לך → אני מודה לך.**
  - OPUS: אסיר תודה 10,109 hits vs אני מודה לך/לכם 3,979. For "I'm most grateful / you have my gratitude": אסיר 74%.
  - **Our remaining hits (14 in 56 episodes):**
    - «אנחנו אסירות תודה»;
    - «אתם צריכים להיות אסירי תודה לי»;
    - «תהיו אסירי תודה, טיפשים!»;
    - IM_7#460/461 «אני אסיר תודה» ×2;
    - SAB_1#65 «אני אסיר תודה!»;
    - SAB_2#75 «אני אפילו לא יכול לבטא כמה אני אסיר תודה לכם»;
    - SAB_3#102 «אני כל כך אסיר תודה!»;
    - TB_19#257 «כדאי שתהיה אסיר תודה…».

**The four unreviewed lines in the brief:**
1. **«כצפוי מכל כוחות הצי.»** (MA_5#60, Ivankov; EN "Vi'd expect no less from the Navy's full force").
   - OPUS has only 43 «כצפוי מ-» hits in 58.5 M lines (0.01/100k tokens), vs our 3.0/100k.
   - "expect no less" in OPUS is «לא הייתי מצפה לפחות» (48%), which is also a calque.
   - My suggestion: «ברור, זה כל הצי. אסור לזלזל בהם.» ("well sure, it's the whole Navy") or «מה ציפינו? זה כל הצי.»
   - Same pattern in MA_5#191 «כצפוי מהצוות האגדי!» → «איך לא, הצוות האגדי!» / «אין עליהם!». And in TB_16#147 «כצפוי מנסיכת הרפאים!» → «אין עלייך, נסיכת הרפאים!» (praise). Also SAB_4#124 «כמצופה מצוות כובע הקש...».
2. **«אבא ציווה לשמור על האח של אייס בחיים!»** (MA_7#71; EN "The Old Man ordered us to keep Ace's brother alive!").
   - OPUS: "ordered us to" → הורה 50%, פקד 10%, ציווה 7%.
   - "keep him alive" → להשאיר בחיים 26% > לשמור (על) בחיים 14%.
   - My suggestion: «אבא אמר לנו לדאוג שהאח של אייס יישאר בחיים!» or «אבא נתן הוראה: האח של אייס נשאר בחיים!»
   - Same verb elsewhere in ours:
     - «הם ציוו עליך לצאת לשירות פעיל»;
     - «למה ציווית עלינו לסגת?»;
     - «אני פוקד עליך לנתק את השידור».
3. **«שליט הגיהנום כבר נושם בעורף.»** (IM_9#87; EN "The boss of Hell is just around the corner").
   - Two errors:
     - the idiom is **נושף** בעורף (159 OPUS hits vs 2 for נושם);
     - the English means "very close", and OPUS renders "just around the corner" as «ממש מעבר לפינה» (62–63%).
   - My suggestion: «שליט הגיהנום ממש מעבר לפינה.» or «שליט הגיהנום כבר כאן.»
4. **«לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!»**
   - Its English is not in the 56 `cues.json` episodes. It is the same "nothing less than what you'd expect from" construction.
   - OPUS "what you'd expect from" (31 lines): מצפה/לצפות 48%, i.e. literal.
   - My suggestion: «לא סתם הוא הפליג עם מלך הפיראטים!» ("not for nothing he sailed with the Pirate King") or «ברור, הוא הפליג עם מלך הפיראטים!»

**Other places where ours is more bookish or literal than OPUS's common rendering** (our lines from [scripts/onepace-translations](../../scripts/onepace-translations/)):
- **ארור as insult adjective.** 50 occurrences, 50.6/100k tokens; OPUS 8.9; for "you damn X" OPUS uses ארור in 8%. Our lines:
  - «כריש ארור» (damn shark);
  - «אידיוט ארור» (freaking dumbass);
  - «ראוותן ארור» (flashy bastard);
  - «מטומטמים ארורים» (freaking morons);
  - «האוקאמה הארור הזה»;
  - «ארורה, נסיכת הנחשים!» (curse you);
  - «ארור שכמותך» (damn you; OPUS: לעזאזל איתך 47%).
  - Natural (my judgment): «כריש מחורבן», «חתיכת אידיוט», «יא מטומטמים», «האוקאמה המזדיין/המחורבן הזה», or just drop the intensifier. «לעזאזל איתך, נסיכת הנחשים!»
- **"Long time no see" → «עבר (המון) זמן»** in 7 of 8 lines (IM_7#411 «עבר זמן רב.»). OPUS: מזמן לא התראינו / הרבה זמן לא התראינו.
- **"In that case" → «במקרה כזה»** ×7 (e.g. IM_7#473 «במקרה כזה, אולי פשוט אהרוג אותך עכשיו?»). OPUS sentence-initial: אם כך/אם ככה 44%. Natural: «אם ככה, …» / «אז …».
- **"I can't help but" → «אני לא יכול שלא לרחם / לחשוב / לצחוק»** ×5. Natural (my judgment):
  - «אני לא יכול לא לרחם עליו»;
  - «אי אפשר לא לצחוק»;
  - «בא לי לצחוק»;
  - «אני חייבת להודות שאני מעריצה…».
- **"Come to think of it" → «אם לחשוב על זה» / «אם חושבים על זה» / «כשחושבים על זה»** ×5. Ours also has the natural «רגע, בעצם…» ×2.
- **"Unforgivable" → «אין מחילה» / «זה לא ייסלח»**. Natural (my judgment): «את זה אני לא סולח!», «זה עבר כל גבול!», or OPUS's «זה בלתי נסלח» for formal speakers.
- **"Thanks to you guys" → «תודות לכם»** (SAB_2#78). OPUS: בזכותך 23% (formal הודות/תודות together 43%). Natural: «בזכותכם».
- **"Is that so?" → «כך זה»** ×2 → «באמת?» / «אה, ככה?»
- **"Understood" → «הובן»** ×2 → «מובן» / «הבנתי» / «ברור».
- **"Whatever the case/reason" → «יהיה אשר יהיה» / «תהיה הסיבה אשר תהיה»** (2% in OPUS) → «לא משנה מה» / «בכל מקרה».
- **"To tell you the truth" → «למען האמת»** (13% in OPUS) → «האמת היא ש…» (90%).
- **"Just met/obtained/arrived" → «זה עתה»** ×4:
  - «שזה עתה פגשתי»;
  - «שזה עתה השגתי»;
  - «בת הים שזה עתה הגיעה»;
  - «חייך זה עתה ניצלו».
  - OPUS: זה עתה ≈ 0% of "just met/got" lines; הרגע 12%. Natural: «שרק עכשיו פגשתי», «שהרגע השגתי», «שרק הגיעה».
- **"For now / for the time being" → «לעת עתה»** ×3 → «בינתיים» (3.5× more frequent in OPUS overall).
- **"Behold!" → «הביטו!»** ×2; also «הביטי למעלה». → «תראו!» / «הנה!»
- **"I let my guard down" → «הורדתי את ההגנה»** ×3 → «לא שמתי לב» / «התרשלתי» / «הייתי חייב להיות יותר זהיר» (my judgment).
- **"Very well" → «טוב מאוד»** ×2 → «בסדר» / «טוב» / «בסדר גמור».
- **Passive with agent (על ידי)**, 36 occurrences. Examples:
  - «ספינה הותקפה על ידי ספינת הפיראטים של הקוג'ה»;
  - «לופי נרדף על ידי בנות הכפר»;
  - «נהפכנו לקרח על ידי אאוקיג'י».
  - Natural (my judgment): «ספינת הקוג'ה תקפה ספינה», «בנות הכפר רדפו אחרי לופי», «אאוקיג'י הקפיא אותנו».
- **"Indeed" → «אכן»** ×15. This includes «אכן עזרתי לאיש בשם רוג'ר» and «אכן אמרתי את זה» for "I did …".
  - Natural: «נכון», «בדיוק», «כן, עזרתי…», «כן, אמרתי את זה».
- **"After all" (sentence-final) → «…, אחרי הכל»** ×22. OPUS uses it in 47% of sentence-final "after all", so it is common, but the human files show the same rate.
  - My judgment: «הרי» at the start of the clause is the native move: «הרי אנחנו ממש ליד המפקדה» instead of «המפקדה ממש לידנו, אחרי הכל».
  - For our own house rule, check the parallel marker study first; it treats this as a control.
- **«ובכן»**: 49.6/100k tokens, 49 occurrences. Examples:
  - «ובכן, סליחה שגרמתי לך צרות»;
  - «ובכן... הקיסר קאידו!»;
  - «ובכן, אתה רואה».
  - Natural: «טוב, …» / «אז ככה…» / «נו…» / «תראה…».
- **"You must be crazy" → «אתה חייב להיות משוגע»** (AM_1#353; calque of epistemic "must"). OPUS "you must be": בטח 49%. → «אתה בטח משוגע» / «השתגעת?»
- **"you bastard" → «מנוול שכמוך»** ×5, «ארור שכמותך». OPUS: plain מנוול/ממזר, or חתיכת ממזר / יא ממזר. «שכמוך» is literary (my judgment; OPUS uses it in 6%).

**What our translator does better than OPUS** (keep):
- מעניין אם (not אני תוהה);
- תתכונן (not הכן את עצמך);
- אל תזלזל בי (not אל תמעיט בערכי);
- זוז לי מהדרך (not זוז מדרכי);
- סמוך עליי (not תשאיר את זה לי);
- תתאמץ (not עשה כמיטב יכולתך);
- הצלחנו (not עשינו זאת);
- דיי עם השטויות (not אל תהיה מגוחך);
- אבל (not עם זאת).

### Inferences
- **Highest-yield detection targets** across the ~340 episodes, because their rate is far above both baselines:
  - ארור;
  - אסיר תודה;
  - passive execution;
  - כצפוי/כמצופה מ-;
  - ציווה/פוקד;
  - זה עתה / לעת עתה;
  - עבר זמן (רב) as a greeting;
  - אין מחילה;
  - יהיה אשר יהיה;
  - תודות ל-.
- **The remaining items are not single-word problems** and need a rewrite rule, not a word ban: "I can't help but", "come to think of it", "in that case", "I guess", passive על ידי.

### Gaps
- I could only compare the 56 episodes that have English `cues.json`. Fedew and main episodes without stored cues were checked only by marker rates (by the parallel study), not by English phrase.
- The suggestions marked "my judgment" are mine and should be confirmed by the native reviewer. Especially «אין עלייך» for praise-type "as expected of", which is a register shift.

---

## Actionable rules for our translator

### Takeaway
- **Ranked by expected impact:** frequency in our corpus × distance from the OPUS norm and the human files × native-reviewer evidence.
- **Format:** pattern → why it's unnatural → natural alternative(s) → example.
- **OPUS evidence:** [OPUS v2024 en–he](https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/moses/en-he.txt.zip), my counts.

### Rules
1. **ארור/ארורה/ארורים as an intensifier for "damn/freaking/cursed X"**
   - Why: ours 50.6 vs OPUS 8.9 vs human 6.3 per 100k tokens. OPUS uses it for only 8% of "you damn X" and 1% of "freaking X". It sounds biblical.
   - Use: חתיכת X · X מחורבן · יא X · drop the intensifier · for "damn you" use לעזאזל איתך (47%).
   - Example: «מטומטמים ארורים!» → «יא מטומטמים!»; «ארור שכמותך» → «לעזאזל איתך!».
2. **Passive execution: יוצא/מוצא/הוצא להורג**
   - Why: the native reviewer rejected it. Active להוציא…להורג is 2:1 over passive in OPUS overall, even though OPUS's literal rendering of "will be executed" is passive.
   - Use: an active impersonal plural (יוציאו / מוציאים / הוציאו אותו להורג).
   - Example: «אז אייס יוצא להורג היום בשלוש» → «אז מוציאים את אייס להורג היום בשלוש»; «לפני שהוצא להורג» → «לפני שהוציאו אותו להורג».
3. **אסיר/ת/י תודה**
   - Why: ours 14.2 vs human 0 per 100k tokens. Rejected by the native reviewer. OPUS's 74% for "most grateful" is subtitle-ese.
   - Use: תודה (רבה) · אני ממש מעריך · אני חייב לך · אני מודה לך (formal speakers only) · for "be grateful": תגיד תודה ש- / תודה שאתה בכלל…
   - Example: «תהיו אסירי תודה, טיפשים!» → «תגידו תודה, טיפשים!».
4. **כצפוי/כמצופה מ- for "as expected of / I'd expect no less / nothing less than…"**
   - Why: only 43 «כצפוי מ-» in 58.5 M OPUS lines. Its home is anime fansubs. Rejected-type register.
   - Use: praise → אין עליך/אין על X · grudging → ברור, זה X / לא סתם זה X / מה ציפית? זה X / איך לא.
   - Example: «כצפוי מנסיכת הרפאים!» → «אין עלייך, נסיכת הרפאים!»; «כצפוי מכל כוחות הצי» → «ברור, זה כל הצי».
5. **Wrong or idiom-mangled fixed expressions**
   - Why: the idiom's real form dominates OPUS:
     - נושף בעורף 159 vs נושם 2;
     - היה/שיחק לנו המזל vs יצא לנו מזל 2;
     - הלך עלינו/אנחנו גמורים vs «נגמר לנו» (= "we ran out").
   - Use: the idiom's actual form, or plain words ("ממש מעבר לפינה").
   - Example: «שליט הגיהנום כבר נושם בעורף» → «שליט הגיהנום ממש מעבר לפינה»; «נגמר לנו! בורחים!» → «הלך עלינו! בורחים!».
6. **Biblical/legal verbs of command: ציווה, ציווית, פוקד על, also זנח**
   - Why: OPUS "ordered us to" → הורה 50% / ציווה 7%. «ויתרתי על» alone is 3× all זנח forms combined.
   - Use: אמר לנו ל- · נתן הוראה · הורה לנו · ויתרתי על.
   - Example: «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר לנו לדאוג שהאח של אייס יישאר בחיים!».
7. **Literary time/discourse adverbs: זה עתה · לעת עתה · אכן · ובכן · למען האמת · יהיה אשר יהיה**
   - Why: OPUS for "just met" uses זה עתה ≈ 0% (הרגע 12%); בינתיים is 3.5× לעת עתה; "to tell the truth" is האמת ש- 90%; "whatever the case" uses יהיה אשר יהיה only 2%. Human files: אכן 3.2 and עתה 0 per 100k tokens.
   - Use: הרגע / רק עכשיו · בינתיים · נכון / בדיוק / כן · טוב / נו / אז / תראה · האמת ש- · לא משנה / בכל מקרה.
   - Example: «חרב… שזה עתה השגתי» → «החרב שהרגע השגתי»; «אכן אמרתי את זה» → «כן, אמרתי את זה».
8. **Calqued greeting and assent formulas**
   - Why: each is a calque, archaic, or a mis-register; OPUS's plainer form is common:
     - «עבר זמן (רב)» for "long time no see" (OPUS מזמן לא התראינו 33% + הרבה זמן… 18%);
     - «כך זה» for "is that so" (באמת 50%);
     - «הובן» (מובן 50%);
     - «טוב מאוד» for "very well" (בסדר/בסדר גמור 49%);
     - «אין מחילה» / «זה לא ייסלח» for "unforgivable";
     - «כן אדוני» to an officer (my judgment: Israelis say כן המפקד, and OPUS has 17% of it).
   - Use: מזמן לא התראינו / כמה זמן! · באמת? / אה, ככה? · מובן / הבנתי · בסדר / טוב · זה עבר כל גבול / את זה אני לא סולח · כן, המפקד!
   - Example: «עבר זמן, כובע הקש!» → «מזמן לא התראינו, כובע הקש!».
9. **Clause-level calques of English discourse frames**
   - Why: these are literal frames; OPUS's own majority is calqued in several:
     - "I can't help but V" → לא יכול שלא ל- (OPUS 34%, also calque);
     - "come to think of it" → אם/כשחושבים על זה;
     - "in that case" → במקרה כזה (OPUS: אם כך/ככה 44% > במקרה כזה 36%);
     - "I guess" → אני מניח (OPUS 56%, also calque);
     - "I wonder" → אני תוהה;
     - "thanks to you" → תודות/הודות לך;
     - "you must be X" → אתה חייב להיות X.
   - Use: restructure (אי אפשר לא… / בא לי… / אני חייב להודות ש-) · רגע, בעצם… / האמת ש… · אם ככה / אז · כנראה / נראה לי / אולי / drop · מעניין אם/מה · בזכותך · אתה בטח X / השתגעת?
   - Example: «אני לא יכול שלא לרחם על הדובאל הזה» → «בא לי לבכות בשביל הדובאל הזה» / «אני כבר מרחם על הדובאל הזה».
10. **Passive with agent (X-ed by Y → על ידי)**
    - Why: ours 36.4 vs human 15.8 per 100k tokens. OPUS renders "was X-ed by" with על ידי 31%, but spoken Hebrew prefers an active clause (my judgment).
    - Use: make Y the subject; or use the impersonal plural.
    - Example: «לופי נרדף על ידי בנות הכפר» → «בנות הכפר רודפות אחרי לופי»; «נהפכנו לקרח על ידי אאוקיג'י» → «אאוקיג'י הקפיא אותנו».
11. **Sentence-final «…, אחרי הכל»**
    - Why: ours 22.3 vs OPUS 3.3 per 100k tokens. The human files match ours, so this is lower priority and a control. It is still an English tag-calque.
    - Use: הרי at the start of the clause · בכל זאת · drop.
    - Example: «המפקדה ממש לידנו, אחרי הכל» → «הרי המפקדה ממש לידנו».
12. **Literary insult appendages and archaic exclamations**
    - Why: OPUS's plain forms dominate:
      - «X שכמוך/שכמותך» (OPUS 6% for "you bastard": plain מנוול/ממזר 26%, חתיכת/יא 12%);
      - «הביטו!» for "behold" (ראו/תראו/הנה 24%);
      - «שוטה» for "you fool" (2% vs אידיוט 46%).
    - Use: יא מנוול · חתיכת ממזר · מנוול! · תראו! / הנה! · אידיוט / טיפש / מטומטם.
    - Example: «מנוול שכמוך!» → «יא מנוול!».
13. **Do NOT "fix" these (they are normal subtitle and human Hebrew)**
    - Why: OPUS uses them at 25–45% of their colloquial pair (or, for the fixed phrases, as the majority rendering), and the human files use them too.
    - Keep: ללא, ביותר, עבור, לעולם לא (vows), עוד מעט / לא מעט, במו עיניי, לא אסלח לך (shonen-standard, OPUS 74%), מה לעזאזל, אני זה ש- (cleft), תודה לך, בלתי אפשרי (in narration).
    - Example: «לעולם לא אשכח מה שעשית בשבילי!» stays.
