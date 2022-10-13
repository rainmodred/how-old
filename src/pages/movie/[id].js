import { useRouter } from 'next/router';
import Head from 'next/head';
import { Center, Title, Alert, Loader } from '@mantine/core';

import Persons from '@/components/Persons/Persons';
import { useMovieCast } from '@/hooks/swr';

export default function Movie() {
  const router = useRouter();

  const { id, releaseDate, title } = router.query;
  const { cast, error, isLoading } = useMovieCast(id, releaseDate, title);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        {title ? (
          <Title size="h1" my="xs" align="center">
            {title} ({releaseDate?.slice(0, 4)})
          </Title>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}

        {error ? (
          <Alert mt="lg">Something went wrong</Alert>
        ) : (
          <Persons persons={cast} isLoading={isLoading} />
        )}
      </>
    </>
  );
}
