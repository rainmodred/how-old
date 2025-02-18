import { LoaderFunctionArgs, redirect } from 'react-router';
import { getTvCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const { id, sNumber: seasonNumber } = params;

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getTvCast(id, seasonNumber);
  const castWithDates = await getCastWithDates(cast, {
    offset,
    limit: offset + LIMIT,
  });

  return {
    cast: castWithDates,
    offset: offset + LIMIT,
    hasMore: offset + LIMIT < cast.length,
  };
}
