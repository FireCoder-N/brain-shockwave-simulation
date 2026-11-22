import { describe, expect, it } from 'vitest';
import { extractDoi, makeCiteKey, parseEntries, serializeEntry } from './bibtex.mjs';

describe('parseEntries', () => {
  it('parses braced, quoted and bare values, including nested braces', () => {
    const bib = `
@comment{ignored}
@article{bilston2001linear,
  title  = {Linear viscoelastic properties of {bovine} brain tissue},
  author = "Bilston, Lynne E. and Liu, Zhou",
  year   = 2001,
  doi    = {10.1114/1.1408926}
}`;
    const [e] = parseEntries(bib);
    expect(e.type).toBe('article');
    expect(e.key).toBe('bilston2001linear');
    expect(e.fields.title).toBe('Linear viscoelastic properties of {bovine} brain tissue');
    expect(e.fields.author).toBe('Bilston, Lynne E. and Liu, Zhou');
    expect(e.fields.year).toBe('2001');
    expect(e.raw.year).toBe('2001');
    expect(bib.slice(e.start, e.end).endsWith('}')).toBe(true);
  });

  it('parses Crossref-style single-line output', () => {
    const [e] = parseEntries(
      '@article{Bilston_2001, title={A title}, volume={29}, DOI={10.1114/1.1408926}, year={2001} }',
    );
    expect(e.key).toBe('Bilston_2001');
    expect(e.fields.doi).toBe('10.1114/1.1408926');
    expect(e.fields.volume).toBe('29');
  });

  it('skips malformed fragments such as a broken Crossref key', () => {
    const [e] = parseEntries(
      '@article{Provenzano_2001, jr._2001, title={Nonlinear Ligament Viscoelasticity}, month=Oct, author={Vanderby, Jr., Ray}, year={2001} }',
    );
    expect(e.fields.title).toBe('Nonlinear Ligament Viscoelasticity');
    expect(e.fields.month).toBe('Oct');
    expect(e.fields.author).toBe('Vanderby, Jr., Ray');
    expect(e.fields.year).toBe('2001');
  });

  it('round-trips through serializeEntry', () => {
    const [e] = parseEntries('@misc{k, title = {T}, year = 2020}');
    const [again] = parseEntries(serializeEntry(e));
    expect(again.fields).toEqual(e.fields);
  });
});

describe('extractDoi', () => {
  it('finds DOIs in URLs and prose, trimming trailing punctuation', () => {
    expect(extractDoi('see https://doi.org/10.1016/j.jbiomech.2004.05.001.')).toBe(
      '10.1016/j.jbiomech.2004.05.001',
    );
    expect(extractDoi('doi:10.1114/1.1408926, Annals')).toBe('10.1114/1.1408926');
    expect(extractDoi('no identifier here')).toBeNull();
  });
});

describe('makeCiteKey', () => {
  it('handles "Last, First" and "First Last" author formats', () => {
    const f = { year: '2001', title: 'The linear viscoelastic model' };
    expect(makeCiteKey({ ...f, author: 'Bilston, Lynne E. and Liu, Zhou' })).toBe(
      'bilston2001linear',
    );
    expect(makeCiteKey({ ...f, author: 'Lynne E. Bilston' })).toBe('bilston2001linear');
  });

  it('strips diacritics and disambiguates collisions', () => {
    const fields = { author: 'Müller, Ana', year: '2020', title: 'Brain' };
    expect(makeCiteKey(fields)).toBe('muller2020brain');
    expect(makeCiteKey(fields, new Set(['muller2020brain']))).toBe('muller2020braina');
  });
});
