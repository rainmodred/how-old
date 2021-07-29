import { Flex, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';

import tmdbLogo from '../../public/tmdb.svg';

export default function Footer() {
  return (
    <Flex alignItems="center" justifyContent="center" width="100%">
      <Text mr="20px">Data and Images provided by</Text>
      <Link href="https://www.themoviedb.org/">
        <Image src={tmdbLogo} alt="tmdb logo" width="64px" height="64px" />
      </Link>
    </Flex>
  );
}
