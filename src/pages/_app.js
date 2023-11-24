import '@mantine/core/styles.css';
import { SWRConfig } from 'swr';
import { createTheme, MantineProvider } from '@mantine/core';

import Layout from '@/components/Layout/Layout';

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
//   require('../mocks');
// }

const theme = createTheme({});

function AllProviders(props) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        errorRetryCount: 1,
      }}
    >
      <MantineProvider theme={{ theme }}>
        <Layout>{props.children}</Layout>
      </MantineProvider>
    </SWRConfig>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AllProviders>
      <Component {...pageProps} />
    </AllProviders>
  );
}

export default MyApp;
