import { Title, Flex, Box, Skeleton } from '@mantine/core';
import { Await, useLoaderData, useNavigation } from '@remix-run/react';
import { defer, HeadersFunction, type MetaFunction } from '@vercel/remix';
import { Suspense } from 'react';
import { MovieCard } from '~/components/MovieCard';
import { SkeletonTable } from '~/components/SkeletonTable';
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
  return defer(
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
