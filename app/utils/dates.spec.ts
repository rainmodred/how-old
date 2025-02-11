import { describe, it, expect } from 'vitest';
import { formatMinutes } from './dates';

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
