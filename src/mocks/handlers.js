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
                backdrop_path: '/5HKdFlSWI6U7CjyNAHH6xJHQZHX.jpg',
                genre_ids: [878, 12],
                id: 2157,
                media_type: 'movie',
                original_language: 'en',
                original_title: 'Lost in Space',
                overview:
                  'The prospects for continuing life on Earth in the year 2058 are grim. So the Robinsons are launched into space to colonize Alpha Prime, the only other inhabitable planet in the galaxy. But when a stowaway sabotages the mission, the Robinsons find themselves hurtling through uncharted space.',
                popularity: 14.282,
                poster_path: '/4miEpZmUOMqV8P0T6oq5HVBiVHw.jpg',
                release_date: '1998-04-03',
                title: 'Lost in Space',
                video: false,
                vote_average: 5.3,
                vote_count: 878,
              },
            ],
          },
          {
            title: 'TV Shows',
            items: [
              {
                backdrop_path: '/nqzBAMnuMI0xuwtdlEcxcQafyXY.jpg',
                first_air_date: '2004-09-22',
                genre_ids: [10759, 9648],
                id: 4607,
                media_type: 'tv',
                name: 'Lost',
                origin_country: ['US'],
                original_language: 'en',
                original_name: 'Lost',
                overview:
                  'Stripped of everything, the survivors of a horrific plane crash  must work together to stay alive. But the island holds many secrets.',
                popularity: 140.372,
                poster_path: '/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg',
                vote_average: 7.9,
                vote_count: 2374,
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
