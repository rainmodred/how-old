import { z } from 'zod';

const movieDetailsSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  imdb_id: z.string().nullable(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
});

const movieCreditsSchema = z
  .object({
    cast: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        popularity: z.number(),
        character: z.string().nullable(),
      }),
    ),
  })
  .transform(data => ({
    ...data,
    cast: data.cast.filter(actor => !actor.character?.includes('uncredited')),
  }));
export type MovieCast = z.infer<typeof movieCreditsSchema>;
