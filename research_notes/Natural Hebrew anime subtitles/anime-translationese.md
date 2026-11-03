# Anime translationese, relay translation via English, and our Hebrew

Scope: (a) what anime translators and AVT scholars say about Japanese stock phrases and literalism vs. localization; (b) what research says about pivot/relay subtitling via English; (c) the ~60 most frequent anime stock phrases in our One Pace English, how our Hebrew renders them now, and natural Hebrew per voice.

Data used for (c): 56 episodes that have both `scripts/onepace-translations/<ID>.cues.json` and `<ID>.he.json` (AM, IM, MA, SAB, TB, PEN, EL), giving 21,102 dialogue cues (styles Main, Thoughts, Flashbacks, Secondary and Narrator). I also used all 353 distinct Hebrew `.srt` files under `subtitles/` to compare marker rates in human-translated episodes (20 folders with a git-tracked ` He.ass`, 9,017 subtitle text lines) against AI ones (159,488 lines). The scripts are in `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/anime-translationese/scripts/` (`phrases.py`, `count.py`, `freq.py`, `dm.py`, `hemark.py`, `hvsai.py`, `hvsai2.py`). Every Hebrew naturalness call below is **my judgment** (an AI, not a native speaker) unless a source is cited, and the user should check it.

---

## Q1: What do the anime-translation community and AVT scholars say about Japanese stock phrases and literalism vs. localization?

### Takeaway
Fans, fansubbers and professional localizers all recognize a fixed set of Japanese-to-English "stock" renderings: *It can't be helped*, *As expected of…*, *I won't forgive you*, *Prepare yourself*, *Remember this!*, *Convenient*, *I'll be in your care*, *To think that…*. Each is grammatical English, but it is used far more often than real English speakers would use it. Professionals fix this by "deverbalizing" (working out what the line does in the scene) and rewriting for function and character voice. Our English source still carries many of these frozen renderings. Calqued into Hebrew, each one becomes a double layer of translationese.

### Cited Findings
- An anonymous /a/ (4chan-archive) thread lists the J→E phrases fans see as tells: "I'll be in your care (for 世話になる)", "It can't be helped... (for 仕方ない)", "You're x years too early!", "I won't forgive you!/This can't be forgiven! (for 許さない/許せない)", "Remember this! (for 覚えてろ)", "As expected (of X)! (for さすが)", "Prepare yourself! (for 覚悟)", "It's decided!", "Convenient (for specific usages of 都合が良い/好都合)", "You're an eyesore! (for 目障りだ)". The poster's diagnosis is frequency, not grammar: "native English speakers do not use it in the sheer frequency as it is used in J-E translated works". This is anonymous community opinion, not scholarship. — [Ganker archive, "Why are Localizers like this" (Nov 2024)](https://ganker.com/why-are-localizers-like-this-1000-777161/)
- The same thread notes that the intensity of くそ! varies with context, "the difference between 'dang it' … and 'God fricking dammit!'", so one fixed English curse word misrepresents it. — [Ganker archive (Nov 2024)](https://ganker.com/why-are-localizers-like-this-1000-777161/)
- The meme is common enough that a thread is titled with three of these phrases at once: ">It can't be helped. >As expected of... >To think that..." — [Ganker archive (Jan 2024)](https://ganker.com/it-cant-be-helped-as-expected-of-to-think-that-1000-685421/)
- Tofugu (Kanae Nakamine) calls "as expected" for さすが "a bit of oversimplification". さすが marks an outcome as *inevitable*: either admiration because the result matched a reputation, or a "contradictory" use where a reputation was defeated for an unavoidable reason. "There is no perfect translation"; translating it "is a matter of understanding whether it is complementary or contradictory, but also understanding the context." Its own paraphrases use "of course…" and "no wonder…". — [Tofugu, "さすが Is Not Always a Compliment" (2020)](https://www.tofugu.com/japanese/sasuga/)
- Learner references gloss さすが as "as expected of (A)" or "that is just like (A)", and さすがに / さすがの〜も as "even (A)". This explains why "As expected of X" turns up both for praise and for "even X couldn't…". — [Bunpro](https://bunpro.jp/grammar_points/%E3%81%95%E3%81%99%E3%81%8C); [TKG Learner's Dictionary](https://www.tkgje.jp/entries/00000/00359_sasuga.html)
- Professional anime translator Katrina Leonoudakis, as summarized from her talk slides: the goal is to give viewers "an equivalent experience to japanese viewers … by writing dialogue that sounds natural in the target language." The method is deverbalization followed by reformulation. Example: "just as i'd expect of a maou i chose" becomes "i knew i picked the right maou." This is a secondary account of her slides. — [Kay Toma, "lost in translation" Substack (2024)](https://lostintranslationhub.substack.com/p/how-translation-in-anime-is-done)
- In an interview Leonoudakis says she avoided borrowed Japanese terms ("'Big Brudder' wasn't perfect, but it worked, and I was happier with that than 'nii-nii'") but has "since learned to respect legacy terminology." — [Anime Corner interview, Tamara Lazic (Mar 2022)](https://animecorner.me/interview-translating-anime-with-katrina-leonoudakis/)
- ANN's Manga Answerman says overly literal translations "may be technically correct, but they may end up sounding slightly (or VERY) off". Voices "should sound natural and appropriate for their gender, age, and social context". Its example: modern teen Usagi "should sound distinctly different than the space pirates in Captain Harlock." — [Anime News Network, Manga Answerman (Oct 2018)](https://www.animenewsnetwork.com/answerman/2018-10-19/.138387)
- J-En Translations contrasts formal and functional equivalence (Nida): "Every translator goes through the 'but the Japanese says this' phrase." Their example is いただきます, which can become narrative action instead of a spoken formula. Reordering sentences "to make the meaning flow better" is fine. — [Jennifer O'Donnell, J-En Translations (Dec 2021)](https://j-entranslations.com/how-to-make-entertainment-translation-entertaining/)
- An industry translator (an ANN staffer turned game translator): "Translation is not just decoding words. It is creative writing, it is immersion, it is culture encoding." They put "fans who can't speak much Japanese but hold pride in what they know" among the worst translators. — [ANN forum, "What's Wrong With Fan Translations?" (Nov 2015)](https://www.animenewsnetwork.com/bbs/phpBB2/viewtopic.php?start=90&t=3026022)
- Frog-kun argues viewers should "discard the notion that translations are inherently inferior to the original": "If a translator has to change things around to make things work in your language, that's okay!" — [Frog-kun, "Translation Theory for Anime Fans" (2015)](https://frogkun.com/2015/08/23/translation-theory-for-anime-fans-how-to-critique-translation/)
- The literal-vs-localized argument "never came to an agreement" among fans. Groups like [gg] and Commie went heavily localized ("trollsubs"), partly in reaction to a literalist fansub culture. — [NEEM blog (Aug 2020)](https://neemblog.home.blog/2020/08/19/the-lost-art-of-fan-made-anime-trollsubs/)
- Counterpoint from the foreignizing camp: J-List's Peter Payne keeps -san/-chan/-senpai "because they're important markers for how the characters feel about each other." — [J-List blog (Mar 2023)](https://blog.jlist.com/your-friend-in-japan/why-do-fans-hate-bad-translations-in-anime-so-much/)
- A conference abstract on *Gin Tama* reports that official subtitles "prefer a domesticating strategy … to maintain target-language naturalness", while fansub audiences are "typically interested in Japanese language and culture". I saw only a search snippet. — [TAS 2025 abstract (via search snippet)](https://ss25.m.tas.currinda.com/schedule/session/1089/abstract/20217)

### Inferences
- (Mine) The phrases the community flags are exactly the ones whose English shape is already a compromise. "As expected of X" is a frozen gloss of さすが, not something English speakers say. A Hebrew translator working from the English cannot tell that, so it translates the gloss: «כמצופה מ…» ("as is expected of…", officialese), and the result is translationese twice over.
- (Mine) Hebrew has its own short functional equivalents. For さすが: «לא סתם…» ("not for nothing…"), «רואים ש…» ("you can tell…"), «איזה תותח!» ("what an ace!"), «מה ציפית?» ("what did you expect?"), «כיאה ל…» (formal, "as befits…"). The Leonoudakis example, which rebuilds the line around the speaker's attitude, is the model to follow.
- (Mine) The community view that "it's a frequency problem, not a grammar problem" matches the native reader's complaint: each line is "grammatical and understandable" but nothing an Israeli would say. Detection therefore has to be frequency-based: compare against human or native rates, not a grammar check. See Q3.

### Gaps
- I could not find first-hand style guides from GJM, Kaleido or Commie within budget. Search turned up only secondary accounts (NEEM, The Backloggers).
- I found no interview with a Crunchyroll, Funimation or Viz One Piece translator, and no source comparing the register of One Piece's English subs with its dub (for example "Pops" vs. "Old man" for Whitebeard's オヤジ).
- I found no One Pace subtitle style guide, so the English source's own localization policy is undocumented.

---

## Q2: What does research say about pivot/relay subtitling via English?

### Takeaway
Relay subtitling carries over the pivot's errors and the pivot language's own features, filters out the source culture's sociopragmatics (politeness, relationships, register, dialect), and tends to flatten style. Gottlieb's four pitfalls (1997) are the standard framing. The mitigations are annotated pivot templates (Netflix requires notes on register, tone, intent and relationships), checking against the original audio and visuals, and pivot-aware review. For us the dominant pitfall is #2, "transfer of relay-language features not acceptable in the target language". That is the bookish, English-shaped Hebrew problem.

### Cited Findings
- Gottlieb (1997) lists four pitfalls of relay subtitling: "1. Repetition of translation errors present in the relay-language subtitles, 2. Transfer of relay-language features not acceptable in the target language, 3. Transfer of segmentation incompatible with the target-language syntax, and 4. Transfer of subtitle layout and cueing that is inferior to national standards." — quoted in [Al Teneiji, "Culture in Relay Audio-Visual Translation" (2015)](https://doi.org/10.82366/453); also summarized in [Górska (2015), Transfer](https://doi.org/10.1344/transfer.2015.10.107-125)
- A 2024 overview restates these as "the propagation of errors present in the intermediary text, and transfer of features of the language of the intermediary text to the target language, as well as segmentation, layout, and cueing". It notes that empirical studies concentrate on "deviations from the original audiovisual product that are replicated or transferred because of the translators' overreliance on an English intermediary text." — [Pięta, Valdez, Menezes & Sokoli, "Indirect (pivot) audiovisual translation: a burning issue for research and training", *Perspectives* 32(5), 2024](https://scholarlypublications.universiteitleiden.nl/access/item%3A4177760/download) ([DOI](https://doi.org/10.1080/0907676X.2024.2374649))
- *Spirited Away* subtitled into Arabic via English: "culture divergence is almost inevitable in relay translation. The cultural loss is more significant than in direct translation. The end product of relay translation is a translation of the medium translation(s) rather than of the original text." — [Al Teneiji (2015)](https://doi.org/10.82366/453)
- Spanish anime fansubs made from English fansubs show English-induced errors: "A piece of concrete?" became Spanish "en concreto" (an English false friend), and "Heads or tails" became "Cabezas o colas". "If some translation errors are made when translating into English, these tend to be perpetuated when using the English text for the translation into other languages." The same paper notes that J→E fansub translators were often not native English speakers. — [Díaz Cintas & Muñoz Sánchez, "Fansubs: Audiovisual Translation in an Amateur Environment", JoSTrans 6 (2006)](https://www.jostrans.soap2.ch/issue06/art_diaz_munoz.php)
- In *Squid Game*'s Turkish subtitles via an English pivot, English "may have limitations in conveying the full range of sociopragmatic aspects present in the Korean discourse" and acts as "a dominant cultural filter". — [Dallı, "Pivot Subtitling on Netflix: The Case of Squid Game", *JAT* 7(1), 2024](https://jatjournal.org/index.php/jat/article/view/279)
- In *Terrace House* (Japanese → English template → Finnish), "the presence of a pivot template dictates what is translated and what details are important to convey". The Finnish translator had difficulty interpreting an English template "not created primarily for translator use"; the template "places an additional cultural layer between the source and target cultures, affecting localization choices"; and the "audiovisual context of the source text" was lost. — [Orava, BA thesis, University of Turku (2026)](https://www.utupub.fi/items/7fcc9f76-ac35-4db9-b155-63064f4acbfb/full)
- A Japanese anime dubbed into Finnish via Swedish (*Ginga Nagareboshi Gin*) had 199 source–target differences: 26% mistranslations and 25% omissions. 39% of the dialogue was translated literally from the Swedish. "The masculine language and the northern dialect were lost in the translation of the MT, and the TT followed these changes." In other words, character voice was flattened and then inherited. — [Borg, degree thesis, Dalarna University](https://du.diva-portal.org/smash/get/diva2:2032709/FULLTEXT01.pdf)
- Prior studies say pivot translation "tends to produce texts that are weaker in style and communication, contain numerous mistranslations, and lack linguistic richness". The author cautions that some loss is inherent and has to be measured against direct translation. — [Aleksandrowicz, *Babel* (2025), abstract](https://benjamins.com/catalog/babel.25012.ale)
- A counterpoint on anime specifically: indirect translation of anime into Catalan and Polish "enables access to otherwise unavailable content" and "under certain conditions, it can yield high-quality outcomes." — [Borodo, Cheetham & Martínez Sirés, "Indirect anime translations" (Routledge, 2026), abstract](https://doi.org/10.4324/9781003629177-7)
- When a TT draws on several sources (audio, English text, visuals), "defining the ST is a matter of perspective" ("compilative translation", from the Finnish *Digimon* opening). — [Haapaniemi & Ivaska (2026)](https://doi.org/10.1075/btl.169.02haa)
- Netflix's mitigation: "Annotations are expected in all templates". They must explain "Cultural references, Slang, Idioms, Jokes, … Sarcasm and irony, Register, Formality and class, Tone, Intent, Relationships between characters, Names or nicknames, Age …". Templates "do not need to be verbatim", and the template author should "not paraphrase". — [Netflix Timed Text Style Guide: Subtitle Templates](https://partnerhelp.netflixstudios.com/hc/en-us/articles/219375728-Timed-Text-Style-Guide-Subtitle-Templates)
- Hebrew-specific background: Weissbrod describes a long-standing norm of *elevated language* in literary translation into Hebrew ("Mock-Epic as a Byproduct of the Norm of Elevated Language", *Target*). I saw this only through a search summary and her publication list. — [Benjamins author page](https://benjamins.com/catalog/persons/15299); [Wikipedia: Rachel Weissbrod](https://en.wikipedia.org/wiki/Rachel_Weissbrod)
- A thesis studies "Effects of indirect translation Japanese–English–Spanish" in professional and amateur subtitles of *Carole & Tuesday*. I saw only the title. — [USACH repository](https://sic.usach.cl/entities/tesis/eed6bdee-5509-46f3-87a4-8e6ca5d59964)

### Inferences
- (Mine) Our workflow is the unannotated version of Netflix's pivot model. The One Pace English is a finished English subtitle track with its own localizations ("Pops", "Old man", Ivankov's "Vi'd", English idioms such as "pay the piper" and "push your luck"), not a template written for translators. Orava's finding about templates "not created primarily for translator use" applies to us directly.
- (Mine) Gottlieb's pitfall #2 accounts for most of the native reader's flags. English grammar and lexicon leak into the Hebrew:
  - passive future (אייס הולך להיות מוצא להורג, "Ace is going to be executed")
  - "grateful to you" (אסיר תודה לך)
  - discourse "Now," (עכשיו,) and "Well," (ובכן)
  - sentence-final "after all" (אחרי הכל)
  - "I see" (אני מבין)
  - "Very well" (טוב מאוד)
  - "this guy" (הבחור הזה)
- (Mine) The *Ginga* finding, where masculine speech and dialect were lost in the pivot and inherited downstream, is our "everyone sounds like the same narrator" risk. The English has already flattened Japanese speech registers such as 俺/貴様/てめぇ/じゃ/ござる, so Hebrew voice has to be rebuilt from the voice cards, not read off the English.
- (Mine) Weissbrod's elevated-language norm plausibly explains why a model trained on published translated Hebrew drifts to «אכן», «ובכן», «ארור», «כמצופה», «בלתי נסלח», «אוי ואבוי» and «ציווה». Translated Hebrew prose historically used that register. This is a hypothesis, not tested.
- (Mine) Practical mitigation is to rebuild the missing "annotation layer" ourselves. For each frequent English stock phrase, record (1) the Japanese function behind it and (2) a Hebrew menu by voice. That is the table in Q3. The second mitigation is to enforce the existing "read the Hebrew with the English closed" gate (skill gate 7.1).

### Gaps
- I found no study of anime relay translation into Hebrew.
- I could not read the full texts of Pięta et al. 2024, Aleksandrowicz 2025 or Orava 2026, so I have no error-type percentages from them.
- The brief mentions "Ivaska & Huuhtanen"; I could not locate that paper and found Haapaniemi & Ivaska 2026 instead.
- I found nothing on Hebrew subtitle register norms specifically. The Weissbrod claim is about literary translation.

---

## Q3: Stock phrases in our One Pace English: counts, current Hebrew, and natural Hebrew per voice

### Takeaway
In 56 aligned episodes (21,102 dialogue cues), the most frequent anime-isms are interjections and stock reactions:
- Hey: 400
- damn: 224
- please: 178
- Oh: 166
- Well,: 118
- Wait: 111
- Alright: 110
- No way: 104
- bastard: 97
- Man/man!: 96
- Old man: 83
- after all: 71
- Let's go: 60
- I see: 58
- Now,: 58

Most are already rendered naturally (היי, רגע, אין מצב, יופי, יאללה, אני סומך עליך). The bookish or literal renderings cluster in about 20 recurring patterns. Several of them have **zero or near-zero rates in the human-translated episodes but steady rates in AI episodes** (per 1,000 subtitle lines, human vs. AI):

| Marker | Human | AI |
|---|---|---|
| "as expected of" calque | 0 | 0.16 |
| "unforgivable" calque | 0 | 0.09 |
| "grateful" calque | 0 | 0.35 |
| "welcome back" formula | 0 | 0.12 |
| "big sister" vocative | 0.11 | 0.86 |
| "indeed" | 0.14 | 1.07 |
| "accursed" | 0.29 | 2.14 |
| "well" (formal) | 1.71 | 3.61 |
| discourse "Now," | 0.55 | 1.72 |
| "impossible!" | 0.14 | 0.53 |

The Hebrew forms behind these labels are listed under Cited Findings below. These markers can be detected by script across the whole corpus.

### Cited Findings (our repo; my own counts)
- English phrase counts in the 56 aligned episodes (regex, case-insensitive):
  - "as expected": 7
  - "expect no less / nothing less from": 5
  - "I knew it": 4
  - "after all": 71
  - "counting on": 11
  - "leave it/this/the rest to me/us": 18
  - "unforgivable": 10
  - "forgive you": 5
  - "prepare yourself/prepare to die": 4
  - "get ready": 9
  - "no way": 104
  - "impossible": 35
  - "it/that can't be": 16
  - "underestimat-": 17
  - "opponent": 3
  - "welcome back": 9
  - "damn/dammit": 224
  - "crap/shit": 23
  - "bastard(s)": 97
  - "interesting": 15
  - "no choice": 20
  - "can't be helped / no helping it": 5
  - line-initial "Alright": 110
  - line-initial "Hey/Oi": 400
  - "pops": 5
  - "old man": 83
  - "gramps": 6
  - "let's go": 60
  - "here I/we go / here goes": 13
  - "what did you say": 11
  - "what was that": 17
  - "this/that's bad": 32
  - "idiot": 71
  - "fool": 22
  - "thank goodness/god": 12
  - "what a/that's a relief": 9
  - "I see": 58
  - "is that so": 10
  - "to think": 21
  - "never thought": 15
  - line-initial "Wait": 111
  - "shut up": 53
  - "indeed": 22
  - "truly": 30
  - "very well": 18
  - line-initial "Well,": 118
  - line-initial "Now,": 58
  - line-initial "Oh": 166
  - "you guys": 116
  - "this/that/these/those guy(s)": 139
  - "good job/work, nice job/work, well done": 15
  - "don't be ridiculous/screw/mess with/joke": 12
  - "convenient": 5
  - "grateful/gratitude": 24
  - "move it / out of my way / step aside": 29
  - "take care": 37
  - "what do you mean": 16
  - "done for / it's over": 10
  - "just you wait / remember this": 4
  - "please": 178
  - "I'm sorry": 30
  - "forgive me": 13
  - "how dare": 22
  - "brat": 12
  - "big bro/sis": 21
  - "geez/jeez/sheesh": 15
  - "seriously": 28
  - "oh my / my, my": 8
  - "Hmph/Tch": 1 (the English source has almost removed these)
- How our Hebrew renders English discourse markers (first Hebrew word, 56 episodes):
  - "Well,": «טוב» 79 / «ובכן» 21 / «נו» 6
  - "Now,": «עכשיו» 50 of 58
  - "Oh,": «הו» 98 / «אה» 34 / «או» 14 / «אוי» 13
  - "Very well": «טוב מאוד» 3, otherwise «טוב» or «בסדר»
  - "I see": «אני מבין/ה» ~20 vs. «הבנתי» ~5
- Hebrew marker rates across all Hebrew SRTs, per 1,000 subtitle lines, human (20 folders) vs. AI. The first script counts joined subtitle blocks (7,005 human vs. 130,133 AI); the second counts physical lines (9,017 vs. 159,488). Treat the human figures as noisy because the sample is small.
  - «כמצופה/כצפוי» ("as is expected"): 0 vs 0.16–0.20
  - «בלתי נסלח / אין מחילה / לא ייסלח / אין סליחה» ("unforgivable"): 0 vs 0.18
  - «אסיר תודה» ("grateful"): 0 vs 0.35
  - «ברוך שובך / ברוכה השבה» ("welcome back", ceremonial): 0 vs 0.12–0.14
  - «כך זה» ("thus it is"): 0 vs 0.15
  - «אוי ואבוי» ("oh woe"): 0 vs 0.10
  - «לא ציפיתי לפחות» ("I expected no less"): 0 vs 0.03
  - «אחות/אח גדול(ה)» as a vocative ("Big Sis/Bro"): 0.11 vs 0.86 (137 AI lines)
  - «אכן» ("indeed"): 0.14 vs 1.07
  - «ארור/ה» ("accursed"): 0.29 vs 2.14
  - «מנוול» ("scoundrel"): 0.29 vs 0.89
  - «ובכן» ("well then", formal): 1.71 vs 3.61
  - line-initial «עכשיו,» ("Now,"): 0.55 vs 1.72
  - «בלתי אפשרי!» ("impossible!"): 0.14 vs 0.53
  - «לעולם לא» ("never ever"): 1.00 vs 2.08
  - «שכמוך» ("you X, you"): 0.57 vs 0.89
  - **The human gold over-uses some markers itself:** «הו,» ("Oh,") 5.85 vs 1.95; «לעזאזל» 17.13 vs 9.66; «הבחור הזה» ("this guy") 2.57 vs 1.81; «הנה זה/אני בא» 1.00 vs 0.34; «עבודה טובה» ("good job") 0.57 vs 0.18; «זה רע!» 0.71 vs 0.68.
  - The human gold uses some spoken markers more than the AI: «אין מצב» 3.14 vs 1.45; «חתיכת…» 2.14 vs 0.49; «כמו שחשבתי» 0.57 vs 0.13.
  - The AI uses «יאללה» more (1.55 vs 0.14).
  - The Israeli vocative «יא + insult» is near-absent in both (0 vs 0.07).
- Possible typo, not a register issue: AM_2:347 «אל תתחספפי!» ("Don't get cocky!") is not a Hebrew word. It is probably meant to be «אל תתחצפי!» ("don't be cheeky").

### Inferences
- (Mine) **The human gold (That One Gerbil) is itself a fan relay translation from English and is not a clean naturalness benchmark.** Its high «הו,», «לעזאזל», «הבחור הזה» and «עבודה טובה» rates are English tells too. Use it as the gold for agreement, terminology and attack names. For register, use the native reader's flags plus the markers where AI ≫ human.
- (Mine) The 8 native fixes in the brief fall into six patterns, and each predicts more hits:
  1. **English idiom/metaphor calque**: «מחזיר ימים» ("takes me back"); «הרגש סוחב אתכם» ("your emotions are carrying you away").
  2. **English grammar calque**: passive future «הולך להיות מוצא להורג»; «נגמר לנו» ("we're done for").
  3. **Dictionary-first verb or adjective that lands in a literary register**: «זנחתי» ("abandoned") instead of «ויתרתי»; «אסיר תודה» instead of «מודה»; and from the unreviewed lines, «ציווה» ("commanded", biblical).
  4. **Collocation miss**: «יצא לנו מזל» instead of «שיחק לנו המזל»; «נושם בעורף» instead of «נושף בעורף».
  5. **Proverb literalism**: 窮鼠猫を噛む → "a cornered rat is a scary thing" → «עכבר לכוד הוא דבר מפחיד», instead of a Hebrew proverb-like «גם עכבר בפינה יכול לנשוך».
  6. **Frozen Japanese stock phrases via English**: «כצפוי מ…» (さすが); «תתכונן לקראתי» (覚悟/"Get ready for me"); «הבהלה … נוחה לנו» (都合がいい "convenient").
- (Mine) Fixes for the brief's six unreviewed lines:
  - «כצפוי מכל כוחות הצי.» (Iva: "Vi'd expect no less from the Navy's full force") → «נו, זה הצי במלוא כוחו.» ("Well, it's the Navy at full strength.") or «ברור, זה כל הצי.» ("Sure, it's the whole Navy.")
  - «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר לשמור על אח של אייס בחיים!» ("Pops said to keep Ace's brother alive!") or «פקודה של אבא: האח של אייס נשאר בחיים!» ("Pops's orders: Ace's brother stays alive!")
  - «שליט הגיהנום כבר נושם בעורף.» (EN "The boss of Hell is just around the corner") → «מלך הגיהנום כבר נושף לנו בעורף.» ("The king of Hell is already breathing down our necks.") or «בוס הגיהנום ממש מאחורינו.» ("Hell's boss is right behind us.")
  - «הבהלה הזאת ממש נוחה לנו.» → «כל הבלגן הזה רק משחק לטובתנו.» ("All this mess just plays in our favor.")
  - «תתכונן לקראתי, עולם!» → «עולם, הנה אני בא!» ("World, here I come!", an established Hebrew pattern)
  - «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» → «לא סתם הוא הפליג עם מלך הפיראטים!» ("Not for nothing did he sail with the Pirate King!")
- (Mine) **Detection across ~340 episodes.** A frequency lexicon works because these markers are rare in natural speech, rarer in the human gold, and steady in AI output.
  - Two layers: (1) a **Hebrew-side marker list** (the entries above where AI ≫ human, plus the native-flagged collocations); (2) an **English-side trigger list** (as expected, no less from, unforgivable, forgive you, prepare, get ready for me, opponent, very well, line-initial Now/Well, sentence-final after all, I see, is that so, to think, come to think of it, convenient, grateful/gratitude, big sis/bro, welcome back, what was that, don't be ridiculous, this guy, oh my, takes me back, ordered).
  - Flag only when an English trigger is present **and** the Hebrew contains the matching calque. Requiring both keeps false positives low.
  - Formal-voice speakers should be whitelisted per character, from the voice cards.

### The stock-phrase table: what to say instead, by voice
Format: **English (likely Japanese)**: count in our 56 episodes. *Ours now* = typical current Hebrew. *Verdict* is mine. Alternatives are given as **formal** (old warrior or official: Jinbe, Rayleigh, Kuma, Sengoku, Hancock in court), **neutral**, and **rough** (street brawler or pirate: Zoro, Franky, Ace, Kidd, Buggy's men). Theatrical villains (Moria, Hogback, Absalom, Buggy, Ivankov) may borrow the formal or "high" form deliberately as a character trait.

**A. High-impact calques (fix these first)**
1. **"As expected of X!" / "I'd expect no less from X" / "Nothing less from…" (さすが)**: 12.
   - *Ours now*: «כמצופה מ…» ×4, «כצפוי מ…» ×3, «לא ציפיתי לפחות מ…» ×3, «בדיוק כמו שציפינו מ…» ×2.
   - *Verdict*: officialese calque ("as is anticipated of").
   - Formal: «כיאה לנסיכת הרפאים!» ("as befits the Ghost Princess!"); «ראוי לשמו.» ("worthy of his name").
   - Neutral: «לא סתם קוראים לה נסיכת הרפאים!» ("not for nothing she's called…"); «רואים שזה צוות כובע הקש.» ("you can tell it's the Straw Hats").
   - Rough or cheering: «איזה תותחים!» ("what aces!"); «נסיכת הרפאים, אין עלייך!» ("Ghost Princess, you're the best!").
   - Contradictory or inevitable さすが (Zoro, TB_20:377 "And as expected, I can no longer move"): «וכמו שחשבתי, אני כבר לא מסוגל לזוז.» ("and as I figured, I can't move anymore").
   - Kuma (TB_20:425, "As expected from your son, / Dragon."): «הוא באמת הבן שלך, / דראגון.» ("he really is your son").
2. **"Unforgivable!" / "I won't forgive you!" (許さない/許せねぇ)**: 15.
   - *Ours now*: «זה בלתי נסלח!» ×5, «אין מחילה…», «אין סליחה!», «זה לא ייסלח!», «לא אסלח לך!».
   - *Verdict*: Hebrew anger is not about forgiveness. «בלתי נסלח» and «אין מחילה» are literary.
   - Formal or villain: «על זה תשלם ביוקר!» ("you'll pay dearly for this").
   - Neutral: «זה עבר כל גבול!» ("that crossed every line"); «זה לא יעבור בשקט!» ("this won't go quietly").
   - Rough: «אתה תשלם על זה!» ("you'll pay for this"); «אתה גמור!» ("you're finished").
   - Comic mob chanting (TB_16 zombies): «חוצפה!» ("outrage!"); «שערורייה!» ("scandal!").
   - **Keep** «לא הייתי סולח לעצמי» ("I'd never forgive myself"). That one is natural.
3. **"Prepare yourself!" / "Prepare to die!" / "Get ready for me, X!" (覚悟しろ)**: 4 (+9 "get ready").
   - *Ours now*: «תתכונן!», «התכונני למות!», «תתכונן לקראתי, עולם!».
   - *Verdict*: «התכונן למות» and «תתכונן לקראתי» are calques. "Get ready!" as an actual instruction to the crew («תתכוננו!») is fine.
   - Formal: «הכן את עצמך!» ("ready yourself", theatrical); «הגיע סופך.» ("your end has come").
   - Neutral: «עכשיו אתה בצרות!» ("now you're in trouble"); «תיזהר!».
   - Rough: «הלך עליך!» ("you're done for"); «אתה גמור!».
   - "Get ready for me, world!" → «עולם, הנה אני בא!» ("World, here I come!").
4. **"I'll be your opponent" (相手は俺だ)**: 3.
   - *Ours now*: «אני אהיה היריב שלך!».
   - *Verdict*: calque.
   - Formal: «אני אעמוד מולך.» ("I will face you").
   - Neutral: «היריב שלך זה אני!» ("your opponent is me", focus-first, natural).
   - Rough: «אתה מתעסק איתי עכשיו!» ("you're dealing with me now"); «אתה נגדי!» ("you're against me").
5. **"Big Sis!" / "Big Bro!" (姉様/兄貴/アニキ)**: 21 (137 AI lines corpus-wide).
   - *Ours now*: «אחות גדולה!», «אח גדול!».
   - *Verdict*: vocative calque. Hebrew doesn't address siblings by birth order, and «אח גדול» also evokes the TV show «האח הגדול» ("Big Brother").
   - Formal (Kuja to Hancock): «אחותי!» ("my sister!"); «אחותי היקרה!» ("my dear sister").
   - Neutral: the name.
   - Rough (henchmen to a boss "Aniki"): «בוס!»; «אחי!».
6. **"I'm grateful" / "You have our gratitude" / "Be grateful!" (恩に着る/感謝する)**: 24.
   - *Ours now*: «אנחנו אסירות תודה» (AM_4:166), «אני אסיר תודה» (IM_7:460–461), «תהיו אסירי תודה, טיפשים!» (IM_2:366).
   - *Verdict*: already flagged by the native reader, yet still present.
   - Formal: «תודה לך מכל הלב.» ("thank you with all my heart"); «אני חב לך.» ("I'm in your debt").
   - Neutral: «תודה רבה!»; «אני חייב לך אחת.» ("I owe you one").
   - Rough (Buggy): «תגידו תודה, טמבלים!» ("say thank you, dummies!").
7. **"To think that…" / "I never thought…" / "Who'd have thought" (まさか…とは)**: 39.
   - *Ours now*: «לחשוב ש…» ×8, «מעולם לא חשבתי ש…» ×5, «עוצר לי את הנשימה לחשוב ש…», «מטריד לחשוב ש…».
   - *Verdict*: the exclamative «לחשוב ש…» is a calque.
   - Formal: «מי היה מאמין ש…» ("who'd have believed…").
   - Neutral: «לא ייאמן ש…» ("unbelievable that…"); «אני לא מאמין ש…».
   - Rough: «בחיים לא חשבתי ש…» ("never in my life did I think…"); «וואלה, …».
   - Drop «מעולם» in casual speech: «לא חשבתי ש…».
8. **"Come to think of it" (そういえば)**: ~12.
   - *Ours now*: «אם לחשוב על זה», «כשחושבים על זה», and sometimes «רגע, בעצם» (good).
   - Neutral: «רגע, בעצם…» ("wait, actually…"); «אגב,…» ("by the way").
   - Formal: «עכשיו כשאני חושב על זה,…».
9. **"Now, …" / "Now then" (さあ/さて)**, discourse use, not time: 58.
   - *Ours now*: «עכשיו,» ×41.
   - *Verdict*: an English discourse marker turned into a time adverb (AI 3× the human rate).
   - Instead: «טוב,», «נו,», «יאללה,», «מהר,», or drop it. Examples: «עכשיו, תתחבא מתחת לגלימה שלי» → «מהר, תתחבא מתחת לגלימה!» ("quick, hide under my cloak!"); «עכשיו, תגידו את השם…» → «נו, תגידו את השם…».
10. **"Well, …" (まあ/さて)**: 118.
    - *Ours now*: «טוב,» ×79 (good), «ובכן» ×21.
    - *Verdict*: «ובכן» is literary (AI 2× human). Reserve it for butlers, officials and theatrical villains.
    - Neutral: «טוב,»; «נו,»; «אז…»; «תראה,».
11. **"…, after all" (やっぱり / reason-giving から)**: 71.
    - *Ours now*: sentence-final «אחרי הכל» ×13; «בכל זאת» at the end of the sentence.
    - *Verdict*: sentence-final placement is English. Note that learnings §1.5 does *not* ban the phrase itself.
    - Reason-giving: put «הרי» first, e.g. «שערי הצדק לא ייפתחו לספינת פיראטים, אחרי הכל.» → «הרי שערי הצדק לא נפתחים לספינת פיראטים.» ("the Gates of Justice don't open for pirate ships, you know").
    - "Turns out" (やっぱり): «בסוף…»; «אז בכל זאת…»; «אז באמת…».
12. **"Very well." (よかろう/承知した/いいだろう)**: 18.
    - *Ours now*: «טוב מאוד…» ×3.
    - *Verdict*: in Hebrew «טוב מאוד» is praise ("very good"). It works when acknowledging good news (IM_10:173, cannons repaired) but not for acquiescence.
    - Formal: «כרצונך.» ("as you wish"); «מקובל עליי.» ("acceptable to me"); «בסדר גמור.».
    - Neutral: «בסדר.»; «טוב.»; «נו, טוב.».
13. **"I see." (なるほど/そうか)**: 58.
    - *Ours now*: «אני מבין.» ×~18, «הבנתי» ×~5.
    - *Verdict*: a standalone «אני מבין.» is a dubbing/subtitle tell.
    - Formal: «מובן.» ("understood").
    - Neutral: «הבנתי.»; «אה, ככה.» ("oh, like that"); «אז ככה זה.».
    - Rough: «אוקיי.»; «אהה.».
    - そうか with emotional weight: «כן…»; «אז ככה…».
14. **"Is that so?" / "So that's how it is" (そうか/そうなのか)**: 19.
    - *Ours now*: «באמת?» (good), «אז ככה זה?» (good), «כך זה?» ×2 (bookish).
    - Neutral: «אה, ככה?»; «באמת?»; «אז זה הקטע?» ("so that's the deal?").
15. **"Convenient" (都合がいい/好都合)**: 5.
    - *Ours now*: «הבהלה הזאת ממש נוחה לנו», «כמה נוח».
    - *Verdict*: «נוח» for a *situation* is a calque. It is on the community's tell list.
    - Neutral: «זה משחק לטובתנו» ("it plays in our favor"); «בדיוק מה שהיינו צריכים» ("just what we needed").
    - Rough: «נפל לנו בול» ("landed right for us").
16. **"Don't be ridiculous!" / "Don't screw with me!" (ふざけるな)**: 12.
    - *Ours now*: «אל תהיה מגוחך!» ×4.
    - *Verdict*: calque.
    - Formal: «אל תתבדח איתי.» ("don't jest with me").
    - Neutral: «די עם השטויות!» ("enough with the nonsense"); «אל תצחיק אותי!» ("don't make me laugh").
    - Rough: «אתה צוחק עליי?!» ("are you kidding me?!"); «מה אתה מקשקש?!» ("what are you babbling?!").
17. **"What was that?!" as a challenge to an insult (何だと)**: 17.
    - *Ours now*: «מה זה היה?!».
    - *Verdict*: fine when it's about a noise or event; a calque when it means "say that again".
    - Rough: «מה אמרת?!»; «תחזור על זה!» ("say that again!"); «סליחה?!».
18. **"Takes me back" / "Brings back memories" (懐かしい)**: 3.
    - *Ours now*: «זה מחזיר לי זיכרונות…», «ימים רחוקים…» (MA_6:33, bookish), «אה, איזה זיכרונות!» (good).
    - Neutral: «איזה זיכרונות!» ("what memories!"); «כמה זמן לא ראיתי את זה!».
19. **"Old man ordered…" / "…ordered us to" (命令)**.
    - *Ours now*: «אבא ציווה…» (biblical "commanded").
    - Neutral: «אבא אמר…»; «אבא ביקש…»; «פקודה של אבא:…».
20. **"Oh my!" / "Oh dear" (あらあら/まあ)**: 8.
    - *Ours now*: «אוי ואבוי!» ×5.
    - *Verdict*: old-fashioned. Fine for elder Nyon.
    - Young Kuja: «וואי!»; «אוי!»; «אלוהים!». Example: «אוי ואבוי. איזו שפה גסה.» → «אוי, איזו שפה גסה.».

**B. Frequent, mostly fine, but watch the voice**
21. **"No way!" / "It can't be!" / "Impossible!" (まさか/馬鹿な/ありえない)**: 155.
    - *Ours now*: «אין מצב!» ~40 (good), «בלתי אפשרי!» ~10, «לא ייתכן», «לא יכול להיות».
    - *Verdict*: an exclamatory «בלתי אפשרי!» is stiff (AI 4× human).
    - Formal: «לא ייתכן!».
    - Neutral: «לא יכול להיות!»; «אני לא מאמין!».
    - Rough: «אין מצב!»; «אין סיכוי!».
22. **"Damn (it)!" (くそ/ちくしょう)**: 224.
    - *Ours now*: «לעזאזל!» about 75% of the short lines.
    - *Verdict*: keep «לעזאזל» as the house default, but vary by voice: «שיט!» (rough); «אוף!» (frustrated: Nami, Usopp); «אוי לא!» (dismay).
    - Fix these calques: «לעזאזל אותך!» (ungrammatical) → «לך לעזאזל!»; «לעזאזל ברתולומיו קומא!» → «שיילך לעזאזל, הקומא הזה!» ("to hell with that Kuma"); «לעזאזל, גבר!» → «לך לעזאזל, בנאדם!».
23. **"damn X" as an adjective**.
    - *Ours now*: «פלמינגו ארור», «מפלצת ארורה» («ארור» AI 7× human).
    - Rough: «פלמינגו מחורבן» ("crappy flamingo"); «מפלצת דפוקה»; «יא מפלצת!».
    - Keep «ארור» for theatrical villains.
24. **"You bastard!" (てめぇ/貴様/この野郎)**: 97.
    - *Ours now*: «מנוול!», «מנוול שכמוך!», «ממזר!».
    - *Verdict*: «X שכמוך» is a literary set pattern, fine for villains and formal anger.
    - Rough Israeli: «יא מנוול!»; «חתיכת מנוול!» ("piece of a scoundrel"); «יא ממזר!». The human gold uses «חתיכת» 4× more; neither uses «יא».
    - てめぇ is often just a rude "you": «היי, מנוול! מי אתה?!» → «ה, אתה! מי אתה בכלל?!».
25. **"This guy / that guy" (こいつ/あいつ)**: 139.
    - *Ours now*: «הבחור הזה» (corpus 248 lines).
    - *Verdict*: こいつ is a pronoun.
    - Neutral: «הוא»; «זה».
    - Rough: «הטיפוס הזה» ("this character"). Example: «הבחור הזה מסוכן!» → «הוא מסוכן!».
    - Formal: «האיש הזה».
26. **"This is bad!" / "Not good" (まずい/やばい/大変だ)**: 37.
    - *Ours now*: «זה רע!» ×8, «רע מאוד!» ×2, «זה לא טוב!» ×6.
    - *Verdict*: learnings §1.5 already says «זה רע» → «זה לא טוב», but it persists.
    - Neutral: «זה לא טוב!»; «אוי לא!»; «יש לנו בעיה!».
    - Rough: «אנחנו בצרות!»; «הלך עלינו!» (when doomed).
27. **"Thank goodness" / "What a relief" (よかった/助かった)**: 21.
    - *Ours now*: «תודה לאל!» ×6, «איזו הקלה!» ×5.
    - *Verdict*: «איזו הקלה!» calques "what a relief".
    - Neutral: «איזה מזל!» ("what luck!"); «פיו!»; «טוב שבאת!».
    - よかった about a person: «איזה מזל שאת בסדר!» ("so lucky you're OK").
28. **"Good job / Well done / Good work" (よくやった/お疲れ)**: 15.
    - *Ours now*: «כל הכבוד» (good), «עבודה טובה» ×2.
    - Neutral: «כל הכבוד!»; «יפה מאוד!».
    - Rough: «אחלה!»; «תותח!» ("ace!").
    - Formal or boss: «יפה עבדתם.» ("you worked well"). Example: Nami's «ברוכים השבים! עבודה טובה!» → «חזרתם! כל הכבוד!».
29. **"Welcome back!" (おかえり)**: 9.
    - *Ours now*: «ברוכה השבה» ×5, «ברוך שובך» ×2, «ברוכים השבים».
    - *Verdict*: fine for the Kuja court's ceremony; ceremonial in casual scenes.
    - Neutral: «חזרתם!»; «הנה אתם!»; «איך היה?». Example: Shakky to Rayleigh, «הו, אדון ריי, ברוך שובך» → «אה, ריי, חזרת.».
30. **"Leave it to me!" (任せろ)**: 18.
    - *Ours now*: «סמוך עלי!» ×6, «עלי!» ×2 (good), «תשאיר את זה לי» ×7.
    - *Verdict*: «תשאיר את זה לי» is fine but calque-flavored.
    - Neutral: «עליי!»; «זה עליי»; «אני מטפל בזה»; «את השאר אני לוקח» (good, IM_9:156).
31. **"I'm counting on you" (頼んだ)**: 11.
    - *Ours now*: «אני סומך עליך», «אנחנו איתך» (good).
    - Keep. Rough option: «אל תאכזב!» ("don't let me down").
32. **"Don't underestimate me / Don't look down on me" (なめるな)**: 19.
    - *Ours now*: «אל תזלזל בי» (fine).
    - Rough: «אל תתעסק איתי!»; «מי אתה חושב שאתה?!».
    - "Don't get cocky" (調子に乗るな): *ours now* «אל תהיה שחצן!» / «אל תהיו יהירים» (stiff) → «אל תתלהב!»; «אל תתחצף!»; «אל תשוויץ!».
33. **"It can't be helped" / "No choice" (仕方ない/しょうがない)**: 25.
    - *Ours now*: «אין מה לעשות», «מה לעשות…», «אין ברירה» (all good), «אני חושש שאין שום דבר שאני יכול לעשות!» (calque).
    - Prefer short forms: «אין ברירה, בורחים!»; «אין לי מה לעשות.».
    - Watch the heavy «אין לנו ברירה אלא ל…».
34. **"Interesting…" (面白い)**: 15.
    - *Ours now*: «מעניין».
    - Zoro's dry «מעניין.» works.
    - Excited fighter: «עכשיו זה מתחיל להיות מעניין!»; «אהבתי!» ("I like it!").
35. **"Alright!" / "Right!" (よし)**: 110.
    - *Ours now*: «יופי!», «טוב!», «יש!», «בסדר!» (good).
    - Watch «נכון!» for よし ("Right! I'll handle it" → «נכון! אני מטפל בזה!» means "Correct!"). Use «טוב!»; «סגור!» ("deal!"); «יאללה!».
36. **"Hey!" (おい)**: 400.
    - *Ours now*: «היי!» (fine).
    - An indignant "Hey!" can be «הלו!».
37. **"Old man!" (Whitebeard: オヤジ)**: 83.
    - *Ours now*: «אבא!» (correct, matches his crew's "Pops").
    - "Old man" said to a stranger (おっさん) and Luffy's "Pops" to Rayleigh: *ours now* «זקן!».
    - (My judgment) Israelis address an unfamiliar older man as «דוד!» ("uncle", friendly) or «אדוני» (polite). «זקן!» reads rude. Keep it only for deliberate rudeness.
    - "Gramps" (じいちゃん) → «סבא» (good).
38. **"Let's go!" (行くぞ/行こう)**: 60.
    - *Ours now*: «קדימה!», «יאללה!», «בואו נזוז!» (good).
    - "…, men!" → «חבר'ה!»; «כולם!»; Marines «חיילים!». Avoid «אנשים!» as a war-cry vocative.
39. **"Here I go / Here goes / Here I come" (行くぞ)**: 13.
    - *Ours now*: «הנה זה בא!», «הנה אני בא!», «יאללה, מתחילים!».
    - Acceptable; the human gold uses it more than the AI.
    - Self-encouragement: «הולך על זה!» ("going for it!").
40. **"What did you say?!" (何だと)**: 11.
    - *Ours now*: «מה אמרת?!» (good).
41. **"Idiot! / Fool!" (バカ)**: 93.
    - *Ours now*: «טמבל», «טיפש», «אידיוט», «מטומטם» (fine).
    - By voice: «טמבל» (light, e.g. Nami to Luffy); «מטומטם» or «אידיוט» (rough); avoid «שוטה» except for comic samurai.
42. **"Shut up!" (黙れ/うるさい)**: 53.
    - *Ours now*: «שתוק!», «שקט!» (good).
    - うるさい = "you're annoying / leave me alone": «די!»; «עזוב אותי!»; rough «תסתום!».
43. **"Wait!" (待て)**: 111.
    - *Ours now*: «רגע!», «חכה!» (good).
44. **"Indeed" / "Truly" (確かに/まさに/実に)**: 52.
    - *Ours now*: «אכן» (AI 7.6× human), «באמת», «בהחלט».
    - *Verdict*: «אכן» is for formal voices only.
    - Neutral: «נכון»; «בדיוק»; «באמת».
    - Rough: «לגמרי»; «ממש».
45. **"You guys" (お前ら)**: 116.
    - *Ours now*: «חבר'ה!», «אתם!» (fine).
46. **"Move it! / Out of my way!" (どけ/邪魔だ)**: 29.
    - *Ours now*: «זוזו!», «זוז מהדרך!» (good).
    - 邪魔だ: «אתה מפריע לי!».
47. **"Get out of my sight!" (失せろ)**.
    - *Ours now*: «תסתלקי מעיני!» (AM_2:348, bookish).
    - Neutral: «תסתלקי לי מהעיניים!» (the idiom).
    - Rough: «עופי מפה!» ("get lost").
48. **"Take care" (気をつけて/元気で)**: 37.
    - *Ours now*: «תשמור על עצמך», «תיזהר» (good).
49. **"What do you mean?" (どういうこと)**: 16.
    - *Ours now*: «למה אתה מתכוון?» ×5, «מה זאת אומרת?!» ×2.
    - In surprise use «מה זאת אומרת?!». Keep «למה אתה מתכוון?» only for calm clarification.
50. **"We're done for! / It's over!" (終わりだ/おしまいだ)**: 10.
    - *Ours now*: «אנחנו גמורים!», «נגמר!».
    - Rough: «הלך עלינו!»; «אכלנו אותה!» ("we're screwed").
    - Villain to a victim: «אתה גמור.»; formal «סופך הגיע.».
51. **"Just you wait! / Remember this!" (覚えてろ)**: 4.
    - *Ours now*: «רק חכה!» (good).
    - Also «עוד תראה!»; «זה עוד לא נגמר!».
52. **"You'll regret this"**: 4.
    - *Ours now*: «אתה תתחרט על זה!» (natural).
53. **"Don't worry" (心配するな/大丈夫)**: 25.
    - *Ours now*: «אל תדאג», «לא נורא» (good).
    - Add «יהיה בסדר».
54. **"Please …" (頼む/お願い/ください)**: 178.
    - *Ours now*: «בבקשה תפסיקו!», «בבקשה תובילו את הדרך», «תסבלי את זה, בבקשה», «המתיני בבקשה».
    - *Verdict*: English sprinkles "please" to carry ください politeness; Hebrew uses it less. Fixes:
      - "Please lead the way" → «אחריכם.» ("after you")
      - "Please tolerate it" → «תחזיקי מעמד עוד קצת.» ("hold on a bit more")
      - "Please have patience" → «רק רגע!» / «סבלנות!»
      - «המתיני» (bookish imperative) → «חכי רגע!»
    - Pleading 頼む: «בבקשה!» / «אני מתחנן!» (good).
55. **"I'm sorry / Forgive me" (すまない/ごめん/申し訳ない)**: 43.
    - *Ours now*: «סליחה», «אני מצטער», «בבקשה תסלח לי» (fine for groveling).
    - Tough men's すまない: «סליחה.»; «סליחה, אחי.».
    - Formal: «אני מתנצל.».
56. **"How dare you!" (よくも/無礼な)**: 22.
    - *Ours now*: «איך אתה מעז?!», «יש לך חוצפה ל…» (natural). Keep.
57. **"Brat" (小僧/ガキ)**: 12.
    - *Ours now*: «פרחח» (good for the old guard: Whitebeard, Garp, Rayleigh).
    - Rough villain: «צוציק!» ("punk"); «ילד!».
58. **"Seriously?!" (マジか)**: 28.
    - *Ours now*: «ברצינות?!» ×14.
    - Vary: «רציני?!»; «אתה רציני?!»; «מה, באמת?!».
59. **"Thanks for the food / Let's eat" (いただきます)**: 4.
    - *Ours now*: «בתאבון!» (good), «בואו נאכל!».
    - Also «יאללה, לאכול!».
60. **"Small fry / Scum / Trash" (雑魚/クズ/ゴミ)**: 12.
    - *Ours now*: «זבל!», «זבלים!», «עלובים».
    - Rough: «אפסים!» ("zeros"); «חלאות!» ("scum"). Avoid literal «דגיגים» for "small fry".
61. **English idioms already in the source**.
    - "push your luck" → *ours now* «אל תמתחו את המזל שלכם» → «אל תמתחו את החבל» (the Hebrew idiom: "don't stretch the rope").
    - "pay the piper" → «הגיע הזמן לשלם» (fine).
    - "breathing down your neck" → «נושף בעורף», not «נושם».
    - "I had terrible luck" → *ours now* «היה לי מזל נורא» → «לא היה לי שום מזל».
    - "bad luck" → *ours now* «מזל ביש» (literary) → «חוסר מזל» / «איזה באסה».

### Gaps
- Counts are regex-based and approximate. Categories overlap (e.g., "this guy" includes "this guy's dangerous"), and I did not hand-check every hit. The Hebrew "ours now" figures come from short lines (≤4 English words), plus manual reading of longer dumps.
- The human-vs-AI comparison rests on only about 7,000–9,000 human lines (20 episode folders, early arcs). Rare markers (≤5 hits) are not statistically meaningful there.
- I cannot see the Japanese audio, so the Japanese source given for each English stock phrase is inferred from typical One Piece usage and the community lists. Individual lines may differ.
- I did not test whether Israeli viewers prefer «דוד!» vs. «זקן!» for おっさん, or «אחותי!» vs. a name for 姉様. These are my native-speaker-free judgments and need the user's ear.

---

## Actionable rules for our translator
Ranked by expected impact (frequency × how jarring it is). Each rule: pattern → why it's unnatural → natural alternatives → example.

1. **Discourse markers aren't content words. Translate the function, or drop the marker.**
   - *Pattern*: "Now," → «עכשיו,» (58/56 eps; 274 AI lines). "Well," → «ובכן» (471 AI lines). Sentence-final "after all" → «…, אחרי הכל.» "I see." → «אני מבין.» "Very well." → «טוב מאוד.»
   - *Why*: English discourse glue mapped to a dictionary word. Israelis don't open turns with a time adverb or a literary "well then" (Gottlieb pitfall #2).
   - *Natural*: «טוב, / נו, / יאללה, / אז…» or nothing. «הרי…» at the start of the sentence. «הבנתי / אה, ככה». «בסדר / כרצונך» (formal).
   - *Example*: «עכשיו, תתחבא מתחת לגלימה שלי.» → «מהר, תתחבא מתחת לגלימה!»
2. **Never calque a Japanese stock phrase through its English gloss. Use the Hebrew phrase that does the same job.**
   - *Pattern*: さすが «כמצופה/כצפוי מ…/לא ציפיתי לפחות»; 許さない «בלתי נסלח/אין מחילה»; 覚悟 «התכונן למות / תתכונן לקראתי»; 相手は俺だ «אני אהיה היריב שלך»; まさか…とは «לחשוב ש…»; 都合がいい «נוח לנו»; ふざけるな «אל תהיה מגוחך».
   - *Why*: each is a frozen J→E gloss that fans themselves mock (Ganker; Tofugu on さすが). The Hebrew version reads as twice-translated.
   - *Natural*: «לא סתם… / רואים ש… / כיאה ל…»; «אתה תשלם על זה! / זה עבר כל גבול!»; «הלך עליך! / הכן את עצמך!»; «היריב שלך זה אני!»; «מי היה מאמין ש…»; «זה משחק לטובתנו»; «אתה צוחק עליי?!».
   - *Example*: «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» → «לא סתם הוא הפליג עם מלך הפיראטים!»
3. **Keep literary vocabulary inside a voice. Don't let it become the default register.**
   - *Pattern*: «אכן» (AI 7.6× human), «ארור» (7×), «אסיר תודה», «ציווה», «זנח», «אוי ואבוי», «כך זה», «ימים רחוקים», «תסתלקי מעיני», «המתיני».
   - *Why*: these are dictionary-first choices that land in written or biblical register; translated Hebrew is historically biased toward elevated language (Weissbrod).
   - *Natural*: «נכון/בדיוק»; «מחורבן/דפוק» or «יא…»; «תודה רבה / אני חייב לך»; «אמר/ביקש»; «ויתר»; «אוי/וואי»; «ככה?»; «איזה זיכרונות»; «תסתלקי לי מהעיניים»; «חכי».
   - Allow the formal form only for speakers whose voice card says formal or theatrical (Jinbe, Rayleigh, Kuma, Sengoku, Moria, Hogback, Absalom).
   - *Example*: «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר לשמור על האח של אייס בחיים!»
4. **Vocatives and kin terms: use how Israelis actually address people.**
   - *Pattern*: «אחות גדולה!/אח גדול!» (137 AI lines); «זקן!» for a friendly おっさん; «אנשים!» as a war cry.
   - *Why*: Hebrew doesn't use birth-order sibling titles as address. «זקן!» is rude, and «אח גדול» evokes the reality show.
   - *Natural*: «אחותי! / אחותי היקרה!» (Kuja) or the name; «בוס!/אחי!» (henchmen's "Aniki"); «דוד!» or «אדוני» to a stranger (my judgment); «חבר'ה!/חיילים!».
   - *Example*: «אחות גדולה! מה קרה?!» → «אחותי! מה קרה?!»
5. **Reaction exclamations: pick the Israeli reaction, not the English word.**
   - *Pattern*: «בלתי אפשרי!», «זה רע!», «איזו הקלה!», «מה זה היה?!» (as a challenge), «עבודה טובה!», «ברוכים השבים!» (casual).
   - *Why*: these are word-for-word English reactions. Spoken Hebrew uses different set phrases.
   - *Natural*: «לא יכול להיות! / אין מצב!»; «אוי לא! / יש לנו בעיה!»; «איזה מזל! / פיו!»; «מה אמרת?! / תחזור על זה!»; «כל הכבוד! / תותח!»; «חזרתם!».
   - *Example*: «ברוכים השבים! עבודה טובה!» → «חזרתם! כל הכבוד!»
6. **こいつ/あいつ is a pronoun, not "this guy".**
   - *Pattern*: «הבחור הזה…» (248 corpus lines).
   - *Why*: English "this guy" turned into a noun phrase. Hebrew would use the pronoun or a rough noun.
   - *Natural*: «הוא / זה / הטיפוס הזה / האיש הזה» (formal).
   - *Example*: «הבחור הזה מסוכן!» → «הוא מסוכן!»
7. **Idioms, collocations and proverbs: use the exact Hebrew idiom, or rephrase plainly.**
   - *Pattern*: «נושם בעורף» (should be «נושף»); «יצא לנו מזל» (should be «שיחק לנו המזל»); «אל תמתחו את המזל»; «מחזיר ימים»; «הרגש סוחב אתכם»; «עכבר לכוד הוא דבר מפחיד».
   - *Why*: the English idiom is translated literally, or the Hebrew idiom is half-remembered. Both make the native reader stop.
   - *Natural*: «נושף בעורף»; «שיחק לנו המזל»; «אל תמתחו את החבל»; «איזה זיכרונות»; «אתם נסחפים»; «גם עכבר בפינה יכול לנשוך».
   - Rule: if you are not sure a Hebrew idiom exists in exactly that wording, write the plain meaning instead.
8. **Insults and curses carry voice. Use the Israeli insult system.**
   - *Pattern*: «לעזאזל!» for every くそ; «X שכמוך» for every てめぇ; «ארור» as the all-purpose adjective; «לעזאזל אותך!».
   - *Why*: one flat register for every speaker. The pivot already merged Japanese levels of rudeness (the *Ginga* finding).
   - *Natural*: neutral «לעזאזל»; rough «שיט!» or «אוף!»; «יא מנוול! / חתיכת מנוול!» (rough); «מנוול שכמוך!» (theatrical villain); «לך לעזאזל!» (never «לעזאזל אותך»).
   - *Example*: «לעזאזל ברתולומיו קומא!» → «שיילך לעזאזל, הקומא הזה!»
9. **"Please" and politeness: move it, cut it, or turn the request into Hebrew.**
   - *Pattern*: «בבקשה תובילו את הדרך», «תסבלי את זה, בבקשה», «בבקשה תהיה סבלני».
   - *Why*: English "please" stands in for Japanese ください politeness. Hebrew requests are shorter and carry tone in the verb choice.
   - *Natural*: «אחריכם.»; «תחזיקי מעמד עוד קצת.»; «רק רגע!».
10. **English passive and "going to be": make it active (already in learnings; keep enforcing).**
    - *Pattern*: «הולך להיות מוצא להורג».
    - *Natural*: «הולכים להוציא את אייס להורג».
11. **Detection rule for the lint, so the ~340 episodes can be fixed.**
    - Flag a cue when (a) its English contains one of the triggers listed in Q3 Inferences **and** (b) its Hebrew contains the matching calque from rules 1–8.
    - Also flag, regardless of the English, «כמצופה|כצפוי|בלתי נסלח|אין מחילה|אסיר(ת|י)? תודה|אוי ואבוי|טוב מאוד[.!]$|^עכשיו,|^ובכן|אחרי הכל[.!?]*$|אחות גדולה|אח גדול[!,]|לחשוב ש|אני אהיה היריב|נושם בעורף|יצא לנו מזל|ציווה» and «אכן/ארור/שכמוך» outside whitelisted formal or villain speakers.
    - Use the human-vs-AI rates above as the baseline: flag only where AI ≫ human.
    - Do not calibrate register on the human gold's «הו,», «לעזאזל» or «הבחור הזה» rates (it is a relay translation too).
