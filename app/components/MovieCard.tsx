import { Card, CardSection, Image, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { Movie } from '~/utils/api.server';

type Props = { movie: Movie & { age: number } };

export function MovieCard({ movie }: Props) {
  return (
    <Card
      data-testid="movie-card"
      radius="md"
      shadow="sm"
      styles={{ root: { flexShrink: 0 } }}
    >
      <CardSection>
        <Link to={`/movie/${movie.id}`}>
          <Image
            loading="lazy"
            alt="movie poster"
            src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
            w="185"
            h="278"
          />
        </Link>
      </CardSection>
      <CardSection w="185" p="sm">
        <Text fw={700}>{movie.title}</Text>
        <Text>{movie.release_date}</Text>
        <Text>
          {movie.age} {movie.age === 1 ? 'year' : 'years'} ago
        </Text>
      </CardSection>
    </Card>
  );
}
