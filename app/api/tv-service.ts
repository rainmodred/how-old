import { z } from 'zod';
import { Base } from './base';
import { tvCache, tvCreditsCache } from './cache';

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

const tvDetailsSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    first_air_date: z.string(),
    overview: z.string(),
    poster_path: z.string().nullable(),
    popularity: z.number(),
    seasons: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        air_date: z.string().nullable(),
        season_number: z.number(),
      }),
    ),
    genres: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    number_of_seasons: z.number(),
  })
  .transform(data => {
    return {
      ...data,
      seasons: data.seasons.filter(
        season => season.air_date && season.season_number > 0,
      ),
    };
  });

export type TvDetails = z.infer<typeof tvDetailsSchema>;

const tvCreditsSchema = z.object({
  id: z.number(),

  cast: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      popularity: z.number(),
      character: z.string().nullable(),
    }),
  ),
});
export type TvCredits = z.infer<typeof tvCreditsSchema>;
