import {
  Await,
  data,
  redirect,
  ShouldRevalidateFunctionArgs,
} from 'react-router';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Persons } from '~/components/Persons/Persons';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';
import { useTvLoaderData } from './tv.$id';
import { Route } from './+types/tv.$id.season.$sNumber';
import { getCastWithDates } from '~/api/getCastWithDates';
import { tmdbApi } from '~/api/tmdbApi';

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')!,
  };
}

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (
    currentParams.sNumber === nextParams.sNumber &&
    currentParams.id === nextParams.id
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const id = Number(params.id);
  const seasonNumber = Number(params.sNumber);

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const limit = offset + LIMIT;

  const { cast } = await tmdbApi.tv.getCredits(id, seasonNumber);
  const castWithDates = getCastWithDates(cast.slice(offset, limit));

  return data(
    {
      cast: castWithDates,
      seasonNumber,
      hasMore: limit < cast.length,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function TvPage({ loaderData }: Route.ComponentProps) {
  const data = useTvLoaderData();
  const { cast, seasonNumber, hasMore } = loaderData;

  const releaseDate = data?.seasons.find(
    season => season.season_number === seasonNumber,
  )?.air_date;
  if (!releaseDate) {
    throw new Error('releaseDate is missing');
  }

  return (
    <Suspense fallback={<SkeletonTable rows={5} />}>
      <Await resolve={cast}>
        {cast => {
          return (
            <Persons
              initialCast={cast}
              hasMore={hasMore}
              releaseDate={releaseDate}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}
