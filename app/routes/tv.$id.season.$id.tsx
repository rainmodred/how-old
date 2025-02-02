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
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react';
import {
  CastWithAges,
  getCastWithAges,
  getSeasonDetails,
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tvId = url.pathname.split('/')[2];
  const seasonNumber = params.id as string;
  if (!seasonNumber || !tvId) {
    throw redirect('/');
  }

  const offset = Number(url.searchParams.get('offset')) || 0;

  const [{ air_date: releaseDate }, { name, seasons }, cast] =
    await Promise.all([
      getSeasonDetails(tvId, seasonNumber),
      getTvDetails(tvId),
      getTvCast(tvId, seasonNumber),
    ]);
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
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function TvPage() {
  const { seasons, title, cast, releaseDate } = useLoaderData<typeof loader>();
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
                />
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
