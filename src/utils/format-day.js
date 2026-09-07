import dayjs from 'dayjs';

export const formatDay = (date, format = 'DD/MM/YYYY hh:mm A') => {
  return dayjs(date).format(format);
};

export const getPastDate = (dayCount, format = 'YYYY-MM-DD') => {
  const day = dayjs().subtract(dayCount, 'day');

  if (!format) return day;

  return day.format(format);
};

export const getFutureDate = (dayCount, format = 'YYYY-MM-DD') => {
  return dayjs().add(dayCount, 'day').format(format);
};

export const getStartOfMonthDate = (format) => {
  const day = dayjs().startOf('month');

  if (!format) return day;

  return day.format(format);
};

export const convertAge = (date) => {
  const birthDate = dayjs(date);
  const today = dayjs();

  const age = today.diff(birthDate, 'year');
  return `${age} Years`;
};