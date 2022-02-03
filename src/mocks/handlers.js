import { rest } from 'msw';

import {
  mockedPersons,
  mockedMovie,
  mockedTvShow,
  mockedTvShowSeasonCredits,
  mockedApiTvShow,
  mockedApiMovie,
  mockedSeasons,
  mockedSearch,
} from './mocks';

export const handlers = [
  rest.get('*/api/search/multi', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: mockedSearch,
      }),
    );
  }),

  rest.get('*/api/tv/:id', (req, res, ctx) => {
    const season = req.url.searchParams.get('season');

    return res(
      ctx.status(200),
      ctx.json({
        cast: mockedApiTvShow[season],
        seasons: mockedSeasons,
      }),
    );
  }),

  rest.get('*/api/movie/:id', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockedApiMovie));
  }),

  rest.get(
    'https://api.themoviedb.org/3/movie/:id/credits',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockedMovie));
    },
  ),

  rest.get('https://api.themoviedb.org/3/tv/:id', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockedTvShow));
  }),

  rest.get(
    'https://api.themoviedb.org/3/tv/:id/season/:seasonID/credits',
    (req, res, ctx) => {
      const { seasonID } = req.params;
      return res(
        ctx.status(200),
        ctx.json(mockedTvShowSeasonCredits[seasonID]),
      );
    },
  ),

  rest.get('https://api.themoviedb.org/3/person/:id', (req, res, ctx) => {
    const { id } = req.params;
    const person = mockedPersons[id];

    return res(ctx.status(200), ctx.json(person));
  }),
];
