import { Container, Stack } from '@mantine/core';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function Layout({ children }) {
  return (
    <Stack p="xs" styles={{ height: '100dvh' }}>
      <Header />
      <Container px="0">{children}</Container>
      <Footer />
    </Stack>
  );
}
