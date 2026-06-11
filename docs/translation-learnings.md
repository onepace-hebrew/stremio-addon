# Translation Learnings — One Pace Enies Lobby 04 ("You're Fired")

Comparison: human translation (That One Gerbil, ground truth) vs AI translation.
Alignment: 400 keys matched by (start, end, style); 320 dialogue-family events aligned, **255 differ** (65 identical). All 267 caption events + 2 title events aligned (6 distinct signs). The human version is always the correct reference.

---

## 1. Top systematic differences (human = correct)

### 1.1 Gender / number agreement with the on-screen scene — the biggest correctness gap (~15+ lines)
The AI guesses grammatical gender and number from the English text; the human matches the actual speaker and addressee in the scene.

| Time | AI (wrong) | Human (correct) | Why |
|---|---|---|---|
| 0:02:59 | אני אזרח ותיק | אני אזרחית ותיקה | Kokoro is a woman |
| 0:03:02 | ואני סתם ילד קטן | ואני קטינה | Chimney is a girl |
| 0:08:13 | אל תשכח למה באת לכאן | אל תשכח למה באתם לכאן | the whole crew came |
| 0:08:48 | קח את זה! | קחו את זה! | addressing many |
| 0:09:54 | סומכים עליכם, גלי-לה | סומכים עליך, גלי-לה | one addressee |
| 0:13:10 | את מבינה? | אתם מבינים? | Spandam addresses several listeners |
| 0:15:40 | היית אמור לתת להם | הייתם אמורים להניח להם | addressing the Government (plural) |
| 0:16:24 | אתה מפר את העסקה | אתם מפרים את ההסכם | plural |
| 0:14:51 | כמה אידיוטים חדרו | איזה אידיוט שפלש | only Luffy infiltrated — singular |
| 0:20:37 | אל תעשו לנו צרות / תתחילו ללכת | אל תעשה לנו צרות / תמשיך ללכת | one prisoner addressed |
| 0:06:42 | פספסת! | פספסתם! | many shooters |

**Also gendered insult/word choice:** «את תתנצלי, פחדנית!» → «תתנצלי את, טמבלית!».

### 1.2 Terminology and proper nouns (see glossary)
- **משרת → כפוף** ("underling"): «הוא אחד מהמשרתים של כובע הקש» → «הוא כפוף לכובע הקש»; «היי, אתה משרת» → «היי, אתה כפוף».
- **המארינס → הצי**; **מטה המארינס → מפקדת הצי** (Marines = the Navy, never a transliteration).
- **וואטר סבן → ווטר 7** (digit, short transliteration).
- **אניס לובי → אניאס לובי**.
- **שור מלך → קינג בול** (transliterate King Bull; plural קינג בולים).
- **קליפה → קאליפה**, **טום → תום**, **אוהארה → אוהרה**.
- **מטה האקלים → שרביט האקלים** (Clima-Tact).
- **פרס → מודעת מבוקש** (bounty): «כשיהיה לי פרס, הוא יהיה כפול מהשלך» → «כשאקבל מודעת מבוקש, היא תהיה פי שניים גדולה משלך».
- **מזון לתותחים → בשר תותחים** (cannon fodder), **הפסקת אש → חדל אש** (military register).
- **הנשק העתיק → הנשק הקדום**; blueprints: **התוכניות → התרשימים**.
- Honorific *-san* rendered as **אדון**: «צ'ופר» → «אדון צ'ופר», «אוסופ» → «אדון אוסופ».
- Rank letters stay **Latin**: «פיראט א'/ב'/ג'» → «פיראט A / B / C»; «בטח, ג'» → «ברור, C». CP9 stays Latin in both.

### 1.3 Attack names: AI left them in English — human translates to Hebrew
The AI kept attack lines untranslated; the human translates them, keeps the `{\fad(150,150)}` tag, and adds a leading U+202B:
- `Thunderbolt Tempo!` → `{\fad(150,150)}‫טמפו ברק!`
- `Gum-Gum... / Spear!` → `‫גומי-גומי... / ‫רומח!`
- `Half-Knot Air Drive!` → `‫צלילת חצי-קשר!`
- `Air Door.` → `‫דלת אוויר.`

### 1.4 Interjections
- Surprised "Huh?!": **האה?! → הא?!** (always).
- Pondering "Huh?/Hm?": **האה? → הממ?**
- "Man!/Jeez!": **איש! → בחיי!**; "Whoa": **ואו → בנאדם!**; "Oh": **אה → הו / או**.
- Strong curse allowed: «לעזאזל!» kept, but also «שיט!» for "Damn!".

### 1.5 Register and idiom — natural spoken Israeli Hebrew over literal calque
- «אתם השניים» → «שניכם»; «זה רע!» → «זה לא טוב!»; «איך?!» / «הם לא...!» → «אין מצב!»
- «הדבר הזה חזק רצח!» → «המתקפות שלו חזקות ממש!»; «בול בפוני!» → «בול פגיעה!»; «תאכלו עפר» → «תאכלו אבק».
- «לכי לעזאזל, נאמי!» → «מה נסגר איתך, נאמי?!»; «סגור.» → «בשמחה.»
- Metaphor localized: «הרוח החלה לנשוב לטובתי» → «כף המאזניים החלה לנטות לצד שלי»; «רוחות העולם כולו נושבות לטובתי» → «כף המאזניים של כל העולם נוטה לכיוון שלי».
- Inverted-literal English untangled: «עד כדי כך עמוק החטא של קיומך!» → «זה כמה הקיום שלך הוא חטא!»; «אתה מדבר גבוה בשביל מת!» → «אתה בהחלט תופס מעצמך יחסית לאיש מת!».
- "Guys": «הבחורים האלה» → «החבר'ה האלו / ההם».

### 1.6 House orthography (consistent, sometimes non-Academy — follow it anyway)
- **זאת → זו**; **האלה/כאלה → האלו/כאלו**; **הכול → הכל**; **יותר מדי → יותר מידי**; **די → דיי**.
- Nif'al infinitives without yod: **ליהנות → להנות**, **להילחם → להלחם**, **להיזהר → להזהר**.
- **עליי → עלי** (but ידיי keeps double yod).
- No niqqud anywhere; no Hebrew maqaf (U+05BE).

### 1.7 Sentence flow, line breaks, continuity
- Human merges two short consecutive events into one when they form one sentence (0:02:30 «יש שם בוודאות עוד!\N‫פוצצו אותה לפני שהם יצאו!» replaced two AI events).
- Cross-event sentence continuation marked with leading «...»: «הזמן לבדוק כמה חזק...» → «...הברק שלו!» (AI broke the sentence ungrammatically: «...את החדש והמשופר... / ברק!»).
- Line breaks rebalanced for even line lengths (max ~44 chars/line); `{\q2}` added at end of line or before `\N` on long lines — never at the start of the event (AI habit).
- **No italics**: AI used `{\i1}…{\i0}` 6 times for English-style stress; human uses 0 — emphasis is expressed through word order and word choice.

---

## 2. Rules for an AI translator (imperative)

1. **Check who speaks and who is addressed in every line; conjugate gender and number to the scene, not to the English.** When the plot implies singular (one infiltrator), use singular even if English is vague.
2. **Use the glossary terms exactly** (see §3 and glossary.json): כפוף, הצי, מפקדת הצי, ווטר 7, אניאס לובי, קינג בול, קאליפה, תום, אוהרה, שרביט האקלים, מודעת מבוקש, בשר תותחים, חדל אש, הנשק הקדום.
3. **Translate attack names into Hebrew** (טמפו ברק, גומי-גומי... רומח!, צלילת חצי-קשר, דלת אוויר); keep the `{\fad(150,150)}` tag and add ‫ (U+202B) right after the tag block.
4. **Render -san as אדון** before the name (אדון צ'ופר, אדון אוסופ).
5. **Keep Latin letters Latin**: rank letters A/B/C, CP9, crew names in credits. Never convert A/B/C to א'/ב'/ג'.
6. Write **הא?!** for surprised "Huh?!", **הממ?** for pondering, **בחיי!** for "Man!", **הו/או** for "Oh".
7. Prefer **natural spoken Israeli Hebrew** to literal translation; localize idioms (כף המאזניים, אין מצב, בול פגיעה, תאכלו אבק); restructure inverted English rhetoric into straightforward Hebrew.
8. Follow house spelling: **זו, האלו, הכל, יותר מידי, דיי, להנות/להלחם/להזהר, עלי**.
9. **Start every dialogue line and every post-`\N` line with U+202B (RLE).** No PDF terminator, no RLM/LRM.
10. End an interrupted word with a plain ASCII hyphen **-** (הפתע-), not an en dash. Reserve «– » (en dash + space) for simultaneous-speaker lines, on both lines.
11. Put the closing period **outside** quotes: «"אתם מפוטרים".»
12. Use **digits** for numbered places (ווטר 7) and thousands separators (10,000).
13. **Never use italics for emphasis**; convey stress with word order («תתנצלי את, טמבלית!»).
14. Place `{\q2}` at the end of the line or just before `\N` on long lines — not at the start.
15. For signs (Captions/Title): **keep every override tag byte-identical to the source; replace only the text**; add U+202B after each `\N`.
16. In the **Credits** style, write Hebrew role names in **reversed (visual) letter order** («עריכת וידאו» stored as «ואדיו תכירע»); leave Latin names untouched.
17. Merge consecutive short events into one when they form one sentence; mark cross-event sentence continuation with a leading «...» on the second event.
18. Keep subtitle lines balanced; max ~44 characters per rendered line.

---

## 3. Caption / sign translation table (complete, EN → human HE)

Plain text after stripping override tags. `\N` = ASS line break; ‹‫› = U+202B (RLE).

| Style | English | Hebrew (human) |
|---|---|---|
| Title | You're Fired | אתם מפוטרים |
| Captions | Main Island, Enies Lobby | אי ראשי, אניאס לובי |
| Captions | Main Island`\N`At the Island Gate | ‫אי ראשי`\N`‫השערים לאי |
| Captions | Tower of Justice`\N`Enies Lobby | ‫מגדל הצדק`\N`‫אניאס לובי |
| Captions | Courthouse | בית המשפט |
| Captions | Island Gate | שערי האי |

Notes:
- These 6 signs cover **all** 269 aligned Caption/Title events (signs are layered 2–3x and repeated per-cut: Courthouse ×134, Island Gate ×124, others ×2–3).
- "At the Island Gate" is freely rendered «השערים לאי» on the sign, while dialogue uses «שער האי» and the late-episode sign uses «שערי האי».
- In dialogue, "courthouse" as a room is «אולם המשפט» (0:22:45); the building sign is «בית המשפט».
- The human kept all positioning/color/animation tags (`\pos`, `\fad`, `\t`, `\blur`, layered border+fill events) byte-identical and replaced only the text.

### Credits (EN → logical HE; stored letter-reversed in the file)

| English | Logical Hebrew | As stored (visual order) |
|---|---|---|
| Video Editing | עריכת וידאו | ואדיו תכירע |
| Graphics | גרפיקה | הקיפרג |
| Karaoke | קראוקה | הקוארק |
| Quality Control | בקרת איכות | תוכיא תרקב |
| Soundtracking | עריכת סאונד | דנואס תכירע |
| Timing | תזמון | ןומזת |
| Subtitle Editing | עריכת כתוביות | תויבותכ תכירע |
| Translation | תרגום | םוגרת |

Latin contributor names stay as-is; the human appended «ReshaFlame» to the Translation names list, and adds a top-of-episode credit line: `{\an8}‫תרגום לעברית — That One Gerbil`.

---

## 4. Direction marks & formatting conventions

- **U+202B (RLE) only.** No PDF (U+202C), no RLM/LRM, no isolates.
  - Dialogue: leading ‫ on 319/320 human events (single exception «סוגקינג!» — an oversight); after every `\N` 88/88.
  - When the event begins with override tags, the ‫ comes immediately after the closing `}`: `{\fad(150,150)}‫טמפו ברק!`
  - Captions: ‫ after every `\N` is mandatory; a leading ‫ on the first line appears in the top layer but is inconsistent in glow layers (e.g. «שערי האי» 113× without, 11× with) — pure-Hebrew single-line signs work without it.
- **Dashes:** word interrupt = ASCII `-` glued to the word («אלים-»); simultaneous speakers = `– ` (U+2013 + space) at the start of both lines; mid-sentence pause = ` - ` with spaces.
- **`{\q2}`** appears 8× in human dialogue: 5× at end of event, 3× immediately before `\N`; never event-initial.
- **No italics, no niqqud, no maqaf** in the human file.
- Layered events (border layer + fill layers) duplicate the same text — translate all layers identically.
- Both files share timings; the human occasionally merges two adjacent events into one full-duration event when the sentence is one unit.
