import { isBefore } from 'date-fns';
import { z } from 'zod';

//TODO: impove me
const genreSchema = z.object({ id: z.number(), name: z.string() });
export type Genre = z.infer<typeof genreSchema>;

const movieBaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  video: z.boolean(),
});

export const movieDetailsSchema = movieBaseSchema.extend({
  genres: z.array(genreSchema),
  runtime: z.number(),
});

export type MovieDetails = z.infer<typeof movieDetailsSchema>;

export const discoverMovieSchema = z
  .array(movieBaseSchema)
  .transform(data => data.filter(movie => movie.release_date));

const personBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  popularity: z.number(),
});

export const castSchema = z.array(
  personBaseSchema.extend({
    character: z.string().nullable(),
  }),
);

export const movieCreditsSchema = z
  .object({
    cast: castSchema,
  })
  .transform(data => ({
    ...data,
    cast: data.cast.filter(actor => !actor.character?.includes('uncredited')),
  }));
export type MovieCast = z.infer<typeof movieCreditsSchema>;

export const personDetailsSchema = personBaseSchema.extend({
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  profile_path: z.string().nullable(),
  known_for_department: z.string(),
});

export const movieSearchSchema = movieBaseSchema.extend({
  media_type: z.literal('movie'),
  genre_ids: z.array(z.number()),
});

const tvBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_air_date: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  popularity: z.number(),
});

export const tvSearchSchema = tvBaseSchema.extend({
  media_type: z.literal('tv'),
  genre_ids: z.array(z.number()),
});
const personSearchSchema = personBaseSchema.extend({
  media_type: z.literal('person'),
  profile_path: z.string().nullable(),
  known_for_department: z.string(),
});
export const searchResSchema = z.array(
  z.union([movieSearchSchema, tvSearchSchema, personSearchSchema]),
);

export type SearchMovie = z.infer<typeof movieSearchSchema>;
export type SearchTv = z.infer<typeof tvSearchSchema>;
export type SearchPerson = z.infer<typeof personSearchSchema>;

export type SearchRes = z.infer<typeof searchResSchema>;
export type PersonDetails = z.infer<typeof personDetailsSchema>;

const personCastItem = z.union([
  movieSearchSchema.extend({
    character: z.string().nullable(),
  }),
  tvSearchSchema.extend({
    character: z.string().nullable(),
  }),
]);
type Cast = z.infer<typeof personCastItem>;
type Movie = Extract<Cast, { media_type: 'movie' }>;
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
export const creditsSchema = z
  .object({
    id: z.number(),
    cast: z.array(personCastItem),
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

export type PersonCredits = z.infer<typeof creditsSchema>;
export type PersonCast = z.infer<typeof creditsSchema>['cast'];
export type TvDetails = z.infer<typeof tvDetailsSchema>;

export const tvDetailsSchema = tvBaseSchema
  .extend({
    seasons: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        air_date: z.string().nullable(),
        season_number: z.number(),
      }),
    ),
    genres: z.array(genreSchema),
    popularity: z.number(),
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

export type TvCredits = z.infer<typeof tvCreditsSchema>;
export const tvCreditsSchema = z.object({
  id: z.number(),
  cast: castSchema,
});
