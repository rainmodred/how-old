import '@mantine/core/styles.css';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import {
  Container,
  Group,
  MantineProvider,
  Stack,
  Image,
  Text,
} from '@mantine/core';
import { getPrefsSession, Theme } from './utils/userPrefs.server';
import { useState } from 'react';

import type { Route } from './+types/root';
import { LangSwitch } from './components/LangsSwitch';
import { Search } from './components/Search';
import { ThemeSwitch } from './components/ThemeSwitch';

//https://github.com/orgs/mantinedev/discussions/4829#discussioncomment-7071081
const colorSchemeManager = {
  set: () => null,
  subscribe: () => null,
  unsubscribe: () => {},
  clear: () => null,
};

export function Document({
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

export async function loader({ request }: Route.LoaderArgs) {
  const prefsSession = await getPrefsSession(request);
  const { theme, lang } = prefsSession.getPrefs();

  return {
    theme,
    lang,
  };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { theme: serverTheme, lang } = loaderData;
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      <Link to="/">go back</Link>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
