
// Load after app.js.
// Enhance the existing DripLoop page.

(() => {
    const preferenceKey = "driploop-appearance-v1";
    const root = document.documentElement;
  
    const byId = id =>
      document.getElementById(id);
  
    const palettes = [
      "mint",
      "ocean",
      "sunset",
      "lavender"
    ];
  
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  
    let preferences = {
      mode: systemDark ? "dark" : "light",
      palette: "mint",
      contrast: false
    };
  
    // Restore a previously selected appearance.
    try {
      const saved = JSON.parse(
        localStorage.getItem(preferenceKey)
      );
  
      if (
        saved &&
        ["light", "dark"].includes(saved.mode)
      ) {
        preferences.mode = saved.mode;
      }
  
      if (
        saved &&
        palettes.includes(saved.palette)
      ) {
        preferences.palette = saved.palette;
      }
  
      if (
        saved &&
        typeof saved.contrast === "boolean"
      ) {
        preferences.contrast = saved.contrast;
      }
    } catch {
      // The page still works without browser storage.
    }
  
    function node(tag, text, className) {
      const result = document.createElement(tag);
  
      if (text !== undefined) {
        result.textContent = text;
      }
  
      if (className) {
        result.className = className;
      }
  
      return result;
    }
  
    function button(text, className, action) {
      const result = node(
        "button",
        text,
        className
      );
  
      result.type = "button";
      result.addEventListener("click", action);
  
      return result;
    }
  
    const announcer = node(
      "span",
      "",
      "sr-only"
    );
  
    announcer.setAttribute("role", "status");
    document.body.append(announcer);
  
    function savePreferences() {
      try {
        localStorage.setItem(
          preferenceKey,
          JSON.stringify(preferences)
        );
      } catch {
        announcer.textContent =
          "Theme applied. This browser could not save your preference.";
      }
    }
  
    // Build the appearance menu.
    const header = document.querySelector(
      ".site-header"
    );
  
    const appearance = node(
      "details",
      undefined,
      "appearance"
    );
  
    const appearanceLabel = node(
      "summary",
      "Colours & display"
    );
  
    const appearancePanel = node(
      "div",
      undefined,
      "appearance-panel"
    );
  
    appearance.append(
      appearanceLabel,
      appearancePanel
    );
  
    header.append(appearance);
  
    appearancePanel.append(
      node("h2", "Make it feel like you.")
    );
  
    // Light and dark controls.
    const modeGroup = node(
      "div",
      undefined,
      "mode-options"
    );
  
    modeGroup.setAttribute("role", "group");
    modeGroup.setAttribute(
      "aria-label",
      "Light or dark mode"
    );
  
    const modeButtons = new Map();
  
    for (const mode of ["light", "dark"]) {
      const control = button(
        mode === "light" ? "☀ Light" : "☾ Dark",
        "secondary",
        () => {
          preferences.mode = mode;
          applyAppearance();
          savePreferences();
        }
      );
  
      modeButtons.set(mode, control);
      modeGroup.append(control);
    }
  
    appearancePanel.append(
      modeGroup,
      node(
        "p",
        "Pick a colour palette",
        "control-label"
      )
    );
  
    // Palette controls.
    const paletteGroup = node(
      "div",
      undefined,
      "palette-options"
    );
  
    paletteGroup.setAttribute("role", "group");
    paletteGroup.setAttribute(
      "aria-label",
      "Colour palette"
    );
  
    const paletteButtons = new Map();
  
    for (const palette of palettes) {
      const name =
        palette[0].toUpperCase() +
        palette.slice(1);
  
      const control = button(
        "",
        "palette-option",
        () => {
          preferences.palette = palette;
          applyAppearance();
          savePreferences();
        }
      );
  
      const swatch = node(
        "span",
        "",
        "swatch swatch-" + palette
      );
  
      swatch.setAttribute(
        "aria-hidden",
        "true"
      );
  
      control.append(
        swatch,
        node("span", name)
      );
  
      paletteButtons.set(palette, control);
      paletteGroup.append(control);
    }
  
    appearancePanel.append(paletteGroup);
  
    // Move the existing contrast control into the menu.
    const contrastButton = byId(
      "contrast-toggle"
    );
  
    appearancePanel.append(contrastButton);
  
    const contrastNote = node(
      "p",
      "High contrast overrides palette colours for stronger visibility.",
      "theme-note"
    );
  
    appearancePanel.append(contrastNote);
  
    function applyAppearance() {
      root.dataset.mode = preferences.mode;
      root.dataset.palette = preferences.palette;
  
      document.body.classList.toggle(
        "contrast",
        preferences.contrast
      );
  
      contrastButton.setAttribute(
        "aria-pressed",
        String(preferences.contrast)
      );
  
      contrastNote.hidden =
        !preferences.contrast;
  
      for (const [mode, control] of modeButtons) {
        control.setAttribute(
          "aria-pressed",
          String(mode === preferences.mode)
        );
      }
  
      for (
        const [palette, control]
        of paletteButtons
      ) {
        control.setAttribute(
          "aria-pressed",
          String(palette === preferences.palette)
        );
      }
  
      announcer.textContent =
        preferences.palette +
        " palette, " +
        preferences.mode +
        " mode.";
    }
  
    // app.js already handles toggling the contrast class.
    // This listener saves the resulting preference.
    contrastButton.addEventListener(
      "click",
      () => {
        preferences.contrast =
          document.body.classList.contains(
            "contrast"
          );
  
        contrastNote.hidden =
          !preferences.contrast;
  
        savePreferences();
      }
    );
  
    applyAppearance();
  
    // Close the appearance menu when clicking elsewhere.
    document.addEventListener(
      "click",
      event => {
        if (!appearance.contains(event.target)) {
          appearance.open = false;
        }
      }
    );
  
    // Escape closes the menu and restores keyboard focus.
    appearance.addEventListener(
      "keydown",
      event => {
        if (event.key === "Escape") {
          appearance.open = false;
          appearanceLabel.focus();
        }
      }
    );
  
    // Refresh the page wording.
    document.querySelector(
      ".brand span"
    ).textContent = "Small drops. Real change.";
  
    document.querySelector(
      ".eyebrow"
    ).textContent = "Free water. A fresh purpose.";
  
    const heading = document.querySelector(
      ".hero h1"
    );
  
    heading.replaceChildren(
      node("span", "Good water."),
      node(
        "span",
        "Another chance.",
        "accent-text"
      )
    );
  
    document.querySelector(
      ".hero > p:not(.eyebrow)"
    ).textContent =
      "Your AC makes water. Give it a new job watering plants, washing cars or helping a local site.";
  
    byId("collector-view").textContent =
      "Get water";
  
    byId("collector-view").setAttribute(
      "aria-label",
      "Get water — Collector view"
    );
  
    byId("building-view").textContent =
      "Share water";
  
    byId("building-view").setAttribute(
      "aria-label",
      "Share water — Building view"
    );
  
    byId("listings-heading").textContent =
      "Find your next drop.";
  
    byId("claims-heading").textContent =
      "Your pickups";
  
    byId(
      "claims-heading"
    ).nextElementSibling.textContent =
      "Picked up your water? Tap Mark collected.";
  
    // Add three simple instructions.
    const steps = node(
      "ol",
      undefined,
      "how-it-works"
    );
  
    const instructions = [
      [
        "Find water",
        "Choose a source near you."
      ],
      [
        "Pick your litres",
        "Take just what you need."
      ],
      [
        "Collect & confirm",
        "Give those drops a new job."
      ]
    ];
  
    for (const [title, copy] of instructions) {
      const step = node("li");
  
      step.append(
        node("strong", title),
        node("span", copy)
      );
  
      steps.append(step);
    }
  
    document.querySelector(
      ".hero"
    ).append(steps);
  
    // Keep the water-safety message prominent.
    const safety = [
      ...document.querySelectorAll(
        "main > .demo-note"
      )
    ].find(item => item.querySelector("strong"));
  
    if (safety) {
      safety.className = "water-safety";
  
      safety.replaceChildren(
        node(
          "strong",
          "For useful jobs. Never for drinking."
        ),
        node(
          "span",
          "AC water may contain bacteria or metals. Keep it away from food, drinks and animal drinking bowls."
        )
      );
    }
  
    // Add one-tap choices above the search box.
    const quickUses = node(
      "div",
      undefined,
      "quick-uses"
    );
  
    quickUses.setAttribute("role", "group");
    quickUses.setAttribute(
      "aria-label",
      "Choose what you need water for"
    );
  
    const search = byId("water-search");
    const searchForm = byId("search-form");
    const useButtons = [];
  
    const useChoices = [
      ["🌱", "Plants", "plants"],
      ["🚗", "Wash cars", "car wash"],
      ["🏗️", "Concrete", "concrete curing"],
      ["🧹", "Clean floors", "floor cleaning"]
    ];
  
    for (
      const [icon, title, query]
      of useChoices
    ) {
      const control = button(
        "",
        "use-button",
        () => {
          search.value = query;
          searchForm.requestSubmit();
        }
      );
  
      const symbol = node(
        "span",
        icon,
        "use-icon"
      );
  
      symbol.setAttribute(
        "aria-hidden",
        "true"
      );
  
      control.append(
        symbol,
        node("span", title)
      );
  
      control.dataset.query = query;
  
      control.setAttribute(
        "aria-pressed",
        "false"
      );
  
      useButtons.push(control);
      quickUses.append(control);
    }
  
    searchForm.before(quickUses);
  
    function updateUseButtons() {
      const query = search.value
        .trim()
        .toLowerCase();
  
      for (const control of useButtons) {
        control.setAttribute(
          "aria-pressed",
          String(
            query === control.dataset.query
          )
        );
      }
    }
  
    // Wait briefly after typing before updating results.
    let searchTimer;
  
    search.addEventListener(
      "input",
      () => {
        clearTimeout(searchTimer);
  
        searchTimer = setTimeout(
          () => searchForm.requestSubmit(),
          300
        );
      }
    );
  
    searchForm.addEventListener(
      "submit",
      () => {
        clearTimeout(searchTimer);
        updateUseButtons();
      }
    );
  
    byId("clear-search").addEventListener(
      "click",
      () => {
        clearTimeout(searchTimer);
        updateUseButtons();
        search.focus();
      }
    );
  
    // Make cards easier to scan.
    // Full water-quality and collection details remain available.
    function enhanceCards() {
      const cards = document.querySelectorAll(
        "#listings .card:not([data-enhanced])"
      );
  
      for (const card of cards) {
        card.dataset.enhanced = "true";
  
        const info = card.querySelector("dl");
  
        if (!info) {
          continue;
        }
  
        const fields = [
          ...info.querySelectorAll("dt")
        ];
  
        const area = fields
          .find(
            item => item.textContent === "Area"
          )
          ?.nextElementSibling
          ?.textContent;
  
        const access = fields
          .find(
            item => item.textContent === "Access"
          )
          ?.nextElementSibling
          ?.textContent;
  
        const location = node(
          "p",
          [area, access]
            .filter(Boolean)
            .join(" · "),
          "source-location"
        );
  
        card.querySelector("h3").after(location);
  
        const disclosure = node(
          "details",
          undefined,
          "source-details"
        );
  
        disclosure.append(
          node(
            "summary",
            "Water & pickup details"
          )
        );
  
        info.before(disclosure);
        disclosure.append(info);
  
        const claim = card.querySelector(
          ".actions button"
        );
  
        if (claim) {
          claim.textContent =
            "Choose my litres";
        }
      }
    }
  
    // app.js redraws the cards after searches and claims.
    // Enhance each newly created card once.
    new MutationObserver(
      enhanceCards
    ).observe(
      byId("listings"),
      { childList: true }
    );
  
    enhanceCards();
  
    // Add large quantity controls to the existing dialog.
    const quantity = byId("claim-litres");
  
    const quantityRow = node(
      "div",
      undefined,
      "quantity-control"
    );
  
    const quantityLabel = quantity.closest(
      "label"
    );
  
    quantityLabel.after(quantityRow);
  
    function changeQuantity(amount) {
      const minimum =
        Number(quantity.min) || 1;
  
      const maximum = Number(quantity.max);
  
      const current =
        Number(quantity.value) || minimum;
  
      const next =
        Math.round((current + amount) * 10) / 10;
  
      quantity.value = Math.min(
        maximum,
        Math.max(minimum, next)
      );
  
      quantity.dispatchEvent(
        new Event(
          "input",
          { bubbles: true }
        )
      );
    }
  
    const minus = button(
      "−",
      "secondary",
      () => changeQuantity(-10)
    );
  
    const plus = button(
      "+",
      "secondary",
      () => changeQuantity(10)
    );
  
    minus.setAttribute(
      "aria-label",
      "Remove 10 litres"
    );
  
    plus.setAttribute(
      "aria-label",
      "Add 10 litres"
    );
  
    quantityRow.append(
      minus,
      quantity,
      plus
    );
  
    const quantityHelp = node(
      "p",
      "Use + or − to change by 10 litres, or type an amount.",
      "theme-note"
    );
  
    quantityHelp.id = "quantity-help";
  
    quantity.setAttribute(
      "aria-describedby",
      quantityHelp.id
    );
  
    quantityRow.after(quantityHelp);
  
    // Add preset amounts.
    const quickAmounts = node(
      "div",
      undefined,
      "quick-amounts"
    );
  
    quickAmounts.setAttribute(
      "role",
      "group"
    );
  
    quickAmounts.setAttribute(
      "aria-label",
      "Quick litre amounts"
    );
  
    for (const amount of [10, 25, 50]) {
      const control = button(
        amount + " L",
        "secondary",
        () => {
          quantity.value = amount;
  
          quantity.dispatchEvent(
            new Event(
              "input",
              { bubbles: true }
            )
          );
        }
      );
  
      control.dataset.amount = amount;
      quickAmounts.append(control);
    }
  
    quickAmounts.append(
      button(
        "All available",
        "secondary",
        () => {
          quantity.value = quantity.max;
  
          quantity.dispatchEvent(
            new Event(
              "input",
              { bubbles: true }
            )
          );
        }
      )
    );
  
    quantityHelp.after(quickAmounts);
  
    function syncQuantityControls() {
      const value = Number(quantity.value);
      const minimum = Number(quantity.min);
      const maximum = Number(quantity.max);
  
      minus.disabled = value <= minimum;
      plus.disabled = value >= maximum;
  
      const presets = quickAmounts.querySelectorAll(
        "[data-amount]"
      );
  
      for (const control of presets) {
        const amount = Number(
          control.dataset.amount
        );
  
        control.disabled =
          amount > maximum ||
          amount < minimum;
      }
    }
  
    quantity.addEventListener(
      "input",
      syncQuantityControls
    );
  
    new MutationObserver(
      syncQuantityControls
    ).observe(
      byId("claim-dialog"),
      {
        attributes: true,
        attributeFilter: ["open"]
      }
    );
  
    // Move directly to the chosen task.
    // app.js handles showing the appropriate panel first.
    for (const view of ["collector", "building"]) {
      byId(view + "-view").addEventListener(
        "click",
        () => {
          const panel = byId(
            view + "-panel"
          );
  
          const title = panel.querySelector("h2");
  
          title.tabIndex = -1;
  
          title.focus({
            preventScroll: true
          });
  
          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
  
          panel.scrollIntoView({
            block: "start",
            behavior: reducedMotion
              ? "instant"
              : "smooth"
          });
        }
      );
    }
  })();
