const fetcher = async url => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  const data = await res.json();

  return data;
};

const BASE_URL = 'https://api.themoviedb.org/3';

function generateUrl(endpoint, params) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', process.env.apiKey);
  params.forEach(({ name, value }) => {
    url.searchParams.append(name, value);
  });
  return url;
}

async function client(endpoint, params) {
  try {
    const res = await fetch(generateUrl(endpoint, params));
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');

      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

async function searchMulti(query) {
  const data = await client('/search/multi', [
    { name: 'query', value: encodeURIComponent(query) },
  ]);

  return data;
}

export { fetcher, searchMulti };
