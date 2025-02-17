import {
  Button,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { TbMoonStars as IconMoonStars, TbSun as IconSun } from 'react-icons/tb';
import classes from './ThemeSwitch.module.css';

export function ThemeSwitch() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      aria-label="theme switch"
      variant="default"
      radius="md"
      type="button"
      px={'xs'}
      onClick={() => toggleColorScheme()}
    >
      <>
        <IconSun className={classes.darkIcon} />
        <IconMoonStars className={classes.lightIcon} />
      </>
    </Button>
  );
}
