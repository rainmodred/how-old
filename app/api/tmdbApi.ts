import { DiscoverService } from './discover-service';
import { MoviesService } from './movies-service';
import { PeopleService } from './people-service';
import { SearchService } from './search-service';
import { TvService } from './tv-service';

class TmdbApi {
  public readonly discover: DiscoverService;
  public readonly search: SearchService;
  public readonly movie: MoviesService;
  public readonly people: PeopleService;
  public readonly tv: TvService;

  constructor() {
    this.discover = new DiscoverService();
    this.search = new SearchService();
    this.movie = new MoviesService();
    this.people = new PeopleService();
    this.tv = new TvService();
  }
}

export const tmdbApi = new TmdbApi();
