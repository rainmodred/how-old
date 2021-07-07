import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function getDiffInYears(date1, date2) {
  return dayjs.duration(dayjs(date1).diff(dayjs(date2))).$d.years;
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

async function getMovieCastAge(id, releaseDate) {
  const { cast } = await getMovieCredits(id);
  const promises = cast.slice(0, 3).map(person => () => getPerson(person.id));
  const result = await Promise.allSettled(promises.map(f => f()));
  const persons = result.map(({ value }) => {
    const { id, name, birthday, profile_path } = value;
    const { character } = cast.find(person => person.id === id);

    return {
      id,
      name,
      character,
      birthday,
      profile_path,
      age: getDiffInYears(dayjs(), birthday).$d.years,
      ageOnRelease: getDiffInYears(dayjs(releaseDate), birthday).$d.years,
    };
  });

  return persons;
}

async function getTvShow(id) {
  const data = await client(`/tv/${id}`);

  return data;
}

async function getTvShowCastAge(id, releaseDate, season) {
  const { cast } = await getTvShowCredits(id, season);

  const promises = cast.slice(0, 3).map(person => () => getPerson(person.id));
  const result = await Promise.allSettled(promises.map(f => f()));
  const persons = result.map(({ value }) => {
    const { id, name, birthday, profile_path } = value;
    const { character } = cast.find(person => person.id === id);

    return {
      id,
      name,
      character,
      birthday,
      profile_path,
      age: getDiffInYears(dayjs(), birthday),
      ageOnRelease: getDiffInYears(dayjs(releaseDate), birthday),
    };
  });

  return persons;
}

export {
  fetcher,
  searchMulti,
  getMovieCastAge,
  getPerson,
  getTvShow,
  getTvShowCastAge,
};
