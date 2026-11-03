# Existing Hebrew One Piece translations compared with ours

Scope: every Hebrew One Piece translation I could find (Netflix live action S1+S2, Netflix LEGO One Piece, the Jetix Hebrew dub, HOT/yes anime library, fansubs on OpenSubtitles, the onepiece-nakama.com fan team, Hebrew Wikipedia), compared with our shipped subtitles for terminology and register.

Corpora and method (all downloads under `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/one-piece-hebrew/`):
- **Netflix live action**: 16 Hebrew SRTs (S01E01–08, S02E01–08), 9,634 cues, from wizdom.xyz. The S1 files are the same release OpenSubtitles user "OfficialSubsIL" uploaded on launch day.
- **Ours, human**: the 20 `He.ass` files by That One Gerbil, 7,015 dialogue lines.
- **Ours, AI**: all 343 `he.ass` files, 129,950 dialogue lines. Sign, caption and song styles are excluded, using the coordinator's filter.
- Counts come from regexes (scripts in `.../scratchpad/one-piece-hebrew/scripts/`). There is no part-of-speech tagging, so they are indicators, not exact measurements.
- The Netflix rips store punctuation at the start of each line (visual order). I moved it to the end when quoting.

---

## 1. Are Hebrew subtitles of the One Piece live action available, and what terms and register do they use? Is there a Hebrew dub?

### Takeaway
- **Availability:** Netflix's own Hebrew subtitles for both live-action seasons are freely available on wizdom.xyz and OpenSubtitles. Netflix's 2026 LEGO One Piece also has official Hebrew subtitles.
- **Terms:** Netflix agrees with us on most core terms (מלך הפיראטים, הקו הגדול, פרי שטן, הכחול המזרחי, הוואן פיס, צייד הפיראטים, הקו האדום). It differs on **Marines** (Netflix: המארינס; ours: הצי), **Warlords** (Netflix: שבעת אדוני הים; ours: שבעת לוחמי הים) and **Gum-Gum attacks**, which Netflix transliterates (גאם גאם פיסטול) and we translate.
- **Register:** Netflix is formal but clean. It contains essentially **none** of the bookish calques our AI produces (אכן, כצפוי, הולך להיות + participle, אסיר תודה).
- **Dub:** I found no Hebrew dub of the live action. The anime had a Hebrew dub of its first 52 episodes on Jetix (2006–2009).

### Cited Findings
**Availability**
- wizdom.xyz lists Hebrew subtitles for `One.Piece.2023.S01E01–E08` and `S02E01–E08` (release ETHEL, IMDb tt11737520) — [wizdom API listing](https://wizdom.xyz/api/search?action=by_id&imdb=tt11737520). Sample download: [S01E01 zip](https://wizdom.xyz/api/files/sub/317254).
- OpenSubtitles has the same S1 Hebrew files, uploaded 2023-08-31 by "OfficialSubsIL", e.g. [S01E01](https://www.opensubtitles.org/en/subtitles/9699013). S2 Hebrew was uploaded 2026-03-11 by "ichi131", e.g. [S02E01](https://www.opensubtitles.org/en/subtitles/13626563).
  - The files carry no translator credit line. "Netflix official" is my inference from the WEB release name, the OfficialSubsIL uploader and the Netflix typography (leading dashes, "- צפו בכל הפרקים עכשיו -").

**Netflix live-action terminology (hit counts over 16 episodes)**
- **Marines:** "המארינס" appears 130 times: «המארינס, בשליחות הממשלה העולמית» (the Marines, on behalf of the World Government), «חייל מארינס» (a Marine soldier), «בסיס המארינס» (the Marine base). "הצי" appears only twice, both meaning "fleet" (Krieg's: «השמדת את הצי שלי», "you destroyed my fleet") — [S01E01, S01E05](https://wizdom.xyz/api/search?action=by_id&imdb=tt11737520).
- **Straw Hats:** «פיראטי כובע הקש» (Straw Hat Pirates), «צוות כובע הקש» (Straw Hat crew), «הפיראט בכובע הקש» (the pirate in the straw hat); 52 hits for כובע הקש — same source.
- **Devil Fruit:** «פרי שטן» / «פרי השטן», 22 hits. "פרי שד" never appears. Luffy's fruit is «פרי הגומי» (the Gum fruit) and he is «ילד גומי» (rubber boy).
- **Gum-Gum attacks:** transliterated, not translated: «גאם גאם... פיסטול!», «פיסטול!», «בזוקה!».
- **Pirate King / Grand Line / One Piece:** «מלך הפיראטים» (33), «הקו הגדול» (89), «הוואן פיס» (55). The show's title card reads «ואן פיס» with one vav.
- **East Blue:** «הכחול המזרחי», alternating with «הים המזרחי» (the Eastern Sea) and «הים הכחול המזרחי».
- **World Government:** «הממשלה העולמית» in all 12 hits; "ממשלת העולם" never appears.
- **Seven Warlords:** «אחד משבעת אדוני הים» (one of the Seven Lords of the Sea), singular «אדון ים».
- **Navy ranks:** «סגן האדמירל» (vice admiral, said to Garp). Fleet admiral is «אדמירל הצי»: «יכולתי להיות אדמירל הצי היום» (I could have been fleet admiral today).
- **Bounty:** «פרס על ראשו» (a price on his head), «סכומי הפרס» (the bounty amounts), «כרזת מבוקש» (wanted poster).
- **Other terms:**
  - Going Merry: «גואינג מרי» / «ספינת הגואינג מרי».
  - Zoro's epithet: «צייד הפיראטים».
  - Red Line: «הקו האדום».
  - Baroque Works: «בארוק וורקס».
- **Crewmate (nakama):** «חברת צוות», «הצוות שלי», «החברים שלי». No transliteration.

**Netflix recurring beats**
- **King of the Pirates:** «אני אהיה מלך הפיראטים» 11 times and «ולהפוך למלך הפיראטים» 4 times. The pattern "הולך להיות מלך הפיראטים" never occurs.
- **Thanks:** «אני חייב לך את החיים שלי!» (I owe you my life!), «אני חייב לך», «אז אני מודה לך», «קחו את זה לאות תודה» (take this as a token of thanks). "אסיר תודה" never occurs.
- **Insults and curses:** «המארינס הדפוקים» (the damn Marines), «חייל מארינס דפוק עם תספורת מחורבנת» (a damn Marine with a crappy haircut), «החרא הקטן הזה», «חתיכות זבל מטופשות», «חתיכת ממזר רציני». "לעזאזל" is 4.6 per 1,000 cues.
- **"No wonder" / "as expected":** Netflix uses «לא פלא ש…» («לא פלא שכל כך קשה לנווט בקו הגדול», no wonder it's so hard to navigate the Grand Line), «ברור שלא», «כמובן ש…». "כצפוי" and "כמצופה" never occur.

**LEGO One Piece (Netflix, 2026)**
- Official Hebrew subtitles (uploader OfficialSubsIL) use: «פיראטי כובע הקש», «צוות כובע הקש», «חבר הצוות החשוב ביותר» (the most important crewmate), «איש הצוות הראשון של כובע הקש», «פרי שטן, פרי הגומי», «!גאם גאם פיסטול», «המארינס הופיעו, בהנהגת קפטן סמוקר» (the Marines showed up, led by Captain Smoker), «קפטן מארינס», «הכחול המזרחי» — [E01](https://www.opensubtitles.org/en/subtitles/14091335), [E02](https://www.opensubtitles.org/en/subtitles/14073028).

**Register: rate per 1,000 lines (Netflix / our human / our AI)**

| Marker | Netflix | Human (Gerbil) | AI |
|---|---|---|---|
| אכן ("indeed") | 0.0 | 0.1 | **1.1** (144 lines) |
| כצפוי / כמצופה ("as expected") | 0 | 0 | 27 lines |
| הולך/ת/ים להיות (going to be) | 0 lines | 2 lines | **58 lines** |
| כה ("so", literary) | 0.0 | 0.0 | 0.4 |
| אסיר/ת תודה ("grateful") | 0 | 0 | 0.3 |
| ייתכן ("possibly") | 0.4 | 0.0 | 0.7 |
| ציווה / מצווה (commanded) | 0 | (5, mostly מפקד) | 26 lines (also mostly מפקד) |
| "לא פחות ממה ש…" (no less than expected) | 0 | 0 | 3 |
| אינני/אינו/איננו… (formal negation) | **2.2** | 0.1 | 0.7 |
| עליי/עלינו ל+infinitive ("I must") | **1.8** | 0.1 | 0.8 |
| לעזאזל | 4.6 | **17.8** | 9.7 |
| אין מצב / אין סיכוי | 0.5 | **5.8** | 2.4 |
| בחיי | 1.6 | 2.7 | 0.5 |
| שיט/חרא/דפוק/מחורבן | 2.9 | 1.9 | 0.9 |
| נו | 0.2 | 1.6 | 1.3 |
| עזוב/עזבי/עזבו | 1.5 | 3.1 | 0.9 |
| יאללה/סבבה/וואלה/תכלס | 0.0 | 0.1 | **1.6** |
| possessive suffix vs. "של" (חיי vs. החיים שלי) | 49 : 73 | 19 : 40 | 320 : 473 |

Source: my counts over the corpora above. Netflix files are from [wizdom](https://wizdom.xyz/api/search?action=by_id&imdb=tt11737520); human and AI files are from this repo.

**Dub**
- The anime's Hebrew dub covered episodes 1–52. Elrom produced it for Jetix (ג'טיקס), premiering 14 Oct 2006. The openings and endings were sung in Hebrew (lyrics by Ziv Meir), the logo and "to be continued" card were translated, censorship was minimal, and the show was dropped because Jetix found it too violent — [One Piece Wiki: One Piece in Israel](https://onepiece.fandom.com/wiki/One_Piece_in_Israel).
- Director was Amichai Bar Tov. Luffy was voiced by Yigal Mizrahi, Zoro by Yoram Yosefsberg — [ishim.co.il dub credits](https://www.ishim.co.il/m.php?s=%D7%95%D7%95%D7%90%D7%9F+%D7%A4%D7%99%D7%A1); [Hebrew Wikipedia: וואן פיס](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1) (aired 2006–2009).
- A 2010–2011 Israeli petition asking the kids' channel to keep airing One Piece in Hebrew reached 1,545 signatures — [atzuma.co.il](https://www.atzuma.co.il/onepiece).

### Inferences
- **Netflix is not a "spoken Hebrew" gold standard.** It is formal (איני יודע, «האם כשכדור מפלח את ליבו?»). Its formality sits in grammar: negation with אין־, עליי ל־, the question particle האם. It does not sit in calqued connectors or stock phrases. Our AI's problem is the second kind: אכן, כצפוי, הולך להיות + participle, אסיר תודה, כה. Both professional and human references are near zero on those. (My inference.)
- **Our human reference is the more colloquial voice.** It uses far more spoken interjections and exclamations than either Netflix or our AI: לעזאזל 17.8, אין מצב 5.8, נו, עזוב. It is the right target for "every character keeping a voice". (My inference.)
- **Possible over-slanging.** The AI uses יאללה/סבבה/וואלה/תכלס at 1.6 per 1,000 lines, while both references are near 0. That may be slang placed on formal characters ("register whiplash"). This is a hypothesis to check by sampling, not a finding.
- **Possessive suffixes are not a differentiator.** All three corpora use suffix forms in about 30–40% of possessives.

### Gaps
- No Hebrew dub of the live action was found, and none is mentioned in Hebrew Wikipedia's article on the 2023 series ([he.wikipedia](https://he.wikipedia.org/wiki/%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1_(%D7%A1%D7%93%D7%A8%D7%AA_%D7%98%D7%9C%D7%95%D7%95%D7%99%D7%96%D7%99%D7%94,_2023))). I could not check Netflix's audio track list directly.
- The Jetix dub's terminology is unknown: no transcripts surfaced, and the Reddit r/lostmedia "found One Piece's Hebrew dub" thread failed to load.
- The Netflix Hebrew translator's name is not in the files.
- Season 2 may still have Hebrew rips other than ETHEL; I did not compare them.

---

## 2. Are One Piece anime episodes or films available with Hebrew subtitles, and how do matching scenes compare with ours?

### Takeaway
- **Official anime subtitles exist but are paywalled.** One Piece joined the HOT/yes "ספריית האנימה" (Anime Library) on 1 Dec 2022 with Japanese audio and Hebrew subtitles. That is the only official Hebrew anime translation, and I could not obtain its files.
- **Downloadable anime subtitles are scarce and uneven:**
  - a 2013 fansub (ep. 331)
  - a 2026 human fansub of ep. 165 (Skypiea), decent and colloquial
  - a machine-translated ep. 001, a useful negative example
  - a "Hebrew"-tagged Film Gold file that is actually English
- **Scene comparisons:** where story beats overlap (Netflix live action vs. our East Blue to Drum; fansub ep. 165 vs. our Skypiea 07), our iconic lines read about as naturally as Netflix's. Our weak spots are transitional and descriptive lines, plus some agreement slips.

### Cited Findings
**Where the anime is available**
- HOT and yes launched "ספריית האנימה" in their SVOD on 11 Apr 2022, with Japanese or English audio and Hebrew subtitles. One Piece was added 1 Dec 2022 — [Hebrew Wikipedia: ספריית האנימה](https://he.wikipedia.org/wiki/%D7%A1%D7%A4%D7%A8%D7%99%D7%99%D7%AA_%D7%94%D7%90%D7%A0%D7%99%D7%9E%D7%94); [Hebrew Wikipedia: וואן פיס](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1) («בדצמבר 2022 הסדרה עלתה לספריית האנימה בדיבוב המקורי עם כתוביות בעברית», "in December 2022 the series went up on the Anime Library in the original audio with Hebrew subtitles").
- In Israel the anime streams on Crunchyroll and is not on Netflix Israel — [StreamRota (he)](https://streamrota.com.tr/he/tv/37854-wanpisu).
- wizdom.xyz has no Hebrew subtitles for the anime (tt0388629) or for the films Strong World, Z, Gold, Stampede or Red — [wizdom API](https://wizdom.xyz/api/search?action=by_id&imdb=tt0388629), queried 2026-11-03.

**OpenSubtitles Hebrew "one piece" search (25 results)**

Source: [search](https://www.opensubtitles.org/en/search/sublanguageid-heb/moviename-one%20piece).
- **Ep. 331 (filler)** — [link](https://www.opensubtitles.org/en/subtitles/4845813), 2013 fansub.
  - Credits: «תרגום: קוס צ'אן», «עורך: Rezo הכומר האדום», «הגהה: האב בוריס» (translation, editor, proofreader).
  - The opening-song lines are literal: «ברגע שאתה מקבל מוכן!» (lit. "the moment you get ready!").
- **Ep. 001** — [link](https://www.opensubtitles.org/en/subtitles/9729093). This is **machine translation**:
  - «''אני לופי! האיש מי / הולך להיות מלך הפיראטים!''» (lit. "the man who going to be")
  - «סֶרֶן! שודדי ים!» (vocalized "Captain! Sea robbers!")
  - «אלווידה-סאמה רצון / תהרוג אותנו» (lit. "Alvida-sama will / kill us", with "will" rendered as the noun "desire")
  - «P-בבקשה»
  - «גברים! תראה להם את האימה» (singular imperative addressed to "men")
- **Ep. 165 (Skypiea, "Jaya, City of Gold in the Sky")** — [link](https://www.opensubtitles.org/en/subtitles/13886212), uploaded 2026-07-07 by Shay1980. Human and idiomatic:
  - «הבחורה הזאת נהייתה סנילית!» (that girl's gone senile!)
  - «אוי לא, מבחן אחד / הספיק לי בהחלט, לעזאזל!» (oh no, one ordeal was plenty for me, damn it!)
  - «הישארו דרוכים.» (stay alert)
  - «עוד כוהן עומד להופיע.» (another priest is about to show up)
- **Film Gold** ([link](https://www.opensubtitles.org/en/subtitles/7148930)) is tagged Hebrew, but the file is English.
- OpenSubtitles injects an ad line ("לחץ על play… tryray.app") into non-VIP downloads. It is not part of any translation.

**Side by side: Netflix live action vs. ours (aligned by story beat; the live-action script is rewritten, so these are not the same source lines)**

Netflix files from [wizdom](https://wizdom.xyz/api/search?action=by_id&imdb=tt11737520); ours from this repo.

| Beat | Netflix | Ours |
|---|---|---|
| Hiriluk, Drum | «מתי אדם מת? / האם כשכדור מפלח את ליבו? / או כשהוא חולה במחלה חשוכת מרפא? / …כשהוא נשכח.» (when does a person die? when a bullet pierces his heart? … when he's forgotten) | «היי... מתי לדעתך אדם מת? / כשכדור אקדח פוגע בלבו? / כשהוא נפגע ממחלה חשוכת מרפא? / אדם מת... כשהוא נשכח.» (`drumisland 05 he.ass`) |
| Zoro after Mihawk | «לעולם לא אפסיד שוב!» (I'll never lose again!) | «לא אפסיד שוב!» |
| Buggy, Loguetown | «יש לך מילים אחרונות?» (any last words?) | «יש לך מילים אחרונות?!» |
| Owing a life | «אני חייב לך את החיים שלי!» | «אני חייב לך את חיי!» (suffix form, slightly more formal) |
| Luffy's dream | «אני אהיה מלך הפיראטים» (11×) | «אני אהיה מלך הפיראטים!» (15×), but also «...שהוא הולך להיות מלך הפיראטים», «איך הוא יודע שאני הולך להיות מלך הפיראטים?» (10×) |

**Side by side: fansub ep. 165 vs. our `skypiea 07 he.ass` (0:18–0:20)**

The English sources differ (One Pace vs. a Crunchyroll-type script). Fansub from [OpenSubtitles 13886212](https://www.opensubtitles.org/en/subtitles/13886212).

| Fansub | Ours |
|---|---|
| «להקת ציפורי הדרום... / אבל למה? / למה הן כל כך גדולות?» | «יש כל כך הרבה ציפורי דרום... / אבל למה... / למה הן כל כך גדולות?!» |
| «זהו חלק מאותו האי... / חלק מג'איה!» (it's part of that same island… part of Jaya!) | «זו החצי השנייה של האי ההוא / שנקרע.» (gender error: should be «זה החצי השני»), then «האי הזה היה חלק מג'איה!» |
| «עיר הזהב לא נעלמה. / במשך 400 שנה, / ג'איה הייתה שם, מרחפת בשמיים!» (the City of Gold didn't vanish; for 400 years Jaya was up there, floating in the sky) | «"עיר הזהב" שנולאנד ראה... / שהתקיימה פעם על פני השטח... / היא לא טבעה באוקיינוס! / החלק הזה של ג'איה... / היה בשמים כל הזמן הזה!» |

- Nearby lines in the same file of ours: «מה... זו רק לוח?!» (gender: לוח is masculine, so «זה רק קרש/לוח») and «היה קומה שנייה» (should be «הייתה»).
- Same file: a credit line «תרגום לעברית — That One Gerbil» sits at 0:20:20 in this AI (`he.ass`) file. It is probably a misattributed or leftover credit, worth a separate check.

**Another stilted line of ours**
- Wapol's "But I digress" is rendered «אבל אני מסתטה.» (`drumisland 05 he.ass`, line 517), a rare literary reflexive. Natural options: «אבל לא משנה.» / «אבל נעזוב את זה.» (my judgment).

### Inferences
- **Iconic lines are fine; the problem is elsewhere.** On famous lines our output is as natural as Netflix's, partly because these lines are well known in English and translate cleanly. The unnatural lines cluster in exposition, scene-bridging lines, and set phrases that English handles idiomatically: "as expected of", "going to be executed", "I digress", "I'm grateful". (My inference, consistent with the coordinator's flagged lines.)
- **A ready negative example set.** The machine-translated ep. 001 shows the extreme form of the same failure: word-for-word English syntax, "הולך להיות", and "סאמה" left in. It could serve as test input for a lint.
- **The best comparison source is still out of reach.** The HOT/yes official anime subtitles would be the most valuable Hebrew reference for East Blue through Marineford. A user with HOT or yes access could screenshot or transcribe a few scenes. (Suggestion.)

### Gaps
- I could not get the HOT/yes library subtitles: paid SVOD, and no rips found on wizdom or OpenSubtitles.
- I could not determine whether Netflix's anime catalog in other countries carries a Hebrew track.
- onepiece-nakama's anime fansubs (below) are hosted as video on Drive/Mega, so I extracted no subtitle text. No Hebrew fansubs of the films were downloadable, although the team announced Hebrew releases of Stampede (2020) and Red (2023) ([manga page sidebar](https://onepiece-nakama.com/manga/)).
- I found no downloadable Hebrew subtitles for Alabasta, Water 7, Enies Lobby, Thriller Bark, Sabaody, Amazon Lily, Impel Down, Marineford, Wano or Egghead.

---

## 3. What terms does the Israeli One Piece fan community use? Is there a Hebrew manga?

### Takeaway
- **No official Hebrew manga exists.** The Israeli fan hub onepiece-nakama.com translates every new chapter and every weekly anime episode, and is very active in 2026.
- **Fans transliterate Japanese terms** (יונקו, שיצ'יבוקאי, נקאמה, האקי, צ'אפטר) and say "כובעי הקש" and "פרי שטן". For the Marines they alternate between "המארינס" and "חיל הים".
- **Fansubs are relay translations too.** The fan team translates from Crunchyroll's English (timing credited to Crunchyroll), and every release has a separate **language-editing pass** (עריכה לשונית) and a dedicated **attack-names role** (מתקפות).

### Cited Findings
**Manga and fan translation scope**
- «אף על פי שמעולם לא יצא למנגה תרגום רשמי לעברית, ניתן למצוא תרגום מעריצים (של צ'פטרים 1-63, צ'פטרים 814 ואילך)» (the manga never got an official Hebrew translation; fan translations exist for ch. 1–63 and 814 onward) — [Hebrew Wikipedia](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1).
- onepiece-nakama.com posted "צ'אפטר 1197 מתורגם לעברית" on 31 Oct 2026, anime ep. 1180 on 29 Sep 2026, and an SBS project — [homepage](https://onepiece-nakama.com/). It links Facebook, Discord, Telegram, TikTok and YouTube communities ([manga page](https://onepiece-nakama.com/manga/)).
- Hebrew Wikipedia says Israeli fandom grew through file-sharing and «קבוצות מתרגמים חובבים אשר הפיצו כתוביות בעברית לסדרה מעט לאחר מועד שידורם המקורי ביפן» (amateur translator groups who distributed Hebrew subtitles shortly after the Japanese airing) — [he.wikipedia](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1).

**Fan team workflow (credits)**
- Ep. 1142: «תרגום ומתקפות – יסמין. עריכה לשונית, עיצוב דפוס, קידוד, בקרת איכות והעלאה – יצחק. תזמון – Crunchyroll.» (translation and attack names; language editing, typesetting, encoding, QC; timing from Crunchyroll) — [ep. 1142 post](https://onepiece-nakama.com/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%A4%D7%A8%D7%A7-1142-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/).
- Ep. 1083 was titled "מתורגם לעברית צחה!" ("translated into pure/clear Hebrew"), with a separate «עריכה לשונית: אריאל» — [post](https://onepiece-nakama.com/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%A4%D7%A8%D7%A7-1083-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%A6%D7%97%D7%94/).
- Ep. 1054 credited «מתקפות: יורה». A commenter complained when attack names were missing: «תמיד אתן מוסיפים שמות המתקפה בכל פרק» (you always add the attack names in every episode) — [post](https://onepiece-nakama.com/%D7%A4%D7%A8%D7%A7-1054-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/).
- The team descends from an earlier site ("האתר של שמעון") and had a rival site in 2018 — [ep. 822 post](https://onepiece-nakama.com/%D7%A4%D7%A8%D7%A7-822-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%9E%D7%97%D7%9C%D7%99%D7%98-%D7%9C%D7%94%D7%99%D7%A4%D7%A8%D7%93-%D7%A1%D7%90%D7%A0%D7%92%D7%99/).

**Fan vocabulary in posts and comments**
- «שבוע טוב נקאמה!» (have a good week, nakama!) — [ch. 1168](https://onepiece-nakama.com/%D7%A6%D7%90%D7%A4%D7%98%D7%A8-1168-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/); «כולנו נקאמה» (we're all nakama) — [ch. 1061](https://onepiece-nakama.com/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%A6%D7%90%D7%A4%D7%98%D7%A8-1061-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/). "Nakama" is used as a fandom identity word.
- The ch. 1061 discussion also shows:
  - «האקי מלכים» (Conqueror's Haki)
  - «התואר יונקו» (the Yonko title)
  - «פרי שטן / פרות שטן»
  - «אדמירל המשנה פרינס גרוס» (Vice Admiral Prince Grus)
  - «כובעי הקש»
  - a commenter's «אדמירל חייל הים» (Marine admiral)
- The fan arc guide translates arc names into Hebrew — [מדריך הסאגות והארקים](https://onepiece-nakama.com/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%A4%D7%A8%D7%A7%D7%99%D7%9D/):
  - «שחר ההרפתקה» (Romance Dawn)
  - «עיירת התפוזים» (Orange Town)
  - «ההר ההפוך» (Reverse Mountain)
  - «אוקיינוס החלומות» (Ocean's Dream)
  - «טירוני חיל הים» (Marine Rookie)
  - «באראטיה» (Baratie)
  - «התפצלות כובעי הקש»

**Hebrew Wikipedia terminology**

Sources: [וואן פיס](https://he.wikipedia.org/wiki/%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1); [היקום של וואן פיס](https://he.wikipedia.org/wiki/%D7%94%D7%99%D7%A7%D7%95%D7%9D_%D7%A9%D7%9C_%D7%95%D7%95%D7%90%D7%9F_%D7%A4%D7%99%D7%A1); [מונקי די. לופי](https://he.wikipedia.org/wiki/%D7%9E%D7%95%D7%A0%D7%A7%D7%99_%D7%93%D7%99._%D7%9C%D7%95%D7%A4%D7%99).
- **Crew:** «כובעי הקש» / «פיראטי כובע הקש» / «צוות שודדי כובעי הקש».
- **Marines and ranks:** «המארינס», «סגן האדמירל», «אדמירל המארינס».
- **Warlords / Emperors:** «שבעת השיצ'יבוקאי» / «השיצ'יבוקאי»; «היונקו».
- **Factions:** «ממשלת העולם» (main article) but «הממשלה העולמית» (Luffy article); «צבא המהפכה».
- **Seas and places:** «הקו הגדול», «הקו האדום», «איסט בלו (הים המזרחי)», «באראטיה».
- **Powers:** «פרי שטן / פירות שטן», «האקי חימוש», «אבן ים».
- **Luffy:** «אקדח גומי־גומי» (Gum-Gum Pistol), «פרי גומי־גומי».

### Inferences
- **Two registers, kept apart.** Fans use Japanese loanwords as in-group jargon (יונקו, שיצ'יבוקאי, נקאמה). Netflix and Wikipedia prose use Hebrew or English-derived forms (המארינס, אדוני הים, הממשלה העולמית). Our house choices (הצי, ארבעת הקיסרים, לוחמי הים, חברים) are fully translated and legitimate for a general audience. They are not what hardcore fans say, and not what Netflix says either. (My inference.)
- **The fans' workflow mirrors what the coordinator wants.** Translation is followed by a separate native language edit (עריכה לשונית). Our equivalent is the user's native review. An automated "language-editor" pass, run after translation and using the rules below, is the closest analogue. (My inference.)

### Gaps
- Facebook groups and the Discord are not publicly crawlable, so I could not sample their usage frequencies (for example פרי שטן vs. פרי השטן, or הצי vs. מארינס).
- I could not get fan subtitle files to measure their register the way I measured Netflix.

---

## 4. Where our glossary conflicts with established Hebrew usage, and where it is confirmed

### Takeaway
- **Confirmed:** the core vocabulary — מלך הפיראטים, הקו הגדול, פרי שטן, הכחול המזרחי, הוואן פיס, צייד הפיראטים, הקו האדום, כובע הקש, פרס / מבוקש, אדמירל הצי.
- **Conflicts with Netflix and Wikipedia:** Marines (הצי vs. המארינס), Seven Warlords (לוחמי הים vs. אדוני הים / שיצ'יבוקאי), Gum-Gum attack style (translated vs. transliterated), Baratie spelling (ברטי vs. באראטיה).
- **Our own inconsistencies to normalize:** ממשלת העולם vs. הממשלה העולמית, stray פרי שד, stray גום-גום, and סגן אדמירל vs. סגן-אדמירל.

### Cited Findings
External columns come from the sources in sections 1–3. Our columns come from `docs/translation-glossary.json` and `docs/translation-canon.json`, plus my line counts over shipped `.ass` files.

| Term | Ours | Netflix LA / LEGO | He-Wikipedia | Fans | Verdict (my judgment) |
|---|---|---|---|---|---|
| Marines | הצי (1,389 lines; "never מארינס" per canon) | המארינס (130), חייל/קפטן מארינס | המארינס | המארינס / חיל הים | **Conflict.** Keep הצי if the user prefers it: the human gold uses it and it reads as Hebrew. Note that every professional source says המארינס. Never mix. |
| Straw Hat Pirates | כובעי הקש (240), שודדי כובע הקש (8), פיראטי כובע הקש (5) | פיראטי כובע הקש, צוות כובע הקש | both | כובעי הקש | Confirmed |
| Devil Fruit | פרי שטן / פרי השטן; **פרי שד in 11 lines** | פרי שטן / פרי השטן | פרי שטן | פרי שטן | Confirmed; remove פרי שד |
| Gum-Gum attacks | גומי-גומי + translated weapon; **גום-גום in 32 lines** | גאם גאם פיסטול (transliterated); fruit = פרי הגומי | אקדח גומי־גומי | translated (dedicated attack role) | Keep house style (Wikipedia supports it); remove גום-גום |
| Pirate King | מלך הפיראטים | same | same | same | Confirmed |
| Grand Line | הקו הגדול (never גראנד ליין) | same | same | — | Confirmed |
| East Blue | הכחול המזרחי (+ some without ה) | הכחול המזרחי / הים המזרחי | איסט בלו (הים המזרחי) | איסט בלו | Confirmed; fix missing ה |
| One Piece (treasure) | הוואן פיס | הוואן פיס | ה"וואן פיס" | — | Confirmed |
| World Government | הממשלה העולמית (114) **and** ממשלת העולם (34) | הממשלה העולמית (12/12) | both | — | Normalize to הממשלה העולמית |
| Seven Warlords | שבעת לוחמי הים / לוחם ים | שבעת אדוני הים / אדון ים | שבעת השיצ'יבוקאי | שיצ'יבוקאי | **Conflict.** Our term is defensible; consider אדוני הים, which has Netflix precedent. |
| Four Emperors | ארבעת הקיסרים / קיסר | — | יונקו | יונקו | Fans differ; ours is fine for a general audience |
| Vice Admiral | סגן אדמירל (80) / סגן-אדמירל (28) | סגן האדמירל | סגן האדמירל | אדמירל המשנה | Pick one spelling (no hyphen, like Netflix) |
| Fleet Admiral | אדמירל הצי | אדמירל הצי | — | — | Confirmed |
| Bounty / poster | פרס / מודעת מבוקש | פרס על ראשו / כרזת מבוקש | — | — | Confirmed (either poster word is fine) |
| Going Merry | גויינג מרי | גואינג מרי | Going Merry | — | Minor spelling difference |
| Baratie | ברטי | (no spoken hit) | באראטיה | באראטיה | **Conflict.** Fans and Wikipedia say באראטיה. |
| Haki | האקי | — | האקי חימוש | האקי מלכים | Confirmed |
| Red Line | הקו האדום | הקו האדום | הקו האדום | — | Confirmed |
| Pirate Hunter | צייד הפיראטים | צייד הפיראטים | צייד פיראטים | — | Confirmed |
| nakama | חברים / חבר צוות | חבר/ת צוות, החברים שלי, הצוות שלי | — | נקאמה (fandom word only) | Confirmed; never transliterate in dialogue |

### Inferences
- **Terminology is not the source of the "bookish" complaint.** The term-level conflicts are policy choices. Naturalness problems are phrase-level (section 1 table and the rules below). (My inference.)
- **Internal inconsistencies may read as "AI" to a native.** Mixing ממשלת העולם and הממשלה העולמית, or פרי שד and פרי שטן, within one series can feel machine-made. These are cheap to normalize. (My inference.)

### Gaps
- No source settles whether ordinary Israeli viewers find הצי or המארינס more natural for the Marines. The user, as a native speaker, should decide.

---

## Actionable rules for our translator (ranked by expected impact)

Evidence: "Netflix" = 9,634 Netflix Hebrew cues; "human" = 7,015 That One Gerbil lines; "AI" = 129,950 lines of ours. Rewrites are my judgment unless a source is cited.

1. **"As expected of X" → never כצפוי / כמצופה / "לא פחות ממה שאפשר לצפות".**
   - **Why unnatural:** it is a written-register calque of English "as expected of". It occurs 0 times in Netflix and the human files, 27 times (כצפוי/כמצופה) plus 3 times ("לא פחות ממה ש…") in the AI.
   - **Natural alternatives:** «מה ציפית? זה X» (what did you expect, it's X); «ברור, זה X»; «לא פלא ש…» (no wonder…, Netflix uses it); «לא סתם…» (not for nothing…); «זה X בשבילך».
   - **Examples:**
     - «כצפוי מכל כוחות הצי.» → «מה ציפית? זה הצי.» or «ברור, זה הצי.»
     - «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» → «מה הפלא, הוא הפליג עם מלך הפיראטים!» or «לא סתם הוא הפליג עם מלך הפיראטים!»
   - **Lint:** `כצפוי|כמצופה|לא פחות ממה ש`

2. **"is going to be + participle/adjective" → future tense, or an active impersonal plural.**
   - **Why unnatural:** a calque of "going to be". Netflix has it 0 times, the human files 2, the AI 58. Netflix renders Luffy's dream «אני אהיה מלך הפיראטים» 11 times out of 11. Even the machine-translated ep. 001 shows the calque («האיש מי הולך להיות מלך הפיראטים», [OpenSubtitles](https://www.opensubtitles.org/en/subtitles/9729093)).
   - **Natural forms:** «X יהיה…»; passives become «הולכים ל־/יוציאו…».
   - **Examples:**
     - «אייס הולך להיות מוצא להורג» → «הולכים להוציא את אייס להורג» (user's own fix)
     - «לופי הולך להיות מוצא להורג?!» → «הולכים להוציא את לופי להורג?!»
     - «שאני הולך להיות מלך הפיראטים» → «שאני אהיה מלך הפיראטים»
     - «זה לא הולך להיות קל» → «זה לא יהיה קל»
   - **Lint:** `הולכ(ת|ים|ות)? להיות` and `(להיות|יהיה|תהיה) מוצא(ת)? ל`

3. **"Indeed" → drop אכן.**
   - **Why unnatural:** 144 AI lines vs. 0 in Netflix and 1 in the human files. It is a formal discourse marker that nobody says in dialogue.
   - **Natural alternatives:** «נכון», «באמת», «בדיוק», «צדקת», or nothing at all.
   - **Example:** «זה נראה רציני למדי, אכן.» → «זה באמת נראה רציני.»
   - **Lint:** `אכן`

4. **Gratitude: no אסיר/ת תודה.**
   - **Why unnatural:** 0 in Netflix and the human files, 0.3 per 1,000 in the AI. Netflix says «אני חייב לך», «אני מודה לך», «תודה רבה על העזרה», «קחו את זה לאות תודה».
   - **Example:** «אני אסיר תודה לך» → «אני מודה לך» (user's fix) or «אני חייב לך».
   - **Lint:** `אסיר(ת|י)? תודה`

5. **Commands: no ציווה / מצווה for an ordinary order.**
   - **Why unnatural:** biblical and literary. Netflix has 0.
   - **Natural alternatives:** «אמר», «הורה», «נתן הוראה», «ביקש».
   - **Example:** «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר לשמור על האח של אייס בחיים!» or «אבא נתן הוראה: האח של אייס נשאר בחיים!»
   - **Lint:** `ציווה|ציוותה|מצווה(?! הבר)`

6. **Fixed idioms must be the canonical form, or dropped.**
   - **Why:** a near-miss idiom stops a native reader cold.
   - **Examples:**
     - «שליט הגיהנום כבר נושם בעורף.» → «שליט הגיהנום כבר נושף לנו בעורף.»
     - «אבל אני מסתטה» (Wapol, "I digress") → «אבל לא משנה» / «אבל נעזוב את זה».
   - **Lint:** keep a list of known-wrong idiom variants (`נושם בעורף`, `מסתטה`, plus future reviewer finds).

7. **Literary function words → spoken equivalents.**
   - **Mappings:**
     - כה → «כל כך» (AI 0.4/1k; Netflix and human 0)
     - ייתכן ש → «אולי» / «יכול להיות ש»
     - היות ש / מאחר ש → «כי» / «בגלל ש»
     - הינו / הינם → drop the copula
   - **Note:** "הינה" in our files is usually the character Hina, so do not lint it.
   - **Example:** «מאחר שאתה לובש גלימה, חשבתי שאולי אתה אחד.» → «חשבתי שאתה אחד מהם, בגלל הגלימה.»

8. **Give characters spoken exclamations the way the human reference does.**
   - **Evidence:** compared with our human reference, the AI under-uses «אין מצב!» (2.4 vs. 5.8 per 1k), «בחיי» (0.5 vs. 2.7), «עזוב» (0.9 vs. 3.1) and «לעזאזל» (9.7 vs. 17.8).
   - **Natural mappings:**
     - "No way!" → «אין מצב!»
     - "Man!/Jeez!" → «בחיי!»
     - "Forget it" → «עזוב» / «עזבי»
   - **Example:** «זה בלתי אפשרי!» (for a shocked "No way!") → «אין מצב!»

9. **Normalize terminology, as a consistency pass.** Inconsistency itself reads as machine-made.
   - ממשלת העולם (34 lines) → הממשלה העולמית (Netflix 12/12, 114 of ours).
   - פרי שד (11) → פרי שטן.
   - גום-גום (32) → גומי-גומי.
   - סגן-אדמירל (28) → סגן אדמירל.
   - כחול המזרחי → הכחול המזרחי.
   - Decide explicitly, as user policy, whether to keep הצי vs. המארינס and לוחמי הים vs. אדוני הים. Both professional sources use the latter.

10. **Watch for register whiplash with slang (hypothesis, verify first).**
    - **Evidence:** the AI uses יאללה/סבבה/וואלה/תכלס at 1.6 per 1k vs. about 0 in Netflix and the human files.
    - **Rule:** keep these to young or casual characters (Luffy, Usopp, Franky). Never give them to Robin, Fujitora, Sengoku or the Gorosei.
    - **Lint:** flag the lines and spot-check by speaker.

11. **Formal grammar is acceptable; formal vocabulary is not.**
    - **Evidence:** Netflix uses איני / אינו (2.2/1k) and עליי ל־ (1.8/1k) without sounding bookish.
    - **Rule:** don't over-correct these when the speaker is formal (Mihawk, Robin, narrators). Spend the effort on rules 1–7 instead.

Suggested detector (from rules 1–7): run these regexes over all `he.ass` dialogue lines and rank episodes by hits per 1,000 lines. `כצפוי|כמצופה|לא פחות ממה ש|הולכ(ת|ים|ות)? להיות|מוצא(ת)? להורג|(?<![א-ת])אכן(?![א-ת])|אסיר(ת|י)? תודה|ציווה|ציוותה|(?<![א-ת])כה(?![א-ת])|ייתכן|יתכן|(?<![א-ת])מאחר ש|(?<![א-ת])היות ש|נושם בעורף|מסתטה`.
- The word boundaries on מאחר ש and היות ש are needed. Without them, "להיות ש" matches.
- Measured hit rates on this exact pattern:
  - **Netflix:** 4 / 9,634 cues = **0.4 per 1,000**
  - **Human (Gerbil):** 1 / 7,015 = **0.14 per 1,000**
  - **Our AI:** 414 / 129,950 = **3.2 per 1,000**, about 8 times Netflix and 20 times the human files (my counts).
- An episode well above about 1 per 1,000 is a good candidate for native review.
