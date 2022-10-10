import Head from 'next/head';
import { useRouter } from 'next/router';
import { Center, Title, Alert, Loader, Select } from '@mantine/core';

import Persons from '@/components/Persons/Persons';
import { useTvShowCast } from '@/hooks/swr';

export default function TvShow() {
  const router = useRouter();
  const { id, season, title } = router.query;
  const { cast, seasons, error, isLoading } = useTvShowCast(id, season, title);

  function handleSelect(value) {
    router.push(`/tv/${id}?season=${value}&title=${title}`);
  }

  const selectData =
    !isLoading && !error
      ? seasons?.map(({ season_number }) => ({
          value: season_number.toString(),
          label: `Season ${season_number}`,
        }))
      : [];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        {title ? (
          <Title size="h1" my="xs" align="center">
            {title}
          </Title>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}

        <Select
          my="md"
          onChange={handleSelect}
          placeholder="Select season"
          value={season}
          data={selectData}
        />

        {error ? (
          <Alert mt="lg">Something went wrong</Alert>
        ) : (
          <Persons persons={cast} isLoading={isLoading} />
        )}
      </>
    </>
  );
}
