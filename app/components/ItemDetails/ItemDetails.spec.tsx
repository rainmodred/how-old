import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { db } from 'tests/mocks/db';
import { formatDistanceStrict } from 'date-fns';
import { customFormatDate, formatMinutes } from '~/utils/dates';
import ItemDetails from './ItemDetails';

it('should render', async () => {
  const movie = db.movie.getAll()[0];

  render(
    <MantineProvider>
      <ItemDetails
        title={movie.title}
        genres={movie.genres}
        overview={movie.overview}
        poster_path={movie.poster_path}
        release_date={movie.release_date}
        runtime={movie.runtime}
      />
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
