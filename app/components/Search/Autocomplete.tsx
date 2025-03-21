import { useRef, useState } from 'react';
import { TbSearch as IconSearch } from 'react-icons/tb';
import { Combobox, Loader, TextInput, useCombobox } from '@mantine/core';

export interface IGroup {
  label: string;
  options: GroupItem[];
}

export interface GroupItem {
  label: string;
  media_type: 'movie' | 'tv' | 'person';
  id: number;
}

interface Props {
  data: IGroup[] | null;
  isLoading: boolean;
  onChange: (value: string) => void;
  onOptionSubmit: (item: GroupItem) => void;
}

export function Autocomplete({
  data,
  isLoading = false,
  onChange,
  onOptionSubmit,
}: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  const groups =
    data &&
    data?.map(group => {
      const options = group.options.map(item => (
        <Combobox.Option value={item.id.toString()} key={item.id}>
          {item.label}
        </Combobox.Option>
      ));

      return (
        <Combobox.Group label={group.label} key={group.label}>
          {options}
        </Combobox.Group>
      );
    });

  const totalOptions = data
    ? data.reduce((acc, group) => acc + group.options.length, 0)
    : 0;

  const map = data
    ?.map(group => group.options)
    .flat()
    .reduce<Record<string, GroupItem>>((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {});

  return (
    <Combobox
      onOptionSubmit={optionValue => {
        combobox.closeDropdown();
        setValue('');
        if (!map || !map[optionValue]) {
          return;
        }
        onOptionSubmit(map[optionValue]);
        ref.current?.blur();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          ref={ref}
          type="search"
          name="search"
          placeholder="Search for a movie or tv series"
          value={value}
          onChange={event => {
            setValue(event.currentTarget.value);
            onChange(event.currentTarget.value);
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          leftSection={
            isLoading ? (
              <Loader data-testid="loading" size={16} />
            ) : (
              <IconSearch size={16} />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <Combobox.Options>
          {totalOptions > 0 && groups}

          {totalOptions === 0 && <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
