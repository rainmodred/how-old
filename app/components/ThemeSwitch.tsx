import { Button } from '@mantine/core';
// import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { Moon, Sun } from 'lucide-react';
import { useFetcher } from 'react-router';
import { Theme } from '~/utils/userPrefs.server';

export function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const fetcher = useFetcher();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <Button
      aria-label="theme switch"
      type="button"
      variant="default"
      styles={{ root: { padding: '5px 10px' } }}
      onClick={() => {
        onChange(nextTheme);
        fetcher.submit(
          { intent: 'change-theme', theme: nextTheme },
          { action: '/action/set-prefs', method: 'post' },
        );
      }}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
