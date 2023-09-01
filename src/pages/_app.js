import { SWRConfig } from 'swr';
import { useState } from 'react';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';

import NextApp from 'next/app';
import { getCookie, setCookie } from 'cookies-next';

import Layout from '@/components/Layout/Layout';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

function AllProviders(props) {
  // const [colorScheme, setColorScheme] = useLocalStorage({

  //   key: 'mantine-color-scheme',
  //   defaultValue: 'light',
  //   getInitialValueInEffect: true,
  // });
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const toggleColorScheme = value => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
      }}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          <Layout>{props.children}</Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </SWRConfig>
  );
}

function MyApp({ Component, pageProps, colorScheme }) {
  return (
    <AllProviders colorScheme={colorScheme}>
      <Component {...pageProps} />
    </AllProviders>
  );
}

MyApp.getInitialProps = async appContext => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};

export default MyApp;
