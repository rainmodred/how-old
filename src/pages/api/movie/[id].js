import { getCastAge, getMovieCast, getPersons } from '@/utils/api';

export default async function handler(req, res) {
  const { id, releaseDate } = req.query;
  if (!id || !releaseDate) {
    return;
  }

  const cast = await getMovieCast(id);
  const persons = await getPersons(cast);
  const result = getCastAge(cast, persons, releaseDate);

  return res.json(result);
}
