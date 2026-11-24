// Replace the previous motion.js.
// Load after ui.js.

(() => {
  const byId = id =>
    document.getElementById(id);

  const motionKey = "driploop-motion-paused";

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const videoUrl =
    "https://videos.pexels.com/video-files/4631568/4631568-hd_1280_720_24fps.mp4";

  let userPaused = Boolean(
    navigator.connection?.saveData
  );

  let mediaFailed = false;

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

  try {
    const saved = localStorage.getItem(
      motionKey
    );

    if (saved !== null) {
      userPaused = saved === "true";
    }
  } catch {
    // Continue when browser storage is unavailable.
  }

  // ui.js owns the shared colour and mode preferences.
  // Apply the coastal default only without saved preferences.
  let hasAppearance = false;

  try {
    hasAppearance = Boolean(
      localStorage.getItem(
        "driploop-appearance-v1"
      )
    );
  } catch {
    // Use the default appearance.
  }

  if (!hasAppearance) {
    const modes = document.querySelectorAll(
      ".mode-options button"
    );

    modes[1]?.click();

    const ocean = [
      ...document.querySelectorAll(
        ".palette-option"
      )
    ].find(button =>
      button.textContent.trim() === "Ocean"
    );

    ocean?.click();
  }

  // One decorative video serves the entire website.
  const film = node(
    "div",
    undefined,
    "site-film"
  );

  film.setAttribute(
    "aria-hidden",
    "true"
  );

  const video = node("video");

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "none";
  video.disablePictureInPicture = true;
  video.tabIndex = -1;

  video.setAttribute(
    "aria-hidden",
    "true"
  );

  film.append(video);
  document.body.prepend(film);

  // Update the introduction.
  const hero = document.querySelector(
    ".hero"
  );

  const header = document.querySelector(
    ".site-header"
  );

  const steps = hero.querySelector(
    ".how-it-works"
  );

  if (steps) {
    hero.after(steps);
  }

  hero.querySelector("h1").replaceChildren(
    node("span", "Every drop."),
    node(
      "span",
      "A second life.",
      "accent-text"
    )
  );

  hero.querySelector(
    ".eyebrow"
  ).textContent =
    "Collected by buildings. Put to work by you.";

  hero.querySelector(
    "p:not(.eyebrow)"
  ).textContent =
    "Find free AC water nearby. Choose your litres. Give them a useful new job.";

  hero.append(
    node(
      "p",
      "Non-potable. Never for drinking, cooking or animal drinking water.",
      "hero-safety"
    )
  );

  const orbit = node(
    "span",
    undefined,
    "film-orbit"
  );

  orbit.setAttribute(
    "aria-hidden",
    "true"
  );

  hero.append(orbit);

  // Navigation uses the existing application handlers.
  const navigation = node(
    "nav",
    undefined,
    "hero-nav"
  );

  navigation.setAttribute(
    "aria-label",
    "Main navigation"
  );

  const findWater = node(
    "a",
    "Find water"
  );

  findWater.href = "#collector-panel";

  findWater.addEventListener(
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

  navigation.append(
    findWater,
    pickups
  );

  header.querySelector(
    ".appearance"
  ).before(navigation);

  header.querySelector(
    ".appearance > summary"
  ).textContent = "Style & motion";

  // Motion controls live in the persistent appearance menu.
  const motionButton = node(
    "button",
    "Pause animations",
    "secondary motion-toggle"
  );

  motionButton.type = "button";

  const mediaMessage = node(
    "p",
    "",
    "motion-message"
  );

  mediaMessage.setAttribute(
    "role",
    "status"
  );

  header.querySelector(
    ".appearance-panel"
  ).append(
    motionButton,
    mediaMessage
  );

  function motionBlocked() {
    return (
      userPaused ||
      reduced.matches ||
      document.body.classList.contains(
        "contrast"
      )
    );
  }

  function applyMotion() {
    const blocked = motionBlocked();

    document.documentElement.dataset.motion =
      blocked ? "paused" : "playing";

    document.body.classList.toggle(
      "motion-paused",
      blocked
    );

    const highContrast =
      document.body.classList.contains(
        "contrast"
      );

    motionButton.disabled =
      reduced.matches || highContrast;

    motionButton.setAttribute(
      "aria-pressed",
      String(blocked)
    );

    if (reduced.matches) {
      motionButton.textContent =
        "Reduced motion enabled";
    } else if (highContrast) {
      motionButton.textContent =
        "Motion off in high contrast";
    } else if (userPaused) {
      motionButton.textContent =
        "Play animations";
    } else {
      motionButton.textContent =
        "Pause animations";
    }

    if (blocked) {
      document.getAnimations?.().forEach(
        animation => animation.cancel()
      );
    }

    if (
      blocked ||
      document.hidden ||
      mediaFailed
    ) {
      video.pause();
      return;
    }

    // Delay the download until motion is allowed.
    if (!video.getAttribute("src")) {
      video.src = videoUrl;
    }

    video.play()?.then(() => {
      if (
        motionBlocked() ||
        document.hidden
      ) {
        video.pause();
      }
    }).catch(() => {
      if (
        motionBlocked() ||
        document.hidden ||
        mediaFailed
      ) {
        return;
      }

      userPaused = true;

      mediaMessage.textContent =
        "Your browser paused the video. Tap Play animations to try again.";

      applyMotion();
    });
  }

  video.addEventListener(
    "playing",
    () => {
      if (
        motionBlocked() ||
        document.hidden
      ) {
        video.pause();
      } else {
        film.classList.add(
          "video-ready"
        );

        mediaMessage.textContent = "";
      }
    }
  );

  video.addEventListener(
    "error",
    () => {
      mediaFailed = true;

      film.classList.remove(
        "video-ready"
      );

      video.pause();

      mediaMessage.textContent =
        "The background video is unavailable. The still image is shown.";
    }
  );

  motionButton.addEventListener(
    "click",
    () => {
      userPaused = !userPaused;

      try {
        localStorage.setItem(
          motionKey,
          String(userPaused)
        );
      } catch {
        // The preference still applies for this visit.
      }

      applyMotion();
    }
  );

  reduced.addEventListener(
    "change",
    applyMotion
  );

  document.addEventListener(
    "visibilitychange",
    applyMotion
  );

  // React to the existing high-contrast control.
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

  // Keep section headings below the sticky header.
  function measureHeader() {
    const clearance =
      header.getBoundingClientRect().height + 30;

    document.documentElement.style.setProperty(
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

  // Respect the motion preference for role-switch scrolling.
  for (
    const view of ["collector", "building"]
  ) {
    byId(view + "-view").addEventListener(
      "click",
      () => {
        if (motionBlocked()) {
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

  // Animate each section once as it enters the screen.
  // Content stays visible while waiting for the observer.
  if ("IntersectionObserver" in window) {
    const seen = new WeakSet();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          if (!motionBlocked()) {
            entry.target.classList.add(
              "film-reveal"
            );
          }

          observer.unobserve(
            entry.target
          );
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 20px 0px"
      }
    );

    function observeSections() {
      const sections =
        document.querySelectorAll(
          ".panel, .card, .impact, .how-it-works, .water-safety"
        );

      for (const item of sections) {
        if (seen.has(item)) {
          continue;
        }

        seen.add(item);
        observer.observe(item);
      }
    }

    observeSections();

    new MutationObserver(
      observeSections
    ).observe(
      byId("listings"),
      { childList: true }
    );
  }

  // Give mouse, touch and keyboard button clicks feedback.
  document.addEventListener(
    "click",
    event => {
      const button = event.target.closest(
        "button"
      );

      if (
        !button ||
        button.disabled ||
        motionBlocked()
      ) {
        return;
      }

      const bounds =
        button.getBoundingClientRect();

      const ripple = node(
        "span",
        undefined,
        "click-ripple"
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

      button.append(ripple);

      setTimeout(
        () => ripple.remove(),
        600
      );
    }
  );

  // Highlight actual value changes.
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
        previousText === target.textContent
      ) {
        return;
      }

      previousText = target.textContent;

      if (
        !motionBlocked() &&
        target.animate
      ) {
        target.animate(
          [
            {
              opacity: .55,
              transform: "translateY(5px)"
            },
            {
              opacity: 1,
              transform: "translateY(0)"
            }
          ],
          {
            duration: 350,
            easing: "ease-out"
          }
        );
      }
    }).observe(
      target,
      {
        childList: true,
        characterData: true,
        subtree: true
      }
    );
  }

  // Scroll progress.
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
    const total =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const fraction = total > 0
      ? Math.max(
          0,
          Math.min(1, window.scrollY / total)
        )
      : 0;

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

  // Credit the background footage.
  const credit = node(
    "p",
    undefined,
    "media-credit"
  );

  const creditLink = node(
    "a",
    "Ocean footage by ArtHouse Studio / Pexels"
  );

  creditLink.href =
    "https://www.pexels.com/video/aerial-view-of-ocean-waves-4631568/";

  credit.append(creditLink);

  document.querySelector(
    "body > footer"
  ).append(credit);
})();
