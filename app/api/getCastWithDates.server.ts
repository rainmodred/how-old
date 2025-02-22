import { LIMIT } from '../utils/constants';
import { customFormatDate } from '../utils/dates';
import { getPerson } from './getPerson.server';

export type CastWithDates = Awaited<ReturnType<typeof getCastWithDates>>;
export async function getCastWithDates(
  cast: { id: number; character?: string | null }[],
  { offset, limit = LIMIT }: { offset: number; limit?: number },
) {
  const promises = cast.slice(offset, limit).map(async actor => {
    const person = await getPerson(actor.id);
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
