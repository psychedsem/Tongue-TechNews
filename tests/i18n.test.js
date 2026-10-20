import { describe, expect, it } from 'vitest';
import {
  buildLanguagePath,
  getLanguageFromPath,
} from '../src/js/i18n.js';

describe('language routing', () => {
  it('reads the language from a root deployment path', () => {
    expect(getLanguageFromPath('/en/', '/')).toBe('en');
    expect(getLanguageFromPath('/it/', '/')).toBe('it');
  });

  it('reads the language after the GitHub Pages base path', () => {
    expect(
      getLanguageFromPath('/Tongue-TechNews/en/', '/Tongue-TechNews/'),
    ).toBe('en');
    expect(
      getLanguageFromPath('/Tongue-TechNews/it/', '/Tongue-TechNews/'),
    ).toBe('it');
  });

  it('returns null when no supported language is present', () => {
    expect(getLanguageFromPath('/', '/')).toBeNull();
    expect(
      getLanguageFromPath('/Tongue-TechNews/', '/Tongue-TechNews/'),
    ).toBeNull();
  });

  it('builds localized paths for both deployment bases', () => {
    expect(buildLanguagePath('en', '#events', '/')).toBe('/en/#events');
    expect(
      buildLanguagePath('it', '#about', '/Tongue-TechNews/'),
    ).toBe('/Tongue-TechNews/it/#about');
  });
});
