import { rest } from 'msw';

import {
  mockedPersons,
  mockedMovie,
  mockedTvShow,
  mockedTvShowSeasonCredits,
  mockedApiTvShow,
  mockedApiMovie,
  mockedSeasons,
} from './mocks';

export const handlers = [
  rest.get('/api/search/multi', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            title: 'Movies',
            items: [
              {
                adult: false,
                backdrop_path: '/nNmJRkg8wWnRmzQDe2FwKbPIsJV.jpg',
                genre_ids: [878, 28, 12],
                id: 24428,
                media_type: 'movie',
                original_language: 'en',
                original_title: 'The Avengers',
                overview:
                  'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!',
                popularity: 390.97,
                poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
                release_date: '2012-04-25',
                title: 'The Avengers',
                video: false,
                vote_average: 7.7,
                vote_count: 26262,
              },
            ],
          },
          {
            title: 'TV Shows',
            items: [
              {
                backdrop_path: '/l0qVZIpXtIo7km9u5Yqh0nKPOr5.jpg',
                first_air_date: '1994-09-22',
                genre_ids: [35, 18],
                id: 1668,
                media_type: 'tv',
                name: 'Friends',
                origin_country: ['US'],
                original_language: 'en',
                original_name: 'Friends',
                overview:
                  'Friends is an American television sitcom created by David Crane and Marta Kauffman, which aired on NBC from September 22, 1994, to May 6, 2004, lasting ten seasons. With an ensemble cast starring Jennifer Aniston, Courteney Cox, Lisa Kudrow, Matt LeBlanc, Matthew Perry and David Schwimmer, the show revolves around six friends in their 20s and 30s who live in Manhattan, New York City. The series was produced by Bright/Kauffman/Crane Productions, in association with Warner Bros. Television. The original executive producers were Kevin S. Bright, Kauffman, and Crane.',
                popularity: 339.762,
                poster_path: '/f496cm9enuEsZkSPzCwnTESEK5s.jpg',
                vote_average: 8.4,
                vote_count: 5397,
              },
            ],
          },
        ],
      }),
    );
  }),

  rest.get('/api/tv/:id/', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        cast: mockedApiTvShow,
        seasons: mockedSeasons,
      }),
    );
  }),

  rest.get('/api/movie/:id/', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockedApiMovie));
  }),

  rest.get(
    'https://api.themoviedb.org/3/movie/:id/credits',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockedMovie));
    },
  ),

  rest.get('https://api.themoviedb.org/3/tv/:id/', (_req, res, ctx) => {
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

  rest.get('https://api.themoviedb.org/3/person/:id/', (req, res, ctx) => {
    const { id } = req.params;
    const person = mockedPersons[id];

    return res(ctx.status(200), ctx.json(person));
  }),
];
