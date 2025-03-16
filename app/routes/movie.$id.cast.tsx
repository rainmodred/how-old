import { LoaderFunctionArgs, redirect } from 'react-router';
import { tmdbApi } from '~/api/tmdbApi';
import { getCastWithDates } from '~/api/getCastWithDates';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const limit = offset + LIMIT;

  const { cast } = await tmdbApi.movie.getCredits(Number(params.id));
  const castWithDates = await getCastWithDates(cast.slice(offset, limit));

  return data(
    {
    cast: castWithDates,
      hasMore: limit < cast.length,
    },
    {
      headers: {
        'Cache-Control': 'max-age=86400, public',
      },
    },
  );
}
