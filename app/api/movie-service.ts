import { Base } from './base';
import { movieCache, movieCredisCache } from './cache';
import { movieDetailsSchema, movieCreditsSchema } from './schemas';

export class MoviesService extends Base {
  private transformDetails(data: unknown) {
    const result = movieDetailsSchema.parse(data);
    return result;
  }

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

class Cache {
  constructor() {
    this.api = new Api();
    this.cache = new Cache();
  }

  getData() {
    if (cache.has) {
      return cache.get(id);
    }
    return api.getData();
  }
}

class Api {
  getData() {
    //
    return {
      id: 1,
    };
  }
}
