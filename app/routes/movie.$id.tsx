import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  json,
  MetaFunction,
} from '@vercel/remix';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { Persons } from '~/components/Persons';
import { getCast, getCastWithAges, getMovie } from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const [{ release_date: releaseDate, title }, cast] = await Promise.all([
    getMovie(params.id),
    getCast(params.id),
  ]);
  const castWithAges = await getCastWithAges(cast, releaseDate);

  return json(
    {
      cast: castWithAges,
      releaseDate,
      title: title,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}

export default function MoviePage() {
  const { cast, releaseDate, title } = useLoaderData<typeof loader>();

  const { state } = useNavigation();
  if (state !== 'idle') {
    return <SkeletonTable rows={5} />;
  }
  return (
    <>
      <Title size="h1">
        {title} ({releaseDate?.slice(0, 4)})
      </Title>
      <Persons cast={cast} />
    </>
  );
}
