import GlobalStyles from '../styles/GlobalStyles';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
