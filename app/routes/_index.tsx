import { Title, Box, Grid } from '@mantine/core';
import { Await, data, HeadersFunction, MetaFunction } from 'react-router';
import { Suspense } from 'react';
import { MediaCard } from '~/components/MediaGrid/MediaCard';
import { MoviesSkeleton } from '~/components/MoviesSkeleton/MoviesSkeleton';
import { discoverMovie } from '~/api/discover';
import { Route } from './+types/_index';
import { customFormatDistance } from '~/utils/dates';

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
  const popularMovies = discoverMovie();
  return data(
    { popularMovies },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { popularMovies } = loaderData;

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
                    return (
                      <Grid.Col key={movie.id} span={{ base: 6, md: 4, lg: 3 }}>
                        <MediaCard item={movie} key={movie.id} />
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
