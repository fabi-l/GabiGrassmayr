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
  const track = carousel.querySelector(".projects-track");
  const originalCards = track ? Array.from(track.querySelectorAll(".project-card")) : [];
  let cards = originalCards;
  let currentIndex = 0;
  const setSize = originalCards.length;
  const hasLoopClones = Boolean(track && originalCards.length > 1);
  let touchStartX = 0;
  let touchStartY = 0;

  if (track && hasLoopClones) {
    const prependClones = originalCards.map((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = "true";
      return clone;
    });
    const appendClones = originalCards.map((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = "true";
      return clone;
    });

    prependClones.slice().reverse().forEach((clone) => {
      track.prepend(clone);
    });
    appendClones.forEach((clone) => {
      track.append(clone);
    });
    cards = Array.from(track.querySelectorAll(".project-card"));
    currentIndex = setSize;
  }

  const syncButtons = () => {
    if (!prevButton || !nextButton) {
      return;
    }

    prevButton.disabled = false;
    nextButton.disabled = false;
  };

  const getTrackOffset = (index) => {
    if (!viewport || !cards.length || !cards[index]) {
      return 0;
    }

    const card = cards[index];
    return card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
  };

  const clampIndex = (index) => {
    if (!cards.length) {
      return 0;
    }

    return Math.min(Math.max(index, 0), cards.length - 1);
  };

  const renderCarousel = ({ animate } = { animate: true }) => {
    if (!track || !viewport || !cards.length) {
      return;
    }

    track.classList.toggle("is-jumping", !animate || prefersReducedMotion.matches);
    track.style.transform = `translate3d(${-getTrackOffset(currentIndex)}px, 0, 0)`;

    if (!animate || prefersReducedMotion.matches) {
      window.requestAnimationFrame(() => {
        track.classList.remove("is-jumping");
      });
    }

    syncButtons();
  };

  const jumpToIndex = (index) => {
    if (!cards.length) {
      return;
    }

    currentIndex = clampIndex(index);
    renderCarousel({ animate: false });
  };

  const goToIndex = (index) => {
    if (!cards.length) {
      return;
    }

    currentIndex = clampIndex(index);
    renderCarousel({ animate: true });
  };

  const prepareLoopMove = (direction) => {
    if (!hasLoopClones) {
      return false;
    }

    if (direction < 0 && currentIndex <= setSize) {
      jumpToIndex(currentIndex + setSize);
      return true;
    }

    if (direction > 0 && currentIndex >= setSize * 2 - 1) {
      jumpToIndex(currentIndex - setSize);
      return true;
    }

    return false;
  };

  const moveCarousel = (direction) => {
    if (!cards.length) {
      return;
    }

    const didPrepareLoop = prepareLoopMove(direction);

    if (!didPrepareLoop) {
      goToIndex(currentIndex + direction);
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        goToIndex(currentIndex + direction);
      });
    });
  };

  prevButton?.addEventListener("click", () => {
    moveCarousel(-1);
  });

  nextButton?.addEventListener("click", () => {
    moveCarousel(1);
  });

  viewport?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveCarousel(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveCarousel(1);
    }
  });

  viewport?.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  viewport?.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      moveCarousel(-1);
      return;
    }

    moveCarousel(1);
  });

  window.addEventListener("resize", () => {
    jumpToIndex(currentIndex);
  });

  if (hasLoopClones) {
    window.requestAnimationFrame(() => {
      jumpToIndex(setSize);
    });
  } else {
    renderCarousel({ animate: false });
  }

  syncButtons();
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `Portfolio Inquiry from ${name || "Website Visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:Gabrielgrassmayr@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
