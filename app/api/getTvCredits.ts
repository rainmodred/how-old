import { tvCreditsCache } from '../utils/cache.server';
import { client } from './api';
import { z } from 'zod';

// export type TvSeriesCredits =
//   paths['/3/tv/{series_id}/season/{season_number}/credits']['get']['responses'][200]['content']['application/json'];

export type TvCredits = z.infer<typeof tvCreditsSchema>;

const tvCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(
    z.object({
      id: z.number(),
      character: z.string().nullable(),
    }),
  ),
});

export async function getTvCredits(id: number, seasonNumber: number) {
  const cached = tvCreditsCache.get(id);
  if (cached) {
    return cached;
  }

  const { data, error } = await client.GET(
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
