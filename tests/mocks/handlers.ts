import { delay, http, HttpResponse } from 'msw';
import { API_URL } from '~/utils/constants';
import { db, genresToGenreIds, mswGetPersonCast } from './db';

export const handlers = [
  http.get(`${API_URL}/3/search/multi`, async ({ request }) => {
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
      ...db.movie
        .findMany({
          where: { title: { contains: query } },
        })
        .map(movie => ({
          ...movie,
          media_type: 'movie',
          genre_ids: genresToGenreIds(movie.genres),
        })),
      ...db.tv
        .findMany({
          where: { name: { contains: query } },
        })
        .map(tv => ({
          ...tv,
          media_type: 'tv',
          genre_ids: genresToGenreIds(tv.genres),
        })),
      ...db.person
        .findMany({
          where: { name: { contains: query } },
        })
        .map(person => ({ ...person, media_type: 'person' })),
    ];

    return HttpResponse.json({
      page: 1,
      results,
      totalPages: 1,
      total_results: results.length,
    });
  }),

  http.get(`${API_URL}/3/discover/movie`, async () => {
    await delay();
    return HttpResponse.json({ page: 1, results: db.movie.getAll() });
  }),

  http.get(`${API_URL}/3/movie/:id`, async ({ params }) => {
    await delay();

    const { id } = params;

    const movie = db.movie.findFirst({ where: { id: { equals: Number(id) } } });
    if (!movie) {
      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    }
    // return HttpResponse.json(movie);

    const { _actors, ...result } = movie;

    return HttpResponse.json(result);
  }),

  http.get(`${API_URL}/3/movie/:id/credits`, async ({ params }) => {
    await delay();
    const { id } = params;

    const movie = db.movie.findFirst({ where: { id: { equals: Number(id) } } });
    if (!movie) {
      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    }

    return HttpResponse.json({
      id,
      cast: movie.actors.map(actor => ({
        id: actor.person?.id,
        character: actor.character,
        profile_path: actor.person?.profile_path,
        name: actor.person?.name,
        popularity: actor.person?.popularity,
      })),
    });
  }),

  http.get(`${API_URL}/3/tv/:id`, async ({ params }) => {
    await delay();

    const { id } = params;
    const tv = db.tv.findFirst({ where: { id: { equals: Number(id) } } });
    if (!tv) {
      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    }

    return HttpResponse.json({
      id: tv.id,
      name: tv.name,
      first_air_date: tv.first_air_date,
      seasons: tv.seasons.map(season => ({
        id: season.id,
        air_date: season.air_date,
        season_number: season.season_number,
      })),
    });
  }),

  http.get(
    `${API_URL}/3/tv/:id/season/:seasonNumber/credits`,
    async ({ params }) => {
      await delay();
      const { id, seasonNumber } = params;

      const tv = db.tv.findFirst({ where: { id: { equals: Number(id) } } });
      if (!tv) {
        return HttpResponse.json({
          success: false,
          status_code: 34,
          status_message: 'The resource you requested could not be found.',
        });
      }

      const season = tv.seasons.filter(
        season => season.season_number === Number(seasonNumber),
      )[0];

      return HttpResponse.json({
        id: season.id,
        cast: season.actors.map(actor => ({
          id: actor.person!.id,
          character: actor.character,
          known_for_department: actor.known_for_department,
        })),
      });
    },
  ),

  http.get(`${API_URL}/3/person/:id`, async ({ params }) => {
    await delay();
    const { id } = params;
    const person = db.person.findFirst({
      where: { id: { equals: Number(id) } },
    });

    if (!person) {
      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    }

    return HttpResponse.json(person);
  }),

  http.get(`${API_URL}/3/person/:id/combined_credits`, async ({ params }) => {
    await delay(100);
    const { id } = params;

    try {
      const cast = mswGetPersonCast(Number(id));

      return HttpResponse.json({
        id: Number(id),
        cast,
      });
    } catch (err) {
      return HttpResponse.json({
        success: false,
        status_code: 34,
        status_message: 'The resource you requested could not be found.',
      });
    }
  }),
];
