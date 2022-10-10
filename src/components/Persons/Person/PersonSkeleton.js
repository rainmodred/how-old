import { Group, Box, Skeleton } from '@mantine/core';

export default function PersonSkeleton() {
  return (
    <tr>
      <td>
        <Group align="center" noWrap>
          <Skeleton height={100} width={60} radius="xs" />
          <Box>
            <Skeleton data-testid="skeleton" height={8} width="100px" mb="xs" />
            <Skeleton height={8} width="100px" mb="xs" />
            <Skeleton height={8} width="100px" />
          </Box>
        </Group>
      </td>
      <td>
        <Skeleton height={8} width={12} />
      </td>
      <td>
        <Skeleton height={8} width={12} />
      </td>
    </tr>
  );
}
