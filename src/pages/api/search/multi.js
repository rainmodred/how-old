import { searchMulti } from '@/utils/api';

function formatData(data = []) {
  const movies = {
    title: 'Movies',
    items: [],
  };
  const tvShows = {
    title: 'Tv Shows',
    items: [],
  };

  data.forEach(item => {
    if (item.media_type === 'movie' && item.release_date)
      movies.items.push(item);
    if (item.media_type === 'tv' && item.first_air_date)
      tvShows.items.push(item);
  });

  const formattedData = [];
  if (movies.items.length > 0) formattedData.push(movies);
  if (tvShows.items.length > 0) formattedData.push(tvShows);

  return formattedData;
}

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

  return res.json({ results: formatData(data.results) });
}
