import { z } from 'zod';
import { Base } from './base';

export class SearchService extends Base {
  async multiSearch(query: string, language: string = 'en') {
    const { data, error } = await this.client.GET('/3/search/multi', {
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
}

export const movieSearchSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string(),
  popularity: z.number(),
  media_type: z.literal('movie'),
});

export const tvSearchSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_air_date: z.string(),
  popularity: z.number(),
  media_type: z.literal('tv'),
});

const personSearchSchema = z.object({
  id: z.number(),
  name: z.string(),
  popularity: z.number(),
  media_type: z.literal('person'),
  profile_path: z.string().nullable(),
});

const searchResSchema = z.array(
  z.union([movieSearchSchema, tvSearchSchema, personSearchSchema]),
);

export type SearchMovie = z.infer<typeof movieSearchSchema>;
export type SearchTv = z.infer<typeof tvSearchSchema>;
export type SearchPerson = z.infer<typeof personSearchSchema>;

export type SearchRes = z.infer<typeof searchResSchema>;
