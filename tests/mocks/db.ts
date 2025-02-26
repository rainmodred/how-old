import { factory, primaryKey, manyOf, nullable, oneOf } from '@mswjs/data';
import { genres } from './mocks';
import { faker } from '@faker-js/faker';
import { Genre } from '~/api/getMovieDetails';

export const db = factory({
  movie: {
    id: primaryKey(Number),
    release_date: String,
    title: String,
    poster_path: String,
    popularity: Number,
    overview: String,
    runtime: Number,
    genres: manyOf('genre'),
    actors: manyOf('actor'),
    video: Boolean,
  },
  genre: {
    id: primaryKey(Number),
    name: String,
  },
  actor: {
    id: primaryKey(Number),
    character: String,
    person: oneOf('person'),
  },
  person: {
    id: primaryKey(Number),
    name: String,
    birthday: String,
    deathday: nullable(String),
    profile_path: String,
    popularity: Number,
    place_of_birth: String,
    known_for_department: String,
  },
  tv: {
    id: primaryKey(Number),
    first_air_date: String,
    name: String,
    poster_path: String,
    overview: String,
    genres: manyOf('genre'),
    seasons: manyOf('season'),
  },
  season: {
    id: primaryKey(Number),
    air_date: String,
    season_number: Number,
    actors: manyOf('actor'),
  },
});

faker.seed(451);
let id = 1;

export function createFakePerson() {
  return {
    id: id++,
    name: faker.person.fullName(),
    birthday: faker.date.birthdate().toISOString().split('T')[0] as string,
    deathday: null,
    place_of_birth: faker.location.city(),
    popularity: faker.number.float({ min: 1, max: 100 }),
    known_for_department: 'Acting',
    profile_path: faker.image.urlLoremFlickr(),
    media_type: 'person',
  };
}

export function createFakeMovie() {
  return {
    id: id++,
    title: faker.book.title(),
    poster_path: faker.image.urlLoremFlickr(),
    release_date: faker.date
      .past({ years: 9 })
      .toISOString()
      .split('T')[0] as string,
    video: false,
    popularity: faker.number.float({ min: 1, max: 100 }),
    runtime: faker.number.int({ min: 30, max: 300 }),
    overview: faker.lorem.words(10),
    media_type: 'movie',
  };
}

export function createFakeTv() {
  return {
    id: id++,
    name: faker.book.title(),
    first_air_date: faker.date
      .between({ from: '1990', to: '2020' })
      .toISOString()
      .split('T')[0],
    poster_path: faker.image.urlLoremFlickr(),
    popularity: faker.number.int({ min: 1, max: 100 }),
    overview: faker.lorem.words(10),
    media_type: 'tv',
  };
}

export function createFakeSeasons(count: number = 3, startDate: string) {
  const seasons = [];

  const start = new Date(startDate);
  for (let i = 0; i < count; i++) {
    start.setFullYear(start.getFullYear() + 1);

    seasons.push({
      id: id++,
      name: `Season ${i + 1}`,
      season_number: i + 1,
      air_date: start.toISOString().split('T')[0],
    });
  }
  return seasons;
}

export function createFakeActor() {
  return {
    id: id++,
    character: faker.person.fullName(),
  };
}

export function getRandomItems<T>(items: T[], limit: number) {
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

export function mswGetPersonCast(id: number) {
  const roles = db.actor.findMany({
    where: { person: { id: { equals: Number(id) } } },
  });
  const rolesId = roles.map(role => role.id);

  const movies = db.movie.findMany({
    where: { actors: { id: { in: rolesId } } },
  });

  //TODO:
  // const tvs = db.tv.findMany({
  //   where: { seasons: { actors: { id: { in: rolesId } } } },
  // });

  return [
    ...movies.map(movie => ({
      ...movie,
      character: movie.actors.find(actor => actor.person?.id === id)?.character,
      media_type: 'movie',
      genre_ids: genresToGenreIds(movie.genres),
    })),
    // ...tvs.map(tv => ({
    //   ...tv,
    //   character: 'JOE',
    //   media_type: 'tv',
    //   genre_ids: genresToGenreIds(tv.genres),
    // })),
  ];
}

export function genresToGenreIds(genres: Genre[]) {
  return genres.map(genre => genre.id);
}

const MOVIES_COUNT = 10;
const TV_COUNT = 3;
const PERSONS_COUNT = 60;

export function seed() {
  for (const genre of genres) {
    db.genre.create({ id: genre.id, name: genre.name });
  }

  for (let i = 0; i < PERSONS_COUNT; i++) {
    db.person.create(createFakePerson());
  }

  for (let i = 0; i < MOVIES_COUNT; i++) {
    const actors = [];

    const persons = getRandomItems(db.person.getAll(), 15);
    for (const person of persons) {
      const actor = createFakeActor();
      actors.push(db.actor.create({ ...actor, person }));
    }

    const genres = getRandomItems(db.genre.getAll(), 3);
    const fakeMovie = createFakeMovie();
    db.movie.create({ ...fakeMovie, actors, genres });
  }

  for (let i = 0; i < TV_COUNT; i++) {
    const actors = [];
    const persons = getRandomItems(db.person.getAll(), 15);

    for (const person of persons) {
      const actor = createFakeActor();
      actors.push(db.actor.create({ ...actor, person }));
    }

    const tv = createFakeTv();
    const seasons = createFakeSeasons(5, tv.first_air_date);

    const dbSeasons = [];
    for (const season of seasons) {
      dbSeasons.push(db.season.create({ ...season, actors }));
    }

    db.tv.create({ ...tv, seasons: dbSeasons });
  }
}
