# Marker definitions used by research_notes/Natural Hebrew anime subtitles/opus-phrasebook.md (OPUS register baseline).
# Usage (stdlib only): import this file; text = clean_he(line); for group, name, rx, triggers in compile_markers(INF_ALT): count += len(rx.findall(text))
# where INF_ALT = "|".join(tokens of opus-inf-lexicon.txt sorted by length desc). Pass None to skip the two INF-dependent markers.
# The triggers set is only a speed prefilter (skip the regex unless one of those tokens is in the line); counts are identical without it.

# Register markers: exact regex definitions (applied to Hebrew with nikud removed,
# geresh/gershayim normalized to ' and ").  B/E = not preceded/followed by a Hebrew letter.
import re
HL = 'א-ת'
B = f'(?<![{HL}])'
E = f'(?![{HL}])'

def W(words, pre=''):
    """whole word(s) with optional one-letter prefix from `pre`"""
    alt = '|'.join(sorted(words, key=len, reverse=True))
    p = f'[{pre}]?' if pre else ''
    trig = set(words) | {x + w for x in pre for w in words}
    return (B + p + '(?:' + alt + ')' + E, trig)

def T(rx, firsts, pre=''):
    """custom regex + trigger tokens (first word, with optional prefixes)"""
    return (rx, set(firsts) | {x + w for x in pre for w in firsts})

INF_PLACEHOLDER = '__INF__'

# (group, name, regex-string)
MARKERS = [
 # negative copula
 ('neg_copula', 'אינני/אינך/אינו/...', W('אינני איני אינך אינו אינה איננו איננה אינכם אינכן אינן אינם'.split(), 'וש')),
 # copula / presentative
 ('copula', 'הנני/הנך/הינו/...', W('הנני הנך הנכם הינו הינה הינם הינן הריני הרינו'.split(), 'וש')),
 # question words
 ('qword', 'כיצד', W(['כיצד'], 'ו')),
 ('qword', 'מדוע', W(['מדוע'], 'ו')),
 ('qword', 'היכן', W(['היכן', 'מהיכן'], 'ו')),
 ('qword', 'מאין', W(['מאין'], 'ו')),
 ('qword', 'האם', W(['האם'], 'ו')),
 # conjunctions
 ('conj', 'אשר', W(['אשר'], 'וב')),
 ('conj', 'כאשר', W(['כאשר'], 'ו')),
 ('conj', 'אולם', W(['אולם'], 'ו')),
 ('conj', 'אך', W(['אך'], 'ו')),
 ('conj', 'על כן', T(B + 'ו?על כן' + E, ['על'],'ו')),
 ('conj', 'לפיכך', W(['לפיכך'], 'ו')),
 ('conj', 'משום ש', T(B + 'ו?משום ש' + f'[{HL}]', ['משום'],'ו')),
 ('conj', 'מאחר ש/ו', T(B + 'ו?מאחר (?:ש|ו)' + f'[{HL}]', ['מאחר'],'ו')),
 ('conj', 'היות ש/ו', T(B + 'ו?היות (?:ש|ו)' + f'[{HL}]', ['היות'],'ו')),
 ('conj', 'מכיוון ש/ו', T(B + 'ו?מכיו?ון (?:ש|ו)' + f'[{HL}]', ['מכיוון','מכיון'],'ו')),
 ('conj', 'אף (=even)', T(B + 'ו?אף' + E + '(?! (?:אחד|אחת|פעם|מקום)' + E + ')', ['אף'],'ו')),
 ('conj', 'אפוא', W(['אפוא'], 'ו')),
 ('conj', 'שמא', W(['שמא'], 'ו')),
 ('conj', 'פן', W(['פן'], 'ו')),
 ('conj', 'בטרם', W(['בטרם'], 'ו')),
 ('conj', 'טרם', W(['טרם'], 'ו')),
 ('conj', 'ובכן', W(['ובכן'])),
 ('conj', 'הלא', W(['הלא'], 'ו')),
 ('conj', 'בל', W(['בל'], 'ו')),
 ('conj', 'לבל', W(['לבל'])),
 ('conj', 'כדלקמן', W(['כדלקמן'])),
 ('conj', 'הואיל', W(['הואיל'], 'ו')),
 # adverbs
 ('adv', 'כעת', W(['כעת'], 'ו')),
 ('adv', 'עתה', W(['עתה', 'מעתה'], 'ו')),
 ('adv', 'אכן', W(['אכן'], 'ו')),
 ('adv', 'כה', W(['כה'], 'ו')),
 ('adv', 'מעט', W(['מעט'], 'והבל')),
 ('adv', 'ביותר', W(['ביותר'], 'ו')),
 ('adv', 'לעולם לא', T(B + 'ו?לעולם לא' + E, ['לעולם'],'ו')),
 ('adv', 'דבר מה', T(B + 'ו?דבר מה' + E, ['דבר'],'ו')),
 # prepositions
 ('prep', 'ללא', W(['ללא'], 'ו')),
 ('prep', 'לאחר', W(['לאחר'], 'וש')),
 ('prep', 'בעת', W(['בעת'], 'ו')),
 ('prep', 'עבור/בעבור', W(['עבור', 'בעבור'], 'ו')),
 ('prep', 'אודות', W(['אודות'], 'ו')),
 ('prep', 'למען', W(['למען'], 'ו')),
 ('prep', 'באמצעות', W(['באמצעות'], 'ו')),
 ('prep', 'על ידי', T(B + 'ו?(?:על ידי|ע"י)' + E, ['על','ע'],'ו')),
 ('prep', 'כלפי', W(['כלפי'], 'ו')),
 # modality
 ('modal', 'ביכולתי/באפשרותי/ברצוני...', T(B + 'ו?(?:ביכולת|באפשרות|ברצונ)(?:י|ך|ו|ה|נו|כם|כן|ם|ן)' + E, [a+b for a in ['ביכולת','באפשרות','ברצונ'] for b in ['י','ך','ו','ה','נו','כם','כן','ם','ן']],'ו')),
 ('modal', 'ייתכן', W(['ייתכן', 'יתכן'], 'ו')),
 ('modal', 'יש ל+inf', T(B + 'ו?יש ' + INF_PLACEHOLDER, ['יש'],'ו')),
 ('modal', 'עליך/עלינו/עליכם ל+inf', T(B + 'ו?(?:עליך|עלייך|עלינו|עליכם|עליכן) ' + INF_PLACEHOLDER, ['עליך','עלייך','עלינו','עליכם','עליכן'],'ו')),
 ('modal', '(ext) עליו/עליה/עלי/עליי/עליהם ל+inf', T(B + 'ו?(?:עליו|עליה|עלי|עליי|עליהם|עליהן) ' + INF_PLACEHOLDER, ['עליו','עליה','עלי','עליי','עליהם','עליהן'],'ו')),
 # exhortative / imperative
 ('exhort', 'הבה', W(['הבה'], 'ו')),
 ('exhort', 'אנא', W(['אנא'], 'ו')),
 ('exhort', 'נא', W(['נא'], 'ו')),
 ('exhort', 'התכונן/התכוננו', W(['התכונן', 'התכונני', 'התכוננו'], 'ו')),
 ('exhort', 'היזהר', W(['היזהר', 'הזהר', 'היזהרי', 'הזהרי', 'היזהרו', 'הזהרו'], 'ו')),
 ('exhort', 'הישמר', W(['הישמר', 'הישמרי', 'הישמרו'], 'ו')),
 ('exhort', 'הבט', W(['הבט', 'הביטו', 'הביטי'], 'ו')),
 ('exhort', 'חדל', W(['חדל', 'חדלו', 'חדלי'], 'ו')),
]
POSS_WORDS = '''חבריי אנשיי ספינתי ליבי לבי ידיי כוחי גופי נשמתי חלומי אחיי ביתי
         חבריך חברייך אנשיך ספינתך אביך אמך ליבך לבך ראשך ידיך ידייך עיניך עינייך כוחך גופך נשמתך חלומך ביתך שמך
         חבריו אנשיו ספינתו אביו אמו ליבו לבו ראשו ידיו עיניו כוחו גופו נשמתו חייו חלומו ביתו
         חברינו אנשינו ספינתנו חיינו ביתנו כוחנו אבי אמי עיניי חייך'''.split()
POSS_TRIG = set(POSS_WORDS) | {p + w for p in 'ובלמש' for w in POSS_WORDS}
MARKERS += [
 # possessive-suffixed nouns (curated; homographs excluded: אחי בני חברי חיי ראשי שמי שמו; idioms בעיניי בחייך בחיי excluded)
 ('poss', 'possessive nouns (curated)', (B + '(?:' + '|'.join([
     '[ובלמש]?(?:' + '|'.join(sorted('''חבריי אנשיי ספינתי ליבי לבי ידיי כוחי גופי נשמתי חלומי אחיי ביתי
         חבריך חברייך אנשיך ספינתך אביך אמך ליבך לבך ראשך ידיך ידייך עיניך עינייך כוחך גופך נשמתך חלומך ביתך שמך
         חבריו אנשיו ספינתו אביו אמו ליבו לבו ראשו ידיו עיניו כוחו גופו נשמתו חייו חלומו ביתו
         חברינו אנשינו ספינתנו חיינו ביתנו כוחנו'''.split(), key=len, reverse=True)) + ')',
     '[ובלש]?(?:אבי|אמי)',      # no מ (מאמי = sweetie)
     '[ולמש]?עיניי',             # no ב (בעיניי = in my opinion)
     '[ולמש]?חייך',              # no ב (בחייך = come on); bare חייך also = "smiled" (noted)
 ]) + ')' + E, POSS_TRIG)),
 # object-suffixed verbs / infinitives (curated)
 ('objsuf', 'object-suffixed verbs (curated)', W('''להורגו להרגו להורגה להרגה להורגם להרגם להורגך להרגך להצילו להצילה להצילם להצילך לעצרו לעוצרו לעצרם
     לתופסו לתפסו לתופסם להביסו להביסם לנצחו לנצחם להשמידו להשמידם לראותו לראותה לשחררו לשחררם להחזירו להחזירה
     ראיתיו ראיתיה ראיתים הכרתיו הכרתיה אהרגך אהרוגך אהרגכם הרגוהו הרגתיו הרגתיה תפסוהו עצרוהו הצילוהו הצילני
     מצאתיו מצאתיה מצאנוהו אהבתיה אהבתיו'''.split(), 'וש')),
 # passive execution calque
 ('exec', 'מוצא/הוצא/יוצא להורג', T(B + '[וש]?(?:מוצא|מוצאת|מוצאים|מוצאות|הוצא|הוצאו|יוצא|יוצאו|יוצאת|תוצא|תוצאו|אוצא|נוצא) להורג' + E, ['להורג'])),
 # subtitle-isms
 ('subism', 'ארור/ה/ים/ות', W(['ארור', 'ארורה', 'ארורים', 'ארורות'], 'וה')),
 ('subism', 'מה לעזאזל', T(B + 'ו?מה לעזאזל' + E, ['לעזאזל'])),
 ('subism', 'אלוהים אדירים', T(B + '(?:אלוהים|אלוקים|אלהים) אדירים' + E, ['אדירים'])),
 ('subism', 'לכל הרוחות', T(B + 'ו?לכל הרוחות' + E, ['הרוחות'])),
 ('subism', 'בשם אלוהים', T(B + 'ו?בשם (?:אלוהים|אלוקים|אלהים)' + E, ['בשם'],'ו')),
 ('subism', 'אסיר תודה', T(B + 'אסיר(?:ת|י|ות)? תודה' + E, ['אסיר','אסירת','אסירי','אסירות'])),
 ('subism', 'תודה לך', T(B + 'ו?תודה לך' + E, ['לך'])),
 ('subism', '(ext) תודה לכם', T(B + 'ו?תודה לכם' + E, ['לכם'])),
 ('subism', 'אני מצטער/ת', T(B + 'ו?אני מצטער(?:ת)?' + E, ['מצטער','מצטערת'])),
 ('subism', 'כצפוי מ', T(B + 'ו?כצפוי מ' + f'[{HL}]', ['כצפוי'],'ו')),
 ('subism', 'לא אסלח לך/לכם', T(B + 'לא אסלח (?:לך|לכם)' + E, ['אסלח'])),
 # controls
 ('control', 'אני מניח/ה', T(B + 'ו?אני מניח(?:ה)?' + E, ['מניח','מניחה'])),
 ('control', 'אחרי הכל', T(B + 'ו?אחרי הכו?ל' + E, ['הכל','הכול'])),
 ('control', 'זה הכל', T(B + 'ו?זה הכו?ל' + E, ['הכל','הכול'])),
 ('control', 'הולך להיות', T(B + '[וש]?(?:הולך|הולכת|הולכים|הולכות) להיות' + E, ['להיות'])),
 # colloquial counterparts (refinement: lets you compute formal/colloquial ratios)
 ('colloq', 'למה', W(['למה'], 'ו')),
 ('colloq', 'איפה', W(['איפה', 'מאיפה'], 'ו')),
 ('colloq', 'איך', W(['איך'], 'וש')),
 ('colloq', 'עכשיו', W(['עכשיו', 'מעכשיו'], 'וש')),
 ('colloq', 'בלי', W(['בלי'], 'וש')),
 ('colloq', 'אחרי', W(['אחרי'], 'וש')),
 ('colloq', 'הכי', W(['הכי'], 'וש')),
 ('colloq', 'קצת', W(['קצת'], 'וש')),
 ('colloq', 'אבל', W(['אבל'], 'ו')),
 ('colloq', 'בגלל ש', T(B + 'ו?בגלל ש' + f'[{HL}]', ['בגלל'],'ו')),
 ('colloq', 'בשביל', W(['בשביל'], 'וש')),
 ('colloq', 'אף פעם', T(B + 'ו?אף פעם' + E, ['פעם'])),
 ('colloq', 'משהו', W(['משהו'], 'ול')),
 ('colloq', 'תיזהר', W(['תיזהר', 'תזהר', 'תיזהרי', 'תיזהרו', 'תזהרו'], 'ו')),
 ('colloq', 'תתכונן', W(['תתכונן', 'תתכונני', 'תתכוננו'], 'ו')),
 ('colloq', 'בבקשה', W(['בבקשה'], 'ו')),
 ('colloq', 'X שלי/שלך/שלו (analytic possessive)', T(B + 'של(?:י|ך|ו|ה|נו|כם|כן|הם|הן)' + E, ['שלי','שלך','שלו','שלה','שלנו','שלכם','שלכן','שלהם','שלהן'])),
 ('colloq', 'אני לא (neg)', T(B + 'ו?אני לא' + E, ['אני'],'ו')),
 ('colloq', 'הוא לא/היא לא', T(B + 'ו?(?:הוא|היא) לא' + E, ['הוא','היא'],'ו')),
 ('colloq', 'תודה', W(['תודה'], 'ו')),
 ('colloq', 'סליחה', W(['סליחה'], 'ו')),
 ('colloq', 'לעזאזל (all)', W(['לעזאזל'])),
 ('colloq', 'מזל', W(['מזל'], 'ובלה')),
]

NIKUD = re.compile('[֑-ֽֿ-ׇ]')
def clean_he(s):
    s = NIKUD.sub('', s).replace('־', '-').replace('״', '"').replace('׳', "'")
    s = s.replace('”', '"').replace('“', '"').replace('’', "'").replace('‏', '').replace('‎', '').replace('‫', '').replace('‬', '')
    return s

TOK = re.compile(f'[{HL}]+')

def compile_markers(inf_alt):
    out = []
    for g, n, (rx, trig) in MARKERS:
        if INF_PLACEHOLDER in rx:
            if inf_alt is None: continue
            rx = rx.replace(INF_PLACEHOLDER, '(?:' + inf_alt + ')' + E)
        out.append((g, n, re.compile(rx), trig))
    return out
    return out
