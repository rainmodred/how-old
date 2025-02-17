import { Grid, Group, Skeleton } from '@mantine/core';
import {
  Await,
  data,
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
} from 'react-router';
import { getPerson, getPersonMovies } from '~/utils/api.server';
import { Movie } from '~/utils/types';
import { Suspense } from 'react';
import PersonCard from '~/components/PersonCard/PersonCard';
import { MoviesSkeleton } from '~/components/MoviesSkeleton/MoviesSkeleton';
import { MoviesGrid } from '~/components/MoviesGrid';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.person.name ?? 'Person' }];
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

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const id = Number(params.id);

  const movies = getPersonMovies(id);
  const person = await getPerson(id);

  return data(
    { person, movies },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function PersonPage() {
  const { person, movies } = useLoaderData<typeof loader>();

  return (
    <Grid gutter={'md'}>
      <Grid.Col span={12}>
        <PersonCard person={person} />
      </Grid.Col>

      <Suspense
        fallback={
          <>
            <Grid.Col data-testid="skeleton" span={12}>
              <Group justify="space-between">
                <Skeleton height={36} width={156} />
                <Skeleton height={36} width={167} />
              </Group>
            </Grid.Col>
            <MoviesSkeleton />
          </>
        }
      >
        <Await resolve={movies}>
          {movies => {
            const unique = new Set();
            const uniqueMovies = movies.reduce((accum, current) => {
              if (unique.has(current.id)) {
                return accum;
              }

              unique.add(current.id);
              accum.push(current);

              return accum;
            }, [] as Movie[]);

            return <MoviesGrid movies={uniqueMovies} person={person} />;
          }}
        </Await>
      </Suspense>
    </Grid>
  );
}
