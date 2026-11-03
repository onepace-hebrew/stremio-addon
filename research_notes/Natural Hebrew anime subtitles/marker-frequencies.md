# Bookish / translated-Hebrew markers: AI vs. human frequencies, discovery, and lint candidates

Scope: a quantitative comparison of our AI Hebrew subtitles with the 20 human `He.ass` files by "That One Gerbil". It covers the per-1,000-line rates of the candidate markers from the brief, a data-driven over/under-representation list, a precision check of lint candidates, and where the problem is concentrated.
All numbers are computed from the repo at HEAD (`14ba532`, 2026-11-03). Data files sit next to this note, prefixed `marker-frequencies_`. Hebrew judgments labelled "my judgment" are mine (the researcher's), not the user's.

**Corpora (dialogue lines only)**

| corpus | files | dialogue lines | Hebrew tokens |
|---|---|---|---|
| HUMAN (` He.ass`) | 20 | 6,974 | 31,337 |
| AI-main (`subtitles/main/**` ` he.ass`) | 257 | 96,586 | — |
| AI-fedew (`subtitles/fedew/**` ` he.ass`, excl. EL04) | 85 | 31,063 | — |
| AI total | 342 | 127,649 | 582,544 |

- **Fedew EL04 was excluded from AI.** It is a verbatim port of the human file. Commit `480cf35` says "EN_4 now serves That One Gerbil's human translation verbatim". A dialogue diff against `subtitles/main/17 Enies Lobby/04/enieslobby 04 He.ass` shows only 4 changed lines, all nif'al yod spellings (להלחם→להילחם, from `c933f19`). It was not double-counted as human either.
- **A parallel control**: the pre-port AI version of fedew EL04 (`git show cf2521b:…/enieslobby 04 he.ass`, 316 lines) has cue timings identical to the human EL04. 319 cues align by start time.
- **Dialogue filter**: a whitelist of styles `^(Main|Flashback|Thought|Secondary|Narrator|Roger)`. The brief's blacklist let through SFX/sign styles such as `Map`, `T3`, `Munch Chomp`, `Thump`, `Squish` and `Mysterious`. Lines must contain a Hebrew letter. Credit lines (`תרגום לעברית — That One Gerbil`) are dropped, and tags, RTL marks and niqqud are stripped. `\N` → ` / `.
- **Note**: every AI-main file also carries the "That One Gerbil" credit line (house convention, `docs/translation-learnings.md` l.156), so that line does not mark a file as human.
- **Word boundary used everywhere**: `B0=(?<![א-ת'׳])`, `B1=(?![א-ת'׳])`, plus marker-specific optional one-letter prefixes. Every exact regex is in the `regex` column of `marker-frequencies_marker_rates.tsv` (brief markers) and `marker-frequencies_lint_rules_rates.tsv` (refined lint rules).
- **Statistics**:
  - Rates are per 1,000 dialogue lines.
  - G² is Dunning log-likelihood, AI-all vs HUMAN, with lines as exposure. |G²| ≥ 3.84 ≈ p<.05 and ≥ 10.83 ≈ p<.001; the sign is + when AI is higher.
  - The 95% interval of the AI/HUMAN ratio comes from a file-level bootstrap: files resampled within each corpus, 1,000 reps, +0.5 smoothing. When HUMAN = 0 the interval is optimistic, so the "expected human count" is given as well.
  - Discovery uses log-odds with an informative Dirichlet prior (Monroe et al. 2008). The prior is the pooled frequency scaled to α0 = 10,000.

---

## Q1. Per-1,000-line rates of the brief's markers, per corpus, and which ones AI over-uses

### Takeaway
- **AI-main over-uses a small set of literary function words** by 3–13× and more. They hold up when content is matched (the East Blue AI subset):
  - **האם** (yes/no question particle)
  - **אינו/אינך…** (negative copula)
  - **אכן** ("indeed")
  - **עתה** ("now")
  - **אנא** ("please")
  - **ייתכן** ("possible")
  - **עליך/עלינו + infinitive** ("you/we must")
  - **ארור** ("cursed")
  - **כה** ("so")
  - **על ידי** (passive "by")
  - **אסיר תודה** ("grateful")
  - synthetic possessives
- **The newer fedew process has already cut most of them to near-human levels.**
- **Several "formal" words are used *more* by the human**: עבור, כלפי, באמצעות, אף (=even), מאשר, תודה לך, מה לעזאזל. So is the whole control set. These must not become lint rules.

### Cited Findings
Full table: [marker-frequencies_marker_rates.tsv](marker-frequencies_marker_rates.tsv). By fedew arc: [marker-frequencies_marker_rates_fedew_arcs.tsv](marker-frequencies_marker_rates_fedew_arcs.tsv). Brief markers, n (per 1k lines):

| cat | marker | HUMAN | AI-main | AI-fedew | AI/H | G² | boot 95% | H files /20 | AI files /342 | verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| question | האם (q-particle) | 3 (0.43) | 698 (7.23) | 24 (0.77) | 13.2 | 55.7 | 4.0–86 | 1 | 211 | **AI over-uses** |
| neg. copula | אינני/אינך/אינו/אינה/איננו/אינכם/אינן/אינם | 1 (0.14) | 121 (1.25) | 12 (0.39) | 7.3 | 8.3 | 1.9–17 | 1 | 98 | **AI over-uses** |
| copula | הנני/הנך/הינו/הינה/הינם/הריני | 0 | 24 (0.25) | 6 (0.19) | ∞ | 3.2 | — | 0 | 8 | false positives: all hits are the name הינה (Hina) |
| copula | הרי | 1 (0.14) | 24 (0.25) | 7 (0.23) | 1.7 | 0.3 | | 1 | 27 | n.s. |
| question | כיצד / מדוע / היכן / מאין | 1 / 0 / 1 / 0 | 10 / 9 / 17 / 3 | 0 / 0 / 2 / 0 | ~1 | ≤1 | | | | rare, n.s. |
| conj | אשר / כאשר | 0 / 0 | 7 / 10 | 2 / 0 | ∞ | ~1 | | | | rare, n.s. |
| conj | מאשר | 9 (1.29) | 43 (0.45) | 11 (0.35) | 0.33 | −7.4 | | 6 | 44 | human uses more |
| conj | אולם/ואולם | 1 (0.14) | 74 (0.77) | 3 (0.10) | 4.2 | 3.4 | 1.0–11 | 1 | 49 | AI (main) over-uses; the human hit is "hall" |
| conj | אך | 1 | 27 (0.28) | 0 | 1.5 | 0.2 | | | | n.s. |
| conj | על כן / לפיכך / משום ש / היות ש / אפוא / שמא / פן / בטרם / טרם / כדלקמן / הואיל | 0 each | 0–3 each | 0–1 each | | <0.5 | | | | essentially absent in all corpora |
| conj | מאחר ש/ו | 1 (0.14) | 45 (0.47) | 19 (0.61) | 3.5 | 2.4 | 0.9–8.8 | 1 | 51 | n.s. |
| conj | מכיוון ש | 4 (0.57) | 66 (0.68) | 12 (0.39) | 1.1 | 0.0 | | 4 | 64 | parity |
| conj | אף (=even) | 15 (2.15) | 76 (0.79) | 35 (1.13) | 0.40 | −8.6 | | 10 | 75 | **human uses more** |
| conj | ובכן | 12 (1.72) | 422 (4.37) | 65 (2.09) | 2.2 | 9.7 | 1.4–4.1 | 9 | 183 | AI over-uses (2×), but the human uses it in 9/20 files |
| conj | הלא | 3 (0.43) | 37 (0.38) | 8 (0.26) | 0.8 | −0.1 | | 3 | 41 | parity |
| conj | בל/לבל | 1 | 77 (0.80) | 4 | 4.4 | 3.7 | | | | false positives: name בל (Bell-mère); 8.6/1k in East Blue AI |
| adverb | עתה | 0 | 78 (0.81) | 10 (0.32) | ∞ | 9.4 | 7.4–12 | 0 | 71 | **AI over-uses** |
| adverb | כעת | 0 | 13 (0.13) | 2 (0.06) | ∞ | 1.6 | | 0 | 15 | rare |
| adverb | אכן | 1 (0.14) | 118 (1.22) | 25 (0.80) | 7.8 | 9.2 | 2.1–18 | 1 | 109 | **AI over-uses** |
| adverb | כה | 0 | 45 (0.47) | 3 (0.10) | ∞ | 5.1 | 3.7–7.2 | 0 | 41 | **AI over-uses** |
| adverb | מעט (excl. כמעט, עוד מעט) | 2 (0.29) | 33 (0.34) | 10 (0.32) | 1.2 | 0.1 | | | | parity |
| adverb | ביותר | 14 (2.01) | 264 (2.73) | 51 (1.64) | 1.2 | 0.6 | | 6 | 176 | parity |
| adverb | לעולם לא | 7 (1.00) | 206 (2.13) | 47 (1.51) | 2.0 | 3.9 | 1.0–5.6 | 5 | 158 | mild AI excess; the human uses it |
| adverb | דבר מה | 0 | 0 | 0 | | | | | | absent |
| prep | ללא | 10 (1.43) | 108 (1.12) | 15 (0.48) | 0.7 | −1.3 | | 6 | 88 | parity; human slightly more |
| prep | לאחר | 1 (0.14) | 62 (0.64) | 3 (0.10) | 3.6 | 2.5 | 0.9–9.0 | 1 | 47 | AI-main excess |
| prep | עבור | 8 (1.15) | 39 (0.40) | 4 (0.13) | 0.29 | −7.6 | | 6 | 33 | **human uses more** |
| prep | באמצעות | 5 (0.72) | 13 (0.13) | 1 (0.03) | 0.15 | −9.2 | | 4 | 14 | **human uses more** |
| prep | כלפי | 8 (1.15) | 24 (0.25) | 6 (0.19) | 0.20 | −11.4 | | 6 | 30 | **human uses more** |
| prep | למען | 2 (0.29) | 53 (0.55) | 12 (0.39) | 1.8 | 0.8 | | | | n.s. |
| prep | על ידי | 5 (0.72) | 238 (2.46) | 47 (1.51) | 3.1 | 9.4 | 1.7–9.3 | 5 | 164 | **AI over-uses** (passive) |
| prep | בעת / בעבור / אודות | 0 | 3 / 0 / 0 | 0 | | | | | | absent |
| modal | ביכולתי/באפשרותי/ברצוני… | 0 | 13 | 5 | ∞ | 1.9 | | | | mostly a false positive: bare ביכולת = "with the ability"; real suffixed forms 2+3 |
| modal | ייתכן | 0 | 68 (0.70) | 24 (0.77) | ∞ | 9.8 | 7.5–13 | 0 | 66 | **AI over-uses** (both processes) |
| modal | יש ל+inf | 5 (0.72) | 28 (0.29) | 9 (0.29) | 0.4 | −2.9 | | 4 | 35 | human uses more |
| modal | עליי/עליך/עלינו… ל+inf | 0 | 96 (0.99) | 15 (0.48) | ∞ | 11.8 | 9.2–15 | 0 | 79 | **AI over-uses** |
| imper. | אנא | 0 | 112 (1.16) | 4 (0.13) | ∞ | 12.3 | 9.3–17 | 0 | 61 | **AI-main over-uses** |
| imper. | הבה / נא / הישמר | 0 | 4 / 7 / 1 | 0 / 4 / 0 | | ≤1.2 | | | | rare |
| imper. | התכונן/היכון | 6 (0.86) | 70 (0.72) | 18 (0.58) | 0.8 | −0.3 | | 4 | 65 | parity |
| imper. | היזהר/הזהר | 0 | 33 (0.34) | 5 (0.16) | ∞ | 4.0 | 2.8–5.8 | 0 | 33 | AI over-uses |
| imper. | הבט/הביטו, חדל | 1, 1 | 5, 1 | 5, 2 | <1 | | | | | parity / rare |
| poss. | possessive-suffixed nouns (refined list of 106 forms) | 35 (5.02) | 970 (10.04) | 165 (5.31) | 1.8 | 13.4 | 1.2–2.8 | 15 | 288 | **AI-main over-uses (2×)**; fedew at human level |
| obj. suffix | curated object-suffixed verbs (85 forms) | 0 | 4 (0.04) | 0 | | 0.4 | | 0 | 4 | **non-issue** |
| obj. suffix | generic ‑והו/‑יהו | 4 (0.57) | 39 (0.40) | 22 (0.71) | 0.8 | −0.1 | | | | parity (mostly names) |
| calque | מוצא/הוצא/יוצא להורג (raw, incl. noun הוצאה) | 0 | 35 (0.36) | 16 (0.52) | ∞ | 5.4 | | 0 | 36 | AI over-uses; see refined rule B11 |
| subism | ארור/ארורה/ארורים/ארורות | 2 (0.29) | 218 (2.26) | 67 (2.16) | 7.8 | 18.3 | 2.2–36 | 1 | 148 | **AI over-uses** (both processes) |
| subism | מה לעזאזל | 28 (4.01) | 241 (2.50) | 72 (2.32) | 0.6 | −5.5 | | 13 | 174 | **human uses more** |
| subism | אלוהים אדירים / לכל הרוחות / בשם אלוהים | 0 / 1 / 0 | 6 / 8 / 0 | 2 / 4 / 0 | | ≤0.9 | | | | rare |
| subism | אסיר תודה | 0 | 29 (0.30) | 17 (0.55) | ∞ | 4.9 | 3.5–7.0 | 0 | 37 | **AI over-uses** (fedew too) |
| subism | תודה לך/לכם | 14 (2.01) | 22 (0.23) | 4 (0.13) | 0.10 | −33.9 | | 8 | 22 | **human uses 10× more** |
| subism | אני מצטער/ת | 11 (1.58) | 137 (1.42) | 48 (1.55) | 0.9 | −0.1 | | 8 | 116 | parity |
| subism | כצפוי מ | 0 | 1 | 4 (0.13) | | 0.5 | | | | rare (fedew) |
| subism | לא אסלח ל | 1 (0.14) | 30 (0.31) | 6 (0.19) | 2.0 | 0.6 | | | | n.s. |
| control | אני מניח/ה | 9 (1.29) | 125 (1.29) | 48 (1.55) | 1.05 | 0.0 | | 8 | 120 | parity |
| control | אחרי הכל | 7 (1.00) | 72 (0.75) | 28 (0.90) | 0.8 | −0.4 | | 7 | 78 | parity |
| control | זה הכל | 5 (0.72) | 36 (0.37) | 9 (0.29) | 0.5 | −1.9 | | 4 | 39 | parity / human more |
| control | הולך/ת להיות | 2 (0.29) | 51 (0.53) | 5 (0.16) | 1.5 | 0.4 | | 2 | 44 | parity |

**Content-matched check.** AI-main East Blue episodes (arcs 00–07, 8,405 lines; column `AI_main_EastBlue` in the TSV) against the human (East Blue + EL04), per 1k:

| marker | AI-main East Blue | HUMAN | result |
|---|---|---|---|
| האם | 5.12 | 0.43 | over-use persists |
| ארור* | 2.97 | 0.29 | over-use persists |
| אינו… | 0.71 | 0.14 | over-use persists |
| אכן | 0.59 | 0.14 | over-use persists |
| אנא | 0.71 | 0 | over-use persists |
| עליך ל+inf | 0.59 | 0 | over-use persists |
| execution passive | 1.07 | 0 | over-use persists |
| **possessive suffixes** | 6.07 | 5.02 | **near parity** |

So the possessive excess is concentrated in later arcs (royalty, samurai, families), while the others are not content-driven. [marker-frequencies_marker_rates.tsv](marker-frequencies_marker_rates.tsv)

**Parallel control (EL04, the same cues):**
- AI-old has 4×כה, 3×ובכן, 2×ארור, 1×אכן, 1×ייתכן, 1×לכל הרוחות.
- The human has 0×כה, 1×ובכן, 0×ארור, 0×אכן, 0×ייתכן, 0×לכל הרוחות (columns `HUMAN_EL04`/`AI_EL04_parallel`).

**Per fedew arc.** The newer process improves arc by arc. Tier-A composite per 1k ([marker-frequencies_arc_density.tsv](marker-frequencies_arc_density.tsv)):

| fedew arc | Tier-A per 1k |
|---|---|
| Sabaody | 8.8 |
| Thriller Bark | 8.2 |
| Enies Lobby | 7.5 |
| Post-Enies Lobby | 7.1 |
| Amazon Lily | 3.5 |
| Impel Down | 1.8 |
| Marineford | 1.3 |

Per-rule, per-arc rates are in [marker-frequencies_lint_rules_significance.tsv](marker-frequencies_lint_rules_significance.tsv). For example, אם כי is 3.38/1k in Sabaody but 0 in ID/MA, and כלומר is 2.47 in Impel Down.

**Expected-count check for zero-human markers.** Under the AI-all rate, the human 6,974 lines "should" contain:

| marker | expected in human | observed | Poisson P(0) |
|---|---|---|---|
| האם | ≈ 39 (≈ 50 under the AI-main rate) | 3 | — |
| לומר | ≈ 9.8 | 0 | ≈ 6e-5 |
| כלומר | ≈ 8.2 | 0 | ≈ 3e-4 |
| אנא | ≈ 6.4 | 0 | ≈ 0.002 |
| עליך ל+inf | ≈ 5.0 | 0 | ≈ 0.007 |
| ייתכן | ≈ 5.0 | 0 | ≈ 0.007 |
| עתה | ≈ 4.8 | 0 | ≈ 0.008 |
| אם כי | ≈ 4.4 | 0 | ≈ 0.012 |
| כה | ≈ 2.7 | 0 | ≈ 0.07 (n.s.) |
| אסיר תודה | ≈ 2.5 | 0 | ≈ 0.08 (n.s.) |
| כעת | ≈ 0.8 | 0 | ≈ 0.4 (n.s.) |

Low-frequency items need the external OPUS baseline (parallel researcher) or precision judgments rather than this small human corpus.

**Refinements to the brief's definitions** (all applied in the refined rules of Q3):
- **אנו**: 163 of 184 raw hits are **ואנו = Wano** (place name), so the ו-prefix is excluded. Real אנו: 21 hits, mostly proclamations, letters and news.
- **הנני/הינה…**: every hit is the name **הינה** (Hina). Real copula forms (הנני/הנך/הינם/הריני) = **0** in all corpora.
- **ביכולת** without a suffix = "the ability" (Devil Fruit talk), so a suffix is required.
- **אולם** = "hall" in אולם התענוגות/המשתה/המשפט, so those are excluded.
- **בל** = Bell-mère; dropped.
- **Execution passive**: the noun "הוצאה להורג!" ("Execution!") is natural, so the rule is limited to verb forms.
- **Possessive list**: removed ambiguous forms, namely:
  - ראשי (= main)
  - בעלי (= owners of / fruit users)
  - שמו/שמה/שמי (= put / there / sky of)
  - גופה (= corpse)
  - ידי (= by, as in על ידי)
  - חייך (= smiled)
  - אמה (a name)
  - עמי/עמו (= with me / with him)
  - בתי (= houses of)
  - צוותי (= crews of)
  - אחיה (= I will live)
  - matches inside בלאמי (Bellamy, read as ב+ל+אמי)
- **עליך ל+inf**: excludes verbs governing על (אוסר עליכם ל…, סומך עליו…, לרכוב עליו ל…) and the idioms נגזר עליי / מוטל עליי.
- **אף (=even)**: excludes אף אחד/אחת/פעם/מקום/כמה.
- **מעט**: excludes כמעט and עוד מעט.

### Inferences
- **The main corpus (older bulk process, June 2026) carries most of the problem.** The fedew process removed האם (7.23→0.77), אנא (1.16→0.13), אולם (0.77→0.10), כה (0.47→0.10), לאחר (0.64→0.10) and halved the possessives. The rules worth turning into lint are those still above the human rate in fedew:
  - ייתכן
  - ארור
  - אסיר תודה
  - אכן
  - אם כי
  - כלומר
  - על ידי
  - (my reading)
- **The controls behave as the earlier lesson predicted.** אני מניח, אחרי הכל, זה הכל and הולך להיות are at parity. So are מכיוון ש, ביותר, ללא, התכונן, אני מצטער and הלא.
- **The human is not avoiding every formal word.** He prefers עבור, כלפי, באמצעות, אף, מאשר, בוודאות, מסוגל and מוכרח (see Q2). A "formality" lint built on words like these would flag the gold standard.

### Gaps
- No speaker labels in the `.ass` Name field, so rates cannot be split by character. Formal speech by kings, samurai and priests (Wano, Skypiea, Reverie) cannot be separated from the same register in the Straw Hats' mouths.
- The human gold is one translator, 20 files, nearly all East Blue. Rare markers (<0.3/1k) cannot be tested on it. Use the OPUS baseline from the parallel researcher.

---

## Q2. Data-driven discovery: what AI over-uses vs. the human, and what natural colloquial Hebrew AI under-uses

### Takeaway
- **Unigram discovery against a 31k-token human corpus is mostly noise.** Of the top 60 AI-over-represented words:
  - 27 are story content (names, places)
  - 13 are house-style orthography (הזאת/זו, אלה/אלו, מדי/מידי, די/דיי, אוקיי/אוקי, אכפת/איכפת, להילחם/להלחם)
  - 13 are neutral or colloquial
  - only 7 are register tells (האם, לומר, מובן, ובכן, על ידי, לכאן, partly מיד)
- **The clearer signals are elsewhere:**
  - a few bigrams: אם כי, בכל אופן, במקרה כזה, לא ייתכן, ובכל זאת
  - the reverse list: the human's natural curses and particles that AI under-uses (לעזאזל אתך, ממזר, חתיכת, בחיי, אשכרה, אין מצב, ככה, בגלל ש, בשביל, analytic של‑possessives, תודה לך)
- **The human is not slangy.** סבבה, תכלס and וואלה occur 0 times, and AI over-uses יאללה 13×.

### Cited Findings
Full lists (150 AI-over and 100 HUMAN-over for unigrams and bigrams, with 3 random AI examples each): [marker-frequencies_discovery_all_unigram.tsv](marker-frequencies_discovery_all_unigram.tsv), [marker-frequencies_discovery_all_bigram.tsv](marker-frequencies_discovery_all_bigram.tsv). A content-matched run (AI East Blue only) is in [marker-frequencies_discovery_eastblue_unigram.tsv](marker-frequencies_discovery_eastblue_unigram.tsv).
Filters: unigrams AI n≥20, bigrams AI n≥15, ≥10 AI files, ≥5 arcs.

**Top 60 AI-over-represented unigrams, classified** (class codes: R = register problem; R- = mild or contextual register; C = content; H = house style or orthography; N = neutral or colloquial; my classification after reading the examples):

| # | item | z | AI n (/1k tok) | HUMAN n (/1k tok) | class | note |
|---|---|---|---|---|---|---|
| 1 | הזאת | 5.62 | 909 (1.56) | 0 | H | the human writes הזו |
| 2 | אוי | 5.11 | 752 (1.29) | 0 | H | interjection spelling (human: או/הו/אוו) |
| 3 | אה | 4.85 | 1154 (1.98) | 17 (0.54) | N | interjection |
| 4 | הי | 4.75 | 650 (1.12) | 0 | H | the human writes היי |
| 5 | **האם** | 4.73 | 722 (1.24) | 3 (0.10) | **R** | question particle |
| 6–8 | רובין, לופי, אייס | | | | C | names |
| 9 | אלה | 3.70 | 419 | 1 | H | the human writes אלו |
| 10 | אפשר | 3.69 | 531 | 5 | N | mostly אי אפשר |
| 11 | **לכאן** | 3.67 | 526 (0.90) | 5 (0.16) | **R-** | the human uses הנה/לפה; EL04 parallel: לכאן→הנה |
| 12 | אדוני | 3.66 | 467 | 3 | C | "sir", military/servant cast |
| 13 | אדון | 3.59 | 624 | 9 | H | -san→אדון convention |
| 14 | בואו | 3.59 | 973 | 22 | N | colloquial |
| 15 | רגע | 3.57 | 1096 | 27 | N | "Wait!" (133/184 EN cues = "wait") |
| 16–18 | היא, האי, הקש | | | | C | |
| 19 | זאת | 3.40 | 827 | 18 | H | the human prefers זו |
| 20 | צ'ופר | | | | C | |
| 21 | הולכים | 3.35 | 323 | 0 | N | |
| 22 | אח | | | | C | Ace/Sabo |
| 23 | להילחם | 3.32 | 317 | 0 | H | nif'al yod (the human writes להלחם 33×) |
| 24–25, 27 | פרנקי, קאידו, גאם | | | | C | |
| 26 | אי | | | | C | island / אי אפשר |
| 28 | כי | 3.06 | 575 (0.99) | 11 (0.35) | N | colloquial "because"; the human prefers בגלל ש |
| 29 | בטח | 3.05 | 547 | 10 | N | 68/119 EN cues = epistemic "must" (natural) |
| 30–31 | כובע, ביג | | | | C | |
| 32 | מיד | 2.98 | 256 (0.44) | 0 | N/R- | mostly natural (אחזור מיד); EL04 parallel מיד→בדחיפות |
| 33 | אכפת | 2.93 | 248 | 0 | H | the human spells איכפת |
| 34 | פשוט | 2.89 | 1257 (2.16) | 40 (1.28) | N | 235/270 EN cues = "just"; 1.7× human |
| 35 | אוה | | | | H | interjection |
| 36 | חייב | | | | N | |
| 37 | מדי | 2.69 | 377 | 6 | H | the human writes מידי |
| 38–43 | השמיים, להציל, ג'ינביי, אבא, כובעי, ויוי | | | | C | |
| 44 | אוקיי | 2.59 | 193 | 0 | H | the human writes אוקי (16) |
| 45 | מאם | | | | C | |
| 46 | אנחנו | | | | N | |
| 47 | **יאללה** | 2.51 | 208 (0.36) | 1 (0.03) | N* | forced slang; "Here we go!/Let's go!" |
| 48 | הצי | | | | C | glossary term |
| 49 | **לומר** | 2.47 | 176 (0.30) | 0 | **R** | literary "to say"; the human writes להגיד |
| 50 | כלום | | | | N | |
| 51 | צ'אן | | | | C | |
| 52 | אאוץ' | | | | H | the human writes אוץ' |
| 53 | די | | | | H | the human writes דיי |
| 54 | של | | | | N | |
| 55 | המדינה | | | | C | |
| 56 | **ובכן** | 2.38 | 487 (0.84) | 12 (0.38) | **R-** | 38/45 EN cues = "Well" |
| 57 | להורג | | | | C | executions (Ace, Oden) |
| 58 | ברוק | | | | C | |
| 59 | **ידי** | 2.35 | 299 | 5 | **R-** | in על ידי |
| 60 | **מובן** | 2.34 | 185 (0.32) | 1 (0.03) | **R-** | the "Understood." reply |

**Next 40 AI-over unigrams worth noting:**
- ואנו (#61): content (Wano)
- כלומר (#67): 149 vs 0, R-
- ארור (#85): 157 vs 1, R
- לעולם (#90): R-
- [marker-frequencies_discovery_all_unigram.tsv](marker-frequencies_discovery_all_unigram.tsv)

**AI-over bigrams with register content** ([marker-frequencies_discovery_all_bigram.tsv](marker-frequencies_discovery_all_bigram.tsv), AI n / HUMAN n):

| bigram | AI n | HUMAN n | note |
|---|---|---|---|
| על ידי | 286 | 5 | |
| גם אם | 258 | 1 | the human uses אפילו אם 16 vs AI 66 |
| אם כי | 81 | 0 | |
| ובכל זאת | 83 | 0 | |
| בכל אופן | 79 | 1 | |
| הייתי רוצה | 54 | 0 | |
| אני מתחנן | 53 | 0 | |
| לא ייתכן | 48 | 0 | |
| במקרה כזה | 45 | 0 | |
| האם זה | 154 | 1 | |
| האם אתה | 51 | 0 | |
| כן אדוני | 247 | 0 | content: military |

**HUMAN-over items: natural Hebrew the AI under-uses**, per 1k lines ([marker-frequencies_extra_candidates.tsv](marker-frequencies_extra_candidates.tsv), [marker-frequencies_marker_rates.tsv](marker-frequencies_marker_rates.tsv)):

| item | HUMAN | AI-main | AI-fedew | note |
|---|---|---|---|---|
| **לעזאזל איתך/אתך** ("damn you") | 2.87 | 0.18 | 0.10 | the human's rendering of "Damn you!"; AI uses ארור אתה instead |
| **ממזר** ("bastard") | 5.59 | 0.94 | 1.42 | |
| **חתיכת** ("you piece of…") | 2.15 | 0.42 | 0.71 | |
| **בחיי** ("I swear / jeez") | 2.72 | 0.27 | 1.29 | |
| **אשכרה** ("for real", slang) | 1.15 | 0.02 | 0 | |
| **אין מצב** ("no way") | 3.15 | 0.80 | 3.61 | fixed in the new process |
| **אין סיכוי** | 2.72 | 0.81 | 1.35 | |
| **ככה** ("like this", colloquial) vs כך | 6.88 | 3.69 | 6.05 | |
| **בגלל ש** ("because") | 2.29 | 0.72 | 0.52 | the human rarely uses כי: 1.58 vs 4.5 |
| **בשביל** ("for") | 4.01 | 1.42 | 2.12 | |
| **של + pronoun** (analytic possessive: שלי/שלך/שלו…) | 83.7 | 62.6 | 67.3 | |
| **תודה לך** (standalone "Thank you.") | 1.00 | 0.10 | 0.06 | |
| **אפילו אם** ("even if") | 2.29 | 0.38 | 0.93 | AI prefers גם אם |
| **בהחלט** ("definitely"), the human's "indeed" | 4.30 | 1.41 | 2.58 | |
| **להגיד** ("to say") | 3.15 | 1.28 | 2.35 | |
| **מאוד** | 4.88 | 2.82 | 2.25 | |
| **בבקשה** | 8.46 | 5.50 | 7.21 | |
| **נראה לך** (bigram) | 9 hits | 16 hits (AI-all) | | |
| **זה למה** ("that's why", a common spoken anglicism) | 10 hits | 9 hits (AI-all) | | |

**Semi-formal words the human likes**, per 1k:

| word | HUMAN | AI-main | AI-fedew |
|---|---|---|---|
| בוודאות | 4.01 | 0.45 | 0.26 |
| מסוגל | 7.31 | 0.97 | 2.48 |
| בתור | 4.30 | 0.48 | 0.74 |
| מוכרח | 1.43 | 0.04 | 0 |
| אתך (spelling) | 6.74 | 3.18 | 2.25 |
| יחדיו (1 file) | 0.86 | 0.01 | 0 |
| בכדי | 0.57 | 0.01 | 0 |
| הנח ל… ("leave … alone") | 0.29 | 0.01 | 0 |

**The brief's slang list**, per 1k:

| word | HUMAN | AI-main | AI-fedew | note |
|---|---|---|---|---|
| נו | 1.58 | 1.19 | 1.61 | parity |
| יאללה | 0.14 | 1.92 | 0.87 | AI 13× |
| וואלה | 0 | 0 | 0.03 | |
| סבבה | 0 | 0.03 | 0 | |
| **אחי** | 8.60 | 1.06 | 0.90 | content: Johnny and Yosaku call Zoro "אחי" (aniki), 5 files |
| תכלס | 0 | 0 | 0 | |
| בקיצור | 0.14 | 0.21 | 0.48 | |

**AI also over-uses colloquial discourse particles** (AI/H ratio):

| particle | AI/H |
|---|---|
| רגע | 2.2× |
| בטח | 3.0× |
| יופי | 8.9× |
| וואו | 2.0× |
| פשוט | 1.7× |
| קצת | 1.75× |
| כי | 2.9× |

[marker-frequencies_marker_rates.tsv](marker-frequencies_marker_rates.tsv)

**English source of the tells (newer process).** 22,544 aligned EN→HE cue pairs from `scripts/onepace-translations/*.cues.json` + `*.he.json`:

| Hebrew | source share | English cue |
|---|---|---|
| אם כי | 24/25 | "though" |
| אכן | 12/15 | "Indeed" |
| אסיר תודה | 10/14 | "grateful" |
| ארור אתה | 4/7 | "Damn you" (+2 "curse") |
| על ידי | 36/36 | passive "by" |
| ובכן | 38/45 | "Well" |
| בכל אופן | 24/27 | "Anyway/In any case" |
| במקרה כזה | 8/8 | "In that case" |
| כלומר | 12/22 | "I mean/you mean" |
| הוצא/יוצא להורג | 4/4 | "be executed" |
| פשוט | 235/270 | "just" |
| רגע | 133/184 | "Wait" |
| יאללה | 14/24 | "let's/Here we go" |

### Inferences
- **Mechanism (my inference): a 1:1 discourse-marker dictionary.** Most remaining tells are fixed English→Hebrew mappings of discourse markers and stock phrases. Each choice is "correct" alone, but the uniform mapping produces a translated cadence:
  - Well→ובכן
  - Indeed→אכן
  - Though→אם כי
  - Anyway→בכל אופן
  - In that case→במקרה כזה
  - I mean→כלומר
  - Damn you→ארור אתה
  - Impossible!→לא ייתכן!
  - Understood→מובן
  - grateful→אסיר תודה
  - by→על ידי
  - just→פשוט
  - Wait→רגע
  - let's go→יאללה

  Lint rules should therefore be framed as "don't map X→Y by default", with a menu of alternatives.
- **The human's naturalness comes from:**
  - spoken curses and intensifiers (לעזאזל אתך, ממזר, חתיכת, בחיי, אשכרה)
  - analytic possessives
  - colloquial connectives (בגלל ש, בשביל, ככה, אין מצב)

  It does not come from youth slang. AI's יאללה over-use is a different, over-corrected tell, not a fix.
- **Discovery by frequency alone cannot find the user's flagged lines.** Most of them are single rare words or wrong idioms (ציווה, זנח, נוחה, נושם בעורף). That needs an external frequency baseline (OPUS) or a reader.

### Gaps
- The human corpus (24k bigram tokens) is too small for reliable bigram statistics: z-scores ≤ 2.9 for every AI-over bigram.
- I could not test "rare-lexeme" detection (AI words absent from a large spoken corpus) without the OPUS frequency list. That belongs to the parallel researcher.

---

## Q3. Which markers make reliable lint rules? Precision, recall proxy, proposed regexes

### Takeaway
- **16 rules reach ≥80% precision** in my 15–20-hit samples, with near-zero human rate (Tier A).
- **Together they flag:**
  - **1,819 hits in AI-main** (18.8/1k lines)
  - **196 in AI-fedew** (6.3/1k)
  - **6 in the 20 human files** (0.86/1k)
- **The recall proxy is low on the newer process.** Only **3 of 92** lines rewritten in the native-review commits contained any Tier A/B marker. Only **2 of the user's 8 example lines** are caught.
- **So lexical lint is a backlog cleaner for the old `main` corpus.** It is not a substitute for the blind-reader review on new episodes.

### Cited Findings
Rule rates per corpus: [marker-frequencies_lint_rules_rates.tsv](marker-frequencies_lint_rules_rates.tsv). Significance and per-fedew-arc rates: [marker-frequencies_lint_rules_significance.tsv](marker-frequencies_lint_rules_significance.tsv).
Precision = share of randomly sampled AI hits that I judge a native viewer would find bookish or odd **because of this item** (my judgment). Samples drawn with fixed seeds from all AI files.

**Tier A (≥80% precision, near-zero in human)**

| rule | regex (core; full in TSV) | HUMAN n (/1k) | AI-main (/1k) | AI-fedew (/1k) | G² | precision (my judgment) | false positives / exceptions |
|---|---|---|---|---|---|---|---|
| A01 האם (yes/no question particle) | `B0[וש]{0,2}האםB1` | 3 (0.43) | 698 (7.23) | 24 (0.77) | 55.7 | 19/20 | the human's 3 are introspective monologue: «האם בכלל ניפגש שוב?» (will we ever meet again?) |
| A02 אנא | `B0ו?אנאB1` | 0 | 112 (1.16) | 4 (0.13) | 12.3 | 17/20 | servants addressing nobility, or a proclamation |
| A03 עתה (זה עתה / לעת עתה / מעתה) | `B0ו?מ?עתהB1` | 0 | 78 (0.81) | 10 (0.32) | 9.4 | 20/20 | — |
| A04 ייתכן (incl. «לא ייתכן!», «האם ייתכן…?») | `B0[וש]{0,2}י?יתכןB1` | 0 | 68 (0.70) | 24 (0.77) | 9.8 | 16/20 | «ייתכן ש…» in a lab or scientist's report |
| A05 עליי/עלינו/עליך + inf (= must) | `B0ו?על(יי\|י\|יך\|ייך\|יו\|יה\|ינו\|יכם\|יהם) (?!pronoun)ל[א-ת]{2,}`, minus governing verbs/idioms | 0 | 85 (0.88) | 7 (0.23) | 9.8 | 15/20 raw; ≈15/17 after the exclusions | אוסר עליכם ל…, נגזר עליי ל…, מוטל עליי |
| A06 אכן | `B0ו?אכןB1` | 1 (0.14) | 118 (1.22) | 25 (0.80) | 9.2 | 17/20 | pompous character voice (Kinemon-type samurai) |
| A07 אינו/אינך/אינני… | `B0[ושכ]{0,3}אינ(ני\|ך\|ו\|ה\|נו\|כם\|כן\|ן\|ם)B1` | 1 (0.14) | 121 (1.25) | 12 (0.39) | 8.3 | 19/20 | official broadcast/announcement |
| A08 curse formula ארור אתה/את/אתם/שכמוך/שכמותך/תהיה, line-initial «ארור!» | see TSV | 0 | 75 (0.78) | 12 (0.39) | 9.3 | 15/15 | the adjective use («מפסידן ארור!») is human-acceptable, so it is split off to B07 |
| A09 כה (= so), עד כה | `B0ו?כהB1` | 0 | 45 (0.47) | 3 (0.10) | 5.1 | 20/20 | — |
| A11 לומר | `B0ו?ש?לומרB1` | 0 | 158 (1.64) | 21 (0.68) | 19.0 | 16/20 | «איך לומר את זה» is tolerable |
| A12 אם כי | `B0אם כיB1` | 0 | 55 (0.57) | 26 (0.84) | 8.6 | 19/20 | — (10 dangling at line end: «…, אם כי.») |
| A13 אולם (= however) | `B0ו?אולם` + `[,.…!?]`/end/word, excl. «אולם התענוגות/המשתה/המשפט» | 0 | 69 (0.71) | 1 (0.03) | 7.4 | 17/20 raw (3 were "hall"), ~all after the exclusion | — |
| A14 כעת | `B0ו?כעתB1` | 0 | 13 (0.13) | 2 (0.06) | 1.6 | 10/12 | narration/announcement |
| A15 אסיר/ת/י תודה | `B0אסיר(ת\|י\|ות)? תודהB1` | 0 | 29 (0.30) | 17 (0.55) | 4.9 | 14/15 | — |
| A17 לאחר (+ «לאחר מכן») | `B0ו?לאחרB1` | 1 (0.14) | 62 (0.64) | 3 (0.10) | 2.5 | 16/20 | flashback narrator; includes the hybrid error «לאחר כך» (4 hits) |
| A18 היזהר/היזהרו/הזהר | `B0ו?הי?זהר(ו\|י)?B1` | 0 | 33 (0.34) | 5 (0.16) | 4.0 | 13/15 | — |

**Tier B (50–79%: flag for review, do not auto-fix)**

| rule | HUMAN (/1k) | AI-main (/1k) | AI-fedew (/1k) | precision (my judgment) | comment |
|---|---|---|---|---|---|
| B01 על ידי (passive agent) | 0.72 | 2.46 | 1.51 | ~10/15 | the human uses some («נלכדתם על ידי פיראטים?»); flag density, prefer active voice |
| B02 ובכן | 1.72 | 4.37 | 2.09 | ~50% | the human uses it in 9/20 files; cap it, don't ban it |
| B03 בכל אופן | 0.14 | 0.43 | 1.19 | ~10/20 | EL04 parallel: human בכל מקרה |
| B04 במקרה כזה/זה | 0 | 0.39 | 0.29 | 8/12 | |
| B05 כלומר | 0 | 1.24 | 0.93 | ~10/20 | |
| B06 לכאן | 0.72 | 3.79 | 5.15 | ~50% | the human writes «בוא לכאן!» too |
| B07 ארור as adjective | 0.29 | 1.10 | 1.51 | ~40% | |
| B09 לאחר כך (hybrid error) | 0 | 2 hits | 2 hits | 4/4 | always wrong |
| B10 אנו (excl. Wano) | 0 | 0.21 | 0.03 | 9/15 | legitimate in proclamations, letters, news |
| B11 הוצא/יוצא/מוצא להורג (verb) | 0 | 0.24 | 0.16 | 9/15 | past «הוצא להורג» is news-standard; «להיות מוצא להורג» (3 hits) is the bad one |
| B12 «מובן.» as a whole reply | 0 | 0.76 | 0.13 | 14/20 | |
| B13 kinship/crew possessive suffixes (אבי, אביך, אמי, אחיו, חבריי, חבריו, אנשיי, מטרתו, ספינתו…) | 0.29 | 2.57 | 1.22 | 12/20 | fixed or vocative uses are fine |

**Rejected as lint rules** (low precision, or the human uses them as much or more):

| item | reason |
|---|---|
| מיד | ~5/20 odd; «אחזור מיד» is natural |
| גם אם | ~2/12 |
| יאללה | ~3/12 odd; forced slang, not bookish |
| תסתכל | 0/12 |
| פשוט | ~4/12; style cap at most |
| generic formal imperatives (75-form list: התחבא!, הסתלק!, סלח לי!, הנח לה!) | HUMAN 9.18/1k vs AI 8.13/6.28; AI actually uses more future-as-imperative forms (23.8 vs 18.2) |
| object-suffixed verbs | 0.04/1k: a non-issue |
| synthetic possessives in general | 106-form list, East Blue parity; see B13 for the useful subset |
| תודה לך | the human uses it 10× more |
| מה לעזאזל | human more |
| אני מצטער, אני מניח, אחרי הכל, זה הכל, הולך להיות | parity |
| ללא, עבור, כלפי, באמצעות, אף, מאשר, ביותר, מעולם (1.86 vs 2.36/2.06), מכיוון ש | parity or human more |

Precision samples were printed from `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/markers/sample.py` and `…/samp2.py` (session scratchpad).

**Representative AI hits** (Hebrew, gloss, natural alternative = my judgment):
- **A01**:
  - «האם הכל מוכן?» (Is everything ready?) → «הכל מוכן?»
  - «האם תשחרר אותם מהשעבוד?!» → «אתה תשחרר אותם?!»
- **A02**: «לופי, אנא מהר!» (Luffy, please hurry!) → «לופי, מהר!» / «לופי, בבקשה, תמהר!»
- **A03**: «זה עתה הגעתי» (I have just arrived) → «הרגע הגעתי» · «לעת עתה, בואו נמשיך» (for the time being, let's continue) → «בינתיים, בואו נמשיך»
- **A04**:
  - «לא ייתכן!» (Impossible!) → «אין מצב!» / «לא יכול להיות!»
  - «האם ייתכן…?» (Could it be…?) → «רגע, זה…?» / «יכול להיות ש…?»
- **A05**:
  - «עלינו לעזוב את הבירה» (we must leave the capital) → «אנחנו חייבים לעזוב את הבירה»
  - «מה עלי לעשות?!» → «מה אני אמור לעשות?!»
- **A06**: «אכן.» (Indeed.) → «נכון.» / «בדיוק.» / «כן.» · «הוא אכן גבר בעל עוצמה» (he is indeed a powerful man) → «הוא באמת חזק»
- **A07**:
  - «שום דבר אינו בלתי אפשרי» (nothing is impossible) → «שום דבר הוא לא בלתי אפשרי» / «אין דבר כזה בלתי אפשרי»
  - «אינך צריך להתנצל» → «אתה לא צריך להתנצל»
- **A08**: «ארור אתה!» / «ארור שכמוך!» (Damn you!) → «לעזאזל איתך!» (the human's choice, 17 hits) / «יא ממזר!» / «חתיכת…!»
- **A09**: «ניסיון כה עלוב» (so pathetic an attempt) → «ניסיון כל כך עלוב» · «עד כה» → «עד עכשיו» / «בינתיים»
- **A11**: «תקשיבו טוב למה שיש לי לומר!» → «…למה שיש לי להגיד!»
- **A12**:
  - «אם כי אין לי עיניים!» (though I have no eyes!) → «רק שאין לי עיניים!»
  - Dangling, a "though" calque: «אני לא מתכוון לעשות את זה, אם כי.» → «…אבל בכל זאת.» or restructure.
- **A13**: «אולם, היא כרגע נעדרת.» (However, she is currently absent.) → «אבל היא לא פה כרגע.»
- **A15**: «אני אסיר תודה!» → «תודה רבה!» / «אני ממש מודה לך!» · «תהיה אסיר תודה שאני לא הורג אותך» → «תגיד תודה שאני לא הורג אותך»
- **A17**: «נחזור לאחר שנפליג מסביב לעולם» → «נחזור אחרי שנפליג…» · «תשאיר את השטויות האלו לאחר כך!» → «…לאחר כך» is ungrammatical; use «אחר כך»
- **A18**: «היזהרו!» (Beware!) → «תיזהרו!» / «זהירות!»
- **B12**: «מובן.» (Understood.) → «הבנתי.» / «ברור.» / «קיבלתי.»
- **B13**: «תהיה בדיוק כמו אביך» (you'll be just like your father) → «…כמו אבא שלך» · «לופי וחבריו» → «לופי והחברים שלו»

**Recall proxies**
1. **The user's 8 example lines from the brief.** The Tier A/B rules catch **2 of 8**: «אני אסיר תודה לך» (A15) and «אייס הולך להיות מוצא להורג» (B11). They miss:
   - «כצפוי מכל כוחות הצי» (כצפוי: 4 hits fedew + 1 main, 0 human; too rare to rank)
   - «אבא ציווה…» (ציווה: 9 AI hits, 0 human)
   - «נושם בעורף» (wrong idiom, 1 hit)
   - «הבהלה הזאת ממש נוחה לנו» (collocation)
   - «לא פחות ממה שאפשר לצפות…» (calque structure)
   - «זנחתי את התואר» (4 main hits; the human has 1 זנח form)
2. **Native-review rewrites** ([marker-frequencies_native_review_pairs.tsv](marker-frequencies_native_review_pairs.tsv)). The before/after line pairs come from commits `a04d2aa` (MA_1 native review), `f42f8b0` (IM_7 native review plus 6 one-line calque fixes) and `14ba532`; 92 changed Hebrew lines in total. Only **3/92** "before" lines contained any Tier A/B marker, and 2 fixes removed one (A15 אסיר תודה, B11 passive execution). The rest are collocation or idiom problems, for example:
   - «באמת חשבתי שנגמר לנו» → «באמת חשבתי שהלך עלינו» (I thought we were done for)
   - «יצא לנו מזל הפעם» → «שיחק לנו המזל» (we got lucky)
   - «אה, זה מחזיר ימים!» → «אה, איזה זיכרונות!» (brings back memories)
   - «הרגש סוחב אתכם» → «אתם נסחפים» (you're getting carried away)
   - «אין בריחה» → «אין לאן לברוח» (no escape)
   - «על מה הממשלה חושבת?!» → «מה הממשלה חושבת לעצמה?!» (what is the government thinking)
   - «אל תהיי כזו בלתי סבירה» → «נו, אל תגזימי» (don't be unreasonable)

   Several fixes moved **toward** synthetic or formal forms in frozen phrases:
   - «אנשים שלי!» → «אנשיי!» (my men!, a rallying cry)
   - «שמנו המון אנשים על העקבות שלו» → «שלחנו המון אנשים בעקבותיו»
   - «סיכנה את החיים» → «סיכנה את חייה»
   - «תקראו לי ג'ינביי!» → «שמי ג'ינביי!»

   Caveat: these review decisions come from the AI blind-reader pipeline described in `scripts/onepace-translations/_NATIVE_REVIEW.txt`. They were committed by the user, but they are not certain to be his personal judgments.
3. **EL04 parallel** (old AI vs human, the same 319 cues): 13 aligned cues where the AI line had a marker from a broad list and the human line did not. Examples:
   - «על ידי מיזוג של כדורי קור וכדורי חום» → human «באמצעות שילוב של כדורים קרים וחמים»
   - «בכל אופן,» → «בכל מקרה,»
   - «למה לכל הרוחות עשית את זה?!» → «למה לעזאזל עשית את זה?!»
   - «פשוט תוותרו, פושעים ארורים!» → «וותרו כבר עכשיו, פושעים מקוללים!»
   - «ובכן, היה שינוי קל בתוכניות» → «טוב, היה שינוי קל בתוכנית»
   - «תכירי כאב כה עז» → «תדעי כאב כל כך נורא»
   - «עד כה הכול טוב!» → «בינתיים הכל הולך חלק!» (so far so good)
   - «אכן, הם קבוצת המתנקשים הראשית» → «הם בהחלט יחידת הרוצחים של הממשלה»
   - «זה פשוט לא ייתכן!» → «זה בלתי אפשרי!»
   - «ועכשיו הם הגיעו לכאן» → «ועכשיו הגיעו הנה»

### Inferences
- **Recommended implementation** (my proposal):
  - Tier A as a **warning lint with an auto-suggested replacement**, run on `subtitles/main/**` first.
  - Tier B as an **information-level density flag**, for example when an episode exceeds the human max of 5.4 Tier-A hits/1k, or has more than 3 על ידי, ובכן or לכאן per 100 lines.
  - Both should check the human rate and print it beside each hit, following the earlier lesson.
- **Frozen collocations must be allow-listed for B13**: בכל ליבי, מעומק ליבי, את חייו/חייה, בעקבותיו, בעיניי, לדעתי, לצערי, בחיי, and a leader's «אנשיי!». The human uses «מעומק ליבי», «מול עיניי» and «את חיינו», and the review pipeline restored «אנשיי!» and «בעקבותיו».
- **On new episodes, the remaining naturalness problems are idiomatic and collocational.** They are invisible to word lists, so the blind native-reader review stays the main tool there. The lint mostly pays off on the 257-episode backlog.

### Gaps
- Precision is one model's native-like judgment on 12–20 hits per rule, not the user's. Before turning a rule on, the user could confirm about 10 hits per rule.
- No large set of user-flagged lines exists beyond the 8 brief examples and the review commits, so true recall is unknown.

---

## Q4. Where is the problem concentrated?

### Takeaway
- **Tier-A density is roughly 20× human in AI-main and 5× human in AI-fedew** (per-episode medians 16.9 and 4.6 per 1k lines, against a human median of 0 and max of 5.4).
- **219/257 main episodes and 42/85 fedew episodes exceed the human maximum.**
- **The worst arcs are the older main-process ones with formal casts**: Reverie, Loguetown, Whisky Peak, Reverse Mountain, Skypiea, Wano.
- **The newest fedew arcs (Impel Down 1.8, Marineford 1.3) are at human level.**
- **האם alone is 38% of AI-main Tier-A hits.**

### Cited Findings
Per-episode data: [marker-frequencies_episode_density.tsv](marker-frequencies_episode_density.tsv). Per arc: [marker-frequencies_arc_density.tsv](marker-frequencies_arc_density.tsv).

**Per-episode Tier-A per 1k lines (episodes ≥100 lines):**

| corpus | episodes | p25 | median | p75 | max |
|---|---|---|---|---|---|
| HUMAN | 20 | 0 | 0 | 0 | 5.4 (Baratie 03: three introspective «האם») |
| AI-main | 256 | 9.3 | 16.9 | 26.5 | 55.2 |
| AI-fedew | 85 | 2.5 | 4.6 | 9.7 | 20.2 |

Pooled totals:
- **AI-main**: 1,819 Tier-A hits / 96,586 lines (18.8/1k); האם = 698 (38%).
- **AI-fedew**: 196 / 31,063 (6.3/1k); האם = 24 (12%).
- **HUMAN**: 6 / 6,974 (0.86/1k).

**Per arc, AI-main** (Tier-A per 1k):

| arc | per 1k |
|---|---|
| Reverie | 34.8 |
| Loguetown | 31.1 |
| Whisky Peak | 30.2 |
| Reverse Mountain | 28.3 |
| Skypiea (26 eps) | 27.7 |
| Wano (60 eps) | 22.6 |
| Cover Stories | 21.9 |
| Little Garden | 21.2 |
| Post War | 19.7 |
| Return to Sabaody | 19.2 |
| Drum Island | 18.7 |
| Water Seven | 18.6 |
| Alabasta | 18.3 |
| Enies Lobby (main, 9 eps) | 17.0 |
| Baratie (1 ep) | 16.5 |
| Whole Cake Island (39 eps) | 16.2 |
| Jaya | 12.4 |
| Arlong Park | 11.0 |
| Egghead (24 eps) | 8.4 |
| Syrup Village (1 ep) | 2.2 |
| Romance Dawn | 1.6 |
| Orange Town | 0.0 |

**AI-fedew**: Sabaody 8.8 · Thriller Bark 8.2 · Enies Lobby 7.5 · Post-Enies Lobby 7.1 · Amazon Lily 3.5 · Impel Down 1.8 · Marineford 1.3. **HUMAN arcs**: 0–3.3.

**Top 20 worst episodes** (Tier-A per 1k; ≥100 lines; the 9-line "Other/Opening" file is excluded; all AI-main):

| rank | episode | Tier-A hits / lines | per 1k | top rules |
|---|---|---|---|---|
| 1 | 32 Wano 27 | 17/308 | 55.2 | A01 ×6, A06 ×3, A02 ×3 |
| 2 | 32 Wano 22 | 14/281 | 49.8 | A01 ×6, A08 ×3, A02 ×2 |
| 3 | 31 Reverie 02 | 26/532 | 48.9 | A01 ×14, A02 ×5, A17 ×3 |
| 4 | 14 Skypiea 09 | 23/473 | 48.6 | A01 ×9, A07 ×3, A13 ×3 |
| 5 | 09 Whisky Peak 01 | 21/442 | 47.5 | A01 ×13 |
| 6 | 14 Skypiea 23 | 10/214 | 46.7 | A01 ×5 |
| 7 | 12 Alabasta 14 | 14/301 | 46.5 | A01 ×8, A18 ×2 |
| 8 | 32 Wano 10 | 17/375 | 45.3 | A01 ×4, A06 ×3, A05 ×2 |
| 9 | 12 Alabasta 15 | 15/334 | 44.9 | A01 ×4, A05 ×4, A07 ×2 |
| 10 | 14 Skypiea 19 | 15/336 | 44.6 | A01 ×8, A02 ×4 |
| 11 | 32 Wano 33 | 15/338 | 44.4 | A13 ×4, A02 ×3, A15 ×3 |
| 12 | 32 Wano 31 | 13/296 | 43.9 | A17 ×4, A13 ×4 |
| 13 | 14 Skypiea 15 | 18/416 | 43.3 | A01 ×9 |
| 14 | 14 Skypiea 10 | 8/185 | 43.2 | A01 ×5 |
| 15 | 32 Wano 20 | 20/463 | 43.2 | A01 ×7, A02 ×4 |
| 16 | 14 Skypiea 12 | 13/301 | 43.2 | A04 ×4, A01 ×4 |
| 17 | 32 Wano 35 | 17/396 | 42.9 | A01 ×10 |
| 18 | 07 Loguetown 03 | 22/522 | 42.2 | A01 ×10, A02 ×3, A11 ×3 |
| 19 | 32 Wano 19 | 16/387 | 41.3 | A01 ×10 |
| 20 | 32 Wano 29 | 11/277 | 39.7 | A01 ×6, A13 ×3 (Tier-B 50.5/1k, the highest) |

**Worst fedew episodes:**

| episode | Tier-A per 1k | top rules |
|---|---|---|
| Thriller Bark 13 | 20.2 | A11 ×2 |
| Sabaody 02 | 17.2 | |
| Sabaody 03 | 16.3 | |
| Post-Enies Lobby 02 | 16.0 | A11 ×4, A06 ×3 |
| Enies Lobby 21 | 15.6 | |
| Enies Lobby 05 | 15.5 | |
| Sabaody 07 | 15.3 | |
| Thriller Bark 01 | 15.1 | A12 ×5 |

### Inferences
- **Where to start (my inference):** a mechanical first pass over AI-main, removing האם and applying the A rules, would remove about 1,800 flagged spots. Start with Wano, Skypiea and Reverie episodes. Part of their density is in-character formality (samurai, priests, nobles), so A02, A06, A07 and A10 hits there need a "keep for voice" option. האם and לומר have no such excuse.
- **The very low AI-main East Blue density (Orange Town 0.0, Romance Dawn 1.6) is unexplained.** These files were in the same bulk commit `53ac8d6`. Perhaps an easier English source, perhaps a different batch. They are a cheap place to validate that the lint doesn't over-fire.

### Gaps
- Without speaker labels, density can't be normalized per character, for example "Kinemon may say אכן, Luffy may not".
- Git history doesn't show why the East Blue AI-main episodes are clean.

---

## Actionable rules for our translator (ranked by expected impact = AI-main excess × precision × volume)

1. **No question particle האם in dialogue.**
   - **Why unnatural**: spoken Hebrew marks yes/no questions by intonation and "?". האם is written or formal register. The AI-main rate is 7.23/1k vs human 0.43 (13×), and 698 hits make it the biggest single tell.
   - **Natural**: just drop it; optionally add a particle («…, נכון?», «רגע, …?», «מה, …?»).
   - **Example**: «האם הכל מוכן?» → «הכל מוכן?» · «האם זה אומר ש…?» → «זאת אומרת ש…?»
   - **Exception**: a rhetorical or introspective monologue (the human: «האם בכלל ניפגש שוב?»).
2. **"Damn you!" is not «ארור אתה / ארור שכמוך».**
   - **Why**: a literal Bible-register curse. It appears 75+12 times; the human uses 0 such formulas.
   - **Natural**: «לעזאזל איתך!» (the human's choice, 2.87/1k), «יא ממזר!», «חתיכת [noun]!», «שתישרף!» (my suggestion).
   - **Example**: «ארור שכמותך!» → «לעזאזל איתך!»
   - The adjective «[noun] ארור» is acceptable in moderation (the human writes «מפסידן ארור!»), but vary it: «מקולל», «מחורבן», «חתיכת…».
3. **Say «להגיד», not «לומר».**
   - **Why**: לומר is literary. Human 0 vs AI 1.40/1k; the human writes להגיד at 3.15/1k.
   - **Example**: «יש לי משהו לומר» → «יש לי משהו להגיד».
   - Fixed exceptions: «כלומר», «זאת אומרת», «אין מה לומר» (still prefer «אין מה להגיד»).
4. **"Indeed / Truly" is not «אכן».**
   - **Why**: written register. The source is 12/15 "Indeed".
   - **Natural**: «נכון.», «בדיוק.», «כן.», «באמת», «בהחלט» (the human uses בהחלט 4.3/1k).
   - **Example**: «אכן, הם קבוצת המתנקשים הראשית» → «הם בהחלט יחידת הרוצחים של הממשלה» (the human EL04 line).
   - **Exception**: deliberately archaic speakers.
5. **Negate with «לא», not «אינו/אינך/אינני».**
   - **Why**: the negative copula is formal written Hebrew (7× human).
   - **Example**: «המאמר הזה אינו אמין» → «הכתבה הזאת לא אמינה»; «אינך צריך להתנצל» → «אתה לא צריך להתנצל».
6. **"Please" is «בבקשה», not «אנא».**
   - **Why**: אנא is liturgical or formal (0 human, 1.16/1k AI-main).
   - **Example**: «אנא, אל תעשי את זה!» → «בבקשה, אל תעשי את זה!»
   - Use future-form imperatives: «בבקשה תחזרי», not «אנא חזרי».
7. **"Must" is not «עליי/עלינו/עליך + infinitive».**
   - **Natural**: «אני חייב / אנחנו צריכים / אתה חייב».
   - **Example**: «עלינו לעזוב את הבירה» → «אנחנו חייבים לעזוב את הבירה».
   - Not to be confused with «אוסר עליכם ל…» or «נגזר עליי».
8. **"Impossible! / Could it be…?" is not «לא ייתכן! / האם ייתכן…?».**
   - **Natural**: «אין מצב!», «לא יכול להיות!», «זה בלתי אפשרי!» (the human's choice in EL04), «רגע, זה…?», «יכול להיות ש…?».
   - This one is still elevated in fedew (0.77/1k), so it belongs in the translator's prompt now.
9. **«עתה / כעת / לאחר / כה / אולם / כלומר» → everyday equivalents.**

   | literary | everyday |
   |---|---|
   | זה עתה | הרגע |
   | לעת עתה | בינתיים / כרגע |
   | מעתה | מעכשיו |
   | כעת | עכשיו |
   | לאחר (מכן) | אחרי (זה) / ואז |
   | (never) «לאחר כך» | אחר כך |
   | כה | כל כך |
   | עד כה | עד עכשיו / בינתיים |
   | אולם, | אבל |
   | כלומר (in quick speech) | זאת אומרת / אני מתכוון / כאילו |

   - **Example**: «עד כה הכול טוב!» → «בינתיים הכל הולך חלק!» (the human EL04 line).
10. **"Though…" is not «אם כי».**
    - **Why**: 24/25 hits translate "though", including a sentence-final "though" that is ungrammatical in Hebrew.
    - **Natural**: «אבל», «רק ש…», «למרות ש…», or drop it.
    - **Example**: «אם כי אין לי עיניים!» → «רק שאין לי עיניים!»
11. **"Grateful" is not «אסיר תודה».** It is still 0.55/1k in fedew.
    - **Natural**: «תודה רבה», «אני ממש מודה לך», «אני חייב לך».
    - **Example**: «תהיה אסיר תודה ש…» → «תגיד תודה ש…».
    - **Note**: standalone «תודה לך.» is fine. The human uses it 10× more than AI, so don't over-apply the existing learnings rule (`docs/translation-learnings.md` l.69).
12. **Prefer the analytic possessive for family and crew in casual speech.**
    - **Natural**: «אבא שלך», «החברים שלו», «האנשים שלי», «הספינה שלו», not «אביך / חבריו / אנשיי / ספינתו».
    - **Why**: AI-main 2.57/1k vs human 0.29 for this subset; overall של+pronoun is 83.7 human vs 62.6 AI.
    - **Keep the synthetic form in frozen phrases**: «מעומק ליבי», «בכל ליבי», «את חייו», «בעקבותיו», «מול עיניי», a commander's «אנשיי!», and formal or royal speech.
13. **Don't translate English discourse markers 1:1** (review, don't ban).

    | English | AI default | alternatives |
    |---|---|---|
    | Well | ובכן | «טוב», «נו», «אז», or nothing (keep some ובכן; the human uses it) |
    | Anyway | בכל אופן | «בכל מקרה» |
    | In that case | במקרה כזה | «אם ככה», «אז» |
    | Understood | מובן | «הבנתי», «ברור», «קיבלתי» |
    | to here | לכאן | «הנה», «לפה» |
    | just | פשוט | often nothing, or «רק», «כבר» |
    | Let's go | יאללה | «קדימה», «בואו»; keep יאללה for street characters |
    | by (passive + על ידי) | | the active voice: «נחש בלע אתכם?», not «נאכלתם על ידי נחש?» |

14. **Execution and other passives: use the active, impersonal plural.**
    - «מוציאים את אייס להורג היום», not «אייס יוצא/מוצא להורג היום».
    - Past «הוצא להורג» is fine in news-like lines.
15. **Do NOT add rules against these.** The human uses them at the same or a higher rate:
    - «תודה לך», «מה לעזאזל», «אני מצטער», «אני מניח», «אחרי הכל», «זה הכל», «הולך להיות»
    - «ללא», «עבור», «כלפי», «באמצעות», «אף (=even)», «מאשר», «ביותר», «מעולם»
    - formal imperatives such as «התחבא!», «הסתלק!», «סלח לי!»
    - semi-formal adverbs such as «בוודאות», «מסוגל», «בתור»

    And don't force slang: סבבה, תכלס and וואלה are absent in the human, and AI's יאללה is already 13× too frequent. The human's colloquial colour comes from «לעזאזל איתך», «ממזר», «חתיכת», «בחיי», «אשכרה», «אין מצב», «ככה», «בגלל ש» and «בשביל».
