import { getMovieCastAge } from '@/utils/api';

export default async function handler(req, res) {
  const { id, releaseDate } = req.query;
  if (!id || !releaseDate) {
    return;
  }

  const data = await getMovieCastAge(id, releaseDate);

  res.json(data);
}
