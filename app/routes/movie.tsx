import { Title } from '@mantine/core';
import { Await, data, MetaFunction, redirect } from 'react-router';
import { Persons } from '~/components/Persons';
import {
  CastWithAges,
  getCast,
  getCastWithAges,
  getMovie,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Suspense } from 'react';
import { Route } from './+types/movie';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect('/');
  }
  const [{ release_date: releaseDate, title }, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);
  const castWithAges = getCastWithAges(cast, releaseDate);

  return data({ title, releaseDate, cast: castWithAges });
}

export default function MoviePage({ loaderData }: Route.ComponentProps) {
  const { title, releaseDate, cast } = loaderData;

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
