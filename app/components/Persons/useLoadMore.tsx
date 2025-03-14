import { useFetcher, useNavigation } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loader } from '~/routes/movie.$id';
import { CastWithDates } from '~/api/getCastWithDates';
import { useInView } from 'react-intersection-observer';

export default function useLoadMore(
  initialCast: CastWithDates,
  hasMore: boolean,
) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();
  const navigation = useNavigation();

  const lastEnpoint = useRef('');

  const { ref, inView, entry } = useInView({
    threshold: 1,
    onChange: inView => {
      console.log('onChange:', {
        inView,
        navigation: navigation.location,
      });

      if (!moreAvailable || !inView) {
        return;
      }

      const newParams = new URLSearchParams({
        offset: offsetRef.current.toString(),
        load: 'true',
      });
      if (lastEnpoint.current === `?${newParams.toString()}`) {
        return;
      }

      lastEnpoint.current = `?${newParams.toString()}`;
      fetcher.load(`?${newParams.toString()}`);
    },
  });

  const moreAvailable = fetcher.data ? fetcher.data.hasMore : hasMore;

  const offsetRef = useRef(persons.length);

  // const { load } = fetcher;
  // useEffect(() => {
  //   console.log('meow:', inView, entry);
  //   if (!moreAvailable || !inView) {
  //     return;
  //   }

  //   const newParams = new URLSearchParams({
  //     offset: offsetRef.current.toString(),
  //     load: 'true',
  //   });

  //   load(`?${newParams.toString()}`);
  // }, [inView, moreAvailable, load]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    const newItems = fetcher.data.cast;
    console.log(
      'newItems:',

      newItems.map(i => i.name),
    );
    offsetRef.current += newItems.length;
    setPersons(prev => [...prev, ...newItems]);
  }, [fetcher.data, fetcher.state]);

  return {
    persons,
    isLoading: fetcher.state === 'loading',
    ref,
  };
}
