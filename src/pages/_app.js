import GlobalStyles from '../styles/GlobalStyles';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/utils/api';
import { useEffect, useState } from 'react';
import { Router } from 'next/router';
import Layout from '@/components/Layout';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  if (typeof window === 'undefined') {
    const { server } = require('../mocks/server');
    server.listen();
  } else {
    const { worker } = require('../mocks/browser');
    worker.start();
  }
}

function AllProviders({ isLoading, children }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        errorRetryCount: 1,
        fetcher,
      }}
    >
      <ChakraProvider>
        <GlobalStyles />
        <Layout isLoading={isLoading}>{children}</Layout>
      </ChakraProvider>
    </SWRConfig>
  );
}

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };

    const end = () => {
      setIsLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <AllProviders isLoading={isLoading}>
      <Component {...pageProps} />
    </AllProviders>
  );
}

export default MyApp;
