import { Button, Container, Group, Title } from '@mantine/core';
import classes from './ServerError.module.css';
import { Link } from '@remix-run/react';

export function ServerError() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Something bad just happened...</Title>
        <Group justify="center">
          <Button component={Link} to="/" variant="subtle" size="md">
            Go Back
          </Button>
        </Group>
      </Container>
    </div>
  );
}
