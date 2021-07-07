import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import Actor from '@/components/Actor';

export default function Movie() {
  const router = useRouter();

  const { id } = router.query;

  return (
    <Layout>
      <Actor />
    </Layout>
  );
}
