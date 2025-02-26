import { createRoutesStub } from 'react-router';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import PersonPage, { loader } from '../app/routes/person.$id';
import { db, mswGetPersonCast } from './mocks/db';

it('should render', async () => {
  const person = db.person.getAll()[0]!;
  const movies = mswGetPersonCast(person.id);

  const Stub = createRoutesStub([
    {
      path: '/person/:id',
      Component: PersonPage,
      loader,
    },
  ]);

  render(
    <MantineProvider>
      <Stub initialEntries={[`/person/${person.id}`]} />
    </MantineProvider>,
  );

  expect(
    await screen.findByRole('heading', {
      name: person.name,
    }),
  ).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByTestId('skeleton'));

  expect(screen.getAllByTestId('media-card')).toHaveLength(movies.length);
});
