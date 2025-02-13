import { Flex, Text, Title } from '@mantine/core';
import { type LoaderFunctionArgs, defer, HeadersFunction } from '@vercel/remix';
import {
  NavLink,
  Outlet,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react';
import { getTvDetails } from '~/utils/api.server';

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

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const { name, seasons, first_air_date } = await getTvDetails(Number(id));

  return defer(
    {
      title: name,
      firstAirDate: first_air_date,
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
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function TvPage() {
  const { seasons, title, firstAirDate } = useLoaderData<typeof loader>();
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
        <Title size="h1" order={1}>
          {title} ({firstAirDate?.slice(0, 4)})
        </Title>
        <Outlet />
      </div>
    </div>
  );
}
