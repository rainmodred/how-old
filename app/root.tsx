import '@mantine/core/styles.css';
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useNavigate,
} from '@remix-run/react';
import {
  Stack,
  Image,
  MantineProvider,
  ColorSchemeScript,
  Group,
  useMantineColorScheme,
} from '@mantine/core';
import { IGroup, Search } from './components/Search';
import { ColorSchemeToggle } from './components/ColorSchemeToggle';
import { useState, useEffect } from 'react';
import { multiSearch } from './utils/api.server';

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function GithubImage() {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Image
      src={`${
        colorScheme === 'dark' ? '/github-mark-white.svg' : '/github-mark.svg'
      }`}
      width="2"
      height="24"
      alt="github logo"
    />
  );
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');
  if (!query || query?.length === 0) {
    return null;
  }

  const data = await multiSearch(query);

  const movies: IGroup = { label: 'Movies', options: [] };
  const tvSeries: IGroup = { label: 'TV Series', options: [] };

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

export default function App() {
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Stack p={'sm'} h={'100dvh'}>
            <header>
              <Group wrap="nowrap" align="center" justify="center" gap="sm">
                <fetcher.Form style={{ width: '80%', maxWidth: '350px' }}>
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
                <ColorSchemeToggle />
                <Link to="https://github.com/rainmodred/how-old">
                  <GithubImage />
                </Link>
              </Group>
            </header>
            <Outlet />
          </Stack>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}
