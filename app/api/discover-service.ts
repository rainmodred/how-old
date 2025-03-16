import { z } from 'zod';
import { Base } from './base';

export class DiscoverService extends Base {
  async movie() {
    const { data, error } = await this.client.GET('/3/discover/movie', {
      params: {
        query: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page: 1,
          without_genres: '99',
          'with_runtime.gte': 100,
        },
      },
    });

    if (error) {
      throw new Error(error);
    }

    const results = discoverMovieSchema.parse(data.results);
    return results.map(movie => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      media_type: 'movie' as const,
    }));
  }
}

const discoverMovieSchema = z
  .array(
    z.object({
      id: z.number(),
      title: z.string(),
      release_date: z.string(),
      poster_path: z.string().nullable(),
    }),
  )
  .transform(data => data.filter(movie => movie.release_date));
