import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { ColorSchemeToggle } from '~/components/ColorSchemeToggle';
import { Group, Search } from '~/components/Search';
import { multiSearch } from '../utils/api.server';

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Mantine Remix App' },
    { name: 'description', content: 'Welcome to Mantine!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');
  if (!query || query?.length === 0) {
    return null;
  }

  const data = await multiSearch(query);

  const movies: Group = { label: 'Movies', options: [] };
  const tvSeries: Group = { label: 'TV Series', options: [] };

  for (const item of data.results) {
    if (item.release_date && item.title) {
      const label = `${item.title} (${item.release_date.slice(0, 4)})`;
      movies.options.push({
        label,
        id: item.id,
        title: item.title,
        release_date: item.release_date,
        media_type: 'movie',
      });
    } else if (item.first_air_date && item.name) {
      const label = `${item.name} (${item.first_air_date.slice(0, 4)})`;
      tvSeries.options.push({
        label,
        id: item.id,
        title: item.name,
        release_date: item.first_air_date,
        media_type: 'tv',
      });
    }
  }

  return [
    {
      ...movies,
      options: movies.options.sort(
        (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date),
      ),
    },
    {
      ...tvSeries,
      options: tvSeries.options.sort(
        (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date),
      ),
    },
  ];
}

export default function Index() {
  const fetcher = useFetcher<typeof loader>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length <= 2) {
      return;
    }
    fetcher.submit({ search: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <div>
      <ColorSchemeToggle />

      <fetcher.Form>
        <Search
          data={fetcher.data ? fetcher.data : null}
          isLoading={fetcher.state !== 'idle'}
          value={query}
          onChange={value => setQuery(value)}
          onOptionSubmit={item => {
            const params = new URLSearchParams();
            params.set('title', item.title);
            params.set('release_date', item.release_date);
            navigate(
              item.media_type === 'movie'
                ? `/movie/${item.id}?${params.toString()}`
                : `/tv/${item.id}/season/1?${params.toString()}`,
            );
          }}
        />
      </fetcher.Form>
    </div>
  );
}
