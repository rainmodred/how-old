import { isBefore } from 'date-fns';
import { personCreditsCache } from '../utils/cache.server';
import { client } from './api.server';
import { paths } from 'schema';
import { z } from 'zod';

export type PersonCredits =
  paths['/3/person/{person_id}/movie_credits']['get']['responses'][200]['content']['application/json']['cast'];

export type FormattedPersonCredits = z.infer<typeof schema>;

const castSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  poster_path: z.string().nullable(),
  popularity: z.number(),
  video: z.boolean(),
});
type Cast = z.infer<typeof castSchema>;

const schema = z
  .object({
    id: z.number(),
    cast: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        release_date: z.string(),
        poster_path: z.string().nullable(),
        popularity: z.number(),
        video: z.boolean(),
      }),
    ),
  })
  .transform(data => {
    const unique = new Set();
    return {
      ...data,
      cast: data.cast
        .filter(
          movie =>
            movie.release_date &&
            isBefore(movie.release_date, new Date()) &&
            !movie.video,
        )
        .reduce((accum, current) => {
          if (unique.has(current.id)) {
            return accum;
          }

          unique.add(current.id);
          accum.push(current);

          return accum;
        }, [] as Cast[]),
    };
  });

export async function getPersonCredits(id: number) {
  //TODO:
  //https://api.themoviedb.org/3/person/{person_id}/combined_credits

  const { data, error } = await client.GET(
    '/3/person/{person_id}/movie_credits',
    { params: { path: { person_id: id } } },
  );

  if (error) {
    throw error;
  }
  return data;
}

export async function getPersonCast(id: number) {
  const cached = personCreditsCache.get(id);
  if (cached) {
    return cached;
  }
  const data = await getPersonCredits(id);

  const result = schema.parse(data);
  personCreditsCache.set(id, result);

  return result;
}
