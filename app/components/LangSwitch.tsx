import { Select } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export function LangSwitch() {
  const [value, setValue] = useLocalStorage({
    key: 'lang',
    defaultValue: 'en',
  });

  return (
    <Select
      aria-label="lang switch"
      data={['en', 'ru']}
      defaultValue={value}
      withCheckIcon={false}
      allowDeselect={false}
      onChange={v => v && setValue(v)}
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
