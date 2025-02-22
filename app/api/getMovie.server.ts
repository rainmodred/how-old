import { paths } from 'schema';
import { movieCache } from '../utils/cache.server';
import { client } from './api.server';
import { z } from 'zod';

export type MovieDetails =
  paths['/3/movie/{movie_id}']['get']['responses'][200]['content']['application/json'];
export type Genre = Required<NonNullable<MovieDetails['genres']>[number]>;
export type FormattedMovieDetails = z.infer<typeof schema>;

const schema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  runtime: z.number(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
});

export async function getMovieDetails(id: number) {
  const cached = movieCache.get(id);
  if (cached) {
    return cached;
  }

  const { data, error } = await client.GET('/3/movie/{movie_id}', {
    params: {
      path: { movie_id: id },
    },
  });

  if (error) {
    throw error;
  }

  const result = schema.parse(data);
  movieCache.set(id, result);

  return result;
}
