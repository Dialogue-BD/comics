# Picture This Bangla: deck order

The deck runs from what a newcomer to Bangladesh needs first to what is most specialised. The order lives in `deck-order.json`. `scripts/build_web.py` applies it on every rebuild, and so does `scripts/deck_order.py`, which can also run on its own. Cards themselves are unchanged. Folders, image files (`pages/NNN-…`), card numbers, audio and problem reports all keep the old card number. Only the order changes.

## The five tiers

| Tier | Name | What belongs here |
|---|---|---|
| 1 | First days | What you need to survive the first days: greeting a neighbour, polite words, saying you understand or don't, asking for help with Bangla, I / you / this / that, numbers 1–12 and common prices, ordering food and water, asking for the toilet, paying, a rickshaw, left/right and simple directions, an address, today/tomorrow, close family, the body, pain and feeling unwell, urgent help, first problems at home. |
| 2 | First weeks | Daily basics: where things are, the home and its rooms, colours and simple descriptions (hot/cold, big/small, more/less), tea and meals, market fruit and vegetables, telling the time, the household's people, medicine, shops and places nearby, numbers to 30, renting, prayer times. |
| 3 | First month | Everyday life in more depth: home parts, clothing, the pantry and cooking, weather, getting around, animals, body detail, housework, household problems, festivals, money beyond shopping, plus a broader second half of common topics. |
| 4 | Settling in | Wider vocabulary: more specific markets (fish, spices, sweets, cuts of meat), crafts and repairs, nature, customs, fine body detail, describing things precisely. |
| 5 | Enrichment | Specialist, regional or occasional vocabulary: boats and river gear, wild and sea animals, festivals and stage, technical fittings, paper and photo equipment. |

How the order was made (28 Nov 2026):
- Every card got a tier from its purpose (`usefulness` in card.json) and its six words.
- Tiers 1 and 2 and the core first half of tier 3 were then ordered by hand for a sensible progression.
- The rest of each tier is ordered by how common the words are in spoken Bangla, how easy they are (length, conjunct letters, single words before phrases, objects before actions and concepts), and how topics are spread out.
- Sequences are kept in order: numbers 1–6 before 7–12 and so on, family → close family → extended family, body → face → joints, basic market produce before more varieties, basic cooking verbs before specialist ones.

## New cards (Codex)

Put two fields in each new Bangla card's `card.json`:

```json
"deck_tier": 3,
"deck_after": "market-vegetables"
```

- `deck_tier` is **required**: 1–5, using the table above. Ask: *would a newcomer need this in their first days, first weeks, first month, once settled, or only occasionally?* Judge by the six words, not the topic's title. Tiers 4 and 5 are normal for specialist sets. Not every card belongs at the front.
- `deck_after` is optional: the slug of the card this one should follow, for example the next set in a series (`counting-thirty-one-to-thirty-six` after `counting-twenty-five-to-thirty`). Without it, the card goes at the end of its tier.
- `build_web.py --source …` then places the card and writes it into `deck-order.json`, so its position stays fixed. A card with no `deck_tier` is put at the very end with a warning. Fix it by adding the field and rebuilding.
- To move an existing card, move its entry in `deck-order.json` (and change its `tier` if needed), then run `python3 scripts/deck_order.py`.

## The page

- The deck opens where this browser left off, or at card 1 on a first visit. It no longer opens on a random card.
- **Next** and **Prev** follow the teaching order. **New card** and **Coach Me!** still pick at random, without repeats in a session.
- `index.html?card=` accepts a card's id (`?card=home-things`) or its old, stable card number (`?card=1`). Problem-report links use the id.

## Current order

### Tier 1 · First days

| # | Card | Words (English) | Old no. |
|---|---|---|---|
| 1 | প্রথম আলাপে যা বলি | return a salaam alread, ask how the other pers, say that you are well , politely ask someone t, introduce yourself, say that you are learn | 276 |
| 2 | কথা বলার সময় যা করি | apologizing to someone, thanking someone for a, asking permission befo, saying yes with an agr, saying no with a refus, asking someone to spea | 189 |
| 3 | বুঝি না বুঝলে যা বলি | say you understood aft, say you did not unders, say you do not know th, say you remember recog, say a word is familiar, ask to have a look bef | 285 |
| 4 | শেখার সময় যা বলি | ask a speaker to say t, request a slower utter, ask the meaning of a w, ask what a pictured ob, ask whether what you s, ask somebody to write  | 273 |
| 5 | আমি আপনি উনি আর আমরা | first person singular , polite singular second, polite singular third , first person plural we, polite plural second p, polite plural third pe | 298 |
| 6 | এটা ওটা আর এখানে ওখানে | this one beside the sp, that one away from the, these nearby objects, those several objects , here at the speaker's , over there away from t | 277 |
| 7 | এক থেকে ছয় | one, two, three, four, five, six | 50 |
| 8 | লাগবে কি ভালো লাগে কি | say you like something, say you do not like so, say that something is , say there is no need f, say this is the specif, decide to leave it for | 290 |
| 9 | খিদে তেষ্টা আর ঘুম | to feel hungry, full after eating, to feel thirsty, to feel sleepy, to feel too warm, to feel chilly | 144 |
| 10 | সকালের কাজ | to eat, to drink water, to sit, to stand, to sleep, to wake up | 16 |
| 11 | নতুন জায়গায় কী কোথায় | ask where the restroom, ask where to get drink, ask where you can wash, ask permission to sit , ask which way you can , ask where to leave you | 295 |
| 12 | দুপুরের খাবার | cooked rice, roti, cooked lentils, fried egg, whole fried fish, chicken meat | 6 |
| 13 | খাবার চাই নিজের মতো | tell the seller you wi, order a meal to take a, ask for less chilli he, ask for a meal without, ask for a glass of dri, politely decline a sec | 279 |
| 14 | দোকানে জিনিস চাই | ask the store price pe, ask whether a shown it, say that the stock has, ask for only a small a, ask the seller for one, ask a shopkeeper to pu | 278 |
| 15 | সাত থেকে বারো | seven, eight, nine, ten, eleven, twelve | 123 |
| 16 | দোকানের দামে টাকার অঙ্ক | fifty taka, one hundred taka, two hundred taka, five hundred taka, one thousand taka, two thousand taka | 291 |
| 17 | দাম মিটিয়ে যা বলি | ask for the final tota, ask if the listed pric, ask how much payment i, money returned, ask which person shoul, confirm you have paid  | 300 |
| 18 | কেনাকাটার জিনিস | paper taka, loose change, balance scale, receipt, shopping bag, basket | 23 |
| 19 | দিকের নাম | north, south, east, west, to the right, to the left | 48 |
| 20 | রিকশায় উঠতে যা বলি | Bangladeshi pedal pass, person who pedals a pa, ask a rickshaw driver , ask what the fare is f, say that two people wi, agree on the ride and  | 282 |
| 21 | পথে কোথায় ঘুরব | before reaching a brid, just after rounding a , on this side of the ri, across on the other si, go along this road, go through that lane | 283 |
| 22 | বাসা খুঁজতে ঠিকানা বলি | home address written, street name on a neigh, a local residential ne, ground floor of a Bang, third floor apartment , neighboring home immed | 281 |
| 23 | আজ কাল আর কখন | yesterday relative to , today, say you will come tomo, say you will go the da, right now, with no del, after a short delay | 284 |
| 24 | পরিবারের মানুষ | father, mother, older brother, older sister, maternal grandfather, maternal grandmother | 18 |
| 25 | দেখা হলে যা করি | to give a salaam greet, to shake hands, to hug someone, to take leave, to welcome someone, to help someone | 127 |
| 26 | ছোট কথায় কথা এগোয় | reassure someone that , acknowledge that you m, ask whether surprising, ask someone to wait a , say you need to leave , say see you again at t | 299 |
| 27 | শরীরের অংশ | eye, ear, nose, mouth, hand, foot | 21 |
| 28 | কোথায় ব্যথা বলে দেখাই | sore throat at the fro, earache felt on one si, stinging or burning ey, pain in the chest, pain in the hand rathe, pain in one foot while | 288 |
| 29 | শরীর খারাপ | fever, cough, sneeze, toothache, stomachache, itch | 20 |
| 30 | দরকার হলে সাহায্য চাই | ask somebody nearby to, tell others that someo, ask a companion to inf, ask that someone infor, ask for a chance to si, ask someone to stay wi | 294 |
| 31 | জিনিস আনতে নিতে বলি | ask someone to bring a, ask someone to take a , ask someone to leave a, ask somebody to give b, ask somebody to shift , ask someone to keep an | 289 |
| 32 | বাসায় কিছু ঠিক নেই | report that a tap is d, ask whether hot water , report that a ceiling , report that you cannot, report mosquitoes ente, report a kitchen burne | 297 |

### Tier 2 · First weeks

| # | Card | Words (English) | Old no. |
|---|---|---|---|
| 33 | জিনিস কোথায় | above, below, inside, outside, between, behind | 13 |
| 34 | ঘরের জিনিস | bed, pillow, low woven stool, cupboard, ceiling fan, light bulb | 1 |
| 35 | রং | red, blue, green, yellow, black, white | 14 |
| 36 | খাওয়ার বাসন | dinner plate, bowl, spoon, fork, saucer, small tea cup | 3 |
| 37 | চা আর শরবত | water, tea, milk, lime, honey, jaggery | 7 |
| 38 | দিনের ভাগ | dawn, morning, noon, late afternoon, dusk, night | 42 |
| 39 | বাসার ঘর আর উঠান | kitchen room, bedroom, sitting room, dining room, bathing room, household courtyard | 62 |
| 40 | বাজারের ফল | mango, banana, papaya, pineapple, jackfruit, grapes | 5 |
| 41 | জিনিস কেমন আছে | clean, dirty, hot, cold, heavy, light in weight | 34 |
| 42 | নিজের ঘরের আপনজন | husband in a married p, wife in a married pair, son of a parent, daughter of a parent, grandson with an elder, granddaughter with an  | 224 |
| 43 | দিন আর সময়ের হিসাব | wall-mounted clock, wristwatch, sand hourglass, single calendar date, seven-day week, calendar month | 106 |
| 44 | গোসলের জিনিস | bucket, water vessel with spou, gamcha towel, bar of soap, comb, mirror | 11 |
| 45 | বাজারের সবজি | potato, red onion, eggplant, cauliflower, cucumber, leafy greens | 4 |
| 46 | মাপ দেখে বলি | big, small, tall or long, short in height, wide, narrow | 32 |
| 47 | অসুখে কাজে লাগে | medicine, ointment, cotton wool, bandage strip, ice, hot-water bag | 22 |
| 48 | দিনে কখন কী খাই | breakfast meal served , lunch in the middle of, afternoon tea and snac, dinner served at night, a cooked side dish ser, eat a shared meal toge | 286 |
| 49 | ঘড়ি দেখে সময় বলি | one o'clock on an anal, half past one on an an, quarter past two on an, quarter to three on an, ten minutes past four , ten minutes before fiv | 292 |
| 50 | আসা যাওয়ার কাজ | to come toward here, to go away from here, to enter, to exit, to cross, to stop | 51 |
| 51 | গোসলখানার চেনা জিনিস | washbasin fixture, showerhead fixture, ceramic squat toilet p, toilet bowl brush, soap dish, small terry face towel | 226 |
| 52 | কেনাবেচার কাজ | to buy, to sell, to pay the price, to exchange a purchase, to weigh, to choose one | 52 |
| 53 | মন কেমন | happy, sad, to be afraid, to be surprised, anger, tired | 54 |
| 54 | চা বানাই আর চায়ের রকম বলি | Bangladeshi tea kettle, dried black tea leaves, Bangladeshi milk tea, red plain black tea wi, ginger tea, lemon tea | 216 |
| 55 | হাতের কাজ | to open, to close, to wash, to wipe, to read, to write | 17 |
| 56 | ওষুধের দোকানে যা চাই | medicine tablet pill, lidded pill bottle, medicine carton box, medicine measuring spo, liquid oral medicine, prescription sheet for | 236 |
| 57 | রোজ দেখা হয় যাঁদের সঙ্গে | neighbor, playmate, classmate, coworker, landlord or landlady, tenant | 140 |
| 58 | কম বেশি কতটা | more, less, half, twice, all of the group, none at all | 55 |
| 59 | দিন আর সময় জেনে নিই | ask what day of the we, ask for today's calend, ask what time is suita, ask how long a process, warn someone that you , at the agreed time or  | 293 |
| 60 | শরীরের অসুবিধা বোঝাই | headache, backache, difficulty swallowing, vomiting, blocked nose, difficulty breathing | 134 |
| 61 | গাড়িতে উঠে নামি | raise a hand to hail a, place one foot on a ve, stand inside a bus hol, look out of a vehicle , vacate a seat and offe, call out to the driver | 269 |
| 62 | তেরো থেকে আঠারো | thirteen, fourteen, fifteen, sixteen, seventeen, eighteen | 205 |
| 63 | কাজের মধ্যে সময় বের করি | busy at the moment wit, have time and be avail, begin a task at the fi, say a task is still in, say you have finished , take a short pause in  | 287 |
| 64 | দাম আর টাকার হিসাব | to bargain over a pric, to count money, to put money aside, to reduce a price, to record a sale to be, to break a note into s | 126 |
| 65 | বাতি পাখা আর বিদ্যুৎ | turning an electric ro, turning an electric ro, increasing the speed o, plugging an appliance , unplugging an applianc, electricity outage at  | 176 |
| 66 | পাড়ার দরকারি জায়গা | neighborhood shop, market, police station, community health cente, post office, library | 40 |
| 67 | কোন জিনিসের কোন দোকান | tea stall, small rice-meal eatery, medicine shop, barbershop, small dry-goods grocer, sweet shop | 149 |
| 68 | দূরে থাকলে খবর দিই | ask for a short messag, ask someone to send a , ask someone to send a , ask whether someone ca, say that a remote conv, say you will check and | 296 |
| 69 | ভিড়ের মধ্যে চলি | joining a queue at the, cutting into a queue, standing across a pass, walking through a narr, walking nearer to a ca, stepping to one side | 233 |
| 70 | উনিশ থেকে চব্বিশ | nineteen, twenty, twenty-one, twenty-two, twenty-three, twenty-four | 235 |
| 71 | বাসা ভাড়ার কথাবার্তা | to come to view a rent, empty rental home, to pay rent, refundable security de, rental agreement, to move to a different | 147 |
| 72 | নামাজের সময় | mosque, prayer mat, to pray salah, to perform wudu, prayer cap, prayer beads | 31 |
| 73 | পঁচিশ থেকে ত্রিশ | twenty-five, twenty-six, twenty-seven, twenty-eight, twenty-nine, thirty | 280 |

### Tier 3 · First month

| # | Card | Words (English) | Old no. |
|---|---|---|---|
| 74 | বাসার অংশ | door, window, stairs, flat roof, balcony, wall | 12 |
| 75 | পরনের কাপড় | orna scarf, sari, lungi, panjabi kurta, salwar trousers, kameez tunic | 10 |
| 76 | মসলা আর তেল | salt, sugar, mustard seed, cumin seed, cooking oil, ghee | 9 |
| 77 | পথেঘাটে | road, narrow lane, street corner, bridge, river landing, wooden boat | 19 |
| 78 | লেখাপড়ার জিনিস | book, notebook, pen, scissors, glue, envelope | 2 |
| 79 | বাড়ির আশপাশের প্রাণী | cow, goat, hen, duck, cat, dog | 24 |
| 80 | রোদ আর বৃষ্টি | sunshine, shade, rain, storm, cloud, fog | 15 |
| 81 | রান্নার জিনিস | cooking pot, pot lid, kitchen knife, cutting board, wok-like frying pan, cooking turner | 8 |
| 82 | শরীর নাড়ানো | to walk, to run, to jump, to climb up, to bend forward, to crawl | 26 |
| 83 | বাইরে বের হওয়ার জিনিস | closed shoe, sock, eyeglasses, eyeglasses case, umbrella, raincoat | 38 |
| 84 | মুখের ছোট ছোট অংশ | lips, teeth, tongue, cheek, chin, forehead | 85 |
| 85 | শুকনো বাজার | uncooked rice, wheat flour, dried chickpeas, dried peas, peanuts, corn cob | 43 |
| 86 | খুঁজি আর দেখাই | to look for, to find by searching, to hide, to take something out, to look at, to show | 53 |
| 87 | পানির জোগান | water tap, water pipe, tube well hand pump, draw well, earthen water jar, fine strainer | 64 |
| 88 | আব্বা আম্মার দিকের আপনজন | paternal grandfather, paternal grandmother, paternal uncle, wife of paternal uncle, maternal uncle, wife of maternal uncle | 148 |
| 89 | দেওয়া নেওয়া আর সরানো | to give, to take, to catch, to throw, to push, to pull | 27 |
| 90 | রান্নায় ঘ্রাণ আর ঝাল দিই | ginger root, garlic bulb, green chili, onion greens, fresh coriander leaves, mint leaves | 138 |
| 91 | বাসা পরিষ্কার করা | grass broom, dustpan, rubbish bin, coconut husk scrubber, cleaning rag, doormat | 57 |
| 92 | কথা আর ইশারা | to speak, to listen, to laugh, to cry, to call out, to gesture | 49 |
| 93 | খাবারের স্বাদ | sweet tasting, sour tasting, chili hot, bitter tasting, salty tasting, bland tasting | 78 |
| 94 | পথে যাঁদের দেখি | passenger, vehicle driver, pedestrian, guard, roving street seller, market porter | 112 |
| 95 | জিনিস গুছিয়ে রাখা | to fold, to hang, to tie, to wrap, to put down, to lift | 28 |
| 96 | বাসায় বিছাই আর ঝোলাই | mosquito net, curtain, woven floor mat, mattress, shelf unit, open clothing rack | 71 |
| 97 | চোট লাগলে যা বলি | to get a minor cut, to get a burn, to twist a joint, to swell up, bruise, to feel dizzy | 86 |
| 98 | কাজ কখন আর কতবার | quickly, slowly, together at the same t, taking turns, once, repeatedly | 124 |
| 99 | নাস্তার খাবার | puffed rice, flattened rice, puffy fried pastry, flat fried pastry, steamed rice cake, jalebi | 30 |
| 100 | চলার পথের জিনিস | roadside passenger she, streetlight, zebra crossing marks, raised sidewalk, marked parking area, roadside drainage chan | 94 |
| 101 | নিজেকে ধুয়ে গুছাই | to brush teeth, to shave a beard, to comb hair, to cut hair, to bathe, to clip nails | 83 |
| 102 | দেখে তফাত বলি | new, old or worn from use, expensive, inexpensive, deep, shallow | 141 |
| 103 | ঘরের কাজ করি | to sweep a floor, to throw rubbish away, to scrub dishes, to wash clothes by han, to dry clothes on a li, to spread out bedding | 77 |
| 104 | চেনা পোকামাকড় | mosquito, ant, housefly, cockroach, caterpillar, butterfly | 35 |
| 105 | দরকারি কাগজপত্র | written letter, small written note, identity document card, printed photograph, signature, fingerprint impression | 63 |
| 106 | খাবারের অবস্থা বুঝি | unripe, ripe, freshly made, stale, to set solid when cool, to melt | 119 |
| 107 | জিনিসের কী হাল | wet, dry, broken into pieces, having a hole, turned upside down, flattened | 88 |
| 108 | জামা গায়ে যা করি | putting on a shirt or , taking off a shirt, rolling up a sleeve, looping fabric around , covering one's head wi, tucking cloth into a w | 183 |
| 109 | শীতের জিনিস | warm shawl, stitched quilt, thick blanket, warm upper garment, gloves, knit winter hat | 65 |
| 110 | হাত পা আর ঘাড়ের ভাঁজ | back of the neck, shoulder, elbow, wrist, knee, ankle | 84 |
| 111 | পথে যেসব কাজ করি | to wait, to set out for a desti, to follow someone, to make way for someon, to change routes, to lose one's way | 116 |
| 112 | বুক পিঠ আর পেট | chest, back of the torso, waist, belly, navel, fingernail | 102 |
| 113 | ভাতের পাশে যা খাই | fried egg served whole, fish in a thin Bengali, boiled egg in Bengali , Bangladeshi lightly fr, Bangladeshi seasoned m, Bangladeshi fruit pick | 184 |
| 114 | বাসার ঝামেলা | to leak or drip, to get clogged, stain, to grow mold, crack, to get dented | 47 |
| 115 | অল্প জিনিস কীভাবে বলি | one tied bunch of gree, one handful of dry foo, one pinch of a powder, one sip of a drink, one small mouthful of , one single liquid drop | 168 |
| 116 | বিদ্যুৎ আর আলো | electric cable, utility pole, wick oil lamp, wax candle, wall light switch, handheld light | 107 |
| 117 | রাস্তার যে জায়গাগুলো বলি | intersection with four, road junction with exa, roundabout with circul, entrance of a narrow r, the end of a dead-end , urban road flyover | 185 |
| 118 | রান্নার ধাপ | to cut into slices, to peel, to stir, to pour, to knead dough, to roll out dough | 29 |
| 119 | বাসায় মেহমান এলে | holding a door open fo, laying out a mat for g, offering a seat by bri, offering someone a gla, uncovering already ser, pouring tea for a hous | 234 |
| 120 | রমজান আর ঈদ | meal at sunset to brea, early meal before the , date fruit, new Eid moon crescent, new clothes for Eid, Eid gift money | 92 |
| 121 | ভরা ফাঁকা আর আঁট ঢিল | completely full contai, completely empty conta, tight fitting garment, loose fitting garment, thick material in cros, thin material in cross | 167 |
| 122 | ছোটখাটো মেরামত | hammer, nail, handsaw, wood, padlock, key | 25 |
| 123 | বৃষ্টিতে বাইরে যা হয় | heavy pouring rain, fine light drizzle, standing water coverin, opening an umbrella, getting soaked in the , one foot stuck in mud | 195 |
| 124 | হাটে গরম গরম নাশতা | fuchka stuffed crisp s, chotpoti pea and tamar, spiced puffed-rice sna, Bangladeshi onion lent, battered Bangladeshi e, lentil-filled fried fl | 154 |
| 125 | টাকা দিই নিই আর পাঠাই | deposit cash at a bank, withdraw cash from a c, send money to a distan, borrow money from anot, repay money borrowed e, reconcile a written to | 251 |
| 126 | কী দিয়ে বানানো | paper, fabric, glass material, iron, soil, stone | 39 |
| 127 | পথ কেমন | near, far, straight, curved, steep incline, gently sloping | 66 |
| 128 | মাথায় আর মুখে চুল | hair on the head, beard on chin and chee, moustache on upper lip, sideburns of hair in f, bald area on crown of , line parting hair on t | 163 |
| 129 | প্রকৃতির জায়গা | river, canal, pond, open wetland, hill, forest | 36 |
| 130 | চলার বাহন | passenger car, airplane, ship, raft, handcart, oxcart | 61 |
| 131 | আগুন জ্বালানো | stove, charcoal, matches, fire, smoke, ash | 44 |
| 132 | বাজারের মাছ চিনি | hilsa, rohu carp, stinging catfish, climbing perch, freshwater prawn, small freshwater barb | 82 |
| 133 | মালপত্র গুছিয়ে নিই | to organize belongings, to fill a bag, to empty a container, to load goods onto a c, to put a load on the s, to set a carried item  | 95 |
| 134 | সবজির লতা আর শিকড় | carrot, white radish, pumpkin, bottle gourd, yardlong bean, flat hyacinth bean | 60 |
| 135 | খাবার কাটলে যা দেখি | irregular chunk of foo, long thin slice, separated clove, bundle tied together, detached fruit peel, detached food stalk | 89 |
| 136 | আমাদের মাথার ওপর আকাশ | sun, full moon, stars in the sky, rainbow, hail falling, lightning flash | 145 |
| 137 | দল আর জোড়া করে বলি | one pair of matching o, one bunch held togethe, one heap, one tied load, one flock of birds, one group of people | 229 |
| 138 | দুধ থেকে যা হয় | yogurt, rice pudding, butter, milk skin, paneer cheese, crumbled fresh milk cu | 67 |
| 139 | হাত পায়ের ছোট অংশ | palm side of the hand, back side of the hand, the fingers of a hand, the thumb of a hand, toes of a foot, sole of a bare foot | 188 |
| 140 | যে পাত্রে রাখি | wide glass storage jar, small lidded tin, large earthen storage , water storage barrel, flower vase, small glass vial | 87 |
| 141 | দেশি রান্নায় আরও সবজি | okra, pointed gourd, taro corm, sweet potato, cabbage, ridged luffa gourd | 111 |
| 142 | পায়ে পরি আর জুতায় লাগাই | simple open-backed eve, traditional wooden kha, traditional embroidere, shoelace, outer bottom sole of a, decorative anklet with | 162 |
| 143 | বাঁধি আর আটকে রাখি | jute rope, metal chain, hair ribbon, plain fastener ring, magnet, clothespin | 128 |
| 144 | আব্বা আম্মার ভাইবোনের ঘর | father's sister, husband of father's si, mother's sister, husband of mother's si, brother's son relative, sister's son relative  | 191 |
| 145 | এই দেশের আরও ফল | guava, java plum, lychee, hog plum, Indian jujube, watermelon | 79 |
| 146 | বের হওয়ার সময় যে জামাকাপড় পরি | short cotton Banglades, men's narrow drawstrin, sleeveless shirt, woven shoulder shawl, wrapped head turban, long Bangladeshi outer | 161 |
| 147 | পাড়ায় জিনিস কিনি যেসব দোকানে | book shop storefront, fabric shop storefront, shoe shop storefront, fruit shop storefront, flower shop storefront, fish shop storefront | 211 |
| 148 | ডাকে জিনিস পাঠাই | street posting box, postmark on an envelop, wrapped parcel for pos, postal delivery sack, return address on an e, recipient address on a | 204 |
| 149 | মানুষের বয়স | newborn baby, young child, teenager, young adult woman, middle-aged adult, older adult | 91 |
| 150 | দাওয়াতের খাবার | kacchi biriyani, bhuna khichuri rice an, chicken korma, kebab, sweet orange rice, set milk dessert with  | 93 |
| 151 | বিছানায় আর ঘুমের সময় | thick traditional wint, flat bed sheet, removable pillowcase, long cylindrical huggi, light cotton sleepwear, bed mosquito net suppo | 242 |
| 152 | চলার সময় ছোটখাটো ঝামেলা | to trip over something, to slip on a surface, to bump into someone, to be knocked flying, to become bent out of , to be stuck to a surfa | 146 |
| 153 | ঠান্ডা যা খাই | water from a tender co, pressed sugarcane juic, bael sharbat, lemon water, Bengali diluted yogurt, spiced Bangladeshi yog | 118 |
| 154 | জিনিসের আকার | square, rectangle, round or circular, oval, star-shaped, five-sided | 33 |
| 155 | ছোট বাচ্চার হাতে আর মুখে | handheld baby rattle, whole cloth doll, small wooden toy car, wooden horse toy, infant milk feeding bo, cloth bib for feeding | 206 |
| 156 | গুঁড়া আর বাটা মসলা | whole dried red chilli, ground turmeric powder, ground red chilli powd, ground coriander seed , prepared mustard seed , fresh crushed ginger p | 237 |
| 157 | রান্নার আরও মসলা | cinnamon stick, cloves, cardamom, black peppercorn, bay leaf, fresh turmeric root | 80 |
| 158 | পাত্রের কোন অংশটা | opening at the mouth o, detached bottle screw , looped handle of a tea, handle on a cooking po, underside of a bowl, outer rim of a plate | 244 |
| 159 | লিখে দেখে ঠিক করি | cross out an already w, correct a misspelling , copy text by looking a, underline important wr, fill in a blank box in, write a short note in  | 264 |
| 160 | ছবি দেখে নিয়ম বুঝি | no entry for pedestria, removing footwear befo, handwashing station, public seating space, path closed by barrier, no littering notice | 175 |
| 161 | অসুখে পাশে থাকি | to take a temperature, to feel a pulse, to take a breath, to rinse a small scrap, to wrap a bandage, to apply ointment | 117 |
| 162 | মেরামতের সময় যা করি | to hammer a nail into , to saw along wood, to tighten a screw, to drill a neat hole, to apply lime whitewas, to join broken pieces  | 160 |
| 163 | চুল ধুয়ে গুছিয়ে নিই | hair dryer, hairbrush, liquid soap used for w, hair oil, elastic hair tie, claw hair clip | 230 |
| 164 | শরীর যেভাবে রাখি | to lean against suppor, to lie down, to roll one's body ove, to turn around on one', to kneel on the ground, to squat low | 104 |
| 165 | জিনিস একা আর মিলে বয়ে নিই | carrying a load in one, carrying an object wit, lifting an object from, carrying a load on the, carrying a load on the, two people carrying on | 249 |
| 166 | কাজে যাদের দেখি | shopkeeper, customer, tailor, weaver, mason, carpenter | 41 |
| 167 | রাস্তায় কাজের গাড়ি | Dhaka pedal tricycle f, fire service engine tr, ambulance patient tran, Bangladesh police pick, municipal road-waterin, Bangladeshi flatbed go | 255 |
| 168 | ছোট বড়দের যত্ন নিতে যা করি | to gently stroke someo, to take a child onto o, to give someone a bite, to help someone lie do, to put a blanket or sh, to help someone walk b | 173 |
| 169 | ভাতের সঙ্গে ছয় রকম ভর্তা | Bangladeshi mashed pot, smoked eggplant bhorta, dried fish bhorta, mashed lentil bhorta, fresh coriander leaf b, prepared mustard seed  | 250 |
| 170 | ঘরের যে জায়গায় জিনিস থাকে | space underneath a bed, top of a cupboard, ledge at the bottom of, concealed space behind, outer edge of a flat r, small recessed wall ni | 212 |
| 171 | কীভাবে শুই আর ঘুমাই | lying flat on the back, lying on the stomach f, lying on one side with, snoring while asleep, dozing off while seate, sleeptalking with eyes | 258 |
| 172 | বাংলার ছয় ঋতু | summer season, monsoon season, autumn season in Bangl, late autumn harvest se, winter season, spring season | 73 |
| 173 | রাস্তায় আর ঘরে যে দাগ দেখি | no smoking pictogram, pictogram showing non-, pictogram of car parki, wordless Bangladeshi r, downstairs arrow with , wet-floor warning with | 268 |
| 174 | বাচ্চাকে বসাই আর সঙ্গে নিই | baby stroller pushchai, baby high chair, baby pacifier, reusable cloth baby di, soft baby swaddle wrap, soft fabric child carr | 248 |
| 175 | মেঝে কাচ আর বাসন পরিষ্কার করি | wet floor mop, handheld glass squeege, dishwashing liquid soa, dish towel, water spray bottle, waterproof cleaning gl | 246 |
| 176 | খাওয়ার পর বাসন গুছাই | soaking a used cooking, scrubbing the undersid, rinsing a plate under , draining rinse water f, air drying dishes in a, stacking clean plates  | 220 |
| 177 | জিনিসে যে ঝামেলা দেখা যায় | metal becoming rusty, wall plaster falling o, a fitted handle becomi, a rope snapping into t, a knot slipping open, water overflowing a fi | 197 |
| 178 | বাসায় যাঁদের ডাকি | plumber repairing a ho, household electrician , household waste collec, pest-control worker ca, home cleaner wiping a , home removal worker ha | 271 |
| 179 | বাসার দরজায় যা করি | ring the electric bell, look out through a fro, turn a key to unlock a, leave a door slightly , hold a door wide open , wipe shoe soles on a m | 265 |

### Tier 4 · Settling in

| # | Card | Words (English) | Old no. |
|---|---|---|---|
| 180 | গাছের অংশ | flower, flower bud, seed, roots, leaf, branches | 59 |
| 181 | যাঁরা হাতে কাজ করেন | crop farmer, fisherman, boatman, cobbler, blacksmith, potter | 105 |
| 182 | খাবার কাপড় আর গাছের কাজ | cook preparing meals f, washerperson who washe, gardener who tends pla, market butcher selling, fishmonger at a local , street milk seller car | 165 |
| 183 | পাড়ায় নানা কাজ করেন যাঁরা | barber cutting hair, private tutor who teac, street newspaper vendo, painter who paints a b, muezzin calling the az, street bread seller | 190 |
| 184 | সেলাইয়ের জিনিস | sewing needle, sewing thread, button, tailor measure, stitched seam, torn fabric | 45 |
| 185 | আরও ছয়টা চেনা প্রাণী | house gecko, frog, snake, turtle, mouse, bat | 99 |
| 186 | সাজের গয়না | earring, nose stud, bangle, finger ring, necklace, hair pin | 46 |
| 187 | বাড়িতে পালা আরও প্রাণী | domestic water buffalo, domestic sheep, domestic horse, domestic donkey, domestic rabbit, domestic goose | 136 |
| 188 | বিয়ে আর দাওয়াত | groom, bride, guest, written invitation, flower bouquet, flower garland | 69 |
| 189 | বাড়ির কোন দিকটা | room floor, inside corner of a roo, raised doorway thresho, sliding door bolt, compound gate, fence | 108 |
| 190 | ধাতু পাট আর চামড়া | gold metal, silver metal, copper metal, brass metal, jute fiber, leather | 109 |
| 191 | শেখার সময় যা করি | to draw, to erase a mark, to count objects, to measure length or s, to match like things, to sort things out | 101 |
| 192 | মাছের গায়ে আর ভেতরে | overlapping scales fro, fish spine and bones, fish gills, fish side fin, fish head portion, fish tail portion | 202 |
| 193 | বাড়ি বানানোর জিনিস | brick, sand, gravel, bamboo, ladder, upright post | 58 |
| 194 | জামাকাপড়ের কোন দিক | garment sleeve, neck opening of a garm, cloth fringe, garment lining, woven garment border, loose decorative sari  | 143 |
| 195 | হাত দিয়ে ছুঁয়ে দেখি | smooth surface, rough surface, soft to the touch, hard to the touch, sharp edged, blunt edged | 56 |
| 196 | মাটিতে তাকালে যা দেখি | wet mud, dry loose dust, bare human footprint, tire tread impression , hole in the ground, earthworm | 150 |
| 197 | জিনিস সাজানোর দিক | in front of, beside, all around, in a row, crosswise, lengthwise | 76 |
| 198 | খোসার ভেতরে যে ফল | orange fruit, pomelo, pomegranate, custard apple, sapodilla, Bangladeshi Indian oli | 137 |
| 199 | পাড়ার পাখি | house crow, domestic pigeon, house sparrow, common myna, egret, owl | 70 |
| 200 | জিনিস রাখি আর নিয়ে যাই | full jute sack for bul, empty folded paper con, small bundle tied in a, small ordinary rectang, large metal storage tr, soft long-strap should | 177 |
| 201 | গাছের ফল আর রস | mature brown coconut, young green coconut, ripe palmyra palm frui, areca nut, tender palmyra jelly k, fresh date palm sap co | 207 |
| 202 | ছবি আঁকার জিনিস | artist brush, drawing ink, writing chalk, wax drawing crayon, paint-mixing palette, small paint box | 74 |
| 203 | খেলার জিনিস | kite, spinning top, playing cards, chess piece, swing, jump rope | 37 |
| 204 | চোখ কান আর গালের অংশ | upper eyelid, eyelashes along the up, pupil at the center of, soft lobe at bottom of, nostrils at the base o, a dimple in the cheek | 187 |
| 205 | ঘরে আর ফুলের কাছে ছোট পোকা | wood-eating termite, bed bug, head louse, house spider, Asian honey bee, paper wasp | 172 |
| 206 | এলাকার বড় খোলা জায়গা | playing field, fruit orchard, cemetery, open Eid prayer ground, brick kiln, factory | 90 |
| 207 | কাঠ মাটি আর মেরামতের সরঞ্জাম | screwdriver, pliers, woodworking chisel, sandpaper, long-handled spade, short hand hoe | 131 |
| 208 | দাঁতের কোন জায়গায় | pink gum tissue along , human front incisor te, human back molar teeth, visible gap between tw, visible tooth cavity, removable complete den | 253 |
| 209 | আলো আর অন্ধকারে যা দেখি | ordinary light falling, very dark interior wit, dim faint flickering l, very bright dazzling l, blurred unfocused visu, clearly defined sharp  | 194 |
| 210 | নানা রকম বাড়ি | small straw hut, earthen-walled home, bamboo-walled home, single-storey home, two-storey home, tall multi-storey buil | 115 |
| 211 | পিঠা আর মিষ্টি নাশতা | cooked sweet semolina , milk vermicelli puddin, popped paddy flakes, jaggery-coated puffed , plain round steamed ri, rolled filled pitha | 201 |
| 212 | মসজিদের চারপাশে যা দেখি | minaret tower of a mos, main architectural dom, prayer niche in the wa, raised stepped mosque , mosque ablution area, shoe shelves at mosque | 192 |
| 213 | মুখ আর নাক দিয়ে যা করি | to sniff, to taste a little to f, to take a bite, to chew, to swallow, to blow air out | 96 |
| 214 | আঁচে রান্না করি | to fry in oil, to boil solid food, to steam food, to bring water to a bo, to toast on dry heat, to finish cooking on l | 81 |
| 215 | খাবার দেওয়ার আগে | to serve food, to divide into shares, to sprinkle over food, to squeeze juice by ha, to strain food, to grind into powder | 114 |
| 216 | কাপড় নিয়ে যে কাজ করি | to iron cloth, to make pleats, to leave fabric soakin, to wring out cloth, to remove a stain, to dye cloth | 133 |
| 217 | ঘরে আর গায়ে সুগন্ধ | concentrated attar per, rose water bottle besi, burning incense sticks, small covered incense , small white pieces of , atomizer bottle of bod | 259 |
| 218 | ময়দা দিয়ে বানানো খাবার | layered plain Banglade, puffed white flour luc, Dhaka flaky baked baka, small diamond Bengali , egg-stuffed Mughlai pa, loaf of sliced sandwic | 155 |
| 219 | শব্দ করি যেভাবে | to clap hands, to knock lightly, to hum, to play a flute, to shout, to whisper | 97 |
| 220 | দরজা জানালার ছোট অংশ | fixed metal window bar, door pull handle, door butt hinge, door ring knocker, complete wooden door f, door lock keyhole | 159 |
| 221 | দেখতে কেমন লাগে | glossy and reflective, dull from wear, deep shade of a color, pale shade of a color, transparent, murky liquid | 100 |
| 222 | জিনিস নিজের মতো নড়ে বদলায় | object swaying from si, an object spinning aro, an object floating at , an object sinking belo, an object bursting fro, a flame going out | 166 |
| 223 | রান্নাঘরের হাতিয়ার | kitchen tongs, Bengali upright kitche, flat stone grinder, brass mortar and pestl, broad lidded cooking p, stove pot support grat | 135 |
| 224 | নিজের যত্নের জিনিস | handkerchief, tooth-cleaning twig, kohl powder, henna dye, nail clipper, traditional barber raz | 68 |
| 225 | মুখে যা করে দেখাই | to wink with one eye, to blink, to yawn, to twist one's lips, to furrow the brows, to shake the head side | 122 |
| 226 | চালের রকম চিনে নিই | raw non-parboiled whit, dry Bangladeshi parboi, fine scented short gra, whole red bran rice, small broken rice kern, white rice flour | 210 |
| 227 | এখানকার চেনা গাছ | coconut palm, areca palm, banana plant, palmyra palm, banyan tree, clump of growing bambo | 98 |
| 228 | আঙুল আর তালু দিয়ে | to poke with the tip, to press a button, to pinch, to scratch with finger, to rub back and forth, to press down with a p | 129 |
| 229 | মিষ্টির দোকানে যা খাই | rasmalai sweet in thic, molded sandesh sweet, chomchom sweet, boondi laddu sweet, square barfi sweet, airy batasha sugar swe | 139 |
| 230 | গাছ লাগানো থেকে তোলা | to dig soil, to sow seeds, to water a plant, to plant a seedling, to pull weeds, to pick a vegetable fr | 130 |
| 231 | চোখ কান মুখের ভঙ্গি | opening the mouth wide, putting a finger to th, baring the teeth rathe, sticking the tongue ou, cupping one ear to hea, covering both ears wit | 182 |
| 232 | বাদাম আর শুকনা ফল কিনি | shelled elongated almo, whole cream cashew nut, green pistachio kernel, whole walnuts and expo, small dark dried raisi, dried alu bukhara sour | 260 |
| 233 | খেলার মাঠে যা কাজে লাগে | playground slide, playground seesaw, football for play, flying disc for play, standing net for court, handheld referee whist | 239 |
| 234 | মাংস কিনতে যে অংশ চিনি | raw chicken drumstick , whole raw three-sectio, raw chicken livers at , raw beef rib section, freshly minced beef me, beef soup marrow bones | 254 |
| 235 | হাত দিয়ে আলাদা আর এক করি | untying a knot by hand, tearing paper into two, spreading objects out , rolling up a laid-out , shaking a sealed conta, shaking dust off a clo | 209 |
| 236 | বই খুলে ভেতরটা চিনি | book cover, bound spine of a book, open leaf of a book, illustration printed i, bookmark marking a pag, table of contents in a | 228 |
| 237 | ঝোল আর ভাজির সবজি | bitter gourd, snake gourd, unripe papaya for cook, ash gourd, green cooking banana, moringa pods eaten | 151 |
| 238 | হাটে যে শাক পাই | spinach leaves sold in, red amaranth greens, Malabar spinach vine g, water spinach greens, amaranth grown for edi, bottle gourd vine tips | 152 |
| 239 | গাড়ির চেনা অংশ | car road wheel and tyr, car steering wheel, car side-view mirror, rear car tail light, car driver's seat, car windscreen | 227 |
| 240 | রান্নায় দিই ছোট ছোট দানা | Bengali five whole see, whole black nigella se, whole fenugreek seeds, whole fennel seeds, whole white poppy seed, whole white sesame see | 180 |
| 241 | খাবারের ছোঁয়া আর কামড় | crispy food texture, sticky food texture, juicy food texture, fluffy loose rice grai, thick gloopy food text, hollow interior of puf | 157 |
| 242 | পথে আর বাড়ির কাছে চেনা গাছ | mango tree, jackfruit tree, neem tree, tamarind tree, red silk cotton Bombax, kadam burflower tree | 169 |
| 243 | শরীর যেভাবে নড়াই | stretching both arms o, raising both arms over, sitting with legs stre, sitting cross-legged, standing on the balls , walking quietly on one | 198 |
| 244 | সেলাই দিয়ে জামা ঠিক করি | sewing a button onto c, sewing a patch on torn, threading a needle, tying a knot in sewing, unpick a stitched seam, shortening a garment s | 178 |
| 245 | বাজারে ছয় রকম ডাল | orange split red lenti, yellow split mung bean, split black gram, split yellow peas, split grass peas, split Bengal gram | 203 |
| 246 | শরীর দেখে উঁচু নিচু বলি | within easy arm reach, just beyond arm reach, at the same height, pass directly above so, water coming up exactl, water coming up exactl | 274 |
| 247 | রুটি বেলা আর খাবার তোলা | tawa griddle for flatb, South Asian wooden rol, low round board for ro, fixed Bengali coconut , deep metal cooking lad, flat perforated frying | 158 |
| 248 | চশমায় কী দেখি আর ধরি | transparent prescripti, folding temple arm of , adjustable nose pad on, small microfiber cloth, dark-tinted sunglasses, eye test chart in a ro | 272 |
| 249 | কাপড়ের গায়ে যে ছাপ | striped cloth, checked cloth, polka-dotted cloth, floral print, embroidered design, plain solid-colored cl | 121 |
| 250 | রান্নার আগে আর রান্নার মাঝে | to grind ingredients i, to grate a coconut, to whisk eggs, to mash a potato, to drain starchy cooki, to reduce sugar syrup  | 156 |
| 251 | জুতা পরিষ্কার আর ঠিকঠাক করি | polish a leather shoe , wax shoe polish in an , short broad shoe-clean, long curved shoehorn, detached removable ins, raised heel block at t | 270 |
| 252 | পাড়ায় আর হাটে কাজের জায়গা | open-air cattle market, wholesale fish market , local rice hulling mil, Bangladeshi madrasa sc, neighborhood sewing wo, local dairy farm | 174 |
| 253 | ফল কাটলে ভেতরে কী দেখি | orange flesh inside a , large flat mango stone, tiny brown seeds insid, individual lime or lem, removed firm central a, white layer beneath th | 262 |
| 254 | আগুনের সময় কাজে লাগে | portable fire extingui, coiled fire-fighting w, electric fire alarm be, manual fire alarm call, fire-service helmet wi, unfolded fire blanket  | 256 |
| 255 | ঘরে বা বাইরে ব্যায়াম করি | dumbbell with fixed we, kettlebell with broad , powered treadmill with, foam mat for floor exe, stationary exercise bi, elastic resistance ban | 261 |
| 256 | খাবারের দোকানে যা দেখি | restaurant dining menu, broad carry tray for m, table pepper mill grin, small Bangladeshi chut, lidded soup tureen for, heat-resistant mitt fo | 263 |
| 257 | খাবার নিয়ে যাই আর ঠান্ডা রাখি | stacked steel meal car, reusable drinking-wate, lidded picnic basket, insulated flask for ho, insulated lidded cold-, ice cube tray | 232 |
| 258 | দূরে গেলে সঙ্গে নিই | travel backpack, neck travel pillow, sleep eye mask, luggage identification, handheld luggage scale, strap-mounted travel c | 241 |
| 259 | অসুখ দেখাতে যে জিনিস লাগে | clinical thermometer o, stethoscope, blood pressure cuff, eye medicine dropper b, underarm crutch, dental hand mirror | 223 |
| 260 | খাবার ভালো রাখতে যা করি | sun-drying fresh fish, fully dried fish, putting fish on ice, covering food with a p, covering food with sal, keeping pieces of food | 196 |
| 261 | দোকানে কাপড় বেছে কাটি | holding a piece of fab, unfolding cloth to ins, holding two fabrics si, marking a cloth edge w, measuring cloth with a, cutting cloth from the | 245 |
| 262 | চুলার পাশে আরও কাজ | filling a pastry dough, shaping a lentil fritt, tempering whole spices, frying down a wet spic, lowering a stove flame, descaling a whole fish | 179 |
| 263 | দুধ ঘরে এলে যা করি | milking a dairy cow by, straining fresh milk t, heating milk in a pot, adding starter to set , lifting butter from ch, heating butter to make | 218 |
| 264 | পাউরুটি বানাতে যা লাগে | small granules of dry , risen bread dough with, open rectangular loaf , long-handled wooden ba, firm browned bread cru, soft porous inner crum | 267 |

### Tier 5 · Enrichment

| # | Card | Words (English) | Old no. |
|---|---|---|---|
| 265 | বনের বড় আর ছোট প্রাণী | Asian elephant, monkey, South Asian sloth bear, spotted deer, Bengal tiger, golden jackal | 113 |
| 266 | সুর আর তালের জিনিস | bamboo flute, one-string lute, Bangladeshi barrel dru, tabla pair, hand bell, hand cymbal pair | 72 |
| 267 | নৌকার যে অংশগুলো কাজে লাগে | steel boat anchor, wooden boat rudder ass, cloth sail of a river , vertical wooden mast o, planked deck of a boat, upturned bow of a boat | 225 |
| 268 | নদী সাগর আর পাড় | river sandbar, island, raised river embankmen, waterfall, estuary at a river mou, sea | 125 |
| 269 | গাছের ছোট বড় অংশ | thick tree stump after, bark of a tree, tip of a growing twig , upright supporting ste, tender newly emerging , sharp plant thorn | 199 |
| 270 | পানি আর পাড়ের প্রাণী | small freshwater ricef, pond apple snail, live freshwater mussel, crocodile, Ganges river dolphin, freshwater leech | 208 |
| 271 | টক আর ঘ্রাণওয়ালা দেশি ফল | hard-shelled bael frui, tamarind pods, five-ridged star fruit, Burmese grape fruit cl, monkey jack deua fruit, Indian gooseberry amla | 170 |
| 272 | মাছ ধরি নৌকা চালাই | throw fishing net, traditional dome-shape, fishing hook, fishing rod, small woven basket tha, boat oar | 120 |
| 273 | বাড়ির পুরোনো দিনের জিনিস | traditional low wooden, woven manual hand fan, traditional winnowing , wide grain sieve, shallow woven platter, betel serving box | 132 |
| 274 | মেলায় যা দেখি আর করি | Bangladesh village fai, traditional fair Ferri, traditional Bangla pup, Bangladesh horse-drawn, toy shop stall at a fa, hand-painted clay fair | 213 |
| 275 | ক্ষেতখামারের জিনিস | paddy stalk, cultivated field, rice straw, dried cow dung pat, sickle, plough | 75 |
| 276 | মাছের বাজারে আরও মাছ | silver pomfret, catla carp, Wallago attu freshwate, pabda butter catfish, mola carplet, tengra striped freshwa | 153 |
| 277 | পানিতে চলার নৌকা | Bengali sailboat with , small open Bangladeshi, passenger boat shuttli, traditional open fishi, large cargo-carrying r, wooden riverboat with  | 186 |
| 278 | চারপাশে দেখি এমন উপকরণ | raw flexible rattan ca, loose fibers separated, raw sheep's wool, bird feather, empty bivalve shell, solid natural beeswax | 200 |
| 279 | ভোরে আর পানির ধারে যে পাখি দেখি | Oriental magpie robin, white-throated kingfis, black drongo, Asian koel, Baya weaver bird, rose-ringed parakeet | 171 |
| 280 | বাংলাদেশের চেনা ফুল | Bangladeshi water lily, lotus flower, hibiscus bloom, marigold flower, night-flowering jasmin, gardenia blossom | 110 |
| 281 | ধান থেকে ভাত পর্যন্ত | rice seedling, to cut ripe paddy stal, to thresh paddy, to dry paddy after har, to winnow rice, to cook plain rice | 142 |
| 282 | ছাতার কোন অংশটা | canopy fabric on an op, metal canopy rib of an, curved grip of an umbr, long center shaft of a, tip cap at the top of , wraparound fastener st | 257 |
| 283 | সাগরে যে প্রাণীগুলো দেখি | shark, seahorse, jellyfish, sea star, branch coral, large spiral marine co | 247 |
| 284 | মাঠে যে খেলাগুলো খেলি | hopscotch, blind man's buff, hide-and-seek, kabaddi, tug of war, arm wrestling | 103 |
| 285 | তেল হয় যে গাছ আর দানা থেকে | yellow mustard blossom, sesame plant with seed, sunflower head, peanut plant with root, flaxseed grains, rice bran | 221 |
| 286 | নদীর পানিতে যা বদলায় | riverbank between wate, one-direction water cu, cresting surface wave , high or rising tide ag, low or receding tide a, an eddy swirling in ri | 193 |
| 287 | কাপড়ের রকম চিনে কিনি | plain woven cotton clo, lustrous silk cloth, ultrafine translucent , patterned Bangladeshi , embroidered nakshi kan, handspun khadi cotton  | 217 |
| 288 | ডাঁটা ফুল আর বিচির তরকারি | edible taro stolons, small edible taro corm, banana blossom, turnip root, edible jackfruit seeds, pumpkin blossom used | 181 |
| 289 | ফুলের গন্ধ আর রং | red garden rose, Arabian jasmine blosso, tuberose flower spike, royal poinciana flower, pink Madagascar periwi, blue butterfly pea blo | 222 |
| 290 | মঞ্চে সাজ আর সরঞ্জাম | stage curtain, stage spotlight, theatrical face mask, theatrical crown prop, handheld megaphone, portable stage stairs | 240 |
| 291 | খবরের কাগজে কোথায় কী দেখি | newspaper front page, large news headline, caption beneath a news, newspaper weather pane, newspaper classifieds, newspaper sports repor | 231 |
| 292 | পুকুরপাড় আর মাঠের গাছ | floating water hyacint, pond algae covering a , white kash grass plume, tall wetland reed clum, low Bermuda grass spri, Indian cork shola aqua | 215 |
| 293 | গায়ে ছোট দাগ আর গুটি | small flat dark skin m, small rough raised war, fully healed linear cu, multiple facial wrinkl, brown melasma patches , group of small rash bu | 164 |
| 294 | গাছের বাড়তি যত্ন | pruning a plant branch, grafting a live saplin, tying a sapling to a s, picking one flower by , removing dry fallen le, repotting a small plan | 219 |
| 295 | ছবি তুলি আর রেখে দিই | photographic camera, detached photographic , photography tripod, camera flash unit, photo album, wooden photo frame | 243 |
| 296 | দর্জির পাশে যে জিনিসগুলো থাকে | sewing machine, spool for winding thre, metal sewing thimble, cushion for holding ne, box for sewing tools, paper clothing pattern | 238 |
| 297 | মাটির পাত্র বানানোর ধাপ | kneading potter's clay, setting clay on a pott, widening the mouth of , lifting formed wet cla, air drying clay pots, firing clay pots | 214 |
| 298 | কাগজ গুছিয়ে রাখি | desk stapler for bindi, tabbed document folder, two-hole paper punch, foldback paper binder , desktop paper shredder, stacked desk letter tr | 252 |
| 299 | কল আর নল ঠিক করার জিনিস | short internally threa, right-angle water pipe, removable mesh aerator, flat rubber washer dis, main water supply shut, spool of white pipe-th | 266 |
| 300 | রাস্তায় কাজের সময় যা দেখি | road excavation vehicl, portable rotating drum, construction hard hat , temporary bright orang, high-visibility vest w, road roller with heavy | 275 |
