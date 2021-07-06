import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import Person from '@/components/Person';
import { useMovieCast } from '@/hooks/swr';

export default function Movie() {
  const router = useRouter();
  console.log(router.query);
  const { id, releaseDate } = router.query;

  const { cast, isLoading, error } = useMovieCast(id, releaseDate);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <Layout>
      {cast.map(person => (
        <Person key={person.id} person={person} />
      ))}
    </Layout>
  );
}
