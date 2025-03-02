import { z } from 'zod';
import { movieBaseSchema } from './schemas';
import { Base } from './base';

const discoverMovieSchema = z
  .array(movieBaseSchema)
  .transform(data => data.filter(movie => movie.release_date));

export class DiscoverService extends Base {
  async movie() {
    const { data, error } = await this.client.GET('/3/discover/movie', {
      params: {
        query: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page: 1,
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
    }));
  }
}
