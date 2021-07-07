import { getTvShowCastAge } from '@/utils/api';

export default async function handler(req, res) {
  const { id, releaseDate, season } = req.query;

  const data = await getTvShowCastAge(id, releaseDate, season);

  res.json(data);
}
