// Illustrated DripLoop.
// Replace the previous motion.js and load after ui.js.

(() => {
  const byId = id =>
    document.getElementById(id);

  const root = document.documentElement;

  const reduced = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const finePointer = matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  let userPaused = false;

  try {
    userPaused =
      localStorage.getItem(
        "driploop-motion-paused"
      ) === "true";
  } catch {
    // Use the default when storage is unavailable.
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

  function button(text, action, className) {
    const result = node(
      "button",
      text,
      className
    );

    result.type = "button";
    result.addEventListener("click", action);

    return result;
  }

  // Rename the visible palette while keeping its saved key.
  const oceanButton = [
    ...document.querySelectorAll(
      ".palette-option"
    )
  ].find(item =>
    item.textContent.trim() === "Ocean"
  );

  const oceanLabel =
    oceanButton?.querySelector(
      "span:last-child"
    );

  if (oceanLabel) {
    oceanLabel.textContent = "Midnight";
  }

  let savedAppearance = null;

  try {
    savedAppearance = localStorage.getItem(
      "driploop-appearance-v1"
    );
  } catch {
    // Continue with the default appearance.
  }

  if (!savedAppearance) {
    document.querySelectorAll(
      ".mode-options button"
    )[1]?.click();

    oceanButton?.click();
  }

  // Original illustrated background.
  const art = node(
    "div",
    undefined,
    "night-art"
  );

  art.setAttribute(
    "aria-hidden",
    "true"
  );

  const picture = node(
    "div",
    undefined,
    "night-picture"
  );

  const lights = node(
    "div",
    undefined,
    "night-lights"
  );

  for (let index = 0; index < 7; index += 1) {
    const light = node("span");

    light.style.setProperty(
      "--i",
      index
    );

    lights.append(light);
  }

  art.append(picture, lights);
  document.body.prepend(art);

  // Introduction.
  const hero = document.querySelector(
    ".hero"
  );

  const header = document.querySelector(
    ".site-header"
  );

  header.querySelector(
    ".brand span"
  ).textContent =
    "Every drop has another chapter.";

  hero.querySelector(
    ".eyebrow"
  ).textContent =
    "Collected nearby. Given a new purpose.";

  hero.querySelector("h1").replaceChildren(
    node("span", "Small drops."),
    node(
      "span",
      "Big possibilities.",
      "accent-text"
    )
  );

  hero.querySelector(
    "p:not(.eyebrow)"
  ).textContent =
    "Your AC creates water. Help it reach a garden, a workshop or a useful job around the corner.";

  hero.append(
    node(
      "p",
      "Non-potable. Never for drinking, cooking or animal drinking water.",
      "hero-safety"
    )
  );

  // Turn the existing instructions into a collection diagram.
  const story = hero.querySelector(
    ".how-it-works"
  );

  if (story) {
    story.classList.add("water-story");

    story.setAttribute(
      "aria-label",
      "Illustrated water collection journey"
    );

    const captions = [
      [
        "building",
        "A building collects",
        "AC water is saved in a tank."
      ],
      [
        "tank",
        "You choose your litres",
        "Claim an amount you can collect."
      ],
      [
        "plant",
        "The water gets a new job",
        "Confirm pickup to record reuse."
      ]
    ];

    [...story.children].forEach(
      (item, index) => {
        const [kind, title, copy] =
          captions[index];

        const icon = node(
          "div",
          undefined,
          "story-icon " + kind
        );

        icon.setAttribute(
          "aria-hidden",
          "true"
        );

        icon.append(
          node("i"),
          node("i"),
          node("i")
        );

        item.replaceChildren(
          icon,
          node("strong", title),
          node("span", copy)
        );
      }
    );

    const track = node(
      "div",
      undefined,
      "flow-track"
    );

    track.setAttribute(
      "aria-hidden",
      "true"
    );

    track.append(
      node("span"),
      node("span")
    );

    const wrapper = node(
      "section",
      undefined,
      "journey"
    );

    wrapper.setAttribute(
      "aria-label",
      "How collection works"
    );

    hero.after(wrapper);

    wrapper.append(
      track,
      story,
      node(
        "p",
        "Illustration of the collection journey.",
        "journey-caption"
      )
    );
  }

  // Navigation.
  const navigation = node(
    "nav",
    undefined,
    "hero-nav"
  );

  navigation.setAttribute(
    "aria-label",
    "Main navigation"
  );

  const find = node(
    "a",
    "Find water"
  );

  find.href = "#collector-panel";

  find.addEventListener(
    "click",
    event => {
      event.preventDefault();
      byId("collector-view").click();
    }
  );

  const pickups = node(
    "a",
    "My pickups"
  );

  pickups.href = "#claims-heading";

  navigation.append(find, pickups);

  header.querySelector(
    ".appearance"
  ).before(navigation);

  header.querySelector(
    ".appearance > summary"
  ).textContent = "Style & motion";

  // Motion preference.
  const motionButton = button(
    "Pause animations",
    () => {
      userPaused = !userPaused;

      try {
        localStorage.setItem(
          "driploop-motion-paused",
          String(userPaused)
        );
      } catch {
        // Apply the setting for this visit.
      }

      applyMotion();
    },
    "secondary motion-toggle"
  );

  header.querySelector(
    ".appearance-panel"
  ).append(motionButton);

  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function blocked() {
    return (
      userPaused ||
      reduced.matches ||
      document.body.classList.contains(
        "contrast"
      )
    );
  }

  function resetDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;

    art.style.setProperty(
      "--depth-x",
      "0px"
    );

    art.style.setProperty(
      "--depth-y",
      "0px"
    );
  }

  function applyMotion() {
    const paused = blocked();

    document.body.classList.toggle(
      "motion-paused",
      paused
    );

    document.body.classList.toggle(
      "tab-away",
      document.hidden
    );

    root.dataset.motion =
      paused ? "paused" : "playing";

    motionButton.setAttribute(
      "aria-pressed",
      String(paused)
    );

    const contrast =
      document.body.classList.contains(
        "contrast"
      );

    motionButton.disabled =
      reduced.matches || contrast;

    if (reduced.matches) {
      motionButton.textContent =
        "Reduced motion enabled";
    } else if (contrast) {
      motionButton.textContent =
        "Motion off in high contrast";
    } else if (userPaused) {
      motionButton.textContent =
        "Play animations";
    } else {
      motionButton.textContent =
        "Pause animations";
    }

    if (paused || document.hidden) {
      resetDepth();

      if (paused) {
        document.getAnimations?.().forEach(
          animation => animation.cancel()
        );
      }
    }
  }

  reduced.addEventListener(
    "change",
    applyMotion
  );

  document.addEventListener(
    "visibilitychange",
    applyMotion
  );

  finePointer.addEventListener(
    "change",
    resetDepth
  );

  let previousContrast =
    document.body.classList.contains(
      "contrast"
    );

  new MutationObserver(() => {
    const contrast =
      document.body.classList.contains(
        "contrast"
      );

    if (contrast !== previousContrast) {
      previousContrast = contrast;
      applyMotion();
    }
  }).observe(
    document.body,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );

  applyMotion();

  // Gentle depth for a mouse or trackpad.
  hero.addEventListener(
    "pointermove",
    event => {
      if (
        blocked() ||
        document.hidden ||
        !finePointer.matches
      ) {
        return;
      }

      const bounds =
        hero.getBoundingClientRect();

      pointerX = (
        (event.clientX - bounds.left) /
        bounds.width - .5
      ) * 12;

      pointerY = (
        (event.clientY - bounds.top) /
        bounds.height - .5
      ) * 8;

      if (pointerFrame) {
        return;
      }

      pointerFrame = requestAnimationFrame(
        () => {
          art.style.setProperty(
            "--depth-x",
            pointerX + "px"
          );

          art.style.setProperty(
            "--depth-y",
            pointerY + "px"
          );

          pointerFrame = 0;
        }
      );
    }
  );

  hero.addEventListener(
    "pointerleave",
    resetDepth
  );

  // Keep content clear of the sticky header.
  function measureHeader() {
    const clearance =
      header.getBoundingClientRect().height + 30;

    root.style.setProperty(
      "--header-clearance",
      clearance + "px"
    );
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(
      measureHeader
    ).observe(header);
  } else {
    window.addEventListener(
      "resize",
      measureHeader
    );
  }

  measureHeader();

  for (
    const view of ["collector", "building"]
  ) {
    byId(view + "-view").addEventListener(
      "click",
      () => {
        if (blocked()) {
          byId(
            view + "-panel"
          ).scrollIntoView({
            behavior: "instant",
            block: "start"
          });
        }
      }
    );
  }

  // Reveal stable sections once.
  // Cards are regularly rebuilt by app.js.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          if (!blocked()) {
            entry.target.classList.add(
              "chapter-reveal"
            );
          }

          observer.unobserve(
            entry.target
          );
        }
      },
      { threshold: 0 }
    );

    document.querySelectorAll(
      ".panel, .impact, .journey, .water-safety"
    ).forEach(item => {
      observer.observe(item);
    });
  }

  // Highlight real changes to counters and status messages.
  const animatedValues = [
    "impact-litres",
    "impact-water",
    "impact-co2",
    "notice"
  ];

  for (const id of animatedValues) {
    const target = byId(id);

    let previousText = target.textContent;

    new MutationObserver(() => {
      if (
        target.textContent === previousText
      ) {
        return;
      }

      previousText = target.textContent;

      if (
        !blocked() &&
        !document.hidden &&
        target.animate
      ) {
        target.animate(
          [
            {
              opacity: .5,
              transform: "translateY(6px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 400,
            easing: "ease-out"
          }
        );
      }
    }).observe(
      target,
      {
        childList: true,
        subtree: true,
        characterData: true
      }
    );
  }

  // Gold feedback on button presses.
  document.addEventListener(
    "click",
    event => {
      const control =
        event.target.closest("button");

      if (
        !control ||
        control.disabled ||
        blocked()
      ) {
        return;
      }

      const bounds =
        control.getBoundingClientRect();

      const ripple = node(
        "span",
        undefined,
        "gold-ripple"
      );

      ripple.setAttribute(
        "aria-hidden",
        "true"
      );

      const x = event.detail
        ? event.clientX - bounds.left
        : bounds.width / 2;

      const y = event.detail
        ? event.clientY - bounds.top
        : bounds.height / 2;

      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      control.append(ripple);

      setTimeout(
        () => ripple.remove(),
        650
      );
    }
  );

  // Reading progress.
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

  let scrollFrame = 0;

  function updateProgress() {
    const total =
      root.scrollHeight - innerHeight;

    const fraction = total > 0
      ? Math.min(
          1,
          Math.max(0, scrollY / total)
        )
      : 0;

    progress.style.transform =
      "scaleX(" + fraction + ")";

    scrollFrame = 0;
  }

  function scheduleProgress() {
    if (!scrollFrame) {
      scrollFrame = requestAnimationFrame(
        updateProgress
      );
    }
  }

  addEventListener(
    "scroll",
    scheduleProgress,
    { passive: true }
  );

  addEventListener(
    "resize",
    scheduleProgress
  );

  updateProgress();
})();
