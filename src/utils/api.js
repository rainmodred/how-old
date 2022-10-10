import uniqBy from 'lodash.uniqby';

import { calculateCastAge } from './utils';

export const ERRORS = {
  404: {
    statusCode: 404,
    message: 'Not Found',
  },
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

async function client(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');

      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

function getMovieFromAPI(id, releaseDate) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/movie/${id}?releaseDate=${releaseDate}`;
  return client(url);
}

function getTvShowFromAPI(id, season) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/tv/${id}?season=${season}`;
  return client(url);
}

async function searchMulti(query) {
  const url = generateUrl('/search/multi', [{ name: 'query', value: query }]);
  const data = await client(url);

  return data;
}

async function getPerson(id) {
  const url = generateUrl(`/person/${id}`);
  const data = await client(url);

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
  const url = generateUrl(`/movie/${id}/credits`);
  const response = await client(url);

  if (!response) {
    return [];
  }

  const uniqueCast = uniqBy(response.cast, 'id');
  return uniqueCast;
}

async function getSeasons(id) {
  const url = generateUrl(`/tv/${id}`);
  const data = await client(url);
  if (!data || !data.seasons) {
    return [];
  }

  return data.seasons;
}

async function getTvShowCast(id, season) {
  const url = generateUrl(`/tv/${id}/season/${season}/credits`);
  const response = await client(url);
  if (!response) {
    return [];
  }

  const uniqueCast = uniqBy(response?.cast, 'id');
  return uniqueCast;
}

async function getPersonsWithAge(cast, releaseDate) {
  const persons = await getPersons(cast);
  const result = calculateCastAge(cast, persons, releaseDate);

  return result;
}

async function getMovieCastAge(id, releaseDate) {
  const cast = await getMovieCast(id);
  if (cast.length === 0) {
    return {
      error: new Error('NotFound'),
    };
  }

  const personsWithAge = await getPersonsWithAge(cast, releaseDate);
  return {
    cast: personsWithAge,
  };
}

async function getTvShowCastAge(id, season, releaseDate) {
  const cast = await getTvShowCast(id, season);
  if (cast.length === 0) {
    return { error: new Error('NotFound') };
  }

  const personsWithAge = await getPersonsWithAge(cast, releaseDate);
  return {
    cast: personsWithAge,
  };
}

export {
  BASE_URL,
  client,
  searchMulti,
  getPerson,
  getSeasons,
  getTvShowCast,
  getPersons,
  getMovieCastAge,
  getTvShowCastAge,
  getTvShowFromAPI,
  getMovieFromAPI,
};
