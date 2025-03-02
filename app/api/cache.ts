import { LRUCache } from 'lru-cache';
import { MovieDetails } from './schemas';
import { MovieCast } from './schemas';
import { PersonCredits, PersonDetails } from './schemas';
import { TvDetails, TvCredits } from './schemas';

export const personCache = new LRUCache<number, PersonDetails>({
  max: 50,
});
export const movieCache = new LRUCache<number, MovieDetails>({
  max: 10,
});
export const movieCredisCache = new LRUCache<number, MovieCast>({ max: 10 });

export const tvCache = new LRUCache<number, TvDetails>({ max: 10 });
export const tvCreditsCache = new LRUCache<number, TvCredits>({
  max: 10,
});

export const personCreditsCache = new LRUCache<number, PersonCredits>({
  max: 10,
});
