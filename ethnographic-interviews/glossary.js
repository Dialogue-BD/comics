/* ===========================================================================
   Ethnographic Interviews · word help for the transcripts
   ---------------------------------------------------------------------------
   Everything a B1 reader is likely to trip over in the eighteen interviews:
   the idioms, the phrasal verbs, the discourse markers people actually say
   out loud, and the grammar that carries meaning rather than decoration.

   Two banks. PHRASES is tried first and longest-first, so "figure out" wins
   over "figure"; then the single word, through the endings in index.html
   (plurals, -ed, -ing, possessives).

     p / w  the headword, lower case, apostrophes straight
     k      idiom | phrasal | discourse | grammar | word
     d      what it means, in plain English, one line
     n      the note underneath: how it is used, or the grammar behind it

   Definitions are written for a Bengali learner reading a transcript, not for
   a dictionary. Where a word is ordinary but is being used strangely — cheap
   effort, an itchy feeling, a clean exit — the strange use is what is glossed.
   =========================================================================== */

const GLOSS_PHRASES = [

  /* ---- the dinner that ends at eight ---- */
  { p: 'end time',      k: 'word',      d: 'the time something will finish.' },
  { p: 'open-ended',    k: 'idiom',     d: 'with no finishing time — it can go on as long as people want.',
                        n: 'The opposite of an invitation that says “six to eight”.' },
  { p: 'book a ride',   k: 'phrasal',   d: 'arrange a taxi or a car in advance.' },
  { p: 'get up',        k: 'phrasal',   d: 'leave your bed in the morning.' },
  { p: 'out loud',      k: 'idiom',     d: 'so that other people can hear it — not silently, not only in your head.' },
  { p: 'end up',        k: 'phrasal',   d: 'to be in a situation you did not plan or want.',
                        n: 'Usually followed by -ing: “I end up sitting there at eleven.”' },
  { p: 'take it badly', k: 'idiom',     d: 'to be hurt or offended by something.',
                        n: 'Here in the present perfect: “Nobody has ever taken it badly.”' },
  { p: 'grow up',       k: 'phrasal',   d: 'to spend your childhood somewhere; to become an adult.' },
  { p: 'the whole point', k: 'idiom',   d: 'the only thing that really matters about it.' },
  { p: 'in blocks',     k: 'idiom',     d: 'divided into fixed pieces of time.' },

  /* ---- six friends, six payments ---- */
  { p: 'i mean',        k: 'discourse', d: 'said before you explain yourself or correct what you just said.',
                        n: 'It carries no meaning of its own. It buys the speaker a second.' },
  { p: 'to be honest',  k: 'discourse', d: 'said before something direct that the listener may not enjoy.' },
  { p: 'keep score',    k: 'idiom',     d: 'to count who owes what, and remember it.',
                        n: 'From games. Between friends it is an accusation: you are counting favours.' },
  { p: 'fight you for', k: 'idiom',     d: 'compete hard to be the one who does it.',
                        n: 'Nobody is really fighting. It describes how strongly he insists on paying.' },
  { p: 'go home clean', k: 'idiom',     d: 'to leave owing nobody anything.',
                        n: 'Clean here means free of debt, not washed.' },
  { p: 'on purpose',    k: 'idiom',     d: 'because you decided to — not by chance.' },
  { p: 'by accident',   k: 'idiom',     d: 'without planning it.' },
  { p: 'take two seconds', k: 'idiom',  d: 'to be very quick and easy.' },
  { p: 'above you',     k: 'idiom',     d: 'in a higher position than you, socially.' },

  /* ---- the junior who said no ---- */
  { p: 'that is on me', k: 'idiom',     d: 'that is my fault; I am the one responsible.' },
  { p: 'side of the table', k: 'idiom', d: 'the position you are speaking from — here, the manager’s.' },
  { p: 'fly blind',     k: 'idiom',     d: 'to act with no information about what is really happening.' },
  { p: 'hit the plan hard', k: 'idiom', d: 'test or attack the plan strongly, looking for what is wrong with it.' },
  { p: 'make a speech', k: 'idiom',     d: 'to talk formally and at length when a sentence would do.' },
  { p: 'speak up',      k: 'phrasal',   d: 'to say what you think, especially when it disagrees with someone powerful.' },
  { p: 'pay for it',    k: 'idiom',     d: 'to suffer later because of what you did.',
                        n: 'No money is involved: “You spoke up, you paid for it later.”' },
  { p: 'shut up',       k: 'phrasal',   d: 'stop speaking.',
                        n: 'Rude if you say it to someone. Here Wes uses it about himself and his colleagues.' },
  { p: 'run into the ground', k: 'idiom', d: 'to ruin something by managing it badly.' },
  { p: 'take it',       k: 'idiom',     d: 'to accept criticism without getting angry.',
                        n: '“One boss who could not take it” — he could not accept being disagreed with.' },

  /* ---- the director stacking chairs ---- */
  { p: 'take the blame', k: 'idiom',    d: 'to accept publicly that you are responsible when something goes wrong.' },
  { p: 'way more',      k: 'grammar',   d: 'much more.',
                        n: 'Way before a comparative is informal and strong: way more, way better, way too late.' },
  { p: 'under me',      k: 'idiom',     d: 'working below me in the organisation; I am their manager.' },
  { p: 'lose the floor', k: 'idiom',    d: 'to lose contact with the real work your people do.',
                        n: 'The floor is where the work happens — the factory floor, the shop floor.' },
  { p: 'the hard shift', k: 'idiom',    d: 'the difficult period of work that nobody wants.' },
  { p: 'earn it',       k: 'idiom',     d: 'to deserve it through what you do, rather than be given it.' },
  { p: 'stack chairs',  k: 'word',      d: 'to put chairs one on top of another after an event.' },
  { p: 'next to you',   k: 'idiom',     d: 'beside you, doing the same work.' },

  /* ---- “what do you think?” ---- */
  { p: 'half-formed',   k: 'word',      d: 'not finished, still taking shape.' },
  { p: 'figure out',    k: 'phrasal',   d: 'to understand something after thinking about it.' },
  { p: 'find out',      k: 'phrasal',   d: 'to discover something you did not know.' },
  { p: 'write down',    k: 'phrasal',   d: 'to record something on paper.' },
  { p: 'work on',       k: 'phrasal',   d: 'to spend time improving something.',
                        n: 'Hale’s joke turns on it: a wrong answer can be worked on, silence cannot.' },
  { p: 'own it',        k: 'idiom',     d: 'to take responsibility for it and make it yours.' },
  { p: 'be supposed to', k: 'grammar',  d: 'to be expected to — by a rule, or by what people assume.',
                        n: '“Now I am supposed to argue with the book?” — she is describing the expectation, and doubting it.' },

  /* ---- the neighbour’s tree ---- */
  { p: 'sit on it',     k: 'idiom',     d: 'to do nothing about a problem for a long time.' },
  { p: 'behind his back', k: 'idiom',   d: 'without him knowing — usually saying something he would not like.' },
  { p: 'go around the side', k: 'idiom', d: 'to approach a problem indirectly instead of speaking to the person.' },
  { p: 'no idea',       k: 'idiom',     d: 'does not know at all.' },
  { p: 'most of the time', k: 'idiom',  d: 'usually; in most cases.' },
  { p: 'would rather',  k: 'grammar',   d: 'prefer.',
                        n: 'Followed by a bare verb, and than for the comparison: “I would rather have four awkward minutes than four awkward years.”' },
  { p: 'any more',      k: 'grammar',   d: 'used with a negative to say something has stopped being true.' },
  { p: 'would have sent', k: 'grammar', d: 'she did not send anything — this is the past she imagines.',
                        n: 'would have + past participle describes an unreal past.' },
  { p: 'it took me',    k: 'grammar',   d: 'used to say how long something needed.',
                        n: 'it takes + person + time + to do: “It took me years to stop feeling rude.”' },

  /* ---- said in more than one interview ---- */
  { p: 'stay quiet',    k: 'idiom',     d: 'to say nothing when you could speak.' },
  { p: 'at all',        k: 'grammar',   d: 'added to a negative to make it complete: none whatever.' },
  { p: 'not my child',  k: 'idiom',     d: 'not something I will defend the way a parent defends a child.',
                        n: 'Nadia is warning her team not to treat her plan as part of her.' },
  { p: 'a job not a size', k: 'idiom',  d: 'a set of duties, not a measure of how big a person is.' },
  { p: 'arms stopped working', k: 'idiom', d: 'a joke: being promoted did not make him unable to lift things.' },
  { p: 'where it comes from', k: 'idiom', d: 'the real source of it.' },
  { p: 'in the first place', k: 'idiom', d: 'at the beginning; to start with.' },
  { p: 'the other way', k: 'idiom',     d: 'the opposite custom.' },
  { p: 'say nothing',   k: 'idiom',     d: 'to stay silent about something you noticed.' },
  { p: 'speak for',     k: 'word',      d: 'to talk continuously for a length of time.' }
];

const GLOSS_WORDS = {

  /* --- the words people say to manage the conversation --- */
  'honestly':   { k: 'discourse', d: 'said before something frank, or to insist that you mean it.' },
  'actually':   { k: 'discourse', d: 'in fact — often marking a small surprise, or a correction.' },
  'anyway':     { k: 'discourse', d: 'used to close a subject and move on.' },
  'yeah':       { k: 'discourse', d: 'yes, in speech.' },
  'look':       { k: 'discourse', d: 'said to get attention before an honest point.',
                  n: 'Not the verb here: “And look, if I do not say it out loud…”.' },
  'right':      { k: 'discourse', d: 'at the end of a sentence, it asks the listener to agree.' },
  'sure':       { k: 'discourse', d: 'yes, I accept that — often before a but.' },
  'so':         { k: 'discourse', d: 'starts a sentence that follows from what came before.' },
  'just':       { k: 'discourse', d: 'only; simply. It makes a request or a statement smaller and softer.' },

  /* --- feelings --- */
  'awkward':    { k: 'word', d: 'uncomfortable, because the situation is socially difficult.' },
  'relieved':   { k: 'word', d: 'glad that something you were worried about is over.' },
  'terrified':  { k: 'word', d: 'very frightened.' },
  'terrifies':  { k: 'word', d: 'makes someone very frightened.' },
  'terrible':   { k: 'word', d: 'very bad.' },
  'offended':   { k: 'word', d: 'hurt and insulted by what someone did.' },
  'suspicious': { k: 'word', d: 'feeling that something is being hidden from you.' },
  'itchy':      { k: 'word', d: 'restless and uncomfortable.',
                  n: 'Literally the feeling that makes you scratch. Greg uses it for the discomfort of owing someone.' },
  'uncomfortable': { k: 'word', d: 'not relaxed; uneasy.' },
  'trapped':    { k: 'word', d: 'caught somewhere you cannot leave.' },
  'grudge':     { k: 'word', d: 'an old anger you keep, long after the event.' },
  'blame':      { k: 'word', d: 'saying who is responsible when something goes wrong.' },
  'respect':    { k: 'word', d: 'to think well of someone because of what they do.' },
  'respectful': { k: 'word', d: 'showing respect.' },
  'rude':       { k: 'word', d: 'not polite.' },
  'polite':     { k: 'word', d: 'behaving in the way good manners require.' },
  'friendly':   { k: 'word', d: 'warm and easy to talk to.' },

  /* --- work and rank --- */
  'director':   { k: 'word', d: 'a senior manager who runs an organisation or a part of it.' },
  'boss':       { k: 'word', d: 'the person you work for.' },
  'vice-president': { k: 'word', d: 'a very senior manager, just under the president.' },
  'professor':  { k: 'word', d: 'a senior university teacher.' },
  'title':      { k: 'word', d: 'the name of your position at work — director, manager, intern.' },
  'badge':      { k: 'word', d: 'the card you wear that says who you are and what rank you hold.' },
  'shift':      { k: 'word', d: 'a fixed period of work — a morning shift, a night shift.' },
  'policy':     { k: 'word', d: 'the rule an organisation follows.',
                  n: 'Dave’s point is that what a manager actually does at six o’clock is the real rule.' },
  'budgets':    { k: 'word', d: 'plans for how money will be spent.' },
  'forklift':   { k: 'word', d: 'a small vehicle for lifting and moving heavy loads in a warehouse.' },
  'intern':     { k: 'word', d: 'a young person doing a short period of work to learn the job.' },
  'earn':       { k: 'word', d: 'to deserve something through work.' },
  'perform':    { k: 'word', d: 'to act for an audience.',
                  n: 'Nadia means: do not turn the disagreement into a show.' },
  'objection':  { k: 'word', d: 'a reason why you think something is wrong.' },
  'argument':   { k: 'word', d: 'the reasons you give for a position — not a fight.' },
  'argue':      { k: 'word', d: 'to give reasons against something.' },
  'disagree':   { k: 'word', d: 'to think something is not right.' },
  'draft':      { k: 'word', d: 'a first version, meant to be changed.' },
  'slide':      { k: 'word', d: 'one screen of a presentation.' },
  'complain':   { k: 'word', d: 'to say that you are not satisfied.' },
  'damages':    { k: 'word', d: 'harms; breaks something that was working.' },

  /* --- money and obligation --- */
  'bill':       { k: 'word', d: 'the paper that says how much you must pay.' },
  'split':      { k: 'word', d: 'to divide something between people.' },
  'splitting':  { k: 'word', d: 'dividing the cost between people.' },
  'divide':     { k: 'word', d: 'to separate into parts.' },
  'owe':        { k: 'word', d: 'to have to give something back to someone.' },
  'owes':       { k: 'word', d: 'has to give something back.' },
  'covers':     { k: 'word', d: 'pays for.',
                  n: '“If Josh covers me” — if Josh pays my share.' },
  'gift':       { k: 'word', d: 'something given freely, with nothing expected back.' },
  'cheap':      { k: 'word', d: 'costing little.',
                  n: 'Nadia stretches it: “while it is still cheap to change” — while changing it costs little effort.' },
  'score':      { k: 'word', d: 'the record of points in a game.' },
  'homework':   { k: 'word', d: 'school work to do at home.',
                  n: 'Greg means an unwanted task hanging over him.' },
  'clean':      { k: 'word', d: 'owing nothing.',
                  n: 'Not about dirt: “let me pay my part and go home clean”.' },

  /* --- the classroom --- */
  'knowledge':  { k: 'word', d: 'everything that is known about a subject.' },
  'silence':    { k: 'word', d: 'when nobody is speaking.' },
  'notes':      { k: 'word', d: 'what you write down to remember.' },
  'copied':     { k: 'word', d: 'wrote down exactly what somebody else said.' },
  'testing':    { k: 'word', d: 'checking whether something is true or good.' },
  'test':       { k: 'word', d: 'to check whether something holds up.' },
  'supposed':   { k: 'word', d: 'expected to.',
                  n: 'Always with to: supposed to know, supposed to argue.' },
  'exists':     { k: 'word', d: 'is real; is there.' },

  /* --- the street --- */
  'gutter':     { k: 'word', d: 'the open channel along the edge of a roof that carries rainwater away.' },
  'neighbours': { k: 'word', d: 'the people who live next to you.' },
  'waving':     { k: 'word', d: 'moving your hand to greet someone.',
                  n: '“Two men not waving” — two neighbours who have stopped greeting each other.' },
  'stacking':   { k: 'word', d: 'putting things one on top of another.' },
  'blocks':     { k: 'word', d: 'solid pieces.',
                  n: 'Priya means fixed pieces of time in a diary.' },
  'accident':   { k: 'word', d: 'something that happens without being planned.' },
  'adult':      { k: 'word', d: 'a grown person.' },
  'host':       { k: 'word', d: 'the person who invites you and looks after you.' },
  'invite':     { k: 'word', d: 'the message asking you to come.',
                  n: 'Short for invitation, and common in speech.' },
  'ride':       { k: 'word', d: 'a journey in a car or taxi.' },
  'steak':      { k: 'word', d: 'an expensive cut of beef.' },
  'pasta':      { k: 'word', d: 'an Italian food made from flour and water.' },

  /* --- the small words that carry the argument --- */
  'genuinely':  { k: 'word', d: 'really; not pretending.' },
  'exactly':    { k: 'word', d: 'precisely.' },
  'completely': { k: 'word', d: 'totally.' },
  'usually':    { k: 'word', d: 'most of the time.' },
  'whatever':   { k: 'word', d: 'anything at all that.' },
  'whether':    { k: 'word', d: 'if — used when there are two possibilities.' },
  'though':     { k: 'word', d: 'but; however.' },
  'even':       { k: 'word', d: 'used to show that something is surprising.' },
  'still':      { k: 'word', d: 'up to now and continuing.' },
  'rather':     { k: 'word', d: 'used with would to say what you prefer.' },
  'automatic':  { k: 'word', d: 'happening by itself, without anyone deciding.',
                  n: 'Wes: the culture is not automatic — people have to keep choosing it.' },
  'personal':   { k: 'word', d: 'about you as a person, not about the work.' },
  'direct':     { k: 'word', d: 'saying the thing itself, without going around it.' },
  'tone':       { k: 'word', d: 'the sound of your voice, and what it shows about your feelings.' },
  'useless':    { k: 'word', d: 'no good for anything.' },
  'blind':      { k: 'word', d: 'unable to see.' },
  'grew':       { k: 'word', d: 'past of grow.' },
  'taught':     { k: 'word', d: 'past of teach.' },
  'stood':      { k: 'word', d: 'past of stand.' },
  'spoke':      { k: 'word', d: 'past of speak.' },
  'wrote':      { k: 'word', d: 'past of write.' },
  'sent':       { k: 'word', d: 'past of send.' },
  'took':       { k: 'word', d: 'past of take.' },
  'ran':        { k: 'word', d: 'past of run.' },
  'seen':       { k: 'word', d: 'past participle of see.' },
  'paid':       { k: 'word', d: 'past of pay.' },

  /* --- picked up by the coverage check --- */
  "o'clock":    { k: 'word', d: 'used after a whole hour: six o’clock.' },
  'sir':        { k: 'word', d: 'a respectful way to address a man.',
                  n: 'Normal in Bangladesh at work. Dave finds it uncomfortable — that reaction is the whole scenario.' },
  'nod':        { k: 'word', d: 'to move your head down and up to show agreement.' },
  'hiding':     { k: 'word', d: 'keeping something out of sight.',
                  n: 'Caleb’s word for staying silent about a problem he can see.' },
  'kid':        { k: 'word', d: 'a child — and, informally, a very young colleague.' },
  'child':      { k: 'word', d: 'a young person; someone’s son or daughter.' },
  'breaks':     { k: 'word', d: 'stops working; fails.' },
  'arms':       { k: 'word', d: 'the limbs from your shoulders to your hands.' },
  'size':       { k: 'word', d: 'how big something is.',
                  n: 'Dave uses it for social importance: a title is a job, not a size.' },
  'touching':   { k: 'word', d: 'putting your hands on something.',
                  n: 'Roberto means doing the work yourself, not only managing it.' },
  'holding':    { k: 'word', d: 'carrying something in your hands.',
                  n: 'Wes means whoever is making the argument — their rank does not change it.' },
  'treating':   { k: 'word', d: 'behaving towards someone in a certain way.' },
  'mentioned':  { k: 'word', d: 'said something briefly, without making it the main subject.' },
  'closed':     { k: 'word', d: 'finished; settled.',
                  n: 'Ade is talking about the problem, not a door.' },
  'version':    { k: 'word', d: 'one form of something, when there are others.' },
  'belongs':    { k: 'word', d: 'is the property of.' },
  'promise':    { k: 'word', d: 'something you say you will certainly do.' },
  'wondering':  { k: 'word', d: 'asking yourself; not being sure.' },
  'midnight':   { k: 'word', d: 'twelve o’clock at night.' },
  'app':        { k: 'word', d: 'a program on a phone.',
                  n: 'Here a payment app — friends in the United States settle small debts on the phone at the table.' },
  'underneath': { k: 'word', d: 'under the surface; not said openly.' },
  'below':      { k: 'word', d: 'in a lower position.' },
  'quiet':      { k: 'word', d: 'making no sound; saying nothing.' },
  'twenty-two-year-old': { k: 'grammar', d: 'a person who is twenty-two.',
                  n: 'Before a noun the numbers are joined by hyphens and year stays singular: a five-year plan.' }
};

/* ---------------------------------------------------------------- matching
   One implementation, used by the page and by the coverage check, so the
   words the page underlines are exactly the words the bank is tested on.

   A headword is written in its base form — "grow up", "speak up", "be
   supposed to" — and the matcher does the work of recognising "grew up",
   "spoke up", "am supposed to". Irregular verbs get a small table because no
   amount of suffix-stripping turns "taken" into "take". */
const GLOSS_IRREG = {
  am:'be', is:'be', are:'be', was:'be', were:'be', been:'be', being:'be',
  has:'have', had:'have', having:'have',
  does:'do', did:'do', done:'do', doing:'do',
  goes:'go', went:'go', gone:'go',
  took:'take', taken:'take', takes:'take', taking:'take',
  grew:'grow', grown:'grow',
  spoke:'speak', spoken:'speak',
  wrote:'write', written:'write',
  paid:'pay', kept:'keep', found:'find', lost:'lose', made:'make',
  flew:'fly', flown:'fly', flying:'fly',
  ran:'run', sat:'sit', saw:'see', seen:'see',
  sent:'send', taught:'teach', stood:'stand', thought:'think',
  said:'say', came:'come', left:'leave', got:'get', gotten:'get',
  knew:'know', known:'know', felt:'feel', held:'hold', heard:'hear'
};

function glossNorm(w){
  return String(w).toLowerCase().replace(/[‘’‛]/g, "'").replace(/^[^a-z]+|[^a-z]+$/g, '');
}

/* every form this surface word could be hiding, best guess first */
function glossForms(w){
  w = glossNorm(w).replace(/'s$/, '');
  const out = [w];
  if (GLOSS_IRREG[w]) out.push(GLOSS_IRREG[w]);
  if (/ies$/.test(w))  out.push(w.slice(0, -3) + 'y');
  if (/([sxz]|ch|sh)es$/.test(w)) out.push(w.slice(0, -2));
  if (/s$/.test(w) && !/ss$/.test(w)) out.push(w.slice(0, -1));
  if (/ed$/.test(w)){ out.push(w.slice(0, -2)); out.push(w.slice(0, -1)); }
  if (/ing$/.test(w)){ out.push(w.slice(0, -3)); out.push(w.slice(0, -3) + 'e'); }
  if (/([bdglmnprt])\1(ed|ing)$/.test(w)) out.push(w.replace(/([bdglmnprt])\1(ed|ing)$/, '$1'));
  return out;
}

function glossSame(a, b){
  const fa = glossForms(a), fb = glossForms(b);
  return fa.some(x => x && fb.indexOf(x) > -1);
}

function glossWord(w){
  const forms = glossForms(w);
  for (let i = 0; i < forms.length; i++) if (GLOSS_WORDS[forms[i]]) return GLOSS_WORDS[forms[i]];
  return null;
}

/* phrases, longest first, so "figure out" beats "figure" */
const GLOSS_PHRASE_INDEX = GLOSS_PHRASES
  .map(e => ({ e: e, t: e.p.split(/\s+/).map(glossNorm) }))
  .sort((a, b) => b.t.length - a.t.length);

/* tokens = the transcript's words, in order. Returns {entry, len} or null. */
function glossAt(tokens, i){
  for (let k = 0; k < GLOSS_PHRASE_INDEX.length; k++){
    const cand = GLOSS_PHRASE_INDEX[k];
    if (i + cand.t.length > tokens.length) continue;
    let hit = true;
    for (let j = 0; j < cand.t.length; j++){
      if (!glossSame(tokens[i + j], cand.t[j])){ hit = false; break; }
    }
    if (hit) return { entry: cand.e, len: cand.t.length };
  }
  const w = glossWord(tokens[i]);
  return w ? { entry: w, len: 1 } : null;
}

if (typeof module !== 'undefined') module.exports = { GLOSS_PHRASES, GLOSS_WORDS, glossAt, glossWord, glossNorm };
