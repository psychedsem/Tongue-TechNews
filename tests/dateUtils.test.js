import { describe, expect, it } from 'vitest';
import { formatUnixDate } from '../src/js/utils.js';

describe('formatUnixDate', () => {
  it('converte Unix Time in una data leggibile italiana', () => {
    const formatted = formatUnixDate(1717243200);

    expect(formatted).toContain('2024');
    expect(formatted).toMatch(/giu/i);
  });

  it('gestisce valori mancanti o non validi', () => {
    expect(formatUnixDate(null)).toBe('Data non disponibile');
    expect(formatUnixDate('not-a-date')).toBe('Data non disponibile');
  });
});
