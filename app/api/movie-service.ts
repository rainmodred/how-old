import { z } from 'zod';
import { Base } from './base';
import { movieCache, movieCredisCache } from './cache';

export class MovieService extends Base {
  async getDetails(id: number) {
    const cached = movieCache.get(id);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.client.GET('/3/movie/{movie_id}', {
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

  async getCredits(id: number) {
    const cached = movieCredisCache.get(id);
    if (cached) {
      return cached;
    }
    const { data, error } = await this.client.GET(
      '/3/movie/{movie_id}/credits',
      {
        params: {
          path: { movie_id: id },
        },
      },
    );

    if (error) {
      throw error;
    }

    const result = movieCreditsSchema.parse(data);
    movieCredisCache.set(id, result);

    return result;
  }
}

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Genre = z.infer<typeof genreSchema>;

const movieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  genres: z.array(genreSchema),
  // imdb_id: z.string().nullable(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  runtime: z.number(),
});
export type MovieDetails = z.infer<typeof movieDetailsSchema>;

const movieCreditsSchema = z
  .object({
    cast: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        popularity: z.number(),
        character: z.string().nullable(),
      }),
    ),
  })
  .transform(data => ({
    ...data,
    cast: data.cast.filter(actor => !actor.character?.includes('uncredited')),
  }));
export type MovieCredits = z.infer<typeof movieCreditsSchema>;
