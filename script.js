const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const heroVideo = document.querySelector(".hero-video");
const heroTitle = document.querySelector(".hero h1");
const heroLines = Array.from(document.querySelectorAll(".hero-line-typed"));
const scrollTopButton = document.querySelector("[data-scroll-top]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const languageButtons = Array.from(document.querySelectorAll("[data-language-option]"));
let heroTypingRun = 0;
let currentLanguage = "en";

const translations = {
  en: {
    meta: {
      homeTitle: "Gabriel Grassmayr | Portfolio",
      homeDescription: "Cinematic filmmaker portfolio focused on extreme sports and travel content.",
      aboutTitle: "Gabriel Grassmayr | About Me",
      aboutDescription:
        "Adventure filmmaker and photographer Gabriel Grassmayr. Discover a concise profile, cinematic introduction, and behind-the-lens gallery.",
    },
    nav: {
      primaryAria: "Primary navigation",
      mainGroup: "Main",
      mainWorkedWith: "Worked With",
      mainProjects: "Projects",
      mainContact: "Contact",
      aboutGroup: "About Me",
      aboutProfile: "Profile",
      aboutPictures: "Behind the Lens",
      aboutContact: "Contact",
      brandHome: "Gabriel Grassmayr home",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      languageLabel: "Language switcher",
      languageGerman: "Switch to German",
      languageEnglish: "Switch to English",
    },
    ui: {
      scrollTop: "Scroll to top",
    },
    hero: {
      sectionAria: "Hero",
      titleAria: "Capturing The Impossible",
      titleTop: "Capturing",
      titleBottom: "The Impossible",
      subAria: "Specialized in extreme sports and travel content",
      subTop: "SPECIALIZED IN EXTREME SPORTS",
      subBottom: "AND TRAVEL CONTENT",
    },
    social: {
      linksAria: "Social links",
      email: "Email",
    },
    aboutTeaser: {
      name: "Gabriel Grassmayr",
      factsAria: "Short profile facts",
      fact1: "Based in Austria",
      fact2: "21 years old",
      fact3: "5+ years of experience",
      button: "More About Me",
      portraitAlt: "Gabriel Grassmayr smiling in a blue suit portrait.",
    },
    worked: {
      title: "Worked With",
      gridAria: "Worked with brands",
      visit: {
        redbull: "Visit Red Bull homepage",
        ama: "Visit AMA Guetesiegel homepage",
        funk: "Visit Funk Austria homepage",
        ard: "Visit Das Erste homepage",
        innsbruck: "Visit Innsbruck homepage",
        landjugend: "Visit Landjugend Tirol homepage",
        yepp: "Visit YEPP homepage",
        ripple: "Visit Ripple homepage",
      },
    },
    featured: {
      title: "Featured Projects",
      prevAria: "Show previous featured project",
      nextAria: "Show next featured project",
      carouselAria: "Featured projects carousel",
      project1Aria: "Open featured project: Die Vulkanfrau",
      project2Aria: "Open featured project: Instagram reel with Red Bull event crew",
      project3Aria: "Open featured project: Instagram reel with fire and molten metal",
      project4Aria: "Open featured project: YouTube film about bell making",
      project5Aria: "Open featured project: Studio production YouTube Short",
      project1Alt: "Nighttime filmmaker scene in front of glowing volcanic lava",
      project2Alt: "Crew portrait in front of a Red Bull branded bus",
      project3Alt: "Molten metal and flames in a dark industrial setting",
      project4Alt: "Worker standing beside a large cast bell in a workshop",
      project5Alt: "Studio monitor showing a production selfie during filming",
      viewProject: "View Project",
      moreProjects: "discover more Projects on LinkedIn",
    },
    contact: {
      title: "LET'S CAPTURE YOUR NEXT ADVENTURE TOGETHER!",
      subtitle: "TELL ME YOUR STORY:",
      nameLabel: "Name *",
      subjectLabel: "Subject *",
      messageLabel: "Message *",
      namePlaceholder: "Your Name...",
      subjectPlaceholder: "Your Subject...",
      messagePlaceholder: "Your Message...",
      notice: "Attention: This will open your mail app to send the message!",
      submit: "Submit",
      formBodyName: "Name",
      formBodyMessage: "Message:",
    },
    about: {
      title: "About Me",
      subtitle: "Adventure Filmmaker. Storyteller. Creator.",
      introText:
        "Gabriel captures stories where real adventure happens - from fast-paced productions to cinematic moments in extraordinary environments. His work combines emotion, movement and atmosphere for brands, documentaries and digital storytelling.",
      profileAria: "Profile highlights",
      profile: {
        based: "Based in Austria",
        age: "21 Years Old",
        experience: "5+ Years of Experience",
        role: "Adventure Filmmaker & Photographer",
        focus: "Extreme Sports, Travel & Storytelling",
        clients: "Worked with Red Bull, FUNK & Ripple",
        coFounder: "Co-Founder of MC Media",
      },
      galleryLabel: "Behind the Lens",
      alt: {
        suit: "Gabriel Grassmayr smiling in a blue suit portrait.",
        monitorSelfie: "Studio monitor showing Gabriel and a collaborator during production.",
        rescue: "Gabriel Grassmayr in a red rescue uniform portrait.",
        onSet: "Gabriel Grassmayr filming with a camera alongside a collaborator.",
        field: "Gabriel Grassmayr holding a camera outdoors while wearing headphones.",
        moltenMetal: "Molten metal pouring with flames in an industrial setting.",
        volcanoPortrait: "Gabriel standing in front of glowing volcanic lava at night.",
        volcanoParaglider: "Nighttime filming scene with a paraglider in front of glowing volcanic lava.",
      },
    },
  },
  de: {
    meta: {
      homeTitle: "Gabriel Grassmayr | Portfolio",
      homeDescription:
        "Cineastisches Filmemacher-Portfolio mit Fokus auf Extremsport- und Reise-Content.",
      aboutTitle: "Gabriel Grassmayr | Über mich",
      aboutDescription:
        "Abenteuerfilmer und Fotograf Gabriel Grassmayr. Entdecke ein kompaktes Profil, eine cineastische Einführung und eine Galerie hinter der Kamera.",
    },
    nav: {
      primaryAria: "Hauptnavigation",
      mainGroup: "Main",
      mainWorkedWith: "Partner",
      mainProjects: "Projekte",
      mainContact: "Kontakt",
      aboutGroup: "Über mich",
      aboutProfile: "Profil",
      aboutPictures: "Behind the Lens",
      aboutContact: "Kontakt",
      brandHome: "Zur Startseite von Gabriel Grassmayr",
      openMenu: "Navigation öffnen",
      closeMenu: "Navigation schließen",
      languageLabel: "Sprachauswahl",
      languageGerman: "Auf Deutsch wechseln",
      languageEnglish: "Auf Englisch wechseln",
    },
    ui: {
      scrollTop: "Nach oben scrollen",
    },
    hero: {
      sectionAria: "Hero-Bereich",
      titleAria: "Das Unmögliche einfangen",
      titleTop: "DAS UNMÖGLICHE",
      titleBottom: "EINFANGEN",
      subAria: "Spezialisiert auf Extremsport und Reise-Content",
      subTop: "SPEZIALISIERT AUF EXTREMSPORT",
      subBottom: "UND REISE-CONTENT",
    },
    social: {
      linksAria: "Social-Media-Links",
      email: "E-Mail",
    },
    aboutTeaser: {
      name: "Gabriel Grassmayr",
      factsAria: "Kurze Profilinfos",
      fact1: "Mit Sitz in Österreich",
      fact2: "21 Jahre alt",
      fact3: "5+ Jahre Erfahrung",
      button: "Mehr über mich",
      portraitAlt: "Gabriel Grassmayr lächelnd in einem blauen Anzug.",
    },
    worked: {
      title: "Partner",
      gridAria: "Marken und Partner",
      visit: {
        redbull: "Zur Webseite von Red Bull",
        ama: "Zur Webseite des AMA Gütesiegels",
        funk: "Zur Webseite von Funk Austria",
        ard: "Zur Webseite von Das Erste",
        innsbruck: "Zur Webseite von Innsbruck",
        landjugend: "Zur Webseite der Landjugend Tirol",
        yepp: "Zur Webseite von YEPP",
        ripple: "Zur Webseite von Ripple",
      },
    },
    featured: {
      title: "Ausgewählte Projekte",
      prevAria: "Vorheriges Projekt anzeigen",
      nextAria: "Nächstes Projekt anzeigen",
      carouselAria: "Karussell mit ausgewählten Projekten",
      project1Aria: "Projekt öffnen: Die Vulkanfrau",
      project2Aria: "Projekt öffnen: Instagram Reel mit Red-Bull-Event-Crew",
      project3Aria: "Projekt öffnen: Instagram Reel mit Feuer und flüssigem Metall",
      project4Aria: "Projekt öffnen: YouTube-Film über Glockenguss",
      project5Aria: "Projekt öffnen: Studio-Produktions-YouTube-Short",
      project1Alt: "Nächtliche Filmszene vor glühender Vulkanlava",
      project2Alt: "Crew-Porträt vor einem Red-Bull-Bus",
      project3Alt: "Flüssiges Metall und Flammen in einer dunklen Werkshalle",
      project4Alt: "Arbeiter neben einer großen gegossenen Glocke in einer Werkstatt",
      project5Alt: "Studiomonitor mit einem Produktions-Selfie während des Drehs",
      viewProject: "Projekt ansehen",
      moreProjects: "Weitere Projekte auf LinkedIn entdecken",
    },
    contact: {
      title: "LASS UNS DEIN NÄCHSTES ABENTEUER GEMEINSAM FESTHALTEN!",
      subtitle: "ERZÄHL MIR DEINE STORY:",
      nameLabel: "Name *",
      subjectLabel: "Betreff *",
      messageLabel: "Nachricht *",
      namePlaceholder: "Dein Name...",
      subjectPlaceholder: "Dein Betreff...",
      messagePlaceholder: "Deine Nachricht...",
      notice: "Achtung: Dadurch öffnet sich deine Mail-App zum Senden der Nachricht!",
      submit: "Absenden",
      formBodyName: "Name",
      formBodyMessage: "Nachricht:",
    },
    about: {
      title: "Über mich",
      subtitle: "Abenteuerfilmer. Storyteller. Creator.",
      introText:
        "Gabriel erzählt Geschichten dort, wo echtes Abenteuer entsteht - von dynamischen Produktionen bis zu cineastischen Momenten in außergewöhnlichen Umgebungen. Seine Arbeit verbindet Emotion, Bewegung und Atmosphäre für Marken, Dokumentationen und digitales Storytelling.",
      profileAria: "Profil-Highlights",
      profile: {
        based: "Mit Sitz in Österreich",
        age: "21 Jahre alt",
        experience: "5+ Jahre Erfahrung",
        role: "Abenteuerfilmer & Fotograf",
        focus: "Extremsport, Reise & Storytelling",
        clients: "Projekte mit Red Bull, FUNK & Ripple",
        coFounder: "Mitgründer von MC Media",
      },
      galleryLabel: "Hinter der Kamera",
      alt: {
        suit: "Gabriel Grassmayr lächelnd in einem blauen Anzug.",
        monitorSelfie: "Studiomonitor mit Gabriel und einem Kollegen während der Produktion.",
        rescue: "Gabriel Grassmayr in einem roten Rettungsdienst-Porträt.",
        onSet: "Gabriel Grassmayr beim Filmen mit Kamera zusammen mit einem Kollegen.",
        field: "Gabriel Grassmayr draußen mit Kamera und Kopfhörern.",
        moltenMetal: "Flüssiges Metall mit Flammen in einer industriellen Umgebung.",
        volcanoPortrait: "Gabriel nachts vor glühender Vulkanlava.",
        volcanoParaglider: "Nächtliche Filmszene mit einem Gleitschirm vor glühender Vulkanlava.",
      },
    },
  },
};

const heroLineConfig = {
  en: {
    topWidth: "max-content",
    topOffset: "0ch",
  },
  de: {
    topWidth: "max-content",
    topOffset: "0ch",
  },
};

const getStoredLanguage = () => {
  const storedLanguage = window.localStorage.getItem("site-language");
  return storedLanguage === "de" || storedLanguage === "en" ? storedLanguage : "en";
};

const getTranslation = (key, language = currentLanguage) => {
  const resolve = (source) =>
    key.split(".").reduce((value, segment) => {
      if (value && typeof value === "object" && segment in value) {
        return value[segment];
      }

      return undefined;
    }, source);

  return resolve(translations[language]) ?? resolve(translations.en) ?? "";
};

const updateHeroLineLayout = () => {
  if (!heroTitle) {
    return;
  }

  const config = heroLineConfig[currentLanguage] || heroLineConfig.en;
  heroTitle.style.setProperty("--hero-line-top-width", config.topWidth);
  heroTitle.style.setProperty("--hero-line-top-offset", config.topOffset);
};

const updateLanguageButtons = () => {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.languageOption === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

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

let setMenuState = () => {};

const updateMenuToggleLabel = () => {
  if (!menuToggle || !header) {
    return;
  }

  const isOpen = header.classList.contains("menu-open");
  menuToggle.setAttribute(
    "aria-label",
    getTranslation(isOpen ? "nav.closeMenu" : "nav.openMenu"),
  );
};

const applyTranslations = (language) => {
  currentLanguage = language === "de" ? "de" : "en";
  window.localStorage.setItem("site-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.documentElement.dataset.language = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getTranslation(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", getTranslation(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", getTranslation(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", getTranslation(element.dataset.i18nAlt));
  });

  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.setAttribute("content", getTranslation(element.dataset.i18nContent));
  });

  updateHeroLineLayout();

  heroLines.forEach((line) => {
    line.dataset.fullText = line.textContent;
  });

  updateLanguageButtons();
  updateMenuToggleLabel();

  if (heroTitle && document.readyState !== "loading") {
    restartHeroTyping();
  }
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

if (header && menuToggle && nav) {
  setMenuState = (isOpen) => {
    header.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    updateMenuToggleLabel();
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

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("menu-open")) {
      return;
    }

    if (nav.contains(event.target) || menuToggle.contains(event.target)) {
      return;
    }

    setMenuState(false);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const requestedLanguage = button.dataset.languageOption;

    if (!requestedLanguage || requestedLanguage === currentLanguage) {
      return;
    }

    applyTranslations(requestedLanguage);
    setMenuState(false);
  });
});

currentLanguage = getStoredLanguage();
applyTranslations(currentLanguage);

window.addEventListener("load", () => {
  restartHeroTyping();
  playHeroVideo();
});

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
  let wheelDeltaX = 0;
  let wheelDeltaY = 0;
  let wheelResetTimer = 0;
  let wheelGestureLocked = false;

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

  viewport?.addEventListener(
    "wheel",
    (event) => {
      wheelDeltaX += event.deltaX;
      wheelDeltaY += event.deltaY;

      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelDeltaX = 0;
        wheelDeltaY = 0;
        wheelGestureLocked = false;
      }, 160);

      if (Math.abs(wheelDeltaX) < 40 || Math.abs(wheelDeltaX) <= Math.abs(wheelDeltaY)) {
        return;
      }

      event.preventDefault();

      if (wheelGestureLocked) {
        return;
      }

      wheelGestureLocked = true;

      if (wheelDeltaX > 0) {
        moveCarousel(1);
      } else {
        moveCarousel(-1);
      }

      wheelDeltaX = 0;
      wheelDeltaY = 0;
    },
    { passive: false },
  );

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
const toggleScrollTopButton = () => {
  if (!scrollTopButton) {
    return;
  }

  scrollTopButton.classList.toggle("is-visible", window.scrollY > 180);
};

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [
      `${getTranslation("contact.formBodyName")}: ${name}`,
      "",
      getTranslation("contact.formBodyMessage"),
      message,
    ].join("\n");

    window.location.href = `mailto:Gabrielgrassmayr@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
  toggleScrollTopButton();
}
