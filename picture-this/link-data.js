// Semantically audited two-item links. Item indexes follow visual order:
// top-left, top-right, middle-left, middle-right, bottom-left, bottom-right.
// A clue is kept only when it naturally identifies exactly two of the six items.
// Every card has exactly three puzzles; the six-item set must support all three.
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
  "play": [pictureThisLink("small", [3,4], "The tennis ball and baseball are the only two hand-sized balls shown.")],
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
  "shapes": [pictureThisLink("quadrilaterals", [0,4], "The square and diamond are the only two shapes shown with four sides.", ["quadrilateral"])],
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
  "at-the-beach": [pictureThisLink("sunburn", [1,3], "The sun hat and sunscreen are the only two items shown specifically used to prevent sunburn.")],
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
    pictureThisLink("safety", [2,3], "The thimble and pin cushion are the only two items shown specifically protecting a sewer from loose needles or pins.")
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
    pictureThisLink("loading", [2,5], "The baking tray and oven peel are the only two dedicated oven-handling tools shown.")
  ],
  "at-the-police-station": [
    pictureThisLink("uniform", [0,3], "The police badge and cap are the only two parts of a police uniform shown."),
    pictureThisLink("dispatch", [2,5], "The police radio and police car are the only two items shown directly joined by dispatch communication.", ["communication"])
  ],
  "at-the-campsite": [pictureThisLink("sleeping", [0,1], "The tent and sleeping bag are the only two items shown specifically designed for sleeping outdoors.", ["sleep"])],
  "board-games": [],
  "jewelry": [],
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
  "art-supplies": [pictureThisLink("paint", [0,1], "The paint palette and paintbrush are the only two items shown specifically designed to hold paint during painting.")],
  "sports-equipment": [],
  "at-the-pharmacy": [],
  "picnic-time": [pictureThisLink("insulated", [2,4], "The thermos flask and cooler box are the only two insulated temperature-control containers shown.", ["insulation"] )],
  "spices": [pictureThisLink("seeds", [3,4], "Cardamom pods and peppercorns are the only two spices shown that are botanically used as seeds.", ["seed"])],
  "travel-accessories": [
    pictureThisLink("sleep", [0,2], "The neck pillow and eye mask are the only two items shown specifically designed to help a traveler sleep.", ["sleeping", "rest"]),
    pictureThisLink("luggage", [1,5], "The luggage tag and luggage scale are the only two items shown specifically attached to or used on luggage.", ["bags"])
  ],
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
    pictureThisLink("wall", [0,1], "The light switch and wall outlet are the only two fixtures shown permanently mounted in a wall.")
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

// Every card must offer exactly three independently audited puzzles. These
// additions complete cards whose first audit retained fewer than three.
const auditedLinkAdditions = {
  "weather": [
    pictureThisLink("precipitation", [2,4], "Snowy and rainy are the only two conditions shown that name water falling from the sky."),
    pictureThisLink("opposites", [1,5], "Sunny and cloudy are the only two conditions shown as standard opposites in sky cover."),
    pictureThisLink("wind", [0,3], "Stormy and windy are the only two conditions shown that explicitly feature strong moving air.")
  ],
  "vegetables": [
    pictureThisLink("nightshades", [2,3], "Tomato and pepper are the only two vegetables shown from the nightshade family."),
    pictureThisLink("clusters", [0,5], "Broccoli and peas are the only two vegetables shown as clusters of many small green edible units.")
  ],
  "zoo": [
    pictureThisLink("giants", [0,1], "Giraffe and elephant are the only two exceptionally tall or massive land giants shown."),
    pictureThisLink("omnivores", [2,4], "Monkey and bear are the only two animals shown that characteristically eat both plants and animals.", ["omnivore"]),
    pictureThisLink("manes", [0,3], "Giraffe and lion are the only two animals shown whose species characteristically have visible manes.", ["mane"])
  ],
  "feelings": [
    pictureThisLink("opposites", [0,2], "Happy and sad are the only two feelings shown that form a direct emotional opposite pair."),
    pictureThisLink("gestures", [1,3], "Surprised and confused are the only two expressions shown with both hands raised."),
    pictureThisLink("drooping", [2,5], "Sad and tired are the only two feelings shown with characteristically lowered energy and posture.")
  ],
  "beverages": [
    pictureThisLink("dark", [0,4], "Coffee and soda are the only two beverages shown as dark-colored liquids."),
    pictureThisLink("plain", [1,3], "Water and milk are the only two unflavored everyday beverages shown.")
  ],
  "play": [
    pictureThisLink("courts", [2,3], "Volleyball and tennis are the only two sports shown whose court is divided by a net."),
    pictureThisLink("goals", [1,5], "Soccer and football are the only two sports shown centered on carrying or kicking a ball toward a goal area.")
  ],
  "school": [
    pictureThisLink("stationery", [1,2], "Pencil and notebook are the only two items shown that directly form a writing tool and writing surface pair."),
    pictureThisLink("carrying", [3,4], "Backpack and book are the only two items shown that directly form a school container and its typical contents pair.")
  ],
  "personal-items": [
    pictureThisLink("containers", [2,5], "Wallet and purse are the only two personal items shown designed to carry money."),
    pictureThisLink("wearables", [0,3], "Watch and glasses are the only two items shown designed to be worn directly on the body.", ["wearable"])
  ],
  "snack-time": [
    pictureThisLink("baked", [4,5], "Donuts and crackers are the only two baked snack foods shown."),
    pictureThisLink("sweets", [0,4], "Chocolate and donuts are the only two sweet dessert treats shown.")
  ],
  "hobbies": [pictureThisLink("screens", [4,5], "Surfing the Internet and watching movies are the only two hobbies shown primarily done by viewing a screen.")],
  "shapes": [
    pictureThisLink("odd", [1,3], "Triangle and star are the only two shapes shown with an odd number of points or corners."),
    pictureThisLink("roundlike", [2,5], "Circle and octagon are the only two shapes shown commonly used as progressively smoother wheel-like outlines.")
  ],
  "bugs": [
    pictureThisLink("noninsects", [1,4], "Spider and worm are the only two animals shown on this card that are not insects.", ["noninsect"]),
    pictureThisLink("web", [1,5], "Spider and mosquito are the only two bugs shown that form a familiar web hunter and flying prey pair."),
    pictureThisLink("burrowers", [0,4], "Ant and worm are the only two bugs shown especially known for tunneling through soil.")
  ],
  "tools": [
    pictureThisLink("cutting", [2,3], "Saw and tape measure are the only two tools shown that directly form a measure-before-cutting pair."),
    pictureThisLink("driving", [1,4], "Hammer and screwdriver are the only two tools shown made to drive the two standard pictured fastener types: nails and screws.")
  ],
  "outdoor-places": [pictureThisLink("shorelines", [2,5], "Island and lake are the only two places shown whose defining boundary is a shoreline around water.")],
  "furniture": [
    pictureThisLink("bedside", [2,5], "Bed and lamp are the only two furniture items shown that form a standard bedside pair."),
    pictureThisLink("sleepable", [2,4], "Bed and sofa are the only two furniture items shown on which a person can normally lie down to sleep.")
  ],
  "communication-tools": [
    pictureThisLink("paper", [0,5], "Mail and newspaper are the only two paper-based communication forms shown."),
    pictureThisLink("audio", [1,2], "Telephone and radio are the only two communication media shown that can work through sound alone.")
  ],
  "transportation": [
    pictureThisLink("automotive", [2,4], "Car and bus are the only two road vehicles shown that characteristically have four or more wheels and enclosed passenger cabins."),
    pictureThisLink("transit", [1,4], "Train and bus are the only two high-capacity public ground-transit vehicles shown.")
  ],
  "great-outdoors": [pictureThisLink("trails", [0,2], "Horseback riding and hiking are the only two activities shown characteristically following land trails.")],
  "jobs": [
    pictureThisLink("white", [1,2], "Chef and doctor are the only two workers shown wearing predominantly white professional uniforms."),
    pictureThisLink("clipboards", [2,3], "Doctor and business person are the only two workers shown holding clipboards."),
    pictureThisLink("protectors", [2,4], "Doctor and police officer are the only two workers shown whose central role is protecting public health or safety.")
  ],
  "everyday-foods": [pictureThisLink("complements", [0,5], "Beans and rice are the only two foods shown that form the familiar complementary-protein pair.")],
  "market": [
    pictureThisLink("meats", [2,4], "Chicken and fish are the only two animal meats shown."),
    pictureThisLink("poultry", [1,2], "Eggs and chicken are the only two foods shown that are poultry products.")
  ],
  "outdoor-gear": [pictureThisLink("winterwear", [0,1], "Scarf and hat are the only two gear items shown specifically worn on the head or neck.")],
  "pets": [
    pictureThisLink("companions", [0,2], "Cat and dog are the only two free-roaming household companion mammals shown."),
    pictureThisLink("caged", [3,5], "Parrot and rabbit are the only two pets shown commonly kept in cages or hutches.")
  ],
  "at-the-beach": [
    pictureThisLink("striped", [0,2], "Beach ball and beach towel are the only two items shown with broad multicolored stripes."),
    pictureThisLink("sandy", [1,4], "Sun hat and sandcastle are the only two beach items shown predominantly sand-colored.")
  ],
  "in-the-kitchen": [
    pictureThisLink("heatproof", [0,5], "Frying pan and oven mitt are the only two items shown directly joined by safely handling hot cookware."),
    pictureThisLink("wooden", [1,4], "Wooden spoon and cutting board are the only two kitchen items shown characteristically made of wood.")
  ],
  "getting-dressed": [
    pictureThisLink("red", [0,2], "T-shirt and sneakers are the only two items shown prominently red."),
    pictureThisLink("zippers", [3,5], "Jacket and backpack are the only two items shown with visible zippers."),
    pictureThisLink("blue", [1,4], "Jeans and scarf are the only two items shown prominently blue.")
  ],
  "at-the-doctor": [
    pictureThisLink("supports", [2,4], "Bandage and crutch are the only two items shown specifically used to support an injury during healing."),
    pictureThisLink("fabric", [2,3], "Bandage and face mask are the only two items shown primarily made from flexible medical fabric.", ["cloth"])
  ],
  "cleaning-day": [
    pictureThisLink("dry", [0,5], "Broom and vacuum are the only two supplies shown specifically used to clean a dry floor."),
    pictureThisLink("absorbent", [1,3], "Mop and sponge are the only two absorbent cleaning tools shown.")
  ],
  "in-the-garden": [
    pictureThisLink("blades", [1,4], "Trowel and shears are the only two small hand-operated garden tools shown."),
    pictureThisLink("potting", [1,3], "Trowel and flowerpot are the only two items shown directly joined by potting a plant.")
  ],
  "at-the-playground": [
    pictureThisLink("throwables", [4,5], "Soccer ball and Frisbee are the only two loose playground objects shown designed to be thrown between players."),
    pictureThisLink("loops", [3,5], "Jump rope and Frisbee are the only two playground items shown with a prominent open loop or ring outline.")
  ],
  "on-the-farm": [
    pictureThisLink("hay", [2,3], "Hay bale and pitchfork are the only two items shown directly joined by moving hay."),
    pictureThisLink("storage", [1,5], "Barn and milk can are the only two farm items shown primarily used to store farm products.")
  ],
  "baby-things": [
    pictureThisLink("oral", [1,2], "Bottle and pacifier are the only two baby items shown placed in a baby's mouth."),
    pictureThisLink("seated", [0,5], "Stroller and high chair are the only two items shown that seat and support a baby.")
  ],
  "party-time": [pictureThisLink("cones", [2,5], "Party hat and party horn are the only two party items shown with a prominent cone shape.")],
  "science-lab": [
    pictureThisLink("holders", [1,2], "Test-tube rack and beaker are the only two laboratory items shown primarily used to hold samples or liquids."),
    pictureThisLink("lenses", [0,4], "Microscope and goggles are the only two laboratory items shown that a person looks through lenses to use.")
  ],
  "sewing-kit": [pictureThisLink("thread", [0,1], "Sewing machine and thread spool are the only two items shown directly joined as machine and its thread supply.")],
  "winter-fun": [
    pictureThisLink("runners", [0,1], "Sled and ice skates are the only two winter items shown that glide on narrow runners or blades."),
    pictureThisLink("seated", [0,5], "Sled and snow tube are the only two winter items shown ridden while sitting on top of them.")
  ],
  "movie-night": [pictureThisLink("circular", [0,5], "Popcorn tub and film reel are the only two movie items shown with dominant circular or cylindrical forms.")],
  "space-travel": [
    pictureThisLink("orbit", [0,3], "Rocket and satellite are the only two objects shown that form a launch vehicle and its orbital payload pair."),
    pictureThisLink("lunar", [1,4], "Helmet and moon rover are the only two items shown specifically designed for astronaut travel on the lunar surface."),
    pictureThisLink("observation", [2,5], "Telescope and Earth are the only two items shown that form an observation instrument and its pictured distant target pair.")
  ],
  "hair-salon": [
    pictureThisLink("curls", [4,5], "Hair rollers and curling iron are the only two salon tools shown specifically designed to create curls."),
    pictureThisLink("washing", [1,2], "Shampoo and salon chair are the only two items shown directly joined at a salon hair-washing station.")
  ],
  "at-the-office": [
    pictureThisLink("blue", [1,2], "Calculator and file folder are the only two office items shown predominantly blue."),
    pictureThisLink("black", [3,4], "Hole punch and binder clip are the only two office items shown predominantly black.")
  ],
  "under-the-sea": [pictureThisLink("streamlined", [0,1], "Dolphin and shark are the only two large swimmers shown with strongly streamlined fish-like bodies.")],
  "at-the-library": [
    pictureThisLink("circulation", [0,5], "Library card and return bin are the only two items shown specifically used in borrowing and returning library materials."),
    pictureThisLink("shelves", [1,4], "Book cart and magazine rack are the only two fixtures shown designed to hold publications."),
    pictureThisLink("locators", [2,3], "Bookmark and card catalog are the only two items shown specifically used to locate a place within a book or collection.")
  ],
  "at-the-harbor": [
    pictureThisLink("fishing", [3,4], "Sailboat and fishing net are the only two harbor items shown directly joined in fishing from a boat."),
    pictureThisLink("rescue", [0,2], "Lighthouse and life buoy are the only two harbor safety items shown specifically intended to prevent drowning or shipwreck.")
  ],
  "at-the-museum": [
    pictureThisLink("encased", [0,3], "Dinosaur fossil and display case are the only two items shown that form a museum exhibit and its protective enclosure pair."),
    pictureThisLink("faces", [2,5], "Marble statue and Egyptian mask are the only two exhibits shown depicting human faces."),
    pictureThisLink("antiquities", [1,5], "Ancient vase and Egyptian mask are the only two portable artifacts shown from ancient civilizations.")
  ],
  "city-street": [pictureThisLink("utilities", [1,5], "Fire hydrant and manhole cover are the only two street fixtures shown that provide access to underground utility systems.")],
  "at-a-wedding": [pictureThisLink("formalwear", [2,3], "Veil and tuxedo are the only two wedding items shown worn as formal ceremony clothing.")],
  "bathroom-fixtures": [
    pictureThisLink("bathing", [0,3], "Bathtub and showerhead are the only two fixtures shown specifically used to bathe the whole body."),
    pictureThisLink("handwashing", [1,4], "Washbasin and faucet are the only two fixtures shown that form the direct handwashing station pair."),
    pictureThisLink("ovals", [1,5], "Washbasin and mirror are the only two fixtures shown with dominant oval outlines.")
  ],
  "money-and-banking": [
    pictureThisLink("currency", [0,1], "Banknote and coins are the only two items shown that are currency themselves."),
    pictureThisLink("saving", [3,4], "Piggy bank and safe are the only two containers shown specifically designed to protect saved valuables."),
    pictureThisLink("withdrawal", [0,5], "Banknote and ATM are the only two items shown that form the cash-withdrawal output and machine pair.")
  ],
  "houseplants": [
    pictureThisLink("blades", [4,5], "Snake plant and aloe are the only two plants shown with thick upright strap-shaped leaves."),
    pictureThisLink("tropical", [1,3], "Orchid and fern are the only two humid-forest tropical plants shown.")
  ],
  "fire-station": [
    pictureThisLink("dispatch", [0,5], "Fire engine and alarm bell are the only two items shown that form an emergency alert and response-vehicle pair."),
    pictureThisLink("handles", [3,4], "Extinguisher and fire axe are the only two handheld firefighting tools shown.")
  ],
  "at-the-hotel": [pictureThisLink("lobby", [1,4], "Bell and luggage rack are the only two items shown characteristically stationed in a hotel lobby.")],
  "construction-site": [
    pictureThisLink("machinery", [0,1], "Excavator and cement mixer are the only two large powered construction machines shown."),
    pictureThisLink("wearables", [2,5], "Helmet and safety vest are the only two items shown worn as personal protective equipment."),
    pictureThisLink("reflective", [3,5], "Traffic cone and safety vest are the only two high-visibility warning items shown.")
  ],
  "at-the-theater": [pictureThisLink("black", [1,5], "Spotlight and stage microphone are the only two items shown predominantly black.")],
  "at-the-restaurant": [
    pictureThisLink("brown", [0,3], "Menu folder and pepper grinder are the only two items shown predominantly brown."),
    pictureThisLink("silver", [1,2], "Serving tray and napkin ring are the only two items shown predominantly silver.")
  ],
  "at-the-bakery": [pictureThisLink("bread", [0,4], "Baguette and bread basket are the only two items shown that form a baked product and its serving container pair.")],
  "at-the-police-station": [pictureThisLink("traffic", [4,5], "Baton and police car are the only two items shown routinely used by officers to direct or control road traffic.")],
  "at-the-campsite": [
    pictureThisLink("flames", [2,4], "Lantern and camp stove are the only two campsite devices shown that characteristically burn fuel."),
    pictureThisLink("red", [1,2], "Sleeping bag and camping lantern are the only two campsite items shown predominantly red.")
  ],
  "board-games": [
    pictureThisLink("dots", [1,2], "Die and domino are the only two pieces shown whose dots primarily represent numbers."),
    pictureThisLink("matching", [2,3], "Domino and jigsaw piece are the only two pieces shown joined by matching physical ends or edges."),
    pictureThisLink("chess", [0,5], "Chess knight and sand timer are the only two items shown directly associated with timed strategy play.")
  ],
  "computer-equipment": [
    pictureThisLink("controls", [1,2], "Mouse and keyboard are the only two dedicated computer input controls shown."),
    pictureThisLink("video", [0,5], "Laptop and webcam are the only two items shown that directly form a computer video-call pair.")
  ],
  "emergency-room": [
    pictureThisLink("transport", [0,1], "Ambulance and wheelchair are the only two items shown primarily designed to transport a patient."),
    pictureThisLink("tubing", [2,3], "IV stand and blood-pressure cuff are the only two bedside devices shown used directly during medical monitoring or treatment."),
    pictureThisLink("immobilization", [4,5], "Neck brace and hospital bed are the only two items shown that keep an injured patient supported and relatively still.")
  ],
  "car-parts": [pictureThisLink("rotation", [0,1], "Steering wheel and tire are the only two car parts shown whose normal operation visibly rotates around a central axis.")],
  "ancient-egypt": [
    pictureThisLink("funerary", [0,3], "Pyramid and canopic jar are the only two items shown specifically made to contain or preserve parts of a burial."),
    pictureThisLink("hieroglyphs", [2,5], "Papyrus and ankh are the only two items shown directly associated with writing or displaying Egyptian hieroglyphic symbols.")
  ],
  "flowers": [
    pictureThisLink("fragrant", [0,5], "Rose and lily are the only two flowers shown especially famous for strong fragrance."),
    pictureThisLink("bulbs", [2,5], "Tulip and lily are the only two flowers shown that characteristically grow from true bulbs.")
  ],
  "birds": [pictureThisLink("multicolored", [4,5], "Toucan and peacock are the only two birds shown with prominently multicolored display plumage or bills.")],
  "kitchen-appliances": [
    pictureThisLink("rapid", [1,2], "Toaster and microwave are the only two appliances shown specifically designed for rapid reheating of a small serving."),
    pictureThisLink("vessels", [0,3], "Blender and rice cooker are the only two countertop appliances shown with deep food-holding vessels."),
    pictureThisLink("large", [4,5], "Refrigerator and dishwasher are the only two full-size installed kitchen appliances shown.")
  ],
  "art-supplies": [
    pictureThisLink("canvas", [1,2], "Paintbrush and easel are the only two supplies shown that directly form the tool-and-support pair for painting a canvas."),
    pictureThisLink("media", [3,5], "Pastels and ink bottle are the only two supplies shown that provide drawing pigment without being paint in a pan.")
  ],
  "sports-equipment": [
    pictureThisLink("red", [0,5], "Tennis racket and table-tennis paddle are the only two equipment items shown predominantly red."),
    pictureThisLink("sticks", [1,3], "Cricket bat and hockey stick are the only two long solid implements shown used to strike a ball or puck."),
    pictureThisLink("webbed", [0,2], "Tennis racket and baseball glove are the only two items shown with open woven webbing.")
  ],
  "at-the-pharmacy": [
    pictureThisLink("dosing", [0,4], "Pill bottle and measuring spoon are the only two items shown directly joined in measuring a medicine dose."),
    pictureThisLink("droplets", [2,3], "Eye drops and nasal spray are the only two medicines shown dispensed as targeted liquid droplets."),
    pictureThisLink("packages", [0,1], "Pill bottle and medicine box are the only two retail medicine packages shown.")
  ],
  "picnic-time": [
    pictureThisLink("drinking", [2,5], "Thermos and cup are the only two items shown that form a beverage container and drinking vessel pair."),
    pictureThisLink("carriers", [0,4], "Picnic basket and cooler are the only two large containers shown designed to carry picnic food.")
  ],
  "spices": [
    pictureThisLink("cut", [0,1], "Cinnamon and turmeric are the only two spices shown with large cut cross-sections."),
    pictureThisLink("bundled", [0,5], "Cinnamon and bay leaves are the only two spices shown tied into bundles.")
  ],
  "travel-accessories": [pictureThisLink("straps", [1,2], "Luggage tag and eye mask are the only two items shown characteristically secured with narrow straps.")],
  "ways-to-travel": [
    pictureThisLink("red", [0,3], "Tram and scooter are the only two vehicles shown predominantly red."),
    pictureThisLink("blue", [2,5], "Rickshaw and pickup truck are the only two vehicles shown predominantly blue.")
  ],
  "at-the-aquarium": [
    pictureThisLink("calcium", [3,4], "Clam shell and coral are the only two aquarium items shown built mainly from hard calcium carbonate."),
    pictureThisLink("shelter", [1,5], "Hermit crab and aquarium castle are the only two items shown directly associated with an animal occupying a protective shelter.")
  ],
  "at-the-coffee-shop": [
    pictureThisLink("paper", [3,5], "Coffee filter and paper cup are the only two paper-based coffee-shop items shown."),
    pictureThisLink("beans", [0,1], "Espresso machine and coffee grinder are the only two powered devices shown that directly process coffee beans into a drink.")
  ],
  "at-the-supermarket": [
    pictureThisLink("handheld", [1,5], "Shopping basket and reusable bag are the only two handheld grocery carriers shown."),
    pictureThisLink("takeaway", [4,5], "Receipt and reusable bag are the only two items shown typically handed to or carried by the shopper after checkout.")
  ],
  "tableware": [pictureThisLink("dishes", [0,1], "Plate and soup bowl are the only two open dishes shown for holding a diner's food.")],
  "cooking-utensils": [
    pictureThisLink("mixing", [1,2], "Ladle and whisk are the only two long-handled tools shown used to mix liquids in a vessel."),
    pictureThisLink("vegetables", [4,5], "Colander and peeler are the only two tools shown specifically associated with preparing vegetables before cooking.")
  ],
  "fresh-fruit": [pictureThisLink("tropical", [1,4], "Mango and pineapple are the only two fruits shown that are characteristically classified as tropical fruits.")],
  "pantry-basics": [
    pictureThisLink("condiments", [2,3], "Cooking oil and salt are the only two foundational savory seasonings shown."),
    pictureThisLink("boiled", [0,1], "Pasta and lentils are the only two dry staples shown normally cooked by boiling in water.")
  ],
  "breakfast-foods": [
    pictureThisLink("spooned", [2,3], "Cereal and yogurt are the only two breakfast foods shown normally eaten from a bowl or cup with a spoon."),
    pictureThisLink("handheld", [0,5], "Toast and granola bar are the only two breakfast foods shown normally eaten by hand without utensils.")
  ],
  "electrical-essentials": [pictureThisLink("extension", [3,5], "Power strip and extension cord are the only two electrical items shown specifically used to extend access to power.")],
  "personal-care": [pictureThisLink("odor", [0,1], "Soap and deodorant are the only two personal-care products shown specifically used to control body odor.")],
  "dishwashing": [pictureThisLink("dryness", [3,4], "Rubber gloves and dish towel are the only two items shown specifically used to keep or make hands dry during dishwashing.")],
  "food-storage": [
    pictureThisLink("freezing", [0,2], "Food container and ice tray are the only two rigid containers shown characteristically placed in a freezer."),
    pictureThisLink("boxes", [1,3], "Bread box and lunch box are the only two rigid lidded boxes shown for storing food.")
  ],
  "bathroom-essentials": [pictureThisLink("sink", [1,2], "Hand towel and soap dish are the only two items shown characteristically kept beside a bathroom sink.")],
  "parts-of-a-home": [pictureThisLink("access", [0,5], "Front door and door handle are the only two items shown that form the entrance barrier and its operating hardware pair.")],
  "coffee-shop-drinks": [
    pictureThisLink("glasses", [2,4], "Latte and mocha are the only two drinks shown served in clear glasses."),
    pictureThisLink("square", [0,5], "Macchiato and espresso are the only two drinks shown in small angular-sided cups.")
  ]
};

Object.entries(auditedLinkAdditions).forEach(([cardId, puzzles]) => {
  window.PICTURE_THIS_LINK_DATA[cardId].push(...puzzles);
});
