/* ===========================================================================
   Ethnographic Interviews · word help for the transcripts
   ---------------------------------------------------------------------------
   Language a B1 reader is likely to trip over in the thirty interviews:
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
  { p: 'put the project two weeks behind', k: 'idiom', d: 'caused the project to be two weeks late.' },
  { p: 'lead the fix',  k: 'idiom',     d: 'guide the team while they solve the problem.' },
  { p: 'protect her title', k: 'idiom', d: 'defend her status or try to keep looking important.',
                        n: 'Kim contrasts protecting status with protecting the team.' },
  { p: 'that was when', k: 'grammar',   d: 'that was the moment something changed.',
                        n: 'Kim means this moment caused her to begin trusting the manager.' },

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
  { p: 'speak for',     k: 'word',      d: 'to talk continuously for a length of time.' },

  /* ---- back of the line ---- */
  { p: 'nice about it', k: 'idiom', d: 'polite and calm when dealing with it.' },
  { p: 'worth less', k: 'grammar', d: 'less valuable or important.',
    n: 'Worth describes value: “Their time is worth less than his” is what Angela refuses to imply.' },
  { p: 'had been standing', k: 'grammar', d: 'started standing earlier and was still standing then.',
    n: 'Past perfect continuous: had been + -ing. It shows how long the woman had already waited.' },
  { p: 'kind of', k: 'discourse', d: 'a little; in a way.',
    n: 'Informal speech. “It’s kind of peaceful” is less absolute than “It’s peaceful.”' },
  { p: 'does the work', k: 'idiom', d: 'takes care of the difficult part for people.' },
  { p: 'have to decide', k: 'grammar', d: 'need to make a decision.',
    n: '“Nobody has to decide” means the line removes that difficult choice.' },
  { p: 'got you in', k: 'phrasal', d: 'helped you enter or be served sooner.',
    n: 'Daniel means knowing people could move his father ahead of others.' },
  { p: 'right behind', k: 'idiom', d: 'immediately behind, with nobody between.' },
  { p: 'waits his turn', k: 'idiom', d: 'stays in order until it is his time.' },
  { p: 'help him first', k: 'grammar', d: 'serve him before the people who arrived earlier.',
    n: 'Angela uses a conditional: if she does this, she sends a message about whose time matters.' },
  { p: 'quick questions', k: 'word', d: 'questions that take little time to ask or answer.',
    n: 'Angela points out that the people already waiting may have these too.' },
  { p: 'line’s the fairest thing', k: 'idiom', d: 'the queue is the most equal rule she can use.',
    n: 'Line’s = line is. The line does not rank customers by status or urgency.' },
  { p: 'knowing people', k: 'idiom', d: 'having personal connections who can help you.' },
  { p: 'at the back', k: 'idiom', d: 'behind everyone else in the queue.' },
  { p: 'even the boss', k: 'grammar', d: 'the boss too, although that is surprising.',
    n: 'Even highlights the unexpected example that changed Daniel’s father’s mind.' },

  /* ---- tell them what you did ---- */
  { p: 'read their mind', k: 'idiom', d: 'know what someone thinks without being told.',
    n: 'Diane can judge only what the applicant says, not what they secretly did.' },
  { p: 'why wouldn’t i', k: 'grammar', d: 'there is no reason for me not to.',
    n: 'A rhetorical question: Diane expects the listener to agree that she should believe the candidate.' },
  { p: 'giving me facts', k: 'grammar', d: 'providing information I can verify.',
    n: 'Present continuous: is + -ing. Diane contrasts evidence with vague praise.' },
  { p: 'showing off', k: 'phrasal', d: 'trying to impress people by talking about yourself.',
    n: 'Jordan says describing real work is different from trying to look superior.' },
  { p: 'too humble', k: 'grammar', d: 'so modest that it causes a problem.',
    n: 'Too + adjective means more than is useful or wanted.' },
  { p: 'nothing to say', k: 'idiom', d: 'no achievements or ideas to tell people about.',
    n: 'Arjun describes how interviewers may interpret silence, even when the person has done a lot.' },
  { p: 'kept saying', k: 'grammar', d: 'said it repeatedly.',
    n: 'Keep + -ing describes an action that continues or happens again and again.' },
  { p: 'speak for you', k: 'idiom', d: 'describe your achievements on your behalf.' },
  { p: 'failed my first three', k: 'grammar', d: 'was unsuccessful in the first three.',
    n: 'Arjun means his first three job interviews did not lead to an offer.' },
  { p: 'keeping quiet', k: 'idiom', d: 'not saying anything about your own work.',
    n: 'Arjun says silence in an interview can be mistaken for having achieved nothing.' },
  { p: 'sounds proud', k: 'idiom', d: 'comes across as too self-satisfied to listeners.' },
  { p: 'both are honest', k: 'idiom', d: 'both statements tell the truth.',
    n: 'Arjun uses “I” for his own contribution and “we” for the team’s contribution.' },

  /* ---- honestly, I’m annoyed ---- */
  { p: 'i’d stayed', k: 'grammar', d: 'I had stayed.',
    n: 'Here I’d = I had. “Stayed up” means did not go to sleep. The past perfect places that work before Hannah felt annoyed.' },
  { p: 'it’s fine', k: 'idiom', d: 'there is no problem.',
    n: 'Hannah says the words would be false if she were still upset.' },
  { p: 'sits inside me', k: 'idiom', d: 'stays as an unspoken feeling.',
    n: 'The annoyance is not literally inside a container; it remains unresolved.' },
  { p: 'as a person', k: 'idiom', d: 'for who he is generally, rather than for one action.' },
  { p: 'messed up', k: 'phrasal', d: 'made a mistake.',
    n: 'Informal speech. Ethan accepts responsibility for the unfinished work.' },
  { p: 'i’d much rather', k: 'grammar', d: 'I would strongly prefer.',
    n: 'Here I’d = I would. Ethan prefers an uncomfortable direct conversation to hidden resentment.' },
  { p: 'to my face', k: 'idiom', d: 'directly to me, while we are together.',
    n: 'Often contrasts with saying something behind someone’s back.' },
  { p: 'for the rest of', k: 'grammar', d: 'through all the time that remains.' },
  { p: 'where i stand', k: 'idiom', d: 'what my situation is; how the other person feels about me.' },
  { p: 'move on', k: 'phrasal', d: 'leave the problem behind and continue.',
    n: 'Ethan means the friendship can continue after he apologises and fixes the mistake.' },
  { p: 'in trouble', k: 'idiom', d: 'likely to face someone’s anger or a consequence.' },
  { p: 'doesn’t work', k: 'idiom', d: 'does not communicate the intended meaning.',
    n: 'Kenji means a polite smile will be understood as “I’m fine.”' },
  { p: 'quiet war', k: 'idiom', d: 'a long disagreement expressed through silence and distance.',
    n: 'A metaphor: nobody is fighting a real war.' },
  { p: 'say it kindly', k: 'grammar', d: 'say it in a considerate way.',
    n: 'Kindly is an adverb: it describes how to say something, not what to say.' },
  { p: 'got very polite', k: 'idiom', d: 'began speaking and acting especially politely.',
    n: 'In Kenji’s family this was a sign of annoyance, not a sign that everything was fine.' },
  { p: 'say it early', k: 'idiom', d: 'raise the problem before resentment has time to grow.' },
  { p: 'frown today', k: 'idiom', d: 'show displeasure now instead of hiding it for weeks.' },

  /* ---- leave the snake alone ---- */
  { p: 'black rat snake', k: 'word', d: 'a mostly harmless snake that often eats rodents.' },
  { p: 'doing me a favour', k: 'idiom', d: 'helping me without being asked.',
    n: 'The snake helps Kathy by eating the mice in her garden.' },
  { p: 'even if', k: 'grammar', d: 'whether or not this imagined condition were true.',
    n: '“Even if he did nothing for me, I’d leave him” shows Kathy’s deeper reason.' },
  { p: 'i’d leave', k: 'grammar', d: 'I would leave.',
    n: 'Here I’d = I would. Kathy describes what she would do in an imagined situation.' },
  { p: 'was his hill before', k: 'idiom', d: 'the snake lived on this land before Kathy made it her garden.' },
  { p: 'don’t own it', k: 'idiom', d: 'do not have the sole right to this place.',
    n: 'Kathy is speaking about sharing the land with wild animals.' },
  { p: 'doesn’t need fixing', k: 'grammar', d: 'does not need someone to repair or change it.',
    n: 'Need + -ing has a passive meaning here: nature does not need to be fixed.' },
  { p: 'tidy it away', k: 'phrasal', d: 'remove it while making a place neat.',
    n: 'Ray says removing the dead tree also removes the animals’ home.' },
  { p: 'knows what it’s doing', k: 'idiom', d: 'works well without people controlling it.',
    n: 'Ray gives the wild a human quality to express his trust in nature.' },
  { p: 'meant a good family', k: 'grammar', d: 'was understood as a sign of a good family.',
    n: 'Meant is the past tense of mean; Lucia describes what a clean yard signified to her grandmother.' },
  { p: 'left messy on purpose', k: 'idiom', d: 'deliberately allowed to look untidy.',
    n: 'Lucia first thought this meant laziness; later she understood it as care for nature.' },
  { p: 'keep out', k: 'phrasal', d: 'prevent something from entering.' },
  { p: 'let in', k: 'phrasal', d: 'allow something to enter.',
    n: 'Lucia contrasts keeping nature outside with welcoming it into the garden.' },
  /* ---- spoken grammar and meaning across the interviews ---- */
  { p: 'i’ve got', k: 'grammar', d: 'I have.',
    n: 'In conversation “I’ve got twenty minutes” often means the same as “I have twenty minutes.”' },
  { p: 'can’t', k: 'grammar', d: 'cannot; am not able to.',
    n: 'Can + not contracts to can’t in ordinary speech.' },
  { p: 'don’t', k: 'grammar', d: 'do not.',
    n: 'The negative of do contracts to don’t in ordinary speech.' },
  { p: 'doesn’t', k: 'grammar', d: 'does not.',
    n: 'Used for he, she, it or a singular noun: “The line doesn’t care.”' },
  { p: 'didn’t', k: 'grammar', d: 'did not.',
    n: 'The past negative uses didn’t + the base verb: “didn’t know,” not “didn’t knew.”' },
  { p: 'wasn’t', k: 'grammar', d: 'was not.',
    n: 'Hannah separates one annoying act from how she feels about Ethan as a person.' },
  { p: 'aren’t', k: 'grammar', d: 'are not.' },
  { p: 'you’re', k: 'grammar', d: 'you are.',
    n: 'Compare your, which shows possession: “your turn.”' },
  { p: 'it’s not', k: 'grammar', d: 'it is not.',
    n: 'In speech the negative can contract either way: “it’s not” or “it isn’t.”' },
  { p: 'that’s not', k: 'grammar', d: 'that is not.',
    n: 'Diane rejects the idea that stating checkable facts is bragging.' },
  { p: 'than', k: 'grammar', d: 'introduces the second thing in a comparison.',
    n: '“Worth less than his” compares the other people’s time with the man’s.' },

  /* ---- more support for the original six interviews ---- */
  { p: 'in the invite', k: 'idiom', d: 'written in the invitation.' },
  { p: 'agreeing to', k: 'phrasal', d: 'accepting a plan or promise.',
    n: 'The guests know the end time before they accept the invitation.' },
  { p: 'watching the clock', k: 'idiom', d: 'repeatedly checking the time because you want something to finish.' },
  { p: 'get their evening back', k: 'idiom', d: 'have the rest of the evening free for themselves.' },
  { p: 'belongs to them', k: 'idiom', d: 'is theirs to choose how to use.' },
  { p: 'keeps us the same', k: 'idiom', d: 'maintains equality between us.',
    n: 'Alicia does not want one friend to have power over another through paying.' },
  { p: 'a little bit above', k: 'idiom', d: 'in a slightly higher social position.' },
  { p: 'let me pay', k: 'grammar', d: 'allow me to pay.',
    n: 'Let + person + base verb is used for permission: “let me pay,” not “let me to pay.”' },
  { p: 'then we are done', k: 'idiom', d: 'then the payment is settled and no debt remains.' },
  { p: 'the number on slide four', k: 'word', d: 'a specific figure in the presentation, not a criticism of the director.' },
  { p: 'tone matters', k: 'idiom', d: 'the way you say it is important.',
    n: 'Nadia welcomes disagreement but wants it delivered respectfully.' },
  { p: 'best argument wins', k: 'idiom', d: 'the strongest reasons should decide the outcome, regardless of rank.' },
  { p: 'not personal', k: 'idiom', d: 'about the work or idea, not an attack on a person.' },
  { p: 'where i grew up', k: 'grammar', d: 'in the place or culture in which I spent my childhood.' },
  { p: 'follow you', k: 'idiom', d: 'accept your leadership.' },
  { p: 'have seen you do', k: 'grammar', d: 'witnessed you do it before now.',
    n: 'The present perfect connects past experience to the trust people feel now.' },
  { p: 'wrong is fine', k: 'idiom', d: 'a wrong answer is acceptable and useful for learning.' },
  { p: 'argue with the book', k: 'idiom', d: 'question the ideas in the course reading.',
    n: 'Beth does not mean a literal fight with a book.' },
  { p: 'been thinking', k: 'grammar', d: 'thinking over a period of time before now.',
    n: 'Have + been + -ing highlights the continued thinking, not just one answer.' },
  { p: 'good student', k: 'word', d: 'a student who did well by the rules of that classroom.' },
  { p: 'came from a system', k: 'idiom', d: 'was educated in a different kind of classroom.' },
  { p: 'copied it', k: 'word', d: 'wrote down the professor’s words exactly.' },
  { p: 'one thing they wanted', k: 'idiom', d: 'the one skill the new classroom expected.' },
  { p: 'to disagree with', k: 'grammar', d: 'to say why you think something is wrong.',
    n: 'Disagree with a person or idea; disagree about a topic.' },
  { p: 'carry the knowledge', k: 'idiom', d: 'hold and repeat information without questioning it.',
    n: 'Tomás contrasts carrying knowledge with testing it and making it your own.' },
  { p: 'not waving', k: 'idiom', d: 'no longer greeting each other because of bad feeling.' },
  { p: 'fix a normal problem', k: 'idiom', d: 'solve an ordinary issue through a straightforward conversation.' },
  { p: 'both work', k: 'idiom', d: 'both ways of handling the problem can succeed.' },
  { p: 'short and friendly', k: 'idiom', d: 'brief and polite rather than indirect or hostile.' }
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
  'decision':   { k: 'word', d: 'a choice made after thinking about what to do.' },
  'delay':      { k: 'word', d: 'extra time that makes something happen later than planned.' },
  'system':     { k: 'word', d: 'a set of connected parts or processes that work together.' },
  'weak':       { k: 'word', d: 'not strong; here, lacking authority or confidence.' },
  'trusted':    { k: 'word', d: 'believed someone was honest, capable and safe to depend on.' },
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

  /* --- the four newer interviews: work, emotion, fairness and nature --- */
  'pharmacist': { k: 'word', d: 'a healthcare professional who prepares and gives out medicines.' },
  'fairest':    { k: 'word', d: 'most fair; most equal in the way people are treated.' },
  'furious':    { k: 'word', d: 'very angry.' },
  'peaceful':   { k: 'word', d: 'calm, without conflict.' },
  'teenager':   { k: 'word', d: 'a person aged thirteen to nineteen.' },
  'achievement': { k: 'word', d: 'something you succeeded in doing.' },
  'candidate':  { k: 'word', d: 'a person applying for a job or place.' },
  'interview':  { k: 'word', d: 'a formal conversation used to decide who gets a job or place.' },
  'bragging':   { k: 'word', d: 'talking too proudly about what you have done.' },
  'humble':     { k: 'word', d: 'not thinking or speaking as if you are better than others.' },
  'modest':     { k: 'word', d: 'not drawing attention to your own achievements.' },
  'praising':   { k: 'word', d: 'saying that someone has done something very well.' },
  'semester':   { k: 'word', d: 'one half of an academic year.' },
  'annoyed':    { k: 'word', d: 'slightly angry because something is unfair or irritating.' },
  'bothers':    { k: 'word', d: 'upsets or annoys someone.' },
  'frown':      { k: 'word', d: 'an expression made by bringing your eyebrows together when unhappy.' },
  'staff':      { k: 'word', d: 'the people who work for an organisation.' },
  'quietly':    { k: 'word', d: 'without saying anything openly.' },
  'favour':     { k: 'word', d: 'a helpful act for someone.' },
  'mice':       { k: 'word', d: 'more than one mouse.' },
  'woodpeckers': { k: 'word', d: 'birds that tap and make holes in trees.' },
  'owls':       { k: 'word', d: 'birds of prey that often hunt at night.' },
  'beetles':    { k: 'word', d: 'insects with hard outer wings.' },
  'nest':       { k: 'word', d: 'make a home where birds or other animals raise their young.' },
  'yard':       { k: 'word', d: 'the outside area around a house; a garden.' },
  'patio':      { k: 'word', d: 'a paved sitting area outside a house.' },
  'spray':      { k: 'word', d: 'spread liquid over an area, often to kill insects or weeds.' },
  'tidy':       { k: 'word', d: 'make something neat by removing what looks out of place.' },
  'messy':      { k: 'word', d: 'not neat or carefully arranged.' },
  'lazy':       { k: 'word', d: 'unwilling to work.' },
  'wild':       { k: 'word', d: 'growing or living without people controlling it.' },
  'spiders':    { k: 'word', d: 'small eight-legged animals that often make webs.' },
  'line':       { k: 'word', d: 'a row of people waiting for their turn.',
                  n: 'Also called a queue. Here the order of arrival determines who is served first.' },
  'turn':       { k: 'word', d: 'your chance to do something after others have had theirs.' },
  'rule':       { k: 'word', d: 'an instruction that applies to everyone in a situation.' },
  'fair':       { k: 'word', d: 'treating people according to the same rule or what they deserve.' },
  'bank':       { k: 'word', d: 'a business where people keep and manage money.' },
  'front':      { k: 'word', d: 'the first position in a line.' },
  'sick':       { k: 'word', d: 'ill; not well.' },
  'forgot':     { k: 'word', d: 'past of forget; failed to remember.' },
  'important': { k: 'word', d: 'having high value or status.' },
  'team':       { k: 'word', d: 'a group of people working together.' },
  'facts':      { k: 'word', d: 'pieces of information that can be checked.' },
  'practice':   { k: 'word', d: 'do something repeatedly to become better at it.' },
  'numbers':    { k: 'word', d: 'figures that show how much or how many.' },
  'failed':     { k: 'word', d: 'did not succeed.' },
  'true':       { k: 'word', d: 'accurate; matching what really happened.' },
  'normal':     { k: 'word', d: 'usual or expected in a situation.' },
  'smile':      { k: 'word', d: 'make a happy or polite expression with your mouth.' },
  'angry':      { k: 'word', d: 'feeling strong displeasure.' },
  'apology':    { k: 'word', d: 'words saying you are sorry for what you did.' },
  'fix':        { k: 'word', d: 'correct a problem or repair something.' },
  'friends':    { k: 'word', d: 'people who like and trust one another.' },
  'garden':     { k: 'word', d: 'land beside a house where plants grow.' },
  'vegetables': { k: 'word', d: 'plants grown for food, such as carrots or beans.' },
  'nature':     { k: 'word', d: 'plants, animals and land that exist beyond human construction.' },
  'share':      { k: 'word', d: 'use or have something together with others.' },
  'dangerous':  { k: 'word', d: 'likely to cause harm.' },
  'leaf':       { k: 'word', d: 'the flat green part that grows on a plant or tree.' },
  'swept':     { k: 'word', d: 'past of sweep; cleaned using a broom.' },

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

/* The scene comics (scenes.js) bring their own word help. It is merged in
   here, before the phrase index is built; anything the main bank already
   glosses keeps the main bank's entry. scenes.js must load before this file. */
if (typeof SCENE_GLOSS !== 'undefined'){
  const had = new Set(GLOSS_PHRASES.map(e => e.p.toLowerCase()));
  SCENE_GLOSS.phrases.forEach(e => { if (!had.has(e.p.toLowerCase())) GLOSS_PHRASES.push(e); });
  Object.keys(SCENE_GLOSS.words).forEach(w => { if (!GLOSS_WORDS[w]) GLOSS_WORDS[w] = SCENE_GLOSS.words[w]; });
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
