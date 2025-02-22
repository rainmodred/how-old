import { Card, CardSection, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { baseImageUrl } from '~/utils/constants';
import { customFormatDate } from '~/utils/dates';

interface Props {
  text: string;
  id: number;
  poster_path: string;
  release_date: string;
  title: string;
}

export function MovieCard({
  id,
  poster_path,
  release_date,
  title,
  text,
}: Props) {
  return (
    <Card
      data-testid="movie-card"
      radius="md"
      shadow="sm"
      h="100%"
      styles={{ root: { flexShrink: 0 } }}
    >
      <CardSection>
        <Link to={`/movie/${id}`}>
          <Image
            fallbackSrc="/movieFallback.svg"
            onError={e => {
              e.currentTarget.src = '/movieFallback.svg';
            }}
            loading="lazy"
            alt={title}
            src={`${baseImageUrl}/w342/${poster_path}`}
            width={342}
            height={513}
            h="auto"
          />
        </Link>
      </CardSection>
      <CardSection w="185" p="sm">
        <Title order={3} fw={700} size="md">
          {title}
        </Title>
        <Text size="sm">{customFormatDate(release_date)}</Text>
        <Text size="sm">
          <strong>{text}</strong>
        </Text>
      </CardSection>
    </Card>
  );
}
