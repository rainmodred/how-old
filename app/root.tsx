import '@mantine/core/styles.css';
import { LoaderFunctionArgs, json } from '@vercel/remix';
import {
  useLoaderData,
  useFetcher,
  useNavigate,
  Meta,
  Links,
  Link,
  Outlet,
  ScrollRestoration,
  Scripts,
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
  Box,
} from '@mantine/core';
import { Autocomplete, IGroup } from './components/Autocomplete';
import { useState, useEffect, useRef } from 'react';
import { multiSearch } from './utils/api.server';
import { Lang, Theme, getPrefsSession } from './utils/userPrefs.server';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { action } from './routes/action.set-prefs';
import { useDebounce } from './utils/misc';
import { ServerError } from './components/ServerError/ServerError';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');

  const prefsSession = await getPrefsSession(request);
  const { theme, lang } = prefsSession.getPrefs();

  if (!query || query?.length === 0) {
    return json({
      options: [],
      theme,
      lang,
    });
  }

  const data = await multiSearch(query, lang);

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
        </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  const { theme: serverTheme, lang } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState(serverTheme);

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
          <Search />
          <ThemeSwitch theme={theme} onChange={setTheme} />
          <LangSwitch lang={lang} />
          <Link
            to="https://github.com/rainmodred/how-old"
            style={{ flexShrink: 0 }}
          >
            <Image
              src={`${
                theme === 'dark' ? '/github-mark-white.svg' : '/github-mark.svg'
              }`}
              width="2"
              height="24"
              alt="github logo"
            />
          </Link>
        </Group>
        <Container
          component={'main'}
          px="0"
          w={'100%'}
          styles={{ root: { flex: '1' } }}
        >
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
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document theme="light">
      <ServerError />
    </Document>
  );
}

function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const fetcher = useFetcher<typeof action>();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <Button
      aria-label="theme switch"
      type="button"
      variant="default"
      styles={{ root: { padding: '5px 10px' } }}
      onClick={() => {
        onChange(nextTheme);
        fetcher.submit(
          { intent: 'change-theme', theme: nextTheme },
          { action: '/action/set-prefs', method: 'post' },
        );
      }}
    >
      {theme === 'dark' ? <IconSun /> : <IconMoonStars />}
    </Button>
  );
}

function Search() {
  const fetcher = useFetcher<typeof loader>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const navigate = useNavigate();

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (debouncedQuery.length <= 2) {
      return;
    }
    fetcherRef.current.submit({ intent: 'search', search: debouncedQuery });
  }, [debouncedQuery]);

  return (
    <Box style={{ flexGrow: 1, maxWidth: '350px' }}>
      <Autocomplete
        data={fetcher.data?.options ? fetcher.data.options : null}
        isLoading={
          fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'search'
        }
        value={query}
        onChange={value => setQuery(value)}
        onOptionSubmit={item => {
          navigate(
            item.media_type === 'movie'
              ? `/movie/${item.id}`
              : `/tv/${item.id}/season/1`,
          );
        }}
      />
    </Box>
  );
}

function LangSwitch({ lang }: { lang: Lang }) {
  const fetcher = useFetcher<typeof loader>();

  return (
    <Select
      aria-label="lang switch"
      data={['en', 'ru']}
      defaultValue={lang}
      withCheckIcon={false}
      allowDeselect={false}
      onChange={value =>
        fetcher.submit(
          { intent: 'change-lang', lang: value },
          { action: 'action/set-prefs', method: 'POST' },
        )
      }
      styles={{
        wrapper: { width: '45px' },
        section: { display: 'none' },
        input: { padding: 0, textAlign: 'center' },
        option: {
          padding: '2px',
          display: 'flex',
          justifyContent: 'center',
        },
      }}
    />
  );
}
