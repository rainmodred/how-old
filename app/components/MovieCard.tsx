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
      h="100%"
      styles={{ root: { flexShrink: 0 } }}
    >
      <CardSection>
        <Link to={`/movie/${movie.id}`}>
          <Image
            fallbackSrc="/movieFallback.svg"
            onError={e => {
              e.currentTarget.src = '/movieFallback.svg';
            }}
            loading="lazy"
            alt={movie.title}
            src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
            // width={185}
            // height={278}
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
        </Text>
      </CardSection>
    </Card>
  );
}
