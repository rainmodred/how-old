import { ERRORS, getSeasons, getTvShowCastAge } from '@/utils/api';

function getSeasonAirDate(seasons, season = 1) {
  return seasons?.find(({ season_number }) => season_number === Number(season))
    ?.air_date;
}

export default async function handler(req, res) {
  const { id, season } = req.query;
  if (!id || season === 'undefined') {
    return res.json({
      error: ERRORS[404],
    });
  }

  const seasons = await getSeasons(id);
  const { cast, error } = await getTvShowCastAge(
    id,
    season,
    getSeasonAirDate(seasons, season),
  );

  if (error || seasons.length === 0) {
    return res.json({
      error: ERRORS[404],
    });
  }

  return res.status(200).json({
    cast,
    seasons: seasons.filter(
      season => season.season_number > 0 && season.air_date,
    ),
  });
}
