import { ERRORS, getMovieCastAge } from '@/utils/api';

export default async function handler(req, res) {
  const { id, releaseDate } = req.query;

  // updateDB(id, title);

  /*
    without releaseDate query
    /movie/:id

    typeof releaseDate === string && releaseDate === 'undefined'
  */

  if (!id || releaseDate === 'undefined') {
    return res.json({
      error: ERRORS[404],
    });
  }

  const { cast, error } = await getMovieCastAge(id, releaseDate);

  if (error) {
    return res.json({ error: ERRORS[404] });
  }

  return res.json({
    cast,
  });
}
