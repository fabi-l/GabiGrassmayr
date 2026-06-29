/* ============================================================
   GLOBAL DOM REFERENCES
   Caches elements used by multiple behaviors so later functions can
   update navigation, hero animation, consent, carousel, and forms.
   ============================================================ */
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
const cookieConsentSessionKey = "cookieConsent";
const externalFontHref =
  "https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@1,800&display=swap";
/* Tracks asynchronous hero typing runs so older timeouts cannot overwrite
   a newer language change or page lifecycle restart. */
let heroTypingRun = 0;
/* Stores the active language code used by the translation helpers. */
let currentLanguage = "en";

const isHomePage = currentPage === "home";

/* ============================================================
   HOME SCROLL RESET
   Forces the homepage to start at the hero section on fresh loads.
   Parameters: none.
   Returns: nothing.
   Called during page load/pageshow only on the homepage.
   ============================================================ */
const resetHomeScrollPosition = () => {
  /* Non-home pages must preserve their normal scroll behavior because they
     contain legal/profile content that visitors may revisit directly. */
  if (!isHomePage) {
    return;
  }

  /* Any non-hero hash is removed so the homepage does not initially jump
     past the cinematic opening after browser restore/navigation. */
  if (window.location.hash && window.location.hash !== "#hero") {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  let resetFrames = 0;

  /* Repeating the top scroll for a few animation frames beats browser
     scroll restoration and late media/layout changes. */
  const forceTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    /* Eight frames is long enough to cover initial rendering without making
       the page feel locked after load. */
    if (resetFrames < 8) {
      resetFrames += 1;
      window.requestAnimationFrame(forceTop);
    }
  };

  forceTop();
};

/* Browser scroll restoration is disabled on the homepage so the hero remains
   the first impression instead of restoring to a previous scroll position. */
if ("scrollRestoration" in window.history && isHomePage) {
  window.history.scrollRestoration = "manual";
}

/* ============================================================
   TRANSLATION DICTIONARY
   Holds every text, aria label, placeholder, alt value, and meta value
   used by the manual language switcher.
   ============================================================ */
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
      privacyTitle: "Privacy Policy | Gabriel Grassmayr Filmmaker",
      privacyDescription: "Privacy policy for Gabriel Grassmayr, freelance filmmaker from Rum near Innsbruck, Austria.",
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
    privacy: {
      title: "Privacy Policy",
      subtitle: "Last updated: June 2025",
      controllerTitle: "1. Controller",
      address: "Ulmenstrasse 33, 6063 Rum, Austria",
      emailLabel: "Email:",
      hostingTitle: "2. Hosting - GitHub Pages",
      hostingBody:
        "This website is hosted via GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA). When the website is accessed, GitHub automatically processes technical access data, especially visitors' IP addresses. Further information:",
      externalTitle: "3. External Resources - cdn.simpleicons.org",
      externalBody:
        "This website loads icons via the external service cdn.simpleicons.org. When the page is opened, a connection to the Simple Icons server is established, which may transmit technical data, especially the visitor's IP address. This only happens with your consent (cookie consent). If you decline, the icons are not loaded through this external service.",
      contactTitle: "4. Contact Form",
      contactBody:
        "The contact form on this website only opens the user's local email application (mailto link). No data is stored or processed on the server.",
      rightsTitle: "5. Your Rights (GDPR)",
      rightsIntro: "You have the right to:",
      rightAccess: "Access your stored data (Art. 15 GDPR)",
      rightCorrection: "Correction of inaccurate data (Art. 16 GDPR)",
      rightDeletion: "Deletion of your data (Art. 17 GDPR)",
      rightRestriction: "Restriction of processing (Art. 18 GDPR)",
      rightObjection: "Object to processing (Art. 21 GDPR)",
      complaint: "Complaint to the Austrian Data Protection Authority:",
      cookieTitle: "6. Show Cookie Settings Again",
      cookieBody:
        "The cookie decision is not stored permanently on your device. It applies only to the current browser tab, so no new pop-up appears when switching between subpages.",
      cookieButton: "Show cookie settings again",
      overviewAria: "Privacy overview",
      overviewTitle: "Privacy",
      overviewHosting: "GitHub Pages",
      overviewConsent: "Cookie consent",
      overviewGdpr: "GDPR",
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
      privacyTitle: "Datenschutz | Gabriel Grassmayr Filmemacher",
      privacyDescription: "Datenschutzerklärung von Gabriel Grassmayr, freischaffender Filmemacher aus Rum bei Innsbruck, Österreich.",
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
    privacy: {
      title: "Datenschutzerklärung",
      subtitle: "Stand: Juni 2025",
      controllerTitle: "1. Verantwortlicher",
      address: "Ulmenstraße 33, 6063 Rum, Österreich",
      emailLabel: "E-Mail:",
      hostingTitle: "2. Hosting - GitHub Pages",
      hostingBody:
        "Diese Website wird über GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA) gehostet. Beim Aufruf der Website verarbeitet GitHub automatisch technische Zugriffsdaten, insbesondere IP-Adressen der Besucher. Weitere Informationen:",
      externalTitle: "3. Externe Ressourcen - cdn.simpleicons.org",
      externalBody:
        "Auf dieser Website werden Icons über den externen Dienst cdn.simpleicons.org geladen. Dabei wird beim Seitenaufruf eine Verbindung zum Server von Simple Icons hergestellt, wodurch technische Daten, insbesondere die IP-Adresse des Besuchers, übertragen werden können. Die Nutzung erfolgt nur bei Ihrer Einwilligung (Cookie-Consent). Bei Ablehnen werden die Icons nicht über diesen externen Dienst geladen.",
      contactTitle: "4. Kontaktformular",
      contactBody:
        "Das Kontaktformular auf dieser Website öffnet lediglich das lokale E-Mail-Programm des Nutzers (mailto-Link). Es werden keine Daten auf dem Server gespeichert oder verarbeitet.",
      rightsTitle: "5. Ihre Rechte (DSGVO)",
      rightsIntro: "Sie haben das Recht auf:",
      rightAccess: "Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)",
      rightCorrection: "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
      rightDeletion: "Löschung Ihrer Daten (Art. 17 DSGVO)",
      rightRestriction: "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
      rightObjection: "Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
      complaint: "Beschwerde bei der österreichischen Datenschutzbehörde:",
      cookieTitle: "6. Cookie-Einstellungen erneut anzeigen",
      cookieBody:
        "Die Cookie-Entscheidung wird nicht dauerhaft auf Ihrem Gerät gespeichert. Sie gilt nur für den aktuellen Browser-Tab, damit beim Wechsel zwischen Unterseiten kein erneutes Pop-up erscheint.",
      cookieButton: "Cookie-Einstellungen erneut anzeigen",
      overviewAria: "Datenschutz Übersicht",
      overviewTitle: "Datenschutz",
      overviewHosting: "GitHub Pages",
      overviewConsent: "Cookie-Consent",
      overviewGdpr: "DSGVO",
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

/* ============================================================
   HERO LINE LAYOUT CONFIGURATION
   Provides per-language width/offset values for the typed hero headline.
   Parameters: none directly; read through currentLanguage.
   Returns: config objects consumed by updateHeroLineLayout().
   ============================================================ */
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

/* ============================================================
   URL LANGUAGE READER
   Reads an explicit ?lang=de or ?lang=en value from the current URL.
   Parameters: none.
   Returns: "de", "en", or an empty string when no supported value exists.
   Called before localStorage so shared legal-page URLs can open directly
   in the intended language.
   ============================================================ */
const getUrlLanguage = () => {
  const language = new URLSearchParams(window.location.search).get("lang");
  return language === "de" || language === "en" ? language : "";
};

/* ============================================================
   STORED LANGUAGE READER
   Reads the visitor's preferred language from the URL or localStorage.
   Parameters: none.
   Returns: "de" or "en"; falls back to English for invalid/missing values.
   Called during initial script setup.
   ============================================================ */
const getStoredLanguage = () => {
  const urlLanguage = getUrlLanguage();

  /* An explicit URL language wins so direct links such as
     /datenschutz/?lang=en render the legal page in English immediately. */
  if (urlLanguage) {
    return urlLanguage;
  }

  /* localStorage stores only language preference, not cookie consent; this
     keeps UI language persistent while consent remains limited to sessionStorage. */
  const storedLanguage = window.localStorage.getItem("site-language");
  return storedLanguage === "de" || storedLanguage === "en" ? storedLanguage : "en";
};

/* ============================================================
   TRANSLATION LOOKUP
   Resolves dot-separated translation keys such as "nav.mainContact".
   Parameters:
   - key: string path into the translation object.
   - language: optional language code, defaults to currentLanguage.
   Returns: translated string, English fallback, or an empty string.
   Called by applyTranslations() and UI label updates.
   ============================================================ */
const getTranslation = (key, language = currentLanguage) => {
  /* Splits a dot path into nested object lookups without hard-coding every
     possible translation key. */
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
  /* Pages without a hero title, such as legal pages, safely skip hero layout. */
  if (!heroTitle) {
    return;
  }

  const config = heroLineConfig[currentLanguage] || heroLineConfig.en;
  heroTitle.style.setProperty("--hero-line-top-width", config.topWidth);
  heroTitle.style.setProperty("--hero-line-top-offset", config.topOffset);
};

const updateLanguageButtons = () => {
  /* Each language button mirrors the active language with class and aria state
     so both visuals and assistive technology stay synchronized. */
  languageButtons.forEach((button) => {
    const isActive = button.dataset.languageOption === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

/* ============================================================
   HERO VIDEO PLAYBACK
   Attempts autoplay for the muted hero video.
   Parameters: none.
   Returns: nothing.
   Called after media events and page lifecycle events.
   ============================================================ */
const playHeroVideo = () => {
  /* Pages without a hero video skip playback logic. */
  if (!heroVideo) {
    return;
  }

  const playAttempt = heroVideo.play();

  /* Browsers may reject autoplay promises; errors are intentionally ignored
     because the page remains usable without video playback. */
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {});
  }
};

/* ============================================================
   HERO TYPEWRITER ANIMATION
   Replays the stroked hero headline typing animation.
   Parameters: none.
   Returns: nothing.
   Called on load, language changes, and BFCache restores.
   ============================================================ */
const restartHeroTyping = () => {
  /* Non-home pages or missing hero lines skip this animation completely. */
  if (!heroTitle || !heroLines.length) {
    return;
  }

  /* Reduced-motion users see the completed title immediately to avoid
     unnecessary animated typing. */
  if (prefersReducedMotion.matches) {
    heroTitle.classList.remove("typing-active");
    heroTitle.classList.add("typing-complete");
    heroLines.forEach((line) => {
      line.textContent = line.dataset.fullText || line.textContent;
      line.classList.remove("is-cursor");
    });
    return;
  }

  /* Incrementing the run id invalidates older timeouts from previous runs. */
  heroTypingRun += 1;
  const currentRun = heroTypingRun;

  heroTitle.classList.remove("typing-complete");
  heroTitle.classList.add("typing-active");

  heroLines.forEach((line) => {
    /* Preserve the full translated text before clearing visible characters. */
    if (!line.dataset.fullText) {
      line.dataset.fullText = line.textContent;
    }

    line.textContent = "";
    line.classList.remove("is-cursor");
  });

  /* Types one headline line with a delay per character.
     Parameters:
     - line: DOM element containing the text to type.
     - delay: milliseconds between each character.
     - onComplete: optional callback after the line finishes.
     Returns: nothing; it schedules timeouts. */
  const typeLine = (line, delay, onComplete) => {
    const fullText = line.dataset.fullText || "";
    let charIndex = 0;

    line.classList.add("is-cursor");

    const step = () => {
      /* If a newer typing run started, this timeout must stop to avoid
         mixing languages or duplicate cursor states. */
      if (currentRun !== heroTypingRun) {
        return;
      }

      /* While characters remain, reveal one more character and schedule the
         next step using the line-specific delay. */
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

  /* First line uses a 72ms character delay for a deliberate opening pace. */
  typeLine(heroLines[0], 72, () => {
    /* If the second line is missing or the run is stale, finish cleanly. */
    if (currentRun !== heroTypingRun || !heroLines[1]) {
      heroTitle.classList.remove("typing-active");
      heroTitle.classList.add("typing-complete");
      return;
    }

    /* 140ms pause creates a natural beat between the two hero lines. */
    window.setTimeout(() => {
      /* Second line uses a slightly faster 58ms delay so the animation
         accelerates after the opening word. */
      typeLine(heroLines[1], 58, () => {
        if (currentRun !== heroTypingRun) {
          return;
        }

        /* Final 120ms pause lets the last character settle before the title
           switches into its completed state. */
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

/* ============================================================
   MENU TOGGLE LABEL SYNC
   Updates the hamburger button aria-label based on open/closed state.
   Called after menu state changes and language changes.
   ============================================================ */
const updateMenuToggleLabel = () => {
  /* Without both header and button, there is no menu control to label. */
  if (!menuToggle || !header) {
    return;
  }

  const isOpen = header.classList.contains("menu-open");
  menuToggle.setAttribute(
    "aria-label",
    getTranslation(isOpen ? "nav.closeMenu" : "nav.openMenu"),
  );
};

/* Nested legal/privacy pages need "../" for links back to root-level pages. */
const getNestedPagePrefix = () =>
  currentPage === "impressum" || currentPage === "datenschutz" ? "../" : "";

/* ============================================================
   PRIVACY PAGE HREF BUILDER
   Returns the correct relative link to the privacy page for the current
   page depth. Used by the cookie modal link and includes the active
   language so the linked legal page opens in the selected language.
   ============================================================ */
const getPrivacyHref = () => {
  const href = currentPage === "datenschutz" ? "./" : `${getNestedPagePrefix()}datenschutz/`;
  return `${href}?lang=${currentLanguage}`;
};

/* ============================================================
   LANGUAGE URL SYNCHRONIZATION
   Mirrors the active language into the URL on legal pages so reloading,
   sharing, or directly opening privacy/imprint pages keeps the chosen
   language without relying only on localStorage.
   ============================================================ */
const syncLegalPageLanguageUrl = () => {
  if (currentPage !== "datenschutz" && currentPage !== "impressum") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("lang", currentLanguage);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

/* ============================================================
   LOCALIZED LEGAL HREF BUILDER
   Adds or replaces the lang query parameter while preserving the original
   relative path style used throughout the static site.
   ============================================================ */
const getLocalizedLegalHref = (href) => {
  if (!href) {
    return href;
  }

  const [hrefWithoutHash, hash = ""] = href.split("#");
  const [path, query = ""] = hrefWithoutHash.split("?");
  const isCurrentLegalPage = path === "./" && (currentPage === "datenschutz" || currentPage === "impressum");
  const isLegalPageLink = path.includes("datenschutz/") || path.includes("impressum/") || isCurrentLegalPage;

  if (!isLegalPageLink) {
    return href;
  }

  const params = new URLSearchParams(query);
  params.set("lang", currentLanguage);

  return `${path}?${params.toString()}${hash ? `#${hash}` : ""}`;
};

/* ============================================================
   LEGAL LINK LANGUAGE SYNCHRONIZATION
   Adds the active language to internal legal links so moving between
   Impressum and Datenschutz keeps the selected German/English version.
   ============================================================ */
const syncLegalLinksLanguage = () => {
  document.querySelectorAll('a[href*="datenschutz/"], a[href*="impressum/"], a[href="./"]').forEach((link) => {
    link.setAttribute("href", getLocalizedLegalHref(link.getAttribute("href")));
  });
};

/* ============================================================
   SESSION CONSENT READER
   Reads the visitor's cookie choice for the current browser tab only.
   sessionStorage prevents repeated modals during internal page navigation
   without storing the choice permanently on the device.
   ============================================================ */
const getSessionCookieConsent = () => {
  const value = window.sessionStorage.getItem(cookieConsentSessionKey);
  return value === "accepted" || value === "declined" ? value : "";
};

/* ============================================================
   SESSION CONSENT WRITER
   Stores the temporary Accept/Decline choice for this tab session so
   navigating between static pages does not reopen the modal immediately.
   ============================================================ */
const setSessionCookieConsent = (value) => {
  window.sessionStorage.setItem(cookieConsentSessionKey, value);
};

/* ============================================================
   SESSION CONSENT RESET
   Removes the temporary tab-session consent value so the modal can be
   shown again after the privacy-page reset button reloads the page.
   ============================================================ */
const clearSessionCookieConsent = () => {
  window.sessionStorage.removeItem(cookieConsentSessionKey);
};

/* ============================================================
   EXTERNAL FONT LOADER
   Adds Google Fonts preconnect and stylesheet links only after consent.
   This prevents external font requests before the visitor chooses Accept.
   ============================================================ */
const loadExternalFonts = () => {
  /* Prevent duplicate font links if the user accepts more than once. */
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

/* ============================================================
   EXTERNAL RESOURCE CONSENT SYNC
   Shows or blocks external resources based on the current consent choice.
   "accepted" loads fonts/icons; anything else keeps them blocked.
   ============================================================ */
const syncExternalResources = (consent) => {
  const canLoadExternalResources = consent === "accepted";

  /* Accepted consent loads Google Fonts for the current page load. */
  if (canLoadExternalResources) {
    loadExternalFonts();
  }

  /* data-external-src stores CDN image URLs without loading them before consent. */
  document.querySelectorAll("[data-external-src]").forEach((element) => {
    const container = element.closest("[data-consent-resource]");

    /* Declined or missing consent removes src and hides the owning social link. */
    if (!canLoadExternalResources) {
      element.removeAttribute("src");
      container?.setAttribute("hidden", "");
      return;
    }

    element.setAttribute("src", element.dataset.externalSrc);
    container?.removeAttribute("hidden");
  });
};

/* ============================================================
   COOKIE MODAL COPY SYNC
   Updates consent modal text and privacy link for the active language.
   Called when the modal is shown and after language changes.
   ============================================================ */
const updateCookieConsentCopy = () => {
  const dialog = document.querySelector("[data-cookie-dialog]");

  /* If the modal is not mounted, there is no copy to update. */
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

/* ============================================================
   COOKIE MODAL CLOSE
   Removes the consent overlay after the visitor chooses Accept or Decline.
   ============================================================ */
const closeCookieConsent = () => {
  document.querySelector("[data-cookie-consent]")?.remove();
};

/* ============================================================
   COOKIE CONSENT MODAL CREATION
   Builds the modal dynamically when the current tab has not made a choice
   yet, so external resources remain blocked until consent is known.
   ============================================================ */
const showCookieConsent = () => {
  /* If the modal already exists, refresh its translated text instead. */
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

  /* Decline keeps all non-essential external resources blocked for this load. */
  declineButton.addEventListener("click", () => {
    setSessionCookieConsent("declined");
    syncExternalResources("declined");
    closeCookieConsent();
  });

  /* Accept loads consent-gated fonts/icons for this load and closes the modal. */
  acceptButton.addEventListener("click", () => {
    setSessionCookieConsent("accepted");
    syncExternalResources("accepted");
    closeCookieConsent();
  });

  acceptButton.focus({ preventScroll: true });
};

/* ============================================================
   COOKIE CONSENT INITIALIZATION
   Reuses the current tab-session choice across internal page navigation,
   shows the modal only if no choice exists, and wires the privacy-page
   reset button to clear that temporary value.
   ============================================================ */
const initializeCookieConsent = () => {
  const consent = getSessionCookieConsent();
  syncExternalResources(consent);

  if (!consent) {
    showCookieConsent();
  }

  document.querySelectorAll("[data-cookie-reset]").forEach((button) => {
    /* Clearing sessionStorage and reloading shows the consent modal again. */
    button.addEventListener("click", () => {
      clearSessionCookieConsent();
      window.location.reload();
    });
  });
};

/* ============================================================
   TRANSLATION APPLICATION
   Applies the selected language to text, placeholders, aria labels,
   alt text, and meta descriptions. Called on startup and language clicks.
   ============================================================ */
const applyTranslations = (language) => {
  currentLanguage = language === "de" ? "de" : "en";
  /* localStorage persists only the language preference; cookie consent is
     stored only in sessionStorage for the current browser tab. */
  window.localStorage.setItem("site-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.documentElement.dataset.language = currentLanguage;
  syncLegalPageLanguageUrl();
  syncLegalLinksLanguage();

  /* data-i18n marks visible text nodes that should switch language. */
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = getTranslation(element.dataset.i18n);
  });

  /* Placeholders are attributes, so they require attribute-specific updates. */
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", getTranslation(element.dataset.i18nPlaceholder));
  });

  /* aria-label attributes keep assistive technology aligned with the UI language. */
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", getTranslation(element.dataset.i18nAriaLabel));
  });

  /* Image alt text is translated for accessibility and SEO. */
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", getTranslation(element.dataset.i18nAlt));
  });

  /* Meta descriptions are kept in sync with the active language. */
  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    element.setAttribute("content", getTranslation(element.dataset.i18nContent));
  });

  updateHeroLineLayout();

  heroLines.forEach((line) => {
    /* The hero typewriter needs the translated full text before replaying. */
    line.dataset.fullText = line.textContent;
  });

  updateLanguageButtons();
  updateMenuToggleLabel();
  updateCookieConsentCopy();

  /* Once the document is interactive, language changes replay the hero typing. */
  if (heroTitle && document.readyState !== "loading") {
    restartHeroTyping();
  }
};

/* ============================================================
   HERO VIDEO EVENT BINDINGS
   Keeps the muted local video playable across browser lifecycle events.
   These listeners are attached only on pages with a hero video.
   ============================================================ */
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  /* canplay and loadeddata both indicate the browser can attempt playback. */
  heroVideo.addEventListener("canplay", playHeroVideo);
  heroVideo.addEventListener("loadeddata", playHeroVideo);

  /* When a hidden tab becomes visible again, playback is attempted again. */
  document.addEventListener("visibilitychange", () => {
    /* Hidden tabs should not force playback attempts. */
    if (!document.hidden) {
      playHeroVideo();
    }
  });

  /* pageshow handles back-forward cache restores where load may not fire. */
  window.addEventListener("pageshow", (event) => {
    /* BFCache restores reuse DOM state, so the hero typing needs a restart. */
    if (event.persisted) {
      restartHeroTyping();
    }

    playHeroVideo();
  });
}

/* ============================================================
   NAVIGATION EVENT BINDINGS
   Opens/closes the mobile dropdown, closes it after link clicks, and
   dismisses it when clicking outside.
   ============================================================ */
if (header && menuToggle && nav) {
  setMenuState = (isOpen) => {
    header.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    updateMenuToggleLabel();
  };

  /* Click toggles the hamburger menu open or closed. */
  menuToggle.addEventListener("click", () => {
    const nextState = !header.classList.contains("menu-open");
    setMenuState(nextState);
  });

  navLinks.forEach((link) => {
    /* Any navigation link closes the dropdown so the target content is visible. */
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  /* Wide screens should not keep the mobile dropdown open after resizing. */
  window.addEventListener("resize", () => {
    /* 760px matches the CSS breakpoint where mobile navigation changes. */
    if (window.innerWidth > 760) {
      setMenuState(false);
    }
  });

  /* Clicking outside the open menu closes it, matching common mobile UX. */
  document.addEventListener("click", (event) => {
    /* If the menu is already closed, outside-click handling is unnecessary. */
    if (!header.classList.contains("menu-open")) {
      return;
    }

    /* Clicks inside the nav or on the toggle should not immediately close it. */
    if (nav.contains(event.target) || menuToggle.contains(event.target)) {
      return;
    }

    setMenuState(false);
  });
}

languageButtons.forEach((button) => {
  /* Language buttons apply translations and close the menu after selection. */
  button.addEventListener("click", () => {
    const requestedLanguage = button.dataset.languageOption;

    /* Empty values or selecting the current language require no update. */
    if (!requestedLanguage || requestedLanguage === currentLanguage) {
      return;
    }

    applyTranslations(requestedLanguage);
    setMenuState(false);
  });
});

/* Initial page setup restores language preference and initializes the
   tab-session cookie consent state before external resources load. */
currentLanguage = getStoredLanguage();
applyTranslations(currentLanguage);
initializeCookieConsent();

/* load runs after assets are available; it starts hero-specific behaviors. */
window.addEventListener("load", () => {
  resetHomeScrollPosition();
  restartHeroTyping();
  playHeroVideo();
});

/* pageshow handles browser back-forward cache cases for homepage scroll reset. */
window.addEventListener("pageshow", (event) => {
  /* Only BFCache restores need another forced top reset. */
  if (event.persisted) {
    resetHomeScrollPosition();
  }
});

const carousel = document.querySelector("[data-carousel]");

/* ============================================================
   FEATURED PROJECT CAROUSEL
   Creates an infinite-feeling carousel for homepage project cards using
   cloned cards, translate transforms, buttons, keyboard, touch, and wheel input.
   ============================================================ */
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

  /* Clones before and after the original cards allow seamless loop jumps. */
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

  /* Enables carousel controls. Kept as a function so future disabled states
     can be centralized without changing event handlers. */
  const syncButtons = () => {
    if (!prevButton || !nextButton) {
      return;
    }

    prevButton.disabled = false;
    nextButton.disabled = false;
  };

  /* Calculates the pixel offset required to center a specific card index. */
  const getTrackOffset = (index) => {
    /* Missing layout pieces return zero to avoid runtime errors on partial markup. */
    if (!viewport || !cards.length || !cards[index]) {
      return 0;
    }

    const card = cards[index];
    return card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
  };

  /* Keeps requested carousel indexes inside the current card array bounds. */
  const clampIndex = (index) => {
    /* Empty carousel data has no valid index, so zero is the safest fallback. */
    if (!cards.length) {
      return 0;
    }

    return Math.min(Math.max(index, 0), cards.length - 1);
  };

  /* Renders the track at currentIndex, optionally with animation. */
  const renderCarousel = ({ animate } = { animate: true }) => {
    /* Without track, viewport, or cards, there is nothing to render. */
    if (!track || !viewport || !cards.length) {
      return;
    }

    /* Jump mode disables transitions for invisible loop corrections or reduced motion. */
    track.classList.toggle("is-jumping", !animate || prefersReducedMotion.matches);
    track.style.transform = `translate3d(${-getTrackOffset(currentIndex)}px, 0, 0)`;

    /* requestAnimationFrame removes no-transition mode after the browser applies
       the immediate transform. */
    if (!animate || prefersReducedMotion.matches) {
      window.requestAnimationFrame(() => {
        track.classList.remove("is-jumping");
      });
    }

    syncButtons();
  };

  /* Moves immediately to an index without animation; used for loop resets. */
  const jumpToIndex = (index) => {
    if (!cards.length) {
      return;
    }

    currentIndex = clampIndex(index);
    renderCarousel({ animate: false });
  };

  /* Moves to an index with animation; used for visible user navigation. */
  const goToIndex = (index) => {
    if (!cards.length) {
      return;
    }

    currentIndex = clampIndex(index);
    renderCarousel({ animate: true });
  };

  /* Prepares seamless looping by jumping from clone boundaries back into the
     equivalent real-card range before the visible movement starts. */
  const prepareLoopMove = (direction) => {
    /* If no clones exist, no loop preparation is possible. */
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

  /* Main carousel movement helper; direction is -1 for previous and 1 for next. */
  const moveCarousel = (direction) => {
    /* Empty carousel data cannot move. */
    if (!cards.length) {
      return;
    }

    const didPrepareLoop = prepareLoopMove(direction);

    /* If no invisible loop jump was needed, simply animate to the next index. */
    if (!didPrepareLoop) {
      goToIndex(currentIndex + direction);
      return;
    }

    /* Double requestAnimationFrame ensures the invisible jump is committed
       before the animated movement begins. */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        goToIndex(currentIndex + direction);
      });
    });
  };

  /* Previous button moves one project card backward. */
  prevButton?.addEventListener("click", () => {
    moveCarousel(-1);
  });

  /* Next button moves one project card forward. */
  nextButton?.addEventListener("click", () => {
    moveCarousel(1);
  });

  /* Keyboard arrow navigation supports accessible carousel control. */
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

  /* Touch start records the initial finger position for swipe detection. */
  viewport?.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  /* Touch end compares start/end positions to detect horizontal swipes. */
  viewport?.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    /* Small movements or mostly vertical gestures are ignored so page scroll works. */
    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      moveCarousel(-1);
      return;
    }

    moveCarousel(1);
  });

  /* Wheel navigation lets horizontal trackpad gestures move the carousel. */
  viewport?.addEventListener(
    "wheel",
    (event) => {
      /* Wheel deltas are accumulated because trackpads emit many small events. */
      wheelDeltaX += event.deltaX;
      wheelDeltaY += event.deltaY;

      /* 160ms reset ends a wheel gesture shortly after scrolling stops. */
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelDeltaX = 0;
        wheelDeltaY = 0;
        wheelGestureLocked = false;
      }, 160);

      /* Ignore weak or mostly vertical wheel gestures to preserve page scrolling. */
      if (Math.abs(wheelDeltaX) < 40 || Math.abs(wheelDeltaX) <= Math.abs(wheelDeltaY)) {
        return;
      }

      /* Prevent native horizontal scrolling only after intentional carousel input. */
      event.preventDefault();

      /* A lock prevents one continuous wheel gesture from skipping many cards. */
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

  /* Resize recalculates offsets because card widths and viewport size changed. */
  window.addEventListener("resize", () => {
    jumpToIndex(currentIndex);
  });

  /* Initial positioning starts on the real card set after prepended clones. */
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
/* ============================================================
   SCROLL-TOP BUTTON VISIBILITY
   Shows the floating button after the user scrolls far enough down the page.
   ============================================================ */
const toggleScrollTopButton = () => {
  /* Pages without the button do not need visibility logic. */
  if (!scrollTopButton) {
    return;
  }

  /* 180px avoids showing the button immediately while still appearing early
     enough on long pages to be useful. */
  scrollTopButton.classList.toggle("is-visible", window.scrollY > 180);
};

/* ============================================================
   CONTACT FORM SUBMISSION
   Converts form fields into a mailto URL so no server or database receives
   visitor data.
   ============================================================ */
if (contactForm) {
  /* submit is intercepted to validate fields and open the email client. */
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /* Native validation prevents building an incomplete email. */
    if (!contactForm.reportValidity()) {
      return;
    }

    /* FormData extracts visible field values without separate DOM selectors. */
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    /* The email body combines sender name and message in a readable format. */
    const body = [
      `${getTranslation("contact.formBodyName")}: ${name}`,
      "",
      getTranslation("contact.formBodyMessage"),
      message,
    ].join("\n");

    /* mailto opens the visitor's default email app with subject/body filled in. */
    window.location.href = `mailto:gabrielgrassmayr@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* ============================================================
   SCROLL-TO-TOP EVENT BINDINGS
   Wires the floating button and scroll listener only when the button exists.
   ============================================================ */
if (scrollTopButton) {
  /* Click scrolls to the top, honoring reduced-motion preferences. */
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });

  /* Passive scroll listener updates visibility without blocking scrolling. */
  window.addEventListener("scroll", toggleScrollTopButton, { passive: true });
  toggleScrollTopButton();
}
