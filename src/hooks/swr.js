import { client, getMovieFromAPI, getTvShowFromAPI } from '@/utils/api';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { useDebouncedValue } from '@mantine/hooks';

const BASE = '/api';

function useSearchMulti(query) {
  const [queried, setQueried] = useState(false);
  const [debouncedQuery] = useDebouncedValue(query, 500);
  const { data, error } = useSWR(
    debouncedQuery !== ''
      ? `${BASE}/search/multi?query=${encodeURIComponent(debouncedQuery)}`
      : null,
    client,
  );

  useEffect(() => {
    if (query !== '') {
      setQueried(true);
    } else {
      setQueried(false);
    }
  }, [query]);

  return {
    data: data?.results ? data.results : [],
    isLoading: !error && !data && queried,
    error,
  };
}

function useMovieCast(id, releaseDate) {
  const shouldFetch = Boolean(id) && Boolean(releaseDate);
  const { data, error } = useSWRImmutable(
    shouldFetch && `${BASE}/movie/${id}?releaseDate=${releaseDate}`,
    () => getMovieFromAPI(id, releaseDate),
  );

  return {
    cast: data,
    isLoading: !error && !data,
    error,
  };
}

function useTvShowCast(id, season) {
  const shouldFetch = id && season;
  const { data, error } = useSWRImmutable(
    shouldFetch && `${BASE}/tv/${id}?season=${season}`,
    () => getTvShowFromAPI(id, season),
  );

  return {
    cast: data?.cast,
    seasons: data?.seasons,
    isLoading: !error && !data,
    error,
  };
}

export { useSearchMulti, useMovieCast, useTvShowCast };
