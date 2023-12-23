import { BASE_URL } from '@/utils/api';
import { rest, http, HttpResponse } from 'msw';

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
  http.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search/multi`, () => {
    console.log('captired api/search');
    return HttpResponse.json({ results: mockedApiSearch });
    // return res(
    //   ctx.status(200),
    //   ctx.json({
    //     results: mockedApiSearch,
    //   }),
    // );
  }),

  http.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/movie/:id`,
    // (req, res, ctx) => {
    //   console.log('captired api/movie');
    //   const { id } = req.params;

    //   const cast = mockedApiMovie[id];
    //   if (!cast) {
    //     return res(ctx.status(404), ctx.json({}));
    //   }

    //   return res(ctx.status(200), ctx.json({ cast }));
    // },
  ),

  http.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tv/:id`, () => {
    console.log('captired api/tv');
    // const { id } = req.params;
    // const season = req.url.searchParams.get('season');
    // if (!mockedApiTvShow[id]) {
    //   return res(ctx.status(404), ctx.json({}));
    // }

    // const cast = mockedApiTvShow[id][season];
    // const seasons = mockedSeasons;

    // return res(
    //   ctx.status(200),
    //   ctx.json({
    //     cast,
    //     seasons,
    //   }),
    // );
  }),
];
