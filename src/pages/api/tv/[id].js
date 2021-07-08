import { getTvShow } from '@/utils/api';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return;
  }

  const data = await getTvShow(id);

  return res.status(200).json(data);
}
