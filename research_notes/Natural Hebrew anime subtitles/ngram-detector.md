# Detecting unnatural collocations and calques with a real-subtitle n-gram corpus

Files in this folder (all mine):
- `ngram-detector.js` — the prototype (node ≥ 18, stdlib only; usage in its header comment).
- `ngram-flags.tsv` — top 500 AI dialogue lines of the whole corpus, ranked by score. Columns: rank, file, ass_line (physical line in the .ass), dlg_idx, score, worst_ngram, obs, expected, kind, slor, min_local, reg, reg_worst, format, text, judgment_top100. The last column holds my labels for ranks 1–100.
- `ngram-allowlist.txt` — names that collide with ordinary Hebrew words (ואנו = Wano, גרמה = Germa…), plus accepted n-grams.

Scratch data, not in the repo: `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/ngram/`. It holds `work/counts-os.json` (12.8 MB, reusable), `work/ours.json`, `work/pairs.json`, `work/pairs-scored.tsv`, `work/keyness.tsv`, `work/lexicon-hits.tsv`, and the downloads in `dl-os2024/` and `dl-wikimedia/`.

Verdict in one line: **the n-gram detector works as a needle-finder, not as triage.** Its top 100 lines are 60% truly unnatural and 79% unnatural or borderline. But it only sees one narrow class of error: word-salad calques and grammar slips built from common words. It misses almost all of the "bookish but grammatical" lines the user complains about, including all six of the user's examples. Comparing word *frequencies* against the same corpus works much better for that problem: our AI over-uses a short list of bookish markers, at 4–25 hits per 1,000 lines against 2.7 in the human files.

---

## Q1. Can a large real-subtitle corpus serve as a reference for Hebrew naturalness, and how was the detector built?

### Takeaway
Yes, cheaply. OPUS ships a 1.7 GB Hebrew OpenSubtitles monolingual file. One streaming pass in about 15 minutes counts every unigram, bigram and trigram that occurs in our 136k lines. The catch is that OpenSubtitles Hebrew is itself mostly *translated* subtitle Hebrew. It is formal and full of translationese, so "common in OpenSubtitles" does not mean "natural".

### Cited Findings
- The current OPUS listing for Hebrew OpenSubtitles mono is **v2024**: 181,076 documents, 972,087,897 tokens, file `https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/mono/he.txt.gz` (1.69 GB). v2018 (956 MB) is still online. — [OPUS API](https://opus.nlpl.eu/opusapi/?corpus=OpenSubtitles&source=he&preprocessing=mono&version=latest)
- The OpenSubtitles2018 release behind these corpora was built from 3.7 million subtitles in 60 languages. — [Lison, Tiedemann & Kouylekov, LREC 2018](https://aclanthology.org/L18-1275/)
- Second, non-subtitle corpus: OPUS **wikimedia v20260327** Hebrew mono (80 MB gz). My pass counted 767,521 lines and 26.9 M tokens in 33 s. — [OPUS API listing](https://opus.nlpl.eu/opusapi/?source=he&preprocessing=mono&version=latest); counts from `work/count-wiki.log`
- My pass over OpenSubtitles v2024 read 157,530,885 lines. It skipped **19,576,973 exact-duplicate lines of ≥ 6 words (12.4%)**, which come from re-uploaded subtitle files. It kept 140,980,330 sentences and **550,825,178 word tokens** (punctuation not counted) in 879 s, with about 1–2 GB of RAM. — `work/count-os.log` (my run)
- Our side: 363 files and 136,965 dialogue lines. That is 128,735 AI lines (343 ` he.ass`) and 7,015 human lines (20 ` He.ass`). The fedew EL04 ` he.ass` is a port of the human file, so it was relabelled human-port. The detector also extracted 323 lines of the **original AI EL04** (`git show cf2521b:…enieslobby 04 he.ass`), the only matched AI-vs-human episode. Total targets: 689,920 n-grams over 43,125 word types. — `ngram-detector.js extract` output (my run)
- Known bad→good pairs: 209 pairs whose tokens differ. They come from the IM_3–IM_8 rewrite-log examples (55, tags calque/voice), the IM_7 + MA_1 native-review diffs (92, commits f42f8b0 and a04d2aa) and the EL24/EL25 quality pass (62, commit 17200fb). — `work/pairs.json`
- Scoring rests on established ideas:
  - **PMI** as a word-association measure. — [Church & Hanks 1990](https://aclanthology.org/J90-1003/)
  - **Anti-collocations**: word combinations that are expected but unnatural, found by testing corpus or web counts. — [Inkpen & Hirst 2002](https://aclanthology.org/W02-0909/)
  - Corpus-based **miscollocation detection** for learner English. — [Futagi, Deane, Chodorow & Tetreault 2008 (ETS)](https://www.ets.org/research/policy_research_reports/publications/article/2008/hsig)
  - Web counts for bigrams unseen in a corpus correlate reliably with human plausibility judgments, and absence from a corpus alone is not proof of implausibility. — [Keller & Lapata 2003](https://aclanthology.org/J03-3005/)
  - **SLOR** (LM log-prob minus unigram log-prob, divided by length) was the most robust acceptability measure in Lau, Clark & Lappin's study. — [Lau, Clark & Lappin 2017](https://findanexpert.unimelb.edu.au/scholarlywork/1396299-grammaticality--acceptability--and-probability--a-probabilistic-view-of-linguistic-knowledge)
  - Translationese is detectable from function-word n-grams and POS trigrams. — [Volansky, Ordan & Wintner, as summarised in Rabinovich & Wintner](https://arxiv.org/pdf/1609.03205)
- The OpenSubtitles counts show the translationese problem directly:
  - The user's "bad" אסיר תודה occurs **8,278** times. Its natural fix הלך עלינו occurs **0** times, while נגמר לנו occurs 3,726 times.
  - The passive calque מוצא להורג (360) is nearly as common as יוצא להורג (554).
  - The corpus uses מדוע (2.0 per 10k tokens), כעת (2.3/10k) and היכן (2.1/10k) far more than our AI does (0.15, 0.24, 0.29). — `work/counts-os.json`, my lexicon table under Q4

### Inferences
- How the detector works (my design, in `ngram-detector.js`):
  - Tokenize on whitespace and punctuation. Keep prefixes attached. Strip nikud and direction marks. Map house spellings to one key in both corpora (הכול→הכל, האלה→האלו, מידי→מדי, דיי→די, עליי→עלי…).
  - Commas, the ASS line break and dashes are *soft* boundaries: n-grams are not scored across them. A cue starts a sentence only if the previous cue ended with . ! ?
  - A line's score is its worst n-gram seen ≤ 3 times, scored as log10((E+1)/(obs+1)):
    - bigram: E = c(a)·c(b)/N (independence);
    - trigram: E = c(ab)·c(bc)/c(b) (Markov).
- Because OpenSubtitles is translated Hebrew, it can only catch lines that are odd *even by subtitle-translationese standards*. A literary-but-grammatical line like «אני אסיר תודה לך» looks normal to it. (My inference from the counts above.)
- The wikimedia "register" signal (Wikipedia-frequent, subtitle-rare) is dominated by encyclopedic vocabulary: dates, places, English words. It works poorly as a bookishness detector; its AUC is 0.61 (Q2). A literary corpus such as Project Ben-Yehuda would be a better register reference (untested).

### Gaps
- No colloquial Israeli Hebrew corpus (spontaneous speech, chat, original Israeli TV subtitles separated from imports) was available cheaply on OPUS. Such a corpus is what the user's ear actually represents.
- I did not de-duplicate near-identical subtitle versions (re-timed copies with small edits). Only exact long duplicates were removed.

---

## Q2. How precise is it, and what does it catch versus miss?

### Takeaway
On my judgment:
- **Precision@50 = 72%** (36/50 truly unnatural; 88% counting borderline).
- **Precision@100 = 60%** (60/100; 79% with borderline).
- Ranks 101–500 fall to about 35% (sample of 20).

Against real native reviews it ranks rewritten lines above kept ones only moderately (**AUC 0.67**), with **recall ≤ 14%**. It hardly separates human from AI translation on the one matched episode.

### Cited Findings (all my measurements; sources are the files named)
- **Top-100 judgment**, Hebrew-only reading, labels in `ngram-flags.tsv`. These are my own judgments as an AI reading Hebrew, not a native Israeli.
  - Ranks 1–50: TRUE 36, BORDERLINE 8, FALSE 6.
  - Ranks 51–100: TRUE 24, BORDERLINE 11, FALSE 15.
  - The 60 TRUE split into: calque 30, grammar 8, garbled 6, agreement 4 (זו/אלה with a masculine noun), register 3, wrong word 2, word order 2, collocation 2, formatting bug 3 (words split across `\N`, one reversed line).
  - So **53/100 are naturalness problems proper**; the other 7 are real errors of another kind.
- **Before the filters** in Q3, precision@50 was 48% strict (24/50) and 58% lenient. — my judgment of the unfiltered list
- **Ranks 101–500**: a sample of every 20th line (n = 20) gave 7 TRUE, 5 BORDERLINE, 8 FALSE, i.e. about 35% strict and 60% lenient. Score cut-offs: rank 100 = 1.80, 200 = 1.60, 300 = 1.50, 500 = 1.34. — `ngram-flags.tsv`
- **Against the two full native reviews** (pre-review IM_7 + MA_1: 828 dialogue lines, 86 rewritten = 10.4% base rate):

  | Signal | AUC |
  |---|---|
  | anti-collocation score | **0.670** |
  | min local LM surprise | 0.649 |
  | wiki register | 0.614 |
  | unseen-bigram count | 0.567 |
  | SLOR | 0.557 |

  | Score threshold | Lines flagged | Of those rewritten | Precision | Recall |
  |---|---|---|---|---|
  | ≥ 0.5 | 57 | 12 | 21% | 14.0% |
  | ≥ 0.75 | 25 | 9 | 36% | 10.5% |
  | ≥ 1.0 | 14 | 5 | 36% | 5.8% |
  | ≥ 1.25 | 7 | 4 | 57% | 4.7% |

  The 10 lowest-SLOR lines contained 0 rewrites. — `scratchpad/ngram/analyze2.js` output
- **Bad→good pairs (209)**: the old line scored worse in 73, tied in 88 (mostly both 0) and scored better in 48. SLOR preferred the fixed line in only 110 of 204 decided pairs. Effectively no signal. — `work/eval-summary.txt`, `work/pairs-scored.tsv`
- **Human vs AI**:

  | | Score ≥ 1 | Score ≥ 1.5 | Unseen bigrams | Mean SLOR |
  |---|---|---|---|---|
  | AI lines | 1.18% | 0.24% | 4.69% | 0.534 |
  | Human lines | 1.02% | 0.18% | 3.51% | 0.600 |

  On the **matched EL04** the unseen-bigram rate is the same (AI 4.22% vs human 4.20%). At score ≥ 1, 8 AI vs 4 human lines are flagged.
- **The user's six still-unfixed examples are all missed.** Their ranks among 128,735 AI lines run from 3,887 to 42,897:
  - «הבהלה הזאת ממש נוחה לנו» 3,887
  - «לא פחות ממה שאפשר לצפות…» 6,511
  - «אבא ציווה לשמור…» 8,226
  - «נושם בעורף» 15,436
  - «כצפוי מכל…» 28,568
  - «תתכונן לקראתי» 42,897

  Why, from the OpenSubtitles counts:
  - נושם בעורף = 0 **and** נושף בעורף = 0, because the idiom normally carries a dative (נושף לו בעורף).
  - כצפוי מכל = 0, but E = 0.2, too rare to judge.
  - נוחה לנו = 5 vs נוח לנו = 182.
  - תתכונן לקראתי = 0, but E ≈ 0.

  The one fixed pair it would separate is יצא לנו מזל 1 vs שיחק לנו 97. — `work/counts-os.json`

### Inferences
- The detector catches errors where *common* words are glued together in a way subtitles never do: «לעזאזל אותך», «אתה כולו מיוזע», «שצריך לי את», «על אתכם שניים», «בטח רעב». With 550 M tokens, the expected count for such pairs is in the hundreds, so seeing them 0–3 times is decisive.
- Most of what the user and the native reviewers object to is different: odd **content-word** choices («תופעות לוואי מכוערות», «זנחתי את התואר», «ציווה»), idiom distortions and bookish register. Their parts are too rare for absence to mean anything, which is exactly Keller & Lapata's point. Hence recall of 6–14%.
- Practical reading: about 60% of the top 100 are worth fixing. The top 300 (score ≥ 1.5) should give roughly 120–150 real fixes across the whole backlog: 60 + 35% of the next 200 = about 130 by my estimate. That is useful clean-up but covers maybe 1–2% of the roughly 12k lines a full native review would rewrite (10.4% × 122,614).

### Gaps
- The precision judgments are mine, not a native Israeli's. The user should spot-check about 20 lines of `ngram-flags.tsv`, especially the BORDERLINE ones.
- Only two native-reviewed episodes exist, so the AUC and recall figures have wide uncertainty (86 positives).

---

## Q3. What are the false alarms, and which filters remove them?

### Takeaway
Before filtering, almost half the top 50 were false alarms, and most were **names that are also Hebrew words**. Four cheap filters cut false alarms in the top 50 from 21 to 6. What remains are rare-but-fine combinations, fragmentary speech, and lines that are literal in a fantasy context.

### Cited Findings (my analysis of the ranked lists)
- False alarms in the *unfiltered* top 50 (21 total):
  - ואנו (Wano, also "and we") ×9
  - בל-מר split into בל + מר ×5
  - כפוי-טובה split at the hyphen ×2
  - currency בלי (Beli, also "without") after a number ×1
  - פאונד, לאף (Laugh Tale), אני הטירה, מי עליה ×2
- Filters added to `ngram-detector.js` (all in `makeScorer`):
  1. **Registry terms**: tokens from `docs/characters.json`, `docs/translation-glossary.json` and `docs/translation-canon.json` (fields he/he_aliases/human/ai, 527 tokens, prefixes ושהבכלמ stripped). They are skipped when rarer than 5,000 in OpenSubtitles, so common words like הצי still count.
  2. **Automatic name filter**: any token our AI uses ≥ 100× more often per token than OpenSubtitles does (≥ 5 uses). This catches לופי, אוסופ, אורוצ'י, ארלונג… automatically. Tokens with fewer than 30 OpenSubtitles occurrences are skipped too.
  3. **Hyphen compounds** (בל-מר, כפוי-טובה, מ-מה stutters) are kept as one token when scoring, so they count as rare and are skipped. **Currency**: בלי after a digit or מליון/אלף, even across a line break, is rewritten to a placeholder before scoring.
  4. **Allowlist** (`ngram-allowlist.txt`): ואנו, פאונד, לאף, גרמה, and the n-gram טובה הזה.
  - Also: Ivankov's ווי is in a built-in skip set (HOUSE_SKIP).
- Remaining false alarms in the filtered top 100 (21):
  - rare-but-fine combinations: 9 (e.g. «בדקנו כל תינוק וכל אם» — this is already the post-review line; «אני מרגיש את צמא הדם שלך»)
  - elliptical speech: 3 («מי עליה?!», «מי גמור?!»)
  - fantasy literalness: 3 («אולי אתה עשן», «כשהייתי אלוהים», «אני הטירה הזאת»)
  - fixed idioms the counts split: 2 («זה אני בכבודו ובעצמו»)
  - other: 4 (slang «תעוף לי», theatrical self-introduction, quotation, colloquial «ראיתי אותה גם הצהריים»)
- Side findings worth fixing (formatting, not naturalness), from the `format` column:
  - **446 AI lines in 7 files start with sentence-final punctuation**, i.e. visual-order "pre-flipped" punctuation. Mostly `romancedawn 01 he.ass` (247) and `wano 48 he.ass` (186). One line (`romancedawn 02 he.ass:69`) also has its words in reversed order.
  - **About 12 lines split a word across `\N`**, e.g. `wano 39 he.ass` ×6: «הסמ / וראים», «הפ / יראטים»; `wano 19:163` «ואנח / נו».

### Inferences
- An allowlist will keep growing with every arc. Collapsing the ranked list by `worst_ngram` and deciding each recurring n-gram once (allow or fix-all) would make the remaining name homographs a one-time cost.
- I did not find a cheap filter for "rare-but-fine" combinations. That is the irreducible false-alarm floor, about 10–15% of the top 100.

### Gaps
- The automatic name filter can hide a genuinely over-used calque whose word is ≥ 100× over-used. In practice the words it caught at that ratio were names, invented terms and topic words (פיראטים, הקש), but I did not audit all ~200 of them.

---

## Q4. What does the corpus comparison reveal beyond single lines, and how should we triage about 340 episodes?

### Takeaway
For the user's actual complaint (bookish, translated-sounding Hebrew), **frequency comparison beats n-gram anomaly.** A 22-item marker lexicon fires about 2.7 times per 1,000 lines in the human files, about 4–5 per 1,000 in the newest AI arcs, and **14–25 per 1,000 in the older AI arcs**. Use the lexicon rate to choose which arcs get blind native review first. Use the n-gram top list only as a one-off clean-up sweep.

### Cited Findings (my measurements)
- **Keyness** (log-likelihood G² of AI vs OpenSubtitles, also required to be ≥ 2× the human rate) is dominated by topic words and names: רובין, הצי, האי. The style items in it I selected by hand. — `work/keyness.tsv`
- Rate per 10k tokens for each marker: AI / human / OpenSubtitles. — my lexicon table
  - Bookish words and calqued curses:
    - ארור 2.67 / 0.32 / 0.21; ארורים 0.71 / 0.32 / 0.08; ארור אתה 0.44 / 0 / 0.005
    - כמצופה 0.17 / 0 / 0.005; כצפוי 0.25 / 0 / 0.02
    - אם כי 1.38 / 0 / 0.17; זה עתה 0.70 / 0 / 0.11; עתה 1.46 / 0 / 0.50
    - אולם 1.31 / 0.32 / 0.23; לשווא 0.51 / 0 / 0.12; למדי 0.76 / 0 / 0.48
    - אנא 1.97 / 0 / 1.25; מובן 3.14 / 0.32 / 0.92; אסיר תודה 0.44 / 0 / 0.15
    - אכן 2.36 / 0.32 / 1.17; ובכן 8.27 / 3.80 / 7.78
    - אגרום 0.71 / 0 / 0.11; אני מתחנן 0.90 / 0 / 0.18
    - לעזאזל אותך 0.02 / 0 / 0.000 (3 occurrences in 550 M tokens)
  - Formal imperatives:
    - מהרו 1.71 / 0.63 / 0.11; מהרי 0.68 / 0 / 0.05; שתקו 0.85 / 0 / 0.03; הביאו 0.66 / 0.32 / 0.27
- Over-used synthetic possessives (low counts, very high ratios vs OpenSubtitles): ספינתו, ספינתם, דמעותיה, מולדתם, שלטונם, גאוותנו, רגעיו, היעדרי, אדונכם, תמהתי, ייחלנו. — over-use list from my run
- The AI already avoids the classic markers and under-uses them relative to OpenSubtitles: מדוע 0.15 vs 2.00, היכן 0.29 vs 2.09, כאשר 0.17 vs 1.78, כעת 0.24 vs 2.32, אינני 0.02 vs 0.98, אשר 0.14 vs 0.82. The bookishness has moved to the items above.
- **Lexicon hits per 1,000 dialogue lines by arc** (`ngram-detector.js lexicon`, 1,873 hit lines over the AI corpus, listed in `work/lexicon-hits.tsv`):

  | Group | Arcs (hits per 1,000 lines) |
  |---|---|
  | Human He.ass | 2.7 |
  | Newest AI arcs | Marineford 4.0, Impel Down 4.0, Amazon Lily 4.9 |
  | Middle | Thriller Bark 8.7, fedew Enies Lobby 9.0, Egghead 9.5, Arlong Park 10.9, Post-Enies Lobby 11.6 |
  | Wano and Whole Cake Island | Wano 17.0, WCI 14.4 |
  | Worst | Whisky Peak 25.2, Reverie 24.0, Water Seven 22.5, Post War 22.4, Sabaody 18.9, Skypiea 18.9, Jaya 18.7, Loguetown 17.6, Enies Lobby (main) 17.4 |

- **n-gram flags per episode** are too sparse to rank episodes. At score ≥ 1.5 the median is 2.2 per 1,000 lines, about 0–5 per episode. At score ≥ 1 the arc rates (4–20 per 1,000) overlap the human rate (9.7 per 1,000). — `scratchpad/ngram/analyze.js` output
- **Near-miss idiom check** (experimental `nearmiss` command). It looks for a rare bigram whose word is one edit away from a strongly bound collocate, as in נושם/נושף בעורף.
  - On a 3 M-line sample it produced 451 candidates at share ≥ 0.05. The top 20 were mostly legitimate pairs: יותר מדם, תגיד לצי, לירות אותך.
  - It did surface real typos and calques: «אני סיכוי» → אין סיכוי, «ניסיתי לדבר אותו מזה» (talk him out of it), «שמעת מזה».
  - Rough precision in that sample, my judgment: 25–30%.
  - It cannot catch נושם בעורף, because both forms are 0 in OpenSubtitles.

### Inferences — recommended wiring (my recommendation)
1. **One-off backlog sweep (about 1–2 hours of fixing).** Fix ranks 1–200 of `ngram-flags.tsv` (score ≥ 1.6). Expect about 90 real fixes: 60 in the top 100 plus about 35% of the next 100. Skip FALSE rows and add the names you discover to `ngram-allowlist.txt`. Ranks 201–500 (score 1.34–1.6) are optional, at about 35% precision.
2. **Arc prioritization for blind native review**, which remains the only method with good recall (it rewrites about 10% of lines). Order arcs by lexicon rate, worst first: Whisky Peak, Reverie, Water Seven, Post War, Sabaody, Skypiea, Jaya, Enies Lobby (main), Loguetown, Wano… The newest arcs (Impel Down, Amazon Lily, Marineford) come last; they were produced with the current skill and already sit near the human rate.
3. **Per-episode gate for new translations**, cheap and run before blind native review:
   - (a) `lexicon` hits → translator replaces them.
   - (b) `score` lines ≥ 1.6 for that episode (expect 0–2) → translator fixes.
   - (c) Then the existing two-reader blind native review, unchanged.
   - Do **not** show the detector's flags to the blind readers; that would anchor them, and the blind read exists precisely to avoid anchoring.
   - Counts are cached: `counts-os.json` only needs a recount (about 15 min) when a new episode adds n-grams. Unseen n-grams default to 0, which inflates the score, so re-run `extract` + `count` per batch of new episodes.
4. Do not use SLOR, wikimedia register or unseen-bigram rate for triage. All three were at or near chance on the review data (AUC 0.56–0.61).

### Gaps
- The lexicon list was picked using the same corpora it is evaluated on (keyness vs OpenSubtitles and vs the human files), so its separation of human from AI is optimistic.
- It is barely testable against native review: the two reviewed episodes are from the newest, low-rate arcs and contain only 5 lexicon hits.
  - 1 was rewritten: «אני אסיר תודה לך», IM_7:467, fixed by the parent rather than the readers.
  - The blind LLM readers passed «אני אסיר תודה.» (IM_7:460, 461) and «אני מתחנן!» (IM_7:444, 462).
  - Since the user names אסיר תודה as unnatural, the lexicon catches something the blind LLM review misses. (My check: `git show f42f8b0^:…IM_7.he.json`.)
- The arc ordering assumes lexicon rate correlates with the overall rate of unnatural lines. That is plausible, since both reflect the older translation pipeline, but untested; reviewing one high-rate arc episode would test it.

---

## Actionable rules for our translator

Ranked by expected impact = frequency in our 343 AI episodes × how badly it reads. The patterns come from the detector's TRUE flags and the lexicon table. The "natural" alternatives are my suggestions and should be confirmed by the user.

1. **Bookish connectives and adverbs: replace them with the spoken word.** About 1,250 hits.
   - Why: written or literary register. The human files use most of them never or several times less often. Real subtitles use most of them less too, but ובכן and אנא are also common in translated subtitles, so OpenSubtitles is no guide for those two.
   - Replacements:
     - ובכן → טוב, / אז
     - אכן → נכון / באמת
     - אנא → בבקשה
     - מובן! ("Understood!") → הבנתי! / קיבלתי! / סגור!
     - עתה / זה עתה → עכשיו / הרגע
     - אם כי → אבל / למרות ש
     - אולם → אבל
     - לשווא → סתם / בלי הועיל
     - למדי → די
     - כצפוי / כמצופה (מ…) → ברור ש… / בדיוק כמו שחשבתי / מה ציפית
     - אסיר תודה (לך) → תודה רבה / אני חייב לך
   - Example: «אני למדי מופתע שהצוות שלכם הגיע עד כאן» (waterseven 03:333) → «אני די מופתע שהגעתם עד לפה».
2. **Curses calqued from "Damn (you)!".** About 230 hits.
   - Pattern: ארור/ארורים/ארור אתה (226), לעזאזל + direct object (לעזאזל אותך/עליה).
   - Why: ארור is biblical, and לעזאזל takes no object.
   - Natural: לעזאזל! / לך לעזאזל! / שילך לעזאזל! / חרא! / יא מנוול!
   - Examples: «לעזאזל אותך!» (impeldown 03:461) → «לך לעזאזל!»; «לעזאזל עליה!» (impeldown 08:436) → «שתלך לעזאזל!».
3. **Formal imperatives in dialogue.** Up to about 250 hits; הביאו/קראו also count past-tense uses.
   - Pattern: מהרו/מהרי (141), שתקו (50), הביאו (39), קראו (26). The future-form תזדרזו is fine.
   - Why: the imperative mood proper is formal in speech; Israelis use the future form or a different verb.
   - Natural: מהר! / תמהרו! / זוזו!; שקט! / תשתקו!; תביאו; תקראו.
   - Examples: «הביאו את הדבר לכאן!» (wano 19:67) → «תביאו את זה לפה!»; «קראו לי מה שתרצו» (alabasta 01:53) → «תקראו לי איך שבא לכם».
4. **Preposition plus a separate pronoun, and "you two".**
   - Pattern: על אתכם, נגד אותך, ל… אותו.
   - Why: Hebrew prepositions take suffixes, and "you two" is שניכם.
   - Natural: עליכם, נגדך, שניכם.
   - Examples: «אני מדבר על אתכם שניים!» (littlegarden 02:153) → «אני מדבר עליכם, שניכם!»; «בהתקפות שעובדות נגד אותך» (waterseven 05:124) → «…שעובדות נגדך».
5. **Present-tense verb without a subject** (English "Must be hungry", "If not feeling well").
   - Why: a Hebrew present-tense participle needs its pronoun.
   - Examples: «בטח רעב.» (postwar 06:137) → «אתה בטח רעב.»; «אם לא מרגיש טוב, נחזור» (wci 01:69) → «אם אתה לא מרגיש טוב, נחזור».
6. **"Let's / let me / may I also" structures copied from English.**
   - Pattern: בואו שהוא…, תן לי ל…, אפשר גם אני ל…, אם תרשו לי את….
   - Natural: שיצטרף אלינו!, קח אותי…, אפשר גם לי…, אפשר את תשומת לבכם?
   - Examples: «בואו שהוא יצטרף אלינו!» (drumisland 04:305) → «שיצטרף אלינו!»; «תן לי לצאת איתך על הספינה שלך» (wano 21:260) → «קח אותי איתך על הספינה».
7. **Imperative used as a conditional** ("Stand in my way and I'll…").
   - Why: in Hebrew that reads as an order.
   - Natural: אם + future.
   - Example: «תעמוד בדרכי, ואקח גם את שלך» (wano 48:366) → «אם תעמוד בדרכי, אקח גם את שלך».
8. **Feminine/plural demonstrative with a masculine noun.** This over-applies the house זו rule.
   - Pattern: זו הסיפור, זו מצב, אלה בעיה.
   - Why: זו is for feminine nouns only. It is also lint-able: זו or אלה followed by a masculine singular noun.
   - Examples: «זו הסיפור מאחורי עיר בקורה» (wano 06:49) → «זה הסיפור…»; «צרה! אלה בעיה רצינית!» (waterseven 04:85) → «זו בעיה רצינית!».
9. **English comparison and "with that" frames.**
   - Patterns and natural alternatives:
     - כ… כמו הזה → כזה
     - עם זה נגמר, … → זהו, עכשיו…
     - שוב עם ל… → שוב אתה…?!
     - מה … אם לא … → just say it
   - Examples: «מהלך כל כך טיפשי כמו הזה» (enieslobby 17:251) → «מהלך כזה טיפשי»; «עם זה נגמר, אף אחד לא יוכל לעלות» (wci 20:72) → «זהו, עכשיו אף אחד לא יוכל לעלות»; «מה אני מריח אם לא ריח של פיראטים?» (waterseven 03:414) → «מריח פה פיראטים!».
10. **Literary word order and synthetic possessives.**
    - Pattern: verb–subject order (הגיעו גם הם לכאן, הייתה זו…, אם חשובים לכם החיים…) and noun suffixes (שמי, ספינתו, דמעותיה, אדונכם).
    - Why: both are written-register features.
    - Natural: subject–verb order and של-possessives: גם הם הגיעו לכאן, זה היה קרוב!, השם שלי, הספינה שלו.
    - Example: «הייתה זו מצב קרוב!» (wano 12:125) → «זה היה קרוב!».
