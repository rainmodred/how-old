import { Select } from '@mantine/core';
import { useFetcher } from 'react-router';
import { Lang } from '~/utils/userPrefs.server';

export function LangSwitch({ lang }: { lang: Lang }) {
  const fetcher = useFetcher();

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
          { action: 'action/set-prefs', method: 'POST' },
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
