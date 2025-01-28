import { Card, Image, Title, Text, Box } from '@mantine/core';
import { Person } from '~/utils/api.server';
import { formatDate } from '~/utils/dates';
import classes from './PersonCard.module.css';
import { formatDistanceStrict } from 'date-fns';

interface Props {
  person: Person;
}

export default function PersonCard({ person }: Props) {
  if (!person) {
    return null;
  }

  return (
    <Card p="md" className={classes.card}>
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
          {formatBirthday(person)}
        </Text>

        {person.deathday && (
          <Text>
            <strong style={{ display: 'block' }}>Day of Death</strong>
            {formatDeathday(person)}
          </Text>
        )}

        {person.place_of_birth && (
          <Text>
            <strong style={{ display: 'block' }}>Place of Birth</strong>
            {person.place_of_birth}
          </Text>
        )}
      </Box>
    </Card>
  );
}

function formatBirthday(person: Person) {
  if (!person.birthday) {
    return 'unknown';
  }

  const formattedDate = formatDate(person.birthday);
  const years = !person.deathday
    ? `(${formatDistanceStrict(new Date(), person.birthday)} old)`
    : '';

  return `${formattedDate} ${years}`;
}

function formatDeathday(person: Person) {
  if (!person.deathday) {
    return 'unknown';
  }

  const formattedDate = formatDate(person.deathday);
  const years = `(${formatDistanceStrict(person.deathday, person.birthday)} old)`;

  return `${formattedDate} ${years}`;
}
