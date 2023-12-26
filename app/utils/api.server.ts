const API_URL = 'https://api.themoviedb.org/3';
const token = process.env.API_TOKEN;
if (!token) {
  throw new Error('token is missing');
}

async function fetcher<T>(
  endpoint: string,
  {
    data,
    headers: customHeaders,
    ...customConfig
  }: { data?: unknown } & RequestInit = {},
): Promise<T> {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }

    console.log('reject', data);
    return Promise.reject(data);
  } catch (error) {
    console.error('API REJECT', error);
    return Promise.reject(error);
  }
}

export async function multiSearch(query: string, language: string = 'en-US') {
  const params = new URLSearchParams({ query, language });
  const data = await fetcher<{
    page: number;
    results: {
      id: number;
      title?: string;
      name?: string;
      media_type: 'movie' | 'tv' | 'person';
      release_date?: string;
      first_air_date?: string;
    }[];
  }>(`/search/multi?${params.toString()}`);

  return data;
}

export interface Movie {
  id: number;
  release_date: string;
  title: string;
}

export interface Tv {
  id: number;
  first_air_date: string;
  seasons: {
    id: number;
    air_date: string;
    season_number: string;
    name: string;
  };
}

export interface Person {
  id: number;
  birthday: string;
  deathday?: string;
  name: string;
}