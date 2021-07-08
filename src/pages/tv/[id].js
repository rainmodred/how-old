import { useRouter } from 'next/router';
import { Heading, Select } from '@chakra-ui/react';

import Layout from '@/components/Layout';
import { useTvShow, useTvShowCast } from '@/hooks/swr';
import Persons from '@/components/Persons';

function getSeasonAirDate(seasons, season = 1) {
  return seasons?.find(({ season_number }) => season_number === Number(season))
    ?.air_date;
}

export default function TvShow() {
  const router = useRouter();

  const { id, season, title } = router.query;

  const { tvShow } = useTvShow(id);

  const { cast, isLoading } = useTvShowCast(
    id,
    getSeasonAirDate(tvShow?.seasons, season),
    season,
  );

  function handleSelect(e) {
    if (e.target.value !== '') {
      router.push(`/tv/${id}?season=${e.target.value}`);
    }
  }

  const seasons =
    tvShow?.seasons.filter(season => season.season_number > 0) || [];

  return (
    <Layout>
      <Heading size="lg" mt="6">
        {title}
      </Heading>

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

      <Persons persons={cast} isLoading={isLoading} />
    </Layout>
  );
}
