const PROJECTS = [
    {
      name: "Planter box",
      keywords: ["planter", "planters", "plant pot", "garden box", "herb box"],
      suitable: ["wood", "plastic", "crates"],
      unsuitable: [
        { category: "mdf", reason: "MDF swells and breaks down when wet." },
        { category: "fabric", reason: "Ordinary fabric scraps cannot support a rigid planter." },
        { category: "acrylic", reason: "Acrylic can crack when drilled or loaded with heavy soil." }
      ],
      reason: "Sound wood, sturdy crates or suitable plastic containers can hold soil with proper drainage.",
      warnings: [
        "Use clean materials with a known history, especially for edible plants.",
        "Check pallet stamps. HT means heat-treated. Avoid MB and contaminated pallets.",
        "Confirm what plastic drums held before. Reject unknown or hazardous contents.",
        "Add drainage holes and check that the base supports wet soil."
      ]
    },
    {
      name: "Shelves",
      keywords: ["shelf", "shelves", "shelving", "bookshelf", "bookcase"],
      suitable: ["wood", "mdf", "crates"],
      unsuitable: [
        { category: "fabric", reason: "Fabric cannot form a rigid shelf." },
        { category: "plastic", reason: "Unspecified plastic offcuts may bend under sustained loads." },
        { category: "acrylic", reason: "Thin acrylic can sag or crack under heavy loads." }
      ],
      reason: "Sound boards or sturdy crates can form indoor shelves when properly supported.",
      warnings: [
        "Check thickness, span, joints and brackets for the intended load.",
        "Secure tall shelving against tipping.",
        "Keep standard MDF indoors and dry.",
        "Control cutting dust and wear suitable respiratory and eye protection."
      ]
    },
    {
      name: "Tote bags",
      keywords: ["tote", "totes", "tote bag", "shopping bag", "fabric bag"],
      suitable: ["fabric"],
      unsuitable: [
        { category: "wood", reason: "Wood is too rigid for a sewn bag." },
        { category: "mdf", reason: "MDF is too rigid and heavy for a sewn bag." },
        { category: "acrylic", reason: "Acrylic sheets cannot be sewn like fabric." },
        { category: "plastic", reason: "Unspecified rigid plastic scraps are unsuitable for this sewn design." },
        { category: "crates", reason: "Crates cannot form a flexible bag." }
      ],
      reason: "Clean, strong fabric offcuts can be sewn into reusable bags with reinforced handles.",
      warnings: [
        "Reject fabric contaminated with chemicals, oil or mould.",
        "Wash suitable fabric before sewing.",
        "Reinforce handles and test seams with the intended load."
      ]
    },
    {
      name: "Name signs",
      keywords: ["name sign", "name signs", "nameplate", "door sign", "lettering"],
      suitable: ["wood", "mdf", "acrylic", "plastic"],
      unsuitable: [
        { category: "fabric", reason: "Fabric needs a supporting frame for a rigid sign." },
        { category: "crates", reason: "Whole crates need dismantling before use as flat sign material." }
      ],
      reason: "Flat, clean offcuts can be cut or decorated to make personalised signs.",
      warnings: [
        "Use standard MDF only for dry indoor signs.",
        "Identify plastic before cutting. Never laser-cut PVC or unknown plastics.",
        "Smooth sharp edges and secure wall fixings.",
        "Use dust extraction when cutting or sanding."
      ]
    },
    {
      name: "Robot chassis",
      keywords: ["robot", "robot chassis", "robot base", "robotics", "rover"],
      suitable: ["wood", "mdf", "acrylic", "plastic"],
      unsuitable: [
        { category: "fabric", reason: "Fabric cannot hold motors and axles in alignment." },
        { category: "crates", reason: "Whole crates are bulky for a small robot chassis." }
      ],
      reason: "Rigid sheet offcuts can form a small indoor robot base with mounts for motors and electronics.",
      warnings: [
        "Choose material thickness for the robot's weight and motor forces.",
        "Drill acrylic carefully because it can crack.",
        "Secure batteries and insulate exposed electrical connections.",
        "Identify plastics before machining and keep standard MDF dry."
      ]
    },
    {
      name: "Birdhouse",
      keywords: ["birdhouse", "bird house", "nest box", "nesting box"],
      suitable: ["wood"],
      unsuitable: [
        { category: "mdf", reason: "MDF deteriorates in outdoor moisture." },
        { category: "acrylic", reason: "Clear acrylic provides poor shade and can overheat." },
        { category: "plastic", reason: "Unknown plastic containers can trap heat and condensation." },
        { category: "fabric", reason: "Fabric does not provide a durable protective enclosure." },
        { category: "crates", reason: "Open crate slats leave gaps in the nesting enclosure." }
      ],
      reason: "Clean, untreated solid wood can provide a sheltered nesting enclosure.",
      warnings: [
        "Use untreated wood with no chemical contamination.",
        "Provide ventilation, drainage and an entrance sized for the intended bird species.",
        "Leave interior surfaces unpainted.",
        "Remove protruding nails and mount securely away from intense sun."
      ]
    },
    {
      name: "Bench",
      keywords: ["bench", "garden bench", "seat", "seating", "workbench"],
      suitable: ["wood"],
      unsuitable: [
        { category: "mdf", reason: "Standard MDF is unsuitable for outdoor seating and weak at stressed joints." },
        { category: "acrylic", reason: "Unspecified acrylic offcuts can crack under seating loads." },
        { category: "plastic", reason: "Unknown plastic offcuts have no verified seating load capacity." },
        { category: "fabric", reason: "Fabric alone cannot form the supporting structure." },
        { category: "crates", reason: "Discarded crates may lack the strength needed to support people." }
      ],
      reason: "Sound timber of adequate size can form a bench with properly designed joints and bracing.",
      warnings: [
        "Reject rotten, split or insect-damaged timber.",
        "Check pallet stamps. Prefer clean HT pallets and avoid MB.",
        "Check the frame, fasteners and stability for the intended load before use.",
        "Remove exposed nails and sand splinters."
      ]
    },
    {
      name: "Display stand",
      keywords: ["display stand", "display", "exhibition stand", "product stand", "riser"],
      suitable: ["wood", "mdf", "acrylic", "plastic", "crates"],
      unsuitable: [
        { category: "fabric", reason: "Fabric needs a rigid support to hold displayed objects." }
      ],
      reason: "Rigid offcuts or stable crates can support lightweight products and exhibition displays.",
      warnings: [
        "Check stability and load capacity before placing items on the stand.",
        "Secure stacked crates together.",
        "Smooth exposed edges.",
        "Keep standard MDF indoors and dry."
      ]
    },
    {
      name: "Cushion covers",
      keywords: ["cushion", "cushion cover", "cushion covers", "pillow", "pillowcase"],
      suitable: ["fabric"],
      unsuitable: [
        { category: "wood", reason: "Wood cannot form a soft, washable cover." },
        { category: "mdf", reason: "MDF cannot form a flexible cover." },
        { category: "acrylic", reason: "Acrylic sheet is rigid and uncomfortable as a cover." },
        { category: "plastic", reason: "Unspecified plastic scraps are unsuitable for a breathable sewn cover." },
        { category: "crates", reason: "Crates cannot form a soft cover." }
      ],
      reason: "Clean, washable fabric offcuts can be sewn into removable cushion covers.",
      warnings: [
        "Reject fabric with chemical residues, mould or strong unexplained odours.",
        "Wash suitable fabric before sewing and check for shrinkage.",
        "Remove stray pins and needles.",
        "Keep fabric away from flames and heaters."
      ]
    },
    {
      name: "Storage crate",
      keywords: ["storage crate", "storage box", "crate", "organiser", "organizer"],
      suitable: ["wood", "mdf", "plastic", "crates"],
      unsuitable: [
        { category: "fabric", reason: "Fabric needs a frame to form a rigid crate." },
        { category: "acrylic", reason: "Acrylic may crack during rough handling or stacking." }
      ],
      reason: "Sound panels or existing crates can provide storage when their joints and bases suit the load.",
      warnings: [
        "Check handles, joints and bases before lifting loaded crates.",
        "Confirm previous contents of reused plastic containers.",
        "Keep standard MDF storage boxes indoors and dry.",
        "Stack securely and keep heavy items low."
      ]
    },
    {
      name: "Picture frame",
      keywords: ["picture frame", "photo frame", "frame", "framing", "art frame"],
      suitable: ["wood", "mdf", "acrylic", "plastic"],
      unsuitable: [
        { category: "fabric", reason: "Fabric needs a rigid backing to hold a picture." },
        { category: "crates", reason: "Whole crates need dismantling before making frame parts." }
      ],
      reason: "Clean strips and sheet offcuts can form a decorative frame or clear picture cover.",
      warnings: [
        "Smooth cut edges and remove protruding fasteners.",
        "Use wall fixings suited to the finished frame's weight.",
        "Control dust when cutting MDF and keep it dry.",
        "Identify plastic before cutting or applying heat."
      ]
    },
    {
      name: "Phone stand",
      keywords: ["phone stand", "phone holder", "mobile stand", "mobile holder", "desk stand"],
      suitable: ["wood", "mdf", "acrylic", "plastic"],
      unsuitable: [
        { category: "fabric", reason: "Fabric alone needs filling or a frame to support a phone." },
        { category: "crates", reason: "Whole crates are too bulky for a small desk stand." }
      ],
      reason: "Small rigid offcuts can form a stable base and an angled support for a phone.",
      warnings: [
        "Round and smooth edges that touch the phone.",
        "Check stability with the phone in both orientations.",
        "Leave charging ports and ventilation clear.",
        "Identify plastic before cutting or heating and keep MDF dry."
      ]
    }
  ];