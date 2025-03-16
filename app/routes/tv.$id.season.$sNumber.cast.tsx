import { LoaderFunctionArgs, redirect } from 'react-router';
import { tmdbApi } from '~/api/tmdbApi';
import { getCastWithDates } from '~/api/getCastWithDates';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id || !params.sNumber) {
    throw redirect('/');
  }

  const id = Number(params.id);
  const seasonNumber = Number(params.sNumber);

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const limit = offset + LIMIT;

  const { cast } = await tmdbApi.tv.getCredits(id, seasonNumber);
  const castWithDates = await getCastWithDates(cast.slice(offset, limit));

  return data(
    {
    cast: castWithDates,
      seasonNumber,
      hasMore: limit < cast.length,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}
