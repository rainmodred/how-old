import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import {
  Meta,
  Links,
  Link,
  Outlet,
  ScrollRestoration,
  Scripts,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import {
  Text,
  Stack,
  Image,
  MantineProvider,
  Group,
  Container,
  ColorSchemeScript,
  mantineHtmlProps,
} from '@mantine/core';
import { ServerError } from './components/ServerError/ServerError';
import Header from './components/Header';
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';

// export const headers: HeadersFunction = ({ loaderHeaders }) => ({
//   'Cache-Control': loaderHeaders.get('Cache-Control')!,
// });

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <NavigationProgress />
          {children}
          <ScrollRestoration />
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === 'loading') {
      nprogress.start();
    }

    if (navigation.state === 'idle') {
      nprogress.complete();
    }
  }, [navigation.state, navigation.location]);

  return (
    <Document>
      <Stack p={'sm'} h={'100dvh'}>
        <Header />
        <Container
          mt="md"
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

// export function ErrorBoundary() {
//   return (
//     <Document>
//       <ServerError />
//     </Document>
//   );
// }

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </Document>
    );
  } else if (error instanceof Error) {
    return (
      <Document>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </Document>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
