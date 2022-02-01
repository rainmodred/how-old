import GlobalStyles from '../styles/GlobalStyles';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/utils/api';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  if (typeof window === 'undefined') {
    const { server } = require('../mocks/server');
    server.listen();
  } else {
    const { worker } = require('../mocks/browser');
    worker.start();
  }
}

function MyApp({ Component, pageProps }) {
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
        <Component {...pageProps} />
      </ChakraProvider>
    </SWRConfig>
  );
}

export default MyApp;
