import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  MetaFunction,
  defer,
  HeadersFunction,
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

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }
  const [{ release_date: releaseDate, title }, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);
  const castWithAges = getCastWithAges(cast, releaseDate);
  await new Promise(resolve => setTimeout(resolve, 10000));

  return defer(
    { title, releaseDate, cast: castWithAges },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
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
