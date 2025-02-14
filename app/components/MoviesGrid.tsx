import { Grid, Group, Title, Select } from '@mantine/core';
import { formatDistanceStrict } from 'date-fns';
import { Movie, Person } from '~/utils/types';
import { MovieCard } from './MovieCard';
import { useSearchParams } from '@remix-run/react';

interface Props {
  movies: Movie[];
  person: Person;
}

const items = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
] as const;

export function MoviesGrid({ movies, person }: Props) {
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

      {movies
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
