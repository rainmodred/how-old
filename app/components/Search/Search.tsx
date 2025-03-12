import { useFetcher, useNavigate } from 'react-router';
import { Box } from '@mantine/core';
import { Autocomplete } from './Autocomplete';
import { getLink, transformData } from '~/components/Search/utils';
import { useLocalStorage } from '@mantine/hooks';
import { SearchRes } from '~/api/search-service';

const minSearchLength = 3;

export function Search() {
  const fetcher = useFetcher<{ results: SearchRes }>();

  const [lang] = useLocalStorage({
    key: 'lang',
    defaultValue: 'en',
  });

  const navigate = useNavigate();

  function handleSearch(query: string) {
    if (query.length < minSearchLength) {
      return;
    }

    fetcher.submit(
      {
        intent: 'search',
        search: query,
        lang: lang,
      },
      { action: 'action/search', method: 'get' },
    );
  }

  const data = fetcher.data ? transformData(fetcher?.data?.results) : null;

  return (
    <Box style={{ flexGrow: 1, maxWidth: '350px' }}>
      <Autocomplete
        data={data}
        isLoading={
          fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'search'
        }
        onChange={value => {
          handleSearch(value);
        }}
        onOptionSubmit={item => {
          navigate(getLink(item));
        }}
      />
    </Box>
  );
}
