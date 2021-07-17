import { useRouter } from 'next/router';
import Head from 'next/head';
import { Heading, Select } from '@chakra-ui/react';

import Layout from '@/components/Layout';
import { useTvShowCast } from '@/hooks/swr';
import Persons from '@/components/Persons';

export default function TvShow() {
  const router = useRouter();
  const { id, season, title } = router.query;
  const { cast, seasons, isLoading } = useTvShowCast(id, season);

  function handleSelect(e) {
    if (e.target.value !== '') {
      router.push(`/tv/${id}?season=${e.target.value}`);
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <Heading size="lg" mt="6">
          {title}
        </Heading>

        <Select onChange={handleSelect} placeholder="Select season">
          {!isLoading &&
            seasons.map(({ id, season_number, name }) => {
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
    </>
  );
}
