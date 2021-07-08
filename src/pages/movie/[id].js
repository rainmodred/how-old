import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import Persons from '@/components/Persons';
import { useMovieCast } from '@/hooks/swr';
import { Heading } from '@chakra-ui/react';

export default function Movie() {
  const router = useRouter();
  const { id, releaseDate, title } = router.query;

  const { cast, isLoading, error } = useMovieCast(id, releaseDate);

  return (
    <Layout>
      <Heading size="lg" mt="4">
        {title} ({releaseDate?.slice(0, 4)})
      </Heading>
      <Persons persons={cast} isLoading={isLoading} />
    </Layout>
  );
}
