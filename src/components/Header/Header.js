import { Button, Group, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { IconSun, IconMoonStars } from '@tabler/icons';

import Search from '@/components/Search/Search';

export default function Header() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group spacing="xs" noWrap sx={() => ({ justifyContent: 'center' })}>
      <Search />
      <Button variant="default" onClick={() => toggleColorScheme()}>
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </Button>
      <Link href="https://github.com/rainmodred/how-old" passHref>
        <Button
          component="a"
          target="_blank"
          rel="noreferrer"
          variant="default"
          px="xs"
        >
          <Image
            src={`${
              dark ? '/images/githubMarkLight.png' : '/images/githubMark.png'
            }`}
            width="24"
            height="24"
            alt="github logo"
          />
        </Button>
      </Link>
    </Group>
  );
}
