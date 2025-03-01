import { Box, Image, Table, Text, Button } from '@mantine/core';
import { Link } from 'react-router';
import { CastWithDates } from '~/api/getCastWithDates';
import { baseImageUrl } from '~/utils/constants';
import { calculateAges } from '~/utils/dates';
import useLoadMore from './useLoadMore';

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
  const { persons, isLoaded, isLoading, loadMore } = useLoadMore(
    initialCast,
    hasMore,
  );

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
          {persons.map(
            ({ id, name, character, birthday, deathday, profile_path }) => {
              const { ageThen, ageNow } = calculateAges(releaseDate, {
                birthday,
                deathday,
              });

              return (
                <Table.Tr key={id}>
                  <Table.Td w={'1%'}>
                    <ProfileImage id={id} src={profile_path} alt={name} />
                  </Table.Td>
                  <Table.Td>
                    <Box>
                      <Text fw="700">{name}</Text>
                      <Text>{character ? character : '-'}</Text>
                      <Text>Birthday: {birthday ? birthday : '-'}</Text>
                    </Box>
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

      {!isLoaded && (
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
