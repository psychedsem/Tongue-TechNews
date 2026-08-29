import { fetchNewStoryIds, fetchStoriesByIds } from './api.js';
import { NewsFactory } from './factory.js';
import { getNextBatch, getVisibleBatchSize, normalizeBatchSize } from './utils.js';

const INITIAL_BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 50;

function createMetaItem(label, value) {
  const item = document.createElement('span');
  item.className = 'news-card__meta-item';

  const labelElement = document.createElement('span');
  labelElement.className = 'news-card__meta-label';
  labelElement.textContent = label;

  const valueElement = document.createElement('span');
  valueElement.className = 'news-card__meta-value';
  valueElement.textContent = value;

  item.append(labelElement, valueElement);
  return item;
}

function createNewsCard(news, position) {
  const article = document.createElement('article');
  article.className = 'news-card';

  const index = document.createElement('span');
  index.className = 'news-card__index';
  index.setAttribute('aria-hidden', 'true');
  index.textContent = String(position + 1).padStart(2, '0');

  const body = document.createElement('div');
  body.className = 'news-card__body';

  const title = document.createElement('h3');
  title.className = 'news-card__title';

  const titleLink = document.createElement('a');
  titleLink.href = news.url;
  titleLink.target = '_blank';
  titleLink.rel = 'noreferrer noopener';
  titleLink.textContent = news.title;
  title.append(titleLink);

  const metadata = document.createElement('div');
  metadata.className = 'news-card__meta';
  metadata.append(
    createMetaItem('PUBBLICATA', news.publishedLabel),
    createMetaItem('SOURCE', news.source),
  );

  body.append(title, metadata);

  const action = document.createElement('a');
  action.className = 'news-card__action';
  action.href = news.url;
  action.target = '_blank';
  action.rel = 'noreferrer noopener';
  action.setAttribute('aria-label', `Apri la news: ${news.title}`);
  action.innerHTML = '<span>READ</span><span aria-hidden="true">↗</span>';

  article.append(index, body, action);
  return article;
}

function renderNews(container, newsItems, startPosition) {
  const fragment = document.createDocumentFragment();

  newsItems.forEach((news, index) => {
    fragment.append(createNewsCard(news, startPosition + index));
  });

  container.append(fragment);
}

function renderSkeletons(container, amount = 3) {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < amount; index += 1) {
    const skeleton = document.createElement('div');
    skeleton.className = 'news-card news-card--skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.innerHTML = `
      <span class="skeleton skeleton--index"></span>
      <div class="news-card__body">
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--meta"></span>
      </div>
      <span class="skeleton skeleton--action"></span>
    `;
    fragment.append(skeleton);
  }

  container.append(fragment);
}

function clearSkeletons(container) {
  container.querySelectorAll('.news-card--skeleton').forEach((skeleton) => skeleton.remove());
}

export function initNewsFeed() {
  const newsList = document.querySelector('#news-list');
  const loadMoreButton = document.querySelector('#load-more');
  const retryButton = document.querySelector('#retry-feed');
  const statusRegion = document.querySelector('#status-region');
  const loadedCount = document.querySelector('#loaded-count');
  const totalCount = document.querySelector('#total-count');
  const batchSelect = document.querySelector('#news-batch-size');
  const customWrap = document.querySelector('#news-custom-wrap');
  const customInput = document.querySelector('#news-custom-size');

  let storyIds = [];
  let currentIndex = 0;
  let renderedCount = 0;
  let isLoading = false;

  function setStatus(message = '', type = 'info') {
    statusRegion.textContent = message;
    statusRegion.dataset.type = type;
    statusRegion.hidden = !message;
  }

  function updateCounters() {
    loadedCount.textContent = String(renderedCount).padStart(2, '0');
    totalCount.textContent = storyIds.length ? String(storyIds.length) : '---';
  }

  function getBatchSize() {
    const value = batchSelect.value === 'custom' ? customInput.value : batchSelect.value;
    return normalizeBatchSize(value, { fallback: 10, max: MAX_BATCH_SIZE });
  }

  function getRemainingCount() {
    return Math.max(0, storyIds.length - currentIndex);
  }

  function updateLoadMoreButton() {
    const remaining = getRemainingCount();
    const hasMore = remaining > 0;
    const count = getVisibleBatchSize(getBatchSize(), remaining);

    loadMoreButton.disabled = isLoading || !hasMore;
    loadMoreButton.hidden = !hasMore;
    loadMoreButton.classList.toggle('is-loading', isLoading);

    const label = loadMoreButton.querySelector('.load-more__label');
    const countNode = loadMoreButton.querySelector('.load-more__count');
    label.textContent = isLoading ? 'LOADING' : 'LOAD MORE';
    countNode.textContent = isLoading ? '...' : `+${count}`;
  }

  function setBatchDisabled(disabled) {
    batchSelect.disabled = disabled;
    customInput.disabled = disabled;
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

  async function loadBatch(batchSize, showSkeletons = true) {
    if (isLoading || getRemainingCount() === 0) {
      return;
    }

    const batch = getNextBatch(storyIds, currentIndex, batchSize);

    isLoading = true;
    setBatchDisabled(true);
    setStatus('Ricezione delle ultime news in corso…');
    updateLoadMoreButton();

    if (showSkeletons) {
      renderSkeletons(newsList, Math.min(3, batch.items.length));
    }

    try {
      const { stories, failedIds } = await fetchStoriesByIds(batch.items);
      const newsItems = stories.map((story) => NewsFactory.create(story));

      clearSkeletons(newsList);
      renderNews(newsList, newsItems, renderedCount);

      currentIndex = batch.nextIndex;
      renderedCount += newsItems.length;
      updateCounters();

      if (failedIds.length) {
        setStatus(
          `${failedIds.length} news non sono state recuperate. Il feed continua con i dati disponibili.`,
          'warning',
        );
      } else {
        setStatus('Feed aggiornato.', 'success');
      }
    } catch (error) {
      clearSkeletons(newsList);
      setStatus('Connessione interrotta. Impossibile recuperare questo blocco di news.', 'error');
      console.error('Errore durante il caricamento delle news:', error);
    } finally {
      isLoading = false;
      setBatchDisabled(false);
      updateLoadMoreButton();
    }
  }

  async function initialize() {
    storyIds = [];
    currentIndex = 0;
    renderedCount = 0;
    isLoading = false;

    newsList.replaceChildren();
    retryButton.hidden = true;
    updateCounters();
    updateLoadMoreButton();

    setStatus('Connessione a Hacker News…');
    renderSkeletons(newsList, 3);

    try {
      storyIds = await fetchNewStoryIds();
      updateCounters();

      if (storyIds.length === 0) {
        clearSkeletons(newsList);
        setStatus('Nessuna news disponibile in questo momento.', 'warning');
        return;
      }

      await loadBatch(INITIAL_BATCH_SIZE, false);
    } catch (error) {
      clearSkeletons(newsList);
      retryButton.hidden = false;
      setStatus('Hacker News non risponde. Controlla la connessione e riprova.', 'error');
      console.error('Errore durante l\'inizializzazione del feed:', error);
    }
  }

  batchSelect.addEventListener('change', syncCustomInput);
  customInput.addEventListener('input', updateLoadMoreButton);
  customInput.addEventListener('blur', () => {
    customInput.value = String(getBatchSize());
    updateLoadMoreButton();
  });
  loadMoreButton.addEventListener('click', () => loadBatch(getBatchSize()));
  retryButton.addEventListener('click', initialize);

  initialize();
}
