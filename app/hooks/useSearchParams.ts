import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router';

//https://github.com/remix-run/react-router/issues/9991#issuecomment-2282208096
export default function useSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const setSearchParams = useCallback(
    (setter: SetStateAction<URLSearchParams>, options?: NavigateOptions) => {
      const newParams =
        typeof setter === 'function' ? setter(searchParamsRef.current) : setter;
      navigate(`?${newParams}`, options);
    },
    [navigate],
  );

  return [searchParams, setSearchParams] as const;
}
