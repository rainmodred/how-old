import { Card, CardSection, Image, Text, Title, Anchor } from '@mantine/core';
import { Link } from 'react-router';
import { NormalizedCast } from '~/api/getPersonCredits';
import { baseImageUrl } from '~/utils/constants';
import { customFormatDate, customFormatDistance } from '~/utils/dates';

interface Props {
  item: Partial<Pick<NormalizedCast, 'character' | 'media_type'>> &
    Pick<NormalizedCast, 'id' | 'title' | 'release_date' | 'poster_path'>;
  birthday?: string | null;
}

export function MediaCard({ item, birthday }: Props) {
  const {
    id,
    title,
    release_date: releaseDate,
    poster_path: posterPath,
    media_type: mediaType = 'movie',
  } = item;

  const showAge = birthday && mediaType === 'movie';
  return (
    <Card
      data-testid="media-card"
      radius="md"
      shadow="sm"
      h="100%"
      styles={{ root: { flexShrink: 0 } }}
    >
      <Anchor
        underline="never"
        c="var(--mantine-color-text)"
        component={Link}
        to={buildLink(id, mediaType)}
      >
        <CardSection>
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
        </CardSection>
        <CardSection w="185" p="sm">
          <Title order={3} fw={700} size="md">
            {title}
          </Title>

          {item.character && (
            <Text size="sm">
              as <strong>{item.character}</strong>
            </Text>
          )}
          <Text size="sm">{customFormatDate(releaseDate)}</Text>
          <Text size="sm">
            released:{' '}
            <strong>{`${customFormatDistance(releaseDate, new Date())} ago`}</strong>
          </Text>

          {showAge && (
            <Text size="sm">
              age: <strong>{formatText(birthday, releaseDate)}</strong>
            </Text>
          )}
        </CardSection>
      </Anchor>
    </Card>
  );
}

//TODO: type alias for media type?
function buildLink(id: number, mediaType: 'movie' | 'tv') {
  if (mediaType === 'movie') {
    return `/movie/${id}`;
  }
  return `/tv/${id}/season/1`;
}

function formatText(birthday: string | null, releaseDate: string): string {
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
