/* ===========================================================================
   How Are You Feeling? — the chunk bank
   ---------------------------------------------------------------------------
   One entry per word on the wheel (77). Every entry is hand-written for a
   B1–B2 learner, and each list feeds one step of the lesson:

   p  Word partners (collocations). "~" stands for the headword itself;
      {form} marks another form of it (fears, anxiety). Everything that is
      not the headword is the partner the student learns to expect.
   g  Grammar patterns (colligations): [pattern, example, wrong options].
      In the example, [word] is the small grammar word the pattern hangs
      on — the gap the student fills. The wrong options are chosen to be
      clearly wrong in that sentence, never a second right answer.
   i  Idioms: [idiom, plain meaning, example]. *…* marks the idiom inside
      the example so the page can light it up.

   Keep the headword visible in every p and g line: the listening flood
   counts it.
   =========================================================================== */
const CHUNKS = {

/* ---------------------------------------------------------------- FEAR */
Fear: {
  p: ['feel ~', 'overcome your {fear}', '~ of failure', 'a real ~', 'live in ~'],
  g: [['fear of + noun', 'She has a ~ [of] dogs.', 'to|at'],
      ['fear that + clause', 'My ~ is [that] I will forget my words.', 'what|if'],
      ['in fear', 'The children ran away [in] ~.', 'on|at'],
      ['for fear of + -ing', 'He stayed quiet [for] ~ of making a mistake.', 'by|to'],
      ['without fear', 'Speak [without] ~ — nobody will laugh.', 'within|except']],
  i: [['my heart was in my mouth', 'I felt very afraid and nervous', '*My heart was in my mouth* when the plane shook.'],
      ['scared stiff', 'so afraid you cannot move', 'I was *scared stiff* before my first class.'],
      ['my blood ran cold', 'I suddenly felt deep fear', '*My blood ran cold* when I heard a noise downstairs.']]
},
Insecure: {
  p: ['feel ~', 'deeply ~', 'a bit ~', '~ about my English', 'make someone ~'],
  g: [['insecure about + noun', "I feel ~ [about] my accent.", 'on|at'],
      ['feel insecure when + clause', 'I feel ~ [when] people correct me in public.', 'what|because of'],
      ['too insecure to + verb', 'He was too ~ [to] ask a question.', 'for|that'],
      ['insecure around + person', 'She feels ~ [around] fluent speakers.', 'along|across'],
      ['make + someone + insecure', 'Social media [makes] me ~.', 'does|lets']],
  i: [['not feel good enough', 'feel that you are less than others', 'Sometimes I just *don’t feel good enough*.'],
      ['a knock to my confidence', 'something that made me feel less sure of myself', 'The low mark was *a knock to my confidence*.'],
      ['feel out of my depth', 'feel the task is too difficult for me', 'In the new job I *feel out of my depth*.']]
},
Inadequate: {
  p: ['feel ~', 'completely ~', 'a sense of {inadequacy}', '~ for the job', 'make someone feel ~'],
  g: [['inadequate for + noun', 'I felt ~ [for] such a big job.', 'to|at'],
      ['inadequate as + role', 'She felt ~ [as] a leader.', 'like|so'],
      ['feel inadequate when + clause', 'I feel ~ [when] I can’t follow the lecture.', 'what|which'],
      ['feelings of inadequacy', 'He struggled with feelings [of] {inadequacy}.', 'for|about'],
      ['make + someone + feel inadequate', 'Her comments [made] me feel ~.', 'did|got']],
  i: [['not up to the job', 'not good or able enough for a task', 'I worried I was *not up to the job*.'],
      ['out of my league', 'much better or harder than I can manage', 'Everyone there felt *out of my league*.'],
      ['fall short', 'fail to reach the level you need', 'I always seem to *fall short*.']]
},
Inferior: {
  p: ['feel ~', 'a sense of being ~', 'socially ~', 'made to feel ~', 'an {inferiority} complex'],
  g: [['inferior to + person', 'I felt ~ [to] the other students.', 'than|from'],
      ['feel inferior when + clause', 'I feel ~ [when] others speak so fast.', 'what|who'],
      ['inferior in + area', 'She felt ~ [in] skill and experience.', 'at|on'],
      ['make + someone + feel inferior', 'He tries to [make] people feel ~.', 'do|get'],
      ['feelings of inferiority', 'Comparing myself gave me feelings [of] {inferiority}.', 'from|for']],
  i: [['look down on someone', 'think someone is less important than you', 'They *looked down on* me because of my accent.'],
      ['feel small', 'feel unimportant or weak', 'His joke *made me feel small*.'],
      ['second-best', 'not as good as the best', 'I always felt *second-best* next to my brother.']]
},
Rejected: {
  p: ['feel ~', 'completely ~', 'deeply ~', '~ by friends', 'a fear of {rejection}'],
  g: [['rejected by + person', 'I felt ~ [by] my classmates.', 'from|with'],
      ['feel rejected when + clause', 'I feel ~ [when] nobody replies.', 'what|where'],
      ['rejected for + noun', 'She was ~ [for] the job.', 'to|at'],
      ['fear of rejection', 'His fear [of] {rejection} kept him quiet.', 'for|about'],
      ['after being rejected', 'I cried [after] being ~.', 'since|until']],
  i: [['left out in the cold', 'not included or wanted by a group', 'I felt *left out in the cold* at the party.'],
      ['given the cold shoulder', 'ignored in an unfriendly way', 'She *gave me the cold shoulder* all week.'],
      ['shut out', 'not allowed to join', 'They *shut me out* of the group chat.']]
},
Alienated: {
  p: ['feel ~', 'totally ~', '~ from friends', 'a sense of {alienation}', 'become ~'],
  g: [['alienated from + group', 'I felt ~ [from] my classmates.', 'of|by'],
      ['feel alienated in + place', 'He felt ~ [in] the big city.', 'at|to'],
      ['feel alienated because + clause', 'I felt ~ [because] nobody shared my culture.', 'because of|despite'],
      ['become alienated', 'She slowly [became] ~ from her family.', 'went|made'],
      ['a sense of alienation', 'There was a sense [of] {alienation} in the office.', 'for|with']],
  i: [['a fish out of water', 'someone who feels wrong in a new place', 'In the new country I was *a fish out of water*.'],
      ['on the outside looking in', 'not part of the group', 'I felt like I was *on the outside looking in*.'],
      ['not my world', 'a place where I do not belong', 'That club is just *not my world*.']]
},
Disrespected: {
  p: ['feel ~', 'deeply ~', 'completely ~', '~ at work', 'be treated with {disrespect}'],
  g: [['feel disrespected by + person', 'I felt ~ [by] his comment.', 'from|with'],
      ['feel disrespected when + clause', 'I feel ~ [when] people interrupt me.', 'what|which'],
      ['treated with disrespect', 'She was treated [with] {disrespect}.', 'by|to'],
      ['disrespected in front of + people', 'I felt ~ [in] front of the class.', 'at|on'],
      ['feel disrespected at + place', 'Many workers feel ~ [at] work.', 'on|to']],
  i: [['a slap in the face', 'an action that insults you', 'Being ignored was *a slap in the face*.'],
      ['treated like dirt', 'treated as if you are worth nothing', 'I was *treated like dirt* in that shop.'],
      ['walk all over someone', 'treat someone badly because they let you', 'I won’t let them *walk all over me*.']]
},
Anxious: {
  p: ['feel ~', 'deeply ~', 'a bit ~', '~ thoughts', 'make someone ~'],
  g: [['anxious about + noun', 'I feel ~ [about] the exam.', 'on|at'],
      ['anxious to + verb', 'She is ~ [to] do well.', 'for|that'],
      ['feel anxious when + clause', 'I get ~ [when] I have to speak.', 'what|which'],
      ['too anxious to + verb', 'I was too ~ [to] sleep.', 'for|so'],
      ['get anxious', 'Don’t [get] ~ over small things.', 'do|have']],
  i: [['butterflies in my stomach', 'a nervous feeling before something', 'I had *butterflies in my stomach* before my speech.'],
      ['on pins and needles', 'nervously waiting for news', 'I was *on pins and needles* all morning.'],
      ['a bundle of nerves', 'a very nervous person', 'Before the interview I was *a bundle of nerves*.']]
},
Overwhelmed: {
  p: ['feel ~', 'completely ~', 'totally ~', '~ by work', 'a bit ~'],
  g: [['overwhelmed by + noun', 'I feel ~ [by] all this homework.', 'from|to'],
      ['overwhelmed with + noun', 'She was ~ [with] emotion.', 'of|at'],
      ['feel overwhelmed when + clause', 'I feel ~ [when] everything happens at once.', 'what|that'],
      ['so overwhelmed that + clause', 'I was so ~ [that] I couldn’t think.', 'what|as'],
      ['start to feel overwhelmed', 'I [started] to feel ~.', 'made|did']],
  i: [['up to my ears', 'having too much to deal with', 'I’m *up to my ears* in work this week.'],
      ['drowning in work', 'having far too much work', 'I’m *drowning in work* right now.'],
      ['too much on my plate', 'too many things to do', 'I have *too much on my plate* this term.']]
},
Worried: {
  p: ['feel ~', 'really ~', 'a bit ~', 'look ~', 'a ~ face'],
  g: [['worried about + noun', 'I’m ~ [about] my mother.', 'on|at'],
      ['worried that + clause', 'I’m ~ [that] I’ll be late.', 'what|which'],
      ['worried sick', 'She was ~ [sick] all night.', 'ill|badly'],
      ['get worried when + clause', 'I get ~ [when] you don’t call.', 'what|which'],
      ['no need to be worried', 'There’s no need [to] be ~.', 'for|that']],
  i: [['worried sick', 'extremely worried', 'Mum was *worried sick* when I came home late.'],
      ['lose sleep over something', 'worry so much you can’t sleep', 'Don’t *lose sleep over* one small mistake.'],
      ['have something on my mind', 'keep thinking about a problem', 'I *have a lot on my mind* today.']]
},
Scared: {
  p: ['feel ~', 'really ~', '~ to death', 'a bit ~', 'look ~'],
  g: [['scared of + noun', 'I’m ~ [of] the dark.', 'to|from'],
      ['scared to + verb', 'She was ~ [to] ask.', 'for|that'],
      ['scared that + clause', 'I was ~ [that] I would fail.', 'what|who'],
      ['too scared to + verb', 'He was too ~ [to] move.', 'for|that'],
      ['get scared', 'Children [get] ~ in storms.', 'make|do']],
  i: [['scared to death', 'extremely afraid', 'I was *scared to death* on the old bridge.'],
      ['jump out of my skin', 'get a big sudden fright', 'The loud bang made me *jump out of my skin*.'],
      ['shaking like a leaf', 'trembling because you are afraid', 'I was *shaking like a leaf* before the exam.']]
},
Terrified: {
  p: ['feel ~', 'absolutely ~', 'completely ~', '~ scream', 'a ~ look'],
  g: [['terrified of + noun', 'I’m ~ [of] snakes.', 'to|at'],
      ['terrified to + verb', 'She was ~ [to] open the door.', 'for|that'],
      ['terrified that + clause', 'He was ~ [that] the boat would sink.', 'what|which'],
      ['absolutely terrified', 'I was [absolutely] ~.', 'fully|highly'],
      ['leave + someone + terrified', 'The film [left] me ~.', 'let|took']],
  i: [['frightened out of my wits', 'extremely frightened', 'The storm *frightened me out of my wits*.'],
      ['my hair stood on end', 'I felt sudden, strong fear', '*My hair stood on end* when the lights went out.'],
      ['frozen with fear', 'so afraid you cannot move', 'I was *frozen with fear* on the stage.']]
},
Frightened: {
  p: ['feel ~', 'really ~', 'a ~ child', 'look ~', '~ by the noise'],
  g: [['frightened of + noun', 'He is ~ [of] big dogs.', 'to|at'],
      ['frightened by + noun', 'I was ~ [by] the thunder.', 'from|with'],
      ['frightened to + verb', 'She was ~ [to] walk home alone.', 'for|of'],
      ['frightened that + clause', 'I was ~ [that] someone was following me.', 'what|which'],
      ['a frightened look', 'She gave me a ~ [look].', 'view|sight']],
  i: [['get the fright of my life', 'get a very big shock and fear', 'I *got the fright of my life* when the dog barked.'],
      ['a cold sweat', 'sweating because you are afraid', 'I woke up in *a cold sweat*.'],
      ['make my skin crawl', 'make me feel afraid and uneasy', 'That dark street *makes my skin crawl*.']]
},

/* --------------------------------------------------------------- ANGER */
Anger: {
  p: ['feel ~', 'full of ~', 'control your ~', 'show your ~', 'a flash of ~'],
  g: [['anger at + noun/person', 'I felt ~ [at] the unfair rule.', 'on|to'],
      ['anger about + noun', 'There is ~ [about] the new fees.', 'on|to'],
      ['in anger', 'He shouted [in] ~.', 'on|at'],
      ['with anger', 'Her face was red [with] ~.', 'of|by'],
      ['anger that + clause', 'I felt ~ [that] nobody listened.', 'what|which']],
  i: [['see red', 'suddenly become very angry', 'When he pushed my sister, I *saw red*.'],
      ['lose my temper', 'become angry and stop being calm', 'I tried not to *lose my temper* with the class.'],
      ['blow up at someone', 'suddenly shout at someone angrily', 'I’m sorry I *blew up at you* yesterday.']]
},
Mad: {
  p: ['get ~', 'really ~', 'so ~', 'go ~', 'make someone ~'],
  g: [['mad at + person', 'I’m ~ [at] my brother.', 'on|to'],
      ['mad about + noun', 'She’s ~ [about] the noise.', 'of|on'],
      ['get mad when + clause', 'I get ~ [when] people are late.', 'what|which'],
      ['make + someone + mad', 'That really [makes] me ~.', 'does|lets'],
      ['mad that + clause', 'He was ~ [that] we left early.', 'what|who']],
  i: [['hopping mad', 'extremely angry', 'Dad was *hopping mad* about the broken window.'],
      ['drive me up the wall', 'make me very annoyed', 'That noise *drives me up the wall*.'],
      ['fly off the handle', 'suddenly get very angry', 'He *flew off the handle* over nothing.']]
},
Enraged: {
  p: ['utterly ~', 'feel ~', 'become ~', 'an ~ crowd', 'absolutely ~'],
  g: [['enraged by + noun', 'People were ~ [by] the decision.', 'from|with'],
      ['enraged at + noun', 'She was ~ [at] the lie.', 'on|to'],
      ['enraged that + clause', 'He was ~ [that] nobody helped.', 'what|which'],
      ['become enraged', 'The crowd [became] ~.', 'made|did'],
      ['enraged when + clause', 'I was ~ [when] I saw the damage.', 'what|which']],
  i: [['beside myself with rage', 'so angry you cannot control yourself', 'I was *beside myself with rage*.'],
      ['blow my top', 'suddenly become extremely angry', 'When I saw the damage, I *blew my top*.'],
      ['foaming at the mouth', 'extremely angry', 'He was practically *foaming at the mouth*.']]
},
Furious: {
  p: ['absolutely ~', 'feel ~', 'get ~', 'a ~ row', 'make someone ~'],
  g: [['furious with + person', 'Mum was ~ [with] me.', 'to|on'],
      ['furious about + noun', 'He was ~ [about] the delay.', 'on|to'],
      ['furious that + clause', 'She was ~ [that] I forgot.', 'what|which'],
      ['furious at + noun', 'I’m ~ [at] myself.', 'on|to'],
      ['at a furious pace', 'He worked [at] a ~ pace.', 'on|in']],
  i: [['fuming', 'very angry but not shouting', 'I was *fuming* after the meeting.'],
      ['hit the roof', 'become very angry suddenly', 'My father *hit the roof* when he saw my phone bill.'],
      ['steam coming out of my ears', 'feeling very angry', 'There was *steam coming out of my ears*.']]
},
Hurt: {
  p: ['feel ~', 'deeply ~', 'really ~', '~ feelings', 'a ~ look'],
  g: [['hurt by + noun', 'I was ~ [by] her words.', 'from|with'],
      ['hurt that + clause', 'I felt ~ [that] he didn’t call.', 'what|which'],
      ['feel hurt when + clause', 'I feel ~ [when] friends forget me.', 'what|who'],
      ['hurt someone’s feelings', 'I didn’t mean [to] ~ your feelings.', 'for|that'],
      ['too hurt to + verb', 'She was too ~ [to] speak.', 'for|that']],
  i: [['cut to the quick', 'deeply hurt by words', 'His comment *cut me to the quick*.'],
      ['take something to heart', 'feel hurt by criticism for a long time', 'Don’t *take it to heart* — he was joking.'],
      ['a stab in the back', 'a betrayal by a friend', 'Telling my secret was *a stab in the back*.']]
},
Devastated: {
  p: ['feel ~', 'absolutely ~', 'completely ~', '~ by the news', 'leave someone ~'],
  g: [['devastated by + noun', 'We were ~ [by] the news.', 'from|with'],
      ['devastated that + clause', 'She was ~ [that] she failed.', 'what|which'],
      ['devastated when + clause', 'I was ~ [when] my grandfather died.', 'what|who'],
      ['leave + someone + devastated', 'The loss [left] him ~.', 'let|stayed'],
      ['absolutely devastated', 'I’m [absolutely] ~.', 'fully|highly']],
  i: [['my world fell apart', 'my life suddenly became very painful', 'When I lost my job, *my world fell apart*.'],
      ['heartbroken', 'extremely sad', 'She was *heartbroken* when the cat died.'],
      ['knocked for six', 'very shocked and upset', 'The news *knocked me for six*.']]
},
Embarrassed: {
  p: ['feel ~', 'so ~', 'a bit ~', 'look ~', 'an ~ smile'],
  g: [['embarrassed about + noun', 'I’m ~ [about] my mistake.', 'on|to'],
      ['embarrassed to + verb', 'I was ~ [to] ask for help.', 'for|of'],
      ['embarrassed by + noun', 'She was ~ [by] the attention.', 'from|to'],
      ['too embarrassed to + verb', 'He was too ~ [to] speak.', 'for|that'],
      ['feel embarrassed when + clause', 'I feel ~ [when] I mispronounce a word.', 'what|which']],
  i: [['go red', 'your face becomes red because you are embarrassed', 'I *went red* when everyone looked at me.'],
      ['want the ground to swallow me up', 'feel so embarrassed you want to disappear', 'I *wanted the ground to swallow me up*.'],
      ['red-faced', 'embarrassed', 'He left the room *red-faced*.']]
},
Threatened: {
  p: ['feel ~', 'a bit ~', '~ by change', 'deeply ~', 'make someone feel ~'],
  g: [['threatened by + noun', 'He feels ~ [by] new ideas.', 'from|with'],
      ['feel threatened when + clause', 'I feel ~ [when] someone stands too close.', 'what|which'],
      ['feel threatened in + place', 'She felt ~ [in] that street.', 'to|of'],
      ['make + someone + feel threatened', 'Shouting [makes] children feel ~.', 'does|gets'],
      ['feel threatened at + place', 'Some people feel ~ [at] work.', 'on|to']],
  i: [['back against the wall', 'in a difficult position with no way out', 'I felt my *back was against the wall*.'],
      ['on the defensive', 'ready to protect yourself', 'The question put him *on the defensive*.'],
      ['under attack', 'feeling criticised or in danger', 'I felt *under attack* in the meeting.']]
},
Jealous: {
  p: ['feel ~', 'a bit ~', 'insanely ~', '~ of her success', 'make someone ~'],
  g: [['jealous of + person/noun', 'I was ~ [of] my sister.', 'on|to'],
      ['jealous that + clause', 'He was ~ [that] I won.', 'what|which'],
      ['get jealous when + clause', 'She gets ~ [when] I talk to others.', 'what|who'],
      ['make + someone + jealous', 'Don’t try to [make] him ~.', 'do|let'],
      ['feelings of jealousy', 'I had feelings [of] {jealousy}.', 'for|about']],
  i: [['green with envy', 'very jealous', 'I was *green with envy* when she got the prize.'],
      ['the green-eyed monster', 'jealousy', '*The green-eyed monster* got the better of me.'],
      ['nose out of joint', 'upset because someone got something you wanted', 'My *nose was out of joint* when he got the role.']]
},
Distant: {
  p: ['feel ~', 'seem ~', 'a bit ~', 'emotionally ~', 'grow ~'],
  g: [['distant from + person', 'I feel ~ [from] my friends.', 'of|to'],
      ['grow distant', 'We slowly [grew] ~.', 'made|did'],
      ['seem distant', 'You [seem] ~ today.', 'look at|see'],
      ['feel distant when + clause', 'I feel ~ [when] I’m tired.', 'what|which'],
      ['a distant look', 'She had a ~ [look] in her eyes.', 'view|watch']],
  i: [['miles away', 'not paying attention; thinking of other things', 'Sorry, I was *miles away*.'],
      ['drift apart', 'slowly become less close', 'We *drifted apart* after school.'],
      ['keep someone at arm’s length', 'not let someone become close', 'He *keeps everyone at arm’s length*.']]
},
Suspicious: {
  p: ['feel ~', 'a bit ~', 'deeply ~', '~ look', '~ behaviour'],
  g: [['suspicious of + person', 'I’m ~ [of] strangers.', 'on|to'],
      ['suspicious about + noun', 'She was ~ [about] the offer.', 'on|to'],
      ['become suspicious when + clause', 'I became ~ [when] he didn’t answer.', 'what|which'],
      ['suspicious that + clause', 'I was ~ [that] something was wrong.', 'what|which'],
      ['look suspicious', 'That man [looks] ~.', 'sees|watches']],
  i: [['smell a rat', 'feel that something is wrong or dishonest', 'When the price was so low, I *smelled a rat*.'],
      ['something fishy', 'something strange or dishonest', 'There’s *something fishy* about this email.'],
      ['take it with a pinch of salt', 'do not completely believe it', 'I *take his stories with a pinch of salt*.']]
},
Withdrawn: {
  p: ['become ~', 'quiet and ~', 'seem ~', 'socially ~', 'a ~ child'],
  g: [['withdrawn from + noun', 'He became ~ [from] his friends.', 'of|to'],
      ['become withdrawn', 'She [became] quiet and ~.', 'made|did'],
      ['withdrawn after + noun', 'He was ~ [after] the accident.', 'since|until'],
      ['seem withdrawn', 'You [seem] ~ today.', 'look at|see'],
      ['withdraw into + yourself', 'I {withdrew} [into] myself.', 'onto|out']],
  i: [['go into my shell', 'become quiet and shy', 'In big groups I *go into my shell*.'],
      ['keep to myself', 'stay alone and not talk much', 'Lately I *keep to myself*.'],
      ['shut myself away', 'stay away from other people', 'I *shut myself away* in my room.']]
},

/* ------------------------------------------------------------ SURPRISE */
Surprise: {
  p: ['a big ~', 'a nice ~', 'come as a ~', 'in ~', 'to my ~'],
  g: [['to my surprise', '[To] my ~, she said yes.', 'For|At'],
      ['in surprise', 'He looked up [in] ~.', 'on|at'],
      ['a surprise for + person', 'We have a ~ [for] you.', 'to|at'],
      ['come as a surprise', 'The news came [as] a ~.', 'like|to'],
      ['take + someone + by surprise', 'The rain took us [by] ~.', 'with|in']],
  i: [['out of the blue', 'suddenly and unexpectedly', 'She called me *out of the blue*.'],
      ['caught off guard', 'surprised and not ready', 'The question *caught me off guard*.'],
      ['a bolt from the blue', 'a complete surprise', 'The news was *a bolt from the blue*.']]
},
Confused: {
  p: ['feel ~', 'totally ~', 'a bit ~', 'look ~', 'get ~'],
  g: [['confused about + noun', 'I’m ~ [about] the homework.', 'on|to'],
      ['confused by + noun', 'She was ~ [by] the question.', 'from|with'],
      ['get confused when + clause', 'I get ~ [when] people talk fast.', 'what|which'],
      ['confused between A and B', 'I get ~ [between] “since” and “for”.', 'among|within'],
      ['a confused look', 'He gave me a ~ [look].', 'view|sight']],
  i: [['I can’t make head or tail of it', 'I cannot understand it at all', '*I can’t make head or tail of* these instructions.'],
      ['all at sea', 'completely confused', 'In the first lesson I was *all at sea*.'],
      ['scratching my head', 'trying hard to understand', 'I’m still *scratching my head* about that answer.']]
},
Disillusioned: {
  p: ['feel ~', 'become ~', 'deeply ~', '~ with politics', 'grow ~'],
  g: [['disillusioned with + noun', 'I’m ~ [with] my job.', 'of|at'],
      ['disillusioned by + noun', 'She was ~ [by] the result.', 'from|to'],
      ['become disillusioned', 'He slowly [became] ~.', 'made|did'],
      ['disillusioned after + noun', 'I felt ~ [after] the election.', 'since|until'],
      ['a sense of disillusionment', 'There’s a sense [of] {disillusionment}.', 'for|about']],
  i: [['the shine has worn off', 'it no longer seems exciting', 'After a year, *the shine has worn off*.'],
      ['let down', 'disappointed by someone or something', 'I felt *let down* by the system.'],
      ['see it for what it is', 'see the true, less perfect picture', 'Now I *see it for what it is*.']]
},
Perplexed: {
  p: ['feel ~', 'look ~', 'totally ~', 'a ~ expression', 'leave someone ~'],
  g: [['perplexed by + noun', 'I was ~ [by] his answer.', 'from|with'],
      ['perplexed about + noun', 'She was ~ [about] the rules.', 'on|to'],
      ['perplexed at + noun', 'We were ~ [at] the result.', 'on|to'],
      ['leave + someone + perplexed', 'The puzzle [left] me ~.', 'let|took'],
      ['a perplexed look', 'He gave a ~ [look].', 'view|sight']],
  i: [['at a loss', 'not knowing what to say or do', 'I was *at a loss* for an answer.'],
      ['it beats me', 'I really don’t understand it', '*It beats me* why the bus is always late.'],
      ['a riddle', 'something hard to understand', 'His behaviour is *a riddle* to me.']]
},
Startled: {
  p: ['look ~', 'a ~ cry', 'slightly ~', '~ by a noise', 'a ~ jump'],
  g: [['startled by + noun', 'I was ~ [by] a loud noise.', 'from|with'],
      ['startled to + verb', 'She was ~ [to] see him there.', 'for|of'],
      ['startled when + clause', 'I was ~ [when] the phone rang.', 'what|which'],
      ['a startled look', 'She gave me a ~ [look].', 'view|sight'],
      ['startled out of + noun', 'I was ~ [out] of my sleep.', 'off|away']],
  i: [['jump out of my skin', 'get a big sudden fright', 'I nearly *jumped out of my skin*.'],
      ['make me jump', 'surprise me suddenly', 'The door slammed and *made me jump*.'],
      ['caught off guard', 'surprised and not ready', 'The knock *caught me off guard*.']]
},
Shocked: {
  p: ['feel ~', 'deeply ~', 'totally ~', '~ silence', 'a ~ face'],
  g: [['shocked by + noun', 'We were ~ [by] the news.', 'from|with'],
      ['shocked at + noun', 'I was ~ [at] the price.', 'on|to'],
      ['shocked to + verb', 'I was ~ [to] hear that.', 'for|of'],
      ['shocked that + clause', 'She was ~ [that] he left.', 'what|which'],
      ['in shocked silence', 'We sat [in] ~ silence.', 'on|at']],
  i: [['you could have knocked me down with a feather', 'I was extremely surprised', '*You could have knocked me down with a feather*.'],
      ['it hit me like a ton of bricks', 'the news hit me hard and suddenly', 'The news *hit me like a ton of bricks*.'],
      ['my jaw dropped', 'I was very surprised', '*My jaw dropped* when I saw the result.']]
},
Dismayed: {
  p: ['feel ~', 'deeply ~', 'a ~ look', '~ by the news', 'to my {dismay}'],
  g: [['dismayed by + noun', 'She was ~ [by] the mess.', 'from|with'],
      ['dismayed at + noun', 'We were ~ [at] the result.', 'on|to'],
      ['dismayed to + verb', 'I was ~ [to] see the price.', 'for|of'],
      ['dismayed that + clause', 'He was ~ [that] nobody came.', 'what|which'],
      ['to my dismay', '[To] my {dismay}, the shop was closed.', 'For|At']],
  i: [['my heart sank', 'I suddenly felt sad and worried', '*My heart sank* when I saw my grade.'],
      ['a sinking feeling', 'a bad feeling that something is wrong', 'I had *a sinking feeling* when he didn’t reply.'],
      ['not what I hoped for', 'disappointing', 'The result was *not what I hoped for*.']]
},
Amazed: {
  p: ['absolutely ~', 'really ~', '~ look', 'feel ~', 'never cease to {amaze}'],
  g: [['amazed at + noun', 'I was ~ [at] her skill.', 'on|to'],
      ['amazed by + noun', 'We were ~ [by] the view.', 'from|with'],
      ['amazed to + verb', 'I was ~ [to] see so many people.', 'for|of'],
      ['amazed that + clause', 'She was ~ [that] I remembered.', 'what|which'],
      ['amazed how + clause', 'I’m ~ [how] fast you learn.', 'what|which']],
  i: [['blown away', 'extremely impressed', 'I was *blown away* by the concert.'],
      ['my jaw dropped', 'I was very surprised', '*My jaw dropped* when I saw the view.'],
      ['couldn’t believe my eyes', 'was very surprised by what I saw', 'I *couldn’t believe my eyes*.']]
},
Astonished: {
  p: ['absolutely ~', 'utterly ~', '~ look', 'an ~ silence', 'to my {astonishment}'],
  g: [['astonished at + noun', 'He was ~ [at] the price.', 'on|to'],
      ['astonished by + noun', 'We were ~ [by] the result.', 'from|with'],
      ['astonished to + verb', 'I was ~ [to] find it open.', 'for|of'],
      ['astonished that + clause', 'She was ~ [that] he knew.', 'what|which'],
      ['to my astonishment', '[To] my {astonishment}, he agreed.', 'For|At']],
  i: [['lost for words', 'so surprised you cannot speak', 'I was *lost for words*.'],
      ['taken aback', 'very surprised and a little shocked', 'I was *taken aback* by her question.'],
      ['I couldn’t believe my ears', 'I was very surprised by what I heard', '*I couldn’t believe my ears*.']]
},
Awe: {
  p: ['in ~', 'a sense of ~', 'stand in ~', 'fill someone with ~', 'look on in ~'],
  g: [['in awe of + noun', 'I’m [in] ~ of her courage.', 'on|at'],
      ['look on in awe', 'We looked on [in] ~.', 'on|at'],
      ['a sense of awe', 'I felt a sense [of] ~.', 'for|about'],
      ['filled with awe', 'She was filled [with] ~.', 'of|by'],
      ['with awe', 'He spoke [with] ~ about the mountains.', 'of|by']],
  i: [['take my breath away', 'be so beautiful it surprises you', 'The view *took my breath away*.'],
      ['stop me in my tracks', 'make me stop suddenly because it is amazing', 'The sunset *stopped me in my tracks*.'],
      ['words can’t describe it', 'it is too great to explain', '*Words can’t describe it* — you have to see it.']]
},
Excited: {
  p: ['really ~', 'so ~', 'get ~', 'feel ~', 'an ~ crowd'],
  g: [['excited about + noun', 'I’m ~ [about] the trip.', 'on|to'],
      ['excited to + verb', 'She’s ~ [to] meet you.', 'for|of'],
      ['excited that + clause', 'We’re ~ [that] you’re coming.', 'what|which'],
      ['get excited', 'Don’t [get] too ~.', 'do|have'],
      ['too excited to + verb', 'I was too ~ [to] sleep.', 'for|that']],
  i: [['can’t wait', 'am very excited about something soon', 'I *can’t wait* for the holidays.'],
      ['over the moon', 'extremely happy and excited', 'She was *over the moon* about the news.'],
      ['buzzing', 'full of excited energy', 'The whole class was *buzzing*.']]
},
Eager: {
  p: ['~ to learn', 'very ~', '~ students', '~ to please', 'an ~ face'],
  g: [['eager to + verb', 'I’m ~ [to] start.', 'for|of'],
      ['eager for + noun', 'We are ~ [for] news.', 'to|of'],
      ['eager to hear from + person', 'We are ~ to hear [from] you.', 'of|at'],
      ['too eager to + verb', 'He was too ~ [to] listen.', 'for|that'],
      ['eager to please', 'The new boy is ~ [to] please.', 'for|of']],
  i: [['raring to go', 'very ready and eager to start', 'The team is *raring to go*.'],
      ['keen as mustard', 'very eager', 'She was *keen as mustard* on the first day.'],
      ['champing at the bit', 'impatient to start', 'The kids were *champing at the bit*.']]
},
Energetic: {
  p: ['feel ~', 'very ~', 'an ~ start', '~ music', 'full of {energy}'],
  g: [['energetic enough to + verb', 'I feel ~ enough [to] run.', 'for|that'],
      ['feel energetic after + noun', 'I feel ~ [after] a good sleep.', 'since|until'],
      ['full of energy', 'She’s full [of] {energy} today.', 'with|by'],
      ['energetic in the morning', 'I feel most ~ [in] the morning.', 'at|on'],
      ['have the energy to + verb', 'I have the {energy} [to] finish.', 'for|of']],
  i: [['full of beans', 'full of energy', 'The children are *full of beans* this morning.'],
      ['bright-eyed and bushy-tailed', 'fresh, lively and ready', 'She came in *bright-eyed and bushy-tailed*.'],
      ['firing on all cylinders', 'working with full energy', 'Today I’m *firing on all cylinders*.']]
},

/* --------------------------------------------------------------- HAPPY */
Happy: {
  p: ['feel ~', 'really ~', 'perfectly ~', '~ ending', 'make someone ~'],
  g: [['happy about + noun', 'I’m ~ [about] my result.', 'on|to'],
      ['happy for + person', 'I’m so ~ [for] you!', 'to|at'],
      ['happy to + verb', 'I’m ~ [to] help.', 'for|of'],
      ['happy with + noun', 'Are you ~ [with] your new phone?', 'of|by'],
      ['make + someone + happy', 'Music [makes] me ~.', 'does|lets']],
  i: [['over the moon', 'extremely happy', 'I was *over the moon* when I passed.'],
      ['on cloud nine', 'very happy', 'She’s been *on cloud nine* all week.'],
      ['grinning from ear to ear', 'smiling a very big smile', 'He came in *grinning from ear to ear*.']]
},
Joyful: {
  p: ['a ~ day', '~ music', '~ occasion', 'feel ~', 'a ~ reunion'],
  g: [['joyful about + noun', 'Everyone was ~ [about] the wedding.', 'on|to'],
      ['a joyful + noun', 'It was a ~ [occasion].', 'occasional|occasionally'],
      ['joyful to + verb', 'We were ~ [to] be together again.', 'for|of'],
      ['full of joy', 'The house was full [of] {joy}.', 'with|by'],
      ['jump for joy', 'The children jumped [for] {joy}.', 'to|of']],
  i: [['jump for joy', 'be so happy you want to jump', 'I could have *jumped for joy*.'],
      ['walking on air', 'feeling very happy and light', 'After the good news I was *walking on air*.'],
      ['a ray of sunshine', 'a person or thing that makes you happy', 'My little niece is *a ray of sunshine*.']]
},
Liberated: {
  p: ['feel ~', 'totally ~', '~ from fear', 'a ~ feeling', 'a sense of {liberation}'],
  g: [['liberated from + noun', 'I feel ~ [from] my old habits.', 'of|by'],
      ['feel liberated after + noun', 'I felt ~ [after] the exams.', 'since|until'],
      ['feel liberated when + clause', 'I feel ~ [when] I speak honestly.', 'what|which'],
      ['a liberating + noun', 'It was a {liberating} [experience].', 'experienced|experiencing'],
      ['liberated by + noun', 'I felt ~ [by] the good news.', 'to|at']],
  i: [['a weight off my shoulders', 'a worry that has gone away', 'Finishing the essay was *a weight off my shoulders*.'],
      ['free as a bird', 'completely free', 'On holiday I feel *free as a bird*.'],
      ['breathe again', 'feel relaxed after pressure', 'After the exam I could finally *breathe again*.']]
},
Ecstatic: {
  p: ['absolutely ~', 'an ~ crowd', 'feel ~', '~ fans', '~ reaction'],
  g: [['ecstatic about + noun', 'She was ~ [about] the news.', 'on|to'],
      ['ecstatic that + clause', 'We were ~ [that] he came home.', 'what|which'],
      ['ecstatic at + noun', 'Fans were ~ [at] the win.', 'on|to'],
      ['ecstatic to + verb', 'I was ~ [to] see her.', 'for|of'],
      ['absolutely ecstatic', 'I’m [absolutely] ~!', 'fully|highly']],
  i: [['on top of the world', 'extremely happy', 'After the wedding we felt *on top of the world*.'],
      ['in seventh heaven', 'extremely happy', 'He’s *in seventh heaven* with his new job.'],
      ['thrilled to bits', 'very, very pleased', 'I was *thrilled to bits* with the present.']]
},
Proud: {
  p: ['feel ~', 'so ~', 'justly ~', 'a ~ moment', 'make someone ~'],
  g: [['proud of + person/noun', 'I’m ~ [of] you.', 'on|at'],
      ['proud to + verb', 'I’m ~ [to] be your teacher.', 'for|of'],
      ['proud that + clause', 'She was ~ [that] she finished.', 'what|which'],
      ['take pride in + noun', 'He takes {pride} [in] his work.', 'on|at'],
      ['make + someone + proud', 'You [make] me so ~.', 'do|let']],
  i: [['as proud as a peacock', 'very proud', 'He walked in *as proud as a peacock*.'],
      ['a feather in my cap', 'an achievement to be proud of', 'Winning the debate was *a feather in my cap*.'],
      ['hold my head high', 'feel proud and not ashamed', 'I can *hold my head high*.']]
},
Confident: {
  p: ['feel ~', 'quietly ~', 'fairly ~', 'a ~ speaker', 'build {confidence}'],
  g: [['confident about + noun', 'I feel ~ [about] the test.', 'on|to'],
      ['confident in + noun', 'She is ~ [in] her English.', 'at|on'],
      ['confident that + clause', 'I’m ~ [that] we will win.', 'what|which'],
      ['confident enough to + verb', 'He was ~ enough [to] ask.', 'for|that'],
      ['feel confident when + clause', 'I feel ~ [when] I prepare well.', 'what|which']],
  i: [['full of beans', 'lively and sure of yourself', 'After the practice she was *full of beans*.'],
      ['in my element', 'doing something I am good at and enjoy', 'On the football pitch I’m *in my element*.'],
      ['know it like the back of my hand', 'know something very well', 'I *know this topic like the back of my hand*.']]
},
Important: {
  p: ['feel ~', 'really ~', 'make someone feel ~', 'an ~ role', 'play an ~ part'],
  g: [['important to + person', 'You are ~ [to] me.', 'at|on'],
      ['feel important when + clause', 'I feel ~ [when] people listen to me.', 'what|which'],
      ['make + someone + feel important', 'Good teachers [make] you feel ~.', 'do|get'],
      ['it is important to + verb', 'It’s ~ [to] rest.', 'for|of'],
      ['important for + noun', 'Sleep is ~ [for] your health.', 'of|at']],
  i: [['have a voice', 'be able to give your opinion and be heard', 'At last I *have a voice* in the meeting.'],
      ['count for something', 'be valued and matter', 'My ideas *count for something* here.'],
      ['make a difference', 'have a good effect', 'I want to *make a difference*.']]
},
Optimistic: {
  p: ['feel ~', 'quietly ~', 'cautiously ~', 'an ~ view', 'remain ~'],
  g: [['optimistic about + noun', 'I’m ~ [about] the future.', 'on|to'],
      ['optimistic that + clause', 'We are ~ [that] it will work.', 'what|which'],
      ['stay optimistic', 'Try to [stay] ~.', 'do|make'],
      ['cautiously optimistic', 'The doctor is [cautiously] ~.', 'careful|cautious'],
      ['an optimistic + noun', 'She has an ~ [outlook].', 'outside|outlooking']],
  i: [['look on the bright side', 'see the good part of a bad situation', 'Let’s *look on the bright side*.'],
      ['every cloud has a silver lining', 'something good comes from every bad thing', '*Every cloud has a silver lining*.'],
      ['see the glass half full', 'expect good things', 'She always *sees the glass half full*.']]
},
Open: {
  p: ['feel ~', '~ to new ideas', 'an ~ mind', 'be ~ with someone', 'completely ~'],
  g: [['open to + noun', 'I’m ~ [to] suggestions.', 'for|at'],
      ['open with + person', 'Be ~ [with] your friends.', 'of|by'],
      ['open about + noun', 'He is ~ [about] his feelings.', 'on|at'],
      ['keep an open mind', 'Try to [keep] an ~ mind.', 'do|stay'],
      ['feel open when + clause', 'I feel ~ [when] I trust people.', 'what|which']],
  i: [['wear my heart on my sleeve', 'show my feelings openly', 'I *wear my heart on my sleeve*.'],
      ['an open book', 'a person who hides nothing', 'She’s *an open book*.'],
      ['all ears', 'ready to listen carefully', 'Tell me — I’m *all ears*.']]
},
Inspired: {
  p: ['feel ~', 'deeply ~', '~ by her story', 'truly ~', 'an ~ idea'],
  g: [['inspired by + noun', 'I was ~ [by] her speech.', 'from|with'],
      ['inspired to + verb', 'I feel ~ [to] write.', 'for|of'],
      ['feel inspired when + clause', 'I feel ~ [when] I read good books.', 'what|which'],
      ['a source of inspiration', 'She is a source [of] {inspiration}.', 'for|from'],
      ['inspire + someone + to + verb', 'He {inspired} me [to] try again.', 'for|of']],
  i: [['a light bulb moment', 'a moment when you suddenly have an idea', 'Reading that was *a light bulb moment*.'],
      ['fired up', 'full of energy and ready to act', 'After the talk I was *fired up*.'],
      ['light a fire under me', 'make me want to act', 'Her story *lit a fire under me*.']]
},
Peaceful: {
  p: ['feel ~', 'quiet and ~', 'a ~ place', 'a ~ morning', '~ sleep'],
  g: [['peaceful after + noun', 'I feel ~ [after] prayer.', 'since|until'],
      ['feel peaceful when + clause', 'I feel ~ [when] I walk by the river.', 'what|which'],
      ['at peace with + noun', 'I’m at {peace} [with] my decision.', 'of|by'],
      ['in peace', 'Let me eat [in] {peace}.', 'on|at'],
      ['a peaceful + noun', 'It was a ~ [evening].', 'evenly|evens']],
  i: [['at peace with the world', 'calm and happy with everything', 'Sitting by the river, I feel *at peace with the world*.'],
      ['cool, calm and collected', 'relaxed and in control', 'She stayed *cool, calm and collected*.'],
      ['peace of mind', 'a feeling of being calm and safe', 'Saving money gives me *peace of mind*.']]
},
Hopeful: {
  p: ['feel ~', 'quietly ~', 'still ~', 'a ~ sign', 'remain ~'],
  g: [['hopeful about + noun', 'I’m ~ [about] the interview.', 'on|to'],
      ['hopeful that + clause', 'We’re ~ [that] she will recover.', 'what|which'],
      ['hopeful of + -ing', 'He is ~ [of] winning.', 'at|to'],
      ['stay hopeful', 'Try to [stay] ~.', 'do|make'],
      ['a hopeful + noun', 'That’s a ~ [sign].', 'signal|signing']],
  i: [['a light at the end of the tunnel', 'a sign that a hard time will end', 'At last there is *a light at the end of the tunnel*.'],
      ['things are looking up', 'the situation is getting better', '*Things are looking up* this month.'],
      ['keep my fingers crossed', 'hope that something will happen', 'I’m *keeping my fingers crossed* for the result.']]
},
Loving: {
  p: ['a ~ family', '~ care', 'feel ~', 'a ~ home', 'warm and ~'],
  g: [['loving towards + person', 'She is ~ [towards] her students.', 'onto|into'],
      ['a loving + noun', 'He grew up in a ~ [home].', 'homely|homing'],
      ['with love', 'I made it [with] {love}.', 'of|by'],
      ['feel loving when + clause', 'I feel ~ [when] my family is together.', 'what|which'],
      ['love to + verb', 'I {love} [to] cook for my family.', 'for|of']],
  i: [['the apple of my eye', 'a person I love very much', 'My grandson is *the apple of my eye*.'],
      ['have a soft spot for', 'feel special love for someone', 'I *have a soft spot for* my little brother.'],
      ['head over heels', 'very much in love', 'They are *head over heels* in love.']]
},

/* ------------------------------------------------------------- DISGUST */
Disgust: {
  p: ['feel ~', 'in ~', 'a look of ~', 'total ~', 'fill someone with ~'],
  g: [['disgust at + noun', 'I felt ~ [at] the dirty kitchen.', 'on|to'],
      ['in disgust', 'She turned away [in] ~.', 'on|at'],
      ['to my disgust', '[To] my ~, he spat on the floor.', 'For|At'],
      ['disgusted by + noun', 'I was {disgusted} [by] the smell.', 'from|with'],
      ['disgusted with + person', 'I’m {disgusted} [with] myself.', 'of|on']],
  i: [['turn my stomach', 'make me feel sick', 'The smell *turned my stomach*.'],
      ['make me sick', 'make me feel disgusted or angry', 'Cruelty to animals *makes me sick*.'],
      ['leave a bad taste in my mouth', 'leave an unpleasant feeling', 'The argument *left a bad taste in my mouth*.']]
},
Avoidance: {
  p: ['~ of conflict', '{avoid} the topic', 'complete ~', 'a pattern of ~', '~ behaviour'],
  g: [['avoidance of + noun', 'His ~ [of] conflict is a problem.', 'for|about'],
      ['avoid + -ing', 'I {avoid} [talking] about it.', 'to talk|talk'],
      ['avoid + noun + at all costs', 'She {avoids} the subject [at] all costs.', 'in|on'],
      ['go out of my way to avoid', 'I go out of my way [to] {avoid} him.', 'for|of'],
      ['a form of avoidance', 'Checking your phone can be a form [of] ~.', 'for|to']],
  i: [['bury my head in the sand', 'refuse to look at a problem', 'I *buried my head in the sand* about my bills.'],
      ['give it a wide berth', 'stay far away from it', 'I *give that shop a wide berth*.'],
      ['dance around the issue', 'avoid talking directly about a problem', 'We keep *dancing around the issue*.']]
},
Hesitant: {
  p: ['feel ~', 'a bit ~', '~ steps', 'a ~ smile', 'slightly ~'],
  g: [['hesitant to + verb', 'I’m ~ [to] ask.', 'for|of'],
      ['hesitant about + -ing', 'She was ~ [about] joining.', 'on|to'],
      ['a hesitant + noun', 'He gave a ~ [smile].', 'smiling|smiled'],
      ['without hesitation', 'She said yes [without] {hesitation}.', 'within|except'],
      ['hesitate to + verb', 'Don’t {hesitate} [to] call me.', 'for|of']],
  i: [['get cold feet', 'suddenly feel afraid to do something', 'He *got cold feet* before the interview.'],
      ['in two minds', 'unable to decide', 'I’m *in two minds* about the job.'],
      ['drag my feet', 'do something slowly because I don’t want to', 'I’m *dragging my feet* on this essay.']]
},
Aversion: {
  p: ['a strong ~', 'a natural ~', 'have an ~', 'a deep ~', 'feel an ~'],
  g: [['aversion to + noun', 'I have an ~ [to] crowds.', 'for|of'],
      ['aversion to + -ing', 'She has an ~ [to] flying.', 'for|of'],
      ['a strong aversion', 'He has a [strong] ~ to spiders.', 'hard|heavy'],
      ['feel an aversion', 'I [feel] an ~ to loud places.', 'do|make'],
      ['develop an aversion', 'She [developed] an ~ to meat.', 'made|did']],
  i: [['not my cup of tea', 'not something I like', 'Horror films are *not my cup of tea*.'],
      ['can’t stand', 'strongly dislike', 'I *can’t stand* the smell of smoke.'],
      ['wouldn’t touch it with a ten-foot pole', 'will not go near it at all', 'I *wouldn’t touch that with a ten-foot pole*.']]
},
Disapproval: {
  p: ['show ~', 'strong ~', 'a look of ~', 'shake your head in ~', 'express ~'],
  g: [['disapproval of + noun', 'She showed her ~ [of] the plan.', 'for|about'],
      ['in disapproval', 'He shook his head [in] ~.', 'on|at'],
      ['disapprove of + noun', 'My parents {disapprove} [of] late nights.', 'about|on'],
      ['a look of disapproval', 'She gave me a look [of] ~.', 'for|about'],
      ['with disapproval', 'The teacher looked [with] ~.', 'of|by']],
  i: [['frown on something', 'disapprove of something', 'My family *frowns on* eating in the street.'],
      ['take a dim view of', 'not approve of', 'The school *takes a dim view of* phones in class.'],
      ['thumbs down', 'a sign of disapproval', 'The plan got a *thumbs down* from everyone.']]
},
Judgmental: {
  p: ['feel ~', 'very ~', 'too ~', '~ comments', 'a ~ look'],
  g: [['judgmental about + noun', 'Don’t be ~ [about] her clothes.', 'on|to'],
      ['judgmental of + person', 'He is ~ [of] others.', 'for|to'],
      ['judgmental towards + person', 'People were ~ [towards] him.', 'onto|into'],
      ['judge + someone + by + noun', 'Don’t {judge} people [by] their accent.', 'from|with'],
      ['without judgment', 'Listen [without] {judgment}.', 'within|except']],
  i: [['judge a book by its cover', 'judge someone only by how they look', 'Don’t *judge a book by its cover*.'],
      ['look down my nose at', 'think I am better than someone', 'I don’t want to *look down my nose at* anyone.'],
      ['point the finger', 'blame someone', 'It’s easy to *point the finger*.']]
},
Loathing: {
  p: ['deep ~', 'self-~', 'feel ~', 'utter ~', 'fear and ~'],
  g: [['loathing for + noun', 'She felt ~ [for] his cruelty.', 'to|at'],
      ['loathing of + noun', 'I have a ~ [of] lies.', 'to|at'],
      ['with loathing', 'He looked at it [with] ~.', 'of|by'],
      ['loathe + -ing', 'I {loathe} [waiting] in queues.', 'wait|waited'],
      ['full of loathing', 'His voice was full [of] ~.', 'with|by']],
  i: [['can’t bear the sight of', 'hate seeing someone or something', 'I *can’t bear the sight of* that place now.'],
      ['make my blood boil', 'make me very angry', 'His lies *make my blood boil*.'],
      ['hate with a passion', 'hate very strongly', 'I *hate* cheating *with a passion*.']]
},
Awful: {
  p: ['feel ~', 'look ~', 'absolutely ~', 'an ~ day', 'something ~'],
  g: [['feel awful about + noun', 'I feel ~ [about] what I said.', 'on|to'],
      ['awful for + person', 'It was ~ [for] everyone.', 'at|on'],
      ['feel awful that + clause', 'I feel ~ [that] I forgot.', 'what|which'],
      ['an awful + noun', 'We had an ~ [time].', 'timing|timely'],
      ['look awful', 'You [look] ~ — are you ill?', 'see|watch']],
  i: [['feel like death warmed up', 'feel very ill or tired', 'I *feel like death warmed up* this morning.'],
      ['under the weather', 'a little ill', 'I’m a bit *under the weather*.'],
      ['have a sinking feeling', 'feel something bad is happening', 'I *had a sinking feeling* in my stomach.']]
},
Revulsion: {
  p: ['feel ~', 'a wave of ~', 'deep ~', 'in ~', 'a sense of ~'],
  g: [['revulsion at + noun', 'I felt ~ [at] the violence.', 'on|to'],
      ['in revulsion', 'She pulled back [in] ~.', 'on|at'],
      ['revulsion for + noun', 'He has a ~ [for] cruelty.', 'on|by'],
      ['a wave of revulsion', 'A wave [of] ~ hit me.', 'for|with'],
      ['with revulsion', 'She looked [with] ~ at the rubbish.', 'of|by']],
  i: [['make my skin crawl', 'make me feel disgusted and uneasy', 'The video *made my skin crawl*.'],
      ['turn my stomach', 'make me feel sick', 'That smell *turns my stomach*.'],
      ['sick to my stomach', 'feeling very disgusted', 'I felt *sick to my stomach*.']]
},
Detestable: {
  p: ['utterly ~', 'a ~ act', 'find something ~', 'truly ~', '~ behaviour'],
  g: [['find + noun + detestable', 'I [find] cruelty ~.', 'see|think'],
      ['detestable to + person', 'Lying is ~ [to] me.', 'for|at'],
      ['a detestable + noun', 'That was a ~ [thing] to do.', 'thinking|thingy'],
      ['detest + -ing', 'I {detest} [being] late.', 'be|been'],
      ['detestable in + noun', 'There is something ~ [in] his words.', 'at|on']],
  i: [['beyond the pale', 'completely unacceptable', 'His comment was *beyond the pale*.'],
      ['a low blow', 'an unfair and cruel action', 'Laughing at her was *a low blow*.'],
      ['have no time for', 'dislike and not accept', 'I *have no time for* bullies.']]
},
Disappointed: {
  p: ['feel ~', 'bitterly ~', 'a bit ~', 'deeply ~', 'look ~'],
  g: [['disappointed with + noun', 'I’m ~ [with] my score.', 'of|on'],
      ['disappointed in + person', 'I’m ~ [in] you.', 'on|to'],
      ['disappointed that + clause', 'She was ~ [that] he didn’t come.', 'what|which'],
      ['disappointed to + verb', 'We were ~ [to] miss the bus.', 'for|of'],
      ['disappointed about + noun', 'He was ~ [about] the result.', 'on|to']],
  i: [['let down', 'disappointed by someone', 'I felt *let down* by my friend.'],
      ['a letdown', 'something disappointing', 'The film was *a letdown*.'],
      ['my heart sank', 'I suddenly felt disappointed', '*My heart sank* when I saw the rain.']]
},
Revolted: {
  p: ['feel ~', 'utterly ~', 'completely ~', '~ by the smell', 'be ~ at'],
  g: [['revolted by + noun', 'I was ~ [by] the dirty toilet.', 'from|with'],
      ['revolted at + noun', 'We were ~ [at] the sight.', 'on|to'],
      ['feel revolted when + clause', 'I feel ~ [when] I see cruelty.', 'what|which'],
      ['a revolting + noun', 'What a {revolting} [smell]!', 'smelly|smelled'],
      ['absolutely revolted', 'I was [absolutely] ~.', 'fully|highly']],
  i: [['make me want to throw up', 'make me feel sick', 'That food *makes me want to throw up*.'],
      ['gross me out', 'make me feel disgusted', 'Insects *gross me out*.'],
      ['turn my stomach', 'make me feel sick', 'The rotten fish *turned my stomach*.']]
},
Repugnant: {
  p: ['morally ~', 'utterly ~', 'find something ~', 'a ~ idea', 'deeply ~'],
  g: [['repugnant to + person', 'The idea is ~ [to] me.', 'for|at'],
      ['find + noun + repugnant', 'I [find] racism ~.', 'see|think'],
      ['a repugnant + noun', 'It was a ~ [idea].', 'ideal|idea’s'],
      ['morally repugnant', 'Cheating is [morally] ~.', 'moral|morals'],
      ['repugnant in + noun', 'There is something ~ [in] his tone.', 'at|on']],
  i: [['beyond the pale', 'completely unacceptable', 'That joke was *beyond the pale*.'],
      ['go against the grain', 'go against what I believe is right', 'Lying *goes against the grain* for me.'],
      ['stick in my throat', 'be hard to accept', 'His apology *stuck in my throat*.']]
},

/* ----------------------------------------------------------------- SAD */
Sad: {
  p: ['feel ~', 'a bit ~', 'really ~', 'a ~ story', 'make someone ~'],
  g: [['sad about + noun', 'I’m ~ [about] leaving.', 'on|to'],
      ['sad to + verb', 'I was ~ [to] hear the news.', 'for|of'],
      ['sad that + clause', 'I’m ~ [that] you’re going.', 'what|which'],
      ['make + someone + sad', 'Rain [makes] me ~.', 'does|lets'],
      ['feel sad when + clause', 'I feel ~ [when] I’m far from home.', 'what|which']],
  i: [['feel blue', 'feel sad', 'I’ve been *feeling blue* all week.'],
      ['down in the dumps', 'sad and without energy', 'He’s a bit *down in the dumps*.'],
      ['a heavy heart', 'a feeling of sadness', 'I left with *a heavy heart*.']]
},
Bored: {
  p: ['feel ~', 'really ~', '~ to death', 'get ~', 'look ~'],
  g: [['bored with + noun', 'I’m ~ [with] this game.', 'at|on'],
      ['bored of + noun', 'I’m ~ [of] waiting.', 'for|to'],
      ['get bored', 'Children [get] ~ quickly.', 'make|do'],
      ['bored stiff', 'I was ~ [stiff] in the meeting.', 'strong|hard'],
      ['so bored that + clause', 'I was so ~ [that] I fell asleep.', 'what|which']],
  i: [['bored to tears', 'extremely bored', 'I was *bored to tears* in that lecture.'],
      ['watching paint dry', 'very boring', 'This film is like *watching paint dry*.'],
      ['twiddling my thumbs', 'waiting with nothing to do', 'I sat there *twiddling my thumbs*.']]
},
Indifferent: {
  p: ['feel ~', 'totally ~', 'seem ~', 'an ~ shrug', 'remain ~'],
  g: [['indifferent to + noun', 'He is ~ [to] fashion.', 'for|at'],
      ['indifferent towards + person', 'She seemed ~ [towards] me.', 'onto|into'],
      ['with indifference', 'He shrugged [with] {indifference}.', 'of|by'],
      ['remain indifferent', 'Nobody can [remain] ~.', 'do|make'],
      ['indifferent about + noun', 'I’m ~ [about] the result.', 'on|at']],
  i: [['couldn’t care less', 'not care at all', 'I *couldn’t care less* about football.'],
      ['it’s all the same to me', 'I don’t mind which one', '*It’s all the same to me*.'],
      ['shrug it off', 'show you don’t care', 'He just *shrugged it off*.']]
},
Apathetic: {
  p: ['feel ~', 'become ~', 'completely ~', '~ voters', 'grow ~'],
  g: [['apathetic about + noun', 'I feel ~ [about] my studies.', 'on|to'],
      ['apathetic towards + noun', 'Students grew ~ [towards] the project.', 'onto|into'],
      ['become apathetic', 'He [became] ~ after the failure.', 'made|did'],
      ['apathetic after + noun', 'I felt ~ [after] months of stress.', 'since|until'],
      ['a sense of apathy', 'There was a sense [of] {apathy}.', 'for|with']],
  i: [['go through the motions', 'do something without real interest', 'I’m just *going through the motions*.'],
      ['can’t be bothered', 'too uninterested to do something', 'I *can’t be bothered* to cook tonight.'],
      ['the spark has gone', 'the energy or interest is lost', '*The spark has gone* from my work.']]
},
Lonely: {
  p: ['feel ~', 'very ~', 'a bit ~', 'a ~ place', 'get ~'],
  g: [['lonely without + person', 'I feel ~ [without] my family.', 'within|except'],
      ['feel lonely when + clause', 'I feel ~ [when] everyone is busy.', 'what|which'],
      ['lonely in + place', 'I was ~ [in] the new city.', 'at|on'],
      ['lonely at + time', 'I get ~ [at] night.', 'on|in'],
      ['a lonely + noun', 'It was a ~ [life].', 'live|lively']],
  i: [['on my own', 'alone', 'I spent the holiday *on my own*.'],
      ['all by myself', 'completely alone', 'I ate dinner *all by myself*.'],
      ['a lone wolf', 'someone who spends time alone', 'At university I was *a lone wolf*.']]
},
Isolated: {
  p: ['feel ~', 'completely ~', 'socially ~', 'an ~ village', 'become ~'],
  g: [['isolated from + noun', 'I feel ~ [from] my friends.', 'of|to'],
      ['feel isolated in + place', 'She felt ~ [in] the new job.', 'at|on'],
      ['become isolated', 'Old people can [become] ~.', 'make|do'],
      ['isolated by + noun', 'We were ~ [by] the floods.', 'at|to'],
      ['a sense of isolation', 'There’s a sense [of] {isolation}.', 'for|with']],
  i: [['cut off', 'separated from other people', 'In the village we feel *cut off*.'],
      ['left to my own devices', 'left alone without help', 'I was *left to my own devices*.'],
      ['an island', 'a person alone and separate', 'I feel like *an island*.']]
},
Abandoned: {
  p: ['feel ~', 'totally ~', '~ by friends', 'an ~ house', 'leave someone feeling ~'],
  g: [['abandoned by + person', 'I felt ~ [by] my friends.', 'from|with'],
      ['feel abandoned when + clause', 'I feel ~ [when] nobody calls.', 'what|which'],
      ['leave + someone + feeling abandoned', 'It [left] me feeling ~.', 'let|took'],
      ['a feeling of abandonment', 'She had a feeling [of] {abandonment}.', 'for|with'],
      ['abandoned in + place', 'The dog was ~ [in] the street.', 'to|of']],
  i: [['left high and dry', 'left alone without help', 'They *left me high and dry*.'],
      ['left out in the cold', 'not included or cared for', 'I felt *left out in the cold*.'],
      ['on my own', 'alone without help', 'Suddenly I was *on my own*.']]
},
Despair: {
  p: ['in ~', 'feel ~', 'deep ~', 'a sense of ~', 'drive someone to ~'],
  g: [['in despair', 'She cried [in] ~.', 'on|at'],
      ['despair at + noun', 'I felt ~ [at] the news.', 'on|to'],
      ['despair of + -ing', 'I {despair} [of] ever finding a job.', 'for|to'],
      ['a sense of despair', 'There was a sense [of] ~.', 'for|with'],
      ['drive + someone + to despair', 'The noise drove me [to] ~.', 'for|at']],
  i: [['at the end of my rope', 'having no more patience or strength', 'I’m *at the end of my rope*.'],
      ['lose all hope', 'stop believing things will get better', 'Don’t *lose all hope*.'],
      ['hit rock bottom', 'reach the worst point', 'Last year I *hit rock bottom*.']]
},
Vulnerable: {
  p: ['feel ~', 'emotionally ~', 'very ~', 'a ~ moment', 'leave someone ~'],
  g: [['vulnerable to + noun', 'Children are ~ [to] illness.', 'for|at'],
      ['feel vulnerable when + clause', 'I feel ~ [when] I share my feelings.', 'what|which'],
      ['leave + someone + vulnerable', 'Being alone [left] me ~.', 'let|took'],
      ['vulnerable in + noun', 'I felt ~ [in] that situation.', 'at|on'],
      ['a vulnerable + noun', 'It was a ~ [moment].', 'momentary|momentous']],
  i: [['wear my heart on my sleeve', 'show my feelings openly', 'I *wear my heart on my sleeve*.'],
      ['an open wound', 'a pain that is still fresh', 'The loss is still *an open wound*.'],
      ['let my guard down', 'stop protecting myself', 'I finally *let my guard down*.']]
},
Powerless: {
  p: ['feel ~', 'completely ~', '~ to help', 'feel ~ against', 'a sense of being ~'],
  g: [['powerless to + verb', 'I felt ~ [to] help.', 'for|of'],
      ['powerless against + noun', 'We are ~ [against] the storm.', 'again|opposite'],
      ['feel powerless when + clause', 'I feel ~ [when] I can’t change things.', 'what|which'],
      ['powerless in + noun', 'She felt ~ [in] the meeting.', 'to|of'],
      ['a feeling of powerlessness', 'I had a feeling [of] {powerlessness}.', 'for|with']],
  i: [['my hands are tied', 'I cannot do anything to help', 'I want to help, but *my hands are tied*.'],
      ['out of my hands', 'not in my control', 'The decision is *out of my hands*.'],
      ['at the mercy of', 'controlled by something you can’t stop', 'We were *at the mercy of* the weather.']]
},
Guilty: {
  p: ['feel ~', 'really ~', 'a bit ~', 'a ~ conscience', 'make someone feel ~'],
  g: [['guilty about + noun/-ing', 'I feel ~ [about] lying.', 'on|to'],
      ['guilty for + -ing', 'She felt ~ [for] leaving early.', 'to|at'],
      ['feel guilty when + clause', 'I feel ~ [when] I waste food.', 'what|which'],
      ['make + someone + feel guilty', 'Don’t [make] me feel ~.', 'do|get'],
      ['a guilty + noun', 'I have a ~ [conscience].', 'conscious|consciously']],
  i: [['a guilty conscience', 'a feeling that you did something wrong', 'I couldn’t sleep with *a guilty conscience*.'],
      ['weigh on my mind', 'make me worry', 'What I said *weighs on my mind*.'],
      ['eat me up inside', 'make me feel very guilty', 'The lie *ate me up inside*.']]
},
Ashamed: {
  p: ['feel ~', 'deeply ~', 'so ~', 'a bit ~', 'nothing to be ~ of'],
  g: [['ashamed of + noun', 'I’m ~ [of] my mistake.', 'on|to'],
      ['ashamed to + verb', 'I was ~ [to] ask for help.', 'for|that'],
      ['ashamed that + clause', 'She was ~ [that] she lied.', 'what|which'],
      ['nothing to be ashamed of', 'There’s nothing to be ~ [of].', 'for|at'],
      ['too ashamed to + verb', 'He was too ~ [to] tell anyone.', 'for|that']],
  i: [['hang my head', 'look down because I am ashamed', 'I *hung my head* when the teacher looked at me.'],
      ['lose face', 'lose respect from others', 'Nobody wants to *lose face* in front of friends.'],
      ['want the ground to swallow me up', 'feel so ashamed you want to disappear', 'I *wanted the ground to swallow me up*.']]
},
Remorseful: {
  p: ['feel ~', 'deeply ~', 'truly ~', 'a ~ apology', 'full of {remorse}'],
  g: [['remorseful about + noun', 'He was ~ [about] the accident.', 'on|to'],
      ['remorseful for + -ing', 'She felt ~ [for] shouting.', 'to|at'],
      ['feel remorse for + noun', 'He felt {remorse} [for] his words.', 'to|at'],
      ['full of remorse', 'He was full [of] {remorse}.', 'with|by'],
      ['without remorse', 'He lied [without] {remorse}.', 'within|except']],
  i: [['kick myself', 'feel angry at myself for a mistake', 'I could *kick myself* for forgetting.'],
      ['if only I could turn back the clock', 'I wish I could change the past', '*If only I could turn back the clock*.'],
      ['eat humble pie', 'say sorry and admit I was wrong', 'I had to *eat humble pie* and apologise.']]
}
};
