# -*- coding: utf-8 -*-
"""
Generate the 7 `main_*` tense sentences the viewer actually reads.

The live prompt list in index.html maps every grammar point to one of:
    main_simple_present  main_present_continuous  main_simple_past
    main_past_continuous main_present_perfect     main_future_going_to
    main_future_will

Input is the same 4-tuple the box pipeline uses: (subject, bare verb, rest, plural).
Each tense gets its own rotating time marker so the sentence teaches the tense
rather than just inflecting the verb. Rotation is keyed off a stable hash of the
object id, so output is deterministic and re-running changes nothing.
"""
import re

# ---------------------------------------------------------------- morphology

IRREG = {
    # motion / posture
    'fly': ('flew', 'flown'), 'run': ('ran', 'run'), 'ride': ('rode', 'ridden'),
    'drive': ('drove', 'driven'), 'swim': ('swam', 'swum'), 'rise': ('rose', 'risen'),
    'fall': ('fell', 'fallen'), 'sit': ('sat', 'sat'), 'stand': ('stood', 'stood'),
    'lie': ('lay', 'lain'), 'lay': ('laid', 'laid'), 'come': ('came', 'come'),
    'go': ('went', 'gone'), 'leave': ('left', 'left'), 'flee': ('fled', 'fled'),
    'slide': ('slid', 'slid'), 'creep': ('crept', 'crept'), 'kneel': ('knelt', 'knelt'),
    'bend': ('bent', 'bent'), 'dig': ('dug', 'dug'), 'climb': ('climbed', 'climbed'),
    # handling
    'hold': ('held', 'held'), 'take': ('took', 'taken'), 'give': ('gave', 'given'),
    'bring': ('brought', 'brought'), 'buy': ('bought', 'bought'), 'sell': ('sold', 'sold'),
    'catch': ('caught', 'caught'), 'throw': ('threw', 'thrown'), 'draw': ('drew', 'drawn'),
    'cut': ('cut', 'cut'), 'put': ('put', 'put'), 'set': ('set', 'set'), 'let': ('let', 'let'),
    'keep': ('kept', 'kept'), 'get': ('got', 'got'), 'make': ('made', 'made'),
    'build': ('built', 'built'), 'break': ('broke', 'broken'), 'choose': ('chose', 'chosen'),
    'find': ('found', 'found'), 'lose': ('lost', 'lost'), 'hide': ('hid', 'hidden'),
    'stick': ('stuck', 'stuck'), 'spread': ('spread', 'spread'), 'shake': ('shook', 'shaken'),
    'wind': ('wound', 'wound'), 'sweep': ('swept', 'swept'), 'spin': ('spun', 'spun'),
    'swing': ('swung', 'swung'), 'cling': ('clung', 'clung'), 'fling': ('flung', 'flung'),
    'sting': ('stung', 'stung'), 'wring': ('wrung', 'wrung'), 'strike': ('struck', 'struck'),
    'hang': ('hung', 'hung'), 'bite': ('bit', 'bitten'), 'tear': ('tore', 'torn'),
    'wear': ('wore', 'worn'), 'blow': ('blew', 'blown'), 'grow': ('grew', 'grown'),
    'shine': ('shone', 'shone'), 'wake': ('woke', 'woken'), 'lead': ('led', 'led'),
    # perception / speech / thought
    'see': ('saw', 'seen'), 'say': ('said', 'said'), 'speak': ('spoke', 'spoken'),
    'tell': ('told', 'told'), 'read': ('read', 'read'), 'teach': ('taught', 'taught'),
    'think': ('thought', 'thought'), 'feel': ('felt', 'felt'), 'mean': ('meant', 'meant'),
    'seek': ('sought', 'sought'), 'fight': ('fought', 'fought'),
    # daily
    'eat': ('ate', 'eaten'), 'drink': ('drank', 'drunk'), 'sing': ('sang', 'sung'),
    'sleep': ('slept', 'slept'), 'feed': ('fed', 'fed'), 'meet': ('met', 'met'),
    'send': ('sent', 'sent'), 'spend': ('spent', 'spent'), 'pay': ('paid', 'paid'),
    'hurt': ('hurt', 'hurt'), 'shut': ('shut', 'shut'), 'hit': ('hit', 'hit'),
    'beat': ('beat', 'beaten'), 'freeze': ('froze', 'frozen'),
    'show': ('showed', 'shown'), 'sew': ('sewed', 'sewn'), 'prove': ('proved', 'proven'),
    'ring': ('rang', 'rung'), 'sink': ('sank', 'sunk'), 'weave': ('wove', 'woven'),
}

VOWELS = set('aeiou')
# short verbs whose final consonant doubles: CVC, not ending w/x/y
_DOUBLE_OK = re.compile(r'^[^aeiou]*[aeiou][^aeiouwxy]$')


def _double(v):
    return len(v) <= 5 and bool(_DOUBLE_OK.match(v[-3:] if len(v) >= 3 else v))


def ing(v):
    if v in ('be',):
        return 'being'
    if v.endswith('ie'):
        return v[:-2] + 'ying'
    if v.endswith(('ee', 'oe', 'ye')):
        return v + 'ing'
    if v.endswith('e'):
        return v[:-1] + 'ing'
    if _double(v):
        return v + v[-1] + 'ing'
    return v + 'ing'


def past(v):
    if v in IRREG:
        return IRREG[v][0]
    if v.endswith('e'):
        return v + 'd'
    if v.endswith('y') and len(v) > 1 and v[-2] not in VOWELS:
        return v[:-1] + 'ied'
    if _double(v):
        return v + v[-1] + 'ed'
    return v + 'ed'


def pp(v):
    return IRREG[v][1] if v in IRREG else past(v)


def third(v):
    """Third person singular present."""
    if v.endswith(('s', 'sh', 'ch', 'x', 'z')) or v.endswith('o'):
        return v + 'es'
    if v.endswith('y') and len(v) > 1 and v[-2] not in VOWELS:
        return v[:-1] + 'ies'
    return v + 's'


# ---------------------------------------------------------------- scaffolds
# Rotated per object so the whole page does not read identically. Every entry is
# safe to append after an arbitrary "rest" phrase, or (frequency) to slot before
# the verb.

FREQ = ['often', 'usually', 'always', 'normally', 'generally']
PAST_WHEN = ['a few minutes ago', 'earlier today', 'a moment ago',
             'just before the picture was taken', 'earlier this morning']
INTERRUPT = [
    'when the picture was taken', 'when someone first looked over',
    'while everyone else was busy', 'when the noise started',
    'just as the others arrived',
]
PERFECT = ['already', 'just', 'now']
PERFECT_TAIL = ['for a while now', 'since the morning', 'all day']
GOING_TO = ['in a moment', 'any second now', 'very soon']
WILL = ['soon', 'in a little while', 'before long', 'later on']

# Scenery does not start and stop. A punctual marker on a stative verb reads
# wrong ("the pitch stretched behind the fence a few minutes ago" implies it
# has since moved), so stative verbs draw from continuity markers instead.
STATIVE = {
    'stand', 'sit', 'lie', 'rest', 'wait', 'stay', 'remain', 'hang', 'lean',
    'stretch', 'run', 'lead', 'line', 'edge', 'border', 'surround', 'separate',
    'mark', 'cover', 'shade', 'shelter', 'protect', 'hold', 'contain',
    'rise', 'tower', 'slope', 'curve', 'point', 'face', 'overlook', 'look',
    'show', 'display', 'shine', 'glow', 'gleam', 'sparkle',
    'belong', 'need', 'seem', 'support', 'divide',
}
STAT_PAST = ['yesterday as well', 'last week too',
             'all through the morning', 'long before anyone arrived']
STAT_INTERRUPT = ['when the picture was taken', 'while everything else went on nearby',
                  'when someone first looked over', 'long before the others noticed']
STAT_TAIL = ['for a long time', 'ever since the morning', 'all day', 'for years']
STAT_GOING = ['for a good while yet', 'all afternoon', 'for the rest of the day']
STAT_WILL = ['for a long time yet', 'all day', 'for years to come', 'well into the evening']


def _slot(key, options):
    """Deterministic pick — same object always gets the same scaffold."""
    h = 0
    for ch in key:
        h = (h * 131 + ord(ch)) & 0xFFFFFFFF
    return options[h % len(options)]


def _clean(s):
    s = re.sub(r'\s+', ' ', s).strip()
    if not s.endswith('.'):
        s += '.'
    return s[0].upper() + s[1:]


def build_main(subject, verb, rest, plural=False, key=''):
    """Return the 7 main_* fields as a dict."""
    rest = (' ' + rest.strip()).rstrip() if rest else ''
    IS, WAS, HAS = ('are', 'were', 'have') if plural else ('is', 'was', 'has')
    pres = verb if plural else third(verb)
    subj = subject.strip()

    stative = verb in STATIVE
    freq = _slot(key + 'f', FREQ)
    when = _slot(key + 'p', STAT_PAST if stative else PAST_WHEN)
    intr = _slot(key + 'i', STAT_INTERRUPT if stative else INTERRUPT)
    perf = _slot(key + 'h', PERFECT)
    ptail = _slot(key + 'tail2', STAT_TAIL if stative else PERFECT_TAIL)
    gt = _slot(key + 'g', STAT_GOING if stative else GOING_TO)
    wl = _slot(key + 'will3', STAT_WILL if stative else WILL)

    # Present perfect: "already/just + pp" reads best without a duration tail;
    # a bare "now" wants the tail instead. Stative verbs always want the tail —
    # "has already stood there" is odd, "has stood there for years" is not.
    if stative or perf == 'now':
        perfect = f'{subj} {HAS} {pp(verb)}{rest} {ptail}'
    else:
        perfect = f'{subj} {HAS} {perf} {pp(verb)}{rest}'

    # Stative simple present takes "still" rather than a frequency adverb:
    # "the pitch often stretches" implies it sometimes does not.
    if stative:
        present = f'{subj} still {pres}{rest}'
    else:
        present = f'{subj} {freq} {pres}{rest}'

    return {
        'main_simple_present':     _clean(present),
        'main_present_continuous': _clean(f'{subj} {IS} {ing(verb)}{rest}'),
        'main_simple_past':        _clean(f'{subj} {past(verb)}{rest} {when}'),
        'main_past_continuous':    _clean(f'{subj} {WAS} {ing(verb)}{rest} {intr}'),
        'main_present_perfect':    _clean(perfect),
        'main_future_going_to':    _clean(f'{subj} {IS} going to {verb}{rest} {gt}'),
        'main_future_will':        _clean(f'{subj} will {verb}{rest} {wl}'),
    }


# ------------------------------------------------------- recover from old data

_WILL = re.compile(r'^will\s+(\S+)\s*(.*)$')


def recover(grammar):
    """Recover (subject, verb, rest, plural) from the legacy 42-field schema."""
    subject = grammar.get('subject', '').strip()
    m = _WILL.match(grammar.get('future_will', '').strip())
    if not m:
        return None
    verb, rest = m.group(1), m.group(2).strip()
    ob = grammar.get('modals_obligation', '')
    sp = grammar.get('simple_passive', '')
    plural = ob.startswith('have to') or sp.startswith('are ')
    return subject, verb, rest, plural
