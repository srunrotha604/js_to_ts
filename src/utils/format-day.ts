import dayjs from 'dayjs';

export const formatDay = (
  date: dayjs.ConfigType,
  format = 'DD/MM/YYYY hh:mm A'
) => {
  return dayjs(date).format(format);
};

export const getPastDate = (dayCount: number, format = 'YYYY-MM-DD') => {
  const day = dayjs().subtract(dayCount, 'day');

  if (!format) return day;

  return day.format(format);
};

export const getFutureDate = (dayCount: number, format = 'YYYY-MM-DD') => {
  return dayjs().add(dayCount, 'day').format(format);
};

export function getStartOfMonthDate(format: string): string;
export function getStartOfMonthDate(): dayjs.Dayjs;
export function getStartOfMonthDate(format?: string) {
  const day = dayjs().startOf('month');

  if (!format) return day;

  return day.format(format);
}

export const convertAge = (date: dayjs.ConfigType) => {
  const birthDate = dayjs(date);
  const today = dayjs();

  const age = today.diff(birthDate, 'year');
  return `${age} Years`;
};
