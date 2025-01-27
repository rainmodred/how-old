import {
  ComboboxItem,
  Grid,
  Group,
  Select,
  Skeleton,
  Title,
} from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  MetaFunction,
  defer,
  HeadersFunction,
} from '@vercel/remix';
import { Await, useLoaderData } from '@remix-run/react';
import { getPerson, getPersonMovies, Movie } from '~/utils/api.server';
import { Suspense, useState } from 'react';
import { MovieCard } from '~/components/MovieCard';
import PersonCard from '~/components/PersonCard/PersonCard';
import { formatDiff } from '~/utils/dates';
import { MoviesSkeleton } from '~/components/MoviesSkeleton/MoviesSkeleton';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const id = Number(params.id);

  const movies = getPersonMovies(id);
  const person = await getPerson(id);

  return defer(
    { person, movies },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

const items = [
  { value: 'Popularity', label: 'Popularity' },
  { value: 'Release Date', label: 'Release Date' },
];

export default function PersonPage() {
  const { person, movies } = useLoaderData<typeof loader>();
  const [sort, setSort] = useState<ComboboxItem | null>(items[0]);

  return (
    <Grid gutter={'md'}>
      <Grid.Col span={12}>
        <PersonCard person={person} />
      </Grid.Col>

      <Suspense
        fallback={
          <>
            <Grid.Col span={12}>
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
            return (
              <>
                <Grid.Col span={12}>
                  <Group justify="space-between">
                    <Title order={2}>Filmography</Title>
                    <Select
                      value={sort ? sort.value : null}
                      onChange={(_value, option) => {
                        option && setSort(option);
                      }}
                      placeholder="sort by..."
                      data={items}
                    />
                  </Group>
                </Grid.Col>

                {movies
                  .reduce((accum, current) => {
                    //Remove duplicated movies
                    if (unique.has(current.id)) {
                      return accum;
                    }

                    unique.add(current.id);
                    accum.push(current);

                    return accum;
                  }, [] as Movie[])
                  .sort((a, b) => {
                    if (sort?.value === 'Popularity') {
                      return b.popularity - a.popularity;
                    } else if (sort?.value === 'Release Date') {
                      return (
                        new Date(a.release_date).getTime() -
                        new Date(b.release_date).getTime()
                      );
                    }
                    throw new Error('invalid sort');
                  })
                  .map(movie => {
                    const text = `${formatDiff(person.birthday, movie.release_date)} old`;
                    return (
                      <Grid.Col key={movie.id} span={{ base: 6, md: 4, lg: 3 }}>
                        <MovieCard movie={movie} text={text} key={movie.id} />
                      </Grid.Col>
                    );
                  })}
              </>
            );
          }}
        </Await>
      </Suspense>
    </Grid>
  );
}
