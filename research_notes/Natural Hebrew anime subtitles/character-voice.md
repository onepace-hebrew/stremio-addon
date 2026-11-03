# Character voices in Hebrew subtitles: formal, old, royal, samurai, warden, villain and comic speech without archaic or bookish Hebrew

Scope: how to give each One Pace speaker a distinct Hebrew voice (formal, old, royal, samurai-like, warden, villain, comic) while staying in contemporary spoken Israeli Hebrew. Sources are translation-studies papers on Hebrew register, Hebrew translators and subtitlers, research on Japanese "role language", and an audit of this repo's he.json files (IM, MA, AM, SAB, TB, PEN) measured against the 20 human-translated `He.ass` files.

Conventions in this file:
- Every outside claim has a URL. My own judgment is labelled "(my judgment)".
- Corpus facts come from my scripts under `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/voice/scripts/` (scan.py, scan2.py, enmark.py, rate.py, byname.py). They are cited as "repo corpus" with an `EP:index` reference.
- Hebrew examples sit on their own lines, each with a short English gloss. Tables contain no Hebrew.

---

## Q1. How do Japanese→Hebrew translators (literary, manga/anime) describe rendering politeness levels and character speech in Hebrew?

### Takeaway
Hebrew has no grammar for keigo or for Japanese first-person pronouns. Japanese→Hebrew translators say these nuances get lost, and that in relay translation through English "most decisions were already made" by the English translator. Practitioners do not imitate the Japanese machinery. They keep the effect of a speech type with one or two lexical markers and forms of address. Japanese role language (washi/ja for old men, sessha/de gozaru for samurai, desu wa for young ladies) is a stereotype that Japanese viewers recognise in a single line, and nothing in Hebrew corresponds to it grammatically. The safe move is a "light touch" of words and address forms, not costume grammar.

### Cited Findings
- **Role language is a recognised stereotype.** Kinsui and Yamakido define role language as "a set of spoken language features (such as vocabulary, grammar and phonetic characteristics) that can be psychologically associated with a particular character type" (age, gender, occupation, status, personality). — [Moretti thesis citing Kinsui & Yamakido 2015](https://iris.unive.it/retrieve/1d5e1ba8-d429-433f-89f1-c5424f26a8de/856159.pdf)
- **Its main markers are pronouns and sentence endings.** Old man/doctor: *washi* + *-ja*. Samurai: *sessha* + *-gozaru*. Rich young lady (ojou-sama) has its own markers. Old-man language mostly appears in manga and children's SF, not in novels or realistic adult drama. — [DiVA thesis summarising Kinsui 2003](https://www.diva-portal.org/smash/get/diva2:1238267/FULLTEXT01.pdf)
- **Three kinds of fictional old man.** Kinsui sorts them into the mentor who gives knowledge, the cunning villain with strange power, and the confused bumbler who softens things. — [DiVA thesis](https://www.diva-portal.org/smash/get/diva2:1238267/FULLTEXT01.pdf)
- ***-gozaru* changed meaning over time.** It once suggested arrogant old people. In Meiji–Showa fiction its image shifted to "royalty and well-mannered", and it passed to samurai and ninja. — [DiVA thesis citing Akizuki 2015](https://www.diva-portal.org/smash/get/diva2:1238267/FULLTEXT01.pdf)
- **In fiction, washi/ja simply means "old and wise".** The forms resemble old western-Japanese speech, but on screen they carry no regional meaning. — [Unihongo](https://unihongo.com/japanese-dialects-in-anime-and-drama)
- **Three strategies for translating role language** (practitioner blog, not peer-reviewed):
  - **Costume**: each type gets a stock English voice (archaic "thou/indeed/young one" for the sage). Downside: "a Japanese sage sounds like a Tolkien wizard".
  - **Flattening**: everyone speaks standard English. This loses characterisation.
  - **Light touch**: "one or two markers per type, a verbal tic, a form of address", held steady for the whole work. The author calls it the hardest to apply but the best when it works. — [Crossleaf blog, 2026-10-26](https://crossleaf.app/blog/old-man-speech-light-novels)
- **Spanish behaves similarly** (Fukushima's study of Japanese role language in Spanish translation):
  - Spanish has no common role language for "doctors" or "young ladies".
  - The archaic *vos* acts as role language for people of past eras in popular comics.
  - Translators normally use the standard register rather than substitute a local dialect "unless necessary".
  - A samurai's imperious line came out in Spanish "free of this peculiar style". — [Fukushima, Cuadernos CANELA XXIII](http://www.canela.org.es/cuadernoscanela/canelapdf/Vol.%20XXIII/01-Fukushima.pdf)
- **Relay translation inherits the English translator's choices.** A 2012 survey of Japanese→Hebrew translators (Cooper, Doron B. Cohen, Shahal-Porat, Raz, Weiss, Dalyot-Bul, Or) found:
  - A Hebrew translator working from an English version "is not aware of the options in the source"; "most of the translation decisions were already made for him, without his knowledge".
  - Hebrew translation tradition is described as faithful, while English translations "adapt, expand and change the source to English norms".
  - Doron B. Cohen: some Japanese authors tend towards vagueness and indirectness, "a trait that is not accepted in Hebrew".
  - Einat Cooper places difficulty on a scale, from Murakami's "modern, minimalist" language to Tanizaki's "higher, richer, syntactically complex" and more traditional Japanese expression. — [Targima 2012 (PDF)](https://yaeltranslation.com/wp-content/uploads/2012/08/targima_2012_2.pdf)
- **Keigo nuances are lost in relay.** A guest post on keigo says a book translated into Hebrew from English "will probably miss" keigo nuances. Its example: shifting from a title to *anata* ("you") can signal intimacy, and a Hebrew reader "would not notice the word at all". — [Michal Hadad on התרגומיה, 2012](https://yaeltranslation.com/2012/01/29/)
- **A Hebrew manga translator working from English (the same relay as ours) handles honorifics this way:**
  - -san → Mr/Mrs (מר/גברת).
  - -sama → אדון/גברת/לורד/"הנכבד", depending on context.
  - -chan → invent a Hebrew pet name.
  - -kun → delete it ("there is no Hebrew parallel").
  - Her principle: translate what has a sensible Hebrew equivalent, otherwise transliterate or delete. — [Galit Dotan, 2025](https://www.galitdotan.com/post/%D7%92%D7%91%D7%A8%D7%AA-%D7%A2%D7%95%D7%A8%D7%9B%D7%AA-%D7%90%D7%95-%D7%A2%D7%95%D7%A8%D7%9B%D7%AA-%D7%A1%D7%90%D7%9E%D7%94-%D7%93%D7%99%D7%9C%D7%9E%D7%AA-%D7%94%D7%AA%D7%A8%D7%92%D7%95%D7%9D-%D7%9E%D7%99%D7%A4%D7%A0%D7%99%D7%AA)
- **Translators and their reputations:**
  - Einat Cooper is the official Hebrew translator of Murakami from Japanese, praised "mainly for stylistic faithfulness to the Japanese language". — [Hebrew Wikipedia: עינת קופר](https://he.wikipedia.org/wiki/%D7%A2%D7%99%D7%A0%D7%AA_%D7%A7%D7%95%D7%A4%D7%A8)
  - An interview with Cooper covers her career, but not dialogue technique. — [Calcalist 2023](https://www.calcalist.co.il/style/article/rjbkkgn5o)
- **What the One Piece sources the English is relayed from encode, per character:**
  - *Washi* users: Jinbe, Garp, Sakazuki (Akainu), Kaku, Tom, Clover, Saul, Neptune. — [One Piece Wiki, First Person Pronoun Usage](https://onepiece.fandom.com/wiki/First_Person_Pronoun_Usage)
  - Sakazuki/Akainu speaks Hiroshima dialect (Kure area): 「誰がここを守るんじゃァ」. — [onepiece-log](https://onepiece-log.com/blog-entry-331.html); [Mangapedia](https://mangapedia.com/gd/fsf1rindy)
  - Hiroshima dialect is "usually considered the stereotypical Yakuza dialect". — [Cosbooru wiki](https://cos.booru.nl/wiki_pages/hiroshimaben)
  - Jinbe ends sentences with *ja*. Ivankov uses "~nabul" and "Vanata" and calls people "X-boy". Hannyabal turns "masu" into "mash(u)". — [mixi One Piece community list](https://mixi.jp/view_bbs.pl?comm_id=3658538&id=51836311)
- **Brook's politeness is a gag.** In a speech-and-personality study, Brook is the only male Straw Hat who uses *watashi*. He uses honorific language "consistently regardless of the addressee", even in monologue, and avoids dialect. The politeness "does not always signify genuine respect": he says rude things in polite form. — [Meiji University paper on role language and personality](https://meiji.repo.nii.ac.jp/record/9611/files/kokunichikenkyuron_15_1_en.pdf)
- **Straw Hat registers in Japanese** (fan analysis, moderate reliability):
  - Luffy: all casual, never polite.
  - Zoro: rough (*teme*, *kisama*).
  - Nami: neutral *watashi*, swears.
  - Usopp: *ore-sama* when hyping himself.
  - Sanji: overly formal to women, rude to men (*kuso*).
  - Robin: the only crew member with a default respectful register (*anata*, job+san), no swearing. — [kaizokuou-ni-naru, "how the Straw Hats talk"](https://kaizokuou-ni-naru.tumblr.com/post/189976384782/how-the-straw-hats-talk)
- **Whitebeard is rougher in Japanese than in English.** He calls Luffy *hanatare* ("snot-nosed kid") and *kuso namaiki* ("cheeky little shit"). Where the English has him say "just don't get in my way", the Japanese is harsher: "if you hold me back, I won't forgive you". — [kaizokuou-ni-naru on Marineford](https://www.tumblr.com/kaizokuou-ni-naru/190958760786/luffys-conversation-with-whiteboard-is-one-of-my)
- **Japanese pronoun meanings:** *washi* = elderly, to be respected; *sessha* = archaic masculine (Kenshin); *kisama* = vulgar "you", great hostility. — [MIT, "What's lost in the translation?"](https://www.mit.edu/~rei/manga-translations.html)

### Inferences
- **Our pipeline is a double relay, so the English has already picked the register.** Where official English fansubs rendered role language with English archaisms ("I shall", "Indeed", "hereby", "disgrace", "ordered", "Behold!"), our Hebrew tends to copy that archaism into Hebrew archaism (my judgment, supported by the corpus counts in Q4). The Japanese source was *washi/ja* or a yakuza dialect. Neither of those is "literary"; one means "old" and the other means "tough/regional".
- **The fan-sub's archaic English is a signal, not a register.** Read "I shall / Indeed / hereby / disgrace / ordered" as "this character speaks formally or old-fashioned". Then pick a living Hebrew formal word, not the dictionary equivalent of the English archaism (my judgment).
- **A Hebrew character card should be the "light touch" set:** energy and length, one or two signature address forms or tics, and a short list of banned words. Archaic Hebrew grammar does not belong on it (my judgment, following Crossleaf and Fukushima).

### Gaps
- I found no published interview in which a Japanese→Hebrew translator (Cooper, Cohen, or a manga/anime translator) describes in detail how they render keigo, *washi/ja* or *de gozaru* in Hebrew dialogue. The Targima survey covers relay vs direct translation and vagueness, not dialogue register.
- I could not access the official Hebrew subtitles of One Piece (the Hebrew Wikipedia says a Hebrew-subtitled version arrived in an anime library in December 2022), or the 2006–2009 Jetix Hebrew dub directed by Amichai Bar Tov. Either would be the best direct comparison. — [Hebrew Wikipedia: וואן פיס](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1)
- The claims that Kizaru's mannerisms are modelled on actor Kunie Tanaka and Aokiji's on Yusaku Matsuda are widely repeated, but I did not verify them this session.

---

## Q2. How do Hebrew subtitles and dubs of fantasy and period works render formal or archaic speech? Is archaic Hebrew used sparingly, as flavour?

### Takeaway
Hebrew translation followed an "elevated language" norm for decades: ancient-source vocabulary and syntax everywhere, slang removed. On Israeli TV that norm "has almost vanished". Elevated Hebrew now survives mainly where it is the joke (mock-epic), where it reuses a canonical literary translation (Shakespeare), or in prose fantasy (Livnit's Lord of the Rings). The Tolkien debate itself shows the two models:
- **Uniform high register (Livnit):** loved for its atmosphere, but even orcs speak "pure Hebrew".
- **Per-character register (Lotem):** matches each speaker's voice, criticised for modernising.

The best-regarded high style draws its gravity from short sentences and fixed idioms (צירופים כבולים), not from complex archaic grammar. A Tolkien fan-scholar also notes that spoken "high" Hebrew easily sounds like a comedy sketch.

### Cited Findings
- **Literary translation into Hebrew followed an elevated norm into the 1960s.** "Despite the growing stratification of the language, literary translations into Hebrew were governed by a norm which dictated the use of an elevated style rooted in ancient Hebrew texts. This norm persisted at least until the 1960s." Translators even produced mock-epic effects "independently of the source texts" (Fielding, Runyon, Modesty Blaise, Winnie-the-Pooh). — [Weissbrod 1999, Target 11:2](https://benjamins.com/catalog/target.11.2.04wei)
- **Old Israeli TV subtitles raised the register too.** "The register was often elevated compared with the original. Slang and vulgar phrases were avoided… newly coined Hebrew words with which the public was not acquainted." Language editors corrected deviations. — [Weissbrod 2021, Translation for Israeli television](https://doi.org/10.52034/lanstts.v6i.177)
- **That norm is now mostly gone.** "The language used in the Hebrew subtitles has changed significantly. Slang and vulgarisms in the original dialogue no longer pose a problem. The norm… has almost vanished."
  - A 1992 Channel 1 *Othello* was "abundant with elements of elevated language such as rare grammatical forms, idioms rooted in old canonised Hebrew texts and Aramaic words" (במטותא for "please", צפרא טבא for "good morning").
  - On commercial channels, "elevated language was used only when the translation was based on a pre-existing literary translation". — [Weissbrod 2021](https://doi.org/10.52034/lanstts.v6i.177)
- **Even dubbing has dropped most of the norm.** In the Hebrew dub of *Shrek* the old language norm "has weakened", and the translator used markedly Israeli slang ("akhla deal"). — [Weissbrod 2021](https://doi.org/10.52034/lanstts.v6i.177)
- **Translated fiction of the 1950s–60s was heavily artificial.** It was dominated by "super-standard written language… heavily loaded, learned, abounding with collocations borrowed from ancient written sources and rare words". Its dialogues were "mixed language, mainly modelled on standard and super-standard written language norms, in which certain spoken Hebrew elements were embedded". The 1970s–80s were "still relatively conservative". — [Ben-Shahar 2007, Meta](https://doi.org/10.7202/037226ar)
- **Dialogue is especially prone to bad translation.** Literary dialogue is "a text type highly susceptible to inadequate translation", and some of the reasons are specific to Hebrew. — [Ben-Shahar 1994, Target 6:2](https://www.jbe-platform.com/content/journals/10.1075/target.6.2.05ben)
- **Lord of the Rings: two models, one warning.**
  - Ruth Livnit chose a register "high, bordering on biblical", applied "regardless of the characters": "even the orcs speak pure Hebrew".
  - Emanuel Lotem's 1998 version instead "matched the register to each character as Tolkien intended".
  - The same author warns that in spoken Hebrew "it is hard to find a [high] register that doesn't sound bad, like a HaGashashim or Eretz Nehederet sketch". — [Ran Bar-Zik, נומנור, "פולמוס התרגומים"](https://www.numenore.com/1465/)
- **Livnit's high style rests on idioms and short sentences.** A defence of Livnit says her mythic feel comes from three things:
  - Fixed idioms and quotations from Jewish sources ("pressure points" of shared culture).
  - Short, sharp, concise sentences, "as is customary in Hebrew".
  - Rich vocabulary, not long complex syntax.
  - Key line: "precisely simple language, anchored in sources and in familiar historical expressions, will create a high impression". Also: "high language in itself does not cover mistakes in idioms". — [Shirley Liron, נומנור, "סוד הקסם הלבניתי"](https://www.numenore.com/185/)
- **The debate is about atmosphere versus accuracy.** Livnit "preferred poetry over precision". — [Haaretz 2014](https://www.haaretz.co.il/gallery/literature/2014-09-02/ty-article/0000017f-ed22-d3be-ad7f-ff2b364f0000)
- **Lotem's modernised Tolkien drew lasting criticism.** It is "among the most controversial" projects, with praise and criticism alike (עלפים for בני לילית, plus errors in Hebrew). — [Hebrew Wikipedia: עמנואל לוטם](https://he.wikipedia.org/wiki/%D7%A2%D7%9E%D7%A0%D7%95%D7%90%D7%9C_%D7%9C%D7%95%D7%98%D7%9D)
- **Netflix Hebrew timed-text guide:**
  - "Refrain from adhering to English/source language syntax as this can create awkward, stilted phrasing."
  - "Always match the tone of the original content… replicate tone, register, class, formality, etc. in the target language in an equivalent way."
  - 42 characters per line. Proper names transliterated. — [Netflix Hebrew Timed Text Style Guide](https://studiopartner.netflix.net/studio/hebrew-timed-text-style-guide)
- **A veteran Israeli TV subtitler (Yifat Shomer, Trans-Titles):**
  - The goal is that "the viewer doesn't even notice he's reading a translation".
  - "The most common mistake… is literal translation."
  - She writes אנו instead of אנחנו to save characters. So Hebrew subtitling tolerates some written-register function words for space. — [Makor Rishon 2019](https://www.makorrishon.co.il/culture/article/259707)
- **Ruvik Rosenthal's list of subtitle pitfalls** includes Americanisms that "sound bad in Hebrew" ("זה עושה שכל", "לקחתי מקלחת", "זה הולך בלי לדבר") and literal idioms. — [Rosenthal, "שדות המוקשים של כתוביות התרגום" (2016 talk)](https://www.ruvik.co.il/%D7%A4%D7%99%D7%A0%D7%AA-%D7%A2%D7%99%D7%95%D7%9F/2015/%D7%9B%D7%AA%D7%95%D7%91%D7%99%D7%95%D7%AA.aspx)
- **Dubbing practitioners keep an explicit politeness table** between characters for shows "with dense hierarchies, court etiquette or changing alliances" (The Crown, Vikings: Valhalla). — [Lipsie dubbing-script service page](https://www.lipsie.com/gb/services/dubbing-script-translation.htm)
- **Our own human gold** (repo corpus, 20 `He.ass`, 7,055 dialogue lines) uses high-register items only inside fixed collocations:
  - "ללא פגע / ללא דופי / ללא חת / ללא רחמים / ללא תשלום"
  - "מעולם לא ראיתי…" (about 1.8 per 1,000 lines)
  - "ובכן..." as a hesitation (1.7‰)
  - one "כיצד אוכל לסייע לך?" from a waiter
  - For military "Yes, sir!" it uses "כן, המפקד!" (Buggy's and Krieg's men), and never "כן, אדוני".

### Inferences
- **The target for a shonen anime is Lotem's principle without archaism (my judgment).** Register varies per character, using the living layers of Hebrew:
  - standard/news Hebrew for authority
  - military/police jargon for soldiers and guards
  - folksy-old vocabulary for elders
  - street slang for toughs
  - mock-epic pomp only where it is the joke
- **Archaic syntax reads as parody to Israeli viewers.** Bar-Zik's Gashashim/Eretz Nehederet remark and Weissbrod's mock-epic finding point the same way: in a serious villain line it produces unintended comedy or a "what did I just read?" pause (my judgment, consistent with the user's complaint).
- **Archaic "flavour" is legitimate in three places only (my judgment):**
  1. Fixed idioms everyone knows (במו עיני, יהיה אשר יהיה, ללא רחמים, בסמכותי).
  2. Deliberately pompous comic characters (Celestial Dragons, Hannyabal, Ivankov's announcements, Disco the auctioneer).
  3. Narrator "documentary" lines.

### Gaps
- I did not obtain Hebrew subtitle or dub transcripts of *Game of Thrones*, *Avatar: The Last Airbender* (Iroh), Studio Ghibli films, Kurosawa films or *Pirates of the Caribbean*, so I cannot document how they render "Your Grace / my lord / milady" or a wise old mentor. Next step: download Hebrew .srt files from subtitle sites into the scratch folder and count אדוני / הוד מלכותך / כבודו / אינו / היכן per 1,000 lines.
- I found no Israeli subtitler interview specifically about royal or period register.

---

## Q3. What makes Hebrew sound formal without biblical syntax, and rough without vulgarity? Where is the line between "formal" and "bookish" for a TV audience?

### Takeaway
Register in Hebrew is about 80% lexical. Formality on screen should come from word choice, complete sentences, polite address forms, the absence of slang, and a slower, heavier rhythm, all using words Israelis still say in a formal situation (news, army, court, ceremony). It becomes "bookish" when it switches grammar layers. The tell-tale grammar markers:
- suffixed possessive and object pronouns (ראשו של, ידידיי, אנשיי)
- inflected negation אינו
- היכן / כיצד / מדוע
- predicate fronting (מפחידים אתם)
- the counterfactual לו
- אשר, הנני
- archaic verbs: ציווה, הכריע, הביטו

Roughness comes from clipped imperatives, slang, "יא + insult", "X שכמותך", short insults and dropped politeness, with no need for profanity.

### Cited Findings
- **Most register variation is lexical.** In a study of Hebrew speakers from schoolchildren to adults, "neutral" items made up the bulk of every text, and "the lexicon accounted for some 80% of variation" in register. Text types range "on a cline from everyday colloquial usage in oral narratives to more formal, high-level language in written expository essays". — [Ravid & Berman 2009, Pragmatics & Cognition 17:1](https://www.jbe-platform.com/content/journals/10.1075/pc.17.1.04rav)
- **Suffixed pronouns are a written-register marker.** Suffixed forms (שיחתי) "are found very little in spoken language, more in written language", and "raise the text". Separate forms (השיחה שלי) are typical of speech and lower registers. — [CET (Matach) virtual library, לשון המכתב](https://www.lib.cet.ac.il/PAGES/printitem.asp?item=13743)
- **High register is barely spoken.** High/florid register "is almost not used in everyday language", appearing in literature, academia, speeches and official letters. It is half register, half sociolect of the learned, "which makes it a convenient subject for jokes". The same entry shows Agnon's sentence rewritten in standard and spoken registers. — [Hebrew Wikipedia: משלב](https://he.wikipedia.org/wiki/%D7%9E%D7%A9%D7%9C%D7%91)
- **Formal/spoken pairs** (commercial grammar site, reasonable but not authoritative):
  - Formal connectors: אולם/לפיכך/מאחר ש/אף על פי ש/כאמור. Spoken: אבל/אז/בגלל ש/למרות ש/כמו שאמרנו.
  - "אינו is not a universal decorative replacement for לא."
  - הנני "is not the normal conversational way".
  - "A passage packed with elevated options can sound legalistic, old-fashioned, ironic, or pompous. Conversely, a single formal word in otherwise neutral prose may be exactly right." — [Settemila Lingue, Spoken vs Written Hebrew](https://www.settemilalingue.com/en/languages/he/grammar/spoken-vs-written-hebrew)
- **אינו is present-tense only.** "אינו (and אינה, אינם, אינן) are correct only in the present; past and future take לא". — [Open University, כך נהוג בכתיבה אקדמית](https://www.openu.ac.il/deanacademicstudies/teachandlearn/learning_skiils/writing_center/pages/academic_writing.aspx)
- **Israeli forces say "כן, המפקד", not "כן, אדוני":**
  - Soldiers disguised as policemen on Mount Scopus had to learn to answer "כן, אדוני" "instead of 'כן, המפקד'". So "כן, המפקד" is the IDF norm and "כן, אדוני" belonged to the (Mandate-style) police. — [Maariv, הרב גורן והספר הקדוש](https://www.maariv.co.il/news/israel/article-580629); [Makor Rishon 2022](https://www.makorrishon.co.il/magazine/local-magazine/article/280697)
  - A well-circulated Hebrew subtitle of *The Silence of the Lambs* renders Starling's "Yes, sir" to her FBI superior mostly as "כן, המפקד", with occasional "אדוני". — [subdl Hebrew subtitle preview](https://subdl.com/s/info/LUEbqRoUIS/the-silence-of-the-lambs)
  - A low-reliability phrase guide claims "אדוני" to an Israeli military superior "can sound overly dramatic or even sarcastic". — [howtosayguide](https://howtosayguide.com/how-to-say-yes-sir-in-hebrew/)
- **Profanity should match the source's severity.** Translate swearing "of the same/equivalent severity and intent. Avoid literal or direct translations which may result in a stronger or softer translation." — [Netflix Hebrew Timed Text Style Guide (search excerpt of the same page)](https://studiopartner.netflix.net/studio/hebrew-timed-text-style-guide)
- **Living Hebrew insults that are not vulgar** (Rosenthal's catalogue): אפס, בן אלף, ימח שמו, and the reality-TV string "יא חתיכת אפס מאופס", "יה גנב יה שפל", "איזה איש עלוב נפש". — [Rosenthal 2016](https://www.ruvik.co.il/%D7%A4%D7%99%D7%A0%D7%AA-%D7%A2%D7%99%D7%95%D7%9F/2015/%D7%9B%D7%AA%D7%95%D7%91%D7%99%D7%95%D7%AA.aspx)

### Inferences — the formality toolkit (my judgment, built on the findings above)

**A. Things that make Hebrew formal and still alive (use these for Jinbe, Sengoku, Magellan, Mihawk, Robin, Brook, Rayleigh, the narrator):**
- **Complete sentences with a subject.** No dropped words, no slang particles (אחי, יאללה, סבבה, וואלה, כאילו, חבל"ז).
- **Standard "news" vocabulary** (לשון תקנית): בהחלט, בוודאי, כמובן, אין ספק, מיד, חייבים, אסור, מוכרח, אני מבקש, אני מודה, בכל מחיר, עד הסוף, בלי היסוס, לא אאפשר.
- **Living formal set phrases** (צירופים כבולים): במו עיני (with my own eyes), בסמכותי (by my authority), יהיה אשר יהיה (come what may), ללא רחמים (without mercy), על גופתי (over my dead body), כל הכבוד (well done), זה לא מקובל (this is unacceptable), זו פקודה (that's an order).
- **Polite forms people actually use:** בבקשה, סלח לי / סלחו לי, תרשה לי / הרשו לי, אם אפשר, אני מתנצל.
- **Address forms:** אדוני / גברתי for real deference; rank + name (אדמירל אאוקיג'י, המפקד אייס); house -san/-sama mappings.
- **Rhythm:** short declaratives, a period instead of "!", fewer interjections.
- **Allowed sparingly as a speaker's signature:** single suffixed nouns that are themselves fixed expressions (חובתי, לדעתי, לצערי, בני! as a father's address).

**B. Markers that tip a line into "bookish" (avoid in dialogue unless the line is a deliberate joke or a fixed phrase):**
- **Suffixed possessive/object pronouns on ordinary nouns and verbs:** ראשו של X, ידידיי, אנשיי, חייו, תנני, הכריעני.
  - Use instead: הראש של X, החבר'ה שלי, האנשים שלי, החיים שלו, תן לי.
- **Interrogatives:** היכן / כיצד / מדוע → איפה / איך / למה.
- **Negation:** אינו / אינה / אינך / אינני → לא / הוא לא / את לא צריכה.
- **Predicate fronting:** «מפחידים אתם» → «אתם מפחידים».
- **Counterfactual לו / אילו:** «הייתי בוכה לו יכולתי» → «הייתי בוכה, אם הייתי יכול».
- **Relative and presentative:** אשר → ש; הנני / הנך → אני / אתה, or drop.
- **Formal discourse connectors in speech:** יתרה מזאת, אולם, לפיכך, מאחר ש, מכיוון ש, בטרם.
  - Use instead: וחוץ מזה, אבל, אז, כי, לפני ש.
- **Archaic or high verbs:**
  - ציווה → אמר / נתן פקודה / הורה
  - הכריע → הפיל / ניצח
  - הביטו → תראו / תסתכלו
  - פוקד עליך → זו פקודה
- **Archaic abstract nouns as one-word verdicts:** חרפה → בושה / השפלה / כתם / מביך.
  - חרפה survives only in the idiom בושה וחרפה.
- **Word-by-word English "Well," → ובכן:** use טוב, / נו, / אז, / אה,, or drop it.

**C. Rough but not vulgar (Zoro, Akainu, Crocodile's sneer, Garp, Buggy's crew, prisoners):**
- **Clipped imperatives:** זוז! / סתום! / עוף מפה! / תחזיק! / די כבר!
- **Infinitive commands** (army style): לא לזוז! / להתקדם!
- **"יא" + noun:** יא אפס / יא ג'וק / יא טמבל / יא חתיכת…
- **"X שכמותך"** ("you X, you"): טמבל שכמותך. This is a living colloquial insult frame and also suits mock-polite villains.
- **Dismissive words:** עלוב, פתטי, מגוחך, זבל, חלאה, פרחח, זאטוט, נודניק.
- **Dropped politeness and short questions:** «מה אתה רוצה?», «נו?»

**D. Where the line is for TV (my judgment):**
- A formal word is fine if an Israeli could plausibly hear it on the evening news, in a court or army scene of an Israeli TV drama, or at a memorial ceremony.
- It is bookish if you would mostly meet it in the Bible, in a 1960s translated novel, or in an official letter.
- Practical test: say it aloud as an IDF officer, a news anchor, or a grandfather at a family event. If none of them would say it, rewrite.

### Gaps
- I found no corpus-based list of high-register lexemes ranked by frequency in Hebrew TV subtitles. The marker list above is assembled from the CET, Open University and Wikipedia sources plus my judgment, and calibrated only against our 20 human files.

---

## Q4. Applying this to our cast: voice cards, and where recent he.json slid into literary Hebrew

### Takeaway
Recent episodes (IM, MA, AM, SAB) are mostly natural; MA_2 and MA_3 read cleanly. Literary Hebrew clusters in four places:
1. **Formal/villain/warden lines**, especially lines rewritten under the "voice" gate.
2. **English fan-sub archaisms copied into Hebrew archaisms:** "disgrace"→חרפה, "ordered"→ציווה, "Indeed"→אכן, "Well,"→ובכן, "hereby"→בזאת.
3. **"Yes, sir!" → "כן אדוני!"**: 18 times in IM+MA, against 0 in the human gold, which uses "כן, המפקד!".
4. **Casual speakers given high-register words:** Luffy's «מעולם לא», Sanji's «מעולם לא», Luffy's «ובכן, ובכן».

The voice-card adjectives ("formal", "heavy", "dry", "cold") without lexical anchors are a plausible cause. The IM rewrite logs show "voice" rewrites introducing חרפה, נברר בנחת, היכן אמות, אינה הצד החזק שלי and מי השולט. The native-review prompt also tells blind readers not to flag "theatrical villain speech", which is exactly where these lines hide.

### Cited Findings (repo corpus; my measurements)

**1. Bookish-marker rates per 1,000 dialogue lines, human gold vs AI arcs** (scripts/rate.py):

| Marker | Human (20 He.ass, 7,055 lines) | IM+MA (6,690) | AM+SAB (6,493) | TB+PEN (10,983) |
|---|---|---|---|---|
| chorpa ("disgrace") | 0 | 0.7 | 0.5 | 0 |
| tsivva ("ordered") | 0 | 0.1 | 0.3 | 0 |
| aleycha + infinitive ("you must…") | 0 | 0.3 | 0.5 | 0.1 |
| akhen ("indeed") | 0.1 | 0.3 | 0.6 | 1.3 |
| u-vekhen ("well") | 1.7 | 0.3 | 5.1 | 1.5 |
| le-olam lo ("never") | 1.0 | 1.5 | 1.5 | 3.3 |
| me-olam ("never [past]") | 1.8 | 1.0 | 2.6 | 2.2 |
| "ken adoni" ("yes sir") | 0 | 2.7 | 0.3 | 0 |
| hekhan / keytsad / madua | 0.1 / 0.1 / 0 | 0.1 / 0 / 0 | 0 | 0 |
| eyno-family negation | 0.1 | 0.3 | 0.2 | 0.4 |

- The "הנני/הינו" regex also hits the character name הינה (Hina, MA_5), which is a false positive. Exclude names in any lint.
- The human gold uses מעולם, ובכן and ללא at measurable rates. So these words are not banned in themselves. What matters is which speaker says them and how often (see rule 7).

**2. Who says ובכן in the AI episodes** (named arcs): Disco ×10 (auctioneer, legitimate MC register), Pappag ×4, Kizaru ×3, Rayleigh ×2, Franky ×2, Duval ×2, Camie ×1, Luffy ×1, plus 11 unnamed. Almost all of them translate English "Well," / "Now," / "Now then,".

**3. Voice rewrites that pushed lines towards literary Hebrew** (IM rewrite logs; current file text still matches):
- IM_5:19 Magellan
  «כסוהר, זו חרפה.»
  ("As warden, it's a disgrace.") Old version: «כסוהר, זה מאוד משפיל בשבילי.»
- IM_5:22 Magellan
  «…נברר בנחת איך בדיוק הצלחת לפרוץ לכאן.»
  ("we'll leisurely find out…")
- IM_7:451 Jinbe
  «בבקשה! תנו לי לבחור היכן אמות!»
  ("let me choose where I shall die")
- IM_8:343 Jinbe
  «למרות שלחימה ביבשה אינה הצד החזק שלי...»
  ("although fighting on land is not my strong side")
- IM_3:509 (Buggy / prisoners)
  «מי השולט בכלא הזה!»
  ("who is the ruler of this prison") Old version: «מי הבוס בכלא הזה!», which was better.
- The same logs show the voice gate improving lines too:
  - IM_6:183 «כבוד הוא לי לפגוש אותך!» → «איזה כבוד לפגוש אותך!»
  - IM_7:108 → «תפסיק לחטט בעבר שלי, איווה.»
  - IM_7:436 → «ווי יודע בדיוק איפה ללחוץ לבחור הזה.»
  - The gate is not the problem. Card wording that says "formal" without a do/don't list is.

**4. English archaism → Hebrew rendering** (scripts/enmark.py, all he.json with cues):
- "Yes, sir!" (22): «כן אדוני» 13+, «כן, המפקד!» once (IM_10:52).
- "Indeed" (22): mixed; «אכן» standalone 5× (AM_3:163, AM_4:113, IM_4:95, MA_8:198, SAB_4:143 Franky); elsewhere «בדיוק / בהחלט / באמת / ברור», which is good.
- "disgrace" (12): «חרפה» 8×.
- "ordered" (6): «ציווה/ציוו/ציווית» 3×.
- "hereby" (3): «מוקמת בזאת» (IM_3:147).
- "shall" (29): almost always rendered as plain future. Good.
- "how dare" (22): «איך אתה מעז». A natural and established Hebrew equivalent.

**5. Native-review prompt** (`scripts/onepace-translations/_NATIVE_REVIEW.txt`): "Do NOT flag … Anime-style shouting, short exclamations, or theatrical villain speech that is natural for the genre." This instruction exempts the very lines (villain, warden, admiral) where literary Hebrew concentrates.

**6. Human gold renders military "Yes, sir!" as «כן, המפקד!»** (Buggy's and Krieg's crews), and a waiter's deference as «אני ממש מצטער, אדוני» / «כיצד אוכל לסייע לך?» (repo corpus, human.txt).

### Inferences: voice cards (my judgment; each card = energy + say-words + never-words + model lines)

Format of each card:
- **Register** in a few words.
- **SAY**: words this mouth uses.
- **NEVER**: words this mouth never uses.
- **Lines**: first an existing or likely *bookish* line, then a *natural in voice* rewrite.

Lines marked (corpus) are real current lines. Lines marked (constructed) are illustrative.

#### Jinbe (washi/ja, honourable elder fishman; courteous, grave, warm)
- **Register:** calm, complete, short sentences; polite but plain; old-school decency words. No slang, no literary grammar.
- **SAY:** אני חייב לך, תסמוך עלי, אל תדאג, שמע לי, חובתי (sparingly), בכבוד, לא אתן ל…, לופי (drop -kun), אדון אייס.
- **NEVER:** יאללה, אחי, סבבה, וואלה; also never היכן, אינה/אינני, אכן (standalone), חרפה, ציווה, הנני, suffixed nouns other than fixed ones.
- **Lines:**
  - (corpus IM_8:343)
    «למרות שלחימה ביבשה אינה הצד החזק שלי...»
    ("though fighting on land isn't my strong side", bookish)
    →
    «ביבשה אני לא במיטבי, אבל...»
    ("on land I'm not at my best, but…")
    or
    «על היבשה אני פחות חזק, אבל...»
  - (corpus IM_7:451)
    «בבקשה! תנו לי לבחור היכן אמות!»
    ("let me choose where I shall die", bookish)
    →
    «בבקשה! תנו לי לבחור איפה למות!»
    ("let me choose where to die")
    or
    «בבקשה! לפחות את המקום שבו אמות אני רוצה לבחור!»
  - (corpus MA_2:208, fine; keep)
    «אבל חובתי לעמוד מולך!»
    ("but it's my duty to face you")
    The fixed suffixed noun חובתי is acceptable in a grave mouth.

#### Whitebeard (old patriarch; Japanese hanatare, kuso namaiki; booming, contemptuous to enemies, tender to "sons")
- **Register:** few words, heavy, gruff, mocking; dated-but-alive old-man words.
- **SAY:** פרחח, זאטוט, ילד, בני (as a direct address in an emotional beat), הבנים שלי, גורררה (laugh as is), לא אסלח.
- **NEVER:** אנשיי, ילדיי, חיי הבנים שלי (construct chains), ציווה, ראוותני (stiff), אכן.
- **Lines:**
  - (corpus MA_8:148)
    «אני?! למכור את חיי הבנים שלי?!»
    ("me, sell my sons' lives?!", heavy construct)
    →
    «אני?! שאמכור את הבנים שלי?!»
    ("me? sell out my sons?!")
  - (corpus MA_3:93)
    «הלהבות האלו ראוותניות מידי.»
    ("these flames are too ostentatious")
    →
    «הלהבות שלך צעקניות מידי, ילד.»
    ("your flames are too loud, kid")
  - (corpus MA_3:4, good; keep)
    «פרחח!»
    ("young fool!")

#### Whitebeard's crew about him (Marco, Vista, commanders)
- (corpus MA_7:71)
  «ויסטה! אבא ציווה לשמור על האח של אייס בחיים!»
  ("Father commanded…")
  →
  «ויסטה! אבא אמר לשמור על האח של אייס בחיים!»
  or
  «ויסטה! פקודה של אבא: האח של אייס נשאר בחיים!»

#### Sengoku (Fleet Admiral; authoritative speeches; exasperated with Garp)
- **Register:** news-anchor standard Hebrew, commanding, complete; short barked orders; dry exasperation.
- **SAY:** זו פקודה, חייבים, אסור לנו, בכל מחיר, זה לא מקובל, אל תצחיק אותי, גארפ, שתוק!, מביש.
- **NEVER:** ראשו של X, זאת חרפה, אני פוקד עליך, אצווה, ובכל זאת at the start of every line, "אל תהיה מגוחך" (calque).
- **Lines:**
  - (corpus SAB_1:76)
    «ובכל זאת לא הצלחת אפילו להביא את ראשו של כובע הקש לופי? זאת חרפה!»
    →
    «ולא הבאת אפילו את הראש של כובע הקש? זה מביש!»
    ("and you didn't even bring Straw Hat's head? It's shameful!")
  - (corpus SAB_1:70)
    «אל תהיה מגוחך!»
    ("don't be ridiculous", calque)
    →
    «אל תצחיק אותי!»
    or
    «שטויות!»
  - (corpus SAB_1:81, broken and stiff)
    «כי כיוון שלא התייחסת לזה ברצינות,...»
    →
    «בגלל שלא לקחת את זה ברצינות, המרדף הזה לא ייגמר לעולם.»
    ("because you didn't take it seriously, this chase will never end")
  - (corpus MA_7:257)
    «אני פוקד עליך לנתק את השידור המגוחך הזה!»
    →
    «תנתק את השידור המגוחך הזה! זו פקודה!»

#### Magellan (dry warden; polite, procedural, menacing understatement)
- **Register:** bureaucratic-cold; short declaratives; legal set phrases allowed; no exclamation pile-ups.
- **SAY:** בסמכותי כסוהר (keep), זה מביך, זה לא יקרה, אטפל בזה, תדווחו, יהיה לנו זמן, כתם על אימפל דאון.
- **NEVER:** חרפה, בנחת, להכריע, הנני, אשר.
- **Lines:**
  - (corpus IM_5:19)
    «כסוהר, זו חרפה.»
    →
    «בתור סוהר, זה מביך אותי מאוד.»
    ("as warden, this embarrasses me greatly")
  - (corpus IM_5:22)
    «אחרי שאתפוס אותך, נברר בנחת איך בדיוק הצלחת לפרוץ לכאן.»
    →
    «כשאתפוס אותך, יהיה לנו כל הזמן שבעולם לברר איך פרצת לכאן.»
    ("when I catch you, we'll have all the time in the world to find out how you broke in")
  - (corpus IM_5:151)
    «לא האמנתי שתצליח להכריע אותי...»
    →
    «לא חשבתי שתצליח להפיל אותי על הברכיים...»
    ("I didn't think you'd bring me to my knees")
  - (corpus IM_8:12)
    «חרפה לאימפל דאון.»
    →
    «כתם על אימפל דאון.»
    ("a stain on Impel Down")
    or
    «בושה לאימפל דאון.»

#### Prison guards and Hannyabal
- **Guards register:** clipped police/military.
  - SAY: כן, המפקד! (or כן, אדון סוהר! per house), קיבלתי!, מיד!, לסגור את השער!, תגבורת לקומה 4!
  - NEVER: כן אדוני! as the default.
- **Hannyabal:** pompous, ambitious; mock-epic allowed as the joke, one elevated word per line at most.
  - (corpus IM_8:422)
    «הביטו!»
    ("behold!")
    → acceptable as comic pomp. Neutral alternative:
    «תסתכלו!»
  - (corpus IM_2:264)
    «ברוך שובך מהמשימה הנאצלת, אדון סוהר!!»
    The "noble task" is a toilet trip, so the elevation is the joke. Keep.

#### Marine soldiers and officers
- **Register:** IDF-style radio and orders.
- **SAY:**
  - כן, המפקד! / קיבלתי! / לפקודתך!
  - אש! / לא לעצור!
  - infinitive commands: להתקדם לכיכר! / לעצור אותם!
  - כל הכוחות, להיערך לקרב!
- **NEVER:**
  - כן אדוני! by reflex.
  - Mixing formal imperative and future in one card.
- **Lines:**
  - (corpus IM_7:178 and others)
    «כן, אדוני!»
    →
    «כן, המפקד!»
    (matches the human gold)
  - (corpus MA_3:101, mixed forms)
    «הטביעו את המובי דיק! / תהרגו את זקן לבן!»
    →
    «להטביע את המובי דיק! להרוג את זקן לבן!»
    or
    «תטביעו את המובי דיק! תהרגו את זקן לבן!»

#### Hancock (Snake Princess; royal arrogance, narcissism; melts for Luffy)
- **Register:** haughty through content and imperatives, not grammar.
- **SAY:** כי אני יפה!, שקט!, אני מרשה לך, יצור עלוב, אל תעז, חצוף!
- **NEVER:** הנני, אנוכי, עלמה, הואיל, אצווה, archaic suffix pronouns.
- **Lines:**
  - (corpus AM_3:161–164, good; keep)
    «יסלחו לי... כי אני יפה!»
    ("I'll be forgiven… because I'm beautiful!")
  - (constructed, bookish)
    «הנני מצווה עליכן לשתוק!»
    →
    «שקט! אני לא רוצה לשמוע מילה!»
    ("silence! I don't want to hear a word!")
  - (corpus MA_6:182, good)
    «חצוף! אני לא נותנת לך לעבור!»

#### Ivankov (camp okama queen; ווי; "Hee-haw!"; "-boy" nicknames)
- **Register:** theatrical showman; exclamations; pompous announcements allowed as camp (mock-epic), at most one elevated word per announcement.
- **SAY:** ווי, כובע-הקש, קרוקו, ניסים!, הי-הא!
- **NEVER:** literary verbs in normal talk.
- **Lines:**
  - (corpus MA_6:202)
    «דבר אל ווי, קומא!»
    →
    «תענה לווי, קומא!»
    ("answer me, Kuma!")
  - (corpus, earlier version in IM_7 log)
    «לווי אחיזה חזקה בנקודת התורפה של הבחור הזה.»
    →
    «ווי יודע בדיוק איפה ללחוץ לבחור הזה.»
    The current file already has the fix.

#### Buggy (loud coward; "flashy")
- **Register:** loud, boastful, slangy; cowardly asides; "flashy" → בגדול / בסטייל / עם רעש.
- **SAY:** טמבלים, תגידו תודה!, בום!, בסטייל.
- **NEVER:** formal gratitude words.
- **Lines:**
  - (corpus IM_2:366)
    «תהיו אסירי תודה, טיפשים!»
    →
    «תגידו תודה, טמבלים!»
    ("say thanks, morons!")
  - (corpus IM_3:509)
    «מי השולט בכלא הזה!»
    →
    «מי הבוס בכלא הזה!»
    (revert)

#### Crocodile (cold, contemptuous, laconic; "Kuhahaha")
- **Register:** cold understatement, sneering one-liners.
- **SAY:** עלוב, פתטי, מגוחך, אל תצחיק אותי, נו באמת.
- **NEVER:** street slang (אחי, יאללה), and never bookish verdicts (חרפה).
- **Lines:**
  - (corpus MA_8:106)
    «אתה חרפה, זקן לבן!»
    →
    «עלוב, זקן לבן.»
    or
    «איזו השפלה, זקן לבן!»
    ("pathetic, Whitebeard")
  - (corpus MA_8:107)
    «לא ידעתי שהפסדתי לחלש כזה!»
    →
    «ולמישהו חלש כזה הפסדתי?!»
    ("and to a weakling like that I lost?!")

#### Mihawk (stoic swordsman; aristocratic economy)
- **Register:** minimal, precise, calm standard Hebrew; fixed formal phrases welcome.
- **SAY:** במו עיני, מעניין, לא רע.
- **NEVER:** slang, exclamation pile-ups, archaic grammar.
- **Lines:**
  - (corpus MA_3:34–36, good; keep)
    «אני רק רוצה למדוד... לראות במו עיני... כמה אנחנו באמת רחוקים מהאיש הזה.»

#### Kizaru (lazy drawl, mock-polite, "Oh, scary~")
- **Register:** casual, drawn-out, sarcastic-polite; trailing "..." and "כן?" tags.
- **SAY:** אוי אוי..., וואו, מפחיד..., נו באמת, X שכמותכם.
- **NEVER:** predicate fronting, ידידיי, מכיוון ש, ובכן.
- **Lines:**
  - (corpus MA_3:52)
    «מפחידים אתם, פיראטי זקן לבן...»
    →
    «וואו... אתם מפחידים, פיראטי זקן לבן...»
  - (corpus SAB_10:71)
    «...ידידיי הקטנים והשבירים.»
    →
    «...שבירים שכמותכם.»
    ("…you fragile little things")
  - (corpus SAB_10:69)
    «מכיוון שאתה כבר יודע מה המצב...»
    →
    «אם אתה כבר יודע מה המצב...»
  - (corpus SAB_11:259)
    «אתה גורם לי להיראות רע»
    (calque)
    →
    «אתה מביך אותי פה»
  - (corpus SAB_9:174)
    «ובכן, זה דיי מוזר...»
    →
    «הממ... זה דיי מוזר...»

#### Aokiji (laid-back, sleepy, dry)
- **Register:** low energy, short, sighing.
- **SAY:** בחיי..., נו..., אין לי כוח, עזוב.
- **NEVER:** high formality.
- **Lines:**
  - (corpus MA_3:80–81, good)
    «בחיי, השניים האלו פשוט... קמו ועזבו את העמדה!»
  - (constructed, bookish)
    «אין בכוונתי להילחם בך כעת.»
    →
    «אין לי כוח לריב איתך עכשיו.»

#### Akainu (Hiroshima/yakuza dialect; absolute justice; brutal)
- **Register:** harsh, heavy, blunt threats; short.
- **SAY:** לחסל, עד האחרון, זבל, פושעים, אין רחמים.
- **NEVER:** elegant literary verbs (ייכחד, יובס, ימוגר).
- **Lines:**
  - (constructed, bookish)
    «הרשע ייכחד מן העולם.»
    →
    «צריך למחוק את הרוע מהעולם. עד האחרון.»
  - (corpus MA_3:95, acceptable sarcasm)
    «הלוויות ראוותניות לא לטעמך, זקן לבן?»

#### Garp (boisterous grandpa, "bwahaha", rough-affectionate)
- **Register:** loud folksy old man.
- **SAY:** יא ילד, הנכד שלי, סבא, טמבל, אגרוף של אהבה.
- **NEVER:** נכדי היקר, שמע לדבריי.
- **Lines:**
  - (constructed)
    «נכדי, שמע לדבריי!»
    →
    «תקשיב לסבא שלך, ילד!»
  - (corpus SAB_1:73, good)
    «בדיוק כמו שציפיתי מהנכד שלי!»

#### Ace (calm, tired, dry; loyal to "Old man" → אבא)
- **Register:** calm, matter-of-fact, plain.
- **SAY:** אבא, עזוב, זה בסדר, לופי.
- **NEVER:** high verbs.
- **Lines:**
  - (corpus MA_2:70, good)
    «אני לא סובל שזורם בי הדם של האבא האפס הזה.»

#### Luffy (blunt; all casual, never polite)
- **Register:** simplest Hebrew; food, wonder, stubbornness.
- **SAY:** מגניב!, אין מצב!, בשר!, אני אהיה מלך הפיראטים!, אחלה.
- **NEVER:** מעולם, ובכן, אכן, בהחלט, כאשר, any suffixed pronoun.
- **Lines:**
  - (corpus SAB_5:660)
    «מעולם לא חשבתי שעשיתם משהו לא בסדר!»
    →
    «אף פעם לא חשבתי שעשיתם משהו לא בסדר!»
  - (corpus SAB_2:255)
    «ובכן, ובכן... למי יש פה את הדג הכי טרי?»
    →
    «נו נו... למי פה יש את הדג הכי טרי?»

#### Zoro (gruff, terse, rude)
- **Register:** short, rough, dry.
- **SAY:** זוז, סתום, תחזיק מעמד, מה אתה רוצה?, יא…
- **NEVER:** polite softeners.
- **Lines:**
  - (constructed)
    «אינני מתכוון להפסיד כאן.»
    →
    «אני לא מתכוון להפסיד פה.»

#### Sanji (rude to men, gallant-overblown to women)
- **Register:** two modes.
  - To men: חתיכת…, מחורבן, יא…
  - To women: theatrical courtesy, גברת נאמי, רובין-צ'אן (house).
- **NEVER:** high register in the rude mode.
- **Lines:**
  - (corpus SAB_5:579)
    «מעולם לא אמרתי את זה! אתה הראש הארור, לא, דובאל?!»
    →
    «בחיים לא אמרתי את זה! אתה הבוס המחורבן, לא, דובאל?!»

#### Usopp (cowardly braggart; "the great Captain Usopp")
- **Register:** stammers, excuses, boasts.
- **SAY:** אוסופ הגדול, מ-מה?!, מחלת ה-אסור-לי-להיכנס-לאי.
- **NEVER:** formal connectors.

#### Nami (sharp, money-minded, swears)
- **Register:** quick, bossy, modern.
- **SAY:** די!, מטומטמים!, תשלמו לי, ברצינות?!
- **NEVER:** מעולם in casual speech.
- **Lines:**
  - (corpus SAB_11:176)
    «...והיא מעולם לא חזרה!»
    →
    «...ומאז היא לא חזרה!»

#### Robin (calm, educated, polite, dark humour)
- **Register:** the most formal Straw Hat, but conversational. Precise vocabulary, complete sentences, job-titles + אדון/גברת (e.g. אדון סייף for "swordsman-san", per house -san rule).
- **NEVER:** archaic grammar.
- **Lines:** (corpus SAB_9:62, good) «אני אמשיך במסע.»

#### Franky ("SUPER!", hip mechanic)
- **Register:** loud, cool, slangy. Franky may use street words (אחי, סוּפֶּר!).
- **NEVER:** אכן, ובכן.
- **Lines:**
  - (corpus SAB_4:143)
    «אכן...»
    →
    «נכון...»
    or
    «ככה זה...»

#### Brook (gentleman skeleton; polite *watashi*; rude requests in polite form; skull jokes)
- **Register:** polite-gentlemanly modern.
- **SAY:** בבקשה, סלחו לי, הרשו לי, יוהוהו, אם יורשה לי (sparingly), "אין לי X… כי אני שלד!"
- **NEVER:** תהיה זאת חרפה, לו יכולתי, יתרה מזאת, והנה אני מתקיים.
- **Lines:**
  - (corpus SAB_2:347)
    «תהיה זאת חרפה אם לא אעזור לכם!»
    →
    «זו תהיה בושה אם לא אעזור לכם!»
  - (corpus TB_1:416)
    «אני כל כך שמח שהייתי בוכה לו יכולתי!»
    →
    «אני כל כך שמח, שהייתי בוכה אם רק הייתי יכול!»
  - (corpus TB_7:110)
    «יתרה מזאת, יש לו...»
    →
    «וחוץ מזה, יש לו...»
  - (corpus TB_17:51, fine)
    «הרשו לי להצטרף לקרב שלכם»
    A polite and alive form.

#### Rayleigh (relaxed living legend; warm, wry storyteller)
- **Register:** relaxed elder; a few poetic images are allowed inside eulogy-type monologues.
- **SAY:** טוב,, נו,, בגילי.
- **NEVER:** ובכן as a default opener.
- **Lines:**
  - (corpus SAB_8:260)
    «ובכן, האצ'י עזר לי פעם...»
    →
    «טוב, האצ'י עזר לי פעם...»
  - (corpus SAB_8:332, acceptable in a eulogy)
    «רק כמה שניות לפני שלהבת חייו כבתה...»

#### Narrator (title cards, recaps, documentary voice-over)
- **Register:** news/documentary standard Hebrew. "מעולם", "ללא", "בתולדות" are fine. No slang. No biblical forms.
- **Lines:**
  - (corpus IM_10:341)
    «אימפל דאון לא ראה חרפה כזאת מעולם...»
    →
    «זו הייתה ההשפלה הגדולה ביותר בתולדות אימפל דאון...»
    ("the greatest humiliation in Impel Down's history")

#### Comic pompous characters (Celestial Dragons, Disco, Hannyabal's speeches)
- Elevated words are the joke here (Weissbrod's mock-epic).
- (corpus SAB_7:34) «איך אתה מעז, הדיוט, להרים יד על בני!» is right for a Celestial Dragon.
- Disco's MC «ובכן» is fine.
- Cap it at one elevated item per line, so it reads as pomp and not as a translation artefact.

### Gaps
- IM and MA cues have empty `name` fields, so per-speaker rates there were inferred by hand from context and are not exhaustive. A full per-speaker audit of the ~340 episodes would need speaker attribution first.
- The current IM_6:341 and IM_7:453 lines say «בכור הים» ("firstborn of the sea") for "Knight of the Sea", though IM_6.rewrite-log lists a change to «אביר הים». Terminology is out of my scope, but the mismatch is worth a check.
- I did not test the proposed rewrites with blind native readers. They are my judgment and need the user's ear.

---

## Actionable rules for our translator (ranked by expected impact)

1. **Rewrite voice cards as word lists, not adjectives.**
   - Pattern: cards such as "Jinbe: short, heavy, formal", "Magellan: dry warden", "Crocodile: cold".
   - Why unnatural: an LLM turns "formal / heavy / dry" into elevated synonyms (חרפה, ציווה, היכן, אינה, בנחת, השולט). The IM rewrite logs show "voice" rewrites introducing exactly these. Register is ~80% lexical (Ravid & Berman 2009), so specify the lexicon.
   - Fix: each card gets energy and length, 5 SAY words, 5 NEVER words, and one model Hebrew line (see the Q4 cards). Add a global NEVER list for every non-comic speaker: היכן, כיצד, מדוע, אינו/אינה/אינני, הנני, אשר, לו (counterfactual), ציווה, הכריע, חרפה, יתרה מזאת, suffixed nouns on ordinary words.
   - Example: Magellan «כסוהר, זו חרפה.» → «בתור סוהר, זה מביך אותי מאוד.»

2. **Treat fan-sub English archaisms as a flag for "formal", never as words to translate.**
   - Pattern:
     - "disgrace" → חרפה
     - "ordered" → ציווה
     - "Indeed" → אכן
     - "Well," / "Now then," → ובכן
     - "hereby" → בזאת
     - "Behold" → הביטו
     - "my X" → suffixed noun (ידידיי)
   - Why unnatural: these are English register choices layered on Japanese role language, and the Hebrew relay copies them as Hebrew archaisms. The human gold has 0 חרפה and 0 ציווה. AM+SAB use ובכן three times as often as the human files.
   - Fix:
     - disgrace → בושה / השפלה / מביך / כתם
     - ordered → אמר / נתן פקודה / הורה
     - Indeed → נכון / בדיוק / בהחלט
     - Well, → טוב, / נו, / אז, / or drop it
     - hereby → drop, or מעכשיו
     - Behold → תראו / תסתכלו
     - my friends → החבר'ה שלי
   - Example: «ויסטה! אבא ציווה לשמור על האח של אייס בחיים!» → «ויסטה! אבא אמר לשמור על האח של אייס בחיים!»

3. **"Yes, sir!" from soldiers and guards → «כן, המפקד!».**
   - Pattern: «כן אדוני!» (18× in IM+MA).
   - Why unnatural: Israeli military usage is "כן, המפקד". "כן אדוני" is police, civilian service or English-calque register (Maariv; Silence of the Lambs subs). Our human gold uses «כן, המפקד!».
   - Fix: «כן, המפקד!» / «קיבלתי!» / «לפקודתך!». Use «כן, אדוני» only for a waiter or servant addressing a customer or master.
   - Example: IM_7:178 «כן, אדוני!» → «כן, המפקד!»

4. **Make formality lexical and rhythmic, never grammatical.**
   - Pattern: suffixed possessives (ראשו של X, חיי הבנים שלי, אנשיי), אינו, predicate fronting (מפחידים אתם), counterfactual לו, היכן.
   - Why unnatural: suffixed pronouns "are found very little in spoken language" (CET). אינו is decorative and present-only. The high register is "a convenient subject for jokes" (Hebrew Wikipedia).
   - Fix: separate pronouns (הראש של X, האנשים שלי); לא; normal word order; אם; איפה. Get gravity from complete sentences, no slang, standard words (בהחלט, חייבים, זו פקודה) and living fixed phrases (במו עיני, בסמכותי, יהיה אשר יהיה, ללא רחמים).
   - Example: Sengoku «...להביא את ראשו של כובע הקש לופי? זאת חרפה!» → «ולא הבאת אפילו את הראש של כובע הקש? זה מביש!»

5. **Keep casual mouths casual.** A high-register word in Luffy's, Zoro's, Nami's or Franky's mouth is a voice error even when grammatical.
   - Pattern: Luffy «מעולם לא חשבתי…», «ובכן, ובכן...»; Franky «אכן...»; Sanji «מעולם לא אמרתי».
   - Why unnatural: these characters never use polite or elevated forms in Japanese (kaizokuou-ni-naru; Meiji paper), and Israelis say אף פעם / בחיים לא.
   - Fix: אף פעם / בחיים לא / נו / נכון.
   - Example: Luffy «מעולם לא חשבתי שעשיתם משהו לא בסדר!» → «אף פעם לא חשבתי שעשיתם משהו לא בסדר!»

6. **Close the review loophole for villains and authority figures.**
   - Pattern: `_NATIVE_REVIEW.txt` tells blind readers not to flag "theatrical villain speech that is natural for the genre".
   - Why it matters: literary Hebrew concentrates in exactly those lines (warden, admiral, Warlord).
   - Fix: change the exemption to cover only exclamations and shouting. Add: "Flag formal or villain lines too if an Israeli dub or subtitle of a teen anime would not phrase them that way (e.g., חרפה, ציווה, היכן, אינו, suffixed nouns, inverted word order)."
   - Example: under the new wording, Crocodile's «אתה חרפה, זקן לבן!» would get flagged → «עלוב, זקן לבן.»

7. **Use frequency-calibrated lint markers, not bans** (for detection across ~340 episodes).
   - Pattern: high-register tokens.
   - Why: the human gold does use מעולם (1.8‰), ובכן (1.7‰) and ללא (1.4‰, mostly in fixed phrases), so outright bans would be wrong.
   - Fix: score each line. Hard flags in dialogue: חרפה, ציווה/ציוו, הכריע, הנני/הנך, היכן, כיצד, מדוע, אינ-, יתרה מזאת, לו+past, אשר, מוטב, טרם, "עליך + infinitive", "כן אדוני", predicate fronting, ידידיי/אנשיי. Soft flags (check the speaker): ובכן, אכן, מעולם, לעולם לא (TB runs at 3.3‰ against 1.0‰ for the human files), ללא outside fixed phrases.
   - Further checks:
     - Cross-check English triggers (disgrace, ordered, indeed, Well, hereby, Behold, shall, I must say).
     - Exclude names (הינה = Hina).
     - Per arc, compare rates to the human baseline and review any token above 2× the baseline.
   - Example: rate.py output (Q4 table). ובכן in AM+SAB is 5.1‰ against 1.7‰, coming from Pappag, Kizaru, Rayleigh, Camie and Luffy.

8. **Allow elevated Hebrew only where it is the joke or a fixed phrase.**
   - Pattern: pompous characters (Celestial Dragons, Hannyabal, Disco, Ivankov's announcements, a toilet trip called "noble task").
   - Why: Hebrew has a living mock-epic tradition (Weissbrod 1999). Used deliberately, elevation reads as comedy. Used accidentally on a serious villain, it reads as a "translation artefact" (Bar-Zik's Gashashim warning).
   - Fix: at most one elevated item per line, only for speakers tagged "pompous" on their card.
   - Example: keep «איך אתה מעז, הדיוט, להרים יד על בני!» (Celestial Dragon). Keep «ברוך שובך מהמשימה הנאצלת, אדון סוהר!!» (guards praising a toilet trip).

9. **Military orders: one imperative system per card.**
   - Pattern: «הטביעו את המובי דיק! / תהרגו את זקן לבן!»: a formal imperative followed by a future-as-imperative.
   - Why unnatural: Israeli army speech gives orders as short infinitives (להתקדם! לא לזוז!) or future forms. Mixing them inside one order sounds stitched together (my judgment).
   - Fix: «להטביע את המובי דיק! להרוג את זקן לבן!» or «תטביעו… תהרגו…».
   - Example: «כל הכוחות, היכונו לקרב!» → «כל הכוחות, להיערך לקרב!» (both are acceptable; pick one style per arc).

10. **Drop -kun, and carry courtesy through tone and name.**
    - Pattern: Jinbe's "Luffy-kun".
    - Why: Hebrew has no -kun equivalent; the advice from a Hebrew manga relay translator is to delete it (Galit Dotan). The current files already do this, correctly.
    - Fix: «לופי» plus calm, complete sentences. Use אדון X only where the house -san/-sama rule applies.
    - Example: «לופי, בוא נלך! אני אעזור לך!» (already correct). Optionally the shorter «לופי, קדימה! אני איתך!»
