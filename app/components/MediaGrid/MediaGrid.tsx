import { Grid, Group, Title, Select } from '@mantine/core';
import { MediaCard } from './MediaCard';
import { useSearchParams } from 'react-router';
import { PersonDetails } from '~/api/getPerson';
import { customFormatDistance } from '~/utils/dates';
import { MediaItems } from '~/api/getPersonCredits';

interface Props {
  mediaItems: MediaItems;
  person: PersonDetails;
}

const items = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
] as const;

export function MediaGrid({ mediaItems, person }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') ?? items[0].value;

  return (
    <>
      <Grid.Col span={12}>
        <Group justify="space-between">
          <Title order={2}>Filmography</Title>
          <Select
            value={sort}
            onChange={(_value, option) => {
              const newParams = new URLSearchParams();
              newParams.set('sort', option.value);
              setSearchParams(newParams, { replace: true });
            }}
            placeholder="sort by..."
            data={items}
          />
        </Group>
      </Grid.Col>

      {mediaItems
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
              <MediaCard
                id={item.id}
                title={item.title}
                posterPath={item.poster_path}
                releaseDate={item.release_date}
                mediaType={item.media_type}
                text={formatText(person.birthday, item.release_date)}
                key={item.id}
              />
            </Grid.Col>
          );
        })}
    </>
  );
}

function formatText(
  birthday: string | undefined | null,
  releaseDate: string,
): string {
  let text = '';
  if (!birthday) {
    text = 'unknown age';
    return text;
  }

  try {
    text = `${customFormatDistance(birthday, releaseDate)} old`;
  } catch (err) {
    console.error(err);
    text = 'unknown age';
  }
  return text;
}
