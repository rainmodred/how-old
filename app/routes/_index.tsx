import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { ColorSchemeToggle } from '~/components/ColorSchemeToggle';
import { Search } from '~/components/Search';
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

export interface Group {
  label: string;
  options: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');
  if (!query || query?.length === 0) {
    return null;
  }

  const data = await multiSearch(query);

  const movies: Group = { label: 'Movies', options: [] };
  const tvSeries: Group = { label: 'TV Series', options: [] };

  const sortedByDate = data.results
    .filter(item => item.release_date || item.first_air_date)
    .sort((a, b) => {
      if (a.release_date && b.release_date) {
        return Date.parse(a.release_date) - Date.parse(b.release_date);
      }

      if (a.first_air_date && b.first_air_date) {
        return Date.parse(a.first_air_date) - Date.parse(b.first_air_date);
      }
      return 1;
    });

  for (const item of sortedByDate) {
    if (item.release_date) {
      const title = `${item.title} (${item.release_date.slice(0, 4)})`;
      movies.options.push(title);
    } else if (item.first_air_date) {
      const title = `${item.name} (${item.first_air_date.slice(0, 4)})`;
      tvSeries.options.push(title);
    }
  }

  return [movies, tvSeries];
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
          onOptionSubmit={path => navigate(`/${path}`)}
        />
      </fetcher.Form>
    </div>
  );
}
