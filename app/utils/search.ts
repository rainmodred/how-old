import { getYear } from 'date-fns';
import { GroupItem, IGroup } from '~/components/Search/Autocomplete';
import {
  SearchMovie,
  SearchPerson,
  SearchRes,
  SearchTv,
} from '../api/multiSearch.server';

export function getLink(item: GroupItem) {
  if (item.media_type === 'movie') {
    return `/movie/${item.id}`;
  }
  if (item.media_type === 'tv') {
    return `/tv/${item.id}/season/1`;
  }
  return `/person/${item.id}`;
}

export function transformData(data: SearchRes): IGroup[] | null {
  if (!data) {
    return null;
  }

  const groups = Object.entries(
    Object.groupBy(data, ({ media_type }) => media_type),
  )
    .filter(
      ([groupName]) =>
        groupName === 'movie' || groupName === 'tv' || groupName === 'person',
    )
    .map(([groupName, g]) => {
      if (groupName === 'movie') {
        //ts hates me
        const group = g as SearchMovie[];
        return {
          label: 'Movies',
          options: group
            .filter(m => m.release_date && m.title)
            .map(m => {
              const label = `${m.title} (${getYear(m.release_date)})`;
              return {
                id: m.id,
                label,
                media_type: m.media_type,
              };
            }),
        };
      }

      if (groupName === 'tv') {
        const group = g as SearchTv[];
        return {
          label: 'TV Series',
          options: group
            .filter(tv => tv.first_air_date && tv.name)
            .map(tv => {
              const label = `${tv.name} (${getYear(tv.first_air_date)})`;
              return {
                id: tv.id,
                label,
                media_type: tv.media_type,
              };
            }),
        };
      }

      if (groupName === 'person') {
        const group = g as SearchPerson[];
        return {
          label: 'Persons',
          options: group
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
            .map(p => {
              const label = `${p.name}`;
              return {
                id: p.id,
                label,
                media_type: p.media_type,
              };
            }),
        };
      }
      throw new Error('unknown group');
    });

  return groups;
}
