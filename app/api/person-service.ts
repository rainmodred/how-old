import { z } from 'zod';
import { isBefore } from 'date-fns';
import { Base } from './base';
import { personCache, personCreditsCache } from './cache';

export class PersonService extends Base {
  async getDetails(id: number) {
    const cached = personCache.get(id);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.client.GET('/3/person/{person_id}', {
      params: {
        path: { person_id: id },
      },
    });

    if (error) {
      throw error;
    }

    const result = personDetailsSchema.parse(data);
    personCache.set(id, result);

    return result;
  }
  async getCredits(id: number) {
    const cached = personCreditsCache.get(id);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.client.GET(
      '/3/person/{person_id}/combined_credits',
      { params: { path: { person_id: id.toString() } } },
    );

    if (error) {
      throw error;
    }

    const result = this.transformCredits(data);
    personCreditsCache.set(id, result);

    return result;
  }

  private transformCredits(data: unknown) {
    const result = personCreditsSchema.parse(data);
    return {
      cast: result.cast.map(item => {
        return {
          id: item.id,
          title: item.title,
          media_type: item.media_type,
          release_date: item.release_date,
          poster_path: item.poster_path,
          popularity: item.popularity,
          character: item.character,
        };
      }),
    };
  }
}

//Documentary, Talk, News, Reality
const excludedGenres = new Set([99, 10767, 10763, 10764]);
const excludedTitles = new Set(['Honest Trailers']);
function isAlloved(item: Cast) {
  return (
    !item.genre_ids.some(id => excludedGenres.has(id)) &&
    !excludedTitles.has(item.media_type === 'movie' ? item.title : item.name)
  );
}
function isValidDate(releaseDate: string) {
  return releaseDate && isBefore(releaseDate, new Date());
}
function isValidItem(item: Cast) {
  if (item.media_type === 'movie') {
    return isValidDate(item.release_date) && !item.video && isAlloved(item);
  }
  if (item.media_type === 'tv') {
    return isValidDate(item.first_air_date) && isAlloved(item);
  }
  return false;
}

const personDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  popularity: z.number(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  profile_path: z.string().nullable(),
});
export type PersonDetails = z.infer<typeof personDetailsSchema>;

const castItem = z.union([
  z.object({
    id: z.number(),
    title: z.string(),
    media_type: z.literal('movie'),
    release_date: z.string(),
    poster_path: z.string().nullable(),
    popularity: z.number(),
    character: z.string().nullable(),
    genre_ids: z.array(z.number()),
    video: z.boolean(),
  }),
  z.object({
    id: z.number(),
    name: z.string(),
    media_type: z.literal('tv'),
    first_air_date: z.string(),
    poster_path: z.string().nullable(),
    popularity: z.number(),
    character: z.string().nullable(),
    genre_ids: z.array(z.number()),
  }),
]);
type Cast = z.infer<typeof castItem>;
type Movie = Extract<Cast, { media_type: 'movie' }>;

export const personCreditsSchema = z
  .object({
    id: z.number(),
    cast: z.array(castItem),
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

export type PersonCredits = ReturnType<PersonService['transformCredits']>;
