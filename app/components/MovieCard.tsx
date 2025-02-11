import { Card, CardSection, Image, Text, Title } from '@mantine/core';
import { Link } from '@remix-run/react';
import { Movie } from '~/utils/types';
import { customFormatDate } from '~/utils/dates';

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
            width={342}
            height={513}
            h="auto"
          />
        </Link>
      </CardSection>
      <CardSection w="185" p="sm">
        <Title order={3} fw={700} size="md">
          {movie.title}
        </Title>
        <Text size="sm">{customFormatDate(movie.release_date)}</Text>
        <Text size="sm">
          <strong>{text}</strong>
        </Text>
      </CardSection>
    </Card>
  );
}
