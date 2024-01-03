import { getCurrentLangInfo } from 'context/LanguageProvider/helpers';
import { format } from 'date-fns';
import { format as formatAgo } from 'timeago.js';

export { compareDates, dateToUnix, formatDuration, unixToDate } from '@q-dev/utils';

type DateLike = string | number | Date | null;

export function formatDateRelative (
  value: DateLike,
  lang: string = 'en-GB'
): string {
  if (!value) return '–';

  return new Date(value).getTime()
    ? formatAgo(value, lang)
    : '–';
}

export function formatTimeGMT (value: DateLike, lang?: string): string {
  return formatDate(value, lang, 'HH:mm OOOO');
}

export function formatDateDMY (value: DateLike, lang?: string): string {
  return formatDate(value, lang, 'dd.MM.yyyy');
}

export function formatDateGMT (value: DateLike, lang?: string): string {
  return formatDate(value, lang, 'dd.MM.yyyy HH:mm OOOO');
}

export function formatDate (
  value: DateLike,
  locale = 'en-GB',
  pattern = 'PPpp'
): string {
  if (!value) return '–';

  try {
    const date = new Date(value);
    if (!date.getTime()) return '–';

    const { localization } = getCurrentLangInfo(locale);
    return format(date, pattern, { locale: localization });
  } catch (error) {
    console.error(error);
    return '–';
  }
};
