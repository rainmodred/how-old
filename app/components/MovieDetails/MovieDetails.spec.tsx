import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import MovieDetails from './MovieDetails';
import { db } from 'tests/mocks/db';
import { formatDistanceStrict } from 'date-fns';
import { customFormatDate, formatMinutes } from '~/utils/dates';

it('should render', async () => {
  const movie = db.movie.getAll()[0];

  render(
    <MantineProvider>
      <MovieDetails movie={movie} />
    </MantineProvider>,
  );

  expect(
    screen.getByRole('heading', { name: movie.title, level: 1 }),
  ).toBeInTheDocument();

  expect(
    screen.getByText(movie.genres.map(g => g.name).join(', ')),
  ).toBeInTheDocument();

  const releaseDateText = `${customFormatDate(movie.release_date)} (${formatDistanceStrict(movie.release_date, new Date())} ago)`;
  expect(screen.getByText(releaseDateText)).toBeInTheDocument();
  expect(screen.getByText(formatMinutes(movie.runtime))).toBeInTheDocument();

  expect(
    screen.getByRole('heading', { name: 'Overview', level: 4 }),
  ).toBeInTheDocument();

  expect(screen.getByText(movie.overview)).toBeInTheDocument();
});
