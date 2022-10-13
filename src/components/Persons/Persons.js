import { Table } from '@mantine/core';

import Person from '@/components/Persons/Person/Person';
import PersonSkeleton from './Person/PersonSkeleton';

export default function Persons({ persons, isLoading }) {
  return (
    <Table size="sm" className="table-sm">
      <thead>
        <tr>
          <th>Actor</th>
          <th>Age then</th>
          <th>Age now</th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <PersonSkeleton key={index} />
            ))
          : persons?.map(person => <Person key={person.id} person={person} />)}
      </tbody>
    </Table>
  );
}
