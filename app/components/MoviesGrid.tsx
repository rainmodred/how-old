import { ComboboxItem, Grid, Group, Title, Select } from '@mantine/core';
import { formatDistanceStrict } from 'date-fns';
import { useState } from 'react';
import { Movie, Person } from '~/utils/types';
import { MovieCard } from './MovieCard';

interface Props {
  movies: Movie[];
  person: Person;
}

const items = [
  { value: 'Popularity', label: 'Popularity' },
  { value: 'Release Date', label: 'Release Date' },
] as const;

export function MoviesGrid({ movies, person }: Props) {
  const [sort, setSort] = useState<ComboboxItem | null>(items[0]);

  return (
    <>
      <Grid.Col span={12}>
        <Group justify="space-between">
          <Title order={2}>Filmography</Title>
          <Select
            value={sort ? sort.value : null}
            onChange={(_value, option) => {
              option && setSort(option);
            }}
            placeholder="sort by..."
            data={items}
          />
        </Group>
      </Grid.Col>

      {movies
        .sort((a, b) => {
          if (sort?.value === 'Popularity') {
            return b.popularity - a.popularity;
          } else if (sort?.value === 'Release Date') {
            return (
              new Date(a.release_date).getTime() -
              new Date(b.release_date).getTime()
            );
          }
          throw new Error('invalid sort');
        })
        .map(movie => {
          return (
            <Grid.Col key={movie.id} span={{ base: 6, md: 4, lg: 3 }}>
              <MovieCard
                movie={movie}
                text={formatText(person.birthday, movie.release_date)}
                key={movie.id}
              />
            </Grid.Col>
          );
        })}
    </>
  );
}

function formatText(birthday: string, releaseDate: string): string {
  let text = '';
  try {
    text = `${formatDistanceStrict(birthday, releaseDate)} old`;
  } catch (err) {
    text = 'unknown age';
  }
  return text;
}
