import { ComboboxItem, Flex, Select, Skeleton, Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  MetaFunction,
  defer,
  HeadersFunction,
} from '@vercel/remix';
import { Await, useLoaderData } from '@remix-run/react';
import { getPerson, getPersonMovies } from '~/utils/api.server';
import { Suspense, useState } from 'react';
import { MovieCard } from '~/components/MovieCard';
import PersonCard from '~/components/PersonCard/PersonCard';
import { formatDiff } from '~/utils/dates';

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
    <Flex direction="column" gap="md">
      <PersonCard person={person} />

      <Suspense
        fallback={
          // TODO: FIXME
          <>
            <Skeleton height={278} width={185} />
            <Skeleton height={278} width={185} />
            <Skeleton height={278} width={185} />
            <Skeleton height={278} width={185} />
          </>
        }
      >
        <Await resolve={movies}>
          {movies => {
            return (
              <>
                <Flex justify="space-between">
                  <Title order={2}>Filmography</Title>
                  <Select
                    value={sort ? sort.value : null}
                    onChange={(_, option) => setSort(option)}
                    placeholder="sort by..."
                    data={items}
                  />
                </Flex>
                <Flex gap="sm" wrap="wrap" justify="space-between">
                  {movies
                    .sort((a, b) => {
                      if (sort?.value === 'Popularity') {
                        return b.popularity - a.popularity;
                      }
                      if (sort?.value === 'Release Date') {
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
                        <MovieCard movie={movie} text={text} key={movie.id} />
                      );
                    })}
                </Flex>
              </>
            );
          }}
        </Await>
      </Suspense>
    </Flex>
  );
}
