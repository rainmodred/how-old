import { isBefore } from 'date-fns';
import { personCreditsCache } from '../utils/cache.server';
import { client } from './api';
import { z } from 'zod';
import { movieSearchSchema, tvSearchSchema } from './multiSearch';

// export type PersonCredits =
//   paths['/3/person/{person_id}/combined_credits']['get']['responses'][200]['content']['application/json']['cast'];

export type PersonCredits = z.infer<typeof schema>;

const castSchema = z.union([
  movieSearchSchema.extend({
    character: z.string().nullable(),
  }),
  tvSearchSchema.extend({
    character: z.string().nullable(),
  }),
]);
type Cast = z.infer<typeof castSchema>;
type Movie = Extract<Cast, { media_type: 'movie' }>;

//Documentary, Talk
const excludedGenres = new Set([99, 10767]);

function hasInvalidGenre(item: Cast) {
  return !item.genre_ids.some(id => excludedGenres.has(id));
}

function isValidDate(releaseDate: string) {
  return releaseDate && isBefore(releaseDate, new Date());
}

function isValidItem(item: Cast) {
  if (item.media_type === 'movie') {
    return isValidDate(item.release_date) && !item.video;
  }
  if (item.media_type === 'tv') {
    return isValidDate(item.first_air_date) && hasInvalidGenre(item);
  }
  return false;
}

const schema = z
  .object({
    id: z.number(),
    cast: z.array(castSchema),
  })
  .transform(data => {
    const unique = new Set();
    return {
      ...data,
      cast: data.cast.reduce(
        (accum, current) => {
          if (unique.has(current.id)) {
            return accum;
          }

          if (!isValidItem(current)) {
            return accum;
          }

          unique.add(current.id);

          if (current.media_type === 'movie') {
            accum.push(current);
          } else if (current.media_type === 'tv') {
            accum.push({
              id: current.id,
              title: current.name,
              media_type: 'tv',
              release_date: current.first_air_date,
              popularity: current.popularity,
              poster_path: current.poster_path,
              character: current.character,
              overview: current.overview,
              genre_ids: current.genre_ids,
            });
          }

          return accum;
        },
        [] as (Omit<Movie, 'video' | 'media_type'> & {
          media_type: 'movie' | 'tv';
        })[],
      ),
    };
  });

export type MediaItems = z.infer<typeof schema>['cast'];

export async function getPersonCredits(id: number) {
  const { data, error } = await client.GET(
    '/3/person/{person_id}/combined_credits',
    { params: { path: { person_id: id.toString() } } },
  );

  if (error) {
    throw error;
  }
  return data;
}

export async function getPersonCast(id: number) {
  const cached = personCreditsCache.get(id);
  if (cached) {
    return cached.cast;
  }

  const data = await getPersonCredits(id);

  const result = schema.parse(data);
  personCreditsCache.set(id, result);

  return result.cast;
}
