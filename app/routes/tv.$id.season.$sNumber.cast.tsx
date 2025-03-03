import { LoaderFunctionArgs, redirect } from 'react-router';
import { tmdbApi } from '~/api/tmdbApi';
import { getCastWithDates } from '~/api/getCastWithDates';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const { id, sNumber: seasonNumber } = params;

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const { cast } = await tmdbApi.tv.getCredits(
    Number(id),
    Number(seasonNumber),
  );

  const end = offset + LIMIT;
  const castWithDates = await getCastWithDates(cast, {
    offset,
    limit: end,
  });

  return {
    cast: castWithDates,
    offset: end,
    hasMore: end < cast.length,
  };
}
