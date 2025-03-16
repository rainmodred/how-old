import { Box, Group, Skeleton, Table } from '@mantine/core';

function Row() {
  return (
    <Table.Tr>
      <Table.Td w={'1%'}>
        <Skeleton height={150} width={100} radius="xs" />
      </Table.Td>
      <Table.Td>
        <Box>
          <Skeleton height={8} width="100px" mb="xs" />
          <Skeleton height={8} width="120px" mb="xs" />
          <Skeleton height={8} width="150px" />
        </Box>
      </Table.Td>
      <Table.Td ta="center" align="center">
        <Group justify="center">
          <Skeleton height={8} width={12} />
        </Group>
      </Table.Td>
      <Table.Td ta="center">
        <Group justify="center">
          <Skeleton height={8} width={12} />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

export function SkeletonTable({ rows }: { rows: number }) {
  return (
    <Table data-testid="skeleton-table">
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <Skeleton height={8} width={36} />
          </Table.Th>
          <Table.Th ta="center">
            <Group justify="center">
              <Skeleton height={8} width={36} />
            </Group>
          </Table.Th>
          <Table.Th ta="center">
            <Group justify="center">
              <Skeleton height={8} width={36} />
            </Group>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <Row key={index} />
        ))}
      </Table.Tbody>
    </Table>
  );
}
