import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import uniqBy from 'lodash.uniqby';

dayjs.extend(duration);
dayjs.extend(localizedFormat);

async function getMovieFromAPI(id, releaseDate) {
  return fetch(
    `${process.env.NEXT_BASE_URL}/api/movie/${id}?releaseDate=${releaseDate}`,
  );
}

async function getTvShowFromAPI(id, season) {
  return fetch(`${process.env.NEXT_BASE_URL}/api/tv/${id}?season=${season}`);
}

function getDiffInYears(date1, date2) {
  return Math.abs(dayjs.duration(dayjs(date1).diff(dayjs(date2))).$d.years);
}

const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  const data = await res.json();

  return data;
};

const BASE_URL = 'https://api.themoviedb.org/3';

function generateUrl(endpoint, params = []) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', process.env.apiKey);
  params.forEach(({ name, value }) => {
    url.searchParams.append(name, value);
  });
  return url;
}

async function client(endpoint, params = []) {
  try {
    const res = await fetch(generateUrl(endpoint, params));

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');

      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

async function searchMulti(query) {
  const data = await client('/search/multi', [{ name: 'query', value: query }]);

  return data;
}

async function getPerson(id) {
  const data = await client(`/person/${id}`);

  return data;
}

async function getPersons(cast) {
  const promises = cast.map(person => () => getPerson(person.id));
  const result = await Promise.allSettled(promises.map(f => f()));
  const persons = result
    .filter(({ value }) => value?.birthday)
    .map(({ value }) => value);

  return persons;
}

async function getMovieCast(id) {
  const { cast } = await client(`/movie/${id}/credits`);
  const uniqueCast = uniqBy(cast, 'id');
  return uniqueCast;
}

async function getTvShow(id) {
  const data = await client(`/tv/${id}`);

  return data;
}

async function getTvShowCast(id, season) {
  const { cast } = await client(`/tv/${id}/season/${season}/credits`);
  const uniqueCast = uniqBy(cast, 'id');
  return uniqueCast;
}

function calculateAge(person, releaseDate) {
  const { id, name, character, birthday, deathday, profile_path } = person;

  const age = deathday
    ? getDiffInYears(deathday, birthday)
    : getDiffInYears(dayjs(), birthday);

  return {
    id,
    name,
    character,
    birthday: dayjs(birthday).format('LL'),
    deathday: deathday ? dayjs(deathday).format('LL') : null,
    profile_path,
    age,
    ageOnRelease: getDiffInYears(releaseDate, birthday),
  };
}

function getCastAge(cast, persons, releaseDate) {
  return persons.map(person => {
    const { id } = person;
    const { character } = cast.find(p => p.id === id);

    return calculateAge(
      {
        ...person,
        character,
      },
      releaseDate,
    );
  });
}

async function getPersonsWithAge(cast, releaseDate) {
  const persons = await getPersons(cast);
  const result = getCastAge(cast, persons, releaseDate);

  return result;
}

async function getMovieCastAge(id, releaseDate) {
  const cast = await getMovieCast(id);
  return getPersonsWithAge(cast, releaseDate);
}

async function getTvShowCastAge(id, season, releaseDate) {
  const cast = await getTvShowCast(id, season);
  return getPersonsWithAge(cast, releaseDate);
}

export {
  fetcher,
  searchMulti,
  getMovieCast,
  getPerson,
  getTvShow,
  getTvShowCast,
  getDiffInYears,
  getPersons,
  getCastAge,
  calculateAge,
  getMovieCastAge,
  getTvShowCastAge,
  getTvShowFromAPI,
  getMovieFromAPI,
};
