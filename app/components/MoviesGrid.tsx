import { Grid, Group, Title, Select } from '@mantine/core';
import { MovieCard } from './MovieCard';
import { useSearchParams } from 'react-router';
import { FormattedPersonDetails } from '~/api/getPerson.server';
import { FormattedMovieDetails } from '~/api/getMovie.server';
import { customFormatDistance } from '~/utils/dates';

interface Props {
  movies: FormattedMovieDetails[];
  person: FormattedPersonDetails;
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
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                release_date={movie.release_date}
                text={formatText(person.birthday, movie.release_date)}
                key={movie.id}
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
