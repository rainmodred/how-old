import { LoaderFunctionArgs } from 'react-router';
import { multiSearch } from '~/api/multiSearch.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');

  if (!query || query?.length === 0) {
    return {
      options: [],
    };
  }

  const data = await multiSearch(query);
  return data;
}
