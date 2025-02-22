import { describe, it, expect, vi } from 'vitest';
import { calculateAges, customFormatDistance, formatMinutes } from './dates';

describe('dates', () => {
  it.each([
    [8, '8m'],
    [30, '30m'],
    [62, '1h 2m'],
    [123, '2h 3m'],
  ])(`formatMinutes(%i) -> %s`, (a, expected) => {
    expect(formatMinutes(a)).toBe(expected);
  });
});

describe('caclulateAges', () => {
  it.each([
    [
      '2000-01-01',
      { birthday: '1980-01-01', deathday: undefined },
      { ageThen: 20, ageNow: 45 },
    ],

    [
      '2000-01-01',
      { birthday: '1930-01-01', deathday: '2010-01-01' },
      { ageThen: 70, ageNow: 80 },
    ],
    [
      '2000-01-01',
      { birthday: undefined, deathday: undefined },
      { ageThen: null, ageNow: null },
    ],
  ])(`calculateAges(%i) -> %s`, (releaseDate, dates, expected) => {
    const date = new Date('2025-01-01');
    vi.useFakeTimers();
    vi.setSystemTime(date);

    expect(calculateAges(releaseDate, dates)).toEqual(expected);

    vi.useRealTimers();
  });
});

describe('customFormatDistance', () => {
  it.each([
    ['2000-01-01', '2001-01-01', '1 year'],
    ['2000-01-02', '2025-01-01', '24 years'],
    ['2000-01-02', '2025-01-02', '25 years'],
  ])(`customFormatDistance(%s, %s) -> %s`, (date1, date2, expected) => {
    expect(customFormatDistance(date1, date2)).toBe(expected);
  });
});
