const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = new Set(['en', 'it']);

const translations = {
  en: {
    meta: {
      title: 'Tongue // Tech News',
      description:
        'Tongue: tech news from Hacker News, digital information and events focused on sustainability and community.',
    },
    nav: {
      mainAria: 'Main navigation',
      brandAria: 'Tongue - back to home',
      sectionsAria: 'Site sections',
      about: 'ABOUT US',
      events: 'EVENTS',
      languageAria: 'Choose language',
      instagramAria: 'Open Instagram - demo link',
      instagramTitle: 'Demo Instagram link',
    },
    hero: {
      lede:
        'The latest tech news, pulled from Hacker News and organized in a clean, fast and constantly updated feed.',
    },
    news: {
      heading: 'Latest news',
      listAria: 'List of the latest tech news',
      batchAria: 'Number of news items to load',
      customAria: 'Custom number of news items',
      published: 'PUBLISHED',
      source: 'SOURCE',
      openAria: (title) => `Open news: ${title}`,
      loading: 'LOADING',
      loadMore: 'LOAD MORE',
      statusLoading: 'Receiving the latest news…',
      statusPartial: (count) =>
        `${count} news item${count === 1 ? '' : 's'} could not be retrieved. The feed continues with the available data.`,
      statusUpdated: 'Feed updated.',
      statusConnectionError: 'Connection interrupted. Unable to retrieve this batch of news.',
      statusConnecting: 'Connecting to Hacker News…',
      statusEmpty: 'No news is available right now.',
      statusUnavailable: 'Hacker News is not responding. Check your connection and try again.',
      fallbackTitle: 'Title unavailable',
      unavailableDate: 'Date unavailable',
    },
    about: {
      heading: 'About us',
      p1:
        'Tongue started on Instagram from the meeting between a journalist and YouTuber Simon Lanches, with the goal of making information more immediate, understandable and accessible. What began as a social editorial project grew into a real company, now made up of more than 50 collaborators.',
      p2a:
        'At the heart of the project is direct, fast yet complete communication. The most relevant current topics are turned into content designed to be easy to consume without losing context. Tongue has a community of almost 3 million followers on ',
      p2b:
        ', and every week it hosts experts, professionals and organizations to explore innovation, environmental sustainability and social impact.',
      p3:
        'Tongue does not stop at the screen: meetings, conferences, sustainable initiatives and swap parties turn the digital community into real-world participation.',
      cta: 'DISCOVER EVENTS',
    },
    events: {
      heading: 'Events',
      introTitle: 'Information becomes experience.',
      introText:
        'Tongue brings the topics discussed by its community beyond social media, organizing online and live events focused on social impact, sustainability and collective participation. Talks, meetings with experts and plastic-free initiatives turn information and awareness into concrete experiences.',
      featureText:
        'Tongue Swap Parties are events dedicated to exchanging second-hand clothes and objects: giving new life to what already exists, reducing waste and creating more opportunities to connect.',
      upcoming: 'Upcoming events',
      listAria: 'List of upcoming events',
      batchAria: 'Number of events to load',
      customAria: 'Custom number of events',
      date: 'DATE',
      location: 'LOCATION',
      register: 'REGISTER',
      registerAria: (title) => `Demo registration for ${title}`,
    },
    footer: {
      copyright: '© 2026 TONGUE - DEMO PROJECT',
    },
    toast: {
      registration: (title) =>
        `Demo UI - registration for “${title}” is not connected to a backend.`,
    },
  },
  it: {
    meta: {
      title: 'Tongue // Tech News',
      description:
        'Tongue: tech news da Hacker News, informazione digitale ed eventi dedicati a sostenibilità e community.',
    },
    nav: {
      mainAria: 'Navigazione principale',
      brandAria: 'Tongue - torna alla home',
      sectionsAria: 'Sezioni del sito',
      about: 'CHI SIAMO',
      events: 'EVENTI',
      languageAria: 'Scegli la lingua',
      instagramAria: 'Apri Instagram - link dimostrativo',
      instagramTitle: 'Link Instagram dimostrativo',
    },
    hero: {
      lede:
        'Le ultime notizie dal mondo tech, recuperate da Hacker News e ordinate in un feed essenziale, veloce e sempre aggiornato.',
    },
    news: {
      heading: 'Ultime news',
      listAria: 'Elenco delle ultime notizie tech',
      batchAria: 'Numero di news da caricare',
      customAria: 'Numero personalizzato di news',
      published: 'PUBBLICATA',
      source: 'SOURCE',
      openAria: (title) => `Apri la news: ${title}`,
      loading: 'LOADING',
      loadMore: 'LOAD MORE',
      statusLoading: 'Ricezione delle ultime news in corso…',
      statusPartial: (count) =>
        `${count} news non ${count === 1 ? 'è stata recuperata' : 'sono state recuperate'}. Il feed continua con i dati disponibili.`,
      statusUpdated: 'Feed aggiornato.',
      statusConnectionError: 'Connessione interrotta. Impossibile recuperare questo blocco di news.',
      statusConnecting: 'Connessione a Hacker News…',
      statusEmpty: 'Nessuna news disponibile in questo momento.',
      statusUnavailable: 'Hacker News non risponde. Controlla la connessione e riprova.',
      fallbackTitle: 'Titolo non disponibile',
      unavailableDate: 'Data non disponibile',
    },
    about: {
      heading: 'Chi siamo',
      p1:
        "Tongue nasce su Instagram dall'incontro tra una giornalista e lo YouTuber Simon Lanches, con l'obiettivo di rendere l'informazione più immediata, comprensibile e accessibile. Quello che inizialmente era un progetto editoriale social è cresciuto fino a diventare una vera azienda, oggi composta da oltre 50 collaboratori.",
      p2a:
        "Il cuore del progetto è una comunicazione diretta, veloce ma completa. I temi più rilevanti dell'attualità vengono trasformati in contenuti pensati per essere fruiti con facilità, senza perdere il contesto. La community di Tongue conta quasi 3 milioni di follower su ",
      p2b:
        ', e ogni settimana ospita esperti, professionisti e organizzazioni per approfondire innovazione, sostenibilità ambientale e impatto sociale.',
      p3:
        "L'attività di Tongue non si ferma allo schermo: incontri, conferenze, iniziative sostenibili e swap party trasformano la community digitale in partecipazione reale.",
      cta: 'SCOPRI GLI EVENTI',
    },
    events: {
      heading: 'Eventi',
      introTitle: 'Informazione che diventa esperienza.',
      introText:
        'Tongue porta i temi della propria community anche fuori dai social, organizzando eventi online e dal vivo dedicati a impatto sociale, sostenibilità e partecipazione collettiva. Talk, incontri con esperti e iniziative plastic-free trasformano informazione e consapevolezza in esperienze concrete.',
      featureText:
        'Gli Swap Party di Tongue sono eventi dedicati allo scambio di vestiti e oggetti di seconda mano: nuova vita a ciò che già esiste, meno sprechi e più socialità.',
      upcoming: 'Prossimi eventi',
      listAria: 'Elenco dei prossimi eventi',
      batchAria: 'Numero di eventi da caricare',
      customAria: 'Numero personalizzato di eventi',
      date: 'DATE',
      location: 'LOCATION',
      register: 'REGISTRATI',
      registerAria: (title) => `Registrazione demo per ${title}`,
    },
    footer: {
      copyright: '© 2026 TONGUE - DEMO PROJECT',
    },
    toast: {
      registration: (title) =>
        `Demo UI - la registrazione a “${title}” non è collegata a un backend.`,
    },
  },
};

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.has(language) ? language : DEFAULT_LANGUAGE;
}

function normalizeBaseUrl(baseUrl = import.meta.env.BASE_URL) {
  const withLeadingSlash = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function getLanguageFromPath(pathname, baseUrl = import.meta.env.BASE_URL) {
  const base = normalizeBaseUrl(baseUrl);
  const relativePath = pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname.replace(/^\/+/, '');
  const firstSegment = relativePath.split('/').filter(Boolean)[0];

  return SUPPORTED_LANGUAGES.has(firstSegment) ? firstSegment : null;
}

export function buildLanguagePath(
  language,
  hash = '',
  baseUrl = import.meta.env.BASE_URL,
) {
  const normalizedLanguage = normalizeLanguage(language);
  const base = normalizeBaseUrl(baseUrl);
  const normalizedHash = hash && !hash.startsWith('#') ? `#${hash}` : hash;

  return `${base}${normalizedLanguage}/${normalizedHash}`;
}

export function ensureLocalizedPath() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const language = getLanguageFromPath(window.location.pathname);

  if (language) {
    return language;
  }

  window.location.replace(
    buildLanguagePath(DEFAULT_LANGUAGE, window.location.hash),
  );

  return null;
}

export function getCopy(language) {
  return translations[normalizeLanguage(language)];
}

export function applyStaticTranslations(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const copy = getCopy(normalizedLanguage);

  document.documentElement.lang = normalizedLanguage;
  document.title = copy.meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', copy.meta.description);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const keys = element.dataset.i18n.split('.');
    const value = keys.reduce((current, key) => current?.[key], copy);

    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    const keys = element.dataset.i18nAria.split('.');
    const value = keys.reduce((current, key) => current?.[key], copy);

    if (typeof value === 'string') {
      element.setAttribute('aria-label', value);
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    const keys = element.dataset.i18nTitle.split('.');
    const value = keys.reduce((current, key) => current?.[key], copy);

    if (typeof value === 'string') {
      element.setAttribute('title', value);
    }
  });

  document.querySelectorAll('[data-language]').forEach((link) => {
    const targetLanguage = link.dataset.language;
    const isActive = targetLanguage === normalizedLanguage;

    link.href = buildLanguagePath(targetLanguage, window.location.hash);
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  return copy;
}
