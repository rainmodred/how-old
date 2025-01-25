import { format, formatDistanceStrict } from 'date-fns';

export function formatDate(date: string) {
  return format(new Date(date), 'MMMM d, y');
}

export function formatDiff(date1: string | Date, date2: string | Date) {
  return formatDistanceStrict(date1, date2);
}
