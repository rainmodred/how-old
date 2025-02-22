import { paths } from 'schema';
import { client } from './api.server';
import { z } from 'zod';

export type DiscoverMovies =
  paths['/3/discover/movie']['get']['responses'][200]['content']['application/json']['results'];

const schema = z
  .array(
    z.object({
      id: z.number(),
      title: z.string(),
      release_date: z.string(),
      poster_path: z.string(),
    }),
  )
  .transform(data => data.filter(movie => movie.release_date));

export async function discover() {
  const { data, error } = await client.GET('/3/discover/movie', {
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

  if (!data.results) {
    return [];
  }

  const results = schema.parse(data.results);
  return results;
}
