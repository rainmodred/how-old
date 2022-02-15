import { BASE_URL } from '@/utils/api';
import { rest } from 'msw';

import {
  mockedPersons,
  mockedMovie,
  mockedTvShow,
  mockedTvShowSeasonCredits,
  mockedSearch,
  mockedApiSearch,
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

  // rest.get('*/api/tv/:id', (req, res, ctx) => {
  //   const season = req.url.searchParams.get('season');

  //   return res(
  //     ctx.status(200),
  //     ctx.json({
  //       cast: mockedApiTvShow[season],
  //       seasons: mockedSeasons,
  //     }),
  //   );
  // }),

  // rest.get('*/api/movie/:id', (req, res, ctx) => {
  //   const id = req.url.searchParams.get('id');

  //   console.log('req', req);

  //   const castFromApi = mockedApiMovie[id];
  //   if (!castFromApi) {
  //     return res(ctx.status(404), ctx.json({}));
  //   }

  //   return res(ctx.status(200), ctx.json(mockedApiMovie[id]));
  // }),

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
