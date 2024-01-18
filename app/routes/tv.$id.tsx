import { Flex, Text } from '@mantine/core';
import { redirect, type LoaderFunctionArgs, json } from '@vercel/remix';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Outlet } from 'react-router-dom';
import { getTvDetails } from '~/utils/api.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const tvId = url.pathname.split('/')[2];
  if (!tvId) {
    throw redirect('/');
  }

  const { seasons, name } = await getTvDetails(tvId);

  return json(
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
    },
    {
      headers: {
        'cache-control': 'max-age=86400',
      },
    },
  );
}

export default function TvPage() {
  const { seasons, title } = useLoaderData<typeof loader>();

  return (
    <div>
      <Flex gap="xs" wrap="wrap">
        <Text>Seasons:</Text>
        {seasons.map(season => {
          const params = new URLSearchParams({
            title,
            release_date: season.airDate!,
          });
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
              to={`./season/${season.seasonNumber}?${params.toString()}`}
            >
              {season.seasonNumber}
            </NavLink>
          );
        })}
      </Flex>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
