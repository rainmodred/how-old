import { createRemixStub } from '@remix-run/testing';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Search } from './Search';
import { loader } from '../../routes/action.search';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import { db } from 'tests/mocks/db';
import { getYear } from 'date-fns';

it('should search', async () => {
  const testMovie = db.movie.getAll()[0];
  const user = userEvent.setup();
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: () => (
        <>
          <Search />
          <Outlet />
        </>
      ),
      children: [
        {
          path: 'movie/:id',
          Component: () => <p>Movie page</p>,
        },
        {
          path: 'action/search',
          loader,
        },
      ],
    },
  ]);

  render(
    <MantineProvider>
      <RemixStub initialEntries={['/']} />
    </MantineProvider>,
  );

  await waitFor(() => screen.getByRole('searchbox'));
  const searchbox = screen.getByRole('searchbox');
  await user.type(searchbox, testMovie.title.slice(0, 4));

  const loading = await screen.findByTestId('loading');
  expect(loading).toBeInTheDocument();
  await waitForElementToBeRemoved(loading);

  const title = `${testMovie.title} (${getYear(testMovie.release_date)})`;
  const movie = screen.getByRole('option', {
    name: title,
  });
  expect(movie).toBeInTheDocument();
  await user.click(movie);
  expect(await screen.findByText('Movie page')).toBeInTheDocument();
  expect(searchbox).toHaveValue('');
});
