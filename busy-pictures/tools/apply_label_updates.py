#!/usr/bin/env python3
"""Apply an exported label-suggestion batch and rewrite the seven live tenses.

The viewer reads the inline spatialIndex in index.html, so this updates both
that snapshot and spatial_index.json. Repeated suggestions are resolved by
keeping the newest record for each object. The grammar frames below are
hand-authored from the corrected visual identifications; build_main only
inflects those authored frames across the seven tense prompts.

Usage:
    python3 tools/apply_label_updates.py /path/to/label-suggestions.json
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
BP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from main_tenses import build_main  # noqa: E402


# object_id | subject | bare verb | remainder | plural (0/1)
_FRAME_DATA = r"""
p22_obj_2|The squirrel on the roof|sit|on the playhouse roof|0
p22_obj_7|The painting of a green dragon|hang|on the playroom wall|0
p22_obj_30|The yellow robot toy|lie|on the nursery floor|0
p22_obj_33|The ribbons|hang|on the playroom wall|1
p22_obj_49|The girl with the toy wagon|push|the toy wagon along the path|0
p22_obj_54|The boy in blue shorts|pull|the toy wagon with a rope|0
p22_obj_58|The mail carrier|wave|to the children from beside the wall|0
p22_obj_59|The mail|rest|in the mail carrier's hand|0
p22_obj_60|The boy in green|sit|on one end of the seesaw|0
p22_obj_76|The girl with a scraped knee|hold|her sore knee near the seesaw|0
p22_obj_82|The owl in the tree-trunk knot|peer|out through the knot in the trunk|0
p22_obj_96|The pliers and wrench|lie|beside the other tools|1
p22_obj_102|The chalk art|decorate|part of the pavement|0
p22_obj_103|The chalk palm-tree drawing|decorate|the pavement|0
p22_obj_104|The chalk sun drawing|shine|from the pavement picture|0
p22_obj_105|The blue bucket of chalk|stand|beside the pavement drawings|0
p22_obj_108|The measuring tape|lie|beside the toolbox|0
p22_obj_111|The blue car's rear wheel|turn|on the concrete path|0
p22_obj_112|The blue car's front wheel|turn|on the concrete path|0
p22_obj_117|The chalk sheep drawing|decorate|the pavement|0
p22_obj_118|The rope climbing gym|stand|in the middle of the lawn|0
p22_obj_128|The girl pretending to be a pirate|peer|out from the play tower|0
p22_obj_141|The boy with the pulley|pull|the pulley's rope beside the tower|0
p22_obj_142|The pulley|hang|beside the play tower|0
p22_obj_148|The yellow bouncing ball|bounce|across the grass|0
p22_obj_210|The hedgehogs|scurry|beside the path|1
p21_obj_26|The letter L card with a leaf|show|a green leaf beside the letter|0
p21_obj_94|The male teacher|stick|a sticker onto the window|0
p21_obj_98|The wooden shelf with tissues|hold|boxes of tissues on the wall|0
p21_obj_106|The tray of stamps|sit|in the middle of the table|0
p21_obj_108|The stamped paper|dry|on the tabletop|0
p21_obj_119|The boy|stretch|his arms into the shape of an X|0
p21_obj_120|The girl|raise|her hands into the shape of a Y|0
p21_obj_121|The girl|bend|her body into the shape of a Z|0
p21_obj_125|The queen puppet in a crown|stand|at the end of the shelf|0
p21_obj_141|The painted picture of a microbe|dry|on the classroom floor|0
p21_obj_145|The boy|hop|across the numbered squares|0
p21_obj_175|The Red Riding Hood story picture|show|Red Riding Hood and a wolf|0
p21_obj_178|The final story picture|show|Red Riding Hood riding the wolf|0
p21_obj_195|The boy asking for quiet|hold|a finger to his lips beside his friend|0
p21_obj_196|The boy in the red shirt|listen|to his friend|0
p21_obj_232|The green block in the aquarium|rest|on the bottom of the tank|0
p21_obj_235|The boy|carry|the brick across the classroom|0
p21_obj_236|The brick|rest|in the boy's hands|0
p20_obj_11|The boy with the remote controller|operate|a toy with the controller|0
p20_obj_27|The hat on the shelf|sit|on the hallway shelf|0
p20_obj_35|The ribbons|hang|on the upstairs wall|1
p20_obj_39|The picture-book shelf|hold|picture books beside the sofa|0
p20_obj_68|The play tent|stand|in the attic corner|0
p20_obj_73|The teddy-bear X-ray|lean|against the wall|0
p20_obj_86|The girl having her height measured|stand|against the measuring chart|0
p20_obj_87|The marbles|lie|beside the classroom window|1
p20_obj_97|The girl|measure|the display on the wall|0
p20_obj_174|The frog under the drainpipe|sit|under the drainpipe|0
p18_obj_18|The woman in the yellow shirt|wave|toward the tractor|0
p18_obj_19|The woman in the red top|repair|the wooden fence|0
p18_obj_30|The man in the striped shirt|reach|across the table inside the tent|0
p18_obj_38|The man with the cellphone|talk|on his cellphone beside the arena|0
p18_obj_41|The elderly woman|wait|at the cake table|0
p18_obj_49|The pig at the top of the steps|stand|at the top of the stand steps|0
p18_obj_68|The man|run|after the soap-box car|0
p18_obj_70|The man|stroke|the dog beside the fairground|0
p18_obj_71|The dog being petted|enjoy|the man's attention|0
p18_obj_73|The man in the red coat|stand|beside the vintage machines|0
p18_obj_74|The kneeling man|hug|the girl beside the tractors|0
p18_obj_75|The oil from the old red tractor|spill|onto the ground|0
p18_obj_76|The boy in the wooden cart|ride|along in the cart|0
p18_obj_78|The boy in the cart|ride|inside the wooden cart|0
p18_obj_82|The man with the speaker|stand|beside the stage|0
p18_obj_102|The red-haired girl|stand|beside a small child|0
p18_obj_110|The farmer in overalls and a green cap|help|with the show cattle|0
p18_obj_138|The dust|rise|above the arena floor|0
p18_obj_153|The girl at the microphone|sing|into the microphone|0
p18_obj_172|The small dog on a leash|walk|beside its handler|0
p18_obj_174|The girl in the purple top|dance|on the sand|0
p18_obj_175|The dancing boy|dance|beside the other children|0
p18_obj_177|The dog leash|stretch|between the dog and its handler|0
p18_obj_178|The man in the beige shirt|stand|near the market|0
p18_obj_190|The female vet|walk|beside the man at the market|0
p18_obj_197|The girl in the yellow top|hold|the dog's leash|0
p18_obj_212|The pregnant woman with the buggy|push|the buggy past the market stalls|0
p18_obj_215|The man with sunglasses|stand|near the market stalls|0
p17_obj_1|The man|walk|his dog past the stables|0
p17_obj_8|The man beside the girl|feed|an apple to the horse|0
p17_obj_42|The woman in the white shirt|lead|the horse by its reins|0
p17_obj_43|The farrier|shape|a horseshoe at the forge|0
p17_obj_44|The horseshoe clamp|hold|a hot horseshoe|0
p17_obj_45|The horseshoe forge|heat|a horseshoe for the farrier|0
p17_obj_50|The woman with the electric drill|use|an electric drill beside the stable|0
p17_obj_61|The woman in the purple dress|eat|at the outdoor table|0
p17_obj_69|The man by the carriage|climb|down from the carriage|0
p17_obj_70|The carriage wheel|turn|beside the stable yard|0
p17_obj_71|The carriage door|stand|open beside the passenger|0
p17_obj_77|The boy with the remote controller|steer|the toy car across the yard|0
p17_obj_85|The saddled brown horse|defecate|in the stable yard|0
p17_obj_100|The remote-control car|roll|across the sandy yard|0
p17_obj_103|The man with the backpack|stand|near the horses|0
p17_obj_106|The hen|balance|on the pig's back|0
p17_obj_121|The man with the backpack|point|toward the stable|0
p17_obj_122|The wooden trough|stand|beside the stable|0
p17_obj_128|The boy with the crate of tools|carry|the tools toward the stable|0
p17_obj_129|The crate of tools|hold|tools for the stable work|0
p17_obj_130|The man holding the saddle|carry|the saddle toward the horse|0
p17_obj_131|The brown hat|sit|on the man's head|0
p17_obj_166|The blue bucket of carrots|stand|beside the riding ring|0
p17_obj_181|The dog in the bushes|peer|out from the green bushes|0
p16_obj_3|The man|jog|along the hilltop path|0
p16_obj_9|The badger|forage|beside the straw pile|0
p16_obj_22|The white veterinary golf cart|wait|on the farm track|0
p16_obj_24|The vet driving the golf cart|drive|the golf cart along the farm track|0
p16_obj_28|The boy|startle|the girl beside him|0
p16_obj_29|The falling tray of vegetables|spill|vegetables onto the path|0
p16_obj_37|The man|tip|his straw hat in greeting|0
p16_obj_47|The cowboy hat|blow|through the air|0
p16_obj_66|The man|pick|apples from the tree|0
p16_obj_73|The man in the red vest|carry|a gas canister across the yard|0
p16_obj_75|The fallen orange|lie|on the grass|0
p16_obj_76|The second orange|lie|on the grass near the path|0
p16_obj_90|The man|balance|several produce boxes in his arms|0
p16_obj_98|The trash can|stand|on the grass by the bench|0
p16_obj_111|The chicken on the tractor|sit|on the tractor|0
p16_obj_116|The tool drawer|stand|open on the side of the camper|0
p16_obj_131|The metal combine part|form|part of the combine's cab|0
p15_obj_105|The girl with a scraped knee|kneel|on the path while holding her knee|0
p15_obj_107|The red skateboard|lie|on the path|0
p14_obj_21|The mouse in the doorway|peer|out from the doorway|0
p14_obj_35|The girl|crouch|beside the pond|0
p14_obj_50|The yellow forestry tractor attachment|rest|on the trailer|0
p14_obj_62|The concrete fence posts|sit|on the wooden pallet|1
p14_obj_64|The orange cat|run|across the farmyard|0
p14_obj_99|The hand water pump|stand|beside the path|0
p14_obj_101|The yellow toy truck|lie|on the grass|0
p14_obj_102|The green lawn|extend|across the ground by the path|0
p14_obj_126|The raccoon|sleep|on the bank of the creek|0
p14_obj_130|The paper boats|float|near the sandy bank|1
p14_obj_150|The sleeping dog|curl|up on the warm boards|0
p13_obj_99|The potted plant|grow|in a pot on the landing|0
p13_obj_102|The woman in the black shirt|chat|on the landing|0
p13_obj_120|The man|feed|the pet snakes in the terrarium|0
p13_obj_123|The bus-stop sign|hang|on the outside wall|0
p13_obj_124|The man|carry|the bandaged child indoors|0
p13_obj_125|The hurt child|rest|in the man's arms|0
p13_obj_140|The green hanging plant|trail|over the kitchen shelf|0
p13_obj_147|The grandmother's wheelchair|stand|beside the chair|0
p13_obj_148|The shoes under the table|lie|under the kitchen table|1
p13_obj_156|The accessible shower chair|stand|in the bathroom corner|0
p13_obj_163|The Wonder Woman doll|sit|on the chest of drawers|0
p13_obj_164|The heart-shaped lamp|shine|beside the bed|0
p13_obj_174|The toy dolphin|rest|on the armchair|0
p13_obj_178|The baby's high chair|stand|at the round table|0
p13_obj_204|The potted topiary plants|stand|beside the moped|1
p13_obj_221|The rabbit in the hedge|hide|inside the hedge|0
p12_obj_6|The swan in the lake|glide|across the calm water|0
p12_obj_11|The lake|stretch|past the sandy beach|0
p12_obj_23|The black poodle|swim|through the lake|0
p12_obj_24|The girl on the red inflatable|float|across the lake|0
p12_obj_25|The pink-haired woman|float|on the yellow inflatable|0
p12_obj_36|The grandmother in the pink swimsuit|pull|away as the crab pinches her|0
p12_obj_41|The wet dog|shake|water onto the sunbather|0
p12_obj_46|The doll|lie|on the pink blanket|0
p12_obj_51|The bunny rabbit|hide|in the bushes|0
p12_obj_59|The pet snake|coil|on the chair|0
p12_obj_60|The pink portable toilet|stand|between the trees|0
p12_obj_61|The toddler in the portable toilet|stand|inside the portable toilet|0
p12_obj_79|The green bicycle|roll|down the smooth road|0
p12_obj_89|The fruit|sit|on the picnic blanket|0
p12_obj_98|The white lamb|wriggle|in the girl's arms|0
p12_obj_108|The purple and pink topiary plants|bloom|in the garden|1
p12_obj_118|The magpie nest|sit|in the dormer window|0
p12_obj_135|The rabbits in the hutch|rest|inside the wooden hutch|1
p12_obj_144|The black-and-white rabbit|move|toward the girl's hands|0
p12_obj_152|The purple and pink topiary plants|bloom|in the basket|1
p12_obj_156|The little rabbit|snuggle|in the woman's arms|0
p12_obj_165|The cow|pull|the hat through the barn window|0
p11_obj_1|The green soccer field|stretch|behind the wire fence|0
p11_obj_4|The girl in the white shirt|run|onto the soccer field|0
p11_obj_5|The girl in red|dribble|the ball forward|0
p11_obj_6|The girl in blue|wait|for a pass|0
p11_obj_9|The referee|follow|the soccer play|0
p11_obj_12|The girl|run|across the soccer field|0
p11_obj_16|The passenger in the yellow car|ride|past the soccer field|0
p11_obj_17|The driver of the yellow car|steer|past the soccer field|0
p11_obj_20|The scout|reach|for his falling cap|0
p11_obj_22|The building steeple|rise|above the nearby rooftops|0
p11_obj_26|The soccer net|stand|at the end of the field|0
p11_obj_27|The soccer ball|fly|toward the goal|0
p11_obj_28|The goalie|block|the shot at the goal|0
p11_obj_30|The third baseman|guard|third base|0
p11_obj_32|The infield catcher|crouch|near the base|0
p11_obj_35|The coach|watch|the game from beside the fence|0
p11_obj_36|The dugout benches|stand|behind the fence|1
p11_obj_37|The umpire|watch|the baseball game|0
p11_obj_38|The catcher|crouch|by the fence|0
p11_obj_49|The catcher behind first base|crouch|behind first base|0
p11_obj_50|The fielder behind second base|stand|behind second base|0
p11_obj_58|The batter|stand|behind the fence|0
p11_obj_68|The green-team player|shoot|the basketball toward the hoop|0
p11_obj_70|The black-team player|guard|an opponent|0
p11_obj_72|The boy on the black team|stretch|before the game|0
p11_obj_77|The woman|carry|the cooler toward the cars|0
p11_obj_78|The cooler|swing|from the woman's hand|0
p11_obj_81|The wheelchair|stand|beside the path|0
p11_obj_82|The mother at the barbecue|give|a hot dog to the girl|0
p11_obj_88|The scout|run|along the pavement|0
p11_obj_95|The old man in the green vest|stand|beside the pavement|0
p11_obj_97|The seagull|snatch|the ice cream from a passerby|0
p11_obj_100|The building steeple|rise|above the rooftops|0
p11_obj_104|The bird's nest|sit|on the shop roof|0
p11_obj_107|The fabric in the window|hang|in the shop window|0
p11_obj_110|The red car|park|under the trees|0
p11_obj_119|The spilling fruit|fall|from the shopping bag|0
p11_obj_152|The child at the fountain|splash|a friend with water|0
p11_obj_157|The child|eat|ice cream at the cafe table|0
p11_obj_162|The blue chair|stand|at the cafe table|0
p11_obj_173|The man in the striped blue shirt|stand|near the bicycles|0
p11_obj_177|The mother with the yoga mat|carry|the yoga mat along the pavement|0
p11_obj_178|The blue baby stroller|carry|the baby along the pavement|0
p11_obj_180|The woman with the stroller|push|the stroller along the pavement|0
p11_obj_185|The wooden crate of groceries|travel|on the back of the scooter|0
p11_obj_198|The backyard of the yellow house|lie|behind the yellow house|0
p11_obj_200|The boy|play|a video game upstairs|0
p11_obj_209|The book|rest|on the boy's knees|0
p10_obj_13|The woman in the green jacket|drink|her coffee|0
p10_obj_15|The woman in the red top|sit|with her back to the park|0
p10_obj_18|The grandmother in the wheelchair|enjoy|her afternoon tea|0
p10_obj_22|The mother in the blue T-shirt|hold|the little boy's hand|0
p10_obj_58|The soccer ball|fly|through the air|0
"""


def parse_frames():
    frames = {}
    for line in _FRAME_DATA.strip().splitlines():
        oid, subject, verb, rest, plural = line.split('|')
        if oid in frames:
            raise ValueError('duplicate authored frame: %s' % oid)
        frames[oid] = (subject, verb, rest, plural == '1')
    return frames


# These subjects are people or animals performing a momentary visible action.
# Some of their verbs (sit, stand, hold, lead, run, point, stretch, wait) are
# stative only in other senses, such as a building standing or a path running.
ACTIVE_IDS = {
    'p10_obj_15', 'p10_obj_22',
    'p11_obj_4', 'p11_obj_6', 'p11_obj_12', 'p11_obj_38', 'p11_obj_49',
    'p11_obj_50', 'p11_obj_58', 'p11_obj_72', 'p11_obj_88', 'p11_obj_95',
    'p11_obj_173',
    'p12_obj_61', 'p12_obj_135',
    'p13_obj_125',
    'p14_obj_64',
    'p16_obj_111',
    'p17_obj_42', 'p17_obj_103', 'p17_obj_121',
    'p18_obj_41', 'p18_obj_49', 'p18_obj_68', 'p18_obj_73', 'p18_obj_82',
    'p18_obj_102', 'p18_obj_138', 'p18_obj_178', 'p18_obj_197', 'p18_obj_215',
    'p20_obj_86', 'p20_obj_174',
    'p21_obj_119', 'p21_obj_195',
    'p22_obj_2', 'p22_obj_60', 'p22_obj_76',
}

# These picture details express an enduring layout or decorative relationship
# even though their head verb is not in main_tenses.STATIVE.
STATIC_IDS = {'p14_obj_102', 'p16_obj_131', 'p22_obj_102', 'p22_obj_103',
              'p22_obj_117'}


def load_inline():
    html_path = os.path.join(BP, 'index.html')
    text = open(html_path, encoding='utf-8').read()
    start = text.index('var spatialIndex = ') + len('var spatialIndex = ')
    end = text.index('};', start) + 1
    return html_path, text, start, end, json.loads(text[start:end])


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)

    exported = json.load(open(sys.argv[1], encoding='utf-8'))
    latest = {}
    for item in exported['suggestions']:
        old = latest.get(item['object_id'])
        if old is None or item['created_at'] >= old['created_at']:
            latest[item['object_id']] = item

    frames = parse_frames()
    if set(latest) != set(frames):
        missing = sorted(set(latest) - set(frames))
        extra = sorted(set(frames) - set(latest))
        raise ValueError('frame mismatch; missing=%r extra=%r' % (missing, extra))

    html_path, html, start, end, index = load_inline()
    objects = {o['id']: o for page in index.values() for o in page}
    changed = 0
    for oid, suggestion in latest.items():
        obj = objects.get(oid)
        if obj is None:
            raise KeyError('object not found: %s' % oid)
        if obj['name'] not in (suggestion['current_label'], suggestion['suggested_label']):
            raise ValueError('%s expected %r or %r, found %r' % (
                oid, suggestion['current_label'], suggestion['suggested_label'], obj['name']))
        subject, verb, rest, plural = frames[oid]
        obj['name'] = suggestion['suggested_label']
        obj['grammar_data']['subject'] = subject
        stative_override = (False if oid in ACTIVE_IDS else
                            True if oid in STATIC_IDS else None)
        obj['grammar_data'].update(build_main(
            subject, verb, rest, plural, key=oid + ':labels-2026-08-05',
            stative_override=stative_override))
        changed += 1

    compact = json.dumps(index, ensure_ascii=False, separators=(',', ':'))
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html[:start] + compact + html[end:])
    with open(os.path.join(BP, 'spatial_index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write('\n')

    print('applied %d distinct updates from %d suggestions' % (
        changed, len(exported['suggestions'])))
    print('rewrote %d active grammar sentences' % (changed * 7))
    print('wrote index.html and spatial_index.json')


if __name__ == '__main__':
    main()
