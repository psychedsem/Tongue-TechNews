import { getCopy, getLanguageFromPath } from './i18n.js';
import { getNextBatch, getVisibleBatchSize, normalizeBatchSize } from './utils.js';

const INITIAL_BATCH_SIZE = 5;
const MAX_BATCH_SIZE = 50;

const events = [
  {
    id: 1,
    title: { it: 'Roma Circular Swap', en: 'Rome Circular Swap' },
    date: { it: '12 SET 2026', en: '12 SEP 2026' },
    time: '16:00',
    location: {
      it: 'Roma, Lazio, Italia',
      en: 'Rome, Lazio, Italy',
    },
    categories: ['SWAP PARTY', 'CIRCULAR ECONOMY'],
    description: {
      it: 'Vestiti e oggetti trovano una seconda vita.',
      en: 'Clothes and objects find a second life.',
    },
  },
  {
    id: 2,
    title: { it: 'Berlin Plastic-Free Night', en: 'Berlin Plastic-Free Night' },
    date: { it: '26 SET 2026', en: '26 SEP 2026' },
    time: '18:30',
    location: {
      it: 'Berlino, Berlino, Germania',
      en: 'Berlin, Berlin, Germany',
    },
    categories: ['PLASTIC FREE', 'COMMUNITY'],
    description: {
      it: 'Una serata dedicata alle alternative al monouso.',
      en: 'An evening dedicated to alternatives to single-use products.',
    },
  },
  {
    id: 3,
    title: { it: 'Amsterdam Second Life Market', en: 'Amsterdam Second Life Market' },
    date: { it: '10 OTT 2026', en: '10 OCT 2026' },
    time: '11:00',
    location: {
      it: 'Amsterdam, Olanda Settentrionale, Paesi Bassi',
      en: 'Amsterdam, North Holland, Netherlands',
    },
    categories: ['SWAP PARTY', 'SUSTAINABILITY'],
    description: {
      it: 'Scambio libero di capi e piccoli oggetti.',
      en: 'A free exchange of clothes and small objects.',
    },
  },
  {
    id: 4,
    title: { it: 'Green Talks: Future Cities', en: 'Green Talks: Future Cities' },
    date: { it: '24 OTT 2026', en: '24 OCT 2026' },
    time: '17:00',
    location: {
      it: 'Copenaghen, Hovedstaden, Danimarca',
      en: 'Copenhagen, Capital Region, Denmark',
    },
    categories: ['TALK', 'CLIMATE'],
    description: {
      it: 'Un talk rapido sulle città sostenibili di domani.',
      en: 'A quick talk on the sustainable cities of tomorrow.',
    },
  },
  {
    id: 5,
    title: { it: 'London Reuse Lab', en: 'London Reuse Lab' },
    date: { it: '07 NOV 2026', en: '07 NOV 2026' },
    time: '14:30',
    location: {
      it: 'Londra, Inghilterra, Regno Unito',
      en: 'London, England, United Kingdom',
    },
    categories: ['CIRCULAR ECONOMY', 'LIVE EVENT'],
    description: {
      it: 'Riparazione e riuso diventano pratica collettiva.',
      en: 'Repair and reuse become a collective practice.',
    },
  },
  {
    id: 6,
    title: { it: 'Barcelona Zero Waste Meetup', en: 'Barcelona Zero Waste Meetup' },
    date: { it: '21 NOV 2026', en: '21 NOV 2026' },
    time: '18:00',
    location: {
      it: 'Barcellona, Catalogna, Spagna',
      en: 'Barcelona, Catalonia, Spain',
    },
    categories: ['ZERO WASTE', 'COMMUNITY'],
    description: {
      it: 'Piccole idee concrete per ridurre gli sprechi.',
      en: 'Small practical ideas to reduce waste.',
    },
  },
  {
    id: 7,
    title: { it: 'Lisbon Climate & Community Lab', en: 'Lisbon Climate & Community Lab' },
    date: { it: '05 DIC 2026', en: '05 DEC 2026' },
    time: '16:30',
    location: {
      it: 'Lisbona, Distretto di Lisbona, Portogallo',
      en: 'Lisbon, Lisbon District, Portugal',
    },
    categories: ['CLIMATE', 'COMMUNITY'],
    description: {
      it: 'Azioni locali e impatto collettivo in un solo lab.',
      en: 'Local action and collective impact in one lab.',
    },
  },
  {
    id: 8,
    title: { it: 'Paris Repair Culture', en: 'Paris Repair Culture' },
    date: { it: '19 DIC 2026', en: '19 DEC 2026' },
    time: '15:00',
    location: {
      it: 'Parigi, Île-de-France, Francia',
      en: 'Paris, Île-de-France, France',
    },
    categories: ['REPAIR', 'CIRCULAR ECONOMY'],
    description: {
      it: 'Riparare prima di comprare: strumenti e idee.',
      en: 'Repair before buying: tools and ideas.',
    },
  },
  {
    id: 9,
    title: { it: 'Vienna Conscious Closet', en: 'Vienna Conscious Closet' },
    date: { it: '16 GEN 2027', en: '16 JAN 2027' },
    time: '12:00',
    location: {
      it: 'Vienna, Vienna, Austria',
      en: 'Vienna, Vienna, Austria',
    },
    categories: ['SWAP PARTY', 'FASHION'],
    description: {
      it: 'Un guardaroba più leggero, uno scambio alla volta.',
      en: 'A lighter wardrobe, one swap at a time.',
    },
  },
  {
    id: 10,
    title: { it: 'Dublin Green Signals', en: 'Dublin Green Signals' },
    date: { it: '30 GEN 2027', en: '30 JAN 2027' },
    time: '17:30',
    location: {
      it: 'Dublino, Leinster, Irlanda',
      en: 'Dublin, Leinster, Ireland',
    },
    categories: ['TALK', 'SUSTAINABILITY'],
    description: {
      it: 'Idee veloci su tecnologia e transizione sostenibile.',
      en: 'Quick ideas on technology and sustainable transition.',
    },
  },
  {
    id: 11,
    title: { it: 'Prague Community Exchange', en: 'Prague Community Exchange' },
    date: { it: '13 FEB 2027', en: '13 FEB 2027' },
    time: '13:00',
    location: {
      it: 'Praga, Praga, Cechia',
      en: 'Prague, Prague, Czechia',
    },
    categories: ['SWAP PARTY', 'COMMUNITY'],
    description: {
      it: 'Oggetti utili passano di mano invece che sparire.',
      en: 'Useful objects change hands instead of disappearing.',
    },
  },
  {
    id: 12,
    title: { it: 'Brussels Plastic Reset', en: 'Brussels Plastic Reset' },
    date: { it: '27 FEB 2027', en: '27 FEB 2027' },
    time: '18:00',
    location: {
      it: 'Bruxelles, Bruxelles-Capitale, Belgio',
      en: 'Brussels, Brussels-Capital, Belgium',
    },
    categories: ['PLASTIC FREE', 'LIVE EVENT'],
    description: {
      it: 'Un incontro pratico per tagliare la plastica inutile.',
      en: 'A practical meeting to cut unnecessary plastic.',
    },
  },
  {
    id: 13,
    title: { it: 'Stockholm Circular Session', en: 'Stockholm Circular Session' },
    date: { it: '13 MAR 2027', en: '13 MAR 2027' },
    time: '16:00',
    location: {
      it: 'Stoccolma, Contea di Stoccolma, Svezia',
      en: 'Stockholm, Stockholm County, Sweden',
    },
    categories: ['CIRCULAR ECONOMY', 'CLIMATE'],
    description: {
      it: 'Design circolare e consumo consapevole, senza giri.',
      en: 'Circular design and mindful consumption, straight to the point.',
    },
  },
  {
    id: 14,
    title: { it: 'Warsaw Future Materials', en: 'Warsaw Future Materials' },
    date: { it: '27 MAR 2027', en: '27 MAR 2027' },
    time: '17:00',
    location: {
      it: 'Varsavia, Masovia, Polonia',
      en: 'Warsaw, Masovia, Poland',
    },
    categories: ['TALK', 'INNOVATION'],
    description: {
      it: 'Materiali migliori per prodotti che durano di più.',
      en: 'Better materials for products that last longer.',
    },
  },
  {
    id: 15,
    title: { it: 'Helsinki Clean Loop', en: 'Helsinki Clean Loop' },
    date: { it: '10 APR 2027', en: '10 APR 2027' },
    time: '14:00',
    location: {
      it: 'Helsinki, Uusimaa, Finlandia',
      en: 'Helsinki, Uusimaa, Finland',
    },
    categories: ['ZERO WASTE', 'COMMUNITY'],
    description: {
      it: 'Una sessione aperta su riuso e sistemi a ciclo chiuso.',
      en: 'An open session on reuse and closed-loop systems.',
    },
  },
];

function localizeEvent(event, language) {
  return {
    ...event,
    title: event.title[language],
    date: event.date[language],
    location: event.location[language],
    description: event.description[language],
  };
}

function createMetaItem(label, value) {
  const item = document.createElement('span');
  item.className = 'event-card__meta-item';

  const labelElement = document.createElement('span');
  labelElement.className = 'event-card__meta-label';
  labelElement.textContent = label;

  const valueElement = document.createElement('span');
  valueElement.className = 'event-card__meta-value';
  valueElement.textContent = value;

  item.append(labelElement, valueElement);
  return item;
}

function createEventCard(event, onRegister, copy) {
  const article = document.createElement('article');
  article.className = 'event-card';

  const index = document.createElement('span');
  index.className = 'event-card__index';
  index.setAttribute('aria-hidden', 'true');
  index.textContent = String(event.id).padStart(2, '0');

  const body = document.createElement('div');
  body.className = 'event-card__body';

  const title = document.createElement('h4');
  title.className = 'event-card__title';
  title.textContent = event.title;

  const description = document.createElement('p');
  description.className = 'event-card__description';
  description.textContent = event.description;

  const metadata = document.createElement('div');
  metadata.className = 'event-card__meta';
  metadata.append(
    createMetaItem(copy.events.date, `${event.date} / ${event.time}`),
    createMetaItem(copy.events.location, event.location),
  );

  const categories = document.createElement('div');
  categories.className = 'event-card__categories';

  event.categories.forEach((category) => {
    const tag = document.createElement('span');
    tag.className = 'event-card__tag';
    tag.textContent = category;
    categories.append(tag);
  });

  body.append(title, description, metadata, categories);

  const action = document.createElement('button');
  action.className = 'event-card__action';
  action.type = 'button';
  action.setAttribute('aria-label', copy.events.registerAria(event.title));
  action.innerHTML = `<span>${copy.events.register}</span><span aria-hidden="true">↗</span>`;
  action.addEventListener('click', () => onRegister(event));

  article.append(index, body, action);
  return article;
}

export function initEventsFeed(onRegister = () => {}) {
  const language = getLanguageFromPath(window.location.pathname) || 'en';
  const copy = getCopy(language);
  const localizedEvents = events.map((event) => localizeEvent(event, language));
  const eventsList = document.querySelector('#events-list');
  const loadMoreButton = document.querySelector('#events-load-more');
  const loadedCount = document.querySelector('#events-loaded-count');
  const totalCount = document.querySelector('#events-total-count');
  const batchSelect = document.querySelector('#events-batch-size');
  const customWrap = document.querySelector('#events-custom-wrap');
  const customInput = document.querySelector('#events-custom-size');

  let currentIndex = 0;

  function getBatchSize() {
    const value = batchSelect.value === 'custom' ? customInput.value : batchSelect.value;
    return normalizeBatchSize(value, { fallback: 10, max: MAX_BATCH_SIZE });
  }

  function updateCounters() {
    loadedCount.textContent = String(currentIndex).padStart(2, '0');
    totalCount.textContent = String(localizedEvents.length);
  }

  function updateLoadMoreButton() {
    const remaining = Math.max(0, localizedEvents.length - currentIndex);
    const count = getVisibleBatchSize(getBatchSize(), remaining);
    const hasMore = remaining > 0;

    loadMoreButton.hidden = !hasMore;
    loadMoreButton.disabled = !hasMore;
    loadMoreButton.querySelector('.load-more__label').textContent = copy.news.loadMore;
    loadMoreButton.querySelector('.load-more__count').textContent = `+${count}`;
  }

  function syncCustomInput() {
    const isCustom = batchSelect.value === 'custom';
    customWrap.hidden = !isCustom;

    if (isCustom) {
      customInput.value = String(getBatchSize());
      customInput.focus();
    }

    updateLoadMoreButton();
  }

  function loadBatch(batchSize) {
    const batch = getNextBatch(localizedEvents, currentIndex, batchSize);
    const fragment = document.createDocumentFragment();

    batch.items.forEach((event) => {
      fragment.append(createEventCard(event, onRegister, copy));
    });

    eventsList.append(fragment);
    currentIndex = batch.nextIndex;
    updateCounters();
    updateLoadMoreButton();
  }

  batchSelect.addEventListener('change', syncCustomInput);
  customInput.addEventListener('input', updateLoadMoreButton);
  customInput.addEventListener('blur', () => {
    customInput.value = String(getBatchSize());
    updateLoadMoreButton();
  });
  loadMoreButton.addEventListener('click', () => loadBatch(getBatchSize()));

  eventsList.replaceChildren();
  loadBatch(INITIAL_BATCH_SIZE);
}
