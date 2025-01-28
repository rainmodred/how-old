import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
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
  value: string;
  onChange: (value: string) => void;
  onOptionSubmit: (item: GroupItem) => void;
}

export function Autocomplete({
  data,
  isLoading = false,
  value,
  onChange,
  onOptionSubmit,
}: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [searched, setSearched] = useState(false);

  function openDropdown() {
    if ((data && data?.length > 0) || searched) {
      combobox.openDropdown();
    }
  }

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
        if (!map) {
          return;
        }
        onOptionSubmit(map[optionValue]);
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          type="search"
          name="search"
          placeholder="Search for a movie or tv series"
          value={value}
          onChange={event => {
            onChange(event.currentTarget.value);
            if (event.currentTarget.value === '') {
              setSearched(false);
              combobox.closeDropdown();
            } else {
              setSearched(true);
              openDropdown();
            }
            combobox.resetSelectedOption();
          }}
          onClick={() => openDropdown()}
          onFocus={() => {
            openDropdown();
          }}
          onBlur={() => combobox.closeDropdown()}
          leftSection={
            isLoading ? <Loader size={16} /> : <IconSearch size={16} />
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <Combobox.Options>
          {totalOptions > 0 ? (
            groups
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
