import { delay, http, HttpResponse } from 'msw';
import { API_URL } from '~/utils/constants';

const searchMock = {
  page: 1,
  results: [
    {
      adult: false,
      backdrop_path: '/1rO4xoCo4Z5WubK0OwdVll3DPYo.jpg',
      id: 84773,
      name: 'The Lord of the Rings: The Rings of Power',
      original_language: 'en',
      original_name: 'The Lord of the Rings: The Rings of Power',
      overview:
        'Beginning in a time of relative peace, we follow an ensemble cast of characters as they confront the re-emergence of evil to Middle-earth. From the darkest depths of the Misty Mountains, to the majestic forests of Lindon, to the breathtaking island kingdom of Númenor, to the furthest reaches of the map, these kingdoms and characters will carve out legacies that live on long after they are gone.',
      poster_path: '/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg',
      media_type: 'tv',
      genre_ids: [10759, 10765, 18],
      popularity: 364.528,
      first_air_date: '2022-09-01',
      vote_average: 7.362,
      vote_count: 2327,
      origin_country: ['US'],
    },
    {
      adult: false,
      backdrop_path: '/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg',
      id: 120,
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      original_language: 'en',
      original_title: 'The Lord of the Rings: The Fellowship of the Ring',
      overview:
        'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
      poster_path: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      media_type: 'movie',
      genre_ids: [12, 14, 28],
      popularity: 135.143,
      release_date: '2001-12-18',
      video: false,
      vote_average: 8.407,
      vote_count: 23780,
    },
    {
      adult: false,
      backdrop_path: '/9DeGfFIqjph5CBFVQrD6wv9S7rR.jpg',
      id: 122,
      title: 'The Lord of the Rings: The Return of the King',
      original_language: 'en',
      original_title: 'The Lord of the Rings: The Return of the King',
      overview:
        "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord's realm.",
      poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      media_type: 'movie',
      genre_ids: [12, 14, 28],
      popularity: 110.239,
      release_date: '2003-12-01',
      video: false,
      vote_average: 8.476,
      vote_count: 22820,
    },
    {
      adult: false,
      backdrop_path: '/nS4picOwj15APKzJeBCk6EBcMG5.jpg',
      id: 121,
      title: 'The Lord of the Rings: The Two Towers',
      original_language: 'en',
      original_title: 'The Lord of the Rings: The Two Towers',
      overview:
        'Frodo and Sam are trekking to Mordor to destroy the One Ring of Power while Gimli, Legolas and Aragorn search for the orc-captured Merry and Pippin. All along, nefarious wizard Saruman awaits the Fellowship members at the Orthanc Tower in Isengard.',
      poster_path: '/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
      media_type: 'movie',
      genre_ids: [12, 14, 28],
      popularity: 102.958,
      release_date: '2002-12-18',
      video: false,
      vote_average: 8.389,
      vote_count: 20676,
    },
  ],
  total_pages: 1,
  total_results: 4,
};

const persons = {
  '109': {
    adult: false,
    also_known_as: [
      'Элайджа Вуд',
      'Элайджа Джордан Вуд',
      '일라이저 우드',
      '伊利亚·伍德',
      '伊莱贾·伍德',
      '伊莱贾·乔丹·伍德',
      'イライジャ・ウッド',
    ],
    biography:
      "Elijah Jordan Wood (born January 28, 1981) is an American actor and producer. He is best known for his portrayal of Frodo Baggins in the Lord of the Rings film trilogy (2001–2003) and The Hobbit: An Unexpected Journey (2012).\n\nWood made his film debut with a small part in Back to the Future Part II (1989). He went on to achieve recognition as a child actor with roles in Avalon (1990), Paradise (1991), Radio Flyer (1992), Forever Young (1992), The Adventures of Huck Finn (1993), and The Good Son (1993). As a teenager, he starred in films such as North (1994), The War (1994), Flipper (1996), The Ice Storm (1997), Deep Impact (1998), and The Faculty (1998). Following the success of The Lord of the Rings, Wood has appeared in a wide range of films, including Spy Kids 3D: Game Over (2003), Eternal Sunshine of the Spotless Mind (2004), Sin City (2005), Green Street Hooligans (2005), Everything Is Illuminated (2005), Paris, je t'aime (2006), Bobby (2006), Celeste and Jesse Forever (2012), Maniac (2012), Grand Piano, Cooties, The Last Witch Hunter (2015), The Trust (2016), I Don't Feel at Home in This World Anymore (2017), and Come to Daddy (2019).\n\nWood's voice roles include Mumble in Happy Feet (2006) and its sequel (2011), the title character in 9 (2009), Spyro the Dragon in the Legend of Spyro video game trilogy (2006–2008), Beck on Disney XD's Tron: Uprising (2012–2013), and Wirt in the Cartoon Network miniseries Over the Garden Wall (2014). He also played Ryan Newman on the FX dark comedy series Wilfred (2011–2014), for which he received a Satellite Award nomination for Best Actor, and Todd Brotzman in the BBC America series Dirk Gently's Holistic Detective Agency (2016–2017).",
    birthday: '1981-01-28',
    deathday: null,
    gender: 2,
    homepage: null,
    id: 109,
    imdb_id: 'nm0000704',
    known_for_department: 'Acting',
    name: 'Elijah Wood',
    place_of_birth: 'Cedar Rapids, Iowa, USA',
    popularity: 38.192,
    profile_path: '/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg',
  },
  '1327': {
    adult: false,
    also_known_as: [
      'Иэн МакКеллен',
      'Sir Ian McKellen',
      '伊恩·麦克莱恩',
      'Sir Ian Murray McKellen',
      'Σερ Ίαν Μάρεϊ ΜακΚέλεν',
      'Ίαν ΜακΚέλεν',
      'Ίαν Μάρεϊ ΜακΚέλεν',
      'Ian McKellern',
      '이안 맥켈런',
      'イアン・マッケラン',
      '伊恩·麦凯伦',
    ],
    biography:
      "Sir Ian Murray McKellen, CH, CBE (born May 25, 1939) is an English actor. He is the recipient of six Laurence Olivier Awards, a Tony Award, a Golden Globe Award, a Screen Actors Guild Award, a BIF Award, two Saturn Awards, four Drama Desk Awards and two Critics' Choice Awards. He has also received two Academy Award nominations, eight BAFTA film and TV nominations and five Emmy Award nominations. McKellen's work spans genres ranging from Shakespearean and modern theatre to popular fantasy and science fiction. His notable film roles include Gandalf in The Lord of the Rings and The Hobbit trilogies and Magneto in the X-Men films.",
    birthday: '1939-05-25',
    deathday: null,
    gender: 2,
    homepage: 'http://www.mckellen.com',
    id: 1327,
    imdb_id: 'nm0005212',
    known_for_department: 'Acting',
    name: 'Ian McKellen',
    place_of_birth: 'Burnley, Lancashire, England, UK',
    popularity: 21.455,
    profile_path: '/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg',
  },
  '1328': {
    adult: false,
    also_known_as: ['Шон Эстин', 'Sean Patrick Duke', 'ショーン・アスティン'],
    biography:
      "Sean Astin (born February 25, 1971) is an American film actor, director, and producer better known for his film roles as Mikey Walsh in The Goonies, the title character of Rudy, and Samwise Gamgee in the Lord of the Rings trilogy. In television, he appeared as Lynn McGill in the fifth season of 24. He also provided the voice for the title character in Disney's Special Agent Oso.",
    birthday: '1971-02-25',
    deathday: null,
    gender: 2,
    homepage: null,
    id: 1328,
    imdb_id: 'nm0000276',
    known_for_department: 'Acting',
    name: 'Sean Astin',
    place_of_birth: 'Santa Monica, California, USA',
    popularity: 44.6,
    profile_path: '/5oJzy6Ra0tuMEV7mfxjtqye5qUX.jpg',
  },
  '1321628': {
    adult: false,
    also_known_as: ['Морфидд Кларк', 'Морвед Кларк', 'Морвид Кларк'],
    biography:
      'Morfydd Clark (born 17 March 1989) is a Welsh actress. She is known for her film roles as Maud in Saint Maud and Dora Spenlow in The Personal History of David Copperfield, and in television as Mina Harker in Dracula, Sister Clara in His Dark Materials, and Galadriel in The Lord of the Rings: The Rings of Power.',
    birthday: '1990-03-17',
    deathday: null,
    gender: 1,
    homepage: null,
    id: 1321628,
    imdb_id: 'nm6077056',
    known_for_department: 'Acting',
    name: 'Morfydd Clark',
    place_of_birth: 'Sweden',
    popularity: 10.673,
    profile_path: '/p8jl9x9rVpUBHpcL0BGkKu9WO2q.jpg',
  },
  '2309879': {
    adult: false,
    also_known_as: [],
    biography:
      'Charlie Vickers is known for The Lord of the Rings: The Rings of Power (2022), Medici (2016) and Death in Shoreditch.',
    birthday: '1992-02-10',
    deathday: null,
    gender: 2,
    homepage: null,
    id: 2309879,
    imdb_id: 'nm8190914',
    known_for_department: 'Acting',
    name: 'Charlie Vickers',
    place_of_birth: 'London, England, UK',
    popularity: 4.858,
    profile_path: '/nIn0RTnOukikIKiVwtzRwkpcJvy.jpg',
  },
};

const movies = {
  '120': {
    id: 120,
    cast: [
      {
        adult: false,
        gender: 2,
        id: 109,
        known_for_department: 'Acting',
        name: 'Elijah Wood',
        original_name: 'Elijah Wood',
        popularity: 38.192,
        profile_path: '/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg',
        cast_id: 28,
        character: 'Frodo Baggins',
        credit_id: '52fe421ac3a36847f800448f',
        order: 0,
      },
      {
        adult: false,
        gender: 2,
        id: 1327,
        known_for_department: 'Acting',
        name: 'Ian McKellen',
        original_name: 'Ian McKellen',
        popularity: 21.455,
        profile_path: '/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg',
        cast_id: 29,
        character: 'Gandalf',
        credit_id: '52fe421ac3a36847f8004493',
        order: 1,
      },
      {
        adult: false,
        gender: 2,
        id: 1328,
        known_for_department: 'Acting',
        name: 'Sean Astin',
        original_name: 'Sean Astin',
        popularity: 44.6,
        profile_path: '/5oJzy6Ra0tuMEV7mfxjtqye5qUX.jpg',
        cast_id: 36,
        character: 'Samwise Gamgee',
        credit_id: '52fe421ac3a36847f80044af',
        order: 2,
      },
    ],
  },
  '121': {
    id: 121,
    cast: [
      {
        adult: false,
        gender: 2,
        id: 109,
        known_for_department: 'Acting',
        name: 'Elijah Wood',
        original_name: 'Elijah Wood',
        popularity: 38.192,
        profile_path: '/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg',
        cast_id: 13,
        character: 'Frodo Baggins',
        credit_id: '52fe421ac3a36847f8004589',
        order: 0,
      },
      {
        adult: false,
        gender: 2,
        id: 1328,
        known_for_department: 'Acting',
        name: 'Sean Astin',
        original_name: 'Sean Astin',
        popularity: 44.6,
        profile_path: '/5oJzy6Ra0tuMEV7mfxjtqye5qUX.jpg',
        cast_id: 20,
        character: 'Samwise Gamgee',
        credit_id: '52fe421ac3a36847f80045a5',
        order: 1,
      },
      {
        adult: false,
        gender: 2,
        id: 1327,
        known_for_department: 'Acting',
        name: 'Ian McKellen',
        original_name: 'Ian McKellen',
        popularity: 21.455,
        profile_path: '/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg',
        cast_id: 14,
        character: 'Gandalf',
        credit_id: '52fe421ac3a36847f800458d',
        order: 4,
      },
    ],
  },
  '122': {
    id: 122,
    cast: [
      {
        adult: false,
        gender: 2,
        id: 109,
        known_for_department: 'Acting',
        name: 'Elijah Wood',
        original_name: 'Elijah Wood',
        popularity: 38.192,
        profile_path: '/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg',
        cast_id: 12,
        character: 'Frodo Baggins',
        credit_id: '52fe421bc3a36847f80046f7',
        order: 0,
      },
      {
        adult: false,
        gender: 2,
        id: 1328,
        known_for_department: 'Acting',
        name: 'Sean Astin',
        original_name: 'Sean Astin',
        popularity: 44.6,
        profile_path: '/5oJzy6Ra0tuMEV7mfxjtqye5qUX.jpg',
        cast_id: 18,
        character: 'Samwise Gamgee',
        credit_id: '52fe421bc3a36847f800470f',
        order: 1,
      },
      {
        adult: false,
        gender: 2,
        id: 1327,
        known_for_department: 'Acting',
        name: 'Ian McKellen',
        original_name: 'Ian McKellen',
        popularity: 21.455,
        profile_path: '/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg',
        cast_id: 13,
        character: 'Gandalf',
        credit_id: '52fe421bc3a36847f80046fb',
        order: 2,
      },
    ],
  },

  '84773': {
    cast: [
      {
        adult: false,
        gender: 1,
        id: 1321628,
        known_for_department: 'Acting',
        name: 'Morfydd Clark',
        original_name: 'Morfydd Clark',
        popularity: 10.673,
        profile_path: '/p8jl9x9rVpUBHpcL0BGkKu9WO2q.jpg',
        character: 'Galadriel',
        credit_id: '5e1e8a5d5c071b001163231d',
        order: 0,
      },
      {
        adult: false,
        gender: 2,
        id: 2309879,
        known_for_department: 'Acting',
        name: 'Charlie Vickers',
        original_name: 'Charlie Vickers',
        popularity: 4.858,
        profile_path: '/nIn0RTnOukikIKiVwtzRwkpcJvy.jpg',
        character: 'Halbrand',
        credit_id: '63240a2e0b731600917dbc93',
        order: 1,
      },
    ],
    id: 84773,
  },
};

export const handlers = [
  http.get(`${API_URL}/search/multi`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    if (!query) {
      return HttpResponse.json({
        page: 1,
        results: [],
        totalPages: 0,
        total_reuslts: 0,
      });
    }
    return HttpResponse.json({
      ...searchMock,
      results: searchMock.results.filter(
        item =>
          item.title?.toLowerCase().includes(query) ||
          item.name?.toLowerCase().includes(query),
      ),
    });
  }),

  http.get(`${API_URL}/movie/:id/credits`, async ({ params }) => {
    const { id } = params as { id: keyof typeof movies };
    if (movies[id]) {
      return HttpResponse.json(movies[id]);
    }
    await delay(500);

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),

  http.get(`${API_URL}/tv/:id/credits`, ({ params }) => {
    const { id } = params as { id: keyof typeof movies };
    if (movies[id]) {
      return HttpResponse.json(movies[id]);
    }

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),

  http.get(`${API_URL}/person/:id`, ({ params }) => {
    const { id } = params as { id: keyof typeof persons };
    if (persons[id]) {
      return HttpResponse.json(persons[id]);
    }

    return HttpResponse.json({
      success: false,
      status_code: 34,
      status_message: 'The resource you requested could not be found.',
    });
  }),
];
