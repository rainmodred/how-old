import { movieCredisCache } from '../utils/cache.server';
import { client } from './api';
import { z } from 'zod';
import { personBaseSchema } from './getPerson';

// export type MovieCredits =
//   paths['/3/movie/{movie_id}/credits']['get']['responses'][200]['content']['application/json'];

// export type MovieCast = NonNullable<MovieCredits['cast']>;

export const castSchema = personBaseSchema.extend({
  character: z.string().nullable(),
});

export type MovieCast = z.infer<typeof movieCreditsSchema>;

const movieCreditsSchema = z
  .object({
    cast: z.array(castSchema),
  })
  .transform(data => ({
    ...data,
    cast: data.cast.filter(actor => !actor.character?.includes('uncredited')),
  }));

export async function getMovieCredits(id: number) {
  const cached = movieCredisCache.get(id);
  if (cached) {
    return cached;
  }
  const { data, error } = await client.GET('/3/movie/{movie_id}/credits', {
    params: {
      path: { movie_id: id },
    },
  });

  if (error) {
    throw error;
  }

  const result = movieCreditsSchema.parse(data);
  movieCredisCache.set(id, result);

  return result;
}
