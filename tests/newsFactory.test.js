import { describe, expect, it } from 'vitest';
import { NewsFactory } from '../src/js/factory.js';

describe('NewsFactory', () => {
  it('normalizza una story Hacker News in un oggetto pronto per la UI', () => {
    const news = NewsFactory.create({
      id: 123,
      title: '  A test story  ',
      url: 'https://example.com/article',
      time: 1717243200,
    });

    expect(news).toMatchObject({
      id: 123,
      title: 'A test story',
      url: 'https://example.com/article',
      source: 'example.com',
      publishedAt: 1717243200,
    });
    expect(news.publishedLabel).toContain('2024');
  });

  it('usa la discussione Hacker News come fallback quando manca url', () => {
    const news = NewsFactory.create({
      id: 456,
      title: 'Ask HN example',
      time: 1717243200,
    });

    expect(news.url).toBe('https://news.ycombinator.com/item?id=456');
    expect(news.source).toBe('news.ycombinator.com');
  });

  it('gestisce un timestamp non valido senza rompere il rendering', () => {
    const news = NewsFactory.create({
      id: 789,
      title: 'Story without date',
      time: null,
    });

    expect(news.publishedAt).toBeNull();
    expect(news.publishedLabel).toBe('Data non disponibile');
  });

  it('rifiuta una news senza id valido', () => {
    expect(() => NewsFactory.create({ title: 'Broken item' })).toThrow(TypeError);
  });
});
