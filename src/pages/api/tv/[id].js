import { getTvShow, getTvShowCastAge } from '@/utils/api';

function getSeasonAirDate(seasons, season = 1) {
  return seasons?.find(({ season_number }) => season_number === Number(season))
    ?.air_date;
}

export default async function handler(req, res) {
  const { id, season } = req.query;
  if (!id || !season) {
    return;
  }

  const { seasons } = await getTvShow(id);

  const cast = await getTvShowCastAge(
    id,
    getSeasonAirDate(seasons, season),
    season,
  );

  return res.status(200).json({
    cast,
    seasons: seasons.filter(season => season.season_number > 0),
  });
}
