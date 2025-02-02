import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  MetaFunction,
  defer,
  HeadersFunction,
} from '@vercel/remix';
import {
  Await,
  Outlet,
  // ShouldRevalidateFunctionArgs,
  useLoaderData,
} from '@remix-run/react';
import { Persons } from '~/components/Persons';
import {
  CastWithAges,
  getCast,
  getCastWithAges,
  getMovie,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

// export function shouldRevalidate({
//   currentParams,
//   nextParams,
//   defaultShouldRevalidate,
// }: ShouldRevalidateFunctionArgs) {
//   if (currentParams.id === nextParams.id) {
//     return false;
//   }
//
//   return defaultShouldRevalidate;
// }

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const [{ release_date: releaseDate, title }, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);

  const castWithAges = getCastWithAges(cast, releaseDate, {
    offset: 0,
    limit: offset + LIMIT,
  });

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
      <Outlet context={cast} />
      <Suspense fallback={<SkeletonTable rows={5} />}>
        <Await resolve={cast}>
          {cast => {
            if (cast.length === 0) {
              //TODO: Improve me
              return (
                <>
                  <Title size={'lg'}>No results found</Title>
                </>
              );
            }
            return (
              <Persons
                initialCast={cast as CastWithAges}
                releaseDate={releaseDate}
              />
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
