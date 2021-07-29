import { VStack, Spinner } from '@chakra-ui/react';

import Person from '@/components/Person';

export default function Persons({ persons, isLoading }) {
  return (
    <VStack mt="10" w="100%" spacing="0">
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        persons.map(person => <Person key={person.id} person={person} />)
      )}
    </VStack>
  );
}
