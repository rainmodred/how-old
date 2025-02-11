import { LoaderFunctionArgs } from '@remix-run/node';
import { getTvCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { id, sNumber: seasonNumber } = params;

  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getTvCast(id!, seasonNumber!);
  const castWithAges = await getCastWithDates(cast, { offset });

  return {
    offset,
    cast: castWithAges,
    done: offset + LIMIT >= cast.length,
  };
}
