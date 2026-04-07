const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const heroVideo = document.querySelector(".hero-video");
const heroTitle = document.querySelector(".hero h1");
const heroLines = Array.from(document.querySelectorAll(".hero-line-typed"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroTypingRun = 0;

const playHeroVideo = () => {
  if (!heroVideo) {
    return;
  }

  const playAttempt = heroVideo.play();

  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
};

const restartHeroTyping = () => {
  if (!heroTitle || !heroLines.length) {
    return;
  }

  if (prefersReducedMotion.matches) {
    heroTitle.classList.remove("typing-active");
    heroTitle.classList.add("typing-complete");
    heroLines.forEach((line) => {
      line.textContent = line.dataset.fullText || line.textContent;
      line.classList.remove("is-cursor");
    });
    return;
  }

  heroTypingRun += 1;
  const currentRun = heroTypingRun;

  heroTitle.classList.remove("typing-complete");
  heroTitle.classList.add("typing-active");

  heroLines.forEach((line) => {
    if (!line.dataset.fullText) {
      line.dataset.fullText = line.textContent;
    }

    line.textContent = "";
    line.classList.remove("is-cursor");
  });

  const typeLine = (line, delay, onComplete) => {
    const fullText = line.dataset.fullText || "";
    let charIndex = 0;

    line.classList.add("is-cursor");

    const step = () => {
      if (currentRun !== heroTypingRun) {
        return;
      }

      if (charIndex < fullText.length) {
        charIndex += 1;
        line.textContent = fullText.slice(0, charIndex);
        window.setTimeout(step, delay);
        return;
      }

      line.classList.remove("is-cursor");
      onComplete?.();
    };

    window.setTimeout(step, 180);
  };

  typeLine(heroLines[0], 72, () => {
    if (currentRun !== heroTypingRun || !heroLines[1]) {
      heroTitle.classList.remove("typing-active");
      heroTitle.classList.add("typing-complete");
      return;
    }

    window.setTimeout(() => {
      typeLine(heroLines[1], 58, () => {
        if (currentRun !== heroTypingRun) {
          return;
        }

        window.setTimeout(() => {
          if (currentRun === heroTypingRun) {
            heroTitle.classList.remove("typing-active");
            heroTitle.classList.add("typing-complete");
          }
        }, 120);
      });
    }, 140);
  });
};

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  heroVideo.addEventListener("canplay", playHeroVideo);
  heroVideo.addEventListener("loadeddata", playHeroVideo);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      playHeroVideo();
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      restartHeroTyping();
    }

    playHeroVideo();
  });
}

window.addEventListener("load", () => {
  restartHeroTyping();
  playHeroVideo();
});

if (header && menuToggle && nav) {
  const setMenuState = (isOpen) => {
    header.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  };

  menuToggle.addEventListener("click", () => {
    const nextState = !header.classList.contains("menu-open");
    setMenuState(nextState);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setMenuState(false);
    }
  });
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const cards = Array.from(carousel.querySelectorAll(".project-card"));
  let currentIndex = 0;
  let scrollSyncTimer = 0;
  const getWrappedIndex = (index) => {
    if (!cards.length) {
      return 0;
    }

    return ((index % cards.length) + cards.length) % cards.length;
  };

  const syncButtons = () => {
    if (!prevButton || !nextButton) {
      return;
    }

    prevButton.disabled = false;
    nextButton.disabled = false;
  };

  const scrollToIndex = (index) => {
    if (!viewport || !cards.length) {
      return;
    }

    currentIndex = getWrappedIndex(index);
    cards[currentIndex].scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    syncButtons();
  };

  const syncIndexFromScroll = () => {
    if (!viewport || !cards.length) {
      return;
    }

    const nearestIndex = cards.reduce((closestIndex, card, index) => {
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      const closestCard = cards[closestIndex];
      const closestDistance = Math.abs(
        closestCard.offsetLeft + closestCard.offsetWidth / 2 - viewportCenter,
      );
      const currentDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewportCenter);
      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    currentIndex = nearestIndex;
    syncButtons();
  };

  prevButton?.addEventListener("click", () => {
    scrollToIndex(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    scrollToIndex(currentIndex + 1);
  });

  viewport?.addEventListener("scroll", () => {
    window.clearTimeout(scrollSyncTimer);
    scrollSyncTimer = window.setTimeout(syncIndexFromScroll, 70);
  });

  viewport?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(currentIndex + 1);
    }
  });

  window.addEventListener("resize", () => {
    scrollToIndex(currentIndex);
  });

  syncButtons();
}
