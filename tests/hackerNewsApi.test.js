import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: getMock,
    })),
  },
}));

import {
  fetchNewStoryIds,
  fetchStoriesByIds,
  fetchStoryById,
} from '../src/js/api.js';

describe('Hacker News API service', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('fetches the ID list from newstories', async () => {
    getMock.mockResolvedValueOnce({ data: [101, 102, 103] });

    await expect(fetchNewStoryIds()).resolves.toEqual([101, 102, 103]);
    expect(getMock).toHaveBeenCalledWith('/newstories.json');
  });

  it('builds the story detail request correctly for an ID', async () => {
    getMock.mockResolvedValueOnce({ data: { id: 27933223, title: 'Story' } });

    await expect(fetchStoryById(27933223)).resolves.toMatchObject({ id: 27933223 });
    expect(getMock).toHaveBeenCalledWith('/item/27933223.json');
  });

  it('keeps valid stories when one request in the batch fails', async () => {
    getMock.mockImplementation((path) => {
      if (path === '/item/2.json') {
        return Promise.reject(new Error('Network error'));
      }

      const id = Number(path.match(/\d+/)?.[0]);
      return Promise.resolve({ data: { id, title: `Story ${id}` } });
    });

    const result = await fetchStoriesByIds([1, 2, 3]);

    expect(result.stories.map((story) => story.id)).toEqual([1, 3]);
    expect(result.failedIds).toEqual([2]);
  });

  it('excludes deleted or dead items from the batch', async () => {
    getMock.mockImplementation((path) => {
      const id = Number(path.match(/\d+/)?.[0]);

      if (id === 2) {
        return Promise.resolve({ data: { id, deleted: true } });
      }

      if (id === 3) {
        return Promise.resolve({ data: { id, dead: true } });
      }

      return Promise.resolve({ data: { id, title: `Story ${id}` } });
    });

    const result = await fetchStoriesByIds([1, 2, 3]);

    expect(result.stories.map((story) => story.id)).toEqual([1]);
    expect(result.failedIds).toEqual([2, 3]);
  });

});
