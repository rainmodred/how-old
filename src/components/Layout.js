import { Box, Grid } from '@chakra-ui/react';

import Footer from '@/components/Footer';
import Search from '@/components/Search';

export default function Layout({ children }) {
  return (
    <Grid
      templateRows="50px 1fr 50px"
      padding={['10px', '1rem']}
      height="100vh"
      maxWidth="5xl"
      margin="auto"
      justifyItems="center"
    >
      <Search />
      <Box>{children}</Box>
      <Footer />
    </Grid>
  );
}
