import { redirect, data } from 'react-router';
import { getCastWithDates } from '~/api/getCastWithDates';
import { tmdbApi } from '~/api/tmdbApi';
import { LIMIT } from '~/utils/constants';
import { Route } from './+types/movie.$id.cast';

export async function loader({ request, params }: Route.LoaderArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;
  const limit = offset + LIMIT;

  const { cast } = await tmdbApi.movie.getCredits(Number(params.id));

  const castWithDates = await getCastWithDates(cast.slice(offset, limit));

  console.log(
    'MOVIE CAST LOADER:',
    request.url,
    castWithDates.map(c => c.character),
  );

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
