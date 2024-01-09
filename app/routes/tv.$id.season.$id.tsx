import { Title } from '@mantine/core';
import { redirect, type LoaderFunctionArgs } from '@vercel/remix';
import { json, useLoaderData, useNavigation } from '@remix-run/react';
import { Persons } from '~/components/Persons';
import { getCastWithAges, getTvCast } from '~/utils/api.server';
import { SkeletonTable } from '~/components/SkeletonTable';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const releaseDate = url.searchParams.get('release_date');
  const tvId = url.pathname.split('/')[2];
  const seasonNumber = params.id;
  if (!seasonNumber || !releaseDate || !tvId) {
    throw redirect('/');
  }

  const cast = await getTvCast(tvId, seasonNumber.toString());
  const castWithAges = await getCastWithAges(cast, releaseDate);

  return json({
    cast: castWithAges,
    releaseDate,
    title: url.searchParams.get('title'),
  });
}

export default function TvPage() {
  const { cast, releaseDate, title } = useLoaderData<typeof loader>();

  const { state } = useNavigation();
  if (state === 'loading') {
    return <SkeletonTable rows={5} />;
  }
  return (
    <>
      <Title order={3}>
        {title} ({releaseDate?.slice(0, 4)})
      </Title>
      <Persons cast={cast} />
    </>
  );
}
