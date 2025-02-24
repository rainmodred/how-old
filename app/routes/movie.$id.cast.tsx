import { LoaderFunctionArgs, redirect } from 'react-router';
import { getCastWithDates } from '~/api/getCastWithDates';
import { getMovieCredits } from '~/api/getMovieCredits';
import { LIMIT } from '~/utils/constants';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw redirect('/');
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get('offset')) || 0;

  const { cast } = await getMovieCredits(Number(params.id));
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
