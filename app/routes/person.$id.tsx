import { Grid, Group, Skeleton } from '@mantine/core';
import {
  Await,
  data,
  LoaderFunctionArgs,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
} from 'react-router';
import { Suspense } from 'react';
import PersonCard from '~/components/PersonCard/PersonCard';
import { MoviesSkeleton } from '~/components/MoviesSkeleton/MoviesSkeleton';
import { MediaGrid } from '~/components/MediaGrid/MediaGrid';
import { tmdbApi } from '~/api/tmdbApi';
import { Route } from './+types/person.$id';

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data.person.name }];
}

export function header({ loaderHeaders }: Route.HeadersArgs) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')!,
  };
}

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

  const credits = tmdbApi.people.getCredits(id);
  const person = await tmdbApi.people.getDetails(id);

  return data(
    { person, credits },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function PersonPage() {
  const { person, credits } = useLoaderData<typeof loader>();

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
                <Group>
                  <Skeleton height={36} width={167} />
                  <Skeleton height={36} width={167} />
                </Group>
              </Group>
            </Grid.Col>
            <MoviesSkeleton />
          </>
        }
      >
        <Await resolve={credits}>
          {credits => {
            return <MediaGrid mediaItems={credits.cast} person={person} />;
          }}
        </Await>
      </Suspense>
    </Grid>
  );
}
