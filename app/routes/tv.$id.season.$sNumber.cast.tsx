import { LoaderFunctionArgs, redirect } from 'react-router';
import { getCastWithDates } from '~/api/getCastWithDates.server';
import { getTvCredits } from '~/api/getTvCredits.server';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const { id, sNumber: seasonNumber } = params;

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const credits = await getTvCredits(Number(id), Number(seasonNumber));

  const end = offset + LIMIT;
  const castWithDates = await getCastWithDates(credits.cast, {
    offset,
    limit: end,
  });

  return {
    cast: castWithDates,
    offset: end,
    hasMore: end < credits.cast.length,
  };
}
