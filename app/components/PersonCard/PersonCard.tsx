import { Card, Image, Title, Text, Box } from '@mantine/core';
import { customFormatDate, customFormatDistance } from '~/utils/dates';
import { FormattedPersonDetails } from '~/api/getPerson.server';
import classes from './PersonCard.module.css';

interface Props {
  person: FormattedPersonDetails;
}

export default function PersonCard({ person }: Props) {
  if (!person) {
    return null;
  }

  return (
    <Card className={classes.card}>
      <Card.Section>
        <Image
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w185/${person.profile_path}`}
          radius={4}
          alt={person.name}
          width="185"
          height="278"
        />
      </Card.Section>
      <Box>
        <Title size="h2" mb="md" mt="sm">
          {person.name}
        </Title>
        <Text>
          <strong style={{ display: 'block' }}>Brithday</strong>
          {formatBirthday(person.birthday, person.deathday)}
        </Text>

        {person.deathday && (
          <Text>
            <strong style={{ display: 'block' }}>Day of Death</strong>
            {formatDeathday(person.birthday, person.deathday)}
          </Text>
        )}

        <Text>
          <strong style={{ display: 'block' }}>Place of Birth</strong>
          {person.place_of_birth ? person.place_of_birth : '-'}
        </Text>
      </Box>
    </Card>
  );
}

function formatBirthday(
  birthday: string | undefined | null,
  deathday: string | undefined | null,
) {
  if (!birthday) {
    return '-';
  }

  const date = customFormatDate(birthday);
  const years = !deathday
    ? `(${customFormatDistance(new Date(), birthday)} old)`
    : '';

  return `${date} ${years}`;
}

function formatDeathday(birthday: string | undefined | null, deathday: string) {
  const date = customFormatDate(deathday);
  const years = birthday
    ? `(${customFormatDistance(deathday, birthday)} old)`
    : '-';

  return `${date} ${years}`;
}
