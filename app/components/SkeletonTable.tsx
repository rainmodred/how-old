import { Box, Group, Skeleton, Table } from '@mantine/core';

function PersonSkeleton() {
  return (
    <Table.Tr>
      <Table.Td>
        <Group align="center" wrap="nowrap">
          <Skeleton height={100} width={60} radius="xs" />
          <Box>
            <Skeleton data-testid="skeleton" height={8} width="100px" mb="xs" />
            <Skeleton height={8} width="100px" mb="xs" />
            <Skeleton height={8} width="100px" />
          </Box>
        </Group>
      </Table.Td>
      <Table.Td>
        <Skeleton height={8} width={12} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={8} width={12} />
      </Table.Td>
    </Table.Tr>
  );
}

export function SkeletonTable({ rows }: { rows: number }) {
  return (
    <Table>
      <Table.Tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <PersonSkeleton key={index} />
        ))}
      </Table.Tbody>
    </Table>
  );
}
