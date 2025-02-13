import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getCast, getCastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const cast = await getCast(params.id);
  const castWithDates = await getCastWithDates(cast, { offset });

  return { offset, cast: castWithDates, done: offset + LIMIT >= cast.length };
}
