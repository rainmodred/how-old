import { Box, Group, Table, Text } from '@mantine/core';
import { ProfileImage } from './ProfileImage';
import { CastWithAges } from '~/utils/api.server';

interface Props {
  cast: CastWithAges;
}

export function Persons({ cast }: Props) {
  return (
    <Table className="table-sm">
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
                  <Group>
                    <ProfileImage src={profile_path} alt={`${name} image`} />
                    <Box>
                      <Text fw="700">{name}</Text>
                      <Text>{character}</Text>
                      <Text>Birthday: {birthday}</Text>
                    </Box>
                  </Group>
                </Table.Td>
                <Table.Td align="center">{ageThen}</Table.Td>
                <Table.Td align="center">
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
