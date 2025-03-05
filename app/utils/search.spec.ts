import { expect, it } from 'vitest';
import { transformData } from './search';
import { SearchRes } from '~/api/search-service';

it('transformdata', () => {
  const input: SearchRes = [
    {
      id: 120,
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      media_type: 'movie',
      release_date: '2001-12-18',
      popularity: 0,
    },
    {
      id: 84773,
      name: 'The Lord of the Rings: The Rings of Power',
      media_type: 'tv',
      first_air_date: '2022-09-01',
      popularity: 0,
    },
    {
      id: 1327,
      name: 'Ian McKellen',
      popularity: 21.455,
      media_type: 'person',
      profile_path: null,
    },
    {
      id: 1328,
      name: 'Sean Astin',
      popularity: 44.6,
      media_type: 'person',
      profile_path: null,
    },
  ];
  const output = [
    {
      label: 'Movies',
      options: [
        {
          id: 120,
          label: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
          media_type: 'movie',
        },
      ],
    },
    {
      label: 'TV Series',
      options: [
        {
          id: 84773,
          label: 'The Lord of the Rings: The Rings of Power (2022)',
          media_type: 'tv',
        },
      ],
    },
    {
      label: 'Persons',
      options: [
        {
          id: 1328,
          label: 'Sean Astin',
          media_type: 'person',
        },
        {
          id: 1327,
          label: 'Ian McKellen',
          media_type: 'person',
        },
      ],
    },
  ];

  expect(transformData(input)).toEqual(output);
});
