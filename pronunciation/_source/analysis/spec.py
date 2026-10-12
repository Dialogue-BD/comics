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
 # vowels
 'vow-team':('team','2'),'vow-tim':('Tim','2'),'vow-fool':('fool','2'),'vow-full':('full','2'),'vow-beat':('beat','2'),
 'vow-bit':('bit','2'),'vow-pool':('pool','2'),'vow-pull':('pull','2'),
 'vow-about':('a·bout','02'),'vow-sofa':('so·fa','20'),'vow-supply':('sup·ply','02'),
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
}
SAY = {'clu-eekul': 'ee skool', 'clu-sitreet': 'sih treet', 'vow-tim': 'Tim', 'con-jew': 'Jew'}

# Sentences. Words are 'syl·syl:levels'. '|' = thought-group boundary (pause).
# '*' marks the tonic (nuclear) word of the group.
SENTENCES = {
 'pro-sent1': 'Af·ter:20 the:0 long:1 *meet·ing:20 | I:1 went:1 straight:1 *home:2 | and:0 slept:1 for:0 *hours:2',
 'pro-flat1': 'Af·ter:20 the:0 long:1 *meet·ing:20 I:1 went:1 straight:1 *home:2 and:0 slept:1 for:0 *hours:2',
 'pro-sent2': 'When:0 I:1 fin·ished:20 my:0 *home·work:21 | I:1 called:1 my:0 *friend:2 | and:0 we:1 played:1 *foot·ball:21',
 'pro-sent3': "Let's:1 *eat:2 | *Grand·ma:21",
 'pro-nopause': "Let's:1 eat:1 *Grand·ma:21",
 'pro-sent4': 'The:0 teach·er:20 who:0 helped:1 me:0 the:0 *most:2 | was:0 my:0 *Eng·lish:20 teach·er:10 | in:0 high:1 *school:2',
 # compound noun vs adjective + noun (each recording says "a ...")
 'cmp-blackboard-n': 'a:0 *black·board:21',
 'cmp-black-board-p': 'a:0 black:1 *board:2',
 'cmp-greenhouse-n': 'a:0 *green·house:21',
 'cmp-green-house-p': 'a:0 green:1 *house:2',
 'cmp-hotdog-n': 'a:0 *hot·dog:21',
 'cmp-hot-dog-p': 'a:0 hot:1 *dog:2',
 # linking
 'lnk-go-on': 'Go:1 *on:2',
 'lnk-an-apple': 'an:0 *ap·ple:20',
 'lnk-come-in': 'Come:1 *in:2',
 "lnk-whats-up": "What's:1 *up:2",
 'lnk-pick-it-up': 'Pick:1 it:0 *up:2',
 'lnk-turn-off': 'Turn:1 off:1 the:0 *light:2',
 # numbers and dates
 'num-year1994': 'nine·teen:21 nine·ty:10 *four:2',
 'num-year2026': 'twen·ty:20 twen·ty:10 *six:2',
 'num-phone': 'ze·ro:20 one:1 *sev·en:20 | one:1 *two:2 | three:1 four:1 *five:2 | six:1 sev·en:10 *eight:2',
 'num-date-oct12': 'Oc·to·ber:020 *twelfth:2',
 'num-price-14000': 'four·teen:12 thou·sand:20 *ta·ka:20',
 'num-time-530': 'five:1 *thir·ty:20',
}
