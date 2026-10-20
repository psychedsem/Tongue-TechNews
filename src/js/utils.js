function getDateFormatter(language = 'it') {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Rome',
  });
}

export function formatUnixDate(unixSeconds, language = 'it') {
  if (!unixSeconds || Number.isNaN(Number(unixSeconds))) {
    return language === 'en' ? 'Date unavailable' : 'Data non disponibile';
  }

  return getDateFormatter(language).format(new Date(Number(unixSeconds) * 1000));
}

export function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '') || 'news.ycombinator.com';
  } catch {
    return 'news.ycombinator.com';
  }
}

export function normalizeBatchSize(value, { fallback = 10, max = 50 } = {}) {
  const number = Number(value);
  const safeValue = Number.isFinite(number) ? number : fallback;

  return Math.min(Math.max(Math.trunc(safeValue), 1), max);
}

export function getVisibleBatchSize(requestedSize, remainingItems) {
  return Math.min(Math.max(Number(requestedSize) || 0, 0), Math.max(remainingItems, 0));
}

export function getNextBatch(items, startIndex, batchSize) {
  if (batchSize <= 0) {
    throw new RangeError('batchSize deve essere maggiore di 0');
  }

  const batchItems = items.slice(startIndex, startIndex + batchSize);
  const nextIndex = startIndex + batchItems.length;

  return {
    items: batchItems,
    nextIndex,
    hasMore: nextIndex < items.length,
  };
}
