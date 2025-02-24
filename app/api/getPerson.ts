import { personCache } from '../utils/cache.server';
import { client } from './api';
import { z } from 'zod';

// export type PersonDetails =
//   paths['/3/person/{person_id}']['get']['responses'][200]['content']['application/json'];

export type PersonDetails = z.infer<typeof personDetailsSchema>;

export const personBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  popularity: z.number(),
});

export const personDetailsSchema = personBaseSchema.extend({
  birthday: z.string().nullable(),
  deathday: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  profile_path: z.string().nullable(),
  known_for_department: z.string(),
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

  const result = personDetailsSchema.parse(data);
  personCache.set(id, result);

  return result;
}
