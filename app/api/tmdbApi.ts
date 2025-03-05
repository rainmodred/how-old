import { DiscoverService } from './discover-service';
import { MovieService } from './movie-service';
import { PersonService } from './person-service';
import { SearchService } from './search-service';
import { TvService } from './tv-service';

class TmdbApi {
  public readonly discover: DiscoverService;
  public readonly search: SearchService;
  public readonly movie: MovieService;
  public readonly people: PersonService;
  public readonly tv: TvService;

  constructor() {
    this.discover = new DiscoverService();
    this.search = new SearchService();
    this.movie = new MovieService();
    this.people = new PersonService();
    this.tv = new TvService();
  }
}

export const tmdbApi = new TmdbApi();
