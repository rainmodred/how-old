import { isBefore, sub } from 'date-fns';
import { customFormatDate } from './dates';
import { API_URL, LIMIT } from './constants';
import { cache } from './cache.server';
import {
  Actor,
  SeasonDetails,
  Person,
  Movie,
  TvDetails,
  MovieRes,
  PersonRes,
  SearchRes,
  TvRes,
} from './types';

const token = process.env.API_TOKEN;
if (!token) {
  throw new Error('token is missing');
}

async function fetcher<T>(
  endpoint: string,
  {
    data,
    headers: customHeaders,
    ...customConfig
  }: { data?: unknown } & RequestInit = {},
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }

    console.log('reject', data);
    return Promise.reject(data);
  } catch (error) {
    console.error('API REJECT', error);
    return Promise.reject(error);
  }
}

export async function multiSearch(query: string, language: string = 'en') {
  const params = new URLSearchParams({ query, language });
  const data = await fetcher<{
    page: number;
    results: SearchRes[];
  }>(`/search/multi?${params.toString()}`);

  return {
    page: data.page,
    results: data.results.map(item => {
      if (item.media_type === 'person') {
        return {
          id: item.id,
          name: item.name,
          media_type: item.media_type,
        } as PersonRes;
      }

      if (item.media_type === 'movie') {
        return {
          id: item.id,
          title: item.title,
          media_type: item.media_type,
          release_date: item.release_date,
        } as MovieRes;
      }

      if (item.media_type === 'tv') {
        return {
          id: item.id,
          name: item.name,
          media_type: item.media_type,
          first_air_date: item.first_air_date,
        } as TvRes;
      }
      return item;
    }),
  };
}

export type CastWithDates = Awaited<ReturnType<typeof getCastWithDates>>;
export async function getCastWithDates(
  cast: Actor[],
  { offset, limit = LIMIT }: { offset: number; limit?: number },
) {
  const promises = cast.slice(offset, limit).map(async actor => {
    const person = await getPerson(actor.id);
    return {
      ...person,
      character: actor.character,
    };
  });

  const result = await Promise.all(promises);

  const castWithDates = result.map(person => {
    return {
      id: person.id,
      name: person.name,
      character: person.character,
      birthday: person.birthday ? customFormatDate(person.birthday) : null,
      deathday: person.deathday && customFormatDate(person.deathday),
      profile_path: person.profile_path,
    };
  });

  return castWithDates;
}

export async function getCast(id: string) {
  const path = `/movie/${id}/credits`;

  if (cache.has(path)) {
    return cache.get(path) as Actor[];
  }

  const { cast } = await fetcher<{ cast: Actor[] }>(path);
  const filteredCast = cast.filter(
    actor =>
      actor.known_for_department === 'Acting' &&
      !actor.character.includes('uncredited'),
  );

  cache.set(path, filteredCast);

  return filteredCast;
}

export async function getTvCast(id: string, season: string) {
  const path = `/tv/${id}/season/${season}/credits`;

  if (cache.has(path)) {
    return cache.get(path) as Actor[];
  }

  const { cast } = await fetcher<{ cast: Actor[] }>(path);
  cache.set(path, cast);

  return cast;
}

//TODO: useless?
export async function getSeasonDetails(id: string, season: string) {
  const path = `/tv/${id}/season/${season}`;
  if (cache.has(path)) {
    return cache.get(path) as SeasonDetails;
  }

  const details = await fetcher<SeasonDetails>(path);
  cache.set(path, details);
  return details;
}

function formatPerson(person: Person) {
  return {
    id: person.id,
    name: person.name,
    profile_path: person.profile_path,
    birthday: person.birthday,
    deathday: person.deathday,
    place_of_birth: person.place_of_birth,
  };
}
export async function getPerson(id: number) {
  const path = `/person/${id}`;
  if (cache.has(path)) {
    return cache.get(path) as Person;
  }

  const personData = await fetcher<Person>(path);
  const person = formatPerson(personData);
  cache.set(path, person);

  return person;
}

export async function getPersonMovies(id: number) {
  //TODO:
  //https://api.themoviedb.org/3/person/{person_id}/combined_credits

  const path = `/person/${id}/movie_credits`;
  if (cache.has(path)) {
    return cache.get(path) as Movie[];
  }

  const { cast } = await fetcher<{ cast: Movie[] }>(path);
  const filteredMovies = cast.filter(
    m => m.release_date && isBefore(m.release_date, new Date()) && !m.video,
  );
  cache.set(path, filteredMovies);

  return filteredMovies;
}

function formatTvDetails(data: TvDetails) {
  return {
    id: data.id,
    name: data.name,
    first_air_date: data.first_air_date,
    last_air_date: data.last_air_date,
    overview: data.overview,
    poster_path: data.poster_path,
    seasons: data.seasons,
    genres: data.genres,
    popularity: data.popularity,
    number_of_seasons: data.number_of_seasons,
    number_of_episodes: data.number_of_episodes,
  };
}

export async function getTvDetails(id: number | string): Promise<TvDetails> {
  const path = `/tv/${id}`;
  if (cache.has(path)) {
    return cache.get(path) as TvDetails;
  }

  const data = await fetcher<TvDetails>(path);
  const details = formatTvDetails(data);
  cache.set(path, details);

  return details;
}

export async function discover() {
  const vote_count = 1000;
  const prevYear = sub(new Date(), { years: 1 });
  const data = await fetcher<{
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }>(
    `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.lte=${prevYear}&sort_by=vote_count.desc&without_genres=16&vote_count.gte=${vote_count}`,
  );

  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
  }));
}

function formatMovie(movie: Movie) {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    video: movie.video,
    genres: movie.genres,
    runtime: movie.runtime,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
  };
}

export async function getMovie(id: string): Promise<Movie> {
  const path = `/movie/${id}`;
  if (cache.has(path)) {
    return cache.get(path) as Movie;
  }

  const movieData = await fetcher<Movie>(path);
  const movie = formatMovie(movieData);
  cache.set(path, movie);
  return movie;
}
