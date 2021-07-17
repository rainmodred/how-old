import { useRouter } from 'next/router';
import Head from 'next/head';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { Heading, Select } from '@chakra-ui/react';

import Layout from '@/components/Layout';
import { useTvShowCast } from '@/hooks/swr';
import Persons from '@/components/Persons';

export default function TvShow() {
  const router = useRouter();
  const { id, season, title } = router.query;
  const { cast, seasons, isLoading, error } = useTvShowCast(id, season);

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
        <Heading size="lg" m="4" textAlign="center">
          {title}
        </Heading>

        <Select
          onChange={handleSelect}
          placeholder="Select season"
          value={season}
        >
          {!isLoading &&
            seasons?.map(({ id, season_number, name }) => {
              return (
                <option key={id} value={season_number}>
                  {name}
                </option>
              );
            })}
        </Select>

        {error ? (
          <Alert status="error">
            <AlertIcon />
            Something went wrong
          </Alert>
        ) : (
          <Persons persons={cast} isLoading={isLoading} />
        )}
      </Layout>
    </>
  );
}
