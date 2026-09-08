import { afterEach, describe, expect, it, vi } from 'vitest';

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

vi.mock('axios', () => ({
  default: {
    create: createMock,
  },
}));

describe('API configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    createMock.mockClear();
  });

  it('uses VITE_API_BASE_URL when it is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/api');

    await import('../src/js/api.js');

    expect(createMock).toHaveBeenCalledWith({
      baseURL: '/api',
      timeout: 10000,
    });
  });
});