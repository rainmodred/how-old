import '@mantine/core/styles.css';
import { LoaderFunctionArgs } from '@vercel/remix';
import {
  useLoaderData,
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
} from '@mantine/core';
import { useState } from 'react';
import { Theme, getPrefsSession } from './utils/userPrefs.server';
import { ServerError } from './components/ServerError/ServerError';
import { Search } from './components/Search';
import { ThemeSwitch } from './components/ThemeSwitch';
import { LangSwitch } from './components/LangSwitch';

export async function loader({ request }: LoaderFunctionArgs) {
  const prefsSession = await getPrefsSession(request);
  const { theme, lang } = prefsSession.getPrefs();

  return {
    theme,
    lang,
  };
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
