import { useFetcher } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { loader } from '~/routes/movie.$id.cast';
import { CastWithDates } from '~/api/getCastWithDates';
import { useInView } from 'react-intersection-observer';

export default function useLoadMore(
  initialCast: CastWithDates,
  hasMore: boolean,
) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();

  const fetcherRef = useRef(fetcher);
  const offsetRef = useRef(persons.length);

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const moreAvailable = fetcher.data ? fetcher.data.hasMore : hasMore;

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    if (!moreAvailable || !inView || fetcherRef.current.state === 'loading') {
      return;
    }

    const newParams = new URLSearchParams({
      offset: offsetRef.current.toString(),
    });

    fetcherRef.current.load(`cast?${newParams.toString()}`);
    //triggers 2 times if used persons.lenght instead of offsetRef
  }, [inView, moreAvailable]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    const newItems = fetcher.data.cast;
    offsetRef.current += newItems.length;
    setPersons(prev => [...prev, ...newItems]);
  }, [fetcher.data, fetcher.state]);

  return {
    persons,
    isLoading: fetcher.state === 'loading',
    ref,
  };
}
