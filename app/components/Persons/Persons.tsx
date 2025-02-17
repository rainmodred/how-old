import { Box, Image, Group, Table, Text, Button } from '@mantine/core';
import { Link } from 'react-router';
import { CastWithDates } from '~/utils/api.server';
import { baseImageUrl } from '~/utils/constants';
import { calculateAges } from '~/utils/dates';
import useLoadMore from './useLoadMore';

interface ProfileImageProps {
  id: number;
  src: string;
  alt: string;
}

function ProfileImage({ id, src, alt }: ProfileImageProps) {
  return (
    <Box component={Link} to={`/person/${id}`} style={{ width: '85px' }}>
      <Image
        loading="lazy"
        src={src ? `${baseImageUrl}/${src}` : '/profileFallback.svg'}
        radius={4}
        alt={alt}
      />
    </Box>
  );
}

interface PersonsProps {
  initialCast: CastWithDates;
  releaseDate: string;
  done: boolean;
}

export function Persons({ initialCast, releaseDate, done }: PersonsProps) {
  const { persons, isDone, isLoading, loadMore } = useLoadMore(
    initialCast,
    done,
  );

  return (
    <>
      <Table className="table-sm" stickyHeader id="persons">
        <Table.Thead>
          <Table.Tr>
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
          {persons.map(
            ({ id, name, character, birthday, deathday, profile_path }) => {
              const { ageThen, ageNow } = calculateAges(releaseDate, {
                birthday,
                deathday,
              });

              return (
                <Table.Tr key={id}>
                  <Table.Td>
                    <Group wrap="nowrap">
                      <ProfileImage id={id} src={profile_path} alt={name} />
                      <Box>
                        <Text fw="700">{name}</Text>
                        <Text>{character}</Text>
                        <Text>Birthday: {birthday ? birthday : '-'}</Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td ta="center">{ageThen ? ageThen : '-'}</Table.Td>
                  <Table.Td ta="center">
                    {deathday
                      ? ` ${deathday} (${ageNow})`
                      : ageNow
                        ? ageNow
                        : '-'}
                  </Table.Td>
                </Table.Tr>
              );
            },
          )}
        </Table.Tbody>
      </Table>

      {!isDone && (
        <Button
          loading={isLoading}
          disabled={isLoading}
          variant="default"
          m={'sm'}
          size="sm"
          onClick={loadMore}
        >
          load more
        </Button>
      )}
    </>
  );
}
