import { Base } from './base';
import { personCache, personCreditsCache } from './cache';
import { personDetailsSchema, creditsSchema } from './schemas';

export class PeopleService extends Base {
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

    const result = creditsSchema.parse(data);
    personCreditsCache.set(id, result);

    return data;
  }
}
