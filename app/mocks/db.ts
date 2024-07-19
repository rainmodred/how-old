import { factory, primaryKey, manyOf, nullable } from '@mswjs/data';
import { cast, movies, persons, tv } from './mocks';

export const db = factory({
  movie: {
    id: primaryKey(Number),
    release_date: String,
    title: String,
    poster_path: String,
    media_type: String,
  },
  tv: {
    id: primaryKey(Number),
    first_air_date: String,
    name: String,
    poster_path: String,
    media_type: String,
  },
  cast: {
    id: primaryKey(Number),
    actors: manyOf('actor'),
  },
  actor: {
    id: primaryKey(Number),
    character: String,
    known_for_department: String,
  },
  person: {
    id: primaryKey(Number),
    name: String,
    birthday: String,
    deathday: nullable(String),
    profile_path: String,
  },
});

export function initDb() {
  // createFakeMovie();
  for (const person of persons) {
    db.person.create({
      id: person.id,
      name: person.name,
      birthday: person.birthday,
      deathday: person.deathday,
      profile_path: person.profile_path,
    });
  }

  for (const actor of cast) {
    db.actor.create({
      id: actor.id,
      character: actor.character,
      known_for_department: actor.known_for_department,
    });
  }

  for (const movie of movies) {
    db.movie.create({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      media_type: 'movie',
    });
    db.cast.create({
      id: movie.id,
      actors: db.actor.getAll().slice(0, 3),
    });
  }

  for (const t of tv) {
    db.tv.create({
      id: t.id,
      name: t.name,
      first_air_date: t.first_air_date,
      poster_path: t.poster_path,
      media_type: 'tv',
    });

    db.cast.create({
      id: t.id,
      actors: db.actor.getAll().slice(3, 5),
    });
  }
}
