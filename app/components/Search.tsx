import { useFetcher, useNavigate } from '@remix-run/react';
import { useState, useRef, useEffect } from 'react';
import { loader } from '~/routes/action.search';
import { useDebounce } from '~/utils/misc';
import { IconSearch } from '@tabler/icons-react';
import { Box, Combobox, Loader, TextInput, useCombobox } from '@mantine/core';

export function Search() {
  const fetcher = useFetcher<typeof loader>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const navigate = useNavigate();

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (debouncedQuery.length <= 2) {
      return;
    }
    fetcherRef.current.submit(
      {
        intent: 'search',
        search: debouncedQuery,
      },
      { action: 'action/search', method: 'get' },
    );
  }, [debouncedQuery]);

  return (
    <Box style={{ flexGrow: 1, maxWidth: '350px' }}>
      <Autocomplete
        data={fetcher.data?.options ? fetcher.data.options : null}
        isLoading={
          fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'search'
        }
        value={query}
        onChange={value => setQuery(value)}
        onOptionSubmit={item => {
          navigate(
            item.media_type === 'movie'
              ? `/movie/${item.id}`
              : `/tv/${item.id}/season/1`,
          );
        }}
      />
    </Box>
  );
}

export interface IGroup {
  label: string;
  options: GroupItem[];
}

export interface GroupItem {
  label: string;
  id: number;
  title: string;
  release_date: string;
  media_type: 'tv' | 'movie';
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
    .reduce<Record<number, GroupItem>>((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {});

  return (
    <Combobox
      onOptionSubmit={optionValue => {
        combobox.closeDropdown();
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
