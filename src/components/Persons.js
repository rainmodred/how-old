import { Spinner, Table, Thead, Th, Tr, Tbody } from '@chakra-ui/react';

import Person from '@/components/Person';

export default function Persons({ persons, isLoading }) {
  return (
    <>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Actor</Th>
              <Th isNumeric>Age then</Th>
              <Th isNumeric>Age now</Th>
            </Tr>
          </Thead>
          <Tbody>
            {persons.map(person => (
              <Person key={person.id} person={person} />
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}
