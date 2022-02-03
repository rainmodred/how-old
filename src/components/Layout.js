import {
  Button,
  Flex,
  Grid,
  HStack,
  Link,
  Spinner,
  useColorMode,
} from '@chakra-ui/react';
import { FaMoon, FaRegSun } from 'react-icons/fa';

import Image from 'next/image';

import Footer from '@/components/Footer';
import Search from '@/components/Search';

export default function Layout({ isLoading, children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Grid
      templateRows="50px 1fr 50px"
      padding={['10px', '1rem']}
      height="100vh"
      maxWidth="5xl"
      margin="auto"
      justifyItems="center"
      gap="8"
    >
      <HStack justifyContent="center" width="100%">
        <Search />
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <FaMoon /> : <FaRegSun />}
        </Button>

        <Link
          href="https://github.com/rainmodred/how-old"
          target="_blank"
          rel="noreferrer"
          display="flex"
          alignItems="center"
          backgroundColor={`${
            colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200'
          }`}
          height="40px"
          px="3"
          borderRadius="md"
        >
          <Image
            src={`${
              colorMode === 'light' ? '/githubMark.png' : '/githubMarkLight.png'
            }`}
            width="24"
            height="24"
            alt="github logo"
          />
        </Link>
      </HStack>
      <Flex direction="column" alignItems="center" width="100%">
        {isLoading ? <Spinner size="lg" /> : children}
      </Flex>
      <Footer />
    </Grid>
  );
}
