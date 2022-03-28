import { useRouter } from 'next/router';
import Head from 'next/head';
import { Alert, AlertIcon } from '@chakra-ui/react';

import Persons from '@/components/Persons';

import { Heading } from '@chakra-ui/react';
import { getMovieFromAPI, updateDB } from '@/utils/api';
import NotFound from '../404';

export default function Movie({ cast, error }) {
  const router = useRouter();
  const { releaseDate, title } = router.query;

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Heading size="lg" m="4" mb="8" textAlign="center">
          {title} ({releaseDate?.slice(0, 4)})
        </Heading>
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
  const { id, releaseDate, title } = query;
  const response = await getMovieFromAPI(id, releaseDate, title);
  updateDB(id, title);
  const { cast, error } = response;
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
    },
  };
}
