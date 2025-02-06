import { delay, http, HttpResponse } from 'msw';
import { API_URL } from '~/utils/constants';
import { db, mswPersonMovies } from './db';

export const handlers = [
  http.get(`${API_URL}/search/multi`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    if (!query) {
      return HttpResponse.json({
        page: 1,
        results: [],
        totalPages: 0,
        total_reuslts: 0,
      });
    }

    //Case insensitive search is not supported
    const results = [
      ...db.movie.findMany({
        where: { title: { contains: query } },
      }),
      ...db.tv.findMany({
        where: { name: { contains: query } },
      }),
      ...db.person.findMany({
        where: { name: { contains: query } },
      }),
    ];

    return HttpResponse.json({
      page: 1,
      results,
      totalPages: 1,
      total_results: results.length,
    });
  }),

  http.get(`${API_URL}/discover/movie`, async () => {
    await delay();
    return HttpResponse.json({ page: 1, results: db.movie.getAll() });
  }),

  http.get(`${API_URL}/movie/:id`, async ({ params }) => {
    await delay();

    const { id } = params;
    if (typeof id === 'string') {
      return HttpResponse.json(
        db.movie.findFirst({ where: { id: { equals: Number(id) } } }),
      );
    }

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),

  http.get(`${API_URL}/movie/:id/credits`, async ({ params }) => {
    await delay();
    const { id } = params;
    if (id) {
      const res = db.cast.findFirst({
        where: { id: { equals: Number(id) } },
      });

      if (!res) {
        return HttpResponse.json({
          success: false,
          status_code: 34,
          status_message: 'The resource you requested could not be found.',
        });
      }
      return HttpResponse.json({
        id,
        cast: res.actors,
      });
    }

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),
  http.get(`${API_URL}/tv/:id`, async () => {
    await delay();
    return HttpResponse.json({
      id: 84773,
      name: 'The Lord of the Rings: The Rings of Power',
      first_air_date: '2022-09-01',
      seasons: [
        {
          air_date: '2022-09-03',
          episode_count: 26,
          id: 311036,
          name: 'Specials',
          overview: '',
          poster_path: '/tRaU2w0S8aRSfNmkSxesaO4DAhe.jpg',
          season_number: 0,
          vote_average: 0,
        },
        {
          air_date: '2022-09-01',
          episode_count: 8,
          id: 114041,
          name: 'Season 1',
          overview: '',
          poster_path: '/umRaUV2ku9MMtEunMQt3uCO1OgE.jpg',
          season_number: 1,
          vote_average: 6.4,
        },
      ],
    });
  }),

  http.get(
    `${API_URL}/tv/:id/season/:seasonNumber/credits`,
    async ({ params }) => {
      await delay();
      const { id } = params;
      if (id) {
        const tv = db.cast.findFirst({
          where: { id: { equals: Number(id) } },
        });
        return HttpResponse.json({ id, cast: tv?.actors });
      }

      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    },
  ),

  http.get(`${API_URL}/person/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    if (typeof id === 'string') {
      return HttpResponse.json(
        db.person.findFirst({ where: { id: { equals: Number(id) } } }),
      );
    }

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),

  http.get(`${API_URL}/person/:id/movie_credits`, async ({ params }) => {
    await delay(100);
    const id = Number(params.id);
    const movies = mswPersonMovies(id);

    return HttpResponse.json({ cast: movies });

    // return HttpResponse.json({
    //   success: false,
    //   status_code: 34,
    //   status_message: 'The resource you requested could not be found.',
    // });
  }),
];
