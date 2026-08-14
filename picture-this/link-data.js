// Semantically audited two-item links. Item indexes follow visual order:
// top-left, top-right, middle-left, middle-right, bottom-left, bottom-right.
// A clue is kept only when it naturally identifies exactly two of the six items.
// Cards may have fewer than three puzzles; weak clues are never added to fill a quota.
const pictureThisLink = (word, items, explanation, alternatives = []) => ({
  word,
  answers: [word, ...alternatives],
  items,
  explanation,
  audit: "exclusive-among-six-v1"
});

window.PICTURE_THIS_LINK_DATA = {
  "weather": [],
  "vegetables": [pictureThisLink("underground", [1,4], "Carrots and onions are the only two vegetables shown whose edible parts grow underground.", ["soil"])],
  "zoo": [],
  "feelings": [],
  "beverages": [pictureThisLink("brewed", [0,2], "Coffee and tea are the only two drinks shown that are normally made by brewing.", ["brewing", "brew"])],
  "play": [pictureThisLink("small", [3,4], "The tennis ball and baseball are the only two hand-sized balls shown.", ["hand-sized"])],
  "school": [pictureThisLink("pages", [2,4], "The notebook and book are the only two items shown that are made of bound pages.", ["paged"])],
  "personal-items": [
    pictureThisLink("time", [0,1], "The watch and mobile phone are the only two items shown that normally display the time.")
  ],
  "snack-time": [
    pictureThisLink("bunches", [1,3], "Grapes and bananas are the only two foods shown that characteristically grow in bunches.", ["bunch"])
  ],
  "hobbies": [
    pictureThisLink("active", [2,3], "Playing sports and riding a bike are the only two explicitly physical activities shown.", ["exercise"]),
    pictureThisLink("stories", [0,5], "Reading books and watching movies are the only two activities shown that characteristically present stories.", ["story"])
  ],
  "shapes": [pictureThisLink("four-sided", [0,4], "The square and diamond are the only two shapes shown with four sides.", ["quadrilateral"])],
  "bugs": [],
  "tools": [pictureThisLink("jaws", [0,5], "Pliers and a wrench are the only two tools shown designed with gripping jaws.", ["jawed"])],
  "outdoor-places": [
    pictureThisLink("peaks", [0,1], "The mountain and volcano are the only two places shown whose defining form has a high peak.", ["peaked"]),
    pictureThisLink("freshwater", [3,5], "The waterfall and lake are the only two places shown that are characteristically freshwater features.")
  ],
  "furniture": [pictureThisLink("seating", [0,4], "The chair and sofa are the only two pieces shown primarily made for seating.", ["sitting"])],
  "communication-tools": [pictureThisLink("broadcast", [2,4], "Radio and television are the only two broadcast media shown.", ["broadcasting"])],
  "transportation": [pictureThisLink("handlebars", [0,5], "The bicycle and motorcycle are the only two vehicles shown steered with handlebars.", ["handlebar"])],
  "great-outdoors": [
    pictureThisLink("boards", [1,3], "Skateboarding and surfing are the only two activities shown performed on boards.", ["board"]),
    pictureThisLink("water", [3,4], "Surfing and fishing are the only two activities shown inherently performed on or beside water.", ["aquatic"])
  ],
  "jobs": [],
  "everyday-foods": [
    pictureThisLink("legumes", [0,3], "Beans and peanuts are the only two legumes shown.", ["legume"]),
    pictureThisLink("underground", [3,4], "Peanuts and potatoes are the only two foods shown that develop underground.", ["soil"])
  ],
  "musical-instruments": [
    pictureThisLink("strings", [0,3], "The guitar and violin are the only two string instruments shown.", ["stringed"]),
    pictureThisLink("brass", [2,5], "The trumpet and saxophone are the only two brass-family instruments shown.", ["brassy"]),
    pictureThisLink("keys", [4,5], "The piano and saxophone are the only two instruments shown played with keys.", ["keyed"])
  ],
  "market": [pictureThisLink("produce", [0,3], "Fruit and vegetables are the only two fresh-produce groups shown.")],
  "outdoor-gear": [
    pictureThisLink("waterproof", [3,4], "Rain boots and an umbrella are the only two items shown specifically designed as waterproof rain barriers.", ["rainproof"]),
    pictureThisLink("sun", [1,5], "The hat and sunglasses are the only two items shown primarily used to shade the head or eyes from sun.", ["sunny"])
  ],
  "pets": [pictureThisLink("aquatic", [1,4], "The fish and turtle are the only two pets shown that characteristically live in water.", ["water"])],
  "at-the-beach": [pictureThisLink("sun-protection", [1,3], "The sun hat and sunscreen are the only two items shown specifically designed to protect a person from the sun.")],
  "in-the-kitchen": [pictureThisLink("mixing", [1,2], "The wooden spoon and mixing bowl are the only two items shown specifically named or designed for mixing.", ["mix"])],
  "getting-dressed": [],
  "at-the-doctor": [
    pictureThisLink("checking", [0,1], "The stethoscope and thermometer are the only two diagnostic measuring tools shown.", ["examining"])
  ],
  "cleaning-day": [pictureThisLink("containers", [2,4], "The bucket and spray bottle are the only two openable containers shown for cleaning liquids.", ["container"])],
  "in-the-garden": [pictureThisLink("watering", [0,5], "The watering can and garden hose are the only two tools shown specifically designed to water plants.", ["water"])],
  "at-the-playground": [pictureThisLink("seats", [1,2], "The swing and seesaw are the only two pieces shown with dedicated seats for riders.", ["seat"])],
  "on-the-farm": [pictureThisLink("wheels", [0,4], "The tractor and wheelbarrow are the only two wheeled items shown.", ["wheeled"])],
  "baby-things": [
    pictureThisLink("feeding", [1,5], "The baby bottle and high chair are the only two items shown specifically designed for feeding.", ["feed"])
  ],
  "party-time": [
    pictureThisLink("blowing", [0,5], "Balloons and a party horn are the only two items shown that are used by blowing air.", ["blow"]),
    pictureThisLink("candles", [1,4], "The birthday cake and candle are the only two items shown directly joined by birthday candles.", ["candle"])
  ],
  "science-lab": [pictureThisLink("protective", [4,5], "Safety goggles and a lab coat are the only two pieces of protective clothing shown.", ["protection", "safety"])],
  "sewing-kit": [
    pictureThisLink("fastening", [4,5], "The zipper and button are the only two garment fasteners shown.", ["fastener"]),
    pictureThisLink("needle-safety", [2,3], "The thimble and pin cushion are the only two items shown specifically protecting a sewer from loose needles or pins.")
  ],
  "winter-fun": [pictureThisLink("feet", [1,2], "Ice skates and a snowboard are the only two items shown worn or fixed directly to both feet.", ["footwear"])],
  "laundry-day": [
    pictureThisLink("hanging", [2,4], "The clothes hanger and clothespin are the only two items shown specifically used to hang clothes.", ["hang"]),
    pictureThisLink("washing", [0,5], "The washing machine and detergent are the only two items shown specifically responsible for washing clothes.", ["wash"]),
    pictureThisLink("wrinkles", [2,3], "The hanger and iron are the only two items shown specifically used to prevent or remove wrinkles.", ["wrinkle"])
  ],
  "movie-night": [
    pictureThisLink("projection", [2,5], "The projector and film reel are the only two items shown directly involved in film projection.", ["projecting", "project"]),
    pictureThisLink("control", [2,3], "The projector and remote control are the only two items shown joined by remote operation.", ["remote"])
  ],
  "space-travel": [],
  "hair-salon": [pictureThisLink("heat", [0,5], "The hair dryer and curling iron are the only two tools shown that style hair primarily with heat.", ["heating", "hot"])],
  "at-the-airport": [
    pictureThisLink("documents", [1,2], "The passport and boarding pass are the only two travel documents shown.", ["document"]),
    pictureThisLink("screening", [0,5], "The suitcase and metal detector are the only two items shown directly joined in baggage screening.", ["security"]),
    pictureThisLink("luggage", [0,3], "The suitcase and luggage cart are the only two items shown directly joined by luggage transport.", ["baggage"])
  ],
  "at-the-office": [pictureThisLink("piercing", [0,3], "The stapler and hole punch are the only two tools shown that pierce paper during normal use.", ["pierce", "puncturing"])],
  "under-the-sea": [
    pictureThisLink("tentacles", [2,4], "The octopus and jellyfish are the only two animals shown with tentacles.", ["tentacle"]),
    pictureThisLink("spines", [3,5], "The seahorse and starfish are the only two animals shown with hard, visibly spiny body surfaces.", ["spiny"])
  ],
  "at-the-library": [],
  "at-the-harbor": [
    pictureThisLink("mooring", [1,5], "The anchor and dock bollard are the only two items shown specifically used to moor a boat.", ["moored"])
  ],
  "photography": [
    pictureThisLink("storage", [4,5], "The memory card and photo album are the only two items shown specifically storing photographs.", ["storing", "store"]),
    pictureThisLink("support", [0,1], "The camera and tripod are the only two items shown directly joined by physical support.", ["steady"]),
    pictureThisLink("lighting", [0,3], "The camera and flash unit are the only two items shown directly joined by photographic lighting.", ["light"])
  ],
  "fitness-equipment": [
    pictureThisLink("cardio", [2,4], "The treadmill and exercise bike are the only two dedicated cardio machines shown.", ["aerobic"]),
    pictureThisLink("weights", [0,1], "The dumbbell and kettlebell are the only two handheld weights shown.", ["weight"]),
    pictureThisLink("stretching", [3,5], "The yoga mat and resistance band are the only two items shown specifically associated with assisted stretching.", ["stretch"])
  ],
  "at-the-museum": [],
  "city-street": [
    pictureThisLink("crossing", [0,4], "The traffic light and crosswalk sign are the only two items shown specifically controlling a street crossing.", ["cross"]),
    pictureThisLink("lights", [0,3], "The traffic light and streetlamp are the only two items shown that are themselves lights.", ["lighting"])
  ],
  "at-a-wedding": [
    pictureThisLink("bride", [1,2], "The bridal bouquet and veil are the only two items shown specifically worn or carried by the bride.", ["bridal"]),
    pictureThisLink("rings", [0,4], "The wedding rings and ring pillow are the only two items shown directly joined by the rings.", ["ring"])
  ],
  "bathroom-fixtures": [],
  "money-and-banking": [],
  "houseplants": [pictureThisLink("succulents", [0,5], "The cactus and aloe vera are the only two succulents shown.", ["succulent"])],
  "at-the-dentist": [
    pictureThisLink("cleaning", [1,2], "The toothbrush and toothpaste are the only two items shown specifically paired for cleaning teeth.", ["clean"]),
    pictureThisLink("inspection", [0,4], "The dental chair and mouth mirror are the only two items shown directly joined during an oral inspection.", ["exam"]),
    pictureThisLink("demonstration", [1,5], "The toothbrush and tooth model are the only two items shown directly paired for a brushing demonstration.", ["teaching"])
  ],
  "fire-station": [
    pictureThisLink("pumping", [0,2], "The fire engine and coiled hose are the only two items shown directly joined in pumping firefighting water.", ["pump"])
  ],
  "at-the-hotel": [
    pictureThisLink("wearing", [2,3], "The bathrobe and slippers are the only two wearable guest-comfort items shown.", ["wear", "clothing"]),
    pictureThisLink("door", [0,5], "The key card and door hanger are the only two items shown specifically used on a hotel-room door.", ["entry"])
  ],
  "at-the-post-office": [
    pictureThisLink("weighing", [3,5], "The parcel and postal scale are the only two items shown directly joined by weighing.", ["weigh", "weight"]),
    pictureThisLink("postage", [1,2], "The envelope and stamp are the only two items shown directly joined by postage.", ["mailing"]),
    pictureThisLink("carrying", [3,4], "The parcel and mailbag are the only two items shown directly joined by carrying parcels.", ["carry"])
  ],
  "construction-site": [],
  "at-the-theater": [
    pictureThisLink("amplification", [4,5], "The megaphone and stage microphone are the only two voice-amplification devices shown.", ["amplify"]),
    pictureThisLink("costumes", [2,3], "The theater masks and prop crown are the only two wearable character props shown.", ["costume"])
  ],
  "at-the-restaurant": [pictureThisLink("condiments", [3,4], "The pepper grinder and sauce boat are the only two tabletop condiment servers shown.", ["seasonings"])],
  "at-the-train-station": [
    pictureThisLink("tickets", [0,2], "The train ticket and ticket machine are the only two items shown directly joined by ticket purchase.", ["ticket"]),
    pictureThisLink("time", [0,1], "The train ticket and platform clock are the only two items shown that normally display departure time.", ["schedule"]),
    pictureThisLink("signals", [3,5], "The track switch lever and conductor whistle are the only two operating signals shown.", ["signal"])
  ],
  "at-the-bakery": [
    pictureThisLink("rolling", [1,3], "The rolling pin and flour sack are the only two items shown directly associated with rolling dough.", ["roll"]),
    pictureThisLink("oven-tools", [2,5], "The baking tray and oven peel are the only two dedicated oven-handling tools shown.")
  ],
  "at-the-police-station": [
    pictureThisLink("uniform", [0,3], "The police badge and cap are the only two parts of a police uniform shown."),
    pictureThisLink("dispatch", [2,5], "The police radio and police car are the only two items shown directly joined by dispatch communication.", ["communication"])
  ],
  "at-the-campsite": [pictureThisLink("sleeping", [0,1], "The tent and sleeping bag are the only two items shown specifically designed for sleeping outdoors.", ["sleep"])],
  "board-games": [],
  "jewelry": [
    pictureThisLink("garment-fasteners", [3,4], "The brooch and cufflinks are the only two pieces shown that fasten directly onto clothing."),
    pictureThisLink("chains", [0,1], "The necklace and charm bracelet are the only two items shown characteristically formed from linked chains.", ["chain"]),
    pictureThisLink("pins", [3,5], "The brooch and hairpin are the only two items shown secured with a pin.", ["pin"])
  ],
  "computer-equipment": [pictureThisLink("storage", [0,3], "The laptop and USB drive are the only two items shown primarily capable of storing user files.", ["files"])],
  "emergency-room": [],
  "car-parts": [
    pictureThisLink("control", [0,3], "The steering wheel and gearshift are the only two driver-operated directional or drivetrain controls shown.", ["controlling"]),
    pictureThisLink("electrical", [2,4], "The spark plug and car battery are the only two explicitly electrical power or ignition parts shown.", ["electricity", "electric"])
  ],
  "ancient-egypt": [pictureThisLink("amulets", [4,5], "The scarab amulet and ankh are the only two small protective symbols shown that were worn as amulets.", ["amulet"])],
  "flowers": [pictureThisLink("disks", [1,4], "The sunflower and daisy are the only two composite flowers shown with prominent central disks.", ["centers"])],
  "birds": [
    pictureThisLink("aquatic", [2,3], "The penguin and flamingo are the only two birds shown characteristically living or feeding in water.", ["water"]),
    pictureThisLink("raptors", [0,1], "The eagle and owl are the only two birds of prey shown.", ["predators"])
  ],
  "kitchen-appliances": [],
  "art-supplies": [pictureThisLink("paint-holders", [0,1], "The paint palette and paintbrush are the only two items shown specifically designed to hold paint during painting.")],
  "sports-equipment": [],
  "at-the-pharmacy": [],
  "picnic-time": [pictureThisLink("insulated", [2,4], "The thermos flask and cooler box are the only two insulated temperature-control containers shown.", ["insulation"] )],
  "spices": [pictureThisLink("seeds", [3,4], "Cardamom pods and peppercorns are the only two spices shown that are botanically used as seeds.", ["seed"])],
  "travel-accessories": [
    pictureThisLink("sleep", [0,2], "The neck pillow and eye mask are the only two items shown specifically designed to help a traveler sleep.", ["sleeping", "rest"]),
    pictureThisLink("luggage", [1,5], "The luggage tag and luggage scale are the only two items shown specifically attached to or used on luggage.", ["bags"])
  ],
  "weather-instruments": [pictureThisLink("direction", [0,4], "The weather vane and wind sock are the only two instruments shown specifically indicating wind direction.", ["wind-direction"])],
  "ways-to-travel": [pictureThisLink("rails", [0,4], "The tram and cable car are the only two vehicles shown that characteristically travel on rails.", ["rail"] )],
  "at-the-aquarium": [pictureThisLink("shells", [1,3], "The hermit crab and clam shell are the only two items shown whose identity centers on a shell.", ["shell"])],
  "at-the-coffee-shop": [
    pictureThisLink("brewing", [0,3], "The espresso machine and coffee filter are the only two items shown that directly perform coffee brewing.", ["brew"])
  ],
  "at-the-supermarket": [pictureThisLink("scanning", [2,3], "The checkout counter and barcode scanner are the only two items shown directly joined by checkout scanning.", ["scan"])],
  "tableware": [
    pictureThisLink("soup", [1,4], "The soup bowl and teaspoon are the only two items shown specifically named or sized for soup."),
    pictureThisLink("gripping", [2,5], "The fork and chopsticks are the only two items shown primarily used to grip or spear bite-sized food.", ["grip"])
  ],
  "cooking-utensils": [pictureThisLink("turning", [0,3], "The spatula and kitchen tongs are the only two utensils shown specifically suited to turning solid food while it cooks.", ["turn"])],
  "fresh-fruit": [
    pictureThisLink("citrus", [0,5], "The orange and lemon are the only two citrus fruits shown."),
    pictureThisLink("red", [2,3], "The strawberry and watermelon are the only two fruits shown with characteristically red edible flesh.", ["reddish"])
  ],
  "fresh-vegetables": [
    pictureThisLink("leafy", [1,4], "Cabbage and spinach are the only two vegetables shown primarily eaten for their leaves.", ["leaves"]),
    pictureThisLink("cruciferous", [1,3], "Cabbage and cauliflower are the only two cruciferous vegetables shown.", ["brassica"]),
    pictureThisLink("vines", [0,5], "Cucumbers and pumpkins are the only two vegetables shown that characteristically grow on spreading vines.", ["vine"])
  ],
  "pantry-basics": [pictureThisLink("crystals", [3,4], "Salt and sugar are the only two crystalline seasonings shown.", ["crystal"])],
  "breakfast-foods": [pictureThisLink("spreading", [0,4], "Toast and jam are the only two items shown directly joined by spreading jam on toast.", ["spread"])],
  "home-entryway": [
    pictureThisLink("locking", [0,1], "The door key and deadbolt are the only two items shown specifically made for mechanically locking the door.", ["lock"]),
    pictureThisLink("outside", [2,3], "The doorbell and doormat are the only two items shown characteristically placed immediately outside the entrance.", ["exterior"]),
    pictureThisLink("storage", [4,5], "The coat hook and shoe rack are the only two entryway storage fixtures shown.", ["organizing"])
  ],
  "electrical-essentials": [
    pictureThisLink("switching", [0,4], "The light switch and bulb are the only two items shown directly joined by switching a light on or off.", ["switch"]),
    pictureThisLink("wall-mounted", [0,1], "The light switch and wall outlet are the only two fixtures shown permanently mounted in a wall.", ["wall"])
  ],
  "personal-care": [
    pictureThisLink("blades", [3,5], "Nail clippers and a razor are the only two bladed cutting tools shown.", ["blade"]),
    pictureThisLink("hair", [4,5], "The hairbrush and razor are the only two items shown whose normal action directly manages or removes hair.", ["grooming"])
  ],
  "dishwashing": [
    pictureThisLink("scrubbing", [0,2], "Dish soap and the scrub brush are the only two items shown that directly provide the cleaning action for scrubbing dishes.", ["scrub"]),
    pictureThisLink("drying", [1,4], "The dish rack and dish towel are the only two items shown specifically used to dry dishes.", ["dry"])
  ],
  "food-storage": [pictureThisLink("wrapping", [4,5], "Wax paper and aluminum foil are the only two flexible wrapping materials shown.", ["wrap", "covering"])],
  "writing-supplies": [
    pictureThisLink("fastening", [4,5], "The glue stick and paper clip are the only two items shown specifically used to fasten paper.", ["fasten", "attaching"]),
    pictureThisLink("cutting", [2,3], "The ruler and scissors are the only two items shown directly paired for guided straight cutting.", ["cut"]),
    pictureThisLink("lines", [0,2], "The ballpoint pen and ruler are the only two items shown directly paired for drawing straight lines.", ["line"])
  ],
  "bathroom-essentials": [
    pictureThisLink("tools", [4,5], "The plunger and toilet brush are the only two toilet-maintenance tools shown.", ["tool"]),
    pictureThisLink("drying", [1,3], "The hand towel and bath mat are the only two items shown specifically placed to absorb water while a person dries.", ["dry"])
  ],
  "cleaning-extras": [
    pictureThisLink("liners", [1,2], "The trash can and garbage bag are the only two items shown directly paired as bin and liner.", ["liner"]),
    pictureThisLink("bins", [1,3], "The trash can and recycling bin are the only two rigid waste bins shown.", ["bin"]),
    pictureThisLink("wiping", [4,5], "The squeegee and cleaning cloth are the only two items shown specifically used by wiping a surface.", ["wipe"])
  ],
  "parts-of-a-home": [
    pictureThisLink("openings", [0,1], "The front door and window are the only two wall openings shown.", ["opening"]),
    pictureThisLink("turning", [3,5], "The ceiling fan and door handle are the only two items shown whose characteristic action is turning.", ["turn"])
  ],
  "coffee-shop-drinks": [pictureThisLink("black", [1,5], "Americano and espresso are the only two drinks shown characteristically served without milk.", ["milkless"])]
};
