import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import uniqBy from 'lodash.uniqby';

dayjs.extend(duration);
dayjs.extend(localizedFormat);

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

async function getMovieCredits(id) {
  const data = await client(`/movie/${id}/credits`);

  return data;
}

async function getTvShowCredits(id, season) {
  const data = await client(`/tv/${id}/season/${season}/credits`);

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
  const { cast } = await getMovieCredits(id);

  return cast;
}

async function getTvShow(id) {
  const data = await client(`/tv/${id}`);

  return data;
}

async function getTvShowCast(id, season) {
  const { cast } = await getTvShowCredits(id, season);

  return cast;
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

async function getMovieCastAge(id, releaseDate) {
  const cast = await getMovieCast(id);
  const uniqueCast = uniqBy(cast, 'id');
  const persons = await getPersons(uniqueCast);
  const result = getCastAge(uniqueCast, persons, releaseDate);

  return result;
}

async function getTvShowCastAge(id, season, releaseDate) {
  const cast = await getTvShowCast(id, season);
  const uniqueCast = uniqBy(cast, 'id');
  const persons = await getPersons(uniqueCast);
  const result = getCastAge(uniqueCast, persons, releaseDate);

  return result;
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
};
