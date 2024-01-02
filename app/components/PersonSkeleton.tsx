import { Group, Box, Skeleton, Table } from '@mantine/core';

export function PersonSkeleton() {
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
