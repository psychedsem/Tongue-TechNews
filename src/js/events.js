import { getNextBatch, getVisibleBatchSize, normalizeBatchSize } from './utils.js';

const INITIAL_BATCH_SIZE = 5;
const MAX_BATCH_SIZE = 50;

const events = [
  {
    id: 1,
    title: 'Roma Circular Swap',
    date: '12 SET 2026',
    time: '16:00',
    location: 'Roma, Lazio, Italia',
    categories: ['SWAP PARTY', 'CIRCULAR ECONOMY'],
    description: 'Vestiti e oggetti trovano una seconda vita.',
  },
  {
    id: 2,
    title: 'Berlin Plastic-Free Night',
    date: '26 SET 2026',
    time: '18:30',
    location: 'Berlino, Berlino, Germania',
    categories: ['PLASTIC FREE', 'COMMUNITY'],
    description: 'Una serata dedicata alle alternative al monouso.',
  },
  {
    id: 3,
    title: 'Amsterdam Second Life Market',
    date: '10 OTT 2026',
    time: '11:00',
    location: 'Amsterdam, Olanda Settentrionale, Paesi Bassi',
    categories: ['SWAP PARTY', 'SUSTAINABILITY'],
    description: 'Scambio libero di capi e piccoli oggetti.',
  },
  {
    id: 4,
    title: 'Green Talks: Future Cities',
    date: '24 OTT 2026',
    time: '17:00',
    location: 'Copenaghen, Hovedstaden, Danimarca',
    categories: ['TALK', 'CLIMATE'],
    description: 'Un talk rapido sulle città sostenibili di domani.',
  },
  {
    id: 5,
    title: 'London Reuse Lab',
    date: '07 NOV 2026',
    time: '14:30',
    location: 'Londra, Inghilterra, Regno Unito',
    categories: ['CIRCULAR ECONOMY', 'LIVE EVENT'],
    description: 'Riparazione e riuso diventano pratica collettiva.',
  },
  {
    id: 6,
    title: 'Barcelona Zero Waste Meetup',
    date: '21 NOV 2026',
    time: '18:00',
    location: 'Barcellona, Catalogna, Spagna',
    categories: ['ZERO WASTE', 'COMMUNITY'],
    description: 'Piccole idee concrete per ridurre gli sprechi.',
  },
  {
    id: 7,
    title: 'Lisbon Climate & Community Lab',
    date: '05 DIC 2026',
    time: '16:30',
    location: 'Lisbona, Distretto di Lisbona, Portogallo',
    categories: ['CLIMATE', 'COMMUNITY'],
    description: 'Azioni locali e impatto collettivo in un solo lab.',
  },
  {
    id: 8,
    title: 'Paris Repair Culture',
    date: '19 DIC 2026',
    time: '15:00',
    location: 'Parigi, Île-de-France, Francia',
    categories: ['REPAIR', 'CIRCULAR ECONOMY'],
    description: 'Riparare prima di comprare: strumenti e idee.',
  },
  {
    id: 9,
    title: 'Vienna Conscious Closet',
    date: '16 GEN 2027',
    time: '12:00',
    location: 'Vienna, Vienna, Austria',
    categories: ['SWAP PARTY', 'FASHION'],
    description: 'Un guardaroba più leggero, uno scambio alla volta.',
  },
  {
    id: 10,
    title: 'Dublin Green Signals',
    date: '30 GEN 2027',
    time: '17:30',
    location: 'Dublino, Leinster, Irlanda',
    categories: ['TALK', 'SUSTAINABILITY'],
    description: 'Idee veloci su tecnologia e transizione sostenibile.',
  },
  {
    id: 11,
    title: 'Prague Community Exchange',
    date: '13 FEB 2027',
    time: '13:00',
    location: 'Praga, Praga, Cechia',
    categories: ['SWAP PARTY', 'COMMUNITY'],
    description: 'Oggetti utili passano di mano invece che sparire.',
  },
  {
    id: 12,
    title: 'Brussels Plastic Reset',
    date: '27 FEB 2027',
    time: '18:00',
    location: 'Bruxelles, Bruxelles-Capitale, Belgio',
    categories: ['PLASTIC FREE', 'LIVE EVENT'],
    description: 'Un incontro pratico per tagliare la plastica inutile.',
  },
  {
    id: 13,
    title: 'Stockholm Circular Session',
    date: '13 MAR 2027',
    time: '16:00',
    location: 'Stoccolma, Contea di Stoccolma, Svezia',
    categories: ['CIRCULAR ECONOMY', 'CLIMATE'],
    description: 'Design circolare e consumo consapevole, senza giri.',
  },
  {
    id: 14,
    title: 'Warsaw Future Materials',
    date: '27 MAR 2027',
    time: '17:00',
    location: 'Varsavia, Masovia, Polonia',
    categories: ['TALK', 'INNOVATION'],
    description: 'Materiali migliori per prodotti che durano di più.',
  },
  {
    id: 15,
    title: 'Helsinki Clean Loop',
    date: '10 APR 2027',
    time: '14:00',
    location: 'Helsinki, Uusimaa, Finlandia',
    categories: ['ZERO WASTE', 'COMMUNITY'],
    description: 'Una sessione aperta su riuso e sistemi a ciclo chiuso.',
  },
];

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

function createEventCard(event, onRegister) {
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
    createMetaItem('DATE', `${event.date} / ${event.time}`),
    createMetaItem('LOCATION', event.location),
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
  action.setAttribute('aria-label', `Registrazione demo per ${event.title}`);
  action.innerHTML = '<span>REGISTRATI</span><span aria-hidden="true">↗</span>';
  action.addEventListener('click', () => onRegister(event));

  article.append(index, body, action);
  return article;
}

export function initEventsFeed(onRegister = () => {}) {
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
    totalCount.textContent = String(events.length);
  }

  function updateLoadMoreButton() {
    const remaining = Math.max(0, events.length - currentIndex);
    const count = getVisibleBatchSize(getBatchSize(), remaining);
    const hasMore = remaining > 0;

    loadMoreButton.hidden = !hasMore;
    loadMoreButton.disabled = !hasMore;
    loadMoreButton.querySelector('.load-more__label').textContent = 'LOAD MORE';
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
    const batch = getNextBatch(events, currentIndex, batchSize);
    const fragment = document.createDocumentFragment();

    batch.items.forEach((event) => {
      fragment.append(createEventCard(event, onRegister));
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
