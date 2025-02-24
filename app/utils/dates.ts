import {
  differenceInYears,
  format,
  formatDistanceStrict,
  formatDuration,
} from 'date-fns';

export function customFormatDate(date: string) {
  return format(new Date(date), 'MMMM d, y');
}

export function customFormatDistance(
  date1: Parameters<typeof formatDistanceStrict>[0],
  date2: Parameters<typeof formatDistanceStrict>[1],
  options?: Parameters<typeof formatDistanceStrict>[2],
) {
  const years = Math.abs(differenceInYears(date1, date2));
  if (years > 0) {
    return formatDuration({ years });
  }

  return formatDistanceStrict(date1, date2, options);
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function calculateAges(
  releaseDate: string,
  {
    birthday,
    deathday,
  }: {
    birthday: string | undefined | null;
    deathday: string | undefined | null;
  },
) {
  const end = deathday ? new Date(deathday) : new Date();
  const ageNow = birthday ? differenceInYears(end, birthday) : null;
  const ageThen = birthday
    ? differenceInYears(new Date(releaseDate), birthday)
    : null;

  return { ageNow, ageThen };
}
