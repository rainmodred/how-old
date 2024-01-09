import '@mantine/core/styles.css';
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  json,
} from '@vercel/remix';
import {
  useLoaderData,
  useFetchers,
  useFetcher,
  useNavigate,
  Meta,
  Links,
  Link,
  Outlet,
  ScrollRestoration,
  Scripts,
  LiveReload,
  useNavigation,
} from '@remix-run/react';
import {
  Text,
  Stack,
  Image,
  MantineProvider,
  Group,
  Container,
  Select,
  Button,
  Table,
} from '@mantine/core';
import { IGroup, Search } from './components/Search';
import { useState, useEffect } from 'react';
import { multiSearch } from './utils/api.server';
import { Theme, getTheme, setTheme } from './utils/theme.server';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { Lang, getLang, setLang } from './utils/lang.server';
import { cssBundleHref } from '@remix-run/css-bundle';
import { SkeletonTable } from './components/SkeletonTable';

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

function useData() {
  const data = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const themeFetcher = fetchers.find(
    f => f.formData?.get('intent') === 'update-theme',
  );
  const optimisticTheme = themeFetcher?.formData?.get('theme');
  if (optimisticTheme === 'light' || optimisticTheme === 'dark') {
    return { ...data, theme: optimisticTheme as Theme };
  }
  return data;
}

function ThemeSwitch({ userPreference }: { userPreference?: Theme }) {
  const fetcher = useFetcher<typeof action>();

  const mode = userPreference ?? 'light';
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <fetcher.Form method="POST">
      <input type="hidden" name="theme" value={nextMode} />
      <Button
        name="intent"
        value="update-theme"
        type="submit"
        variant="default"
        styles={{ root: { padding: '5px 10px' } }}
      >
        {mode === 'dark' ? <IconSun /> : <IconMoonStars />}
      </Button>
    </fetcher.Form>
  );
}

function GithubImage({ theme }: { theme: Theme }) {
  return (
    <Image
      src={`${
        theme === 'dark' ? '/github-mark-white.svg' : '/github-mark.svg'
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
  const lang = getLang(request);
  const theme = getTheme(request);
  if (!query || query?.length === 0) {
    return json({
      options: [],
      theme,
      lang,
    });
  }

  const language = getLang(request);
  const data = await multiSearch(query, language);

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
  return json({
    options: [
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
    ],
    theme,
    lang,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'update-theme': {
      const theme = String(formData.get('theme')) as Theme;
      const responseInit = {
        headers: { 'set-cookie': setTheme(theme) },
      };
      return json({ success: true }, responseInit);
    }
    case 'change-lang': {
      const language = String(formData.get('language')) as Lang;
      const responseInit = {
        headers: { 'set-cookie': setLang(language) },
      };
      return json({ success: true }, responseInit);
    }
    default:
      return null;
  }
}

//https://github.com/orgs/mantinedev/discussions/4829#discussioncomment-7071081
const colorSchemeManager = {
  set: () => null,
  subscribe: () => null,
  unsubscribe: () => {},
  clear: () => null,
};

function Document({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <html lang="en" data-mantine-color-scheme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider
          colorSchemeManager={{ ...colorSchemeManager, get: () => theme }}
        >
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  const fetcher = useFetcher<typeof loader>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { theme, lang } = useData();
  const navigate = useNavigate();
  const { state } = useNavigation();

  useEffect(() => {
    if (debouncedQuery.length <= 2) {
      return;
    }
    fetcher.submit({ intent: 'search', search: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <Document theme={theme}>
      <Stack p={'sm'} h={'100dvh'}>
        <Group
          component={'header'}
          wrap="nowrap"
          align="center"
          justify="center"
          gap="sm"
        >
          <fetcher.Form style={{ width: '80%', maxWidth: '350px' }}>
            <Search
              data={fetcher.data?.options ? fetcher.data.options : null}
              isLoading={
                fetcher.state !== 'idle' &&
                fetcher.formData?.get('intent') === 'search'
              }
              value={query}
              onChange={value => setQuery(value)}
              onOptionSubmit={item => {
                const params = new URLSearchParams({
                  title: item.title,
                  release_date: item.release_date,
                });
                navigate(
                  item.media_type === 'movie'
                    ? `/movie/${item.id}?${params.toString()}`
                    : `/tv/${item.id}/season/1?${params.toString()}`,
                );
              }}
            />
          </fetcher.Form>

          <ThemeSwitch userPreference={theme} />

          <fetcher.Form>
            <Select
              data={['en', 'ru']}
              defaultValue={lang}
              withCheckIcon={false}
              allowDeselect={false}
              onChange={value =>
                fetcher.submit(
                  { intent: 'change-lang', language: value },
                  { method: 'POST' },
                )
              }
              styles={{
                wrapper: { width: '45px' },
                section: { display: 'none' },
                input: { padding: 0, textAlign: 'center' },
              }}
            />
          </fetcher.Form>
          <Link to="https://github.com/rainmodred/how-old">
            <GithubImage theme={theme} />
          </Link>
        </Group>
        <Container
          component={'main'}
          px="0"
          w={'100%'}
          styles={{ root: { flex: '1' } }}
        >
          {state !== 'idle' && <SkeletonTable rows={5} />}
          <Outlet />
        </Container>
        <Container component={'footer'}>
          <Group wrap="nowrap">
            <Text>Data and Images provided by</Text>
            <Link to="https://www.themoviedb.org/">
              <Image
                src={'/tmdb.svg'}
                alt="tmdb logo"
                w="64px"
                h="64px"
                fit="contain"
              />
            </Link>
          </Group>
        </Container>
      </Stack>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document theme="light">
      <Stack p={'sm'}>
        <h1>Something went wrong</h1>
        <Link to="/">go back</Link>
      </Stack>
    </Document>
  );
}
