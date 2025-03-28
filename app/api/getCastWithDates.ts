import { customFormatDate } from '../utils/dates';
import { tmdbApi } from './tmdbApi';

export type CastWithDates = Awaited<ReturnType<typeof getCastWithDates>>;
export async function getCastWithDates(
  cast: { id: number; character?: string | null }[],
) {
  const promises = cast.map(async actor => {
    const person = await tmdbApi.people.getDetails(actor.id);
    return {
      ...person,
      character: actor.character,
    };
  });

  const result = await Promise.all(promises);

  const castWithDates = result.map(person => {
    return {
      id: person.id,
      name: person.name,
      character: person.character,
      birthday: person.birthday ? customFormatDate(person.birthday) : null,
      deathday:
        typeof person.deathday === 'string'
          ? customFormatDate(person.deathday)
          : null,
      profile_path: person.profile_path,
    };
  });

  return castWithDates;
}
