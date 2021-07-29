import { Box, Button, Grid, HStack, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaRegSun } from 'react-icons/fa';

import Footer from '@/components/Footer';
import Search from '@/components/Search';

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Grid
      templateRows="50px 1fr 50px"
      padding={['10px', '1rem']}
      height="100vh"
      maxWidth="5xl"
      margin="auto"
      justifyItems="center"
    >
      <HStack justifyContent="center" width="100%">
        <Search />
        <Button onClick={toggleColorMode}>
          {colorMode === 'light' ? <FaMoon /> : <FaRegSun />}
        </Button>
      </HStack>
      <Box width="100%">{children}</Box>
      <Footer />
    </Grid>
  );
}
