import { Flex, Text, Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  defer,
  HeadersFunction,
} from '@vercel/remix';
import {
  Await,
  NavLink,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react';
import {
  CastWithAges,
  getCastWithAges,
  getTvCast,
  getTvDetails,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Persons } from '~/components/Persons';
import { Suspense } from 'react';
import { LIMIT } from '~/utils/constants';

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tvId = url.pathname.split('/')[2];
  const seasonNumber = params.id as string;
  if (!seasonNumber || !tvId) {
    throw redirect('/');
  }

  const offset = Number(url.searchParams.get('offset')) || 0;

  const [{ name, seasons }, cast] = await Promise.all([
    getTvDetails(tvId),
    getTvCast(tvId, seasonNumber),
  ]);

  const releaseDate = seasons.find(
    season => season.season_number === Number(seasonNumber),
  )?.air_date;

  //TODO: What if air_date is undefined?
  if (!releaseDate) {
    throw new Error('meow');
  }
  const castWithAges = getCastWithAges(cast, releaseDate, {
    offset: 0,
    limit: offset + LIMIT,
  });

  return defer(
    {
      title: name,
      seasons: seasons
        .filter(season => season.air_date && season.season_number > 0)
        .map(season => {
          return {
            airDate: season.air_date,
            id: season.id,
            name: season.name,
            posterPath: season.poster_path,
            seasonNumber: season.season_number,
          };
        }),
      cast: castWithAges,
      releaseDate,
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
  const { seasons, title, cast, releaseDate, done } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const location = useLocation();

  return (
    <div>
      <Flex gap="xs" wrap="wrap">
        <Text>Seasons:</Text>
        {seasons.map(season => {
          return (
            <NavLink
              style={({ isActive, isPending }) => {
                return {
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : '',
                  color: isPending ? 'red' : 'inherit',
                };
              }}
              key={season.id}
              relative="path"
              to={`/tv/${location.pathname.split('/')[2]}/season/${season.seasonNumber}?${searchParams.toString()}`}
            >
              {season.seasonNumber}
            </NavLink>
          );
        })}
      </Flex>
      <div>
        <Title size="h1" order={3}>
          {title} ({releaseDate?.slice(0, 4)})
        </Title>
        <Suspense fallback={<SkeletonTable rows={5} />}>
          <Await resolve={cast}>
            {cast => {
              return (
                <Persons
                  initialCast={cast as CastWithAges}
                  releaseDate={releaseDate}
                  done={done}
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
