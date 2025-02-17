import { createRoutesStub } from 'react-router';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Search } from './Search';
import { loader } from '../../routes/action.search';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router';
import { db } from 'tests/mocks/db';
import { getYear } from 'date-fns';

it('should search', async () => {
  const testMovie = db.movie.getAll()[0];
  const user = userEvent.setup();
  const Stub = createRoutesStub([
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
      <Stub initialEntries={['/']} />
    </MantineProvider>,
  );

  expect(await screen.findByRole('searchbox')).toBeInTheDocument();
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
