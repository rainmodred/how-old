import { LoaderFunctionArgs } from 'react-router';
import { IGroup } from '~/components/Search';
import { multiSearch } from '~/utils/api.server';
import { getPrefsSession } from '~/utils/userPrefs.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('search');

  if (!query || query?.length === 0) {
    return {
      options: [],
    };
  }

  const prefsSession = await getPrefsSession(request);
  const { lang } = prefsSession.getPrefs();
  const data = await multiSearch(query, lang);

  const movies: IGroup = { label: 'Movies', options: [] };
  const tvSeries: IGroup = { label: 'TV Series', options: [] };

  for (const item of data.results) {
    if (item.release_date && item.title) {
      const label = `${item.title} (${item.release_date.slice(0, 4)})`;
      movies.options.push({
        label,
        id: item.id,
        title: item.title,
        release_date: item.release_date,
        media_type: 'movie',
      });
    } else if (item.first_air_date && item.name) {
      const label = `${item.name} (${item.first_air_date.slice(0, 4)})`;
      tvSeries.options.push({
        label,
        id: item.id,
        title: item.name,
        release_date: item.first_air_date,
        media_type: 'tv',
      });
    }
  }
  return {
    options: [
      {
        ...movies,
        options: movies.options.sort(
          (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date),
        ),
      },
      {
        ...tvSeries,
        options: tvSeries.options.sort(
          (a, b) => Date.parse(a.release_date) - Date.parse(b.release_date),
        ),
      },
    ],
  };
}
