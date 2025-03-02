import { Grid, Group, Title, Select } from '@mantine/core';
import { MediaCard } from './MediaCard';
import { useSearchParams } from 'react-router';
import { PersonCast, PersonDetails } from '~/api/schemas';

interface Props {
  mediaItems: PersonCast;
  person: PersonDetails;
}

const sortOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
] as const;

export const filterOptions = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
];

export function MediaGrid({ mediaItems, person }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') ?? sortOptions[0].value;
  const filter = searchParams.get('filter') ?? filterOptions[0]!.value;

  const filteredItems = mediaItems.filter(item => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'movie') {
      return item.media_type === 'movie';
    }
    if (filter === 'tv') {
      return item.media_type === 'tv';
    }

    return false;
  });

  function updateParams(key: string, value: string) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams, {
      replace: true,
      preventScrollReset: true,
    });
  }

  return (
    <>
      <Grid.Col span={12}>
        <Group justify="space-between" wrap="nowrap">
          <Title order={2}>Credits</Title>
          <Group wrap="nowrap">
            <Select
              value={filter}
              onChange={(_value, option) => {
                updateParams('filter', option.value);
              }}
              placeholder="filter by"
              data={filterOptions}
            />
            <Select
              value={sort}
              onChange={(_value, option) => {
                updateParams('sort', option.value);
              }}
              placeholder="sort by"
              data={sortOptions}
            />
          </Group>
        </Group>
      </Grid.Col>

      {filteredItems
        .sort((a, b) => {
          if (sort === 'popularity') {
            return b.popularity - a.popularity;
          } else if (sort === 'release_date') {
            return (
              new Date(a.release_date).getTime() -
              new Date(b.release_date).getTime()
            );
          }
          throw new Error('invalid sort');
        })
        .map(item => {
          return (
            <Grid.Col key={item.id} span={{ base: 6, md: 4, lg: 3 }}>
              <MediaCard item={item} key={item.id} birthday={person.birthday} />
            </Grid.Col>
          );
        })}
    </>
  );
}
