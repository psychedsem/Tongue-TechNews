import { describe, expect, it } from 'vitest';
import { formatUnixDate } from '../src/js/utils.js';

describe('formatUnixDate', () => {
  it('converts Unix Time into a readable Italian date', () => {
    const formatted = formatUnixDate(1717243200);

    expect(formatted).toContain('2024');
    expect(formatted).toMatch(/giu/i);
  });

  it('handles missing or invalid values', () => {
    expect(formatUnixDate(null)).toBe('Data non disponibile');
    expect(formatUnixDate('not-a-date')).toBe('Data non disponibile');
  });
});
