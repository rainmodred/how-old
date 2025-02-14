export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  release_date: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  video: boolean;
  popularity: number;
  genres: Genre[];
  runtime: number;
  overview: string;
};

export type Tv = {
  id: number;
  first_air_date: string;
  seasons: {
    id: number;
    air_date: string;
    season_number: string;
    name: string;
  };
};

export type Person = {
  id: number;
  birthday: string;
  deathday?: string;
  name: string;
  profile_path: string;
  place_of_birth: string;
};

export type Actor = {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  known_for_department: string;
};

export type TvDetails = {
  id: number;
  name: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  overview: string;
  popularity: number;
  poster_path: string;
  genres: Genre[];
  seasons: {
    id: number;
    air_date: string | null;
    season_number: number;
    poster_path: string;
    name: string;
  }[];
};
export type SeasonDetails = {
  air_date: string;
};

export type SearchRes = MovieRes | TvRes | PersonRes;

export type MovieRes = {
  id: number;
  title: string;
  media_type: 'movie';
  release_date: string;
};
export type TvRes = {
  id: number;
  name: string;
  media_type: 'tv';
  first_air_date: string;
};
export type PersonRes = {
  id: number;
  name: string;
  media_type: 'person';
  popularity: number;
};
