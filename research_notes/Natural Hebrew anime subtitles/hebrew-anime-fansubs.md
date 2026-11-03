# Israeli anime fansub community: conventions, real subtitle files, and what reads natural

Researcher scope: Hebrew anime fansub groups and sites, past and present; their written guides; 14 real Hebrew anime subtitle files; community complaints about quality; concrete rules for our translator.
Downloads (untrusted, read-only) are under `/private/tmp/claude-501/-Users-isar-git-onepace-hebrew-stremio/48c368d3-3940-4b66-abac-e65768540f81/scratchpad/fansubs/dl_*`. Quotes below are short excerpts. Lines from `.srt` files were stored in visual order (punctuation first), and I normalised them when quoting.
Every judgment about how natural a line reads is **mine** (native-speaker style review) and is marked "My verdict".

---

## Q1. Who translates anime into Hebrew? Groups, sites, communities, One Piece

### Takeaway
Hebrew anime translation comes from a long-running volunteer fansub scene. It started on forums (Anime-IL, Anime Spin, Tapuz, FXP), moved to group WordPress sites, then to Discord and Telegram, and now also includes AI-translated streaming sites. One Piece has one dedicated, still-active Hebrew group, **One Piece Nakama**. Its releases are hardsubbed video (Drive/Mega/Telegram), not text subtitle files. The official Hebrew subtitles that exist are mostly Netflix's, plus Israeli theatrical releases such as One Piece Film Red.

### Cited Findings
- **KaT (Kosher Anime Translations)** was founded on 22 Jan 2005. It calls itself the first long-lived Israeli group, and in 2024 it was still releasing (Gurren Lagann, Usagi Drop). It says its founding motive was that the Hebrew TV dubs of the time "were Western in character and not faithful to the original". — [KaT home](https://www.kateam.org/), [KaT "Sweet 16"](https://www.kateam.org/page/3?p=FAQ)
- **Paradise Subs** ran from Nov 2010 and formally retired in March 2025. Its founder, "leeloo", also timed for KaT and opened the Israeli fansub Discord server (`discord.gg/VpCpd4j`), which she says is now the place to ask experienced fansubbers. — [Paradise Subs home](https://paradisesubs.net/), [Paradise "about"](https://paradisesubs.net/%d7%90%d7%95%d7%93%d7%95%d7%aa/), [beginner's guide comments](https://paradisesubs.net/%d7%94%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%9e%d7%9c%d7%90-%d7%9c%d7%a4%d7%90%d7%a0%d7%a1%d7%90%d7%91%d7%a8-%d7%94%d7%9e%d7%aa%d7%97%d7%99%d7%9c/)
- **Other groups**:
  - AntyLicense Subs (TsUNaMy WaVe) — [alsubs.net](https://alsubs.net/%D7%93%D7%A8%D7%95%D7%A9%D7%99%D7%9D/)
  - One Man Sub, which translated Assassination Classroom — [Paradise 8th-birthday post](https://paradisesubs.net/%D7%94%D7%97%D7%99%D7%99%D7%9D-%D7%9E%D7%9E%D7%A9-%D7%90%D7%97%D7%9C%D7%94-%D7%9B%D7%A9%D7%90%D7%AA%D7%94-%D7%91%D7%9F-8-%D7%95%D7%9E%D7%90%D7%95%D7%94%D7%91-%D7%91%D7%A4%D7%90%D7%A0%D7%A1%D7%90/)
  - Spicy-Sub, a new group whose founder has fansubbed since 2010 and earlier founded "Super-Sub" — [spicy-sub.info/team](https://spicy-sub.info/team)
  - Fast-Sub, founded 2009, with 30+ members and 30+ series by 2014 — [academics.co.il article](http://www.academics.co.il/Articles/Article81236.aspx)
  - BakaNeko Fansubs (2010) — [blog](http://bakaneko-fansubs.blogspot.com/2010/01/blog-post.html)
  - Journey Sub — [site](https://subdotjourney.wordpress.com/)
  - AnimeBlood and Science Sub — [animebloodsub.net](https://animebloodsub.net/2022/07/16/%d7%a1%d7%a4%d7%99%d7%99%d7%a9%d7%9c-%d7%93%d7%a8-%d7%a1%d7%98%d7%95%d7%9f-%d7%a8%d7%99%d7%95%d7%a1%d7%95%d7%99-%d7%a9%d7%aa%d7%a4-%d7%a2%d7%9d-%d7%a1%d7%99%d7%99%d7%a0%d7%a1-%d7%a1%d7%90/)
- **Older and franchise-specific groups**, identified from credit lines inside the files I downloaded:
  - Naruto: "HanimeS_YZ"; "Gil_Gil" for **Naruto-Fan.net**
  - Bleach: "אלדן אליאס" for **BLEACH.org.il**
  - Attack on Titan: "ColdRiot"
  - Demon Slayer: Infinity Castle (2025): "ליידי נץ"
  - Download links are under Q3.
- **Aggregator, streaming and Telegram sites**:
  - animeisrael.co.il hosts One Piece episodes 1–1097, credited to "וואן פיס נקאמה" and "וואן פיס ישראל". It names its translators and its linguistic editors (עריכה לשונית). — [animeisrael new episodes](https://animeisrael.co.il/%D7%A4%D7%A8%D7%A7%D7%99%D7%9D-%D7%97%D7%93%D7%A9%D7%99%D7%9D/), [animeisrael One Piece](https://animeisrael.co.il/http-animeisrael-co-il-category-%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%A4%D7%A8%D7%A7%D7%99%D7%9D/)
  - anime-sub.co.il says it has 973 One Piece episodes with Hebrew subtitles. — [anime-sub One Piece](https://anime-sub.co.il/%d7%95%d7%95%d7%90%d7%9f-%d7%a4%d7%99%d7%a1/)
  - Telegram groups stream One Piece with Hebrew subtitles. — [telegram-group listing](https://telegram-group.com/%D7%A1%D7%A8%D7%98%D7%99%D7%9D%D7%A1%D7%93%D7%A8%D7%95%D7%AA/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%9C%D7%A6%D7%A4%D7%99%D7%99%D7%94-%D7%99%D7%A9%D7%99%D7%A8%D7%94/)
  - ai-sub.net is a fan site whose name and content indicate AI translation. — [ai-sub post](https://ai-sub.net/posts/678e1b8c966eeff8b37c7ae2)
- **One Piece Nakama (onepiece-nakama.com)** is the Hebrew One Piece fansub:
  - Its releases run up to episode 1180 (29 Sep 2026) and manga chapter 1197 (31 Oct 2026). — [OP Nakama home](https://onepiece-nakama.com/)
  - Credits list separate roles: "תרגום – שמעון. עריכה לשונית ומתקפות – יסמין. עיצוב דפוס, בקרה, קידוד – יצחק". Attack names ("מתקפות") are a dedicated editing role. — [OP Nakama ep 1127](https://onepiece-nakama.com/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%A4%D7%A8%D7%A7-1127-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/), [OP Nakama special](https://moccasin-goshawk-102889.hostingersite.com/%D7%A1%D7%A4%D7%99%D7%99%D7%A9%D7%9C-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%9E%D7%9B%D7%AA%D7%91-%D7%94%D7%A2/)
  - In 2018 it was releasing ep 821 with roles "תרגום / עריכה לשונית / בקרת איכות / קידוד". — [ep 821 post](https://moccasin-goshawk-102889.hostingersite.com/%D7%A4%D7%A8%D7%A7-821-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%9E%D7%94%D7%95%D7%9E%D7%94-%D7%91%D7%98%D7%99%D7%A8%D7%94/)
  - Its poll #9 asked about the next project. "One Pace – עריכה מתומצתת של הסדרה לפי המנגה" got 50 votes, against 63 for filler episodes. — [OP Nakama polls](https://onepiece-nakama.com/%D7%A1%D7%A7%D7%A8%D7%99%D7%9D/)
  - It translated *Film Red* even after its Israeli cinema release ("סרט של וואן פיס בקולנוע"), saying its version is "ברמה אחרת". — [Film Red post](https://moccasin-goshawk-102889.hostingersite.com/%D7%95%D7%95%D7%90%D7%9F-%D7%A4%D7%99%D7%A1-%D7%94%D7%A1%D7%A8%D7%98-%D7%A8%D7%93-%D7%9E%D7%AA%D7%95%D7%A8%D7%92%D7%9D-%D7%9C%D7%A2%D7%91%D7%A8%D7%99%D7%AA/)
- **An older One Piece site, "וואן פיס ישראל"**, served episodes 1–210 as MediaFire downloads. — [2all.co.il OnePiece](https://www.2all.co.il/web/Sites7/0nePiece/PAGE10.asp)
- **Official Hebrew subtitles exist on Netflix**. The One Piece live action (2023) Hebrew `.srt` I downloaded carries the uploader credit "הביא ותיקן: avi054" and Netflix-style sign captions. — Wizdom file id 317254 ([download](https://wizdom.xyz/api/files/sub/317254))

### Inferences
- The scene's centre of gravity has moved from forums and WordPress sites (2005–2020) to Discord and Telegram, with AI-translated sites appearing since about 2024. Older guides survive mostly as restored Google Docs. (Mine, from dates across the sources above.)
- Because One Piece Nakama ships hardsubs, its actual subtitle wording is not text-searchable. Comparing our lines with the Israeli One Piece fan register would mean watching or OCR-ing their videos. (Mine.)

### Gaps
- KaT's "קווים מנחים לתרגום" (translation guidelines) page is referenced by its timing guide but returned 404 (CRAWL_NOT_FOUND). — [KaT timing guide](https://www.kateam.org/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%aa%d7%96%d7%9e%d7%95%d7%9f-%d7%a2%d7%a4-kat)
- I could not access Discord or Telegram content, Facebook groups, or ktuvit.me, which needs a login.
- I found no Hebrew text subtitles for the One Piece *anime*. OpenSubtitles' Hebrew "one piece" results were all the live action and LEGO One Piece. Wizdom had none for tt0388629.

---

## Q2. Written style rules: honorifics, interjections, attack names, stock phrases, voices, profanity

### Takeaway
Israeli fansub guides say a lot about *process*: translate from Japanese, edit, keep a glossary, match register to the character. They say very little about specific stock phrases. The one detailed written source on unnatural Hebrew is Yair's guide on literal translation from English, preserved by Paradise Subs. It names the exact mechanism behind our problem: copying English syntax and English filler words into grammatical but foreign-sounding Hebrew. Honorifics are traditionally **kept** in fansubs (-סאן, -צ'אן, -קון, -סאמה, -דונו). Netflix-style official subtitles drop them.

### Cited Findings
**Literal translation from English (Yair's guide, restored from Anime Spin)** — [Google Doc linked from Paradise Subs](https://docs.google.com/document/d/1023mPe-6GPE8KDUMwgmz-YICAlZEIXtkEZrHCpjuHXg/edit?usp=sharing)
- **Definition**: literal translation means "using a grammatical form that fits English, translating word by word". At best it "looks bad", in the middle case it makes reading "cumbersome", and at worst it distorts meaning.
- **Three levels of severity**:
  - Not understanding an idiom at all. Examples: "האם זה מצלצל לך באיזה פעמון?" for *ring a bell*, where the fix is "זה מזכיר לך משהו?"; and "נופל מאהבה" for *fall in love*, where the fix is "להתאהב".
  - Keeping English syntax while preserving the meaning.
  - **Adding words that only English grammar needs**, which are "completely unnecessary in Hebrew".
- **"Well" and "ובכן"**: English often opens with "well" where the Japanese has nothing, and translators then write "ובכן". The guide says to drop it unless it really fits.
- **Specific substitutions**:
  - "is it this way?" → "מכאן?", not "בדרך הזאת?"
  - "you want some tea?" → "רוצה תה?", not "רוצה קצת תה?"
  - "would you like to reconsider?" → "תחשבי על זה שוב?", not "האם תרצי לשקול את זה מחדש?"
  - "Let me go!" → "תעזבו אותי!", not "תנו לי ללכת!"
  - "you'll be cursed" → "את תקוללי", not "את תהיי מקוללת"
  - "I'm too late" → "מאוחר מידי", not "אני איחרתי"
  - "so fresh and innocent" → "כזאת צעירה ותמימה"
  - "never thought" → "לא חשבתי" when the time span is short, not "מעולם לא חשבתי"
  - Questions children ask: drop "האם", e.g. "זה מזכיר לך משהו?"
  - Word order: "בואי נחזור ביחד הביתה" sounds better than "בואי נחזור הביתה יחד". The test is "which one would you say to your friends?"
- **Typography**: never more than one exclamation mark, and no stretched letters ("לאאאא").
- **Method**: listen to the Japanese; "don't try to imitate the English"; reread each line and ask whether there is a nicer Hebrew way; get an experienced editor.

**Paradise Subs beginner's guide** — [link](https://paradisesubs.net/%d7%94%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%9e%d7%9c%d7%90-%d7%9c%d7%a4%d7%90%d7%a0%d7%a1%d7%90%d7%91%d7%a8-%d7%94%d7%9e%d7%aa%d7%97%d7%99%d7%9c/)
- **Register matching ("התאמה משלבית")**:
  - "If a *ars* speaks street language, it must show in the translation." Censor curses if the audience is young.
  - Children speak childishly, sometimes with small deliberate mistakes, "within good taste".
  - Normal-looking characters who speak high register (Yaoyorozu in My Hero Academia) get higher-register wording.
  - Real nobles and Edo-period speech ("reminds a bit of Shakespearean language") get their own register.
  - "**Don't make a small child talk like an aristocrat, and don't make Yaoyorozu talk like Bakugo.**"
- **Flow**: "read the sentences and check whether they sound fluent enough in Hebrew without losing the meaning". The author calls this "the biggest struggle even for experienced translators".
- **Common errors in bad Hebrew fansubs**: spelling, gender agreement (זכר/נקבה), אית"ן letters, who is speaking to whom, numbers.
- **Consistency**: keep a per-series document of names, terms and recurring phrases.
- **Source language**: translate from Japanese where possible. A bad English translation "will show in your translation".

**AntyLicense Subs recruiting page** — [link](https://alsubs.net/%D7%93%D7%A8%D7%95%D7%A9%D7%99%D7%9D/)
- A translator must know "when the English is too much, when it isn't related to the Japanese".
- "A good translator conveys the series' atmosphere and the speaking character's personality."
- "The goal is that the translation **sounds good in Hebrew** but stays faithful to the source — and the source is the Japanese, not the English."
- Editors "change phrasings when the sentence doesn't sound good".

**KaT FAQ on honorifics** — [link](https://www.kateam.org/group/fansub)
- Suffixes are "usually used as they are", attached to the name ("סאסוקה-קון וסאקורה-צ`אן"), with a glossary for -סאן, -צ'אן, -קון, -סאמה, -דונו (archaic, samurai), סנסיי, and no suffix (closeness).
- KaT separates **עריכה לשונית** (Hebrew-level editing) from **בקרת תרגום** (accuracy against the Japanese).

**Hebrew Wikipedia on fansubs** — [link](https://he.wikipedia.org/wiki/%D7%A4%D7%90%D7%A0%D7%A1%D7%90%D7%91)
- Fansubs typically "preserve the spirit of Japanese culture… in name suffixes, leaving concepts and cultural features (with explanation)".
- They typeset on-screen text and add karaoke for songs.

**Israeli Fansub Association ethics, reposted by Paradise Subs** — [link](https://paradisesubs.net/%d7%90%d7%aa%d7%99%d7%a7%d7%aa-%d7%94%d7%a4%d7%90%d7%a0%d7%a1%d7%90%d7%91/)
- A translation must be "professional and well phrased according to the rules of Hebrew".
- It explicitly does *not* mandate a register or style: "זה לא סעיף שמחייב על משלבים לשוניים".

**Professional dubbing translator "דנה" (studio Zaound; Pokémon and other cartoons), on Tapuz** — [Tapuz thread](https://www.tapuz.co.il/threads/%D7%9C%D7%9B%D7%9C-%D7%90%D7%95%D7%94%D7%91%D7%99-%D7%94%D7%93%D7%99%D7%91%D7%95%D7%91%D7%99%D7%9D-%D7%91%D7%90%D7%A9%D7%A8-%D7%94%D7%9D.11744526/)
- Her method: draft first, then "I read the sentences in English and then **say them to myself in Hebrew**, i.e., I don't translate word by word, because then in Hebrew it really sounds a bit strange".
- "It is important to check every sentence and see **whether this really is the spoken way to say it**. What trips us up is that we are writing *spoken* language, not written language."
- She reads every role aloud at normal speaking pace.
- She cites a deadline of 8–10 episodes a week and says the speed hurts creativity.
- A fan in the same thread admits his own Pokémon episodes had "sentences that were a bit 'strange' in Hebrew", probably because he "stuck too close to the English".

**Attack names in One Piece Nakama's own posts**
- Zoro's moves are given as romaji with a Hebrew gloss: "Oni Giri – חיתוך השד", "Shishi Sonson – שיר האריה", "Sanzen Sekai – שלושת אלפים עולמות". — [OP Nakama polls](https://onepiece-nakama.com/%D7%A1%D7%A7%D7%A8%D7%99%D7%9D/)
- Laughs are transliterated: "שורורורורורו", "דרישישישישי".
- The group's polls call the Marines **"חיל הים"** ("צוות כובע הקש נגד חיל הים"; "לאן הייתם מעדיפים להצטרף? … חיל הים"). Netflix's live-action subtitles use **"המארינס"** instead (file 317254, line 9: "אך המארינס, בשליחות הממשלה העולמית").

### Inferences
- Nobody in the Israeli scene publishes a phrasebook for stock anime lines such as "As expected of…", "I won't forgive you" or "Prepare yourself". The community's only weapon against them is Yair's general principle: if it is legal Hebrew that only makes sense when you remember the English, rewrite it. Our house "English tells" list (docs/translation-learnings.md §1.5) is effectively a more systematic version of Yair's guide. (Mine.)
- Fansub culture rewards keeping Japanese texture (honorifics, romaji attack names). Our target, a contemporary professional subtitle for a big-cast shonen, sits closer to Netflix style. That supports our house choice of אדון/גברת + name and translated attack names. (Mine.)

### Gaps
- I found no Israeli written guidance on Japanese interjections (oi, yosh, nani, kuso, teme, yatta, ara), on profanity levels, or on translator notes beyond a top-of-screen `{\an8}` note for signs (Paradise guide). The practice I observed in the files is described in Q3.

---

## Q3. Real Hebrew anime subtitle files: a native-reader review

### Takeaway
Across 14 files (5 professional or streaming-style, 9 fansubs), the same small set of English calques does most of the damage. Fansubs read "translated" mainly because of these, plus spelling errors. The professional files are much more idiomatic in dialogue and use more slang. They still slip into high register in narration, and occasionally calque even there.

### Files reviewed
Sample sizes run from about 60 to 340 lines per file.
- **Professional or streaming-style**:
  - One Piece live action S01E01 and E03: Netflix Hebrew via uploader avi054. Wizdom [317254](https://wizdom.xyz/api/files/sub/317254) and [317256](https://wizdom.xyz/api/files/sub/317256).
  - My Hero Academia S01E01: release "ANiME.SPANiSH…WEB-ENDURANCE", with RLE direction marks and "- X -" sign captions. My inference is a streaming-service rip. [247264](https://wizdom.xyz/api/files/sub/247264)
  - One Punch Man S01E01: "BlueRay", polished and uncredited. [208910](https://wizdom.xyz/api/files/sub/208910)
- **Fansubs**:
  - Fullmetal Alchemist: Brotherhood E01: honorifics kept, uncredited. [317539](https://wizdom.xyz/api/files/sub/317539)
  - Spy x Family E01: uncredited. [333162](https://wizdom.xyz/api/files/sub/333162)
  - Demon Slayer S3E10: Aegisub `.ass`. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19e80c63/filead/1958175877.gz)
  - Hunter x Hunter (2011) E10, built on HorribleSubs. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19b40c5a/filead/1954045777.gz)
  - Attack on Titan S01E01, by "ColdRiot". [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19ca0c5b/filead/1953591719.gz)
  - Naruto E01, by HanimeS_YZ. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-e9760b7c/filead/173251.gz)
  - Naruto E149, by Gil_Gil / Naruto-Fan.net. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19c50c56/filead/1956416751.gz)
  - Bleach E39, by BLEACH.org.il. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19d80c5d/filead/1953586726.gz)
  - Demon Slayer: Mugen Train film, uncredited. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19b30c50/filead/1957322541.gz)
  - Demon Slayer: Infinity Castle (2025), by "ליידי נץ". [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19b50c54/filead/1962526534.gz)
  - Jujutsu Kaisen 0, Aegisub. [OpenSubtitles](https://dl.opensubtitles.org/en/download/src-api/vrf-19e60c5d/filead/1957940926.gz)

### Cited Findings: lines that read natural
All verdicts are mine.
- **Surprise or disbelief**:
  - "מידוריה? **אין מצב בעולם!**" (MHA). *No way in hell!*
  - "**לא יכול להיות!**" (FMAB, JJK0). *It can't be!*
  - "הא? מה? **ברצינות?**" (Demon Slayer S3E10). *Huh? What? Seriously?*
- **Bravado and taunts**:
  - "**נראה לך שזה משחק?!**" (MHA). *You think this is a game?!*
  - "**מה אתה כבר יכול לעשות?**" (MHA). *What could you possibly do?*
  - "**בוא נראה אותך!**" (OPM). *Bring it!*
  - "**גם כן גיבור!**" (OPM). *Some hero!*
  - "כן! **תכניסו להם!**" (OP live action). *Give it to them!*
  - "היית צריך להילחם בו! **למה לא כיסחת אותו?**" (OP live action). *Why didn't you beat him up?*
- **Insults**:
  - "**מנוול.**" (MHA). *Bastard.*
  - "**פריק נטול קווירק!**" (MHA). *Quirkless freak!*
  - "ענה לי, **ננס עלוב**." (OP live action). *Answer me, you miserable runt.*
  - "**איזה דבילים!**" (Naruto 1). *What idiots!*
  - "**חתיכת אידיוט!**" (Naruto 1). *You idiot!*
  - "**קמצן!**" (Naruto 1). *Stingy!*
  - "**למי קראת גמדון!?**" (FMAB). *Who are you calling a shrimp?!*
- **Colloquial idiom carrying the meaning instead of the English words**:
  - "**שיחקתי אותה** במבחני המתכונת." (MHA). *I aced the mock exams.*
  - "היה לי היום עוד ראיון עבודה, **וזרקו אותי מכל המדרגות**." (OPM). *They threw me down every stair*, i.e. flat rejection.
  - "איזה מין... **סיפור רקע מחורטט** זה?" (OPM). *What kind of BS backstory is that?*
  - "**זה פתאום בא לי.**" (OPM). *It just came to me.*
  - "**עבדו עלי!**" (Spy x Family). *I've been had!*
  - "בוא נסיים עם זה **צ'יק-צ'ק**, אל." (FMAB). *Let's wrap this up in a flash.*
  - "**אני מת מרעב.**" (OP live action). *I'm starving.*
  - "**הוא תפס אותך**, קפטן." (OP live action). *He got you there, captain.*
  - "**זה הצ'אנס שלי!**" (Demon Slayer S3E10). *This is my chance!*
- **"As expected of…" done idiomatically, and sarcastically**: "טוב, **למה כבר אפשר לצפות מ**בן..." (OPM). *Well, what else would you expect from a…*

### Cited Findings: lines that read translated, with fixes
All verdicts and fixes are mine.
- **"As expected of…" calque**:
  - Line: "**כפי שניתן לצפות מ**אלכימאי המתכת, אדוארד אלריק-סאן!" (FMAB).
  - Why it fails: this is a written-register calque; nobody cheers like this.
  - Fix: "**אין כמו** אלכימאי המתכת!" / "**לא סתם** קוראים לו אלכימאי המתכת!"
- **"Well, if it isn't X"**:
  - Line: "**אם אין זה** בנו של ד"ר ייגר." (AoT). Word-for-word English idiom.
  - Fix: "**תראו מי פה** — הבן של ד"ר ייגר."
  - Our corpus has the same calque: IM_3 "הו! אם זה לא מר 3!"
- **"I see" → "אני רואה"**:
  - Lines: "...אני רואה" (HxH E10, AoT); "אני רואה. אז אולי הוא יוכל לתפוס אחד?" (Naruto 149).
  - Why it fails: the classic fansub calque. In Hebrew "אני רואה" means literal sight.
  - Fix: "**הבנתי.**" / "**אה, ככה.**" / "**אז ככה.**"
  - The better files use "הבנתי" (OP live action E03, JJK0, Mugen Train).
- **"Prepare to die"**:
  - Line: "**תתכונן למות.**" (HxH).
  - Fix: "**אתה גמור.**" / "**הלך עליך.**" / "**עכשיו אתה מת.**"
  - Line: "!תתכוננו / !**אני עומדת להיות רצינית**" (DS S3E10). Calque of *get ready, I'm going to get serious*.
  - Fix: "**עכשיו אני מתחילה ברצינות!**"
- **"Taste the power of…"**:
  - Line: "**קבל טעימה לכוחם** של בני האדם!" (AoT).
  - Fix: "**תראה מה בני אדם מסוגלים לעשות!**" / "**קבל את זה!**"
- **"Can't thank him enough"**:
  - Line: "**אנחנו לא יכולים מלהודות לו מספיק**." (AoT).
  - Fix: "**אנחנו חייבים לו המון.**"
- **"No big deal"**:
  - Line: "זה לא **סיפור גדול**." (AoT).
  - Fix: "**זה לא סיפור.**" / "**לא ביג דיל.**"
- **"Make a decision"**:
  - Line: "**עשיתי החלטה שגויה!**" (DS S3E10). Hebrew takes a decision (מקבלים החלטה).
  - Fix: "**טעיתי!**" / "**זו הייתה טעות!**"
- **"I'll treasure it"**:
  - Lines: "אני בהחלט **אוקיר** את זה." (DS S3E10); "אני **אנצור** אותה במשך שארית חיי!" (MHA, professional).
  - Fix: "**אני אשמור את זה כל החיים!**"
- **"Lend me your strength" / "I want to be useful"**:
  - Lines: "**תשאילי לי את כוחך.**" and "אני רוצה **להביא תועלת**!" (JJK0).
  - Fix: "**תני לי מהכוח שלך.**" / "**אני רוצה לעזור!**"
- **"Show some respect and face me" / "stay focused" / "Right!"**:
  - Lines: "**גלה קצת כבוד** ותתמודד מולי." "**הישאר ממוקד!**" "**נכון** -." as the reply to an order (Infinity Castle).
  - Fixes: "צא ותילחם בי כמו גבר." "**תתרכז!**" "**כן!**" / "**הבנתי!**"
- **"What an easy kill" / "Which one is it?"**:
  - Lines: "**איזה הריגה קלה.**" and "?**איזה אחד מהם**" (Bleach 39).
  - Fixes: "**זה היה קל מדי.**" / "**אז מה זה יהיה?**"
- **"The atmosphere is gloomy"**:
  - Line: "**האטמוספרה** בצד השני קודרת" (HxH).
  - Fix: "בצד השני **האווירה מתוחה**."
- **Leftover "Please" and a garbled sentence**:
  - Line: "**בבקשה אל תתייחס שהבאתי חרב.**" (Mugen Train).
  - Fix: "**אל תשים לב לחרב.**"
- **"Street urchin" mistranslated as a hedgehog — in Netflix's own file**:
  - Line: "**קיפוד הרחוב** החביב עלינו" (OP live action E01), from "our favourite street urchin". *Urchin* was read as *sea urchin = קיפוד ים*.
  - Fix: "**הזאטוט / הפרחח** החביב עלינו".
  - Even professional subtitles calque under deadline.
- **Bookish words in casual dialogue**:
  - "יותר מזה, **איני** יודע." (OP live action) → "חוץ מזה אני לא יודע כלום."
  - "למה הם **כה** מעט?" (AoT) → "למה חזרו כל כך מעט?"
  - "בואו ננצח את זה **יחדיו**!" (DS) → "בואו ננצח ביחד!"
  - "**הבה** נזדרז" (FMAB) → "בוא נזדרז / קדימה, מהר"
  - "הרגתי אותם כי רציתי להרגם, **ותו לא**." (FMAB) → "...וזהו."
  - "**אכן כך.**" (FMAB) → "**נכון.**"
  - "**מוטב** שתוותר." (MHA doctor) → "כדאי שתוותר על זה."
- **"Because…" at the start of an answer**:
  - Line: "**בגלל ש**גם אני פיראט." (OP live action) → "**כי** גם אני פיראט."
- **Stock "I won't forgive you"**:
  - Lines: "אני לא אסלח לך!" (MHA, JJK0, Infinity Castle, FMAB). This appears in both professional and fan files.
  - My verdict: it is understood, but it is anime-speak. In an angry Israeli mouth it would be "**אתה תשלם על זה!**" / "**זה לא יעבור לך בשקט!**". Keep "לא אסלח לך" only where forgiveness is the real topic.
- **Spelling markers of low-quality fansubs**:
  - First-person future with yod: "אני יעשה / אני יקח / אני ימצא" (HxH, Naruto 1, Bleach 39).
  - Typos: "מישהוא", "ככבוצה", "אינטילגנציה", "פסכיאטר" (HxH, Spy x Family).
  - Exclamation and stretching: "יייששששש!!!" (Naruto 1).
  - My verdict: these make readers distrust the subtitles. That matters to us only as a lint target, not a register issue.

### Cited Findings: how anime-specific elements were handled in practice
Observed in the files above.
- **Honorifics**:
  - Fansubs keep them, hyphenated or not: "ניי-סאן", "אליסיה-צ'אן", "אייזק-דונו" (FMAB); "הוקאגה סאמה", "אירוקה סנסיי", "ססקה קון" (Naruto 1); "פורג'ר סאמה", "טסוגארה קון" (Spy x Family); "קאנרוג'י-סאן", "נזוקו-צ'אן" (Demon Slayer).
  - The professional MHA file keeps only nickname forms such as "קצ'אן" and "דקו".
- **Japanese interjections**:
  - Almost all files render *eh?/huh?* as "**הא?**", which reads natural.
  - Low-end fansubs leave "אוקי", "צס", "האמפ", "קק..." (HxH).
  - The professional files use "אוי, לא...", "שיט", "לעזאזל", "תודה לאל" (MHA).
- **Attack names**:
  - Fansub (Demon Slayer S3E10): translated into Hebrew with a form label, e.g. "נשימת אהבה - סגנון שלישי: / מָטָר אהבת חתול!".
  - Older fansub (Naruto 1): Hebrew plus romaji in brackets, e.g. "שינוי צורה! (Henge no. jutsu)"; "Sexy no. jutsu".
  - Netflix live action: romaji, e.g. "גאם גאם... פיסטול!".
  - Literal word-for-word attack names read oddly: "**אש חסרת ידע!**" (Mugen Train, for *Unknowing Fire*).
- **Profanity**:
  - Professional files use "מנוול", "שיט", "חרא", "לעזאזל", "דפוקים" ("המארינס הדפוקים", OP live action).
  - Fansubs go further: "סתמי את הפה שלך, כלבה" (DS S3E10).
- **Formal characters**: FMAB's Führer and officers ("אם זוהי פקודתך", "אני מפקיד בידיך את המשימה") are the one place where high register reads as *characterization* rather than translationese. My verdict: acceptable for that voice, but "הבה" and "ותו לא" go one step too far even there.

### Inferences
- The highest-value fix is a short blacklist of English stock-phrase calques ("as expected of", "if it isn't", "I see", "prepare to die", "taste the power", "can't thank enough", "make a decision", "treasure", "lend me your strength", "stay focused", "Right!"). Each one appeared in several independent Hebrew files, so these are systemic relay-translation errors, not one translator's quirks. (Mine.)
- The professional files feel natural mainly because they swap English idioms for *Hebrew* idioms of the same force: שיחקתי אותה, זרקו אותי מכל המדרגות, כיסחת, תכניסו להם, אין מצב בעולם. They do not mainly do it by being more literal or more formal. (Mine.)

### Gaps
- I found no Hebrew text subtitles for the One Piece anime, from either One Piece Nakama or Netflix, to compare like-for-like with our episodes.
- Sources were unclear for MHA and OPM. I infer professional or streaming origin from file signals only.

---

## Q4. Community debates and complaints about Hebrew fansub quality

### Takeaway
The quality debate in the Israeli scene centres on three things: experienced groups looking down on fast, sloppy groups; Hebrew errors (spelling, gender); and, since 2024, AI translation. Complaints about register itself are rarer. When they do appear, they point at literal translation from English, which is exactly our failure mode.

### Cited Findings
- **Paradise Subs on the state of the scene**:
  - "המצב בכי רע" (*the situation is dire*).
  - "The biggest failure I see in many translations is that they simply don't know Hebrew."
  - "I can count on one hand the groups that both take the work seriously and put out a quality product."
  - Lazy Sub is remembered mainly for "המון טעויות מביכות" (*lots of embarrassing errors*).
  - — [Paradise guide](https://paradisesubs.net/%d7%94%d7%9e%d7%93%d7%a8%d7%99%d7%9a-%d7%94%d7%9e%d7%9c%d7%90-%d7%9c%d7%a4%d7%90%d7%a0%d7%a1%d7%90%d7%91%d7%a8-%d7%94%d7%9e%d7%aa%d7%97%d7%99%d7%9c/)
- **Yair's guide**: literal translation is "one of the most common problems in new fansub sites, which pop up like mushrooms after rain", caused by "lack of experience". — [Yair guide](https://docs.google.com/document/d/1023mPe-6GPE8KDUMwgmz-YICAlZEIXtkEZrHCpjuHXg/edit?usp=sharing)
- **KaT's self-description**: critics call it "elitists… snobs", while KaT stresses "authenticity and accuracy". — [KaT "Sweet 16"](https://www.kateam.org/page/3?p=FAQ)
- **AI-translated groups on FXP, 2025**: a fan recommends against a Telegram group. "**התרגום שלהם לא סביר אלה [sic] גרוע( נותנים לAI לתרגם עבורם אנימה)**" (*their translation isn't passable, it's bad; they let AI translate*). — [FXP thread](https://www.fxp.co.il/showthread.php?t=21912400)
- **FXP 2024 thread "Are fansub groups already using AI?"**:
  - Users expect AI fansubs to be "fast but stinky".
  - One asks whether AI can tell masculine from feminine. Another replies, "I see official translations fail at this too".
  - — [FXP thread](https://www.fxp.co.il/showthread.php?t=21853437)
- **Old Fisheye film forum**: a self-described professional translator wrote "תרגום מילולי זה הדבר _הכי גרוע_" (*literal translation is the worst thing*). — [Fisheye](https://www.fisheye.co.il/%D7%9E%D7%A0%D7%99%D7%97-%D7%A8%D7%A2%D7%A4%D7%99%D7%9D-%D7%A0%D7%95%D7%A6%D7%A8%D7%99/)
- **FXP 2010 debate on Hebrew anime dubbing**: one fan complains the dub turns "IM GOING TO KICK YOUR ASS!!" into "אני אהרוג אותך!", i.e. flattened register. — [FXP dubbing thread](https://www.fxp.co.il/showthread.php?page=4&t=6648175)
- **Tapuz**: a fan who translated six Pokémon dub episodes was told some sentences were "strange" in Hebrew. He thinks it is because he "stuck too close to the English" and "thought only about sticking to the source and less about how good it sounds". — [Tapuz thread](https://www.tapuz.co.il/threads/%D7%9C%D7%9B%D7%9C-%D7%90%D7%95%D7%94%D7%91%D7%99-%D7%94%D7%93%D7%99%D7%91%D7%95%D7%91%D7%99%D7%9D-%D7%91%D7%90%D7%A9%D7%A8-%D7%94%D7%9D.11744526/)

### Inferences
- Israeli anime viewers associate AI subtitles with poor quality by default. Our addon will be judged against that prejudice, so translationese lines carry a reputational cost beyond the momentary "what did I just read?". (Mine.)
- The "flattened register" complaint ("I'll kill you" for "I'm going to kick your ass") is the mirror image of our problem. A good line keeps the *force* and *colour* of the original in Hebrew idiom, neither inflating it to literary register nor flattening it. (Mine.)

### Gaps
- No Reddit or Discord threads were reachable. I found no complaint written specifically about Hebrew One Piece fansub wording.

---

## Actionable rules for our translator

Ranked by expected impact on the "what did I just read?" moment. Format: pattern → why it reads unnatural → natural alternatives → example. The counts in brackets are my grep over the 61 `scripts/onepace-translations/*.he.json` files (read-only). They are rough: some regexes over-match.

1. **"As expected of X" → never "כצפוי מ / כמצופה מ / כפי שניתן לצפות מ / לא פחות ממה שאפשר לצפות מ"** [13 hits, e.g. TB_16 «כצפוי מנסיכת הרפאים!»; plus the coordinator's MA lines]
   - **Why**: this is the textbook anime calque. FMAB's fansub "כפי שניתן לצפות מאלכימאי המתכת" shows the same calque; no Israeli cheers like this.
   - **Natural, admiring**: «אין כמו X!», «לא סתם X», «ברור, זה X», «זה X בשבילך», «רואים ש…», «תמיד אפשר לסמוך על X».
   - **Natural, sarcastic**: «מה כבר אפשר לצפות מ…» (as in the OPM file).
   - **Examples**:
     - «כצפוי מכל כוחות הצי.» → «ברור, זה חיל הים / הצי.»
     - «לא פחות ממה שאפשר לצפות ממישהו שהפליג עם מלך הפיראטים!» → «רואים שהוא הפליג עם מלך הפיראטים!» / «לא סתם הוא הפליג עם מלך הפיראטים!»
     - «כמצופה מהבן שלך» → «הבן שלך, מה אתה רוצה.»
   - **Lint regex**: `כצפוי מ|כמצופה מ|כפי שניתן לצפות|ממה שאפשר לצפות`

2. **"I see" → "הבנתי / אה, ככה / אז ככה", not "אני רואה". Ration "אני מבין..."** [12 lines of «אני מבין...»]
   - **Why**: "אני רואה" for *I see* is the most recognisable bad-fansub marker (HxH, Naruto 149, AoT). A trailing "אני מבין..." is legal but anime-English rhythm.
   - **Example**: «אני מבין... לא ידעת, הא?» → «אה, אז לא ידעת.»
   - **Lint regex**: `^\W*אני רואה\W*$|^אני רואה[.,]`; flag `^אני מבין\.\.\.` for review.

3. **Drop English opener fillers: "Oh!" → "הו!", "Well" → "ובכן", "Now," → "עכשיו,"** [«הו» 139 hits; «ובכן» 51]
   - **Why**: Yair's guide: English opens with "well" where the Japanese has nothing, so "ובכן" is filler. "הו!" is not spoken Hebrew.
   - **Natural**: drop it; or use «אה», «או!», «וואו», «טוב», «נו», «אז…».
   - **Examples**: «הו! נראה שהאריה לקח תנומת חתול!» → «תראו, האריה נרדם!»; «ובכן, פשוט תסתכלו!» → «פשוט תסתכלו!»
   - **Lint regex**: `^(הו|ובכן)[ ,!]`

4. **"Well, if it isn't X" → "תראו מי פה / תראו מי הגיע", never "אם זה לא X" / "אם אין זה X"** [IM_3 «הו! אם זה לא מר 3!»]
   - **Why**: a word-for-word English idiom (AoT fansub "אם אין זה בנו של ד"ר ייגר"). Hebrew readers parse it as a real condition.
   - **Lint regex**: `^(\S+ )?אם (זה|אין זה) לא? `

5. **Stock battle lines get Hebrew idioms of the same force, not English skeletons**
   - **"Prepare yourself / Prepare to die"**: «תתכונן (למות)» → «אתה גמור», «הלך עליך», «עכשיו אתה בצרות», «בוא נראה אותך». «תתכונן לקראתי, עולם!» → «עולם, תתכונן — אני בא!»
   - **"I won't forgive you"**: «לא אסלח לך» → «אתה תשלם על זה!», «זה לא יעבור לך בשקט!». Keep "לא אסלח" only when forgiveness is the real topic. [6 hits]
   - **"Don't underestimate me"**: «אל תזלזל בי» is natural; «אל תמעיט בערכי» / «נהגת בקלות דעת» (FMAB) are not.
   - **"This is the end for you"**: «זה הסוף שלך» → «הלך עליך», «גמרנו איתך».
   - **"Leave it to me" / "I'm counting on you"**: «תשאירו את זה לי», «עלי» (house spelling), «סמוך עלי»; «סומך עליך».
   - **"It can't be!"**: «לא יכול להיות!», «אין מצב!». Avoid «לא ייתכן…» outside formal voices.
   - **"Get serious"**: «עכשיו אני מתחיל ברצינות», not «אני עומד להיות רציני».
   - **"Taste the power of X"**: «תראה מה X מסוגל לעשות!», not «קבל טעימה מכוח…».
   - **Lint regex**: `תתכונן למות|קבל טעימה|אמעיט|תמעיט בערכ|עומד להיות רציני`

6. **Gratitude and feelings: no "אסיר תודה", "אוקיר", "אנצור", "להביא תועלת"** [«אסיר תודה» 10 hits]
   - **Why**: these are written-register equivalents of *grateful*, *treasure*, *be useful*. Both the professional MHA file ("אנצור אותה") and the Demon Slayer fansub ("אוקיר") show the trap.
   - **Natural**: «תודה», «אני מודה לך», «אני חייב לך», «אני אשמור את זה כל החיים», «אני רוצה לעזור».
   - **Example**: «אני אפילו לא יכול לבטא כמה אני אסיר תודה לכם» → «אין לי מילים להודות לכם.»

7. **Archaic or written function words in dialogue → spoken equivalents (allowed only for formal voices and narration)** [«שכמוך/שכמותך» 44; «מוטב» 2; «איני/אינך» 2; «היכן» 1]
   - **Map**:
     - איני / אינך → אני לא / אתה לא
     - היכן → איפה
     - כעת → עכשיו
     - מוטב ש → כדאי ש / עדיף ש
     - הבה → בוא / קדימה
     - כה → כל כך
     - אכן (כך) → נכון / כן
     - ותו לא → וזהו
     - יחדיו → ביחד
     - לשער בנפשי → לדמיין
     - ציווה → אמר / פקד (only for a formal commander)
   - **Example**: «אבא ציווה לשמור על האח של אייס בחיים!» → «אבא אמר שהאח של אייס חייב להישאר בחיים!»
   - **"X שכמוך"**: a legit theatrical insult, but at 44 uses it has become a tic. Vary with «חתיכת X», «יא X», or a plain noun.
   - **Exception**: the Paradise guide explicitly wants high register for genuinely high-register characters (nobles, an old formal warrior). Keep it there, so the voice contrast survives.

8. **English collocations and idioms rendered word by word → the Hebrew collocation**
   - **Map**:
     - make a decision → לקבל החלטה, or just «טעיתי»
     - ring a bell → מזכיר משהו
     - fall in love → להתאהב
     - street urchin → פרחח / זאטוט (not קיפוד)
     - lend me your strength → תן לי מהכוח שלך
     - stay focused → תתרכז
     - "Right!" as a reply → «כן!» / «הבנתי!»
     - the atmosphere is… → האווירה…
     - no big deal → זה לא סיפור / לא ביג דיל
     - can't thank enough → חייב לו המון
   - **Coordinator's lines (my fixes)**:
     - «הבהלה הזאת ממש נוחה לנו.» → «הבלגן הזה משחק לטובתנו.» / «הבלגן הזה רק עוזר לנו.»
     - «גילוי רודף גילוי, וכולם מטלטלים.» → «גילוי אחרי גילוי — וכולם בהלם.»
     - «שליט הגיהנום כבר נושם בעורף.» → «…כבר נושף בעורף.» A fixed idiom must be quoted exactly.

9. **English grammar scaffolding (Yair's "light" level) — delete the words only English needs**
   - **Drop**: "some" («רוצה קצת תה?» → «רוצה תה?»); "האם" in casual questions; "בגלל ש" at the start of an answer (→ «כי»); passive "be + participle" («תהיי מקוללת» → «תקוללי»; «הולך להיות מוצא להורג» → «הולכים להוציא אותו להורג»); "Let me go" → «עזוב אותי!».
   - **Word order**: put the adverb where an Israeli would say it («בואי נחזור ביחד הביתה»).
   - **Test (Yair, Dana)**: say the line aloud. Would you say it to a friend?

10. **Typography and interjections from the fansub world that do read natural**
    - Use «הא?» for *eh?/huh?*, «אוי לא», «לעזאזל», «שיט» sparingly, and «וואו».
    - At most one «!» (or «?!»), and no stretched letters (Yair).
    - Avoid untranslated «אוקי», «צס», «האמפ», «קק».
    - Keep transliterated signature laughs (שורורורו, דרישישישי), as One Piece Nakama does.

11. **Detection workflow for the ~340 shipped episodes**
    - **Step 1**: run the regexes above as a lint pass, as a report and not an auto-fix, since several over-match (`הו`, `ובכן`, `שכמוך`, `תתכונן` for legitimate military orders).
    - **Step 2**: sort hits by episode.
    - **Step 3**: give the native reviewer the line with its English cue (`<ID>.cues.json`) side by side.
    - **Step 4**: add confirmed before→after pairs to the house "English tells" list (docs/translation-learnings.md §1.5), which already holds this genre of rule.
    - **Data note**: Israeli One Piece fans (One Piece Nakama polls) say «חיל הים» for the Marines; Netflix's live action says «המארינס». This is not a request to change the solved terminology. It is a data point if «כוחות הצי» ever reads too formal in a specific line.
