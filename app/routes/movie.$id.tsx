import { Title } from '@mantine/core';
import {
  Await,
  data,
  HeadersFunction,
  LoaderFunctionArgs,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  MetaFunction,
} from 'react-router';

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
import ItemDetails from '~/components/ItemDetails/ItemDetails';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.movie.title ?? 'Movie' }];
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
  const limit = Number(url.searchParams.get('limit')) || LIMIT;

  const [movie, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);

  const castWithDates = getCastWithDates(cast, {
    offset: 0,
    limit,
  });

  return data(
    {
      movie,
      cast: castWithDates,
      hasMore: limit < cast.length,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function MoviePage() {
  const { movie, cast, hasMore } = useLoaderData<typeof loader>();

  return (
    <>
      <ItemDetails
        title={movie.title}
        genres={movie.genres}
        overview={movie.overview}
        poster_path={movie.poster_path}
        release_date={movie.release_date}
        runtime={movie.runtime}
      />
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
                hasMore={hasMore}
              />
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
