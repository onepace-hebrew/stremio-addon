# Register map of Modern Israeli Hebrew for subtitle dialogue (literary vs. standard written vs. colloquial)

Scope: what separates high/literary (גבוה/ספרותי/מליצי), neutral standard (ניטרלי/תקני/תקין) and colloquial (דיבורי/יומיומי, down to slang) Hebrew; which forms fit subtitle dialogue for each character type; what the Academy says; how to give characters formality without archaism. Includes a measurement of our own repo, comparing human-made `He.ass` with AI-made `he.ass`.

Labels used below:
- **[doc]**: documented by the source cited on that line.
- **[mine]**: my own judgment as a careful reader of Israeli Hebrew. These are not native-speaker verified. Treat them as hypotheses for the user to confirm.
- **[repo]**: my own count over this repo's subtitle files. The method is under Key Question 2.

---

## Key Question 1: What distinguishes literary/high, standard, and colloquial Israeli Hebrew, feature by feature?

### Takeaway
Hebrew register shows up mostly in **vocabulary and function words**, then in **syntax and word order**, then in **bound morphology** (suffixes for possession and objects, inflected negators). Register comes in **bundles**: one literary form inside an otherwise spoken clause is what makes a reader stop. Neutral written Hebrew is very close to speech "lightly tidied". The high written register is a separate variety that Israelis read all the time and almost never produce.

### Cited Findings

**The three-level model and how it is defined**
- Israeli scholarship arranges registers on a three-step scale [doc]:
  1. **Top:** the high register, meaning literary, florid (מליצית) and poetic language.
  2. **Middle:** the standard, neutral, unmarked register, meaning the correct and acceptable language of formal situations at a given time.
  3. **Bottom:** the low, "popular" register, mainly spoken.
  - Dictionaries mark the high end with labels like ספרותי, מליצי, ארכאי, and the low end with דיבורי, עממי, עגה (slang).
  - Source: [Ditshi-Barak & Yosov-Shalom, "משלבים בעברית" (Kaye College Lexicon 23, 2025), citing Sharel 1990/1993 and Nir 1976](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf) (DOI 10.54301/ZVGG1226).
- The register differences that matter most, and that do most to raise or lower register, are in **vocabulary and expressions**, then **syntax and word order**. Register judgments rest on a native speaker's intuition at a given time, measured against neutral unmarked language (Nir 1976; Schlesinger 2002) [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf).
- Many speakers feel there are **only two registers**: speech, and "high writing". The second is the one the authors call neutral, not literary [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf).
- Hamichlol (a Hebrew Wikipedia fork) gives four registers and renders one Agnon sentence in each. This is the clearest "same content, four registers" example I found [doc]:
  - **High/florid:** «טוב היה אילו חזרתי לביתי, אלא שכבר ירד היום וביתי רחוק מן העיר» ("It would have been good had I returned to my home, but the day has already gone down and my home is far from the city").
  - **Standard:** «היה עדיף לשוב הביתה, אך בא הערב וביתי נמצא הרחק מהעיר» ("Better to return home, but evening came and my house is far from town").
  - **Spoken:** «היה הכי טוב אם הייתי חוזר הביתה, אבל כבר היה חושך ואני גר מחוץ לעיר» ("It'd have been best if I went back home, but it was already dark and I live outside town").
  - **Slang:** «אם הייתי עף הביתה זה היה הכי טוב, אבל כבר היה לילה ואני גר רחוק לאללה» ("If I'd zoomed home that'd be best, but it was night and I live way the hell out").
  - Source: [Hamichlol, "משלב"](https://www.hamichlol.org.il/%D7%9E%D7%A9%D7%9C%D7%91).
  - Note how the markers move between levels: אילו→אם · אלא ש/אך→אבל · שוב/חזר · ביתי→הביתה/אני גר · ירד היום→היה חושך · הרחק מ→מחוץ ל.
- In speech, standard Hebrew is the norm, "but without strict observance of all its rules" [doc]. Source: [Hamichlol, "משלב"](https://www.hamichlol.org.il/%D7%9E%D7%A9%D7%9C%D7%91).
- A learner-oriented reference puts it this way [doc, secondary source]: "the neutral column is nearly always the spoken one. Hebrew's default written register is not a compromise between speech and formality: it is speech, lightly tidied." It adds that "register comes in bundles, not one word at a time." Its example of a jarring mixed clause: «אינני יודע איפה שמתי את המפתחות שלי» ("I do not know where I put my keys"), which puts written-register אינני next to spoken איפה and שלי. Source: [Elon.io, "Sounding Like a Textbook, or Like the Bible"](https://elon.io/grammar/hebrew/errors/register-mismatch).
- The Ministry of Education's assessment unit (RAMA) uses the same three levels in a register-rewriting task, glossed as follows [doc]:
  - משלב גבוה (תקני): high (standard)
  - משלב יומיומי (קביל): everyday (acceptable)
  - משלב תת-תקני (סלנג): substandard (slang)
  - Source: [RAMA, "המשלב הלשוני בטקסט"](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf).
- Ravid & Berman studied texts by schoolchildren through adults. Text types fall on a **cline**: from everyday colloquial usage in oral narratives to high-level language in written expository essays. Full command of register variation keeps developing past adolescence [doc]. Source: [Ravid & Berman 2009, *Pragmatics & Cognition* 17(1)](https://www.jbe-platform.com/content/journals/10.1075/pc.17.1.04rav) ([PhilPapers record](https://api.philpapers.org/rec/RAVDLR)).

**Officially documented high↔everyday rewrite pairs (RAMA marking rubric)** [doc]
All pairs below come from the answer key of the task in [RAMA, "המשלב הלשוני בטקסט"](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf). Arrows point from everyday to high, or the reverse, as the task states.
- Everyday → high:
  - «עד עכשיו» → «עד עתה» ("until now")
  - «לא ראיתי אותך» → «לא ראיתיך» ("I didn't see you"; object suffix)
  - «בכלל» → «כלל» ("at all")
  - «לא ידעתי שאת קיימת» → «לא הבחנתי בקיומך» ("I didn't know you existed"; nominalization plus suffix)
  - «אבל» → «אך» ("but")
  - «אחרי ש…» → «לאחר…» ("after")
  - «על המקום» → «מיד» ("on the spot")
  - slang «מה זה (נגנבתי)» → «מאוד / עד מאוד» ("so (amazed)")
  - slang «נגנבתי» → «התפלאתי» ("I was amazed")
  - slang «באמא שלי» → «באמת ובתמים» ("I swear")
- High → everyday, **word order**:
  - «ייסורים יש לה די» → «יש לה די ייסורים» ("she has enough suffering"; fronted object restored)
  - «היא תחרד, תמר» → «תמר תחרד» ("Tamar will worry"; dislocated subject restored)
  - «אל תאמר לה שלמענה יצאתי» → «תאמר לה שיצאתי למענה» (the exercise reorders the clause)
- High → everyday, **vocabulary**:
  - «כמובן» → «בטח» ("of course")
  - «תחרד» → «תדאג / תפחד / תזדעזע» ("will be alarmed" → "will worry / be scared")
  - «שמע נא» → «תקשיב / תשמע» ("hark" → "listen")
  - «אל תאמר» → «אל תגיד» ("don't say")
  - «שלמענה» → «שבשבילה» ("for her sake")
  - «שלא תתייסר» → «שלא תסבול / שלא יכאב לה» ("so she won't suffer")
  - «ייסורים» → «סבל, כאב, צרות» ("torments" → "suffering, pain, trouble")
  - «יש לה די» → «יש לה מספיק» ("she has enough")
  - «בלעדיי» → «בלי ש...» ("without me")
- The same task says that adding **bound suffixes** (possessive and object) is a standard way to *raise* register. Its exercise is literally named «לכתוב כמו משוררים / כינויים חבורים בשרות המשלב» ("Write like poets / bound pronouns serving register") [doc]. Source: [RAMA](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf).

**Grammar features (documented)**
- **Negation of the present:** the inflected set אינני / אינך / אינו / אינם is formal. It is "alive in editorials and committee minutes, and absent from kitchens". In speech: אני לא / הוא לא [doc, secondary source]. Sources: [Elon.io register-mismatch](https://elon.io/grammar/hebrew/errors/register-mismatch); [Elon.io, אין](https://elon.io/grammar/hebrew/negation/ein).
  - Example: «אינני סבור שזו הדרך הנכונה» ("I do not believe this is the right way") is an opinion column; speech says «אני לא חושב ש...».
- אינו negates only present states and participles. It cannot replace לא in the past: «הוא לא הגיע», never «הוא אינו הגיע» ("he didn't come") [doc]. Source: [Settemilalingue, "Spoken vs. Written Hebrew"](https://www.settemilalingue.com/en/languages/he/grammar/spoken-vs-written-hebrew).
- **Presentative/copula:** הנני is "a presentative literary or formal form… not the normal conversational way to announce one's presence". Speech uses «הנה אני», «אני פה» or «הגעתי» ("here I am / I'm here / I've arrived") [doc]. Source: [Settemilalingue](https://www.settemilalingue.com/en/languages/he/grammar/spoken-vs-written-hebrew).
- The inflected יש forms (ישנו/ישנה) are stylistic and belong to formal and official writing. Plain יש is "simpler and commoner at every level". This is the Academy's position as relayed by a secondary source [doc]. Source: [Elon.io, יש and אין](https://elon.io/grammar/hebrew/sentences/yesh-ein).
- **Possessive suffixes vs. של:** "In literary style, nouns are inflected to show possession… mostly restricted to formal and literary speech." Colloquial Hebrew uses analytic של, with exceptions such as «מה שלומך?» ("how are you?") and «לדעתי» ("in my opinion") [doc]. Source: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar).
- The split between suffix and של goes **word by word, not by rule** [doc, secondary source]. Source: [Elon.io, suffixes and register](https://elon.io/grammar/hebrew/smichut/suffixes-register).
  - Fully alive in speech: «אשתי, בעלי, אחי, אחותי, בני, בתי» ("my wife / husband / brother / sister / son / daughter"), plus the set phrases «לדעתי, לצערי, בעיניי, מצידי» ("in my opinion / unfortunately / in my eyes / as far as I'm concerned") and address forms «אדוני, גבירתי» ("sir, madam").
  - More formal: «אבי, אמי» ("my father, my mother"). The everyday forms are «אבא שלי, אמא שלי».
  - Written-only: «ספרי, ביתו, מכוניתי» ("my book, his house, my car").
- **Object suffixes:** verbal object suffixes such as שמרנוהו ("we guarded him") are "rarely used" today and appear more "in biblical and poetic Hebrew (for instance, in prayers)". Speech uses את + pronoun (אותו) [doc]. Source: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar). RAMA treats «לא ראיתיך» as the register-raised form of «לא ראיתי אותך» [doc] ([RAMA](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf)).
- **Yes/no questions:** in speech and in neutral writing, a question is marked by rising intonation alone («בא לך קפה?» / «אתה רוצה קפה?», "want coffee?"). «האם תרצה קפה?» ("would you like coffee?") is the formal written form [doc, secondary source]. Source: [Elon.io register-mismatch](https://elon.io/grammar/hebrew/errors/register-mismatch).
- **Relative clauses, "because", "but":** [doc, secondary source] Source: [Elon.io register-mismatch](https://elon.io/grammar/hebrew/errors/register-mismatch).
  - Relative: «האיש שראיתי» (spoken and neutral) vs. «האיש אשר ראיתי» (formal written), "the man I saw".
  - "Because": spoken כי / בגלל ש; neutral כי / מפני ש; formal מכיוון ש / משום ש / בשל / עקב. "בשל and עקב are prepositions of press releases."
  - "But": spoken and neutral אבל; formal אך / אולם; literary ברם.
- A second reference gives the same contrast [doc]. Source: [Settemilalingue](https://www.settemilalingue.com/en/languages/he/grammar/spoken-vs-written-hebrew).
  - Connectors: spoken אז, אבל, כי, ש vs. formal לפיכך, אולם, מאחר ש, אשר.
  - Pronoun: אנחנו is the norm; אנו is "more formal, institutional, or rhetorical".
  - Prepositions: בשבילכם vs. למענכם; לפי מה שהוא אמר vs. לדבריו.
- **Demonstratives:** «ספר זה» ("this book", no article) is "written Hebrew: academic, legal, editorial". Speech says «הספר הזה» [doc, secondary source]. Source: [Elon.io, definiteness](https://elon.io/grammar/hebrew/nouns/definiteness-overview).
- **Imperative:** using the future as an imperative is "confined to the informal register" of Modern Hebrew [doc]. Source: [Chanan Ariel 2019, in Doron, Rappaport Hovav, Reshef & Taube (eds.), *Language Contact, Continuity and Change in the Genesis of Modern Hebrew*, pp. 117–142](https://cris.iucc.ac.il/en/publications/why-did-the-future-form-of-the-verb-displace-the-imperative-form-/).
  - Speakers replace the normative imperative mostly in the derived binyanim: «כִּתְבוּ→תכתבו, הִתְרַחֵץ→תתרחץ, הַשְׁמַע→תשמיע, הִיזָּהֲרִי→תיזהרי» ("write / wash / play (audio) / be careful").
  - **Short pa'al imperatives survive** in speech: «בוא, לך, קח, תן, שים, קום» ("come, go, take, give, put, get up").
  - Negative commands are **always אל + future**, in every register.
  - Source for the last three points: the Academy page as quoted by [Elon.io, "Over-Using the Classical Imperative"](https://elon.io/grammar/hebrew/errors/imperative-overuse) [doc, secondary source].
- In Grossman's *Someone to Run With*, the middle-class teenage characters speak "half standard, half spoken" Hebrew: "they use the future form instead of the imperative." In other words, future-as-imperative is a literary device for marking ordinary modern speech [doc]. Source: [Hamichlol, "משלב"](https://www.hamichlol.org.il/%D7%9E%D7%A9%D7%9C%D7%91).
- **Passive:** [doc] Source: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar).
  - "The passive voice is fairly rare in ordinary Modern Hebrew" (nif'al is mostly middle or reflexive).
  - Pu'al and huf'al are "not commonly used in ordinary speech" except as adjectives (מוכר, "familiar"; מבולבל, "confused").
- **Word order:** SVO is the norm. A definite subject placed after the verb sounds "formal or archaic" because it reflects biblical VSO order. Fronting is "almost mandatory" with question words and otherwise marks emphasis [doc]. Source: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar). RAMA's rubric undoes fronting and dislocation to lower register (examples above) [doc].
- **Pronoun dropping:** Hebrew is "partly pro-drop". Subject pronouns may be dropped when the verb shows person (1st and 2nd person past and future) and are always used in the present [doc]. Source: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar).
- **Mixed and hybrid registers** are deliberate in humour, sport, ads, satire and stand-up. In literature, the narrator's voice (לשון הסיפר) is distinct from the characters' dialogue (לשון הדיבר). Dialogue is put "in the characters' mouths in the register suited to them… creating authenticity" (Schlesinger 2002) [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf).

**Discourse markers, slang, address forms (documented)**
- Yael Maschler's *Metalanguage in Interaction: Hebrew Discourse Markers* (Benjamins 2009) is the first monograph on Hebrew discourse markers in natural conversation [doc]. It treats:
  - כאילו ("like"), as a cognitive marker of realising a need to rephrase
  - נו ("well, come on")
  - בקיצור ("in short")
  - טוב ("okay")
  - Sources: [library record](https://library.ccs.edu.au/bib/49563); [Maschler 2004 on טוב (SALSA)](https://asol.ling.utexas.edu/salsa/proceedings/2004/Maschler.pdf).
- Ruvik Rosenthal's guide to Israeli forms of address [doc]. Source: [Rosenthal, "מה נשמע גיבור, מה קורה צדיק שלי?" (2006)](https://www.ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2006/14042006.aspx).
  - **«אחי»** ("bro"): the basic friendly address, which developed in the army.
  - **«אבאל'ה»** ("daddy-o"): patronising under a friendly cover.
  - **«גיבור», «תותח», «גבר»** ("hero", "cannon", "man"): army style, often ironic.
  - **«גיבֶרת»** ("lady", stressed): provocative.
  - **«אדוני»** ("sir"): can turn hostile through intonation.
  - **«ידידי»** ("my friend", stress on the first syllable).
- Rosenthal's top slang of the 2000s includes «אחי, אחלה, בקטנה, סבאבה, חופר, חנון, סרטים, תרגיע». Phrases include «גבר גבר», «סוג של», «מרגיש לי» (an anglicism) [doc]. Source: [Rosenthal, "כנסו, כנסו לקראווילות" (2010)](https://ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2010/01012010.aspx).
- Rosenthal on how fast slang dates [doc]. Source: [Open University interview with Rosenthal](https://www.openu.ac.il/hasifa/articles/2009-09/ruvik_rosen.html).
  - Most expressions spread by radio and TV "didn't really stay".
  - Speakers swapped יעני for כאילו and חבוב for גבר without noticing.
  - Reduplication (קשה-קשה, גבר-גבר) lasts because it is a native Hebrew pattern.
- «יאללה» is a spoken-register word now also used in print and media. In a 2020 Academy online poll it came third as "the slang word we can't do without". Its functions include hurrying, agreeing, encouraging, scoffing («יאללה יאללה») and leave-taking [doc]. Source: [Hebrew Wikipedia, "יאללה"](https://he.wikipedia.org/wiki/%D7%99%D7%90%D7%9C%D7%9C%D7%94), citing the Academy and Rosenthal.
- Rosenthal on animal insults: חמור ("donkey") is the generic insult for stupidity or stubbornness; בהמה ("beast") is for crude or ignorant people [doc]. Source: [Rosenthal on Rav-Milim blog (2015)](https://blog.ravmilim.co.il/2015/06/25/%d7%93%d7%a8-%d7%a8%d7%95%d7%91%d7%99%d7%a7-%d7%a8%d7%95%d7%96%d7%a0%d7%98%d7%9c-%d7%97%d7%9e%d7%95%d7%a8-%d7%92%d7%a8%d7%9d-%d7%a4%d7%a8%d7%aa-%d7%91%d7%a9%d7%9f-%d7%95%d7%a2%d7%92%d7%9c-%d7%9e/).

### The register map (feature by feature)
Columns: **Literary/high** = what to avoid in dialogue. **Neutral written** = acceptable on screen. **Spoken** = the target for most lines. The last three columns give the subtitle choice by voice:
- **F** = formal (elder, admiral, butler, king)
- **N** = neutral narrator-ish or average character
- **R** = rough or street (brawler, pirate grunt, kid)

Tags: [doc] where a row is sourced above, otherwise [mine].

| # | Feature | Literary / high | Neutral written | Spoken | F | N | R |
|---|---|---|---|---|---|---|---|
| 1 | Present negation [doc] | אינני / אינך / אינו / אינם | (אינו, journalism) | אני לא / הוא לא | אני לא | אני לא | אני לא |
| 2 | Presentative / copula [doc] | הנני / הינו / הינה | הוא / היא / זה | זה / הוא | הוא / זה | זה | זה |
| 3 | Existential [doc] | ישנו / ישנם / איננו | יש / אין | יש / אין | יש / אין | יש / אין | יש / אין |
| 4 | Possessive [doc] | ספרי, ביתו, דבריו, אבי | mixed | הספר שלי, אבא שלי | של; kinship suffix OK (בני "my son") | של | של |
| 5 | Object pronoun [doc] | ראיתיו, הכרתיה, הצלתיך | ראיתי אותו | ראיתי אותו | אותו | אותו | אותו |
| 6 | Yes/no question [doc] | האם תבוא? | (האם…, formal) | תבוא? | תבוא? | תבוא? | תבוא? / אתה בא? |
| 7 | "How / why / where / from where" [doc + mine] | כיצד / מדוע / היכן / מאין | (same, formal) | איך / למה / איפה / מאיפה | איך / למה / איפה | same | same |
| 8 | Relative / "when" [doc + mine] | אשר / כאשר | ש / כש | ש / כש | ש / כש | ש / כש | ש / כש |
| 9 | "But" [doc] | ברם / אולם / אך | אבל (אך tolerable) | אבל | אבל | אבל | אבל |
| 10 | "Because" [doc] | הואיל ו / משום ש / מאחר ש / בשל / עקב | מכיוון ש / כי | כי / בגלל ש | כי / מכיוון ש | כי | כי |
| 11 | "Therefore" [doc + mine] | לפיכך / על כן / אי לכך / אפוא | לכן | אז / לכן | לכן / אם כך | אז | אז |
| 12 | "Lest / perhaps" [mine] | שמא / פן / לבל | שלא / כדי שלא | אולי / שלא | שלא… / אולי | אולי | אולי |
| 13 | "Before / not yet" [mine] | בטרם / טרם | לפני ש / עדיין לא | לפני ש / עוד לא | לפני ש | לפני ש | לפני ש |
| 14 | "If (counterfactual)" [doc] | אילו / אלמלא / לולא | אם… היה | אם הייתי… | אם הייתי | same | same |
| 15 | "Although" [mine] | אף על פי ש / אף כי | למרות ש | למרות ש / אפילו ש | למרות ש | same | אפילו ש |
| 16 | "Without" [doc + repo] | בלעדיי | ללא (set phrases) | בלי | בלי; ללא פגע / ללא חת OK | בלי | בלי |
| 17 | "After / afterwards" [doc] | לאחר / לאחר מכן / כעבור | אחרי / אחר כך | אחרי / אחר כך / אחרי זה | אחרי | אחרי | אחרי |
| 18 | "For" [doc] | למען / בעבור / עבור | בשביל / עבור | בשביל | בשביל; למען only "for the sake of" | בשביל | בשביל |
| 19 | "About" [mine] | אודות / על אודות | על | על | על | על | על |
| 20 | "Now / for now / just now / so far" [doc + mine] | כעת / עתה / לעת עתה / זה עתה / עד כה / מעתה | עכשיו / בינתיים / עד עכשיו | עכשיו / בינתיים / הרגע / עד עכשיו / מעכשיו | עכשיו… | same | same |
| 21 | "Indeed / truly" [mine] | אכן / אמנם / הן | באמת / נכון | באמת / נכון / בדיוק / ברור | נכון / אכן (rare) | באמת | בדיוק / ברור |
| 22 | "So (degree)" [mine] | כה | כל כך | כל כך / כזה / ממש | כל כך | same | ממש |
| 23 | "A little" [doc + mine] | מעט / קמעה | קצת (עוד מעט OK) | קצת | קצת | קצת | קצת |
| 24 | "At all" [doc] | כלל | בכלל | בכלל | בכלל | same | same |
| 25 | "Very" [doc] | עד מאוד | מאוד | ממש / מאוד / מה זה (slang) | מאוד | ממש | ממש / מה זה |
| 26 | "Suddenly / quickly / soon" [mine] | לפתע / במהרה / תיכף | פתאום / מהר / בקרוב | פתאום / מהר / תכף / עוד רגע | פתאום | same | same |
| 27 | "Never" [mine] | לעולם לא (outside vows) | אף פעם לא | אף פעם לא | לעולם לא OK in vows | אף פעם | אף פעם |
| 28 | "Please / let's" [doc + mine] | אנא / נא / הבה | בבקשה / בואו | בבקשה / נו / יאללה / בוא נ… | בבקשה | בבקשה / בוא נ… | יאללה / נו |
| 29 | "We" [doc] | אנו | אנחנו | אנחנו | אנחנו (אנו only in oaths or proclamations) | אנחנו | אנחנו |
| 30 | Positive imperative, derived binyanim [doc] | התכונן / היזהר / הקשב / הבט / הסתלק | (signage) | תתכונן / תיזהר / תקשיב / תסתכל / תעוף מפה | orders in battle: imperative OK (אש!, היכון!) | future | future |
| 31 | Short pa'al imperatives [doc] | (n/a) | בוא, לך, קח, תן, שים, קום | same | same | same | same |
| 32 | Negative command [doc] | אל תאמר | אל תגיד | אל תגיד | all registers: אל + future | | |
| 33 | Infinitive of purpose [mine] | על מנת ל / בכדי ל | כדי ל | כדי ל | כדי ל | same | same |
| 34 | Passive / huf'al / pu'al [doc] | הוצא להורג / נאסר / יושמד | (nif'al OK) | 3pl active: הוציאו אותו להורג / עצרו אותו | active preferred | active | active |
| 35 | Nominalization [doc + mine] | עם שובו / לאחר הגעתו / ביצוע ההוצאה להורג | כשהוא חזר / אחרי שהגיע | כשהוא יחזור / אחרי שהוא הגיע | verb clause | verb clause | verb clause |
| 36 | Word order [doc] | VS / fronted object («ייסורים יש לה די»), dislocation | SVO | SVO; fronting only for emphasis | SVO | SVO | SVO + emphatic fronting («את זה אני לא שוכח!») |
| 37 | Demonstrative [doc] | ספר זה | הספר הזה | הספר הזה | הספר הזה | same | same |
| 38 | Subject pronoun [doc + mine] | 3rd-person dropped («יצא מהחדר», narration) | 1st/2nd dropped OK | pronoun often kept («אני חושב») | either | either | keep pronoun |
| 39 | Address [doc] | אדוני / גבירתי / רבותיי | סליחה / אדון X | אחי / גבר / אחותי / מותק | אדוני / אדון X | שם | אחי / גבר / יא… |

### Bookish vocabulary → everyday equivalents (as long a list as I could build)
Unless a source is shown, rows are **[mine]**. Gloss in parentheses. "OK in F" means acceptable for a formal or theatrical voice as a deliberate, marked choice.

**Verbs**
| Bookish | Everyday | Gloss |
|---|---|---|
| ציווה (על) | אמר / נתן פקודה / פקד (military) / הורה (neutral-formal) | ordered |
| החל | התחיל | began |
| שב (= returned) | חזר | returned |
| נטש | עזב / השאיר מאחור / זרק | abandoned |
| זנח (user-flagged) | ויתר על / עזב / הזניח | gave up / neglected |
| ניצב | עמד | stood |
| הביט / התבונן | הסתכל | looked |
| הבחין (ב) | שם לב / ראה | noticed (RAMA pair, doc) |
| נוכח לדעת | הבין / גילה | realized |
| חש | הרגיש | felt |
| חפץ / ביקש (= wanted) | רצה | wanted |
| השתוקק / נכסף | מת ל… / ממש רצה | longed |
| ייחל | קיווה | hoped |
| תהה | שאל את עצמו / לא הבין | wondered |
| השיב | ענה | answered |
| שח / סח | סיפר / אמר | told |
| נטל | לקח | took |
| העניק | נתן | granted |
| נמלט | ברח | fled |
| נחבא | התחבא | hid |
| פסע / צעד | הלך | walked |
| נשבה | נתפס / לקחו אותו בשבי | was captured |
| הוצא להורג | הוציאו אותו להורג | was executed (user-flagged pattern) |
| קטל | הרג | slew |
| כילה / הכחיד | השמיד / חיסל / גמר על | destroyed |
| הכה (OK in fights) | הרביץ / נתן מכה | struck |
| גבר על | ניצח / הביס | overcame |
| חרד (doc, RAMA) | פחד / דאג | feared |
| התייסר (doc, RAMA) | סבל | suffered |
| זעם | כעס / התעצבן / התפוצץ | raged |
| התפלא (neutral) / נגנב (slang) (doc, RAMA) | הופתע / לא האמין | was amazed |
| סעד | אכל | dined |
| לגם | שתה | sipped |
| השכים | קם מוקדם | rose early |
| הלך לעולמו / נפטר | מת | passed away (pirates say מת) |
| נשא לאישה | התחתן עם | married |
| עשה דרכו | בדרך / מגיע | made his way |
| ביקש את נפשו | רצה להרוג אותו | sought his life |
| אמר (+ אל) | אמר ל… | said to |

**Nouns and adjectives**
| Bookish | Everyday | Gloss |
|---|---|---|
| חרפה | בושה / ביזיון / פדיחה (slang) | disgrace (AI 13, human 0 [repo]) |
| ייסורים (doc) | סבל / כאב / צרות | torments |
| מזימה | תוכנית / תרגיל (מזימה OK in F) | scheme |
| מרמה | תרגיל / רמאות / עבודה בעיניים | deceit |
| עת / מועד | זמן / כש… | time |
| כיום | היום | nowadays |
| אמש | אתמול בלילה | last night |
| עלם / עלמה | בחור / בחורה | youth / maiden |
| ישיש | זקן | old man |
| רע (= friend) | חבר | friend |
| צר / אויב (אויב is fine) | אויב | foe |
| כסיל / שוטה | טיפש / אידיוט / מטומטם | fool |
| פיקח | חכם / ממולח | clever |
| כביר / עז | ענק / אדיר / חזק | mighty |
| נאה | יפה | handsome |
| יגע | עייף / גמור | weary |
| נוגה | עצוב | sorrowful |
| עליז | שמח | merry |
| בהלה (abstract subject) | בלגן / פאניקה | panic (see flagged line) |
| אסיר תודה | מודה לך / תודה / חייב לך | grateful (AI 62, human 0 [repo]) |

**Function words, adverbs, connectors**: see the map rows 7–29, plus:
- אף (= even) → אפילו
- אף (= also) → גם
- דהיינו / קרי → כלומר / זאת אומרת
- עם זאת → אבל / ובכל זאת
- כמו כן → וגם
- כך → ככה (spoken; כך is neutral)
- אילו (= which, plural) → איזה (spoken)
- מיד is neutral (RAMA pairs it with «על המקום»)
- ביותר (החזק ביותר) is neutral-written; spoken: הכי חזק
- ובכן is neutral-formal; spoken: טוב / אז / נו
- הרי and לכן are neutral and fine

**Interjections** [mine; the house set is from docs/translation-learnings.md §2.6]
- Avoid as archaic: אבוי, אוי ואבוי (ironic only), הוי, אללי, אח (sigh), הבה.
- Use: הא?!, הממ, בחיי, הו / או, וואו, אוי, יש!, איכס, נו באמת, די!, מה?!, אה.

**Insult and profanity tiers** [mine; the faithfulness principle is from the Netflix guide]
- **Archaic or literary:** נבל, שפל, ארור, בזוי, חלאה. These are OK only for a theatrical villain, and sparingly.
- **Mild:** טמבל, אידיוט, מטומטם, דביל, חמור, אהבל, סתום, חתיכת X.
- **Medium:** מניאק, בן כלב, מנוול, חתיכת זבל.
- **Strong:** בן זונה, לך תזדיין, and stronger.
- Netflix's Hebrew guide: "Dialogue must never be censored. Expletives should be rendered as faithfully as possible" ([Netflix Hebrew Timed Text Style Guide](https://studiopartner.netflix.net/studio/hebrew-timed-text-style-guide)) [doc]. For One Pace, match the English source's strength tier rather than raising or lowering it [mine].

### Inferences
- The flagged lines in our episodes split into four families [mine]:
  1. **Bookish word** in a spoken frame (זנחתי, ציווה, אסיר תודה, מטלטלים).
  2. **English calque collocation** that is grammatical but is not a Hebrew collocation (תופעות לוואי מכוערות, הרגש סוחב אתכם, מחזיר ימים, כצפוי מ…, לא פחות ממה שאפשר לצפות מ…).
  3. **Wrong or less idiomatic idiom** (נושם בעורף for נושף בעורף; יצא לנו מזל vs. שיחק לנו המזל; נגמר לנו vs. הלך עלינו; עכבר לכוד vs. גם עכבר בפינה יכול לנשוך).
  4. **Passive or nominal syntax** (אייס הולך להיות מוצא להורג; הבהלה הזאת ממש נוחה לנו).
  - Only family 1 is a "register" problem in the strict sense. Families 2–4 are relay-translation problems that *read* as literary because the reader can't place them in speech.
- Because register comes in bundles, a check that flags **one** high-register token in a line that otherwise has spoken markers (אני לא, איפה, של, תעשה) is a cheap, precise detector [mine, built on the Elon.io "bundles" observation].

### Gaps
- I couldn't open the Academy's own register pages directly. hebrew-academy.org.il returned 403 to the fetcher, so Academy positions are cited through secondary sources that quote them with dates. Verify on the live site if a rule will depend on them.
- Ravid & Berman (2009) full text was not accessible, so I can't list their exact register-coded lexical items.
- I found no published frequency list of "bookish verb → everyday verb". The verb, noun and adverb tables above are my own judgment, except rows marked as RAMA pairs. A native reviewer should prune or confirm them.
- CoSIH (Izre'el's Corpus of Spoken Israeli Hebrew) was not consulted directly. Spoken-frequency claims here rest on reference grammars, not corpus counts.

---

## Key Question 2: Which formal features are normal in WRITTEN subtitles, which cross into "literary", and is there scholarship on this written-spoken middle register?

### Takeaway
There is a recognised hybrid "spoken-written" middle register. Its examples include broadcast scripts and transcribed speech; subtitles are the same kind of text. Israeli TV subtitling once followed an **elevated-language norm**, which scholars say has **almost vanished**. Even within the old normative regime, a TV subtitler wrote in the Academy's own journal that subtitles must be phrased "in the style of the living language". Our own corpus shows the human subtitler tolerates neutral-written connectors and set phrases, but never uses the literary set (האם, עתה/כעת, אינך/אינם, אשר, כה, אנו, מוטב, חרפה, אנא, אסיר תודה). Our AI uses all of them.

### Cited Findings
- **Hybrid register exists and is named.** Kaye 2025 describes a «לשון ביניים, לשון דבורה-כתובה» ("in-between, spoken-written language") [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf). It covers:
  - online comments, chats and forums
  - "utterances prepared in writing whose final form is oral, like a speech, lecture or narration"
  - "and the reverse: oral utterances recorded and then put in writing"
- **TV subtitler in the Academy's journal**, in an article in *Leshonenu La'am* vol. 49, issue 2, pp. 85–89, about Israeli TV Channel 1 [doc]. Source: [Leshonenu La'am 49(2), pp. 85–89](https://hebrew-academy.org.il/wp-content/uploads/2025/07/lla49-2-p.85-89.pdf). The author's name was not captured, because the fetch was blocked and I only have search-tool text.
  - «הכתוביות מתרגמות דו-שיח חי, ולכן עליהן להיות מנוסחות בסגנון הלשון החיה» ("Subtitles translate live dialogue, and so must be phrased in the style of the living language").
  - The commonest errors are in slang.
  - A person who hasn't lived some years where the source language is spoken "will struggle to translate films (that is, spoken language)".
  - The constraints of that era: about 3 seconds and at most about 67 characters per one-line subtitle, with 4–5 words "at most" per subtitle.
- **The elevated-register norm and its decline (Weissbrod)** [doc]. Source: [Weissbrod 2021, "Translation for Israeli television: the reflection of a hybrid identity", *Linguistica Antverpiensia NS–TTS* 6](https://doi.org/10.52034/lanstts.v6i.177).
  - On early Israeli TV, "the register was often elevated compared with the original. Slang and vulgar phrases were avoided… When slang and vulgarisms did find their way into the translation, they were put in quotation marks… translation was corrected by language editors" (citing Nir 1984).
  - Today: "The language used in the Hebrew subtitles has changed significantly. Slang and vulgarisms in the original dialogue no longer pose a problem. The norm described by Nir (1984) has almost vanished."
  - A 1992 Channel 1 *Othello* was "abundant with elements of elevated language… Aramaic words (be-matuta for be-vakasha)". Commercial channels used elevated language "only when the translation was based on a pre-existing literary translation".
  - Even dubbing for children has loosened (*Shrek* uses Israeli slang such as «אחלה דיל», "great deal").
- **Public broadcaster's mission (1996 interview)** with the head of the Israel Broadcasting Authority's translation department [doc]. Source: [Kaufmann 2002, "Aspects de la traduction audiovisuelle en Israël", *Meta* 47(3)](https://doi.org/10.7202/003293ar).
  - The authority "fulfils an educational mission contributing to the spread of correct, normative Hebrew", and each channel had a language adviser following the Academy.
  - But "dialogues in a single film belong to different registers of spoken language… the translation tries to reflect the various levels of the original".
  - Translators were tested on dialogue extracts "representing various levels of language: spoken language, formal language".
  - Living abroad mattered more than degrees, because film language "is in most cases spoken, even slang".
- **Translated drama dialogue historically.** Ben-Shahar describes translators of plays into Hebrew using "standard and super-standard written Hebrew, ignoring the principles of spoken language". She says this mode prevailed until the late 1960s and was gradually replaced by a more colloquial mode [doc]. Caveat: this rests on search-result summaries; the full texts were bot-blocked. Sources: [Ben-Shahar 1994, *Target* 6(2), "Translating Literary Dialogue: A Problem and Its Implications for Translation into Hebrew"](https://www.benjamins.com/catalog/target.6.2.05ben); Ben-Shahar 1998, *Meta* 43(1) ([erudit PDF](https://www.erudit.org/en/revue/meta/1998/v43/n1/002059ar.pdf)).
  - Ben-Shahar's 1994 abstract says literary dialogue is "highly susceptible to inadequate translation", partly for reasons specific to Hebrew.
- **Original Hebrew films did the same.** The first Hebrew narrative films of the 1930s "adopted the normative approach to Hebrew, which strongly preferred high-register Hebrew over authentic usage". Spoken features rise sharply in later films [doc]. Sources: [Bar-Ziv Levy 2021, *Journal of Jewish Studies*](https://liverpooluniversitypress.co.uk/doi/10.18647/3486/jjs-2021); [Bar-Ziv Levy, Bar-Ilan](https://cris.biu.ac.il/en/publications/%D7%9B%D7%90%D7%9F-%D7%91%D7%90%D7%A8%D7%A5-%D7%94%D7%A7%D7%95%D7%93%D7%A9-%D7%A6%D7%A8%D7%99%D7%9A-%D7%9C%D7%93%D7%91%D7%A8-%D7%A8%D7%A7-%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%94%D7%97%D7%99%D7%99%D7%90%D7%AA-%D7%94%D7%93%D7%99%D7%91%D7%95%D7%A8-%D7%94%D7%A2%D7%91%D7%A8%D7%99-%D7%91%D7%A8%D7%90%D7%99-%D7%A1%D7%A8%D7%98%D7%99%D7%9D-).
- **The elevated norm is a long-standing pattern in Hebrew literary translation.** Weissbrod writes that literary translations into Hebrew followed "a norm which dictated the use of an elevated style rooted in ancient Hebrew texts", producing an unintended mock-epic effect [doc]. Source: [Weissbrod, "Mock-Epic as a Byproduct of the Norm of Elevated Language", *Target* 11(2)](https://cris.biu.ac.il/en/publications/the-norm-of-elevated-language-and-mock-epic-in-literary-translati/), as summarised in search results.
- **Industry rule today:** Netflix's Hebrew guide says "Always match the tone of the original content… replicate tone, register, class, formality, etc. in the target language in an equivalent way" [doc]. Source: [Netflix Hebrew Timed Text Style Guide](https://studiopartner.netflix.net/studio/hebrew-timed-text-style-guide).
- **Original Israeli prose has moved toward speech.** In the last 30 years (Etgar Keret, Eshkol Nevo), the gap between narration and spoken dialogue has narrowed, and literary language "becomes more and more spoken" [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf), citing Horowitz 2016.

**Our own corpus [repo].**
- **Method:** dialogue lines from all `.ass` files under `subtitles/`. Signs, captions, titles and credits styles were excluded, and override tags and bidi marks stripped.
  - Human `* He.ass`: 20 files, 7,056 lines, 31,428 tokens.
  - AI `*he.ass`: 343 files, 130,772 lines, 586,791 tokens.
  - Rates are per 10,000 Hebrew tokens.
  - The script is at `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/register-map/scripts/marker_rates.py`.
  - The human corpus is small and comes from different arcs, so counts under about 5 are noise.

| Marker | Human /10k (n) | AI /10k (n) | Reading |
|---|---|---|---|
| האם (question particle) | 0.95 (3) | 12.30 (722) | **largest gap; AI ≈13×** |
| עתה (incl. לעת עתה, זה עתה, מעתה) | 0 (0) | 1.50 (88) | AI-only |
| זה עתה / לעת עתה / עד כה | 0 / 0 / 0 | 49 / 36 / 15 hits | AI-only |
| כעת | 0 | 0.24 (14) | AI-only |
| אכן | 0.32 (1) | 2.39 (140) | AI ≈7.5× |
| כה + adjective | 0 | 35 hits | AI-only |
| אינך / אינם‑אינן / אינו‑אינה | 0 / 0 / 0.32 (1) | 15 / 20 / 57 hits | AI-only or 3× |
| הינו / הינה / הנני | 0 | 0.51 (30) | AI-only |
| אשר / כאשר | 0 | 0.39 (23) | AI-only |
| אנו | 0 | 0.34 (20) | AI-only |
| מוטב | 0 | 0.27 (16) | AI-only |
| חרפה | 0 | 0.22 (13) | AI-only |
| אסיר/ת/י תודה | 0 | 1.06 (62) | AI-only |
| אנא | 0 | 119 hits | AI-only |
| כצפוי מ… | 0 | 5 hits | AI-only (calque of "as expected of") |
| לאחר (any) / לאחר מכן | 0.32 (1) / 1 hit | 1.12 (66) / 23 hits | The raw לאחר count is inflated by false positives: «לאחר» = "to another" («ממקום אחד לאחר») and «לאחר כך» = ל + אחר כך ("for later", which is fine). The clean signal is **לאחר מכן: 23 AI vs. 1 human** |
| אולם, (= "however") | 0 | 50 hits | AI-only (excluding אולם = "hall") |
| הרי / ובכן / לכן / כמובן | 2.2 / 3.8 / 1.9 / 2.2 | 7.4 / 8.3 / 3.5 / 4.6 | AI 1.8–3.3× (neutral words, overused) |
| אדוני | 0.95 (3) | 8.5 (499) | AI ≈9× (arc mix may inflate this) |
| הסתכל (everyday "look") | 1.59 | 7.41 | AI uses the everyday verb more: good |
| Future-as-imperative (תתכונן, תיזהר, תקשיב…) | 9.23 | 19.33 | AI is fine here |
| Classical imperative (התכונן, היזהר, הקשב…) | 6.68 | 5.96 | similar |
| ללא | 3.18 (10) | 2.03 (119) | **human uses it**, in set phrases: «ללא פגע», «ללא חת», «ללא תשלום», «ללא שכר» ("unscathed, fearless, unpaid") |
| עבור / מכיוון ש… / בהחלט | 2.23 / 2.23 / 9.5 | 0.73 / 2.54 / 3.8 | human tolerates these neutral-written items |
| יאללה / יופי | 0.32 / 0.32 | 3.54 / 2.74 | AI sprinkles these 9–11× more than human |
| אחי / בחיי / אין מצב / מה נסגר | 19.1 / 6.4 / 7.0 / 0.3 | 2.2 / 1.3 / 3.3 / 0.03 | human uses these spoken markers far more. אחי also means "my brother" (Luffy/Ace), so that one is ambiguous |

### Inferences
- **What is "tolerated on screen" vs. "literary", calibrated to our human gold [mine + repo]:**
  - **Tolerated:** neutral-written connectors and adverbs (לכן, מכיוון ש, הרי, ובכן, כמובן, בהחלט, אחר כך); the preposition עבור; ללא *inside set phrases*; ביותר; short pa'al imperatives; and 1st/2nd-person subject drop.
  - **Literary (zero or near-zero in the human gold):** האם, כעת/עתה and its compounds, אכן, כה, אינני/אינך/אינו/אינם, הינו/הנני, אשר/כאשר, אנו, מוטב, חרפה, אנא, אסיר תודה, שמא, בטרם/טרם, object suffixes on verbs.
- The AI's register problem is **not** a lack of slang. It already overuses some spoken tokens (יאללה, יופי). The problem is a **thin layer of written-formal function words**: the "glue" of the sentence. Each one costs nothing in meaning but moves the whole line into a written register. [mine, from the repo counts]
- Relay translation from English plausibly drives several items [mine]:
  - האם (from English "Is it…?" / "Do you…?")
  - אכן ("indeed" / "sure enough")
  - כצפוי מ ("as expected of", itself a Japanese さすが calque in the English)
  - אסיר תודה ("grateful")
  - לאחר מכן ("afterwards")
  - אולם ("however")
  - Treat these as **English-triggered** words to re-check on every line.
- The historical elevated norm (Weissbrod, Ben-Shahar, Bar-Ziv Levy) is a likely source of the AI's sense that "translated Hebrew dialogue" sounds formal. Its training text includes decades of normative translated Hebrew. [mine, hypothesis]

### Gaps
- I found no study measuring which formal items Israeli viewers accept in contemporary streaming subtitles. The "tolerated" list is calibrated only on our 20 human files.
- The author and year of the *Leshonenu La'am* 49(2) subtitling article could not be read (403).
- Ben-Shahar's full texts were bot-blocked. Her three "modes" are reported from search summaries only.

---

## Key Question 3: What does the Academy of the Hebrew Language say about register (משלבי לשון) and about accepting colloquial forms?

### Takeaway
The Academy separates **תקנית** ("standard": conforming to its rulings) from **תקינה** ("correct": good, careful Hebrew without errors, not necessarily rule-bound). It treats many spoken alternatives as **matters of style and register, not error**. Its ruling on the future used as an imperative says so explicitly: leave it alone in speech, and avoid it only in formal or high register. So natural spoken dialogue is fully legitimate in the Academy's own terms.

### Cited Findings
- The Academy's definition of correct Hebrew [doc]. Source: [Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf), quoting the Academy's site.
  - The Academy's page «עברית תקנית ועברית תקינה» defines correct Hebrew as «לשון טובה ומוקפדת — ללא שגיאות, אך לאו דווקא בעקבות היצמדות מכוונת לכללים ולהחלטות» ("good, careful language without errors, but not necessarily through deliberate adherence to rules and rulings"). Standard language is "mainly" correct language that follows the norms set in spelling, inflection, terminology and so on.
  - The Kaye authors add: "even the Academy tries to balance the norms of written language and grammar against the standard usage of speakers today".
- The Academy's ruling on future-as-imperative (page «עתיד בתפקיד ציווי», published 10 Jan 2012, updated 20 Jul 2017) [doc, secondary source]. Source: [Elon.io, "Over-Using the Classical Imperative"](https://elon.io/grammar/hebrew/errors/imperative-overuse), quoting the page via a Wayback snapshot of 23 Apr 2025.
  - «סיכומו של דבר: שאלת השימוש בעתיד בתפקיד ציווי היא בעיקרה שאלה של סגנון … ויש שאינם רואים להתערב בשימוש הזה בלשון הדיבור, אך ממליצים להימנע ממנו בלשון רשמית ובמשלב גבוה» ("In sum, it is mainly a question of style… some see no reason to intervene in speech, but recommend avoiding it in formal language and high register").
  - The same page: "the imperative forms have not disappeared from speech; for some verbs they are the normal forms, such as לך, בואו, קחי".
  - It also notes that speech has coined non-standard imperatives by dropping the future prefix (סתלק, כנסו).
- The Academy's position on inflected יש (ישנו): "first of all stylistic"; plain יש is "simpler and commoner at every level" [doc, secondary source]. Source: [Elon.io, יש and אין](https://elon.io/grammar/hebrew/sentences/yesh-ein).
- In the Academy's 2020 public online poll, «יאללה» was voted third as "the slang word we can't do without". The Academy actively engages with slang, not only rejecting it [doc]. Source: [Hebrew Wikipedia, "יאללה"](https://he.wikipedia.org/wiki/%D7%99%D7%90%D7%9C%D7%9C%D7%94), citing the Academy's results page for Hebrew Day 5781.
- Broadcasters' language advisers "respect the decrees" of the Academy "but each interprets them in his own way". The IBA translation department tried to follow Academy recommendations "as far as possible, but it all depends on the type of film" [doc]. Source: [Kaufmann 2002, *Meta*](https://doi.org/10.7202/003293ar).
- The Academy does not control usage: it opposed «גיבוי» ("backup/support"), which the public adopted anyway. Its coinages «יַחְדָה / נֶגְדָה» (for coalition/opposition) did not catch on [doc]. Source: [Rosenthal interview, Open University](https://www.openu.ac.il/hasifa/articles/2009-09/ruvik_rosen.html).
- From the 1950s, Haim Rosén and Haim Blanc argued that Israeli Hebrew is a stable system in its own right, and that many "errors" are natural language processes. Their view eventually prevailed in scholarship, though normative writing continued [doc]. Source: [Hebrew Wikipedia, "עברית ישראלית"](https://he.wikipedia.org/wiki/%D7%A2%D7%91%D7%A8%D7%99%D7%AA_%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA).

### Inferences
- The Academy's framework gives a principled target for subtitles: **תקינה, not necessarily תקנית**. That means correct spelling, agreement and grammar (which the project already enforces) in the spoken register, using spoken forms the Academy itself calls stylistic choices: future-as-imperative, אני לא, של, אותו. [mine]
- Keep the line between **spoken-but-correct** and **substandard**. Forms like «אני ילך» (for אלך, "I'll go"), «יותר עדיף» ("more better") or «איך ש…» ("how that…") are substandard. Characters may use them deliberately (street voice), but the narrator-neutral voice should not. [mine; RAMA marks «אחרי איך ששרת» as containing an error, doc]

### Gaps
- I did not retrieve an Academy document that defines named register levels or lists accepted colloquial forms. A direct read of hebrew-academy.org.il pages («עתיד בתפקיד ציווי», «עברית תקנית ועברית תקינה») is recommended; the site returned 403 to my fetcher.

---

## Key Question 4: How do formality, politeness and character voice work in modern Hebrew without archaic forms?

### Takeaway
In modern Hebrew, formality comes from **vocabulary choice, completeness of sentences, address forms and politeness frames**, not from biblical syntax or bound morphology. Politeness lives in the **frame around the verb** («אולי תוכל…», בבקשה, תודה), not in the imperative form. Character voice is built by giving each character a **register bundle**. Hebrew fiction and sketch comedy do exactly this.

### Cited Findings
- Hamichlol's description of how fiction marks characters by register [doc]. Source: [Hamichlol, "משלב"](https://www.hamichlol.org.il/%D7%9E%D7%A9%D7%9C%D7%91).
  - The HaGashash HaHiver sketch «חושחש הנחש» pits a cop speaking colloquial Hebrew against a criminal speaking slang and a passer-by speaking florid Hebrew. The passer-by says «הנה התעודות, פשפש בהן ככל רצונך» ("here are the papers, search them as you please"), and the cop mishears פשפש ("search") as "bedbug".
  - In Grossman's novel, the narrator uses standard Hebrew "with a slight florid tendency". The teens use future-for-imperative, a criminal has a substandard pronunciation, a religious girl uses «ישתבח שמו» ("praised be His name"), and an Arabic-influenced speaker uses «אחלה» ("great").
  - Classic literature, by contrast, is **register-uniform**: in Streit-Wurzel's *Alifim*, every character, from privileged kids to at-risk youth to teachers, speaks the same correct standard Hebrew. This is the failure mode to avoid.
- Politeness [doc, secondary source]. Source: [Elon.io, imperative page](https://elon.io/grammar/hebrew/errors/imperative-overuse).
  - "Neither תעביר nor הַעֲבֵר is rude and neither is polite… What softens a Hebrew request is the frame around the verb": «אולי תוכל להעביר לי…» ("maybe you could pass me…").
  - «תעביר לי את המלח» ("pass the salt") "is complete as it stands" at a family table.
  - The classical imperative to a friend sounds "pitched like a written instruction from a superior". The page's example is «שלח לי את הקובץ עד סוף היום» ("send me the file by end of day"), against the colleague's «תשלח לי… אין לחץ» ("send me… no rush").
- Addressing a stranger: «סליחה» ("excuse me") is neutral, «אחי» informal, «אדוני / גברתי» formal [doc, secondary source]. Source: [Elon.io register-mismatch](https://elon.io/grammar/hebrew/errors/register-mismatch).
- Address forms carry social meaning: friendly «אחי», patronising «אבאל'ה», army «גיבור/תותח/גבר», provocative «גיבֶרת», and «אדוני» turned hostile by intonation [doc]. Source: [Rosenthal 2006](https://www.ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2006/14042006.aspx).
- «אנו» is "more formal, institutional, or rhetorical", for example in official announcements («אנו מבקשים להודיעכם…», "we wish to inform you…"). «אנחנו» is normal everywhere else [doc]. Source: [Settemilalingue](https://www.settemilalingue.com/en/languages/he/grammar/spoken-vs-written-hebrew).
- Kinship suffixes («בני», "my son") are preferred in speech to «הבן שלי». «אבי / אמי» are elevated, while «אבא שלי / אמא שלי» are everyday [doc]. Sources: [Wikipedia, Modern Hebrew grammar](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar); [Elon.io possessive pronouns](https://elon.io/grammar/hebrew/pronouns/possessive-pronouns).
- Netflix: replicate "tone, register, class, formality… in an equivalent way" [doc]. Source: [Netflix Hebrew guide](https://studiopartner.netflix.net/studio/hebrew-timed-text-style-guide).

### Inferences: voice bundles for One Pace [mine]
| Voice | Gets | Never gets | Example (EN gist → HE) |
|---|---|---|---|
| **Formal elder / admiral / king** (Whitebeard, Sengoku, Rayleigh, Kokoro-style elders) | Full sentences; neutral-written connectors (לכן, אם כך, ובכן, בהחלט); polite frames (בבקשה, תודה לך, סלח לי); kinship suffix where natural («בני», «בניי» for Whitebeard's "my sons" as a marked choice); proverbs in **modern** wording; vows may use «לעולם» | האם, אינני, object suffixes (הצלתיך), הנני, כעת, אשר, biblical VS order | "I am grateful to you" → «אני מודה לך.» ("I thank you") not «אני אסיר תודה לך.» |
| **Neutral / everyman** (Nami, Usopp, Chopper, most Marines) | Spoken SVO, future-imperative, איך/למה/איפה, של, אותו; one discourse marker at most (טוב, רגע, נו, שמע); נכון? tags | Any item from the literary column | "As expected of the Marines." → «לא סתם זה הצי.» ("It's not for nothing they're the Navy") |
| **Rough / street** (Zoro, Sanji, Franky, Luffy, pirate grunts) | Short clauses, emphatic fronting («את זה אני לא שוכח!», "THAT I don't forget!"), slang markers (יאללה, אחי, מה נסגר, אין מצב, בחיים לא), insults at the English tier, «עוף מפה» ("get lost") | Neutral-formal glue (ובכן, אכן, לכן) except for irony | "Get ready, world!" → «עולם, תתכונן — אני בא!» ("World, get ready, I'm coming") |
| **Theatrical villain** (Moria, Doflamingo, Crocodile, CP9) | *Marked* high vocabulary for flavour (מזימה, עלובים, ביזיון, רבותיי), rhetorical questions, but **modern syntax**; at most **one** marked high word per line | Stacked archaisms (אינכם, הנני, האם, ראיתיכם); biblical word order | "What a disgrace!" → «איזה ביזיון!» ("What a disgrace!") rather than «זאת חרפה!» |
| **Military Marines / soldiers** | Israeli army register: «המפקד» ("commander"), «כן, המפקד!» ("yes, sir!"), infinitive orders («להסתער!», "charge!"; «לסגת!», "fall back!"), bare imperatives in battle («אש!», "fire!"; «היכון!», "ready!") | «אדוני» for every "sir" (AI uses it 9× the human rate) | "Yes, sir!" → «כן, המפקד!» |

---

## Actionable rules for our translator
Ranked by expected impact. The ranking combines how often the pattern appears in the AI corpus with how jarring it is. Each rule gives: **pattern → why unnatural → natural alternative(s) → example**.

1. **Drop the question particle האם.** (AI 722 hits vs. human 3.)
   - **Why:** yes/no questions in speech and neutral writing are marked only by the question mark and intonation; האם is formal written ([Elon.io](https://elon.io/grammar/hebrew/errors/register-mismatch)). It is usually triggered by English "Is it…? / Do you…?".
   - **Instead:** delete it; or open the line with a spoken frame (מה, זה…?, רגע, אתה רוצה ש…?).
   - **Example:** «האם הוא יזיז את ההר הזה?!» ("Will he move this mountain?!") → «הוא יזיז את ההר הזה?!» or «מה, הוא באמת יזיז את ההר הזה?!»

2. **Replace time adverbs from the עתה/כעת family.** (AI 88 + 14 + 15 hits vs. human 0.)
   - **Why:** literary or written time words ([RAMA](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf) pairs «עד עכשיו» with «עד עתה» as the high form).
   - **Instead:**
     - כעת / עתה → **עכשיו**
     - לעת עתה → **בינתיים / כרגע**
     - זה עתה → **הרגע / עכשיו בדיוק**
     - עד כה → **עד עכשיו**
     - מעתה (והלאה) → **מעכשיו / מהיום**
   - **Example:** «חרב הדרגה הגדולה שזה עתה השגתי» ("the great-grade sword I've just obtained") → «החרב מהדרגה הגדולה שהרגע השגתי».

3. **Use spoken negation, not inflected אין.** (AI אינך 15, אינם 20, אינו/אינה 57; human about 1.)
   - **Why:** אינני/אינך/אינו are formal; mixing them into spoken lines is the classic register collision ([Elon.io](https://elon.io/grammar/hebrew/negation/ein)).
   - **Instead:** **אתה לא / הוא לא / הם לא**; and «הוא איננו» → «הוא כבר לא פה / הוא איננו (only for "he's gone", F voice)».
   - **Example:** «אם אינך רוצה להישאר על הספינה הזאת…» ("If you do not wish to stay on this ship…") → «אם אתה לא רוצה להישאר על הספינה הזאת…»

4. **Check English-triggered formal words on every line.**
   - **Why:** these are grammatical, but they are written-register glue that no human line in our gold uses.
   - **Instead:**
     - אכן (140) → **באמת / נכון / בדיוק / צדקת**
     - אסיר תודה (62) → **אני מודה לך / תודה / אני חייב לך**
     - אנא (119) → **בבקשה / נו / (drop it)**
     - כה (35+) → **כל כך / כזה**
     - אנו (20) → **אנחנו**
     - מוטב (16) → **עדיף / כדאי / שיהיה**
     - חרפה (13) → **בושה / ביזיון**
     - אשר / כאשר (23) → **ש / כש**
   - **Example:** «מוטב שנכסה את התקרית הזו!» ("It'd be best that we cover up this incident!") → «עדיף שנטשטש את כל הסיפור הזה!» ("We'd better hush this whole thing up!")

5. **Replace the "as expected of X" family.**
   - **Why:** «כצפוי מ…» and «לא פחות ממה שאפשר לצפות מ…» calque English "As expected of…", which itself translates Japanese さすが. Hebrew has no such formula in speech. [mine]
   - **Instead:** «לא סתם [זה X] / מה הפלא, [X] / טוב, זה X / ברור, [X]».
   - **Examples:**
     - «כצפוי מכל כוחות הצי.» → «לא סתם זה הצי.»
     - «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» → «מה הפלא, הוא הפליג עם מלך הפיראטים!» ("No wonder, he sailed with the Pirate King!")

6. **Prefer active voice with a generic subject over passive and nominal syntax.**
   - **Why:** passive and huf'al/pu'al are rare in speech ([Wikipedia](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar)). Abstract-noun subjects read like an essay.
   - **Instead:** a 3pl impersonal («הולכים ל…», «עצרו אותו»), or a verb clause instead of a noun («כשהוא יחזור» instead of «עם שובו»).
   - **Examples:**
     - «אייס הולך להיות מוצא להורג» → «הולכים להוציא את אייס להורג» (user-approved)
     - «הבהלה הזאת ממש נוחה לנו» ("This panic is very convenient for us") → «הבלגן הזה רק משחק לטובתנו» ("This chaos only plays in our favour") [mine]

7. **Swap bookish verbs and nouns for everyday ones** (full tables in KQ1).
   - **Why:** register is decided mostly by vocabulary ([Kaye 2025](https://kaye.ac.il/wp-content/uploads/2025/12/Lexi-Kaye-23-משלבים-בעברית.pdf)).
   - **Instead:**
     - ציווה → **אמר / נתן פקודה**
     - החל → **התחיל**
     - שב → **חזר**
     - נטש / זנח → **עזב / ויתר על**
     - ניצב → **עמד**
     - הביט → **הסתכל**
     - חרד → **פחד / דאג**
     - מטלטל → **בהלם / מזעזע**
   - **Example:** «אבא ציווה לשמור על האח של אייס בחיים!» ("Father commanded to keep Ace's brother alive!") → «אבא אמר שהאח של אייס חייב להישאר בחיים!» ("Pops said Ace's brother has to stay alive!") [mine]

8. **Restore spoken word order; no literary parallelism.**
   - **Why:** a postponed definite subject or fronted object sounds formal or archaic ([Wikipedia](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar)). RAMA lowers register by undoing it ([RAMA](https://meyda.education.gov.il/files/Rama/task_heb_hatab_text_t.pdf)).
   - **Instead:** SVO; front something only to stress it, and only in a rough or excited voice.
   - **Example:** «גילוי רודף גילוי, וכולם מטלטלים.» ("Discovery chases discovery, and everyone is shaken") → «כל רגע מתגלה משהו חדש, וכולם בהלם.» ("Every moment something new comes out, and everyone's in shock") [mine]

9. **Use object pronouns and של, not suffixes.**
   - **Why:** verbal object suffixes are biblical or poetic, and noun possessive suffixes are written-formal ([Wikipedia](https://en.wikipedia.org/wiki/Modern_Hebrew_grammar); [Elon.io](https://elon.io/grammar/hebrew/smichut/suffixes-register)).
   - **Instead:** «הצלתי אותך», «הספינה שלנו».
   - **Exceptions:** kinship (אחי, בני, אשתי) and set phrases (לדעתי, לצערי, מצידי, בעיניי).
   - **Example:** «מכוניתי» → «האוטו שלי»; «ראיתיו» → «ראיתי אותו».

10. **Keep imperatives spoken for derived binyanim.**
    - **Why:** the Academy calls future-as-imperative a style choice that is fine in speech ([Academy via Elon.io](https://elon.io/grammar/hebrew/errors/imperative-overuse)); the classical form in the derived binyanim sounds like signage.
    - **Instead:** **תתכונן / תיזהר / תקשיב / תסתכל / תעוף מפה**. Keep short pa'al imperatives (בוא, לך, קח, תן, קום, שב), and use bare imperatives or infinitives for battle orders («אש!», «להסתער!»).
    - **Example:** «תתכונן לקראתי, עולם!» (the problem is לקראתי + calque, not the verb) → «עולם, תתכונן — אני בא!» [mine]

11. **Use the right idiom, in its exact Israeli form.**
    - **Why:** a near-miss idiom («נושם בעורף») or a non-Hebrew collocation («תופעות לוואי מכוערות», "ugly side effects") makes the reader stop more than any single bookish word. [mine + user examples]
    - **Instead:** «נושף בעורף», «שיחק לנו המזל», «הלך עלינו», «איזה זיכרונות», «גם עכבר בפינה יכול לנשוך». When unsure of an idiom, use **plain words** rather than a guessed idiom.
    - **Example:** «שליט הגיהנום כבר נושם בעורף.» → «שליט הגיהנום כבר נושף לנו בעורף.» ("The ruler of hell is already breathing down our necks")

12. **Connectors: spoken by default, neutral-written only for F voice.**
    - **Why:** neutral-written items are tolerated (human uses לכן, מכיוון ש, ובכן, הרי, בהחלט), but literary ones are not (אולם, אך, לאחר, לפיכך, שמא, בטרם, טרם, אילו).
    - **Instead:**
      - אולם / אך → **אבל**
      - לאחר → **אחרי**
      - לאחר מכן → **אחר כך / אחרי זה** (AI 23 vs. human 1)
      - Note: «לאחר כך» meaning "for later" (ל + אחר כך, as in «נשמור את זה לאחר כך», "we'll save it for later") is ordinary spoken Hebrew. Don't "fix" it.
      - שמא → **אולי / מה אם**
      - בטרם → **לפני ש**
      - טרם → **עוד לא**
      - אילו → **אם…היה**
    - **Example** [mine, constructed]: «אולם, אין לנו זמן לזה.» ("However, we have no time for this.") → «אבל אין לנו זמן לזה.»
    - **Example from the AI corpus:** «וזמן קצר לאחר מכן ביסס את החברה שלו…» ("and shortly thereafter he established his company…") → «וזמן קצר אחרי זה הוא הקים חברה משלו…» ("and soon after that he set up his own company…").

13. **Check every line for one-token register collisions** (detection rule).
    - **Why:** "register comes in bundles" ([Elon.io](https://elon.io/grammar/hebrew/errors/register-mismatch)). One literary token in a spoken line is what makes the viewer pause.
    - **Instead:** flag any line that contains a **literary-list token** (האם, כעת, עתה, אכן, כה, אינני/אינך/אינו/אינם, הינו/הנני, אשר, כאשר, אנו, מוטב, חרפה, אנא, אסיר תודה, שמא, בטרם, טרם, «אולם,» with a comma (bare אולם is usually "hall"), לאחר מכן, בעבור, אודות, כצפוי מ, -נוהו/-תיהו object suffixes) **and** a **spoken-list token** (אני לא, איפה, איך, למה, של, אותו, תעשה-type future imperative, יאללה, נו, אחי). Rewrite the literary token.
    - **Whitelist (known false positives):** לעת עתה in a formal voice; «לאחר כך» meaning "for later"; «עוד מעט»; «ללא» inside set phrases (ללא פגע, ללא חת, ללא ספק); «אולם» = "hall".
    - **Example:** «מהיום, אנו מכירים בך כארכיאולוגית!» ("From today, we recognise you as an archaeologist!") → «מהיום, אנחנו מכירים בך כארכיאולוגית!»

14. **Don't fake naturalness by sprinkling slang tokens.**
    - **Why:** AI uses יאללה 11× and יופי 9× the human rate, while the human uses address and reaction markers (אחי, בחיי, אין מצב, מה נסגר) far more. Slang that isn't anchored in a character or reaction reads as forced. Rosenthal notes that most media-spread slang doesn't last, so trendy slang dates quickly ([Rosenthal](https://www.openu.ac.il/hasifa/articles/2009-09/ruvik_rosen.html)).
    - **Instead:** at most one marker per line; tie it to the voice (R voice: יאללה/אחי; N voice: טוב/רגע/נו); use reaction phrases (אין מצב!, בחיי!, מה נסגר?!) where English has "No way!/Man!/What the hell?!".
    - **Example:** «יופי! היא החזירה אתכן מאבן!» ("Great! She brought you back from stone!") → «וואו, היא החזירה אתכן לחיים!» ("Wow, she brought you back to life!") or keep it, if the English says "Great!". [mine]

15. **Address forms: Israeli-military for Marines, אדון/גברת + name for -san, אדוני sparingly.**
    - **Why:** «אדוני» for every "sir" is 9× the human rate; Israeli military speech says «המפקד» ([Rosenthal](https://www.ruvik.co.il/%D7%94%D7%98%D7%95%D7%A8-%D7%94%D7%A9%D7%91%D7%95%D7%A2%D7%99/2006/14042006.aspx) on army-derived address) [mine for המפקד].
    - **Instead:** a Marine to a superior: **«המפקד»** / «כן, המפקד!»; a butler or servant: «אדוני»; strangers: «סליחה» / «אתה שם».
    - **Example:** «כן, אדוני!» → «כן, המפקד!»
