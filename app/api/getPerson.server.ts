import { paths } from 'schema';
import { personCache } from '../utils/cache.server';
import { client } from './api.server';
import { z } from 'zod';

export type PersonDetails =
  paths['/3/person/{person_id}']['get']['responses'][200]['content']['application/json'];

export type FormattedPersonDetails = z.infer<typeof schema>;

const schema = z.object({
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable(),
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
});

export async function getPerson(id: number) {
  const cached = personCache.get(id);
  if (cached) {
    return cached;
  }

  const { data, error } = await client.GET('/3/person/{person_id}', {
    params: {
      path: { person_id: id },
    },
  });

  if (error) {
    throw error;
  }

  const result = schema.parse(data);
  personCache.set(id, result);

  return result;
}
