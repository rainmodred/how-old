import { searchMulti } from '@/utils/api';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(422).json({ errors: ['query must be provided'] });
  }

  const data = await searchMulti(query);

  if (!data) {
    return res.status(404).json({
      error: {
        message: 'Not found',
      },
    });
  }

  return res.json({ results: data.results });
}
