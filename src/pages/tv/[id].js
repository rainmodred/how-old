import { useRouter } from 'next/router';
import Head from 'next/head';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { Heading, Select } from '@chakra-ui/react';

import Persons from '@/components/Persons';
import { getTvShowFromAPI } from '@/utils/api';
import NotFound from '../404';

export default function TvShow({ cast, seasons, error }) {
  const router = useRouter();
  const { id, season, title } = router.query;

  if (error) {
    return <NotFound />;
  }

  function handleSelect(e) {
    if (e.target.value !== '') {
      router.push(`/tv/${id}?season=${e.target.value}&title=${title}`);
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Heading size="lg" m="4" textAlign="center">
          {title}
        </Heading>

        <Select
          marginBottom="4"
          onChange={handleSelect}
          placeholder="Select season"
          value={season}
        >
          {!error &&
            seasons?.map(({ id, season_number }) => {
              return (
                <option key={id} value={season_number}>
                  Season {season_number}
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
          <Persons persons={cast} />
        )}
      </>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { id, season, title } = query;
  const { cast, seasons, error } = await getTvShowFromAPI(id, season, title);

  if (error) {
    return {
      props: {
        error,
      },
    };
  }

  return {
    props: {
      cast,
      seasons,
    },
  };
}
