import { useFetcher, useNavigate } from '@remix-run/react';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '~/utils/misc';
import { IconSearch } from '@tabler/icons-react';
import { Box, Combobox, Loader, TextInput, useCombobox } from '@mantine/core';
import { SearchRes } from '~/utils/api.server';
import { getYear } from 'date-fns';

export function Search() {
  const fetcher = useFetcher<{ results: SearchRes[] }>();
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

  const data = transformData(fetcher?.data?.results);

  return (
    <Box style={{ flexGrow: 1, maxWidth: '350px' }}>
      <Autocomplete
        data={data}
        isLoading={
          fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'search'
        }
        value={query}
        onChange={value => setQuery(value)}
        onOptionSubmit={item => {
          navigate(getLink(item));
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

function transformData(data: undefined | SearchRes[]): IGroup[] | null {
  if (!data) {
    return null;
  }

  const initialGroups: IGroup[] = [
    { label: 'Movies', options: [] },
    { label: 'TV Series', options: [] },
    { label: 'Persons', options: [] },
  ];

  const processMedia = (accum: IGroup[], current: SearchRes) => {
    if (
      current.media_type === 'movie' &&
      current.release_date &&
      current.title
    ) {
      const label = `${current.title} (${getYear(current.release_date)})`;
      accum[0].options.push({
        id: current.id,
        label,
        media_type: current.media_type,
      });
    }

    if (current.media_type === 'tv' && current.first_air_date && current.name) {
      const label = `${current.name} (${getYear(current.first_air_date.slice(0, 4))})`;
      accum[1].options.push({
        id: current.id,
        label,
        media_type: current.media_type,
      });
    }

    if (current.media_type === 'person' && current.name) {
      const label = `${current.name}`;
      accum[2].options.push({
        id: current.id,
        label,
        media_type: current.media_type,
      });
    }

    return accum;
  };

  return data.reduce(processMedia, initialGroups);
}

function getLink(item: GroupItem) {
  if (item.media_type === 'movie') {
    return `/movie/${item.id}`;
  }
  if (item.media_type === 'tv') {
    return `/tv/${item.id}/season/1`;
  }
  return `/person/${item.id}`;
}
