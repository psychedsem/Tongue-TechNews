import { describe, expect, it } from 'vitest';
import { getNextBatch } from '../src/js/utils.js';

describe('getNextBatch', () => {
  const ids = Array.from({ length: 25 }, (_, index) => index + 1);

  it('restituisce i primi 10 elementi e il prossimo indice', () => {
    expect(getNextBatch(ids, 0, 10)).toEqual({
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      nextIndex: 10,
      hasMore: true,
    });
  });

  it('restituisce un ultimo blocco più corto senza superare la lista', () => {
    expect(getNextBatch(ids, 20, 10)).toEqual({
      items: [21, 22, 23, 24, 25],
      nextIndex: 25,
      hasMore: false,
    });
  });

  it('rifiuta un batch size non valido', () => {
    expect(() => getNextBatch(ids, 0, 0)).toThrow(RangeError);
  });
});
