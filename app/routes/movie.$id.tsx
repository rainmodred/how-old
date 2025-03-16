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
import { SkeletonTable } from '~/components/SkeletonTable';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';
import ItemDetails from '~/components/ItemDetails/ItemDetails';
import { getCastWithDates } from '~/api/getCastWithDates';
import { tmdbApi } from '~/api/tmdbApi';

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

export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const id = Number(params.id);
  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const limit = offset + LIMIT;

  const [movie, { cast }] = await Promise.all([
    tmdbApi.movie.getDetails(id),
    tmdbApi.movie.getCredits(id),
  ]);

  const castWithDates = getCastWithDates(cast.slice(offset, limit));

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
                initialCast={cast}
                releaseDate={movie.release_date}
                hasMore={hasMore}
                key={movie.id}
              />
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}
