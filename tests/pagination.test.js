import { describe, expect, it } from 'vitest';
import { getNextBatch } from '../src/js/utils.js';

describe('getNextBatch', () => {
  const ids = Array.from({ length: 25 }, (_, index) => index + 1);

  it('returns the first 10 items and the next index', () => {
    expect(getNextBatch(ids, 0, 10)).toEqual({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      nextIndex: 10,
      hasMore: true,
    });
  });

  it('returns a shorter final batch without exceeding the list', () => {
    expect(getNextBatch(ids, 20, 10)).toEqual({
      items: [21, 22, 23, 24, 25],
      nextIndex: 25,
      hasMore: false,
    });
  });

  it('rejects an invalid batch size', () => {
    expect(() => getNextBatch(ids, 0, 0)).toThrow(RangeError);
  });
});
