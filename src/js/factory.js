import { formatUnixDate, getHostname } from './utils.js';

const HN_DISCUSSION_URL = 'https://news.ycombinator.com/item?id=';

export class NewsFactory {
  static create(story) {
    const id = Number(story?.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError('La news deve avere un id valido');
    }

    const title = story.title?.trim() || 'Titolo non disponibile';
    const url = story.url?.trim() || `${HN_DISCUSSION_URL}${id}`;
    const publishedAt = Number(story.time) > 0 ? Number(story.time) : null;

    return {
      id,
      title,
      url,
      source: getHostname(url),
      publishedAt,
      publishedLabel: formatUnixDate(publishedAt),
    };
  }
}
