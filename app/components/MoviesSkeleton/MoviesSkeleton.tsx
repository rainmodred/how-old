import { Grid, Skeleton } from '@mantine/core';
import classes from './MoviesSkeleton.module.css';

export function MoviesSkeleton() {
  return Array.from({ length: 12 }).map((_, i) => {
    return (
      <Grid.Col key={i} span={{ base: 6, md: 4, lg: 3 }}>
        <Skeleton className={classes.skeleton} width="100%" />
      </Grid.Col>
    );
  });
}
