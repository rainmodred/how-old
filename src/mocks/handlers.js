import { BASE_URL } from '@/utils/api';
import { rest } from 'msw';

import {
  mockedPersons,
  mockedMovie,
  mockedTvShow,
  mockedTvShowSeasonCredits,
  mockedSearch,
  mockedApiSearch,
  mockedApiMovie,
  mockedApiTvShow,
  mockedSeasons,
} from './mocks';

export const handlers = [
  rest.get('*/api/search/multi', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: mockedApiSearch,
      }),
    );
  }),

  rest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/movie/:id`,
    (req, res, ctx) => {
      const { id } = req.params;

      const castFromApi = mockedApiMovie[id];
      if (!castFromApi) {
        return res(ctx.status(404), ctx.json({}));
      }

      return res(ctx.status(200), ctx.json(castFromApi));
    },
  ),

  rest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tv/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const season = req.url.searchParams.get('season');
      if (!mockedApiTvShow[id]) {
        return res(ctx.status(404), ctx.json({}));
      }

      const cast = mockedApiTvShow[id][season];
      const seasons = mockedSeasons;

      return res(
        ctx.status(200),
        ctx.json({
          cast,
          seasons,
        }),
      );
    },
  ),

  rest.get(`${BASE_URL}/search/multi`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockedSearch));
  }),

  rest.get(`${BASE_URL}/movie/:id/credits`, (req, res, ctx) => {
    const { id } = req.params;

    if (id !== '24428') {
      return res(ctx.status(404), ctx.json({}));
    }

    return res(ctx.status(200), ctx.json(mockedMovie));
  }),

  rest.get(`${BASE_URL}/tv/:id`, (req, res, ctx) => {
    const { id } = req.params;

    if (id !== '1668') {
      return res.ctx.status(404), ctx.json({});
    }

    return res(ctx.status(200), ctx.json(mockedTvShow));
  }),

  rest.get(`${BASE_URL}/tv/:id/season/:seasonID/credits`, (req, res, ctx) => {
    const { seasonID } = req.params;
    return res(ctx.status(200), ctx.json(mockedTvShowSeasonCredits[seasonID]));
  }),

  rest.get(`${BASE_URL}/person/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const person = mockedPersons[id];

    return res(ctx.status(200), ctx.json(person));
  }),
];
