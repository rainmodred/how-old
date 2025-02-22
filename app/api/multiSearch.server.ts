import { client } from './api.server';
import { z } from 'zod';

//TODO: Fixme
// export type SearchMovie =
//   paths['/3/search/movie']['get']['responses'][200]['content']['application/json']['results'];
// export type SearchTv =
//   paths['/3/search/tv']['get']['responses'][200]['content']['application/json']['results'];
// export type SearchPerson =
//   paths['/3/search/person']['get']['responses'][200]['content']['application/json']['results'];

// export type SearchRes = SearchMovie | SearchTv | SearchPerson;

const movieResSchema = z.object({
  id: z.number(),
  title: z.string(),
  media_type: z.literal('movie'),
  release_date: z.string(),
});

const tvResSchema = z.object({
  id: z.number(),
  name: z.string(),
  media_type: z.literal('tv'),
  first_air_date: z.string(),
});

const personResSchema = z.object({
  id: z.number(),
  name: z.string(),
  media_type: z.literal('person'),
  popularity: z.number(),
});

const searchResSchema = z.array(
  z.union([movieResSchema, tvResSchema, personResSchema]),
);

export type SearchMovie = z.infer<typeof movieResSchema>;
export type SearchTv = z.infer<typeof tvResSchema>;
export type SearchPerson = z.infer<typeof personResSchema>;

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
