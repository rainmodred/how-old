import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(duration);
dayjs.extend(localizedFormat);

export function getDiffInYears(date1, date2) {
  return Math.abs(dayjs.duration(dayjs(date1).diff(dayjs(date2))).$d.years);
}

export function calculateAge(person, releaseDate) {
  const { id, name, character, birthday, deathday, profile_path } = person;

  const age = deathday
    ? getDiffInYears(deathday, birthday)
    : getDiffInYears(dayjs(), birthday);

  return {
    id,
    name,
    character,
    birthday: dayjs(birthday).format('LL'),
    deathday: deathday ? dayjs(deathday).format('LL') : null,
    profile_path,
    age,
    ageOnRelease: getDiffInYears(releaseDate, birthday),
  };
}

export function calculateCastAge(cast, persons, releaseDate) {
  return persons.map(person => {
    const { id } = person;
    const { character } = cast.find(p => p.id === id);

    return calculateAge(
      {
        ...person,
        character,
      },
      releaseDate,
    );
  });
}
