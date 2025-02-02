import { useFetcher, useNavigate } from '@remix-run/react';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '~/utils/misc';
import { Box } from '@mantine/core';
import { MovieRes, PersonRes, SearchRes, TvRes } from '~/utils/api.server';
import { getYear } from 'date-fns';
import { Autocomplete, GroupItem, IGroup } from './Autocomplete';

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

function transformData(data: undefined | SearchRes[]): IGroup[] | null {
  if (!data) {
    return null;
  }

  const groups = Object.entries(
    Object.groupBy(data, ({ media_type }) => media_type) as {
      tv: TvRes[];
      movie: MovieRes[];
      person: PersonRes[];
    },
  )
    .filter(
      ([groupName]) =>
        groupName === 'movie' || groupName === 'tv' || groupName === 'person',
    )
    .map(([groupName, g]) => {
      if (groupName === 'movie') {
        //ts hates me
        const group = g as MovieRes[];
        return {
          label: 'Movies',
          options: group
            .filter(m => m.release_date && m.title)
            .sort(
              (a, b) =>
                new Date(a.release_date).getTime() -
                new Date(b.release_date).getTime(),
            )
            .map(m => {
              const label = `${m.title} (${getYear(m.release_date)})`;
              return {
                id: m.id,
                label,
                media_type: m.media_type,
              };
            }),
        };
      }

      if (groupName === 'tv') {
        const group = g as TvRes[];
        return {
          label: 'TV Series',
          options: group
            .filter(tv => tv.first_air_date && tv.name)
            .sort(
              (a, b) =>
                new Date(a.first_air_date).getTime() -
                new Date(b.first_air_date).getTime(),
            )
            .map(tv => {
              const label = `${tv.name} (${getYear(tv.first_air_date)})`;
              return {
                id: tv.id,
                label,
                media_type: tv.media_type,
              };
            }),
        };
      }

      if (groupName === 'person') {
        const group = g as PersonRes[];
        return {
          label: 'Persons',
          options: group
            .sort((a, b) => a.popularity - b.popularity)
            .slice(0, 5)
            .map(p => {
              const label = `${p.name}`;
              return {
                id: p.id,
                label,
                media_type: p.media_type,
              };
            }),
        };
      }
      throw new Error('unknown group');
    });

  return groups;
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
