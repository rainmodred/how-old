import { Select } from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { loader } from '~/root';
import { Lang } from '~/utils/userPrefs.server';

export function LangSwitch({ lang }: { lang: Lang }) {
  const fetcher = useFetcher<typeof loader>();

  return (
    <Select
      aria-label="lang switch"
      data={['en', 'ru']}
      defaultValue={lang}
      withCheckIcon={false}
      allowDeselect={false}
      onChange={value =>
        fetcher.submit(
          { intent: 'change-lang', lang: value },
          { action: 'action/set-prefs', method: 'post' },
        )
      }
      styles={{
        wrapper: { width: '45px' },
        section: { display: 'none' },
        input: { padding: 0, textAlign: 'center' },
        option: {
          padding: '2px',
          display: 'flex',
          justifyContent: 'center',
        },
      }}
    />
  );
}
