import { Title, Table } from '@mantine/core';
import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { PersonSkeleton } from '~/components/PersonSkeleton';
import { Persons } from '~/components/Persons';
import { getCast, getCastWithAges } from '~/utils/api.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const releaseDate = url.searchParams.get('release_date');
  if (!params.id || !releaseDate) {
    throw redirect('/');
  }

  const cast = await getCast(params.id);
  const castWithAges = await getCastWithAges(cast, releaseDate);

  return {
    cast: castWithAges,
    releaseDate,
    title: url.searchParams.get('title'),
  };
}

export default function MoviePage() {
  const { cast, releaseDate, title } = useLoaderData<typeof loader>();

  const { state } = useNavigation();
  if (state === 'loading') {
    return (
      <Table>
        {Array.from({ length: 5 }).map((_, index) => (
          <PersonSkeleton key={index} />
        ))}
      </Table>
    );
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
