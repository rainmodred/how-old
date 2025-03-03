import { Base } from './base';
import { tvCache, tvCreditsCache } from './cache';
import { tvCreditsSchema, tvDetailsSchema } from './schemas';

export class TvService extends Base {
  async getDetails(id: number) {
    const cached = tvCache.get(id);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.client.GET('/3/tv/{series_id}', {
      params: {
        path: { series_id: id },
      },
    });

    if (error) {
      throw error;
    }

    const result = tvDetailsSchema.parse(data);
    tvCache.set(id, result);
    return result;
  }

  async getCredits(id: number, seasonNumber: number) {
    const cached = tvCreditsCache.get(id);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.client.GET(
      '/3/tv/{series_id}/season/{season_number}/credits',
      {
        params: {
          path: { series_id: id, season_number: seasonNumber },
        },
      },
    );

    if (error) {
      throw error;
    }

    const result = tvCreditsSchema.parse(data);
    tvCreditsCache.set(id, result);

    return result;
  }
}
