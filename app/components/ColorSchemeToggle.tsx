import { Button, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Button
      variant="default"
      onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
      p={'sm'}
    >
      {colorScheme === 'dark' ? (
        <IconSun size={18} />
      ) : (
        <IconMoonStars size={18} />
      )}
    </Button>
  );
}
