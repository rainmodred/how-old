import { paths } from 'schema';
import { movieCastCache } from '../utils/cache.server';
import { client } from './api.server';

export type MovieCredits =
  paths['/3/movie/{movie_id}/credits']['get']['responses'][200]['content']['application/json'];

export type MovieCast = NonNullable<MovieCredits['cast']>;

export async function getMovieCredits(id: number) {
  const { data, error } = await client.GET('/3/movie/{movie_id}/credits', {
    params: {
      path: { movie_id: id },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getMovieCast(id: number) {
  const cached = movieCastCache.get(id);
  if (cached) {
    return cached;
  }

  const credits = await getMovieCredits(id);
  if (!credits.cast) {
    throw new Error('Cast is missing');
  }

  const filteredCast = credits.cast.filter(
    actor =>
      actor.known_for_department === 'Acting' &&
      !actor.character?.includes('uncredited'),
  );

  movieCastCache.set(id, filteredCast);
  return filteredCast;
}
