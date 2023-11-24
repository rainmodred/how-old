import { Button, Group, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import Search from '@/components/Search/Search';

import classes from './Header.module.css';

export default function Header() {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <Group wrap="nowrap" spacing="xs">
      <Search />
      <Button px="xs" variant="default" onClick={() => toggleColorScheme()}>
        <>
          <IconSun size={18} className={classes.darkIcon} />
          <IconMoonStars size={18} className={classes.lightIcon} />
        </>
      </Button>
      <Button
        component={Link}
        href="https://github.com/rainmodred/how-old"
        target="_blank"
        rel="noreferrer"
        variant="default"
        px="xs"
        className={classes.githubIcon}
      ></Button>
    </Group>
  );
}
