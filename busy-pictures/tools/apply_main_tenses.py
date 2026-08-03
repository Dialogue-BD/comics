#!/usr/bin/env python3
"""
Write the 7 `main_*` tense fields into pages 11-25 and repair bad past
participles across all 25 pages.

Writes BOTH the inline `var spatialIndex` in index.html and spatial_index.json.
The viewer reads the inline copy; updating only the JSON does nothing.

Usage:  python3 tools/apply_main_tenses.py [--dry-run]
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from main_tenses import build_main, recover, IRREG, pp  # noqa: E402

MAIN = ['main_simple_present', 'main_present_continuous', 'main_simple_past',
        'main_past_continuous', 'main_present_perfect', 'main_future_going_to',
        'main_future_will']

# Some legacy objects store a compound verb phrase ("build or repair a wooden
# item", "eat hay and rest"). Only the head verb gets inflected, so the second
# verb is left as a bare stem and the sentence reads wrong: "builds or repair".
# Truncating the rest at the conjunction fixes 18 of the 20 cases in the book.
#
# CONJ_VERB matches a conjunction followed by a bare stem that is a head verb
# somewhere else in the corpus — that is what distinguishes "hay and rest"
# (verb) from "the cups and plates" (noun).
# Anchored at start too: several rests are just "and rest" / "and eat".
CONJ_VERB = re.compile(r'(?:^|\s+)(?:or|and)\s+([a-z]+)\b.*$')

# Verbs that only ever appear in second position, so they never make it into the
# head-verb vocabulary scraped from future_will.
SECOND_ONLY = {'repair', 'make', 'explore', 'visit', 'use', 'get', 'have', 'give',
               'look', 'help', 'say', 'observe', 'rest', 'eat', 'play', 'soothe',
               'interact', 'exercise', 'admire'}

# Legacy plural flags are unreliable on pages 22-25 ("The cows ... has to"), so
# plurality is re-derived from the subject noun phrase instead.
PLURAL_HEADS = {'children', 'people', 'men', 'women', 'geese', 'mice', 'sheep',
                'cattle', 'police'}
PLURAL_LEAD = re.compile(
    r'^(?:the\s+)?(?:two|three|four|five|six|several|many|some|both|a\s+few|'
    r'a\s+group\s+of|a\s+pair\s+of|rows\s+of|lots\s+of)\b', re.I)
SINGULAR_COLLECTIVE = re.compile(
    r'^(?:the\s+)?(?:group|pair|row|bunch|pile|stack|crowd|flock|herd|set|'
    r'basket|tray|jar|box|crate|swarm|line)\b', re.I)


def is_plural(subject, legacy_plural):
    """Decide plurality from the subject noun phrase, falling back to legacy."""
    s = subject.strip().rstrip('.').lower()
    if SINGULAR_COLLECTIVE.match(s):
        return False           # "The group of adults socializes"
    if PLURAL_LEAD.match(s):
        return True            # "The two birds", "Three cats"
    head = re.split(r'\s+(?:of|in|on|at|with|by|from|beside|under|near)\b', s)[0]
    last = head.split()[-1] if head.split() else ''
    if last in PLURAL_HEADS:
        return True
    if last.endswith('s') and not last.endswith(('ss', 'us', 'is')):
        return True            # cats, pigs, cows, rabbits
    return legacy_plural

# The two cases where truncating alone leaves the verb stranded without its
# object. Keyed by (page, object name).
COMPOUND_FIX = {
    (22, 'Man holding a blue horse toy'):     ('hold', 'the blue horse toy'),
    (22, 'Man doing carpentry with tools'):   ('build', 'a wooden item'),
    (22, 'Woman comforting a child'):         ('reassure', 'the child'),
    (24, 'Two children petting ponies'):      ('pet', 'the friendly ponies'),
}


def head_verbs(idx):
    """Every verb used as a head verb anywhere in the book."""
    vs = set()
    for objs in idx.values():
        for o in objs:
            m = re.match(r'^will (\S+)', o['grammar_data'].get('future_will', '') or '')
            if m:
                vs.add(m.group(1))
    return vs


def strip_second_verb(rest, verb, vocab):
    """Drop 'or/and <bare verb> ...' from the tail of a rest phrase."""
    m = CONJ_VERB.search(rest)
    if m and (m.group(1) in vocab or m.group(1) in SECOND_ONLY) and m.group(1) != verb:
        return rest[:m.start()].strip()
    return rest

DRY = '--dry-run' in sys.argv


def load_inline():
    s = open(os.path.join(BP, 'index.html')).read()
    i = s.index('var spatialIndex = ') + len('var spatialIndex = ')
    j = s.index('};', i) + 1
    return s, i, j, json.loads(s[i:j])


# Verbs whose regular participle is also correct English — leave them alone
# rather than churn text that is not wrong. "has proved" is standard.
KEEP_REGULAR = {'prove', 'sew', 'climb', 'lean', 'smell', 'spill'}


def fix_participles(idx):
    """Repair regularised participles of irregular verbs, e.g. 'has rised'."""
    bad = {}
    for v, (_, part) in IRREG.items():
        if v in KEEP_REGULAR:
            continue
        reg = v + 'd' if v.endswith('e') else v + 'ed'
        if reg != part:
            bad[reg] = part
        if v.endswith('e'):
            bad[v[:-1] + 'ed'] = part
    fixed = 0
    pat = re.compile(r'\b(has|have|had)\s+((?:already|just|now|never|still)\s+)?(' +
                     '|'.join(sorted(bad, key=len, reverse=True)) + r')\b')

    def sub(m):
        nonlocal fixed
        fixed += 1
        return f"{m.group(1)} {m.group(2) or ''}{bad[m.group(3)]}"

    for page, objs in idx.items():
        for o in objs:
            g = o['grammar_data']
            for k, v in list(g.items()):
                if isinstance(v, str) and ('has ' in v or 'have ' in v or 'had ' in v):
                    nv = pat.sub(sub, v)
                    if nv != v:
                        g[k] = nv
    return fixed


def main():
    s, i, j, idx = load_inline()

    generated = 0
    skipped = []
    fixed_compound = []
    vocab = head_verbs(idx)
    for p in range(11, 26):
        key = 'wimmelbook_%d' % p
        for o in idx[key]:
            rec = recover(o['grammar_data'])
            if rec is None:
                skipped.append((p, o['name']))
                continue
            subj, verb, rest, plural = rec
            plural = is_plural(subj, plural)
            override = COMPOUND_FIX.get((p, o['name']))
            if override:
                verb, rest = override
                fixed_compound.append((p, o['name']))
            else:
                trimmed = strip_second_verb(rest, verb, vocab)
                if trimmed != rest:
                    rest = trimmed
                    fixed_compound.append((p, o['name']))
            o['grammar_data'].update(
                build_main(subj, verb, rest, plural, key=o['id']))
            generated += 1

    fixed = fix_participles(idx)

    print('objects given main_* fields (pages 11-25): %d' % generated)
    print('objects skipped (verb not recoverable):    %d' % len(skipped))
    for sk in skipped[:10]:
        print('   ', sk)
    print('compound verb phrases rewritten:           %d' % len(fixed_compound))
    print('bad past participles repaired (all pages): %d' % fixed)

    if DRY:
        print('\n--dry-run: nothing written')
        return

    out = s[:i] + json.dumps(idx, ensure_ascii=False, separators=(',', ':')) + s[j:]
    open(os.path.join(BP, 'index.html'), 'w').write(out)
    with open(os.path.join(BP, 'spatial_index.json'), 'w') as f:
        json.dump(idx, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('\nwrote index.html and spatial_index.json')


if __name__ == '__main__':
    main()
