import { movieCache } from '../utils/cache.server';
import { client } from './api';
import { z } from 'zod';

// export type MovieDetails =
//   paths['/3/movie/{movie_id}']['get']['responses'][200]['content']['application/json'];
export type Genre = z.infer<typeof genreSchema>;
export type MovieDetails = z.infer<typeof movieDetailsSchema>;

export const genreSchema = z.object({ id: z.number(), name: z.string() });

export const movieBaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  video: z.boolean(),
});

const movieDetailsSchema = movieBaseSchema.extend({
  genres: z.array(genreSchema),
  runtime: z.number(),
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

  const result = movieDetailsSchema.parse(data);
  movieCache.set(id, result);

  return result;
}
