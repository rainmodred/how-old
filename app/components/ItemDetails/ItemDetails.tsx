import { Card, Box, Title, Group, Image, Text } from '@mantine/core';
import {
  customFormatDate,
  customFormatDistance,
  formatMinutes,
} from '~/utils/dates';
import classes from './ItemDetails.module.css';
import { Genre } from '~/api/getMovie.server';

interface Props {
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: Genre[];
  runtime?: number;
}

export default function ItemDetails({
  overview,
  runtime,
  release_date,
  poster_path,
  title,
  genres,
}: Props) {
  return (
    <Card className={classes.grid} mb="md">
      <Card.Section className={classes.img} style={{ flexShrink: 0 }}>
        <Image
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w342/${poster_path}`}
          radius={4}
          alt={title}
          width="185"
          height="278"
        />
      </Card.Section>

      <Box className={classes.meta} p="sm">
        <Title size="h2" mt="xs">
          {title}
        </Title>
        <Group gap="sm">
          <Text size="sm">{genres.map(genre => genre.name).join(', ')}</Text>
          {runtime && <Text size="sm">{formatMinutes(runtime)}</Text>}
        </Group>

        <Text size="sm">
          {customFormatDate(release_date)} (
          {customFormatDistance(release_date, new Date())} ago)
        </Text>
      </Box>

      <Box className={classes.overview} p="sm">
        <Title mt="xs" order={4}>
          Overview
        </Title>
        <Text>{overview}</Text>
      </Box>
    </Card>
  );
}
