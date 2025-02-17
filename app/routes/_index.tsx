import { Title, Box, Grid } from '@mantine/core';
import { Await, useLoaderData } from '@remix-run/react';
import { data, HeadersFunction, type MetaFunction } from '@vercel/remix';
import { formatDistanceStrict } from 'date-fns';
import { Suspense } from 'react';
import { MovieCard } from '~/components/MovieCard';
import { MoviesSkeleton } from '~/components/MoviesSkeleton/MoviesSkeleton';
import { discover } from '~/utils/api.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'How Old' },
    { name: 'description', content: 'See actor age in movies and tv shows' },
  ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export async function loader() {
  const popularMovies = discover();
  return data(
    { popularMovies },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function Index() {
  const { popularMovies } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Title mb="lg" styles={{ root: { textAlign: 'center' } }}>
        Popular Movies
      </Title>

      <Grid gutter={'md'}>
        <Suspense fallback={<MoviesSkeleton />}>
          <Await resolve={popularMovies}>
            {popularMovies => {
              return (
                <>
                  {popularMovies.map(movie => {
                    const text = `${formatDistanceStrict(movie.release_date, new Date())} old`;

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
    </Box>
  );
}
