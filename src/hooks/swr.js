import useSWR from 'swr';

const BASE = '/api';

function useSearchMulti(query) {
  const { data, error } = useSWR(
    query
      ? `${BASE}/search/multi?query=${encodeURIComponent(
          query.trim().toLowerCase(),
        )}`
      : null,
  );

  return {
    data: data?.results,
    isLoading: !error && !data,
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
