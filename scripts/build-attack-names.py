#!/usr/bin/env python3
"""Build docs/attack-names.json from the attack-name research files (research_notes/attack-names/) into one lookup (docs/attack-names.json).

Backbone = inventory.json (every attack called in our subs). Each human
source is attached by English name, then by romaji. The Hebrew to use is
picked by PRECEDENCE (owner rulings first); when strong sources disagree the
row is marked "conflict" so the pick can be reviewed.

Usage: python3 scripts/build-attack-names.py [research dir] [out.json]
"""
import json, re, sys, unicodedata, collections, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'research_notes', 'attack-names')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'docs', 'attack-names.json')
HEB = '[א-ת]'

# Owner rulings 2026-11-07. Gum-Gum entries give the noun only; the prefix is added below.
# Stamp follows the fan manga (רמיסת שחר = Dawn Stamp) since the owner put the fan manga first.
OWNER = {
    'gum-gum stamp': 'רמיסה', 'gum-gum jet stamp': 'רמיסת סילון', 'gum-gum stamp gatling': 'גאטלינג רמיסות',
    'gum-gum hawk stamp': 'רמיסת הנץ', 'gum-gum heavy stamp': 'רמיסה כבדה', 'gum-gum gigant stamp': 'רמיסת גיגנט',
    'gum-gum champion stamp': 'רמיסת אלוף', 'gum-gum gatling': 'גאטלינג', 'shave': 'גילוח',
}
# Owner ruling 2026-11-07: fan manga (onepiece-nakama) wins, then One Pace's human Hebrew, Netflix, Wikipedia.
PRECEDENCE = ['owner', 'nakama-manga', 'onepace-human', 'netflix', 'he-wikipedia', 'onepace', 'nakama-site', 'web']
STRONG = PRECEDENCE[1:6]  # translations + encyclopedia; nakama-site/web = forum talk and reader comments
GUM_PREFIX = 'גומו גומו נו'  # the fan manga's prefix: «גומו גומו נו... אקדח»
GUM_RE = re.compile(r'^\s*(גומו גומו נו|גומי[\s\-־]?גומי|גאם[\s\-]?גאם|גום[\s\-]?גום)\s*(\.\.\.|…)?\s*|\s*גומי[\s\-־]גומי\s*$')
# Owner ruling 2026-11-07: "Japanese (Hebrew)" display, as Hebrew Wikipedia writes it, for the Six Powers + Haki only.
PAREN = {'shave': 'סורו', 'moon walk': 'גפו', 'finger pistol': 'שיגאן', 'iron body': 'טקאי', 'tempest kick': 'ראנקאקיו',
         'storm leg': 'ראנקאקיו', 'paper art': 'קאמיאי', 'six king gun': 'רוקו גאן', 'six powers': 'רוקושיקי',
         "conqueror's haki": 'האושוקו האקי', 'armament haki': 'בוסושוקו האקי', 'observation haki': 'קנבושוקו האקי'}

def tier(e):
    s = e.get('source', '')
    if s == 'upstream-onepace':
        return 'onepace-human' if e.get('human') is True else 'onepace'
    if s.startswith('netflix'): return 'netflix'
    if s == 'he-wikipedia': return 'he-wikipedia'
    if s == 'nakama-manga': return 'nakama-manga'
    if 'nakama' in s: return 'nakama-site'
    return 'web'

def nk(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'\(.*?\)', ' ', s)
    s = re.sub(r'\b(gomu gomu no|gum gum|rubber rubber|gomu gomu)\b', 'gum-gum', s)
    s = re.sub(r'\bgatling gun\b', 'gatling', s)
    s = re.sub(r"[^a-z0-9\-' ]", ' ', s)
    return re.sub(r'\s+', ' ', s).strip(' -')

def jk(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]', '', s)

def hk(s):  # compare renderings ignoring punctuation, dash vs space, and the Gum-Gum prefix
    s = GUM_RE.sub('', re.sub(r'[֑-ׇ*]', '', s or ''))
    return re.sub(r'[\s\-־\.…!?,:"״\'׳]+', ' ', s).strip()

def core(e):  # "טקאי (גוף ברזל)" -> "גוף ברזל"; strip footnote stars and end punctuation
    he = e['he']
    m = re.search(r'\(([^)]*' + HEB + r'[^)]*)\)', he)
    if e.get('form') == 'japanese+hebrew-paren' and m: he = m.group(1)
    he = re.sub(r'\s*\([^)\u05d0-\u05ea]*\)', '', he)  # drop an all-Latin gloss: «גיר שני (Gear Second)»
    he = re.sub(r'[\u0591-\u05bd\u05bf-\u05c7]', '', he.replace('\u05be', '-'))  # niqqud out, maqaf -> '-'
    he = re.sub(r'\s*(\.\.\.|…)\s*', ' ', he)  # a split speech bubble («אקדח... פיל») is one name
    return re.sub(r'[*!?]+|:\s*$', '', he).strip()

inv = json.load(open(os.path.join(D, 'inventory.json')))
by_en, by_ja = {}, {}
for a in inv:
    for v in [a['en']] + a.get('en_variants', []):
        by_en.setdefault(nk(v), a)
    if a.get('ja'): by_ja.setdefault(jk(a['ja']), a)

src = collections.defaultdict(lambda: collections.defaultdict(list))  # en -> tier -> [entries]
orphans = {}
for f in ['upstream.json', 'netflix.json', 'hebrew-web.json', 'nakama.json', 'other.json']:
    for e in json.load(open(os.path.join(D, f))):
        if e.get('human') is False or not e.get('he'): continue
        a = by_en.get(nk(e['en'])) or (by_ja.get(jk(e.get('ja'))) if e.get('ja') else None)
        key = a['en'] if a else nk(e['en'])
        if not a: orphans.setdefault(key, {'en': e['en'], 'ja': e.get('ja', ''), 'user': e.get('user', '')})
        src[key][tier(e)].append(e)

def pick(s, tiers):
    for t in tiers:
        ok = [x for x in s.get(t, []) if x.get('confidence') != 'low']  # low-confidence entries never decide a name
        if ok:
            return t, collections.Counter(core(x) for x in ok).most_common(1)[0][0]
    return None, None

def house(our):
    heb = {k: v for k, v in our.items() if re.search(HEB, k) and not re.search('[A-Za-z]', k)}  # half-English = a bug, not a name
    return core({'he': max(heb, key=heb.get)}) if heb else None

rows = []
def row(en, ja, user, calls, our, human):
    s = src.get(en, {})
    k = nk(en)
    sources = {t: sorted({x['he'] for x in s[t]}) for t in PRECEDENCE[1:] if s.get(t)}
    refs = {t: [x.get('ref', '') for x in s[t]][:3] for t in sources}
    distinct = {hk(core(x)) for t in STRONG[:4] for x in s.get(t, [])}
    if k in OWNER:
        he, basis, status = OWNER[k], 'owner', 'owner'
    else:
        basis, he = pick(s, STRONG)
        if he:
            status = 'conflict' if len(distinct) > 1 else 'agreed'
        else:
            he, basis = house(our), 'house'
            status = 'house' if he else 'untranslated'
            if he and len({hk(x) for x in our if re.search(HEB, x)}) > 1: status = 'house-inconsistent'
            if not he:  # nothing of ours in Hebrew: fall back to fan/forum usage, flagged weak
                basis, he = pick(s, ['nakama-site', 'web'])
                status = 'weak' if he else 'untranslated'
    if he and k.startswith('gum-gum') and 'fruit' not in k:  # one prefix for every Gum-Gum move
        noun = GUM_RE.sub('', he).strip(' .…')
        he = f'{GUM_PREFIX}... {noun}' if noun else GUM_PREFIX
    if he and k in PAREN:
        he = f'{PAREN[k]} ({he})'
    rows.append({'en': en, 'ja': ja, 'user': user, 'calls': calls, 'he': he, 'basis': basis, 'status': status,
                 'sources': sources, 'refs': refs, 'ours': our, 'human_file_he': human})

for a in inv:
    row(a['en'], a.get('ja', ''), a.get('user', ''), a['occurrences'], a.get('our_he', {}), a.get('human_he', {}))
for key, o in orphans.items():
    row(key, o['ja'], o['user'], 0, {}, {})
    rows[-1]['en'] = o['en']

# Agent proposals (research_notes/attack-names/proposals-*.json) for rows no human source settles.
for f in ['proposals-inconsistent.json', 'proposals-untranslated.json']:
    path = os.path.join(D, f)
    props = {x['en']: x for x in json.load(open(path))} if os.path.exists(path) else {}
    for r in rows:
        x = props.get(r['en'])
        if not x or r['status'] not in ('house-inconsistent', 'untranslated'): continue
        r['origin'] = r['status']
        if x.get('verdict', 'ok') != 'ok':
            r['he'], r['status'] = None, x['verdict']  # "split" / "not-an-attack": handled by hand
        else:
            r['he'], r['status'], r['basis'] = x['he'], 'proposed', 'agent'

# Owner rulings 2026-11-07, applied to every row (sources and proposals alike).
# Sanji's French cuts are translated, as the fan manga does.
FR = {'Collier': 'צוואר', 'Épaule': 'כתף', 'Poitrine': 'חזה', 'Côtelette': 'צלעות', 'Selle': 'אוכף', 'Gigot': 'ירך',
      'Mouton': 'כבש', 'Tendron': 'שפונדרה', 'Quasi': 'שייטל', 'Queue': 'זנב', 'Cuisseau': 'ירך עגל', 'Jarret': 'שוק',
      'Flanchet': 'בטן', 'Longe': 'סינטה', 'Basse Côte': 'צלי כתף', 'Bouche': 'פה', 'Nez': 'אף', 'Oeil': 'עין',
      'Joue': 'לחי', 'Dents': 'שיניים', 'Menton': 'סנטר', 'Veau': 'עגל', 'Concassé': 'ריסוק', 'Crosse': 'שוק',
      'Extra Haché': 'קיצוץ אקסטרה', 'Première Haché': 'קיצוץ ראשון', 'Deuxième Haché': 'קיצוץ שני',
      'Troisième Haché': 'קיצוץ שלישי', 'Frit Assorti': 'מטוגנים מעורבים', 'Frites Assorties': 'מטוגנים מעורבים',
      'Collier Frit': 'צוואר מטוגן', 'Collier Frite': 'צוואר מטוגן', 'Épluchage': 'קילוף', 'Éscalope': 'שניצל',
      'Bouquetière': 'זר ירקות', 'Brochette': 'שיפוד', 'Parage': 'גימור', 'Flambage': 'חריכה',
      'Diable Jambe': 'רגל השטן', 'Diable Jambe: Devil Leg': 'רגל השטן', 'Crosse Strike': 'מכת שוק',
      'Anti-Manner Kick Course': 'מנת בעיטות לחסרי נימוס', 'Armée de l\'Air Power Shoot': 'חיל האוויר: בעיטת עוצמה',
      'Armée de l\'Air Gum Shoot': 'חיל האוויר: בעיטת גומי'}
def fr(t):
    t = t.strip()
    if t in FR: return FR[t]
    m = re.fullmatch(r'(.+?) Sho(?:o)?t', t)
    if m and m.group(1) in FR: return 'בעיטת ' + FR[m.group(1)]
    m = re.fullmatch(r'Diable Jambe: (.+)', t)
    if m and fr(m.group(1)): return 'רגל השטן: ' + fr(m.group(1))
    m = re.fullmatch(r'Party Table: (.+)', t)
    if m and fr(m.group(1)): return 'מנת בעיטות לקבוצות: ' + fr(m.group(1))
    if '!' in t:  # a barrage: "Tendron! Quasi! Collier!"
        parts = [fr(x) for x in t.split('!') if x.strip()]
        if all(parts): return '! '.join(parts)
    return None
# Robin's Fleur moves: digits + פרחים, as Netflix writes Doce Fleur.
NUM = {'Uno': 1, 'Dos': 2, 'Tres': 3, 'Cuatro': 4, 'Cinco': 5, 'Seis': 6, 'Siete': 7, 'Ocho': 8, 'Nueve': 9, 'Neuve': 9,
       'Diez': 10, 'Once': 11, 'Doce': 12, 'Dieciséis': 16, 'Veinte': 20, 'Treinta': 30, 'Cuarenta': 40, 'Ochenta': 80,
       'Cien': 100, 'Mil': 1000}
FLEUR_REST = {'Big Tree': 'עץ ענק', 'Delphinium': 'דלפיניום', 'Flip': 'היפוך', 'Wing': 'כנף', 'Gigantesco Mano': 'יד ענקית',
              'Gigantesco Mano Spank': 'סטירת יד ענקית', 'Slap': 'סטירה', 'Clutch': 'לפיתה', 'Cuatro Manos': 'ארבע ידיים'}
FLEUR_OTHER = {'Gigante Fleur': 'פרח ענק', 'Pierna Fleur': 'פריחת רגליים'}
def fleur(en):
    if en in FLEUR_OTHER: return FLEUR_OTHER[en]
    m = re.fullmatch(r'(\w+) Fleurs?(?::? (.+))?', en)
    if not m or m.group(1) not in NUM: return None
    rest = m.group(2)
    if rest and rest not in FLEUR_REST: return None
    return f'{NUM[m.group(1)]} פרחים' + (f': {FLEUR_REST[rest]}' if rest else '')
# Dials keep the item names the dialogue uses.
DIALS = {'Impact': 'אימפקט', 'Reject': "ריג'קט"}
# Usopp's "Lethal ..." = the fan manga's «מתקפה מיוחדת: ...».
LETHAL_FIX = {'Lethal Fire Star': 'כוכב אש', 'Lethal Smoke Star': 'כוכב עשן', 'Lethal Lion Song': 'שיר האריה'}
def lethal(en, he):
    if en in LETHAL_FIX: return 'מתקפה מיוחדת: ' + LETHAL_FIX[en]
    if not he: return None
    base = re.sub(r'^מתקפה מיוחדת:\s*', '', he)
    base = re.sub(r'\s*\bקטלנית?\b\s*', ' ', base).replace('-', ' ')
    return 'מתקפה מיוחדת: ' + re.sub(r'\s+', ' ', base).strip(' :')
for r in rows:
    if r['status'] in ('split', 'not-an-attack'): continue
    en, new = r['en'], None
    if en in DIALS: new = DIALS[en]
    elif 'Fleur' in en: new = fleur(en)
    elif en.startswith('Lethal '): new = lethal(en, r['he'])
    elif 'Sanji' in (r['user'] or '') or fr(en): new = fr(en)
    if new and new != r['he']:
        r.setdefault('origin', r['status'])
        r['he'], r['status'], r['basis'] = new, 'policy', 'owner-rule'

# Final picks 2026-11-07: the owner delegated the choice; Fable 5.1 reviewed 381 rows for natural Hebrew.
path = os.path.join(D, 'decisions.json')
for r in rows:
    x = (json.load(open(path)) if os.path.exists(path) else {}).get(r['en']) if r['calls'] else None
    if x:
        r.setdefault('origin', r['status'])
        r['he'], r['status'], r['basis'] = x['he'], 'chosen', x['by']
# Whole-vocabulary fixes from that review: חרב is feminine; «השד» also reads "the breast"; one spelling of Coup de.
FIXES = [(r'\b(שלושת|ששת|תשעת)[\s-]החרבות\b', lambda m: {'שלושת': 'שלוש', 'ששת': 'שש', 'תשעת': 'תשע'}[m.group(1)] + ' החרבות'),
         (r'חיתוך השד', 'אוני גירי'), (r'\bקופ דה\b', 'קו דה'), (r'\bימין חזקה\b', 'ימנית חזקה')]
for r in rows:
    if not r['he']: continue
    he = r['he']
    for pat, rep in FIXES:
        if pat == 'חיתוך השד' and 'Oni Giri' not in r['en']: continue
        he = re.sub(pat, rep, he)
    if he != r['he']:
        r.setdefault('origin', r['status']); r['he'] = he

rows.sort(key=lambda r: (-r['calls'], r['en']))
out = {
    'about': 'Attack/technique names for the Hebrew One Pace subs. he = the Hebrew to use. Gum-Gum moves use the fan-manga '
             f'prefix "{GUM_PREFIX}..." + noun; the Six Powers and Haki use "Japanese (Hebrew)". status: owner (owner ruling), '
             'agreed (strong human sources agree), conflict (they disagree; he follows precedence), house / house-inconsistent '
             '(no human source; our most common rendering), weak (only forum or reader-comment usage), untranslated (no Hebrew '
             'anywhere yet), proposed (agent proposal, owner to review), policy (owner style rule), split / not-an-attack (needs a hand fix), chosen (final pick after a Fable 5.1 naturalness review; the owner delegated it). calls = times called in our subs (0 = only in outside sources). Rebuild: '
             'python3 scripts/build-attack-names.py. Research 2026-11-07.',
    'precedence': PRECEDENCE,
    'attacks': rows,
}
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
st = collections.Counter(r['status'] for r in rows)
print('rows', len(rows), 'in-subs', sum(1 for r in rows if r['calls']), 'source-only', sum(1 for r in rows if not r['calls']))
print('status', dict(st))
print('calls by status', {k: sum(r['calls'] for r in rows if r['status'] == k) for k in st})
print('wrote', OUT)
