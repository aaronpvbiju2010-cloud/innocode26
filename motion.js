// Load after ui.js.
// Add the coastal introduction and optional movement.

(() => {
  const byId = id =>
    document.getElementById(id);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const motionKey = "driploop-motion-paused";

  let userPaused = false;

  try {
    userPaused =
      localStorage.getItem(motionKey) === "true";
  } catch {
    // Continue with the default when storage is unavailable.
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

  // Introduce Ocean/Dark once.
  // Later visits keep the user's chosen appearance.
  let firstVisit = true;

  try {
    firstVisit =
      localStorage.getItem(
        "driploop-coastal-intro"
      ) !== "seen";
  } catch {
    // Show the new default if preferences cannot be read.
  }

  if (firstVisit) {
    const modeButtons =
      document.querySelectorAll(
        ".mode-options button"
      );

    modeButtons[1]?.click();

    const oceanButton = [
      ...document.querySelectorAll(
        ".palette-option"
      )
    ].find(control =>
      control.textContent.trim() === "Ocean"
    );

    oceanButton?.click();

    try {
      localStorage.setItem(
        "driploop-coastal-intro",
        "seen"
      );
    } catch {
      // Theme changes still work for this visit.
    }
  }

  const main = byId("main");

  const header = document.querySelector(
    ".site-header"
  );

  const hero = document.querySelector(
    ".hero"
  );

  // Place the simple instructions below the hero.
  const steps = hero.querySelector(
    ".how-it-works"
  );

  if (steps) {
    main.prepend(steps);
  }

  // Create the full-width introduction.
  const stage = node(
    "section",
    undefined,
    "night-stage"
  );

  stage.setAttribute(
    "aria-label",
    "Welcome to DripLoop"
  );

  const scene = node(
    "div",
    undefined,
    "night-scene"
  );

  scene.setAttribute(
    "aria-hidden",
    "true"
  );

  const rings = node(
    "div",
    undefined,
    "water-rings"
  );

  for (let index = 0; index < 3; index += 1) {
    rings.append(node("span"));
  }

  scene.append(rings);

  header.before(stage);

  stage.append(
    scene,
    header,
    hero
  );

  // Update the introduction.
  header.querySelector(
    ".brand span"
  ).textContent =
    "A second life for every drop.";

  hero.querySelector(
    ".eyebrow"
  ).textContent =
    "Recovered locally. Reused thoughtfully.";

  hero.querySelector("h1").replaceChildren(
    node("span", "Every drop."),
    node(
      "span",
      "A second life.",
      "accent-text"
    )
  );

  hero.querySelector(
    "p:not(.eyebrow)"
  ).textContent =
    "Free AC water for gardens, cleanups and everyday jobs. Find a source nearby and give its water somewhere useful to go.";

  byId("collector-view").textContent =
    "Find free water";

  byId("collector-view").setAttribute(
    "aria-label",
    "Find free water — Collector view"
  );

  byId("building-view").textContent =
    "Share your water";

  byId("building-view").setAttribute(
    "aria-label",
    "Share your water — Building view"
  );

  hero.append(
    node(
      "p",
      "Non-potable. Never for drinking or cooking.",
      "hero-safety"
    )
  );

  // Use the existing Collector button handler.
  // This also opens the correct panel from Building view.
  function waterLink(text) {
    const link = node("a", text);

    link.href = "#collector-panel";

    link.addEventListener("click", event => {
      event.preventDefault();
      byId("collector-view").click();
    });

    return link;
  }

  // Header navigation.
  const navigation = node(
    "nav",
    undefined,
    "hero-nav"
  );

  navigation.setAttribute(
    "aria-label",
    "Main navigation"
  );

  const pickupsLink = node(
    "a",
    "My pickups"
  );

  pickupsLink.href = "#claims-heading";

  navigation.append(
    waterLink("Find water"),
    pickupsLink
  );

  header.querySelector(
    ".appearance"
  ).before(navigation);

  // Hero footer and background-motion control.
  const stageFooter = node(
    "div",
    undefined,
    "stage-footer"
  );

  const motionButton = node(
    "button",
    "Pause motion",
    "motion-toggle"
  );

  motionButton.type = "button";

  stageFooter.append(
    waterLink("Explore available water"),
    motionButton
  );

  stage.append(stageFooter);

  function applyMotionPreference() {
    const paused =
      reducedMotion.matches || userPaused;

    document.body.classList.toggle(
      "motion-paused",
      paused
    );

    motionButton.setAttribute(
      "aria-pressed",
      String(paused)
    );

    motionButton.disabled =
      reducedMotion.matches;

    if (reducedMotion.matches) {
      motionButton.textContent =
        "Reduced motion on";
    } else if (userPaused) {
      motionButton.textContent =
        "Play motion";
    } else {
      motionButton.textContent =
        "Pause motion";
    }

    if (paused) {
      document.querySelectorAll(
        ".reveal-ready"
      ).forEach(item => {
        item.classList.add("is-visible");
      });
    }
  }

  motionButton.addEventListener(
    "click",
    () => {
      userPaused = !userPaused;

      applyMotionPreference();

      try {
        localStorage.setItem(
          motionKey,
          String(userPaused)
        );
      } catch {
        // The current motion setting still applies.
      }
    }
  );

  reducedMotion.addEventListener(
    "change",
    applyMotionPreference
  );

  applyMotionPreference();

  // Reveal content as it approaches the screen.
  // Leave it visible when this browser lacks the observer.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 30px 0px"
      }
    );

    function revealElements() {
      const elements = document.querySelectorAll(
        ".impact, .water-safety, .panel, .card, .how-it-works"
      );

      for (const item of elements) {
        if (
          item.classList.contains(
            "reveal-ready"
          )
        ) {
          continue;
        }

        item.classList.add(
          "reveal-ready"
        );

        if (
          reducedMotion.matches ||
          userPaused
        ) {
          item.classList.add(
            "is-visible"
          );
        } else {
          observer.observe(item);
        }
      }
    }

    revealElements();

    // New search results and listings also get reveal effects.
    new MutationObserver(
      revealElements
    ).observe(
      byId("listings"),
      { childList: true }
    );

    // Keyboard focus always makes its containing panel visible.
    document.addEventListener(
      "focusin",
      event => {
        event.target.closest(
          ".reveal-ready"
        )?.classList.add(
          "is-visible"
        );
      }
    );
  }

  // A subtle line shows page scroll progress.
  const progress = node(
    "div",
    undefined,
    "reading-progress"
  );

  progress.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.append(progress);

  let scheduled = false;

  function updateProgress() {
    const distance =
      document.documentElement.scrollHeight -
      window.innerHeight;

    let fraction = 0;

    if (distance > 0) {
      fraction = Math.min(
        1,
        Math.max(
          0,
          window.scrollY / distance
        )
      );
    }

    progress.style.transform =
      "scaleX(" + fraction + ")";

    scheduled = false;
  }

  function scheduleProgress() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(
      updateProgress
    );
  }

  window.addEventListener(
    "scroll",
    scheduleProgress,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    scheduleProgress
  );

  updateProgress();
})();
