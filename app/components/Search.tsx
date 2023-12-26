import { useState } from 'react';
import { Combobox, Loader, TextInput, useCombobox } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { Group } from '~/routes/_index';

interface Props {
  data: Group[] | null;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  onOptionSubmit: (value: string) => void;
}

export function Search({
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
        <Combobox.Option value={item} key={item}>
          {item}
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

  return (
    <Combobox
      onOptionSubmit={optionValue => {
        // setValue(optionValue);
        combobox.closeDropdown();
        onOptionSubmit(optionValue);
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          type="search"
          name="search"
          label="Search"
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
