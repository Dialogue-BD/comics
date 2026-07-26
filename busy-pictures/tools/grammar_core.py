# -*- coding: utf-8 -*-
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
 'bring':('brought','brought'),'draw':('drew','drawn'),'hide':('hid','hidden'),
}
VOWELS=set('aeiou')
def _ing(v):
    if v.endswith('ie'): return v[:-2]+'ying'
    if v.endswith(('ee','oe','ye')): return v+'ing'
    if v.endswith('e'): return v[:-1]+'ing'
    if len(v)>=3 and v[-1] not in VOWELS and v[-2] in VOWELS and v[-3] not in VOWELS and v[-1] not in 'wxy' and len(v)<=5:
        return v+v[-1]+'ing'
    return v+'ing'
def _past(v):
    if v in IRREG: return IRREG[v][0]
    if v.endswith('e'): return v+'d'
    if len(v)>1 and v.endswith('y') and v[-2] not in VOWELS: return v[:-1]+'ied'
    if len(v)>=3 and v[-1] not in VOWELS and v[-2] in VOWELS and v[-3] not in VOWELS and v[-1] not in 'wxy' and len(v)<=5:
        return v+v[-1]+'ed'
    return v+'ed'
def _pp(v): return IRREG[v][1] if v in IRREG else _past(v)
def lower_first(s): return s[0].lower()+s[1:] if s and not s[:2].isupper() else s
def build(subject, verb, rest, plural=False, past_rest=None):
    rest=(' '+rest).rstrip() if rest else ''
    ing=_ing(verb)+rest; base=verb+rest
    pr=(' '+past_rest).rstrip() if past_rest else rest
    past=_past(verb)+pr; pp=_pp(verb)+pr
    IS,HAS,WAS=('are','have','were') if plural else ('is','has','was')
    s=lower_first(subject)
    return {'subject':subject,'present_continuous':ing,'simple_past':past,
      'future_going_to':f'{IS} going to {base}','future_will':f'will {base}',
      'modals_obligation':f'{HAS} to {base}','modals_ability':f'can {base}',
      'infinitive_purpose':f'{IS} here to {base}',
      'quantifier_problem':f'{HAS} too much to do while {ing}',
      'past_continuous':f'{WAS} {ing} when the station clock struck noon',
      'simple_passive':f'{IS} seen {ing}','present_perfect':f'{HAS} just {pp}',
      'second_conditional':f'If {s} stopped, the whole scene would feel different.',
      'third_conditional':f'If {s} had not been {ing}, the picture would have looked different.',
      'used_to':f'used to {base}','perception':f'I can see {s} {ing}',
      'wishes':f'wishes there were more time to {base}'}
