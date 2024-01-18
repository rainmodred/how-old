import { format } from 'date-fns';

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return null;
  }
  return format(new Date(date), 'MMMM d, y');
}
