import { Flex, Text } from '@mantine/core';
import {
  data,
  HeadersFunction,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  ShouldRevalidateFunctionArgs,
  useLocation,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router';
import ItemDetails from '~/components/ItemDetails/ItemDetails';
import { Route } from './+types/tv.$id';
import { getTvDetails } from '~/api/getTvDetails';

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

  const details = await getTvDetails(Number(id));

  return data(details, {
    headers: {
      'Cache-Control': 'max-age=86400, public',
    },
  });
}

export default function TvPage({ loaderData }: Route.ComponentProps) {
  const tv = loaderData;
  const [searchParams] = useSearchParams();

  const location = useLocation();

  return (
    <div>
      <ItemDetails
        title={tv.name}
        release_date={tv.first_air_date}
        poster_path={tv.poster_path}
        genres={tv.genres}
        overview={tv.overview}
      />
      <Flex gap="xs" wrap="wrap">
        <Text>Seasons:</Text>
        {tv.seasons.map(season => {
          return (
            <NavLink
              style={({ isActive, isPending }) => {
                return {
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : '',
                  color: isPending ? 'red' : 'inherit',
                };
              }}
              preventScrollReset
              key={season.id}
              relative="path"
              to={`/tv/${location.pathname.split('/')[2]}/season/${season.season_number}?${searchParams.toString()}`}
            >
              {season.season_number}
            </NavLink>
          );
        })}
      </Flex>

      <Outlet />
    </div>
  );
}

export function useTvLoaderData() {
  const data = useRouteLoaderData<typeof loader>('routes/tv.$id');
  if (!data) {
    throw new Error('useTvLoaderData must be used inside tv.$id route');
  }
  return data;
}
