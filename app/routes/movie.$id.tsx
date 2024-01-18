import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunctionArgs,
  json,
  MetaFunction,
} from '@vercel/remix';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { Persons } from '~/components/Persons';
import { getCast, getCastWithAges } from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Movie' }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const releaseDate = url.searchParams.get('release_date');
  if (!params.id || !releaseDate) {
    throw redirect('/');
  }

  const cast = await getCast(params.id);
  const castWithAges = await getCastWithAges(cast, releaseDate);

  return json(
    {
      cast: castWithAges,
      releaseDate,
      title: url.searchParams.get('title'),
    },
    {
      headers: {
        'cache-control': 'max-age=86400',
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
