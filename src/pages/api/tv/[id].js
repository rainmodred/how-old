import { getCastAge, getPersons, getTvShow, getTvShowCast } from '@/utils/api';

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

  const cast = await getTvShowCast(id, season);
  const persons = await getPersons(cast);
  const result = getCastAge(cast, persons, getSeasonAirDate(seasons, season));

  return res.status(200).json({
    cast: result,
    seasons: seasons.filter(
      season => season.season_number > 0 && season.air_date,
    ),
  });
}
