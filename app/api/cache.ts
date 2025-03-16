import { LRUCache } from 'lru-cache';
import { TvCredits, TvDetails } from './tv-service';
import { PersonCredits, PersonDetails } from './person-service';
import { MovieCredits, MovieDetails } from './movie-service';
import { SearchRes } from './search-service';

export const personCache = new LRUCache<number, PersonDetails>({
  max: 50,
});
export const movieCache = new LRUCache<number, MovieDetails>({
  max: 10,
});
export const movieCredisCache = new LRUCache<number, MovieCredits>({ max: 10 });
export const tvCache = new LRUCache<number, TvDetails>({ max: 10 });
export const tvCreditsCache = new LRUCache<number, TvCredits>({
  max: 10,
});
export const personCreditsCache = new LRUCache<number, PersonCredits>({
  max: 10,
});

export const searchCache = new LRUCache<string, SearchRes>({
  max: 5,
});
