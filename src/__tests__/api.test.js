import { getDiffInYears, getCastAge, calculateAge } from '@/utils/api';

// TODO: Add mswjs/data, fakerjs

const AVENGERS = {
  id: 24428,
  releaseDate: '2012-04-25',
};

const { releaseDate } = AVENGERS;

describe('api', () => {
  describe('getDiffInYears', () => {
    it('returns years between dates', () => {
      const date1 = '2021-07-17';
      const date2 = '2000-01-01';

      expect(getDiffInYears(date1, date2)).toBe(21);
    });
  });

  describe('getCastAge', () => {
    it('return cast current age and age on release', async () => {
      const mockedCast = [
        {
          adult: false,
          gender: 2,
          id: 3223,
          known_for_department: 'Acting',
          name: 'Robert Downey Jr.',
          original_name: 'Robert Downey Jr.',
          popularity: 12.811,
          profile_path: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
          cast_id: 46,
          character: 'Tony Stark / Iron Man',
          credit_id: '52fe4495c3a368484e02b251',
          order: 0,
        },
        {
          adult: false,
          gender: 2,
          id: 16828,
          known_for_department: 'Acting',
          name: 'Chris Evans',
          original_name: 'Chris Evans',
          popularity: 9.577,
          profile_path: '/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
          cast_id: 2,
          character: 'Steve Rogers / Captain America',
          credit_id: '52fe4495c3a368484e02b19b',
          order: 1,
        },
        {
          adult: false,
          gender: 2,
          id: 103,
          known_for_department: 'Acting',
          name: 'Mark Ruffalo',
          original_name: 'Mark Ruffalo',
          popularity: 8.835,
          profile_path: '/z3dvKqMNDQWk3QLxzumloQVR0pv.jpg',
          cast_id: 307,
          character: 'Bruce Banner / The Hulk',
          credit_id: '5e85e8083344c60015411cfa',
          order: 2,
        },
      ];
      const mockedPersons = [
        {
          adult: false,
          also_known_as: [
            'كريس إيفانز',
            '크리스 에반스',
            'Крис Эванс',
            'คริส อีแวนส์',
            '克里斯·埃文斯',
            'クリス・エヴァンス',
            'Кріс Еванс',
            'Christopher Robert "Chris" Evans',
            'Christopher Robert Evans',
            'Κρις Έβανς',
            'Κρίστοφερ Ρόμπερτ Έβανς',
            'Cap',
            'کریس اوانز',
          ],
          biography:
            'An American actor. Evans is known for his superhero roles as the Marvel Comics characters Steve Rogers in the Marvel Cinematic Universe and the Human Torch in Fantastic Four (2005) and its 2007 sequel. Evans began his career on the 2000 television series Opposite Sex. Besides his superhero films, he has appeared in such films as Not Another Teen Movie (2001), Sunshine (2007), Scott Pilgrim vs. the World (2010), Snowpiercer (2013), and Gifted (2017). In 2014, he made his directorial debut with the drama film Before We Go, in which he also starred. Evans made his Broadway debut in a 2018 production of Lobby Hero.\n' +
            '\n' +
            'Courtesy Wikipedia®',
          birthday: '1981-06-13',
          deathday: null,
          gender: 2,
          homepage: null,
          id: 16828,
          imdb_id: 'nm0262635',
          known_for_department: 'Acting',
          name: 'Chris Evans',
          place_of_birth: 'Sudbury, Massachusetts, USA',
          popularity: 9.577,
          profile_path: '/3bOGNsHlrswhyW79uvIHH1V43JI.jpg',
        },
        {
          adult: false,
          also_known_as: [
            'Bob Downey',
            '小勞勃·道尼',
            'روبرت داوني جونير',
            '로버트 다우니 주니어',
            'ロバート・ダウニー・Jr',
            'Роберт Дауни-младший',
            'Роберт Дауни мл.',
            'รอเบิร์ต ดาวนีย์ จูเนียร์',
            'Роберт Дауні-молодший',
            'Robert John Downey, Jr.',
            'Bob',
            'RDJ',
            'Downey Jr.',
            'Ρόμπερτ Ντάουνι Τζούνιορ',
            'রবার্ট ডাউনি জুনিয়র',
            'رابرت داونی جونیور',
            'Iron Man',
          ],
          biography:
            "Robert John Downey Jr. (born April 4, 1965) is an American actor and producer. Downey made his screen debut in 1970, at the age of five, when he appeared in his father's film Pound, and has worked consistently in film and television ever since. He received two Academy Award nominations for his roles in films Chaplin (1992) and Tropic Thunder (2008).\n" +
            '\n' +
            'Downey Jr. is most known for his role in the Marvel Cinematic Universe as Tony Stark/Iron Man. He has appeared as the character in Iron Man (2008), The Incredible Hulk (2008), Iron Man 2 (2010), The Avengers (2012), Iron Man 3 (2013), Avengers: Age of Ultron (2015), Captain America: Civil War (2016), Spider-Man: Homecoming (2017), Avengers: Infinity War (2018), and Avengers: Endgame (2019).',
          birthday: '1965-04-04',
          deathday: null,
          gender: 2,
          homepage: null,
          id: 3223,
          imdb_id: 'nm0000375',
          known_for_department: 'Acting',
          name: 'Robert Downey Jr.',
          place_of_birth: 'Manhattan, New York, USA',
          popularity: 12.811,
          profile_path: '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
        },
        {
          adult: false,
          also_known_as: [
            'مارك رافالو',
            '마크 러펄로',
            'マーク・ラファロ',
            'Марк Руффало',
            '马克·鲁法洛',
            'Μαρκ Ράφαλο',
            '馬克·盧法洛',
            'Марк Раффало',
          ],
          biography:
            'Mark Alan Ruffalo (born November 22, 1967) is an American actor, director, producer and screenwriter. He has worked in films including Eternal Sunshine of the Spotless Mind, Zodiac, Shutter Island, Just Like Heaven, You Can Count on Me and The Kids Are All Right for which he received an Academy Award nomination for Best Supporting Actor.\n' +
            '\n' +
            'Ruffalo portrays Bruce Banner/ The Hulk in the Marvel Cinematic Universe, taking over for Edward Norton in the role. He has portrayed the character in The Avengers (2012), Avengers: Age of Ultron (2015), Thor: Ragnarok (2017), Avengers: Infinity War (2018), and Avengers: Endgame (2019).  Description above from the Wikipedia article Mark Ruffalo, licensed under CC-BY-SA, full list of contributors on Wikipedia.',
          birthday: '1967-11-22',
          deathday: null,
          gender: 2,
          homepage: null,
          id: 103,
          imdb_id: 'nm0749263',
          known_for_department: 'Acting',
          name: 'Mark Ruffalo',
          place_of_birth: 'Kenosha, Wisconsin, USA',
          popularity: 8.835,
          profile_path: '/z3dvKqMNDQWk3QLxzumloQVR0pv.jpg',
        },
      ];
      const cast = await getCastAge(mockedCast, mockedPersons, releaseDate);

      expect(cast).toHaveLength(mockedCast.length);
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
});
