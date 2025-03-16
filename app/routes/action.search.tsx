import { data, LoaderFunctionArgs } from 'react-router';
import { tmdbApi } from '~/api/tmdbApi';
import { Route } from './+types/action.search';

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control')!,
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');
  const lang = url.searchParams.get('lang') ?? '';

  if (!query || query?.length === 0) {
    return {
      options: [],
    };
  }

  const results = await tmdbApi.search.multiSearch(query, lang);
  return data(results, {
    headers: {
      'Cache-Control': 'max-age=600, public',
    },
  });
}

export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  await requestNotCancelled(request, 500);
  return await serverLoader();
}

function requestNotCancelled(request: Request, ms: number) {
  const { signal } = request;
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}
