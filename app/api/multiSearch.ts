import { client } from './api';
import { z } from 'zod';
import { movieBaseSchema } from './getMovieDetails';
import { tvBaseSchema } from './getTvDetails';
import { personBaseSchema } from './getPerson';

//TODO: Fixme
// export type SearchMovie =
//   paths['/3/search/movie']['get']['responses'][200]['content']['application/json']['results'];
// export type SearchTv =
//   paths['/3/search/tv']['get']['responses'][200]['content']['application/json']['results'];
// export type SearchPerson =
//   paths['/3/search/person']['get']['responses'][200]['content']['application/json']['results'];

// export type SearchRes = SearchMovie | SearchTv | SearchPerson;

export const movieSearchSchema = movieBaseSchema.extend({
  media_type: z.literal('movie'),
  genre_ids: z.array(z.number()),
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

const searchResSchema = z.array(
  z.union([movieSearchSchema, tvSearchSchema, personSearchSchema]),
);

export type SearchMovie = z.infer<typeof movieSearchSchema>;
export type SearchTv = z.infer<typeof tvSearchSchema>;
export type SearchPerson = z.infer<typeof personSearchSchema>;

export type SearchRes = z.infer<typeof searchResSchema>;

export async function multiSearch(query: string, language: string = 'en') {
  const { data, error } = await client.GET('/3/search/multi', {
    params: {
      query: {
        query,
        language,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.results) {
    return {
      page: data.page,
      results: [],
    };
  }
  const results = searchResSchema.parse(data.results);

  return {
    page: data.page,
    results,
  };
}
