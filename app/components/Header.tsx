import { Button, Group, Image, NavLink } from '@mantine/core';
import { Link, NavLink as RouterNavLink } from 'react-router';
import { Search } from './Search/Search';
import { ThemeSwitch } from './ThemeSwitch/ThemeSwitch';
import classes from './ThemeSwitch/ThemeSwitch.module.css';

export default function Header() {
  return (
    <Group
      component={'header'}
      wrap="nowrap"
      align="center"
      justify="center"
      gap="xs"
    >
      <NavLink component={RouterNavLink} label="Home" to={'/'} w={'auto'} />
      <Search />
      <ThemeSwitch />
      {/* TODO: Support switch lang */}
      {/* <LangSwitch /> */}
      <Button
        to="https://github.com/rainmodred/how-old"
        component={Link}
        variant="default"
        radius="md"
        type="button"
        px={'xs'}
      >
        <Image
          className={classes.darkIcon}
          src={'/github-mark-white.svg'}
          width="24"
          height="24"
          alt="github logo"
        />
        <Image
          className={classes.lightIcon}
          src={'/github-mark.svg'}
          width="24"
          height="24"
          alt="github logo"
        />
      </Button>
    </Group>
  );
}
