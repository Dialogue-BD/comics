# Syllable / stress spec for every clip.
# text: syllables joined by '·'. levels: one digit per syllable —
#   2 = primary stress (big beat), 1 = full but unstressed (or secondary), 0 = reduced (schwa-like).
# say: optional respelling for the synthetic aligner (non-words).
WORDS = {
 # word decoder
 'dec-me':('me','2'), 'dec-go':('go','2'), 'dec-baby':('ba·by','21'), 'dec-cat':('cat','2'), 'dec-bed':('bed','2'),
 'dec-sunset':('sun·set','21'), 'dec-hoping':('ho·ping','21'), 'dec-hopping':('hop·ping','21'),
 'dec-information':('in·for·ma·tion','1020'), 'dec-decision':('de·ci·sion','020'),
 'dec-photographic':('pho·to·graph·ic','1020'), 'dec-photograph':('pho·to·graph','201'),
 'dec-ability':('a·bil·i·ty','0201'), 'dec-famous':('fa·mous','20'),
 # prefixes and stress-neutral endings (October 2026 recordings)
 'dec-happy':('hap·py','20'), 'dec-unhappy':('un·hap·py','120'), 'dec-agree':('a·gree','02'),
 'dec-disagree':('dis·a·gree','102'), 'dec-rewrite':('re·write','12'), 'dec-happiness':('hap·pi·ness','200'),
 'dec-quickly':('quick·ly','20'), 'dec-transport':('trans·port','21'), 'dec-interrupt':('in·ter·rupt','102'),
 # November 2026 (ElevenLabs, eleven_tts.sh): a third member of the photograph family, and
 # two more words for each ending that points to the beat
 'dec-photographer':('pho·tog·ra·pher','0200'),
 'dec-education':('ed·u·ca·tion','1020'), 'dec-conversation':('con·ver·sa·tion','1020'),
 'dec-discussion':('dis·cus·sion','020'), 'dec-permission':('per·mis·sion','020'),
 'dec-economic':('e·co·nom·ic','1020'), 'dec-scientific':('sci·en·tif·ic','1020'),
 'dec-university':('u·ni·ver·si·ty','10200'), 'dec-electricity':('e·lec·tric·i·ty','11200'),
 'dec-enormous':('e·nor·mous','020'), 'dec-delicious':('de·li·cious','020'),
 # vowels
 'vow-team':('team','2'),'vow-tim':('Tim','2'),'vow-fool':('fool','2'),'vow-full':('full','2'),'vow-beat':('beat','2'),
 'vow-bit':('bit','2'),'vow-pool':('pool','2'),'vow-pull':('pull','2'),
 'vow-about':('a·bout','02'),'vow-sofa':('so·fa','20'),'vow-supply':('sup·ply','02'),
 'vow-banana':('ba·na·na','020'), 'vow-today':('to·day','02'), 'vow-problem':('prob·lem','20'),
 # consonants
 'con-fan':('fan','2'),'con-van':('van','2'),'con-safe':('safe','2'),'con-save':('save','2'),'con-sip':('sip','2'),'con-zip':('zip','2'),
 'con-price':('price','2'),'con-prize':('prize','2'),'con-jew':('Jew','2'),'con-zoo':('zoo','2'),'con-west':('west','2'),'con-best':('best','2'),
 'con-wet':('wet','2'),'con-bet':('bet','2'),'con-earth':('earth','2'),'con-earn':('earn','2'),'con-herd':('herd','2'),'con-hard':('hard','2'),
 'con-pin':('pin','2'),'con-fin':('fin','2'),'con-pat':('pat','2'),'con-fat':('fat','2'),
 # aspiration
 'asp-pin':('pin','2'),'asp-spin':('spin','2'),'asp-top':('top','2'),'asp-stop':('stop','2'),'asp-key':('key','2'),'asp-ski':('ski','2'),
 # clusters
 'clu-school':('school','2'),'clu-eekul':('ee·skool','12'),'clu-street':('street','2'),'clu-sitreet':('si·treet','02'),
 'clu-splash':('splash','2'),'clu-spring':('spring','2'),
 # th
 'th-think':('think','2'),'th-sink':('sink','2'),'th-three':('three','2'),'th-tree':('tree','2'),'th-thank':('thank','2'),
 'th-sank':('sank','2'),'th-this':('this','2'),'th-that':('that','2'),'th-those':('those','2'),
 # Brian's export only: ship / sheep, and the "i-school" vowel Bangla speakers add
 'vow-sheep':('sheep','2'), 'vow-ship':('ship','2'), 'clu-iskul':('i·skul','12'),
 # accent pairs: the same word in each voice's own accent (Alice British, Brian American)
 'acc-car':('car','2'), 'acc-water':('wa·ter','20'), 'acc-dance':('dance','2'),
 'acc-schedule':('sched·ule','20'), 'acc-vitamin':('vi·ta·min','200'), 'acc-tomato':('to·ma·to','020'),
 # ... and two clarity problems for contrast (Brian only): a full vowel for the schwa, an added vowel
 'acc-watar':('wa·tar','21'), 'acc-eschool':('e·school','02'),
}
SAY = {'clu-eekul': 'ee skool', 'clu-sitreet': 'sih treet', 'vow-tim': 'Tim', 'con-jew': 'Jew', 'clu-iskul': 'ih skool', 'acc-watar': 'watar', 'acc-eschool': 'eschool'}

# Sentences. Words are 'syl·syl:levels'. '|' = thought-group boundary (pause).
# '*' marks the tonic (nuclear) word of the group.
SENTENCES = {
 'pro-sent1': 'Af·ter:20 the:0 long:1 *meet·ing:20 | I:1 went:1 straight:1 *home:2 | and:0 slept:1 for:0 *hours:2',
 'pro-flat1': 'Af·ter:20 the:0 long:1 *meet·ing:20 I:1 went:1 straight:1 *home:2 and:0 slept:1 for:0 *hours:2',
 'pro-sent2': 'When:0 I:1 fin·ished:20 my:0 *home·work:21 | I:1 called:1 my:0 *friend:2 | and:0 we:1 played:1 *foot·ball:21',
 'pro-sent3': "Let's:1 *eat:2 | *Grand·ma:21",
 'pro-nopause': "Let's:1 eat:1 *Grand·ma:21",
 'pro-sent4': 'The:0 teach·er:20 who:0 helped:1 me:0 the:0 *most:2 | was:0 my:0 *Eng·lish:20 teach·er:10 | in:0 high:1 *school:2',
 # November 2026 (ElevenLabs): four more thought-group sentences, and two pairs where a pause changes the meaning
 'pro-sent5': "If:0 it:0 rains:1 *to·mor·row:020 | we'll:1 stay:1 at:0 *home:2",
 'pro-sent6': 'I:1 bought:1 *rice:2 | *eggs:2 | *on·ions:20 | and:0 *tea:2',
 'pro-sent7': 'When:0 I:1 ar·rived:02 at:0 the:0 *sta·tion:20 | the:0 train:1 had:0 al·read·y:120 *left:2',
 'pro-sent8': 'My:0 *sis·ter:20 | who:0 lives:1 in:0 *Dha·ka:20 | is:0 a:0 *doc·tor:20',
 'pro-john-comma': "I:1 don't:1 *know:2 | *John:2",
 'pro-john': "I:1 don't:1 know:1 *John:2",
 'pro-teacher-said': 'The:0 teach·er:20 said:1 the:0 stu·dent:20 is:0 *la·zy:20',
 'pro-teacher-comma': 'The:0 *teach·er:20 | said:1 the:0 *stu·dent:20 | is:0 *la·zy:20',
 # compound noun vs adjective + noun (each recording says "a ...")
 # (November 2026: re-recorded inside primer sentences and cut, so the clip is just the words;
 # see tts/compounds.tsv)
 'cmp-blackboard-n': '*black·board:21',
 'cmp-black-board-p': 'black:1 *board:2',
 'cmp-greenhouse-n': '*green·house:21',
 'cmp-green-house-p': 'green:1 *house:2',
 'cmp-hotdog-n': '*hot·dog:21',
 'cmp-hot-dog-p': 'hot:1 *dog:2',
 # noun / verb pairs: the beat tells you which (November 2026, ElevenLabs)
 'nv-record-n': 'a:0 *rec·ord:20', 'nv-record-v': 'to:0 *re·cord:02',
 'nv-present-n': 'a:0 *pres·ent:20', 'nv-present-v': 'to:0 *pre·sent:02',
 'nv-object-n': 'an:0 *ob·ject:20', 'nv-object-v': 'to:0 *ob·ject:02',
 'nv-increase-n': 'an:0 *in·crease:20', 'nv-increase-v': 'to:0 *in·crease:02',
 # linking
 'lnk-go-on': 'Go:1 *on:2',
 'lnk-an-apple': 'an:0 *ap·ple:20',
 'lnk-come-in': 'Come:1 *in:2',
 "lnk-whats-up": "What's:1 *up:2",
 'lnk-pick-it-up': 'Pick:1 it:0 *up:2',
 'lnk-turn-off': 'Turn:1 off:1 the:0 *light:2',
 # linking, November 2026 (ElevenLabs, analysis/eleven_tts.sh)
 'lnk-an-hour': 'an:0 *hour:2',
 'lnk-do-it': '*Do:2 it:0',
 'lnk-i-am': 'I:1 *am:2',
 'lnk-see-it': '*See:2 it:0',
 'lnk-far-away': 'far:1 *a·way:02',
 'lnk-where-is-it': '*Where:2 is:0 it:0',
 'lnk-more-and-more': 'more:1 and:0 *more:2',
 'lnk-bus-stop': '*bus:2 stop:1',
 'lnk-black-coffee': 'black:1 *cof·fee:20',
 'lnk-some-more': 'some:1 *more:2',
 'lnk-come-on-in': 'Come:1 on:1 *in:2',
 'lnk-hold-on': 'Hold:1 on:1 a:0 *min·ute:20',
 'lnk-take-a-seat': 'Take:1 a:0 *seat:2',
 'lnk-come-in-sit-down': 'Come:1 in:1 and:0 sit:1 *down:2',
 'lnk-look-out': 'Look:1 *out:2',
 'lnk-who-is-it': '*Who:2 is:0 it:0',
 'lnk-go-away': 'Go:1 *a·way:02',
 'lnk-stop-it-now': '*Stop:2 it:0 now:1',
 # numbers and dates
 'num-year1994': 'nine·teen:21 nine·ty:10 *four:2',
 'num-year2026': 'twen·ty:20 twen·ty:10 *six:2',
 'num-phone': 'ze·ro:20 one:1 *sev·en:20 | one:1 *two:2 | three:1 four:1 *five:2 | six:1 sev·en:10 *eight:2',
 'num-date-oct12': 'Oc·to·ber:020 *twelfth:2',
 'num-price-14000': 'four·teen:12 thou·sand:20 *ta·ka:20',
 'num-time-530': 'five:1 *thir·ty:20',
}
