import { paths } from 'schema';
import { tvCache } from '../utils/cache.server';
import { client } from './api.server';
import { z } from 'zod';

export type TvDetails =
  paths['/3/tv/{series_id}']['get']['responses'][200]['content']['application/json'];

export type FormattedTvDetails = z.infer<typeof schema>;

const schema = z
  .object({
    id: z.number(),
    name: z.string(),
    first_air_date: z.string(),
    overview: z.string(),
    poster_path: z.string(),
    seasons: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        air_date: z.string(),
        season_number: z.number(),
      }),
    ),
    genres: z.array(z.object({ id: z.number(), name: z.string() })),
    // popularity: z.number(),
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

export async function getTvDetails(id: number) {
  const cached = tvCache.get(id);
  if (cached) {
    return cached;
  }

  const { data, error } = await client.GET('/3/tv/{series_id}', {
    params: {
      path: { series_id: id },
    },
  });

  if (error) {
    throw error;
  }

  const result = schema.parse(data);
  tvCache.set(id, result);
  return result;
}
