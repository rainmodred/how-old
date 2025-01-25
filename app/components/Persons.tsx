import { Box, Image, Group, Table, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import { CastWithAges } from '~/utils/api.server';
import { baseImageUrl } from '~/utils/constants';

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
  cast: CastWithAges;
}

export function Persons({ cast }: PersonsProps) {
  return (
    <Table className="table-sm" id="persons">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Actor</Table.Th>
          <Table.Th>Age then</Table.Th>
          <Table.Th>Age now</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cast.map(
          ({
            id,
            name,
            character,
            birthday,
            deathday,
            ageNow,
            ageThen,
            profile_path,
          }) => {
            return (
              <Table.Tr key={id}>
                <Table.Td>
                  <Group wrap="nowrap">
                    <ProfileImage id={id} src={profile_path} alt={name} />
                    <Box>
                      <Text fw="700">{name}</Text>
                      <Text>{character}</Text>
                      <Text>Birthday: {birthday}</Text>
                    </Box>
                  </Group>
                </Table.Td>
                <Table.Td>{ageThen}</Table.Td>
                <Table.Td>
                  {deathday ? ` ${deathday} (${ageNow})` : ageNow}
                </Table.Td>
              </Table.Tr>
            );
          },
        )}
      </Table.Tbody>
    </Table>
  );
}
