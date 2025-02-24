import { client } from './api';
import { z } from 'zod';
import { movieBaseSchema } from './getMovieDetails';

// export type DiscoverMovies =
//   paths['/3/discover/movie']['get']['responses'][200]['content']['application/json']['results'];

const discoverMovieSchema = z
  .array(movieBaseSchema)
  .transform(data => data.filter(movie => movie.release_date));

export async function discoverMovie() {
  const { data, error } = await client.GET('/3/discover/movie', {
    params: {
      query: {
        include_adult: false,
        include_video: false,
        language: 'en-US',
        page: 1,
      },
    },
  });

  if (error) {
    throw new Error(error);
  }

  const results = discoverMovieSchema.parse(data.results);
  return results.map(movie => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
  }));
}
