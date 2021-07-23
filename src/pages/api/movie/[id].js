import { getMovieCastAge } from '@/utils/api';

export default async function handler(req, res) {
  const { id, releaseDate } = req.query;
  if (!id || !releaseDate) {
    return;
  }

  const result = await getMovieCastAge(id, releaseDate);

  return res.json(result);
}
