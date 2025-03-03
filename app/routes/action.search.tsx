import { LoaderFunctionArgs } from 'react-router';
import { tmdbApi } from '~/api/tmdbApi';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');
  const lang = url.searchParams.get('lang') ?? '';

  if (!query || query?.length === 0) {
    return {
      options: [],
    };
  }

  const data = await tmdbApi.search.multiSearch(query, lang);
  return data;
}
