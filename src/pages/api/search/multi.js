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

  const { results } = data;

  let formattedData = [];
  if (results) {
    const movies = results.filter(result => result.media_type === 'movie');
    const tvShows = results.filter(result => result.media_type === 'tv');

    formattedData = [
      {
        title: 'Movies',
        items: movies,
      },
      {
        title: 'TV Shows',
        items: tvShows,
      },
    ];

    if (movies.length === 0 && tvShows.length === 0) {
      formattedData = [];
    }
  }

  return res.json({ results: formattedData });
}
