
const STORAGE_KEY = "driploop-demo-v1";

const $ = id => document.getElementById(id);

const formatNumber = value =>
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 1
  }).format(value);

const formatEstimate = value =>
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 3
  }).format(value);

const formatDateTime = value =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));

const roundLitres = value =>
  Math.round(value * 10) / 10;

let state;
let role = "collector";
let searchText = "";
let activeListingId = null;
let busy = false;

// Start with a fresh copy of the fictional listings.
function initialState() {
  return {
    listings: structuredClone(DEMO_LISTINGS),
    claims: []
  };
}

function readState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return initialState();
  }

  const parsed = JSON.parse(saved);

  if (
    !parsed ||
    !Array.isArray(parsed.listings) ||
    !Array.isArray(parsed.claims)
  ) {
    throw new Error(
      "Saved records could not be read. Use Reset demo to start again."
    );
  }

  return parsed;
}

function message(text) {
  $("notice").textContent = text;
}

// Create elements safely using textContent.
function element(tag, text, className) {
  const node = document.createElement(tag);

  if (text !== undefined) {
    node.textContent = text;
  }

  if (className) {
    node.className = className;
  }

  return node;
}

// Save listings and claims together.
// Read the latest records before each change.
// Web Locks coordinates changes between supported browser tabs.
async function updateState(change, successText) {
  if (busy) {
    return false;
  }

  busy = true;

  try {
    const save = () => {
      const next = readState();

      change(next);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );

      state = next;
    };

    if (navigator.locks) {
      await navigator.locks.request(STORAGE_KEY, save);
    } else {
      save();
    }

    render();
    message(successText);

    return true;
  } catch (error) {
    message(
      "The change could not be saved. " + error.message
    );

    return false;
  } finally {
    busy = false;
  }
}

// datetime-local has no time zone.
// Display the input minimum using UAE time explicitly.
function minimumUaeDateTime() {
  const oneMinute = 60 * 1000;
  const uaeOffset = 4 * 60 * 60 * 1000;

  return new Date(
    Date.now() + oneMinute + uaeOffset
  ).toISOString().slice(0, 16);
}

// Interpret the building's input as UAE time.
function parseUaeDateTime(value) {
  return new Date(value + "+04:00");
}

function getUrgency(tankFullBy) {
  const remaining =
    Date.parse(tankFullBy) - Date.now();

  if (!Number.isFinite(remaining)) {
    return {
      text: "Check overflow time",
      className: "urgent"
    };
  }

  if (remaining <= 0) {
    return {
      text: "Overflow time passed",
      className: "urgent"
    };
  }

  const hours = Math.ceil(
    remaining / (60 * 60 * 1000)
  );

  let className = "";

  if (hours <= 2) {
    className = "urgent";
  } else if (hours <= 6) {
    className = "soon";
  }

  return {
    text: "Tank overflows in " + hours + " h",
    className
  };
}

function renderMatch() {
  const target = $("match-result");

  target.replaceChildren();

  const query = searchText.trim();

  target.hidden = !query;

  if (!query) {
    return null;
  }

  const use = matchProject(query);

  if (!use) {
    target.append(
      element(
        "p",
        "We could not identify that use. Try plants, car wash, concrete curing, dust suppression or floor cleaning."
      )
    );

    return null;
  }

  target.append(
    element("h3", use.name)
  );

  if (use.suitable) {
    target.append(
      element(
        "span",
        "Suitable with checks",
        "badge available"
      )
    );
  } else {
    // The existing urgent class supplies the red safety styling.
    // High-contrast mode overrides it through style.css.
    const banner = element(
      "div",
      "UNSUITABLE — Do not use AC condensate for this purpose.",
      "badge urgent"
    );

    banner.setAttribute("role", "alert");
    banner.style.display = "block";
    banner.style.padding = "14px";
    banner.style.marginBottom = "12px";

    target.append(banner);
  }

  target.append(
    element("p", use.reason)
  );

  const warnings = element("ul");

  for (const warning of use.warnings) {
    warnings.append(
      element("li", warning)
    );
  }

  target.append(
    element("strong", "Before you collect"),
    warnings
  );

  if (use.suitable) {
    target.append(
      element(
        "p",
        "This match identifies a possible use. Check each source's water quality and any treatment needed."
      )
    );
  }

  return use;
}

function renderListings(use) {
  const container = $("listings");

  container.replaceChildren();

  const searching =
    role === "collector" &&
    searchText.trim() !== "";

  const listings = state.listings
    .filter(listing => {
      if (role === "building") {
        return true;
      }

      if (
        listing.status !== "available" ||
        listing.litresLeft <= 0
      ) {
        return false;
      }

      if (searching) {
        return Boolean(use && use.suitable);
      }

      return true;
    })
    .sort((a, b) => {
      const aAvailable =
        a.status === "available" && a.litresLeft > 0;

      const bAvailable =
        b.status === "available" && b.litresLeft > 0;

      if (aAvailable !== bAvailable) {
        return aAvailable ? -1 : 1;
      }

      return (
        Date.parse(a.tankFullBy) -
        Date.parse(b.tankFullBy)
      );
    });

  $("listing-count").textContent =
    listings.length +
    (listings.length === 1 ? " source" : " sources");

  for (const listing of listings) {
    const card = element(
      "article",
      undefined,
      "card"
    );

    const badges = element(
      "div",
      undefined,
      "badges"
    );

    badges.append(
      element(
        "span",
        listing.sourceType.toUpperCase(),
        "badge"
      ),
      element(
        "span",
        listing.status,
        "badge " + listing.status
      )
    );

    if (listing.frequency === "daily") {
      badges.append(
        element(
          "span",
          "Daily stream",
          "badge available"
        )
      );
    }

    if (listing.status === "available") {
      const urgency = getUrgency(listing.tankFullBy);

      badges.append(
        element(
          "span",
          urgency.text,
          "badge " + urgency.className
        )
      );
    }

    card.append(
      badges,
      element("h3", listing.source),
      element(
        "p",
        formatNumber(listing.litresLeft) +
          " litres ready for another job."
      )
    );

    const details = element("dl");

    const accessText =
      listing.access === "tanker"
        ? "Tanker access"
        : "Jerrycan collection";

    const frequencyText =
      listing.frequency === "daily"
        ? "Daily stream"
        : "One-off collection";

    const fields = [
      ["Area", listing.area],
      [
        "Available",
        formatNumber(listing.litresLeft) +
          " / " +
          formatNumber(listing.litres) +
          " L"
      ],
      ["Collection", "Free"],
      ["Frequency", frequencyText],
      [
        "Tank full by",
        formatDateTime(listing.tankFullBy) +
          " UAE time"
      ],
      ["Access", accessText],
      ["Water quality", listing.qualityNote]
    ];

    for (const [label, value] of fields) {
      details.append(
        element("dt", label),
        element("dd", value)
      );
    }

    card.append(details);

    if (
      listing.status === "available" &&
      Date.parse(listing.tankFullBy) <= Date.now()
    ) {
      card.append(
        element(
          "p",
          "The predicted overflow time has passed. Confirm the current volume with the building.",
          "demo-note"
        )
      );
    }

    if (
      role === "collector" &&
      listing.status === "available" &&
      listing.litresLeft > 0
    ) {
      const actions = element(
        "div",
        undefined,
        "actions"
      );

      const button = element(
        "button",
        "Claim water"
      );

      button.type = "button";

      button.setAttribute(
        "aria-label",
        "Claim water from " + listing.source
      );

      button.addEventListener("click", () => {
        openClaim(listing.id);
      });

      actions.append(button);
      card.append(actions);
    }

    container.append(card);
  }

  if (!listings.length) {
    let emptyText =
      "No water is available here yet. A building can add its collected water in Building view.";

    if (searching && use && !use.suitable) {
      emptyText =
        "Sources are hidden because this use is unsuitable. Choose a suitable non-potable use to continue.";
    } else if (searching && !use) {
      emptyText =
        "Try a recognised use or select Show all sources.";
    }

    container.append(
      element("p", emptyText, "empty")
    );
  }
}

function renderClaims() {
  const container = $("claims");

  container.replaceChildren();

  for (const claim of state.claims) {
    const row = element(
      "article",
      undefined,
      "claim-row"
    );

    row.append(
      element(
        "strong",
        claim.source +
          " · " +
          formatNumber(claim.litres) +
          " L"
      )
    );

    row.append(
      element(
        "p",
        "Would otherwise use tap water — " +
          (claim.wouldUseTap ? "Yes" : "No")
      )
    );

    if (claim.status === "collected") {
      row.append(
        element(
          "span",
          "Collected",
          "badge collected"
        )
      );
    } else {
      const button = element(
        "button",
        "Mark collected"
      );

      button.type = "button";

      button.setAttribute(
        "aria-label",
        "Confirm collection of " +
          formatNumber(claim.litres) +
          " litres from " +
          claim.source
      );

      button.addEventListener("click", () => {
        collectClaim(claim.id);
      });

      row.append(button);
    }

    container.append(row);
  }

  if (!state.claims.length) {
    container.append(
      element(
        "p",
        "Claim your first litres and track their collection here.",
        "empty"
      )
    );
  }
}

function validFactor(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function renderImpact() {
  const collected = state.claims.filter(
    claim => claim.status === "collected"
  );

  const reusedLitres = collected.reduce(
    (sum, claim) => sum + claim.litres,
    0
  );

  const eligibleLitres = collected
    .filter(claim => claim.wouldUseTap)
    .reduce(
      (sum, claim) => sum + claim.litres,
      0
    );

  const waterFactor =
    IMPACT_FACTORS.desalinatedLitresPerLitreReused;

  const co2Factor =
    IMPACT_FACTORS.kgCO2ePerLitreReused;

  $("impact-litres").textContent =
    formatNumber(reusedLitres) + " L";

  if (validFactor(waterFactor)) {
    $("impact-water").textContent =
      formatEstimate(eligibleLitres * waterFactor) +
      " L";
  } else {
    $("impact-water").textContent =
      "Awaiting factor";
  }

  if (validFactor(co2Factor)) {
    $("impact-co2").textContent =
      formatEstimate(eligibleLitres * co2Factor) +
      " kg CO₂e";
  } else {
    $("impact-co2").textContent =
      "Awaiting factor";
  }

  let note =
    "Only confirmed collections count. Estimates use the " +
    formatNumber(eligibleLitres) +
    " L collected by users who would otherwise have used tap water.";

  if (
    !validFactor(waterFactor) ||
    !validFactor(co2Factor)
  ) {
    note +=
      " Estimates awaiting a factor will appear once sourced values are configured.";
  }

  $("impact-note").textContent = note;
}

function render() {
  $("collector-panel").hidden =
    role !== "collector";

  $("building-panel").hidden =
    role !== "building";

  for (const view of ["collector", "building"]) {
    const button = $(view + "-view");
    const selected = role === view;

    button.setAttribute(
      "aria-pressed",
      String(selected)
    );

    button.classList.toggle(
      "secondary",
      !selected
    );
  }

  $("tank-full-by").min = minimumUaeDateTime();

  const use = renderMatch();

  renderListings(use);
  renderClaims();
  renderImpact();
}

function openClaim(id) {
  const listing = state.listings.find(
    item => item.id === id
  );

  if (
    !listing ||
    listing.status !== "available" ||
    listing.litresLeft <= 0
  ) {
    message("This source is no longer available.");
    return;
  }

  activeListingId = id;

  $("claim-form").reset();
  $("claim-error").textContent = "";

  $("claim-details").textContent =
    listing.source +
    " · " +
    formatNumber(listing.litresLeft) +
    " L available · " +
    listing.access +
    " collection";

  // Allow the final remainder if less than one litre remains.
  const minimum = Math.min(
    1,
    listing.litresLeft
  );

  $("claim-litres").min = minimum;
  $("claim-litres").max = listing.litresLeft;
  $("claim-litres").value = minimum;

  $("claim-dialog").showModal();
  $("claim-litres").focus();
}

$("claim-form").addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (!$("claim-form").reportValidity()) {
      return;
    }

    if (busy) {
      return;
    }

    const litres = Number(
      $("claim-litres").value
    );

    const answer = $("claim-tap").value;
    const listingId = activeListingId;

    const saved = await updateState(next => {
      const listing = next.listings.find(
        item => item.id === listingId
      );

      if (
        !listing ||
        listing.status !== "available" ||
        listing.litresLeft <= 0
      ) {
        throw new Error(
          "This source is no longer available."
        );
      }

      const minimum = Math.min(
        1,
        listing.litresLeft
      );

      if (
        !Number.isFinite(litres) ||
        litres < minimum ||
        litres > listing.litresLeft
      ) {
        throw new Error(
          "Choose a quantity within the remaining " +
            formatNumber(listing.litresLeft) +
            " litres."
        );
      }

      if (!["yes", "no"].includes(answer)) {
        throw new Error(
          "Choose whether you would otherwise use tap water."
        );
      }

      listing.litresLeft = roundLitres(
        listing.litresLeft - litres
      );

      listing.status =
        listing.litresLeft === 0
          ? "claimed"
          : "available";

      next.claims.push({
        id: crypto.randomUUID(),
        listingId: listing.id,
        source: listing.source,
        litres,
        wouldUseTap: answer === "yes",
        status: "claimed",
        createdAt: new Date().toISOString()
      });
    }, "Your litres are claimed. Confirm collection after pickup.");

    if (saved) {
      $("claim-dialog").close();
    } else {
      $("claim-error").textContent =
        $("notice").textContent;
    }
  }
);

function collectClaim(id) {
  return updateState(next => {
    const claim = next.claims.find(
      item => item.id === id
    );

    if (!claim) {
      throw new Error(
        "This claim no longer exists."
      );
    }

    // Repeating this action must not count the water twice.
    if (claim.status === "collected") {
      return;
    }

    claim.status = "collected";
    claim.collectedAt = new Date().toISOString();

    const listing = next.listings.find(
      item => item.id === claim.listingId
    );

    const allCollected = next.claims
      .filter(
        item => item.listingId === claim.listingId
      )
      .every(
        item => item.status === "collected"
      );

    if (
      listing &&
      listing.litresLeft === 0 &&
      allCollected
    ) {
      listing.status = "collected";
    }
  }, "Collection confirmed. Those litres now count towards reuse.");
}

$("post-form").addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity() || busy) {
      return;
    }

    const fields = new FormData(form);

    const text = name =>
      String(fields.get(name) || "").trim();

    const litres = Number(
      fields.get("litres")
    );

    const fullBy = parseUaeDateTime(
      text("tankFullBy")
    );

    const saved = await updateState(next => {
      if (!text("source")) {
        throw new Error(
          "Enter the building name."
        );
      }

      if (!text("qualityNote")) {
        throw new Error(
          "Add water-quality and collection notes."
        );
      }

      if (!SOURCE_TYPES.includes(text("sourceType"))) {
        throw new Error(
          "Choose a building type."
        );
      }

      if (!AREAS.includes(text("area"))) {
        throw new Error(
          "Choose an area."
        );
      }

      if (!FREQUENCIES.includes(text("frequency"))) {
        throw new Error(
          "Choose a collection frequency."
        );
      }

      if (!ACCESS_OPTIONS.includes(text("access"))) {
        throw new Error(
          "Choose a collection access option."
        );
      }

      if (
        !Number.isFinite(litres) ||
        litres < 1
      ) {
        throw new Error(
          "Enter at least one litre."
        );
      }

      if (
        !Number.isFinite(fullBy.getTime()) ||
        fullBy.getTime() <= Date.now()
      ) {
        throw new Error(
          "Choose a future tank-full time in UAE time."
        );
      }

      next.listings.push({
        id: crypto.randomUUID(),
        source: text("source"),
        sourceType: text("sourceType"),
        area: text("area"),
        litres,
        litresLeft: litres,
        frequency: text("frequency"),
        tankFullBy: fullBy.toISOString(),
        access: text("access"),
        qualityNote: text("qualityNote"),
        status: "available"
      });
    }, "Your water is listed. Collectors can now claim available litres.");

    if (saved) {
      form.reset();
    }
  }
);

$("collector-view").addEventListener("click", () => {
  role = "collector";
  render();
});

$("building-view").addEventListener("click", () => {
  role = "building";
  render();
});

$("search-form").addEventListener("submit", event => {
  event.preventDefault();

  searchText = $("water-search").value;

  render();
});

$("clear-search").addEventListener("click", () => {
  searchText = "";
  $("water-search").value = "";

  render();
});

$("cancel-claim").addEventListener("click", () => {
  $("claim-dialog").close();
});

$("contrast-toggle").addEventListener("click", () => {
  const enabled = document.body.classList.toggle(
    "contrast"
  );

  $("contrast-toggle").setAttribute(
    "aria-pressed",
    String(enabled)
  );
});

$("load-demo").addEventListener("click", () => {
  updateState(next => {
    const existingIds = new Set(
      next.listings.map(item => item.id)
    );

    const missingListings =
      structuredClone(DEMO_LISTINGS).filter(
        item => !existingIds.has(item.id)
      );

    next.listings.push(...missingListings);
  }, "Demo sources loaded. Existing listings and claims were kept.");
});

$("reset-demo").addEventListener(
  "click",
  async () => {
    if (busy) {
      return;
    }

    const approved = confirm(
      "Replace this browser's DripLoop listings and claims with the fictional demo data?"
    );

    if (!approved) {
      return;
    }

    busy = true;

    try {
      const reset = () => {
        const next = initialState();

        // Move demo overflow times relative to this reset.
        const originalStart = Math.min(
          ...DEMO_LISTINGS.map(
            item => Date.parse(item.tankFullBy)
          )
        );

        const newStart =
          Date.now() + 1.5 * 60 * 60 * 1000;

        const shift = newStart - originalStart;

        for (const listing of next.listings) {
          listing.tankFullBy = new Date(
            Date.parse(listing.tankFullBy) + shift
          ).toISOString();
        }

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next)
        );

        state = next;
      };

      if (navigator.locks) {
        await navigator.locks.request(
          STORAGE_KEY,
          reset
        );
      } else {
        reset();
      }

      searchText = "";
      $("water-search").value = "";

      render();

      message(
        "Demo reset. Eight fictional sources are ready to explore."
      );
    } catch (error) {
      message(
        "The demo could not be reset. " + error.message
      );
    } finally {
      busy = false;
    }
  }
);

// Refresh records when another tab changes the same storage.
window.addEventListener("storage", event => {
  if (
    event.key !== STORAGE_KEY &&
    event.key !== null
  ) {
    return;
  }

  try {
    state = readState();
    render();
  } catch (error) {
    message(error.message);
  }
});

// Load saved records or start the demo.
try {
  state = readState();

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  }
} catch (error) {
  state = initialState();

  message(
    "Saved records could not be loaded. Showing demo sources. Changes need working browser storage. " +
      error.message
  );
}

render();

// Refresh overflow badges without rebuilding the page
// while someone is entering a claim.
function refreshTimeDisplay() {
  if (
    document.hidden ||
    $("claim-dialog").open ||
    $("building-panel").contains(document.activeElement)
  ) {
    return;
  }

  render();
}

document.addEventListener(
  "visibilitychange",
  refreshTimeDisplay
);

setInterval(refreshTimeDisplay, 60000);
