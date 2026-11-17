#!/usr/bin/env python3
"""Hand repairs for Busy Pictures objects whose sentences were garbled (2026-11-17).

The earlier generators sometimes took the wrong words as the subject
("The tea is pouring the tea", "The down is whizzing down the slide"), used
plural verbs for one person ("The boy sorting shapes are sorting"), or wrote
sentences for a different object (a smartphone that is sipped). Those seven
affirmative sentences are rewritten here by hand; each rewrite applies only
if the object still has the expected label, so a renumbered page can never
receive the wrong text.

Then every negative and question form is re-authored with the (now
deterministic, fixed) author_tense_forms rules, and spelling_fixes runs on
save. Safe to rerun.

    python3 busy-pictures/tools/repair_sentences.py
"""

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import author_tense_forms as authoring  # noqa: E402
import bp_data  # noqa: E402

SP, PC, PAST, PASTC, PP, GOING, WILL = (
    "main_simple_present", "main_present_continuous", "main_simple_past",
    "main_past_continuous", "main_present_perfect", "main_future_going_to",
    "main_future_will",
)

# object id -> labels it may currently carry, optional new label, and sentences
HAND = {
    "p1_obj_116": {"labels": ["A boy playing with two dogs", "Boy playing with two dogs"],
                   "name": "Boy playing with two dogs", SP: "The boy usually plays with the two dogs on the grass.",
                   PC: "The boy is playing with two dogs near the dome tents.",
                   PAST: "The boy chased the two dogs around the orange dome tent all morning.",
                   PASTC: "The boy was chasing the dogs round the tent when his mother called.",
                   PP: "The boy has already tired himself out running across the grass.",
                   GOING: "The boy is going to build a den behind the blue dome tent.",
                   WILL: "The boy will fall asleep early tonight after all this running."},
    "p1_obj_199": {"labels": ["Girl taking photo with smartphone", "Girl taking a photo with a smartphone"],
                   "name": "Girl taking a photo with a smartphone",
                   SP: "The girl often takes photos with her smartphone.",
                   PC: "The girl is taking a photo with her smartphone.",
                   PAST: "The girl took a photo of the mountains with her smartphone.",
                   PASTC: "The girl was taking a photo when the boy with a camera pointed toward the mountains.",
                   PP: "The girl has already taken several photos with her smartphone.",
                   GOING: "The girl is going to send the photo to her friend.",
                   WILL: "The girl will take another photo before the train arrives."},
    "p1_obj_202": {"labels": ["Woman photographing the view"],
                   SP: "The woman usually waits for the light to be just right before she takes a photo.",
                   PC: "The woman is holding her camera up to her eye.",
                   PAST: "The woman raised her camera and framed the snowy peak in the lens.",
                   PASTC: "The woman was adjusting her camera settings when the hang glider soared overhead.",
                   PP: "The woman has taken at least a dozen photos already.",
                   GOING: "The woman is going to email these photos to her family tonight.",
                   WILL: "The woman will probably print her favourite shot of the viaduct."},
    "p2_obj_45": {"labels": ["Carousel horse"],
                  PC: "The wooden horse is moving up and down on its pole.",
                  PAST: "The wooden horse moved up and down on its pole.",
                  PASTC: "The carousel horse was moving up and down on its pole.",
                  PP: "The wooden horse has moved up and down on its pole all afternoon.",
                  GOING: "The wooden horse is going to move up and down on its pole.",
                  WILL: "The wooden horse will move up and down on its pole."},
    "p2_obj_59": {"labels": ["Pigeon flying indoors"],
                  SP: "The pigeon sometimes flies indoors.",
                  PC: "The pigeon is flying around indoors.",
                  PAST: "The pigeon flew in through the open door.",
                  PASTC: "The pigeon was flying under the ceiling when people looked up.",
                  PP: "The pigeon has flown all the way across the room.",
                  GOING: "The pigeon is going to land on a high shelf.",
                  WILL: "The pigeon will look for crumbs on the floor."},
    "p4_obj_108": {"labels": ["Lamb lying down"],
                   PASTC: "While people passed nearby, the lamb was lying on the grass."},
    "p4_obj_52": {"labels": ["Brown riding horse"],
                  SP: "The brown horse sometimes pauses when the man in the blue overalls moves nearby.",
                  PC: "The brown horse is standing on the sandy path.",
                  PAST: "The man in the blue overalls saw the brown horse stand on the sandy path.",
                  PASTC: "While people passed nearby, the brown horse was standing on the sandy path."},
    "p5_obj_50": {"labels": ["Workman bending over"],
                  PC: "The workman is lifting the second radiator."},
    "p5_obj_92": {"labels": ["Man with cupboard"],
                  SP: "The man with the cupboard often carries furniture through the door."},
    "p5_obj_159": {"labels": ["Man loading the truck"],
                   PC: "The man is throwing soil into the truck.",
                   PASTC: "Earlier in the day, the man was throwing soil into the truck."},
    "p5_obj_202": {"labels": ["Man driving the car"],
                   PC: "The man is looking at the road works."},
    "p7_obj_101": {"labels": ["Big camera lens"],
                   SP: "The big camera lens usually helps the photographer see far away.",
                   PC: "The big camera lens is pointing at the scene below.",
                   PAST: "The owner checked the big camera lens before taking a photo.",
                   PASTC: "The big camera lens was pointing at the scene below when the picture was taken.",
                   PP: "The big camera lens has zoomed in on the scene.",
                   GOING: "The big camera lens is going to zoom in for the next shot.",
                   WILL: "The big camera lens will capture the next shot."},
    "p7_obj_241": {"labels": ["Red watering can"],
                   SP: "The red watering can carries water to the garden plants.",
                   PC: "The red watering can is sitting beside the garden plants.",
                   PAST: "The red watering can carried water to the garden plants earlier.",
                   PASTC: "The red watering can was sitting beside the plants when the picture was taken.",
                   PP: "The red watering can has carried water to the garden plants.",
                   GOING: "The red watering can is going to carry water to the garden plants.",
                   WILL: "The red watering can will carry water to the garden plants."},
    "p8_obj_133": {"labels": ["Woman pouring the tea"],
                   PC: "The woman is pouring the tea into a cup.",
                   PAST: "The woman poured the tea into a cup.",
                   PASTC: "The woman was pouring the tea into a cup."},
    "p9_obj_27": {"labels": ["Nurse changing bedding and spotting an escaping patient"],
                  SP: "The nurse often changes the bedding in the hospital room.",
                  PC: "The nurse is changing the bedding in the hospital room.",
                  PAST: "The nurse changed the bedding and spotted an escaping patient.",
                  PASTC: "The nurse was noticing the escaping patient when the woman began watering the balcony flowers.",
                  PP: "The nurse has changed the bedding and spotted an escaping patient.",
                  GOING: "The nurse is going to change the bedding and stop the escaping patient.",
                  WILL: "The nurse will remove the old sheet after the woman moves away."},
    "p9_obj_68": {"labels": ["Red balloon floating away"],
                  PC: "The red balloon is escaping into the blue sky.",
                  PAST: "The red balloon escaped into the blue sky.",
                  PASTC: "While people passed nearby, the red balloon was escaping into the blue sky."},
    "p9_obj_69": {"labels": ["Man leaving the toy shop"],
                  PC: "The man is stepping out onto the pavement."},
    "p9_obj_179": {"labels": ["Woman crossing the road"],
                   PC: "The woman is holding her daughter's hand.",
                   PAST: "The boy with the school bag saw the woman hold her daughter's hand."},
    "p9_obj_189": {"labels": ["Man loading the car"],
                   PC: "The man is lifting a bag into the car.",
                   PAST: "The man lifted a bag into the car a moment ago.",
                   PASTC: "At that moment, the man was lifting a bag into the car."},
    "p10_obj_170": {"labels": ["Toy watering can"],
                    SP: "The toy watering can stands at the edge of the sandpit.",
                    PC: "The toy watering can is standing at the edge of the sandpit.",
                    PAST: "The toy watering can stood at the edge of the sandpit all afternoon.",
                    PASTC: "Earlier in the day, a child was playing with the toy watering can.",
                    PP: "The toy watering can has stood at the edge of the sandpit all afternoon.",
                    GOING: "The toy watering can is going to stay at the edge of the sandpit.",
                    WILL: "The toy watering can will water the sandcastles later."},
    "p10_obj_172": {"labels": ["Girl pouring sand"],
                    SP: "The girl often pours sand out of her bucket.",
                    PC: "The girl is pouring the sand out of the bucket.",
                    PAST: "The girl poured the sand out of the bucket.",
                    PASTC: "Just before this moment, the girl was pouring the sand out of the bucket."},
    "p10_obj_178": {"labels": ["Boy sliding down"],
                    PC: "The boy is whizzing down the blue slide.",
                    PAST: "The boy whizzed down the blue slide.",
                    PASTC: "The boy was whizzing down the blue slide."},
    "p10_obj_182": {"labels": ["Red climbing net"],
                    PC: "The red climbing net is sloping down from the tower."},
    "p21_obj_224": {"labels": ["Boy sorting coloured shapes"],
                    SP: "The boy generally sorts the shapes into groups.",
                    PC: "The boy is sorting the shapes into groups.",
                    PAST: "The boy sorted the shapes into groups earlier this morning.",
                    PASTC: "The boy was sorting the shapes into groups while everyone else was busy.",
                    PP: "The boy has already sorted the shapes into groups.",
                    GOING: "The boy is going to sort the shapes into groups very soon.",
                    WILL: "The boy will sort the shapes into groups in a little while."},
    "p23_obj_116": {"labels": ["Boy reaching for coins"],
                    SP: "The boy normally reaches down for the dropped coins.",
                    PC: "The boy is reaching down for the dropped coins.",
                    PAST: "The boy reached down for the dropped coins just before the picture was taken.",
                    PASTC: "The boy was reaching down for the dropped coins when someone first looked over.",
                    PP: "The boy has reached down for the dropped coins.",
                    GOING: "The boy is going to reach down for the dropped coins any second now.",
                    WILL: "The boy will reach down for the dropped coins in a little while."},
    "p24_obj_126": {"labels": ["Boy holding hands with a girl"],
                    SP: "The boy normally walks hand in hand with his friend.",
                    PC: "The boy is walking hand in hand with his friend.",
                    PAST: "The boy walked hand in hand with his friend just before the picture was taken.",
                    PASTC: "The boy was walking hand in hand with his friend when someone first looked over.",
                    PP: "The boy has already walked hand in hand with his friend.",
                    GOING: "The boy is going to walk hand in hand with his friend very soon.",
                    WILL: "The boy will walk hand in hand with his friend in a little while."},
    "p24_obj_128": {"labels": ["Man with arms outstretched welcoming visitors"],
                    SP: "The man often welcomes the children to the farm.",
                    PC: "The man is welcoming the children to the farm.",
                    PAST: "The man welcomed the children to the farm a few minutes ago.",
                    PASTC: "The man was welcoming the children to the farm when the noise started.",
                    PP: "The man has just welcomed the children to the farm.",
                    GOING: "The man is going to welcome the children to the farm in a moment.",
                    WILL: "The man will welcome the children to the farm later on."},
    "p24_obj_137": {"labels": ["Woman shearing a sheep"],
                    SP: "The woman often shears the wool from the sheep.",
                    PC: "The woman is shearing the wool from the sheep.",
                    PAST: "The woman sheared the wool from the sheep a few minutes ago.",
                    PASTC: "The woman was shearing the wool from the sheep when the noise started.",
                    PP: "The woman has already sheared the wool from the sheep.",
                    GOING: "The woman is going to shear the wool from the sheep very soon.",
                    WILL: "The woman will shear the wool from the sheep in a little while."},
    "p24_obj_145": {"labels": ["Girl collecting eggs from a nesting box"],
                    SP: "The girl generally collects eggs from the nesting box.",
                    PC: "The girl is collecting eggs from the nesting box.",
                    PAST: "The girl collected eggs from the nesting box earlier this morning.",
                    PASTC: "The girl was collecting eggs from the nesting box while everyone else was busy.",
                    PP: "The girl has already collected eggs from the nesting box.",
                    GOING: "The girl is going to collect eggs from the nesting box very soon.",
                    WILL: "The girl will collect eggs from the nesting box soon."},
    "p24_obj_147": {"labels": ["Man walking with milk churns"],
                    SP: "The man usually walks across the yard with the milk churns.",
                    PC: "The man is walking across the yard with the milk churns.",
                    PAST: "The man walked across the yard with the milk churns earlier today.",
                    PASTC: "The man was walking across the yard with the milk churns just as the others arrived.",
                    PP: "The man has just walked across the yard with the milk churns.",
                    GOING: "The man is going to walk across the yard with the milk churns in a moment.",
                    WILL: "The man will walk across the yard with the milk churns before long."},
}


# Objects whose present-continuous sentence was stock filler; the other
# tenses are rebuilt from these (see rebuild_stock_phrases).
HAND.update({
    'p2_obj_25': {"labels": ['Pink camper van'], PC: 'The pink camper van is standing behind the family.'},
    'p2_obj_106': {"labels": ['Silver carriage roof'], PC: 'The silver carriage roof is gleaming in the sunlight.'},
    'p2_obj_107': {"labels": ['Carriage door'], PC: 'The carriage door is staying closed.'},
    'p2_obj_130': {"labels": ['White intercity carriage'], PC: 'The white carriage is waiting at the platform.'},
    'p2_obj_159': {"labels": ['Purple suitcase'], PC: 'The purple suitcase is standing in the train doorway.'},
    'p2_obj_163': {"labels": ['Second class carriage'], PC: 'The second class carriage is carrying passengers.'},
    'p2_obj_236': {"labels": ['Beach ball'], PC: 'The colourful beach ball is sitting on the sand beside a child.'},
    'p3_obj_15': {"labels": ['Rock spires in the valley'], PC: 'The rock spires are rising out of the water.'},
    'p3_obj_71': {"labels": ["Molly's Hotel"], PC: "Molly's Hotel is standing in the middle of the town."},
    'p3_obj_145': {"labels": ['Hotel steps'], PC: 'The hotel steps are leading up to the front door.'},
    'p4_obj_27': {"labels": ['Thin green cactus'], PC: 'The thin green cactus is growing in the dry sand.'},
    'p4_obj_46': {"labels": ['Joshua tree by the road'], PC: 'The Joshua tree is growing beside the road.'},
    'p4_obj_48': {"labels": ['Round prickly pear'], PC: 'The prickly pear cactus is growing in the dry sand.'},
    'p4_obj_115': {"labels": ['Right gate post'], PC: 'The wooden post is holding up the gate.'},
    'p4_obj_144': {"labels": ['Cactus by the barn'], PC: 'The cactus is growing beside the barn.'},
    'p5_obj_67': {"labels": ['Blue electric drill'], PC: 'The blue electric drill is lying on the shelf.'},
    'p5_obj_129': {"labels": ['Tall stepladder'], PC: 'The tall stepladder is holding up the man by the lamp.'},
    'p6_obj_56': {"labels": ['Village pond'], PC: 'The village pond is shining in the sun.'},
    'p6_obj_57': {"labels": ['Wooden roof trusses'], PC: 'The wooden roof trusses are standing on top of the new house.'},
    'p6_obj_117': {"labels": ['Football on the grass'], PC: 'The football is lying on the grass.'},
    'p7_obj_220': {"labels": ['Concrete steps'], PC: 'The concrete steps are leading up to the front door.'},
    'p7_obj_225': {"labels": ['Blue armchair in the loft'], PC: 'The blue armchair is standing in the loft with a plant on it.'},
    'p8_obj_22': {"labels": ['Sailor doll on the box'], PC: 'The sailor doll is sitting on the box.'},
    'p8_obj_57': {"labels": ['Yellow armchair'], PC: 'The yellow armchair is holding two rag dolls.'},
    'p8_obj_167': {"labels": ['Bathroom mirror cabinet'], PC: 'The bathroom mirror cabinet is hanging on the wall.'},
    'p9_obj_31': {"labels": ['Yellow curtains'], PC: 'The yellow curtains are hanging at the window.'},
    'p9_obj_32': {"labels": ['Bucket of red flowers'], PC: 'The bucket of red flowers is standing outside the shop.'},
    'p9_obj_42': {"labels": ['Potted palm outside the shop'], PC: 'The potted palm is standing outside the shop.'},
    'p9_obj_55': {"labels": ['Chimney pot'], PC: 'The chimney pot is sitting on top of the roof.'},
    'p9_obj_70': {"labels": ['Chimney with the metal cap'], PC: 'The chimney with the metal cap is rising above the roof.'},
    'p10_obj_108': {"labels": ['Red park bench'], PC: 'The red park bench is holding a picnic bag.'},
    'p25_obj_34': {"labels": ['Molehill in the grass'], PC: 'The molehill is rising out of the grass.'},
    "p6_obj_16": {"labels": ["Dark spruce in the wood"], PC: "The dark spruce is standing at the edge of the wood."},
    "p7_obj_53": {"labels": ["Village pond"], PC: "The village pond is shining in the sun."},
    "p3_obj_27": {"labels": ["Sandstone rock face"], PC: "The sandstone rock face is towering over the town."},
})


# Second batch of objects whose present-continuous sentence was filler.
HAND.update({
    'p2_obj_125': {"labels": ['Café table'], PC: 'The café table is standing outside the café.'},
    'p2_obj_145': {"labels": ['Blue suitcase'], PC: 'The blue suitcase is standing on the floor.'},
    'p3_obj_77': {"labels": ['Balcony flower boxes'], PC: 'The flower boxes are hanging from the balcony.'},
    'p4_obj_194': {"labels": ['Red toolbox'], PC: 'The red toolbox is sitting on the ground.'},
    'p5_obj_38': {"labels": ['Red roof tiles'], PC: 'The red roof tiles are covering the roof.'},
    'p5_obj_185': {"labels": ['Long concrete pipe'], PC: 'The long concrete pipe is lying on the ground.'},
    'p5_obj_208': {"labels": ['Surveying tripod'], PC: 'The surveying tripod is standing on the road.'},
    'p6_obj_98': {"labels": ['Abandoned car chassis'], PC: 'The old car chassis is rusting in the grass.'},
    'p6_obj_142': {"labels": ['Wooden coffee table'], PC: 'The wooden coffee table is standing in the living room.'},
    'p6_obj_202': {"labels": ['Red toolbox'], PC: 'The red toolbox is sitting on the floor.'},
    'p6_obj_223': {"labels": ['Blue armchair in the loft'], PC: 'The blue armchair is standing in the loft.'},
    'p7_obj_96': {"labels": ['Abandoned car chassis'], PC: 'The old car chassis is rusting in the grass.'},
    'p7_obj_164': {"labels": ['Orange traffic cone'], PC: 'The orange traffic cone is standing in the road.'},
    'p7_obj_186': {"labels": ['Tall bulrushes'], PC: 'The tall bulrushes are growing at the edge of the water.'},
    'p8_obj_164': {"labels": ['Bed with the yellow quilt'], PC: 'The bed with the yellow quilt is standing against the wall.'},
    'p8_obj_176': {"labels": ['Red shoes by the door'], PC: 'The red shoes are waiting by the door.'},
    'p9_obj_65': {"labels": ['Basket of bread rolls'], PC: 'The basket of bread rolls is sitting on the counter.'},
    'p9_obj_205': {"labels": ['Second police car'], PC: 'The second police car is driving along the street.'},
    'p10_obj_14': {"labels": ['Plate of cake'], PC: 'The plate of cake is sitting on the table.'},
    'p10_obj_75': {"labels": ['Wooden bench by the path'], PC: 'The wooden bench is standing by the path.'},
    'p10_obj_78': {"labels": ['Green rubbish bin'], PC: 'The green rubbish bin is standing beside the path.'},
    'p10_obj_85': {"labels": ["Bulrushes at the water's edge"], PC: "The bulrushes are growing at the water's edge."},
})


# Stock filler the old "diversify" generators added for variety. Sentences
# matching these say little or nothing true about the picture ("A cautious
# animal never continues ...", "During a routine visit, a local specialist
# checked the golden crown"), so they are rebuilt from the object's own
# present-continuous sentence.
STOCK_PHRASES = re.compile("|".join([
    r"\bA cautious animal never\b",
    r"\bWhen danger is close\b",
    r"\bPeople nearby often notice\b",
    r"\b(During a routine visit|After a brief inspection|Earlier that morning, the organizer|Last week, a local)\b",
    r"\bchecks the route before\b",
    r"\bOn an ordinary day\b",
    r"\bAt this time of day\b",
    r"\bpauses when .+ (comes|come|moves|move) (closer|nearby)\b",
    r"\benough \w+ available\b",
    r"\btown[- ]centre\b",
    r"\b(useful supplies|daily activity|useful support|a daily task|useful items|plant life|animal activity|the next stage|shap(e|ing) the landscape|support its user|the surrounding landscape)\b",
    r"\blonger than expected\b",
    r"\bblocking anyone's route\b",
    r"\bWhenever (enough|extra) \w+ is available\b|\bWhen extra \w+ is available\b",
    r"\bbusiest part of the day\b",
    r"\bWithout much assistance\b",
    r"^With enough \w+, ",
    r"^(Later|Before evening|By evening|Soon), .+ again\.$",
    r"\buseful space\b",
    r"\bmidday sunlight\b",
    r"\bfresh air inside\b",
    r"\b(explore|explores|explored|exploring) a new activity\b",
    r"\b(respond to the audience|adjust the performance|practise a difficult passage)\b",
    r"\bpeople and supplies\b",
    r"\breview(s|ing|ed)? the plan\b",
    r"\borganiz\w* the room\b|\bavailable area must be used\b",
    r"\bguides? the vehicle\b",
    r"\bsupports? a heavy load\b",
    r"^(Last week|Earlier that morning|Yesterday|This morning), (a|the) (colleague|local specialist|organizer|staff|careful worker|neighbour|visitor)\b",
    r"\bwhen it feels threatened\b",
    r"\bkeep \w+ing .+ throughout the day\b",
    r"\bwithout enough (room|space)\b",
    r"\b(is|are|was|were) keeping \w+ing\b",
    r"\bsafe storage\b",
    r"\bconnects? two locations\b",
    r"\bessential supplies\b",
    r"\bunusual detail\b",
    r"\bsaves? time during the job\b",
    r"\bcommunicates? a warning\b",
    r"\bprotects? the interior\b",
    r"\bwhen wind and rain\b",
    r"^Without warning, ",
    r"\bkeep bad weather outside\b",
    r"^(Last week|Earlier that morning|Yesterday|This morning|After a brief inspection|During a routine visit), (a|an|the) (owner|maintenance team|transport technician|technician|worker|team|staff member|specialist)\b",
    r"\bcomplete the journey\b|\bcompleting the journey\b",
    r"\bfor a little longer\.$",
    r"\bwill probably .+ before evening\.$",
    r"\bwhen someone nearby needs assistance\b",
    r"^On especially busy days\b",
    r"\bputs? extra pressure on\b",
    r"\bsupport(s|ing)? its user\b",
    r"\bonly after the route has been checked\b",
    r"\bholding its contents safely\b|\bholds its contents safely\b",
    r"\bwith natural caution\b",
    r"\bavoid a difficult obstacle\b",
    r"^Even in a quiet setting\b",
    r"\bsupport(s|ed|ing)? a busy worker\b",
    r"\bfeeds? a hungry visitor\b",
    r"\ba resting place again\b",
    r"\ban instructor invited\b",
    r"\bhelps? a friend for only a short time\b",
    r"\bmarks? the location\b",
    r"\bsupports? the journey\b",
    r"\bsuppl(y|ies|ied|ying) building material\b",
    r"\bfollows? a scent safely\b|\bfollowing a scent safely\b|\bfollowed a scent safely\b",
    r"\binvestigat\w+ a sound\b",
    r"\bfor only a short time\b",
    r"\bkeep watch on the space around\b",
    r"\bresponsible for the .+ always checks\b",
    r"\balways checks (its|their) \w+ before setting off\b",
    r"\bserving the building year after year\b",
    r"\bcommunicat\w+ a warning again\b",
    r"\bwhen food may be available nearby\b",
    r"\bgive customers a sheltered place\b",
    r"\bwhen (it|they) feels? threatened\b",
    r"^Last week, (a|an|the) [\w ]+ carefully \w+ the\b",
    r"\bexplor\w+ something new\b",
    r"^(The|An?) [\w' -]+ started \w+ing\b.* beside\b",
    r"\bhold\w* a smile for a surprisingly long time\b",
    r"\bbefore the day ends\b",
    r"^Earlier that morning, (a|an) \w+ \w+ the\b",
    r"\bsheltering people from the weather\b",
    r"\b(grow\w*|grew|cross\w*|stand\w*|stood) securely\b",
    r"\bsometimes pauses? when the .+ moves nearby\b",
    r"^Earlier that morning, (a|an|the) [\w ]+? \w+ed the\b",
    r"\buseful information again\b",
    r"\bnever change place while serving\b",
    r"\bprotecting the interior\b",
    r"\bsupporting daily hygiene\b",
    r"\b(help a friend|prepare the materials) very soon\b",
    r"\b(keeps?|kept|keeping) helping a worker\b",
    r"\bsaving time during the job\b",
    r"\bremain connected to the built space\b",
    r"^Earlier that day, (a|an|the) [\w ]+? \w+ed the\b",
    r"\ba wildlife expert examined\b",
    r"\bserves the building for many years\b",
    r"\bsearch for food without enough energy\b",
    r"\bentertaining a child\b",
    r"\bbefore anyone notices\b",
    r"^On a busy day\b",
    r"\battracting local wildlife\b",
    r"\borganizing small objects\b",
    r"\bchanging with the seasons\b",
    r"\battracting new customers\b",
    r"\b(veterinarian|ranger|keeper|wildlife expert|vet) examined\b",
    r"\bduring a busy day\b",
    r"^During a normal day\b",
    r"\bproviding a resting place\b",
    r"\bshap\w+ the landscape again\b",
    r"\bcarrying water through the landscape\b",
    r"\b\w+ing (naturally|gradually)\b",
    r"\b(grows|grew|grown|rises|rose|risen|lies|lay|shines|shone|floats|floated|drifts|drifted) (naturally|gradually)\b",
    r"\bin the suburban street\b",
    r"\bafter the .+ moves away\b",
    r"\bshelters local people\b",
    r"\bshelf' surface\b",
    r"\bstaying firmly in place\b",
    r"^Around the school, police station, and road\b",
    r"\bwas admitting daylight\b",
    r"\bbegan reaching\b",
    r"\btrying to finish\b",
    r"\bsometimes pauses? when the .+ comes closer\b",
    r"\bchange with the seasons without\b",
    r"\bin the city park\b",
    r"\bbegan \w+ing\b",
    r"\bcarries water through the landscape\b",
]))


def rebuild_stock_phrases(index):
    """Replace stock-filler affirmatives with plain sentences built from the
    object's present-continuous action. Returns the number replaced."""
    reverse = authoring.reverse_ing_map(index)
    replaced = 0
    for objects in index.values():
        for obj in objects:
            data = obj["grammar_data"]
            fields = [f for f in authoring.MAIN_FIELDS if STOCK_PHRASES.search(data.get(f, ""))]
            if not fields:
                continue
            if PC in fields:
                continue  # no trustworthy source; needs a HAND entry
            subject, plural, base, ing_phrase, passive = authoring.extract_visible_action(data, reverse)
            static = authoring.entity_kind(obj["name"], subject) == "static"
            plain = authoring.actual_clauses(subject, plural, base, ing_phrase, passive, static)
            for field in fields:
                data[field] = authoring.clean(plain[field])
                replaced += 1
    return replaced


CODES = {"SP": SP, "PC": PC, "PA": PAST, "PX": PASTC, "PP": PP, "GO": GOING, "WI": WILL}
REVIEWS = Path(__file__).resolve().parent / "reviews"


def load_reviews():
    """Picture-by-picture review fixes (tools/reviews/<picture>.json)."""
    entries = {}
    for path in sorted(REVIEWS.glob("wimmelbook_*.json")):
        for oid, entry in json.loads(path.read_text(encoding="utf-8")).items():
            if oid.startswith("_"):
                continue
            fixed = {"labels": entry["labels"]}
            if "name" in entry:
                fixed["name"] = entry["name"]
            for code, field in CODES.items():
                if code in entry:
                    fixed[field] = entry[code]
            entries[oid] = fixed
    return entries


def apply_hand_repairs(index):
    applied, skipped, reverse = 0, [], None
    objects = {obj["id"]: obj for page in index.values() for obj in page}
    repairs = dict(HAND)
    repairs.update(load_reviews())
    for oid, repair in repairs.items():
        obj = objects.get(oid)
        if obj is None or obj["name"] not in repair["labels"]:
            skipped.append(oid)
            continue
        if "name" in repair:
            obj["name"] = repair["name"]
        for field, sentence in repair.items():
            if field.startswith("main_"):
                obj["grammar_data"][field] = sentence
        if PC in repair:
            # A new present-continuous action: rebuild any tense the
            # review left out, so it can't keep the old (wrong) action.
            missing = [f for f in authoring.MAIN_FIELDS if f not in repair]
            if missing:
                if reverse is None:
                    reverse = authoring.reverse_ing_map(index)
                data = obj["grammar_data"]
                subject, plural, base, ing_phrase, passive = authoring.extract_visible_action(data, reverse)
                static = authoring.entity_kind(obj["name"], subject) == "static"
                plain = authoring.actual_clauses(subject, plural, base, ing_phrase, passive, static)
                for field in missing:
                    data[field] = authoring.clean(plain[field])
        applied += 1
    return applied, skipped


def main():
    index = bp_data.load_index()
    applied, skipped = apply_hand_repairs(index)
    print("hand repairs applied to %d objects" % applied)
    if skipped:
        print("skipped (label changed or object gone): %s" % ", ".join(skipped))
    print("stock-filler sentences rebuilt: %d" % rebuild_stock_phrases(index))
    # Re-author every negative and question from the repaired affirmatives.
    reverse = authoring.reverse_ing_map(index)
    for objects in index.values():
        for obj in objects:
            authoring.author_object(obj, reverse)
    authoring.validate(index)
    bp_data.save_index(index)


if __name__ == "__main__":
    main()
