// DripLoop demo data.
// All building names, quantities and collection details are fictional.

const SOURCE_TYPES = [
  "warehouse",
  "factory",
  "mall",
  "school"
];

const AREAS = [
  "Sajaa",
  "Al Jurf",
  "Emirates Industrial City",
  "Ajman Industrial"
];

const FREQUENCIES = [
  "one-off",
  "daily"
];

const ACCESS_OPTIONS = [
  "jerrycan",
  "tanker"
];

// TODO: Add locally relevant, sourced factors.
// null means the factor has not been configured.
// Apply these only to collected claims where the collector
// answered yes to otherwise using tap water.
const IMPACT_FACTORS = {
  desalinatedLitresPerLitreReused: null,
  kgCO2ePerLitreReused: null
};

// Store a full date-time with an explicit time zone.
// Part 2 will display it in UAE local time.
function demoTankFullBy(hoursFromNow) {
  const milliseconds = hoursFromNow * 60 * 60 * 1000;

  return new Date(
    Date.now() + milliseconds
  ).toISOString();
}

const DEMO_LISTINGS = [
  {
    id: "drip-demo-001",
    source: "Palmline Logistics Warehouse",
    sourceType: "warehouse",
    area: "Sajaa",
    litres: 450,
    litresLeft: 450,
    frequency: "daily",
    tankFullBy: demoTankFullBy(1.5),
    access: "jerrycan",
    qualityNote:
      "AC condensate held in a covered tank. Water quality has not been independently tested. Non-potable. Bring clean, labelled containers.",
    status: "available"
  },
  {
    id: "drip-demo-002",
    source: "Blue Courtyard Mall",
    sourceType: "mall",
    area: "Al Jurf",
    litres: 3200,
    litresLeft: 3200,
    frequency: "daily",
    tankFullBy: demoTankFullBy(3),
    access: "tanker",
    qualityNote:
      "Collected from the building's AC drain network. Covered storage with a tanker connection. Non-potable. Confirm treatment needs before reuse.",
    status: "available"
  },
  {
    id: "drip-demo-003",
    source: "DuneWorks Packaging Factory",
    sourceType: "factory",
    area: "Emirates Industrial City",
    litres: 1800,
    litresLeft: 1800,
    frequency: "daily",
    tankFullBy: demoTankFullBy(5),
    access: "tanker",
    qualityNote:
      "Dedicated AC condensate collection, separate from process wastewater. This separation is a source declaration. Non-potable. Verify quality for your intended use.",
    status: "available"
  },
  {
    id: "drip-demo-004",
    source: "Little Canopy School",
    sourceType: "school",
    area: "Ajman Industrial",
    litres: 280,
    litresLeft: 280,
    frequency: "one-off",
    tankFullBy: demoTankFullBy(7),
    access: "jerrycan",
    qualityNote:
      "Collected in a covered maintenance tank. Arrange access with the building team. Non-potable. Collection equipment must stay separate from drinking-water supplies.",
    status: "available"
  },
  {
    id: "drip-demo-005",
    source: "Cedar Bay Storage Hub",
    sourceType: "warehouse",
    area: "Al Jurf",
    litres: 900,
    litresLeft: 900,
    frequency: "one-off",
    tankFullBy: demoTankFullBy(10),
    access: "tanker",
    qualityNote:
      "Stored AC condensate awaiting collection. Storage age and maintenance records should be confirmed before pickup. Non-potable.",
    status: "available"
  },
  {
    id: "drip-demo-006",
    source: "Atlas Stitch Factory",
    sourceType: "factory",
    area: "Sajaa",
    litres: 650,
    litresLeft: 650,
    frequency: "daily",
    tankFullBy: demoTankFullBy(14),
    access: "jerrycan",
    qualityNote:
      "AC condensate collected separately from production drains. No laboratory report is supplied. Non-potable. Reject water with unusual colour, odour or visible contamination.",
    status: "available"
  },
  {
    id: "drip-demo-007",
    source: "Harbour Steps Shopping Centre",
    sourceType: "mall",
    area: "Ajman Industrial",
    litres: 2400,
    litresLeft: 2400,
    frequency: "daily",
    tankFullBy: demoTankFullBy(20),
    access: "tanker",
    qualityNote:
      "Covered collection tank beside the service yard. Confirm tanker access and hose compatibility with the building team. Non-potable. Clear appearance does not confirm safety.",
    status: "available"
  },
  {
    id: "drip-demo-008",
    source: "Sunpatch Learning Campus",
    sourceType: "school",
    area: "Emirates Industrial City",
    litres: 360,
    litresLeft: 360,
    frequency: "one-off",
    tankFullBy: demoTankFullBy(26),
    access: "jerrycan",
    qualityNote:
      "AC condensate available from a covered collection point. Bring containers labelled NON-POTABLE. Confirm collection time and quality before reuse.",
    status: "available"
  }
];
