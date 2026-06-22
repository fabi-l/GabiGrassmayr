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
const currentPage = document.body?.dataset.page || "";
const externalFontHref =
  "https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@1,800&display=swap";
let heroTypingRun = 0;
let currentLanguage = "en";

const isHomePage = currentPage === "home";

const resetHomeScrollPosition = () => {
  if (!isHomePage) {
    return;
  }

  if (window.location.hash && window.location.hash !== "#hero") {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  let resetFrames = 0;

  const forceTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (resetFrames < 8) {
      resetFrames += 1;
      window.requestAnimationFrame(forceTop);
    }
  };

  forceTop();
};

if ("scrollRestoration" in window.history && isHomePage) {
  window.history.scrollRestoration = "manual";
}

const translations = {
  en: {
    meta: {
      homeTitle: "Gabriel Grassmayr | Filmmaker – Extreme Sports & Travel Content Austria",
      homeDescription:
        "Gabriel Grassmayr is a freelance filmmaker from Rum near Innsbruck, Austria. Specialized in extreme sports and travel video content. Clients include Red Bull, ARD Mediathek, Funk, and the City of Innsbruck.",
      aboutTitle: "Über Gabriel Grassmayr | Filmmaker aus Innsbruck, Österreich",
      aboutDescription:
        "Learn about Gabriel Grassmayr, a filmmaker from Rum near Innsbruck with 5+ years of experience in extreme sports and travel videos for international clients.",
      imprintTitle: "Legal Notice | Gabriel Grassmayr Filmmaker",
      imprintDescription: "Legal notice for Gabriel Grassmayr, freelance filmmaker from Rum near Innsbruck, Austria.",
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
      imprint: "Legal Notice",
      privacy: "Privacy",
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
    cookie: {
      title: "Privacy & Cookies",
      body:
        "This website is hosted on GitHub Pages. Technical access data (e.g. IP addresses) may be processed by GitHub. Additionally, icons are loaded via the external service cdn.simpleicons.org, which establishes a connection to an external server.",
      decline: "Decline",
      accept: "Accept",
      moreInfo: "More information in our Privacy Policy.",
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
      portraitAlt: "Gabriel Grassmayr – Filmmaker Portrait, Innsbruck Austria",
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
      project1Alt: "Nighttime filmmaker scene in front of glowing volcanic lava – Gabriel Grassmayr Filmmaker",
      project2Alt: "Crew portrait in front of a Red Bull branded bus – Gabriel Grassmayr Filmmaker",
      project3Alt: "Molten metal and flames in a dark industrial setting – Gabriel Grassmayr Filmmaker",
      project4Alt: "Worker standing beside a large cast bell in a workshop – Gabriel Grassmayr Filmmaker",
      project5Alt: "Studio monitor showing a production selfie during filming – Gabriel Grassmayr Filmmaker",
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
    imprint: {
      title: "Legal Notice",
      subtitle: "Information pursuant to § 5 ECG",
      nameLabel: "Name",
      businessLabel: "Business name",
      business: "Filmmaker",
      statusLabel: "Status",
      status: "Independent filmmaker",
      addressLabel: "Address",
      address: "Ulmenstraße 33, 6063 Rum, Austria",
      emailLabel: "Email",
      contactLabel: "Contact",
      contact: "Please send contact inquiries by email",
      responsibilityLabel: "Responsibility",
      responsibility: "Responsible for the content of this website: Gabriel Grassmayr",
      tradeLabel: "Trade",
      trade: "Free trade",
      professionLabel: "Professional title",
      profession: "Filmmaker (free trade, awarded in Austria)",
      membershipLabel: "Membership",
      membership: "Member of the Austrian Federal Economic Chamber (WKO)",
      regulationLabel: "Applicable legal regulation",
      regulation: "Trade Regulation Act 1994 (GewO)",
      regulationAccessLabel: "Access to legal regulation",
      vatLabel: "VAT ID",
      vat: "not available",
      companyRegisterLabel: "Company register number",
      companyRegister: "not available",
      disclosureTitle: "Disclosure pursuant to § 25 Austrian Media Act",
      mediaOwnerLabel: "Media owner",
      basicDirectionLabel: "Basic direction",
      basicDirection: "Portfolio website presenting cinematic work",
      overviewAria: "Legal notice overview",
      overviewRole: "Filmmaker",
      overviewStatus: "Independent filmmaker",
      overviewTrade: "Free trade",
      overviewMembership: "Member of the WKO",
      overviewLocation: "Rum, Austria",
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
        suit: "Gabriel Grassmayr – Filmmaker Portrait, Innsbruck Austria",
        monitorSelfie: "Studio monitor showing Gabriel and a collaborator during production – Gabriel Grassmayr Filmmaker",
        rescue: "Gabriel Grassmayr in a red rescue uniform portrait – Filmmaker Innsbruck Austria",
        onSet: "Gabriel Grassmayr filming with a camera alongside a collaborator – Gabriel Grassmayr Filmmaker",
        field: "Gabriel Grassmayr holding a camera outdoors while wearing headphones – Filmmaker Innsbruck Austria",
        moltenMetal: "Molten metal pouring with flames in an industrial setting – Gabriel Grassmayr Filmmaker",
        volcanoPortrait: "Gabriel Grassmayr standing in front of glowing volcanic lava at night – Filmmaker",
        volcanoParaglider: "Nighttime filming scene with a paraglider in front of glowing volcanic lava – Gabriel Grassmayr Filmmaker",
      },
    },
  },
  de: {
    meta: {
      homeTitle: "Gabriel Grassmayr | Filmmaker – Extreme Sports & Travel Content Austria",
      homeDescription:
        "Gabriel Grassmayr ist freischaffender Filmemacher aus Innsbruck, Österreich. Spezialisiert auf Extremsport- und Reisecontent. Clients: Red Bull, ARD, Funk.",
      aboutTitle: "Über Gabriel Grassmayr | Filmmaker aus Innsbruck, Österreich",
      aboutDescription:
        "Lerne Gabriel Grassmayr kennen – Filmemacher aus Rum bei Innsbruck. 5+ Jahre Erfahrung in Extremsport- und Reisevideos für internationale Auftraggeber.",
      imprintTitle: "Impressum | Gabriel Grassmayr Filmemacher",
      imprintDescription: "Impressum von Gabriel Grassmayr, freischaffender Filmemacher, Rum bei Innsbruck, Österreich.",
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
      imprint: "Impressum",
      privacy: "Datenschutz",
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
    cookie: {
      title: "Datenschutz & Cookies",
      body:
        "Diese Website wird auf GitHub Pages gehostet. Dabei können technische Zugriffsdaten (z. B. IP-Adressen) durch GitHub verarbeitet werden. Zusätzlich werden Icons über den externen Dienst cdn.simpleicons.org geladen, wobei ebenfalls eine Verbindung zu einem externen Server hergestellt wird.",
      decline: "Ablehnen",
      accept: "Akzeptieren",
      moreInfo: "Weitere Informationen in unserer Datenschutzerklärung.",
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
      portraitAlt: "Gabriel Grassmayr – Filmmaker Portrait, Innsbruck Austria",
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
      project1Alt: "Nächtliche Filmszene vor glühender Vulkanlava – Gabriel Grassmayr Filmmaker",
      project2Alt: "Crew-Porträt vor einem Red-Bull-Bus – Gabriel Grassmayr Filmmaker",
      project3Alt: "Flüssiges Metall und Flammen in einer dunklen Werkshalle – Gabriel Grassmayr Filmmaker",
      project4Alt: "Arbeiter neben einer großen gegossenen Glocke in einer Werkstatt – Gabriel Grassmayr Filmmaker",
      project5Alt: "Studiomonitor mit einem Produktions-Selfie während des Drehs – Gabriel Grassmayr Filmmaker",
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
    imprint: {
      title: "Impressum",
      subtitle: "Angaben gemäß § 5 ECG",
      nameLabel: "Name",
      businessLabel: "Unternehmensbezeichnung",
      business: "Filmemacher",
      statusLabel: "Status",
      status: "Selbstständiger Filmemacher",
      addressLabel: "Anschrift",
      address: "Ulmenstraße 33, 6063 Rum, Österreich",
      emailLabel: "E-Mail",
      contactLabel: "Kontakt",
      contact: "Kontaktanfragen bitte per E-Mail",
      responsibilityLabel: "Verantwortlichkeit",
      responsibility: "Für die Inhalte dieser Website verantwortlich: Gabriel Grassmayr",
      tradeLabel: "Gewerbe",
      trade: "Freies Gewerbe",
      professionLabel: "Berufsbezeichnung",
      profession: "Filmemacher (Freies Gewerbe, verliehen in Österreich)",
      membershipLabel: "Mitgliedschaft",
      membership: "Mitglied der Wirtschaftskammer Österreich (WKO)",
      regulationLabel: "Anwendbare Rechtsvorschrift",
      regulation: "Gewerbeordnung 1994 (GewO)",
      regulationAccessLabel: "Zugang zur Rechtsvorschrift",
      vatLabel: "UID-Nummer",
      vat: "nicht vorhanden",
      companyRegisterLabel: "Firmenbuchnummer",
      companyRegister: "nicht vorhanden",
      disclosureTitle: "Offenlegung gemäß § 25 MedienG",
      mediaOwnerLabel: "Medieninhaber",
      basicDirectionLabel: "Grundlegende Richtung",
      basicDirection: "Portfolio-Website zur Präsentation filmischer Arbeiten",
      overviewAria: "Impressum Übersicht",
      overviewRole: "Filmemacher",
      overviewStatus: "Selbstständiger Filmemacher",
      overviewTrade: "Freies Gewerbe",
      overviewMembership: "Mitglied der WKO",
      overviewLocation: "Rum, Österreich",
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
        suit: "Gabriel Grassmayr – Filmmaker Portrait, Innsbruck Austria",
        monitorSelfie: "Studiomonitor mit Gabriel und einem Kollegen während der Produktion – Gabriel Grassmayr Filmmaker",
        rescue: "Gabriel Grassmayr in einem roten Rettungsdienst-Porträt – Filmmaker Innsbruck Austria",
        onSet: "Gabriel Grassmayr beim Filmen mit Kamera zusammen mit einem Kollegen – Gabriel Grassmayr Filmmaker",
        field: "Gabriel Grassmayr draußen mit Kamera und Kopfhörern – Filmmaker Innsbruck Austria",
        moltenMetal: "Flüssiges Metall mit Flammen in einer industriellen Umgebung – Gabriel Grassmayr Filmmaker",
        volcanoPortrait: "Gabriel nachts vor glühender Vulkanlava – Filmmaker",
        volcanoParaglider: "Nächtliche Filmszene mit einem Gleitschirm vor glühender Vulkanlava – Gabriel Grassmayr Filmmaker",
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

const getNestedPagePrefix = () =>
  currentPage === "impressum" || currentPage === "datenschutz" ? "../" : "";

const getPrivacyHref = () => (currentPage === "datenschutz" ? "./" : `${getNestedPagePrefix()}datenschutz/`);

const loadExternalFonts = () => {
  if (document.querySelector(`[href="${externalFontHref}"]`)) {
    return;
  }

  const googlePreconnect = document.createElement("link");
  googlePreconnect.rel = "preconnect";
  googlePreconnect.href = "https://fonts.googleapis.com";
  googlePreconnect.dataset.consentLoaded = "fonts";
  document.head.append(googlePreconnect);

  const gstaticPreconnect = document.createElement("link");
  gstaticPreconnect.rel = "preconnect";
  gstaticPreconnect.href = "https://fonts.gstatic.com";
  gstaticPreconnect.crossOrigin = "";
  gstaticPreconnect.dataset.consentLoaded = "fonts";
  document.head.append(gstaticPreconnect);

  const fontStylesheet = document.createElement("link");
  fontStylesheet.rel = "stylesheet";
  fontStylesheet.href = externalFontHref;
  fontStylesheet.dataset.consentLoaded = "fonts";
  document.head.append(fontStylesheet);
};

const syncExternalResources = (consent) => {
  const canLoadExternalResources = consent === "accepted";

  if (canLoadExternalResources) {
    loadExternalFonts();
  }

  document.querySelectorAll("[data-external-src]").forEach((element) => {
    const container = element.closest("[data-consent-resource]");

    if (!canLoadExternalResources) {
      element.removeAttribute("src");
      container?.setAttribute("hidden", "");
      return;
    }

    element.setAttribute("src", element.dataset.externalSrc);
    container?.removeAttribute("hidden");
  });
};

const updateCookieConsentCopy = () => {
  const dialog = document.querySelector("[data-cookie-dialog]");

  if (!dialog) {
    return;
  }

  dialog.querySelector("[data-cookie-title]").textContent = getTranslation("cookie.title");
  dialog.querySelector("[data-cookie-body]").textContent = getTranslation("cookie.body");
  dialog.querySelector("[data-cookie-decline]").textContent = getTranslation("cookie.decline");
  dialog.querySelector("[data-cookie-accept]").textContent = getTranslation("cookie.accept");
  dialog.querySelector("[data-cookie-privacy-link]").textContent = getTranslation("cookie.moreInfo");
  dialog.querySelector("[data-cookie-privacy-link]").setAttribute("href", getPrivacyHref());
};

const closeCookieConsent = () => {
  document.querySelector("[data-cookie-consent]")?.remove();
};

const showCookieConsent = () => {
  if (document.querySelector("[data-cookie-consent]")) {
    updateCookieConsentCopy();
    return;
  }

  const overlay = document.createElement("div");
  overlay.setAttribute("data-cookie-consent", "");

  const dialog = document.createElement("section");
  dialog.setAttribute("data-cookie-dialog", "");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "cookie-consent-title");

  const title = document.createElement("h2");
  title.id = "cookie-consent-title";
  title.setAttribute("data-cookie-title", "");

  const body = document.createElement("p");
  body.setAttribute("data-cookie-body", "");

  const moreInfo = document.createElement("p");
  const privacyLink = document.createElement("a");
  privacyLink.setAttribute("data-cookie-privacy-link", "");
  moreInfo.append(privacyLink);

  const actions = document.createElement("div");
  actions.setAttribute("data-cookie-actions", "");

  const declineButton = document.createElement("button");
  declineButton.className = "contact-submit";
  declineButton.type = "button";
  declineButton.setAttribute("data-cookie-decline", "");

  const acceptButton = document.createElement("button");
  acceptButton.className = "contact-submit";
  acceptButton.type = "button";
  acceptButton.setAttribute("data-cookie-accept", "");

  actions.append(declineButton, acceptButton);
  dialog.append(title, body, moreInfo, actions);
  overlay.append(dialog);
  document.body.append(overlay);

  updateCookieConsentCopy();

  declineButton.addEventListener("click", () => {
    syncExternalResources("declined");
    closeCookieConsent();
  });

  acceptButton.addEventListener("click", () => {
    syncExternalResources("accepted");
    closeCookieConsent();
  });

  acceptButton.focus({ preventScroll: true });
};

const initializeCookieConsent = () => {
  syncExternalResources("");
  showCookieConsent();

  document.querySelectorAll("[data-cookie-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.reload();
    });
  });
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
  updateCookieConsentCopy();

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
initializeCookieConsent();

window.addEventListener("load", () => {
  resetHomeScrollPosition();
  restartHeroTyping();
  playHeroVideo();
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    resetHomeScrollPosition();
  }
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
