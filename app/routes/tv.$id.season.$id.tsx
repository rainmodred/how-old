import { Flex, Text, Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  defer,
  HeadersFunction,
} from '@vercel/remix';
import { Await, NavLink, useLoaderData, useLocation } from '@remix-run/react';
import {
  CastWithAges,
  getCastWithAges,
  getTvCast,
  getTvDetails,
} from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';
import { Persons } from '~/components/Persons';
import { Suspense } from 'react';

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tvId = url.pathname.split('/')[2];
  const seasonNumber = params.id;
  if (!seasonNumber || !tvId) {
    throw redirect('/');
  }

  const [{ first_air_date: releaseDate, name, seasons }, cast] =
    await Promise.all([
      getTvDetails(tvId),
      getTvCast(tvId, seasonNumber.toString()),
    ]);
  const castWithAges = getCastWithAges(cast, releaseDate);

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
              to={`/tv/${location.pathname.split('/')[2]}/season/${season.seasonNumber}`}
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
              return <Persons cast={cast as CastWithAges} />;
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
