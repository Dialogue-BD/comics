# -*- coding: utf-8 -*-
import json, re

IRREG = {
 'fly':('flew','flown'),'sit':('sat','sat'),'stand':('stood','stood'),'run':('ran','run'),
 'ride':('rode','ridden'),'drive':('drove','driven'),'eat':('ate','eaten'),'drink':('drank','drunk'),
 'sing':('sang','sung'),'take':('took','taken'),'hold':('held','held'),'sleep':('slept','slept'),
 'feed':('fed','fed'),'sell':('sold','sold'),'buy':('bought','bought'),'teach':('taught','taught'),
 'lead':('led','led'),'blow':('blew','blown'),'wear':('wore','worn'),'cut':('cut','cut'),
 'read':('read','read'),'swim':('swam','swum'),'hang':('hung','hung'),'lie':('lay','lain'),
 'come':('came','come'),'go':('went','gone'),'make':('made','made'),'build':('built','built'),
 'catch':('caught','caught'),'grow':('grew','grown'),'throw':('threw','thrown'),'shine':('shone','shone'),
 'speak':('spoke','spoken'),'get':('got','got'),'give':('gave','given'),'wind':('wound','wound'),
 'set':('set','set'),'let':('let','let'),'put':('put','put'),'keep':('kept','kept'),
 'sweep':('swept','swept'),'leave':('left','left'),'meet':('met','met'),'find':('found','found'),
 'sting':('stung','stung'),'spin':('spun','spun'),'stick':('stuck','stuck'),'swing':('swung','swung'),
 'bring':('brought','brought'),'draw':('drew','drawn'),'hide':('hid','hidden'),'fall':('fell','fallen'),
 'sweep':('swept','swept'),'wake':('woke','woken'),'shake':('shook','shaken'),'steal':('stole','stolen'),
}
V=set('aeiou')
PREPS={'in','on','at','over','under','beside','near','by','through','across','along','behind','between',
 'above','below','around','into','onto','from','towards','toward','past','up','down','outside','inside',
 'with','against','off','beneath','beyond','among','next','out','back','away','high','deep','straight'}

def de_ing(w):
    lw=w.lower()
    for b,(p,pp) in IRREG.items():
        if _ing(b)==lw: return b
    if not lw.endswith('ing'): return lw
    s=lw[:-3]
    if len(s)>=3 and s[-1]==s[-2] and s[-1] not in V and s[-1] not in 'lsz': return s[:-1]
    if s and s[-1] not in V and len(s)>=2 and s[-2] in V and s not in ('watch','catch','push','wash','fish','finish','splash','flash','march','stretch','search'):
        pass
    return s
def _ing(v):
    if v.endswith('ie'): return v[:-2]+'ying'
    if v.endswith(('ee','oe','ye')): return v+'ing'
    if v.endswith('e'): return v[:-1]+'ing'
    if len(v)>=3 and v[-1] not in V and v[-2] in V and v[-3] not in V and v[-1] not in 'wxy' and len(v)<=5:
        return v+v[-1]+'ing'
    return v+'ing'
def pp_of(v):
    if v in IRREG: return IRREG[v][1]
    if v.endswith('e'): return v+'d'
    if len(v)>1 and v.endswith('y') and v[-2] not in V: return v[:-1]+'ied'
    if len(v)>=3 and v[-1] not in V and v[-2] in V and v[-3] not in V and v[-1] not in 'wxy' and len(v)<=5:
        return v+v[-1]+'ed'
    return v+'ed'
def third(v):
    if v in ('be',): return 'is'
    if v.endswith(('s','sh','ch','x','z','o')): return v+'es'
    if len(v)>1 and v.endswith('y') and v[-2] not in V: return v[:-1]+'ies'
    return v+'s'
def lf(s): return s[0].lower()+s[1:] if s and not s[:2].isupper() else s
def indef(subject):
    """'The yellow rescue helicopter' -> 'a yellow rescue helicopter'"""
    s=subject
    for art in ('The ','A ','An ','the ','a ','an '):
        if s.startswith(art): s=s[len(art):]; break
    else:
        s=lf(s)
    return ('an ' if s[:1].lower() in 'aeiou' else 'a ')+s, s
def possessive(subject):
    return subject+("'" if subject.rstrip().endswith('s') else "'s")

FULL=set()   # fields that are complete sentences

def build_extra(g):
    S=g['subject']; s=lf(S)
    plural = g['future_going_to'].startswith('are going to')
    IS,ARE_HAS,WAS,PRON,POBJ,POSS = ('are','have','were','they','them','their') if plural else ('is','has','was','it','it','its')
    LIKES = 'like' if plural else 'likes'
    HASV  = 'have' if plural else 'has'
    base = g['modals_ability'][4:].strip()          # "fly over the snowy mountains"
    parts = base.split(' ',1)
    v = parts[0]; rest = parts[1] if len(parts)>1 else ''
    ing_w = _ing(v); ingp = (ing_w+(' '+rest if rest else '')).strip()
    ppw = pp_of(v); ppp = (ppw+(' '+rest if rest else '')).strip()
    v3 = third(v) if not plural else v
    v3p = (v3+(' '+rest if rest else '')).strip()
    a_form, bare = indef(S)
    # 'The flock of sheep' is plural for agreement but singular for the article:
    # 'There is a flock of sheep', never 'There are flock of sheep'.
    collective = bool(re.match(r'(flock|group|pair|row|cloud|crowd|herd|line|pile|set|team|bunch|couple|family)\b', bare, re.I))
    art_plural = plural and not collective
    is_pp = bool(rest) and rest.split(' ',1)[0].lower() in PREPS
    out={}
    def put(k, val): out[k]=val; FULL.add(k)

    put('to_be', f"{S} {IS} {rest}." if is_pp else f"{S} {IS} easy to see in this picture.")
    put('pronouns', f"{PRON.capitalize()} {IS} {ingp}. Can you see {POBJ}?")
    put('prepositions_place', f"Where {IS} {s}? {PRON.capitalize()} {IS} {rest}." if is_pp
        else f"Look carefully. {PRON.capitalize()} {IS} somewhere in this picture.")
    put('there_is', (f"There are {bare} {rest}." if art_plural else f"There is {a_form} {rest}.") if is_pp
        else (f"There are {bare} in this picture." if art_plural else f"There is {a_form} in this picture."))
    put('demonstratives', f"Those are {bare}." if art_plural else f"That is {a_form}.")
    put('possessive', f"{possessive(S)} job is to {base}.")
    put('adverbs_frequency', f"{S} often {v3p}.")
    put('imperatives', f"Find {s} and tell me what {PRON} {IS} doing.")
    put('comparatives', f"{S} {IS} easier to spot than the smaller things around {POBJ}.")
    put('superlatives', f"{S} {IS} one of the easiest things to find in this picture.")
    put('adverbs_manner', f"{S} {IS} {ing_w} carefully{(' '+rest) if rest else ''}.")
    put('conjunctions', f"{S} {IS} {ingp}, so everyone nearby is watching.")
    put('simultaneous', f"While {s} {IS} {ingp}, other things are happening all around.")
    put('first_conditional', f"If you look closely, you will see {s} {ingp}.")
    put('relative_defining', f"{S} {IS} the {'ones' if plural else 'one'} that {v3p}.")
    put('gerunds_infinitives', f"{S} {LIKES} {ingp}. {PRON.capitalize()} {HASV} decided to {base}.")
    put('deduction_present', f"{S} must be {ingp}.")
    put('deduction_past', f"{S} must have {ppp}.")
    put('criticism_regret', f"{S} should have {ppp} more carefully.")
    put('perfect_continuous', f"{S} {HASV} been {ingp} for quite a while.")
    put('passive_continuous', f"{S} {IS} being watched by everyone in the picture.")
    put('causative', f"{S} {IS} going to have {POSS} picture taken.")
    put('reported_speech', f"The teacher said that {s} {WAS} {ingp}.")
    put('relative_nondefining', f"{S}, which {IS} {ingp}, {IS} easy to find.")
    return out
