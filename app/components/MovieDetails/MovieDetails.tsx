import { Card, Box, Title, Group, Image, Text } from '@mantine/core';
import { formatDistanceStrict } from 'date-fns';
import { customFormatDate, formatMinutes } from '~/utils/dates';
import { Movie } from '~/utils/types';
import classes from './MovieDetails.module.css';

interface Props {
  movie: Movie;
}

export default function MovieDetails({ movie }: Props) {
  return (
    <Card className={classes.grid} mb="md">
      <Card.Section className={classes.img} style={{ flexShrink: 0 }}>
        <Image
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
          radius={4}
          alt={movie.title}
          width="185"
          height="278"
        />
      </Card.Section>

      <Box className={classes.title} p="sm">
        <Title size="h2" mt="xs">
          {movie.title}
        </Title>
        <Group gap="sm">
          <Text size="sm">
            {movie.genres.map(genre => genre.name).join(', ')}
          </Text>
          <Text size="sm">{formatMinutes(movie.runtime)}</Text>
        </Group>

        <Text size="sm">
          {customFormatDate(movie.release_date)} (
          {formatDistanceStrict(movie.release_date, new Date())} ago)
        </Text>
      </Box>

      <Box className={classes.overview} p="sm">
        <Title mt="xs" order={4}>
          Overview
        </Title>
        <Text>{movie.overview}</Text>
      </Box>
    </Card>
  );
}
