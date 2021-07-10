import { useRouter } from 'next/router';
import Head from 'next/head';

import Layout from '@/components/Layout';
import Persons from '@/components/Persons';
import { useMovieCast } from '@/hooks/swr';
import { Heading } from '@chakra-ui/react';

export default function Movie() {
  const router = useRouter();
  const { id, releaseDate, title } = router.query;

  const { cast, isLoading } = useMovieCast(id, releaseDate);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <Heading size="lg" mt="4">
          {title} ({releaseDate?.slice(0, 4)})
        </Heading>
        <Persons persons={cast} isLoading={isLoading} />
      </Layout>
    </>
  );
}
