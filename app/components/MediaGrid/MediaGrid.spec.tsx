import { createRoutesStub } from 'react-router';
import { expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Grid, MantineProvider } from '@mantine/core';
import { filterOptions, MediaGrid } from './MediaGrid';
import {
  createFakeMovie,
  createFakePerson,
  createFakeTv,
} from 'tests/mocks/db';
import { MediaItems } from '~/api/getPersonCredits';

it('should render filter', async () => {
  const user = userEvent.setup();

  const person = createFakePerson();
  const items: MediaItems = [];

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <MediaGrid person={person} mediaItems={items} />,
    },
  ]);

  render(
    <MantineProvider>
      <Grid>
        <Stub initialEntries={[`/`]} />
      </Grid>
    </MantineProvider>,
  );

  await user.click(screen.getByPlaceholderText('filter by'));

  for (const item of filterOptions) {
    expect(screen.getByRole('option', { name: item.label })).toHaveAttribute(
      'value',
      item.value,
    );
  }

  expect(
    screen.getByRole('option', { name: filterOptions[0]?.label }),
  ).toHaveAttribute('data-checked', 'true');
});

it('should filter by movie', async () => {
  const person = createFakePerson();
  const fakeMovies = Array.from({ length: 2 }, () => ({
    ...createFakeMovie(),
    character: 'Joe',
  }));
  const fakeTvShows = [
    {
      ...createFakeTv(),
      character: 'Joe',
      release_date: createFakeTv().first_air_date,
    },
  ];

  const mediaItems: MediaItems = [...fakeMovies, ...fakeTvShows];

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <MediaGrid person={person} mediaItems={mediaItems} />,
    },
  ]);

  render(
    <MantineProvider>
      <Grid>
        <Stub initialEntries={[`/`]} />
      </Grid>
    </MantineProvider>,
  );

  const titles = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);

  expect(titles).toHaveLength(fakeMovies.length);
});

it('should filter by tv', async () => {
  const user = userEvent.setup();

  const person = createFakePerson();
  const fakeMovies = Array.from({ length: 2 }, () => ({
    ...createFakeMovie(),
    character: 'Joe',
  }));
  const fakeTvShows = [
    {
      ...createFakeTv(),
      character: 'Joe',
      release_date: createFakeTv().first_air_date,
    },
  ];

  const mediaItems: MediaItems = [...fakeMovies, ...fakeTvShows];

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <MediaGrid person={person} mediaItems={mediaItems} />,
    },
  ]);

  render(
    <MantineProvider>
      <Grid>
        <Stub initialEntries={[`/`]} />
      </Grid>
    </MantineProvider>,
  );

  await user.click(screen.getByPlaceholderText('filter by'));
  await user.click(screen.getByRole('option', { name: /tv/i }));

  const titles = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);

  expect(titles).toHaveLength(fakeTvShows.length);
});

it('should sort', async () => {
  const user = userEvent.setup();

  const person = createFakePerson();
  const fakeMovies = Array.from({ length: 2 }, () => ({
    ...createFakeMovie(),
    character: 'Joe',
  }));

  const mediaItems: MediaItems = [...fakeMovies];

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: () => <MediaGrid person={person} mediaItems={mediaItems} />,
    },
  ]);

  render(
    <MantineProvider>
      <Grid>
        <Stub initialEntries={[`/`]} />
      </Grid>
    </MantineProvider>,
  );

  let titles = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);
  //default sort by popularity
  let expectedTitles = mediaItems
    .sort((a, b) => b.popularity - a.popularity)
    .map(item => item.title);

  expect(titles).toEqual(expectedTitles);

  await user.click(screen.getByPlaceholderText('sort by'));
  await user.click(screen.getByRole('option', { name: /release Date/i }));
  await waitFor(() =>
    expect(screen.getByPlaceholderText('sort by')).toHaveValue('Release Date'),
  );

  titles = screen
    .getAllByRole('heading', { level: 3 })
    .map(el => el.textContent);

  expectedTitles = mediaItems
    .sort(
      (a, b) =>
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
    )
    .map(item => item.title);
  expect(titles).toEqual(expectedTitles);
});
