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
  ShouldRevalidateFunctionArgs,
  useLoaderData,
} from '@remix-run/react';
import { Persons } from '~/components/Persons/Persons';
import {
  CastWithDates,
  getCast,
  getCastWithDates,
  getMovie,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';
import MovieDetails from '~/components/MovieDetails/MovieDetails';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (currentParams.id === nextParams.id) {
    return false;
  }

  return defaultShouldRevalidate;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const [movie, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);

  const castWithDates = getCastWithDates(cast, {
    offset: 0,
    limit: offset + LIMIT,
  });

  return defer(
    {
      movie,
      cast: castWithDates,
      done: offset + LIMIT >= cast.length,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function MoviePage() {
  const { movie, cast, done } = useLoaderData<typeof loader>();

  return (
    <>
      <MovieDetails movie={movie} />
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
                initialCast={cast as CastWithDates}
                releaseDate={movie.release_date}
                done={done}
              />
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
