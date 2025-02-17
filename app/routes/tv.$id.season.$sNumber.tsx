import { type LoaderFunctionArgs, data, HeadersFunction } from '@vercel/remix';
import {
  Await,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useRouteLoaderData,
} from '@remix-run/react';
import { CastWithDates, getCastWithDates, getTvCast } from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Persons } from '~/components/Persons/Persons';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';
import { loader as tvLoader } from './tv.$id';

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

export default function TvPage() {
  const data = useRouteLoaderData<typeof tvLoader>('routes/tv.$id');

  const { cast, done, seasonNumber } = useLoaderData<typeof loader>();

  const releaseDate = data?.seasons.at(Number(seasonNumber))?.airDate;
  //TODO: do something if releaseDate is unknown

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
