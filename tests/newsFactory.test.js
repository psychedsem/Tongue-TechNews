import { describe, expect, it } from 'vitest';
import { NewsFactory } from '../src/js/factory.js';

describe('NewsFactory', () => {
  it('normalizes a Hacker News story into a UI-ready object', () => {
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

  it('uses the Hacker News discussion as fallback when the URL is missing', () => {
    const news = NewsFactory.create({
      id: 456,
      title: 'Ask HN example',
      time: 1717243200,
    });

    expect(news.url).toBe('https://news.ycombinator.com/item?id=456');
    expect(news.source).toBe('news.ycombinator.com');
  });

  it('handles an invalid timestamp without breaking rendering', () => {
    const news = NewsFactory.create({
      id: 789,
      title: 'Story without date',
      time: null,
    });

    expect(news.publishedAt).toBeNull();
    expect(news.publishedLabel).toBe('Data non disponibile');
  });

  it('rejects a news item without a valid ID', () => {
    expect(() => NewsFactory.create({ title: 'Broken item' })).toThrow(TypeError);
  });
});
