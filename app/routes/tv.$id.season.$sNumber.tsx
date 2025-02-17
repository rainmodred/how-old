import {
  Await,
  data,
  HeadersFunction,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs,
} from 'react-router';
import { CastWithDates, getCastWithDates, getTvCast } from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Persons } from '~/components/Persons/Persons';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';
import { useTvLoaderData } from './tv.$id';
import { Route } from './+types/tv.$id.season.$sNumber';

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export function shouldRevalidate({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (currentParams.sNumber === nextParams.sNumber) {
    return false;
  }

  return defaultShouldRevalidate;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const { id, sNumber: seasonNumber } = params;
  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getTvCast(id!, seasonNumber!);
  const castWithDates = getCastWithDates(cast, {
    offset: 0,
    limit: offset + LIMIT,
  });

  return data(
    {
      cast: castWithDates,
      seasonNumber,
      done: offset + LIMIT >= cast.length,
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
  const { cast, done, seasonNumber } = loaderData;

  const releaseDate = data?.seasons.at(Number(seasonNumber))?.airDate;
  if (!releaseDate) {
    throw new Error('releaseDate is missing');
  }

  return (
    <Suspense fallback={<SkeletonTable rows={5} />}>
      <Await resolve={cast}>
        {cast => {
          return (
            <Persons
              initialCast={cast as CastWithDates}
              releaseDate={releaseDate}
              done={done}
            />
          );
        }}
      </Await>
    </Suspense>
  );
}
