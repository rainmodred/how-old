import useSWR from 'swr';

const BASE = '/api';

export default function useSearchMulti(query) {
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
