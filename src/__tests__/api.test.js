import { getMovieCastAge, getTvShowCastAge, getDiffInYears } from '@/utils/api';

const AVENGERS = {
  id: 24428,
  releaseDate: '2012-04-25',
};

const FRIENDS = {
  id: 1668,
  releaseDate: '1994-09-22',
  season: 1,
};

describe('api', () => {
  describe('getDiffInYears', () => {
    it('returns years between dates', () => {
      const date1 = '2021-07-17';
      const date2 = '2000-01-01';

      expect(getDiffInYears(date1, date2)).toBe(21);
    });
  });

  describe('getMovieCastAge', () => {
    it('return cast current age and age on release', async () => {
      const { id, releaseDate } = AVENGERS;

      const cast = await getMovieCastAge(id, releaseDate);

      expect(cast.length).toBeGreaterThan(0);
      cast.forEach(({ age, ageOnRelease }) => {
        expect(typeof age).toBe('number');
        expect(typeof ageOnRelease).toBe('number');
        expect(age).toBeGreaterThan(-1);
        expect(ageOnRelease).toBeGreaterThan(-1);
      });
    });
  });

  describe('getTvShowCastAge', () => {
    it('return cast current age and age on release', async () => {
      const { id, releaseDate, season } = FRIENDS;

      const cast = await getTvShowCastAge(id, releaseDate, season);

      expect(cast.length).toBeGreaterThan(0);
      cast.forEach(({ age, ageOnRelease }) => {
        expect(typeof age).toBe('number');
        expect(typeof ageOnRelease).toBe('number');
        expect(age).toBeGreaterThan(-1);
        expect(ageOnRelease).toBeGreaterThan(-1);
      });
    });
  });
});
