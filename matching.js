
// DripLoop use matching.
// A suitable match is a possible reuse route.
// It does not certify the quality of a particular water listing.

const NON_POTABLE_REASON =
  "Not potable: may contain bacteria or metals from AC coils.";

const USES = [
  {
    name: "Irrigation and plants",
    keywords: [
      "irrigation",
      "irrigate",
      "watering",
      "water plants",
      "plant",
      "plants",
      "garden",
      "gardens",
      "gardening",
      "nursery",
      "nurseries",
      "landscape",
      "landscaping",
      "landscaper",
      "landscapers",
      "trees",
      "flowers",
      "lawn"
    ],
    suitable: true,
    reason:
      "Give the next drop a growing job. Checked AC condensate may replace tap water for ornamental plants and landscape irrigation.",
    warnings: [
      "Non-potable. Keep it separate from drinking water.",
      "Check water quality, including possible metals, and plant requirements before use.",
      "Use soil-level irrigation and avoid spraying people or public areas.",
      "For edible crops, obtain water-quality advice before use and avoid contact with edible parts.",
      "Keep storage covered and manage it to prevent microbial growth and mosquitoes."
    ]
  },
  {
    name: "Car wash",
    keywords: [
      "car wash",
      "carwash",
      "car",
      "cars",
      "wash my car",
      "washing cars",
      "vehicle",
      "vehicles",
      "vehicle washing",
      "truck wash",
      "fleet wash"
    ],
    suitable: true,
    reason:
      "Put another drop to work. AC condensate may supply vehicle washing after its quality and treatment needs are checked.",
    warnings: [
      "Non-potable. Low mineral content does not mean the water is safe.",
      "Check filtration and disinfection needs before washing.",
      "Avoid spraying untreated water where workers or the public could inhale droplets.",
      "Confirm compatibility with paintwork, washing equipment and cleaning products.",
      "Collect and dispose of wash runoff according to local requirements."
    ]
  },
  {
    name: "Concrete curing",
    keywords: [
      "concrete",
      "curing",
      "concrete curing",
      "cure concrete",
      "construction",
      "construction site",
      "building site",
      "slab",
      "slabs",
      "cement"
    ],
    suitable: true,
    reason:
      "Keep the cure going with recovered water. AC condensate may support concrete curing when it meets the project's water specification.",
    warnings: [
      "Get approval from the site engineer before use.",
      "Test against the project's limits for contaminants, salts and other relevant properties.",
      "Approval for curing does not automatically approve the water for concrete mixing.",
      "Label tanks and hoses NON-POTABLE and prevent drinking-water cross-connections.",
      "Limit worker contact and avoid unnecessary spray."
    ]
  },
  {
    name: "Dust suppression",
    keywords: [
      "dust",
      "dust suppression",
      "dust control",
      "suppress dust",
      "control dust",
      "haul road",
      "site road",
      "road wetting"
    ],
    suitable: true,
    reason:
      "Help keep site dust down. Checked and appropriately treated condensate may replace tap water for controlled ground wetting.",
    warnings: [
      "Assess microbial quality and treatment needs before spraying.",
      "Use controlled ground wetting and avoid fine mist.",
      "Keep spray away from people, neighbouring properties and public areas.",
      "Prevent pooling, slippery surfaces and contaminated runoff.",
      "Follow the site's environmental and worker-safety requirements."
    ]
  },
  {
    name: "Floor and equipment cleaning",
    keywords: [
      "floor",
      "floors",
      "floor cleaning",
      "cleaning",
      "mop",
      "mopping",
      "equipment",
      "equipment cleaning",
      "warehouse cleaning",
      "workshop cleaning",
      "washdown"
    ],
    suitable: true,
    reason:
      "Make routine cleaning use a recovered resource. Checked condensate may suit non-food-contact floors and compatible equipment.",
    warnings: [
      "Check water quality and apply appropriate treatment before use.",
      "Do not use it for food-contact surfaces, handwashing or personal hygiene.",
      "Avoid aerosols and follow cleaning-product instructions.",
      "Check equipment guidance and isolate electrical equipment before wet cleaning.",
      "Prevent slips and keep cleaning supplies separate from drinking-water equipment."
    ]
  },
  {
    name: "Cooling tower top-up",
    keywords: [
      "cooling tower",
      "cooling towers",
      "cooling tower top up",
      "cooling tower makeup",
      "cooling tower make up",
      "tower top up",
      "tower makeup",
      "tower make up"
    ],
    suitable: true,
    reason:
      "Bring recovered water back into the cooling cycle. Condensate may provide tower make-up water through an approved water-treatment programme.",
    warnings: [
      "A qualified water-treatment specialist must approve the source and treatment plan.",
      "Do not add untreated condensate directly to a cooling tower.",
      "Follow the tower's Legionella control, disinfection and monitoring programme.",
      "Check corrosion, scaling and water-chemistry requirements.",
      "Use approved connections with backflow protection."
    ]
  },
  {
    name: "Drinking",
    keywords: [
      "drink",
      "drinks",
      "drinking",
      "drinkable",
      "drinking water",
      "beverage",
      "beverages",
      "tea",
      "coffee",
      "juice",
      "ice",
      "ice cubes"
    ],
    suitable: false,
    reason: NON_POTABLE_REASON,
    warnings: [
      "Do not drink AC condensate or use it in beverages or ice.",
      "Clear appearance and low mineral content do not establish drinking-water safety.",
      "Boiling does not remove metals or all chemical contaminants.",
      "Use an approved potable-water supply."
    ]
  },
  {
    name: "Cooking and food preparation",
    keywords: [
      "cook",
      "cooks",
      "cooking",
      "food preparation",
      "prepare food",
      "food washing",
      "wash food",
      "washing food",
      "wash vegetables",
      "washing vegetables",
      "wash fruit",
      "washing fruit",
      "boil rice",
      "boil pasta",
      "soup",
      "baking"
    ],
    suitable: false,
    reason: NON_POTABLE_REASON,
    warnings: [
      "Do not use AC condensate for cooking, ingredients or washing food.",
      "Do not use it on food-contact surfaces or utensils.",
      "Heating or boiling does not make chemically contaminated water potable.",
      "Use an approved potable-water supply for food preparation."
    ]
  },
  {
    name: "Pets and livestock",
    keywords: [
      "pet",
      "pets",
      "livestock",
      "animal",
      "animals",
      "animal drinking",
      "dog",
      "dogs",
      "cat",
      "cats",
      "cattle",
      "cow",
      "cows",
      "horse",
      "horses",
      "goat",
      "goats",
      "poultry",
      "chicken",
      "chickens",
      "aquarium",
      "fish"
    ],
    suitable: false,
    reason: NON_POTABLE_REASON,
    warnings: [
      "Do not use AC condensate as drinking water for pets or livestock.",
      "Do not use it to prepare animal feed or fill aquariums.",
      "Animals can also be harmed by microbes and metals in collected water.",
      "Use water confirmed safe for the species and intended use."
    ]
  }
];

// Make searches case-insensitive and handle punctuation.
// For example, "cooling-tower top-up" becomes
// "cooling tower top up".
function normaliseSearch(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchProject(text) {
  if (typeof text !== "string") return null;

  const query = normaliseSearch(text);

  if (!query) return null;

  const paddedQuery = " " + query + " ";

  let bestSuitableMatch = null;
  let bestSuitableScore = 0;

  let bestUnsuitableMatch = null;
  let bestUnsuitableScore = 0;

  for (const use of USES) {
    // A Set stops identical names and keywords being counted twice.
    const terms = new Set(
      [use.name, ...use.keywords].map(normaliseSearch)
    );

    let score = 0;

    for (const term of terms) {
      // Match complete words or phrases.
      // "cat" should not match inside "application".
      if (
        term &&
        paddedQuery.includes(" " + term + " ")
      ) {
        score += 1;
      }
    }

    if (score === 0) continue;

    if (use.suitable) {
      if (score > bestSuitableScore) {
        bestSuitableScore = score;
        bestSuitableMatch = use;
      }
    } else {
      if (score > bestUnsuitableScore) {
        bestUnsuitableScore = score;
        bestUnsuitableMatch = use;
      }
    }
  }

  // Unsafe uses take priority in mixed searches.
  // "Water plants and make coffee" must show a safety warning.
  if (bestUnsuitableMatch) {
    return bestUnsuitableMatch;
  }

  return bestSuitableMatch;
}
