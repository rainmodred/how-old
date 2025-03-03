import { searchResSchema } from './schemas';
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
