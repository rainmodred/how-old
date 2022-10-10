import { useState } from 'react';
import { useRouter } from 'next/router';
import { Autocomplete, Loader } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons';

import { useSearchMulti } from '@/hooks/swr';

function itemToString(item) {
  if (item.media_type === 'movie') {
    return `${item.title} (${item?.release_date?.slice(0, 4)})`;
  }

  if (item.media_type === 'tv') {
    return `${item.name} (${item?.first_air_date?.slice(0, 4)})`;
  }

  throw new Error('Unexpected item');
}

function formatData(data = []) {
  return data.reduce(
    (prev, item) => {
      if (item.media_type !== 'movie' && item.media_type !== 'tv') {
        return prev;
      }
      return [
        ...prev,
        {
          value: itemToString(item),
          group: item.media_type === 'movie' ? 'Movies' : 'TV Shows',
          id: item.id,
          title: item.title,
          name: item.name,
          release_date: item.release_date,
        },
      ];
    },

    [],
  );
}

export default function Search() {
  const { push } = useRouter();
  const [value, setValue] = useState('');

  const { data, isLoading } = useSearchMulti(
    value ? value?.trim()?.toLowerCase() : '',
  );

  const formattedData = formatData(data);

  function handleSubmit(item) {
    const { id, release_date } = item;

    if (item.group === 'Movies') {
      const { title } = item;
      push(`/movie/${id}?releaseDate=${release_date}&title=${title}`);
    } else {
      const { name } = item;
      push(`/tv/${id}?season=1&title=${name}`);
    }
  }

  return (
    <Autocomplete
      value={value}
      onChange={setValue}
      onItemSubmit={handleSubmit}
      icon={isLoading ? <Loader size={16} /> : <IconSearch size={16} />}
      rightSection={
        value.length > 0 && (
          <IconX onClick={() => setValue('')} cursor="pointer" size={16} />
        )
      }
      placeholder="Search for a movie or tv show"
      data={formattedData}
      sx={() => ({ width: '80%', maxWidth: '350px' })}
    />
  );
}
