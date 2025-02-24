import { Card, CardSection, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { baseImageUrl } from '~/utils/constants';
import { customFormatDate } from '~/utils/dates';

interface Props {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  mediaType: 'movie' | 'tv';
  text: string;
}

export function MediaCard({
  id,
  title,
  releaseDate,
  posterPath,
  mediaType,
  text,
}: Props) {
  return (
    <Card
      data-testid="media-card"
      radius="md"
      shadow="sm"
      h="100%"
      styles={{ root: { flexShrink: 0 } }}
    >
      <CardSection>
        <Link to={buildLink(id, mediaType)}>
          <Image
            fallbackSrc="/movieFallback.svg"
            onError={e => {
              e.currentTarget.src = '/movieFallback.svg';
            }}
            loading="lazy"
            alt={title}
            src={`${baseImageUrl}/w342/${posterPath}`}
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
        <Text size="sm">{customFormatDate(releaseDate)}</Text>
        <Text size="sm">
          <strong>{text}</strong>
        </Text>
      </CardSection>
    </Card>
  );
}

function buildLink(id: number, mediaType: 'movie' | 'tv') {
  if (mediaType === 'movie') {
    return `/movie/${id}`;
  }
  return `/tv/${id}`;
}
