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
import { db } from 'tests/mocks/db';
import MoviePage, { loader, shouldRevalidate } from '~/routes/movie.$id';
import { loader as castLoader } from '~/routes/movie.$id.cast';
import { LIMIT } from '~/utils/constants';

it('should load more persons', async () => {
  //TODO: refactor
  const movies = db.movie.getAll();
  const testMovie = movies.find(movie => movie.actors.length > 21)!;
  const expectedActorsLength = testMovie.actors.length;
  const user = userEvent.setup();

  const Stub = createRoutesStub([
    {
      path: '/movie/:id',
      Component: MoviePage,
      loader,
      children: [{ path: '/movie/:id/cast', loader: castLoader }],
      shouldRevalidate,
    },
  ]);

  render(
    <MantineProvider>
      <Stub initialEntries={[`/movie/${testMovie.id}`]} />
    </MantineProvider>,
  );

  expect(
    await screen.findByRole('heading', {
      name: testMovie.title,
    }),
  ).toBeInTheDocument();
  const skeleton = await screen.findByTestId('skeleton-table');
  await waitForElementToBeRemoved(skeleton);
  //rows + table heading
  expect(screen.getAllByRole('row')).toHaveLength(LIMIT + 1);

  const loadMoreButton = await screen.findByRole('button', {
    name: 'load more',
  });
  expect(loadMoreButton).toBeInTheDocument();

  await user.click(loadMoreButton);
  expect(loadMoreButton).toHaveAttribute('data-loading', 'true');

  await waitFor(() => {
    expect(loadMoreButton).not.toHaveAttribute('data-loading');
  });

  expect(await screen.findAllByRole('row')).toHaveLength(20 + 1);

  await user.click(loadMoreButton);
  expect(loadMoreButton).toHaveAttribute('data-loading', 'true');

  await waitForElementToBeRemoved(loadMoreButton, { timeout: 5000 });

  expect(await screen.findAllByRole('row')).toHaveLength(
    expectedActorsLength + 1,
  );
});
