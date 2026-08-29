import { describe, expect, it } from 'vitest';
import { getVisibleBatchSize, normalizeBatchSize } from '../src/js/utils.js';

describe('normalizeBatchSize', () => {
  it('accetta un valore valido', () => {
    expect(normalizeBatchSize(20)).toBe(20);
  });

  it('limita un valore personalizzato al massimo consentito', () => {
    expect(normalizeBatchSize(80, { max: 50 })).toBe(50);
  });

  it('usa il fallback quando il valore non è numerico', () => {
    expect(normalizeBatchSize('abc', { fallback: 10 })).toBe(10);
  });

  it('mantiene il batch entro il limite minimo', () => {
    expect(normalizeBatchSize(0)).toBe(1);
    expect(normalizeBatchSize(-12)).toBe(1);
  });
});

describe('getVisibleBatchSize', () => {
  it('non promette più elementi di quelli realmente rimasti', () => {
    expect(getVisibleBatchSize(50, 10)).toBe(10);
  });
});
