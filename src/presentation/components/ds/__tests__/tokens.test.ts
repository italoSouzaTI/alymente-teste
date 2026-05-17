import { getLanguageColor, languageColors } from '@ds/tokens';

describe('tokens', () => {
  describe('getLanguageColor', () => {
    it('returns correct color for TypeScript', () => {
      const result = getLanguageColor('TypeScript', '#000');

      expect(result).toBe(languageColors.TypeScript);
      expect(result).toBe('#3178c6');
    });

    it('returns correct color for JavaScript', () => {
      const result = getLanguageColor('JavaScript', '#000');

      expect(result).toBe(languageColors.JavaScript);
    });

    it('returns fallback color for unknown language', () => {
      const result = getLanguageColor('UnknownLanguage', '#fallback');

      expect(result).toBe('#fallback');
    });

    it('returns fallback for empty string', () => {
      const result = getLanguageColor('', '#fallback');

      expect(result).toBe('#fallback');
    });

    it('returns correct colors for all known languages', () => {
      const knownLanguages = Object.keys(languageColors) as (keyof typeof languageColors)[];

      knownLanguages.forEach((lang) => {
        expect(getLanguageColor(lang, '#000')).toBe(languageColors[lang]);
      });
    });
  });
});
