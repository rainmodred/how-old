import { useFetcher, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { loader } from '~/routes/movie.$id.cast';
import { CastWithDates } from '~/api/getCastWithDates.server';

export default function useLoadMore(
  initialCast: CastWithDates,
  hasMore: boolean,
) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPersons(initialCast);
  }, [initialCast]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.cast;
      setPersons(prev => [...prev, ...newItems]);

      const newParams = new URLSearchParams({
        limit: String(fetcher.data.offset),
      });
      setSearchParams(newParams, { replace: true, preventScrollReset: true });
    }
  }, [fetcher.data, fetcher.state, setSearchParams]);

  function loadMore() {
    const newParams = new URLSearchParams({
      offset: persons.length.toString(),
    });

    fetcher.load(`cast?${newParams.toString()}`);
  }

  const moreAvailable = fetcher.data ? fetcher.data.hasMore : hasMore;
  return {
    persons,
    loadMore,
    isLoaded: !moreAvailable,
    isLoading: fetcher.state === 'loading',
  };
}
