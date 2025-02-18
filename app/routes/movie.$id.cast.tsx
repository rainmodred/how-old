import { LoaderFunctionArgs, redirect } from 'react-router';
import { getCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getCast(params.id);
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
