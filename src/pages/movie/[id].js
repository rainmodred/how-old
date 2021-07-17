import { useRouter } from 'next/router';
import Head from 'next/head';
import { Alert, AlertIcon } from '@chakra-ui/react';

import Layout from '@/components/Layout';
import Persons from '@/components/Persons';
import { useMovieCast } from '@/hooks/swr';
import { Heading } from '@chakra-ui/react';

export default function Movie() {
  const router = useRouter();
  const { id, releaseDate, title } = router.query;
  const { cast, isLoading, error } = useMovieCast(id, releaseDate);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <Heading size="lg" mt="4">
          {title} ({releaseDate?.slice(0, 4)})
        </Heading>
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
