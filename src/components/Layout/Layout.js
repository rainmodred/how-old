import { Container, Stack } from '@mantine/core';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function Layout({ children }) {
  return (
    <Stack p="xs" sx={{ height: '100vh' }}>
      <Header />
      <Container px="0" sx={() => ({ width: '100%', flex: 1 })}>
        {children}
      </Container>
      <Footer />
    </Stack>
  );
}
