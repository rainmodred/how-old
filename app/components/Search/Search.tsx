import { useFetcher, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '~/utils/misc';
import { Box } from '@mantine/core';
import { Autocomplete } from './Autocomplete';
import { getLink, transformData } from '~/utils/search';
import { SearchRes } from '~/api/schemas';

export function Search() {
  const fetcher = useFetcher<{ results: SearchRes }>();
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
          setQuery('');
          navigate(getLink(item));
        }}
      />
    </Box>
  );
}
