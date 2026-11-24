import { describe, expect, it } from 'vitest';
import { extractHeadings, slugify } from './headings.js';

describe('slugify', () => {
  it('makes URL-friendly ids in any script', () => {
    expect(slugify('Off-center blows')).toBe('off-center-blows');
    expect(slugify('The Kelvin–Voigt model')).toBe('the-kelvin-voigt-model');
    expect(slugify('Σφαιρικές συντεταγμένες')).toBe('σφαιρικες-συντεταγμενες');
    expect(slugify('Сферне координате')).toBe('сферне-координате');
    expect(slugify('Introdução')).toBe('introducao');
    expect(slugify('!!!')).toBe('section');
  });
});

describe('extractHeadings', () => {
  it('finds ## and ### headings, skipping code and math blocks', () => {
    const md = [
      '# Title is not listed',
      '## First',
      'text',
      '```',
      '## not a heading (code)',
      '```',
      '$$',
      '## not a heading (math)',
      '$$',
      '### Second ##',
    ].join('\n');
    expect(extractHeadings(md)).toEqual([
      { level: 2, text: 'First', id: 'first' },
      { level: 3, text: 'Second', id: 'second' },
    ]);
  });
});
