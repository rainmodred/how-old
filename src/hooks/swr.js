import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';

const BASE = '/api';

function useSearchMulti(query) {
  const [queried, setQueried] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);
  const { data, error } = useSWR(
    debouncedQuery !== ''
      ? `${BASE}/search/multi?query=${encodeURIComponent(debouncedQuery)}`
      : null,
  );

  useEffect(() => {
    if (query !== '') {
      setQueried(true);
    } else {
      setQueried(false);
    }
  }, [query]);

  return {
    data: data?.results,
    isLoading: !error && !data && queried,
    error,
  };
}

function useMovieCast(id, releaseDate) {
  const { data, error } = useSWR(
    id && releaseDate && `${BASE}/movie/${id}?releaseDate=${releaseDate}`,
  );

  return {
    cast: data,
    isLoading: !error && !data,
    error,
  };
}

export { useSearchMulti, useMovieCast };
