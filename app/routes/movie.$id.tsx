import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  MetaFunction,
  defer,
} from '@vercel/remix';
import { Await, useLoaderData } from '@remix-run/react';
import { Persons } from '~/components/Persons';
import {
  CastWithAges,
  getCast,
  getCastWithAges,
  getMovie,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Suspense } from 'react';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }
  const [{ release_date: releaseDate, title }, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);
  const castWithAges = getCastWithAges(cast, releaseDate);

  return defer({ title, releaseDate, cast: castWithAges });
}

export default function MoviePage() {
  const { title, releaseDate, cast } = useLoaderData<typeof loader>();

  return (
    <>
      <Title size="h1" mb="xl">
        {title} ({releaseDate?.slice(0, 4)})
      </Title>
      <Suspense fallback={<SkeletonTable rows={5} />}>
        <Await resolve={cast}>
          {cast => {
            return <Persons cast={cast as CastWithAges} />;
          }}
        </Await>
      </Suspense>
    </>
  );
}
