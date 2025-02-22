import { LRUCache } from 'lru-cache';
import { FormattedPersonDetails } from '../api/getPerson.server';
import { FormattedMovieDetails } from '../api/getMovie.server';
import { MovieCast } from '../api/getMovieCredits';
import { FormattedTvCredits } from '../api/getTvCredits.server';
import { FormattedTvDetails } from '../api/getTvDetails.server';
import { FormattedPersonCredits } from '../api/getPersonMovies.server';

export const personCache = new LRUCache<number, FormattedPersonDetails>({
  max: 50,
});
export const movieCache = new LRUCache<number, FormattedMovieDetails>({
  max: 10,
});
export const movieCastCache = new LRUCache<number, MovieCast>({ max: 10 });

export const tvCache = new LRUCache<number, FormattedTvDetails>({ max: 10 });
export const tvCreditsCache = new LRUCache<number, FormattedTvCredits>({
  max: 10,
});

export const personCreditsCache = new LRUCache<number, FormattedPersonCredits>({
  max: 10,
});
