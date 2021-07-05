import GlobalStyles from '../styles/GlobalStyles';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/utils/api';

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
