import { Button } from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { action } from '~/routes/action.set-prefs';
import { Theme } from '~/utils/userPrefs.server';

export function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const fetcher = useFetcher<typeof action>();
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
      {theme === 'dark' ? <IconSun /> : <IconMoonStars />}
    </Button>
  );
}
