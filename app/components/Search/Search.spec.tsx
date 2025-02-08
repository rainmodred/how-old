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

it('should search', async () => {
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
  await user.type(searchbox, 'the');

  const loading = await screen.findByTestId('loading');
  expect(loading).toBeInTheDocument();
  await waitForElementToBeRemoved(loading);

  const movie = screen.getByRole('option', {
    name: /the lord of the rings: the fellowship of the ring \(2001\)/i,
  });
  expect(movie).toBeInTheDocument();
  await user.click(movie);
  expect(await screen.findByText('Movie page')).toBeInTheDocument();
  expect(searchbox).toHaveValue('');
});
