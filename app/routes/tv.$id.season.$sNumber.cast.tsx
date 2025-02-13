import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getTvCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const { id, sNumber: seasonNumber } = params;

  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getTvCast(id, seasonNumber);
  const castWithDates = await getCastWithDates(cast, { offset });

  return {
    offset,
    cast: castWithDates,
    done: offset + LIMIT >= cast.length,
  };
}
