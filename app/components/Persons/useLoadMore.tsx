import { useFetcher, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { loader } from '~/routes/movie.$id.cast';
import { CastWithDates } from '~/utils/api.server';
import { LIMIT } from '~/utils/constants';

export default function useLoadMore(initialCast: CastWithDates, done: boolean) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPersons(initialCast);
  }, [initialCast]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.cast;
      //TODO: FIX TS
      setPersons(prev => [...prev, ...newItems]);
    }
  }, [fetcher.data, fetcher.state]);

  function loadMore() {
    const offset = searchParams.has('offset')
      ? Number(searchParams.get('offset')!) + LIMIT
      : LIMIT;

    const newParams = new URLSearchParams();
    newParams.set('offset', offset.toString());

    setSearchParams(newParams, { replace: true, preventScrollReset: true });
    fetcher.load(`cast?${newParams.toString()}`);
  }

  //Hide button if loaded all cast
  let isDone = false;
  if (done) {
    isDone = true;
  } else {
    isDone = fetcher?.data?.done ? fetcher?.data.done : false;
  }

  return { persons, loadMore, isDone, isLoading: fetcher.state === 'loading' };
}
