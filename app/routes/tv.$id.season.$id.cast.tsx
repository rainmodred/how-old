import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getTvCast, getCastWithAges } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tvId = url.pathname.split('/')[2];
  const seasonNumber = params.id as string;
  if (!seasonNumber || !tvId) {
    throw redirect('/');
  }

  const offset = Number(url.searchParams.get('offset')) || 0;
  const releaseDate = url.searchParams.get('releaseDate')!;

  const cast = await getTvCast(tvId, seasonNumber);
  const castWithAges = await getCastWithAges(cast, releaseDate, { offset });

  return {
    offset,
    cast: castWithAges,
    done: offset + LIMIT >= cast.length,
  };
}
