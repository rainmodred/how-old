import { Box, Image, Table, Text, Button, Loader, Group } from '@mantine/core';
import { Link } from 'react-router';
import { CastWithDates } from '~/api/getCastWithDates';
import { baseImageUrl } from '~/utils/constants';
import { calculateAges } from '~/utils/dates';
import useLoadMore from './useLoadMore';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ProfileImageProps {
  id: number;
  src: string | undefined | null;
  alt: string;
}

function ProfileImage({ id, src, alt }: ProfileImageProps) {
  return (
    <Box component={Link} to={`/person/${id}`} style={{ width: '85px' }}>
      <Image
        fallbackSrc="/movieFallback.svg"
        onError={e => {
          e.currentTarget.src = '/movieFallback.svg';
        }}
        loading="lazy"
        src={`${baseImageUrl}/w185/${src}`}
        radius={4}
        alt={alt}
        w={100}
      />
    </Box>
  );
}

interface PersonsProps {
  initialCast: CastWithDates;
  releaseDate: string;
  hasMore: boolean;
}

export function Persons({ initialCast, releaseDate, hasMore }: PersonsProps) {
  const { persons, isLoading, ref } = useLoadMore(initialCast, hasMore);

  return (
    <>
      <Table className="table-sm" stickyHeader id="persons">
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Actor</Table.Th>
            <Table.Th ta="center" style={{ whiteSpace: 'nowrap' }}>
              Age then
            </Table.Th>
            <Table.Th ta="center" style={{ whiteSpace: 'nowrap' }}>
              Age now
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {persons.map((person, i) => {
            const { ageThen, ageNow } = calculateAges(releaseDate, {
              birthday: person.birthday,
              deathday: person.deathday,
            });

            return (
              <Table.Tr key={person.id} ref={persons.length - 1 ? ref : null}>
                <Table.Td w={'1%'}>
                  <ProfileImage
                    id={person.id}
                    src={person.profile_path}
                    alt={person.name}
                  />
                </Table.Td>
                <Table.Td>
                  <Box>
                    <Text fw="700">{person.name}</Text>
                    <Text>{person.character ? person.character : '-'}</Text>
                    <Text>
                      Birthday: {person.birthday ? person.birthday : '-'}
                    </Text>
                  </Box>
                </Table.Td>
                <Table.Td ta="center">{ageThen ? ageThen : '-'}</Table.Td>
                <Table.Td ta="center">
                  {person.deathday
                    ? ` ${person.deathday} (${ageNow})`
                    : ageNow
                      ? ageNow
                      : '-'}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {isLoading && (
        <Group mt="md" justify="center">
          <Loader data-testid="spinner" />
        </Group>
      )}
    </>
  );
}
