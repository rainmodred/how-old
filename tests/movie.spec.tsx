import { createRemixStub } from '@remix-run/testing';
import { expect, it } from 'vitest';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { db } from 'tests/mocks/db';
import MoviePage, { loader, shouldRevalidate } from '~/routes/movie.$id';
import { loader as castLoader } from '~/routes/movie.$id.cast';
import { LIMIT } from '~/utils/constants';

it('should load more persons', async () => {
  const testMovie = db.movie.getAll()[0];
  const actorsLength = testMovie.actors.length;
  const user = userEvent.setup();

  const RemixStub = createRemixStub([
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
      <RemixStub initialEntries={[`/movie/${testMovie.id}`]} />
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

  await waitForElementToBeRemoved(loadMoreButton);

  expect(await screen.findAllByRole('row')).toHaveLength(actorsLength + 1);
});
