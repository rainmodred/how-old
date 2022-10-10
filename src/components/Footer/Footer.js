import { Container, Group, Text } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

import tmdbLogo from '/public/images/tmdb.svg';

export default function Footer() {
  return (
    <Container>
      <Group noWrap>
        <Text mr="20px">Data and Images provided by</Text>
        <Link href="https://www.themoviedb.org/">
          <a>
            <Image src={tmdbLogo} alt="tmdb logo" width="64px" height="64px" />
          </a>
        </Link>
      </Group>
    </Container>
  );
}
