import { useRouter } from 'next/router';
import { Select } from '@chakra-ui/react';

import Layout from '@/components/Layout';
import Person from '@/components/Person';
import { useTvShow, useTvShowCast } from '@/hooks/swr';

function getSeasonAirDate(seasons, season = 1) {
  return seasons?.find(({ season_number }) => season_number === Number(season))
    ?.air_date;
}

export default function TvShow() {
  const router = useRouter();

  const { id, season } = router.query;

  const { tvShow } = useTvShow(id);

  const { cast, isLoading, error } = useTvShowCast(
    id,
    getSeasonAirDate(tvShow?.seasons, season),
    season,
  );

  function handleSelect(e) {
    if (e.target.value !== '') {
      router.push(`/tv/${id}?season=${e.target.value}`);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  const seasons =
    tvShow?.seasons.filter(season => season.season_number > 0) || [];
  return (
    <Layout>
      <Select onChange={handleSelect} placeholder="Select season">
        {seasons.map(({ id, season_number, name }) => {
          if (season_number === Number(season)) {
            return (
              <option key={id} value={season_number} selected>
                {name}
              </option>
            );
          }

          return (
            <option key={id} value={season_number}>
              {name}
            </option>
          );
        })}
      </Select>
      {cast.map(person => (
        <Person key={person.id} person={person} />
      ))}
    </Layout>
  );
}
