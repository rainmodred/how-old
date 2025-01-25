import { Card, CardSection, Image, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { Movie } from '~/utils/api.server';
import { formatDate } from '~/utils/dates';

interface Props {
  movie: Movie;
  text: string;
}

export function MovieCard({ movie, text }: Props) {
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
            alt={movie.title}
            src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
            w="185"
            h="278"
          />
        </Link>
      </CardSection>
      <CardSection w="185" p="sm">
        <Text fw={700} size="md">
          {movie.title}
        </Text>
        <Text size="sm">{formatDate(movie.release_date)}</Text>
        <Text size="sm">
          <strong>{text}</strong>
          {/* {movie.age} {movie.age === 1 ? 'year' : 'years'} ago */}
        </Text>
      </CardSection>
    </Card>
  );
}
