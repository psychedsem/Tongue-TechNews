import { describe, expect, it } from 'vitest';
import { getVisibleBatchSize, normalizeBatchSize } from '../src/js/utils.js';

describe('normalizeBatchSize', () => {
  it('accepts a valid value', () => {
    expect(normalizeBatchSize(20)).toBe(20);
  });

  it('limits a custom value to the maximum allowed', () => {
    expect(normalizeBatchSize(80, { max: 50 })).toBe(50);
  });

  it('uses the fallback when the value is not numeric', () => {
    expect(normalizeBatchSize('abc', { fallback: 10 })).toBe(10);
  });

  it('keeps the batch within the minimum limit', () => {
    expect(normalizeBatchSize(0)).toBe(1);
    expect(normalizeBatchSize(-12)).toBe(1);
  });
});

describe('getVisibleBatchSize', () => {
  it('does not return more items than those actually remaining', () => {
    expect(getVisibleBatchSize(50, 10)).toBe(10);
  });
});
