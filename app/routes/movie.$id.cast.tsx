import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const releaseDate = url.searchParams.get('releaseDate')!;

  const cast = await getCast(params.id);
  const castWithAges = await getCastWithDates(cast, releaseDate, { offset });

  return { offset, cast: castWithAges, done: offset + LIMIT >= cast.length };
}
