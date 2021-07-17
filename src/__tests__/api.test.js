import { getDiffInYears } from '@/utils/api';

describe('api', () => {
  describe('getDiffInYears', () => {
    it('returns years between dates', () => {
      const date1 = '2021-07-17';
      const date2 = '2000-01-01';

      expect(getDiffInYears(date1, date2)).toBe(21);
    });
  });
});
