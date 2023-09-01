import { getDiffInYears, calculateAge, calculateCastAge } from './utils';

const AVENGERS = {
  id: 24428,
  releaseDate: '2012-04-25',
};

const { releaseDate } = AVENGERS;

describe('utils', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-07-07'));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  describe('getDiffInYears', () => {
    it('returns years between dates', () => {
      const date1 = '2021-07-17';
      const date2 = '2000-01-01';

      expect(getDiffInYears(date1, date2)).toBe(21);
    });
  });
  describe('calculateAge', () => {
    it('returns person object', () => {
      const mockedCharacter = 'Tony Stark / Iron Man';
      const mockedPerson = {
        birthday: '1965-04-04',
        deathday: null,
        id: 3223,
        known_for_department: 'Acting',
        name: 'Robert Downey Jr.',
      };

      const person = calculateAge(
        { ...mockedPerson, character: mockedCharacter },
        releaseDate,
      );
      const { id, birthday, deathday, age, ageOnRelease, name, character } =
        person;

      expect(id).toBe(mockedPerson.id);
      expect(birthday).toBe('April 4, 1965');
      expect(age).toBe(57);
      expect(ageOnRelease).toBe(47);
      expect(name).toBe(mockedPerson.name);
      expect(character).toBe(mockedCharacter);
      expect(deathday).toBeNull();
    });

    it('returns person with correct age if person died', () => {
      const mockedPerson = {
        adult: false,
        birthday: '1922-12-28',
        deathday: '2018-11-12',
        id: 7624,
        name: 'Stan Lee',
      };

      const person = calculateAge(mockedPerson, releaseDate);
      const { age, deathday } = person;

      expect(age).toBe(95);
      expect(deathday).toBe('November 12, 2018');
    });
  });
  it('return person current age and age on release', async () => {
    const mockedCast = [
      {
        id: 3223,
        name: 'Robert Downey Jr.',
        character: 'Tony Stark / Iron Man',
      },
      {
        id: 16828,
        name: 'Chris Evans',
        character: 'Steve Rogers / Captain America',
      },
      {
        id: 103,
        name: 'Mark Ruffalo',
        character: 'Bruce Banner / The Hulk',
      },
    ];
    const mockedPersons = [
      {
        birthday: '1981-06-13',
        deathday: null,
        id: 16828,
        name: 'Chris Evans',
      },
      {
        birthday: '1965-04-04',
        deathday: null,
        id: 3223,
        name: 'Robert Downey Jr.',
      },
      {
        birthday: '1967-11-22',
        deathday: null,
        id: 103,
        name: 'Mark Ruffalo',
      },
    ];
    const cast = await calculateCastAge(mockedCast, mockedPersons, releaseDate);

    expect(cast).toHaveLength(mockedCast.length);
  });
});
