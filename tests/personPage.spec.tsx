import { createRoutesStub } from 'react-router';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import PersonPage, { loader } from '../app/routes/person.$id';
import { db, mswGetPersonCast } from './mocks/db';

it('should render and sort', async () => {
  const user = userEvent.setup();

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

  let titleElements = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);
  //default sort by popularity
  let expectedTitles = movies
    .sort((a, b) => b.popularity - a.popularity)
    .map(item => item.title);

  expect(titleElements).toEqual(expectedTitles);

  await user.click(screen.getByRole('textbox'));
  await user.click(screen.getByRole('option', { name: /release Date/i }));
  await waitFor(() =>
    expect(screen.getByRole('textbox')).toHaveValue('Release Date'),
  );

  titleElements = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);

  expectedTitles = movies
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
    )
    .map(item => item.title);
  expect(titleElements).toEqual(expectedTitles);
});
