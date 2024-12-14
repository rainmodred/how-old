import { Title, Flex, Box, Skeleton } from '@mantine/core';
import { Await, data, MetaFunction, useNavigation } from 'react-router';
import { Suspense } from 'react';
import { MovieCard } from '~/components/MovieCard';
import { SkeletonTable } from '~/components/SkeletonTable';
import { discover } from '~/utils/api.server';
import type { Route } from './+types/index';

export const meta: MetaFunction = () => {
  return [
    { title: 'How Old' },
    { name: 'description', content: 'Welcome to Mantine!' },
  ];
};

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

export default function Index({ loaderData }: Route.ComponentProps) {
  const { popularMovies } = loaderData;
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return (
      <>
        <Skeleton height={40} width={'95%'} />
        <SkeletonTable rows={5} />;
      </>
    );
  }
  return (
    <Box>
      <Title m="lg" styles={{ root: { textAlign: 'center' } }}>
        Popular Movies
      </Title>

      <Flex gap="md" wrap="wrap" justify="center">
        <Suspense
          fallback={
            <>
              <Skeleton height={278} width={185} />
              <Skeleton height={278} width={185} />
              <Skeleton height={278} width={185} />
              <Skeleton height={278} width={185} />
            </>
          }
        >
          <Await resolve={popularMovies}>
            {popularMovies => {
              return (
                <>
                  {popularMovies.map(movie => {
                    return <MovieCard movie={movie} key={movie.id} />;
                  })}
                </>
              );
            }}
          </Await>
        </Suspense>
      </Flex>
    </Box>
  );
}
