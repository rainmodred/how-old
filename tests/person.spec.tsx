import { createRemixStub } from '@remix-run/testing';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import PersonPage, { loader } from '../app/routes/person.$id';
import { mswPersonMovies } from './mocks/db';

it('should search', async () => {
  const user = userEvent.setup();

  const personId = 109;
  const movies = mswPersonMovies(personId);
  const RemixStub = createRemixStub([
    {
      path: '/person/:id',
      Component: PersonPage,
      loader,
    },
  ]);

  render(
    <MantineProvider>
      <RemixStub initialEntries={[`/person/${personId}`]} />
    </MantineProvider>,
  );

  expect(
    await screen.findByRole('heading', {
      name: /elijah wood/i,
    }),
  ).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByTestId('skeleton'));

  expect(screen.getAllByTestId('movie-card')).toHaveLength(3);

  let titleElements = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);
  //default sort by popularity
  let expectedTitles = movies
    .sort((a, b) => b.popularity - a.popularity)
    .map(item => item.title);
  expect(titleElements).toEqual(expectedTitles);

  await user.click(screen.getByRole('textbox'));
  await user.click(screen.getByRole('option', { name: 'Release Date' }));

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
