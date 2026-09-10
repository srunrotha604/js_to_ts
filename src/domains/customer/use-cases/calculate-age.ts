import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface AgeResult {
  ageLabel: string;
  isUnderage: boolean;
  dob: Date;
}
export const calculateAge = (input: unknown): AgeResult | null => {
  if (!input) return null;

  const parsed: Dayjs =
    typeof input === 'object' && input !== null && 'toDate' in input
      ? (input as Dayjs)
      : input instanceof Date
      ? dayjs(input)
      : dayjs(input as string, ['YYYY-MM-DD', 'DD-MM-YYYY'], true);

  if (!parsed.isValid()) return null;

  const dob = parsed.toDate();
  const today = new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const ageLabel =
    years < 1
      ? `${months} M ${days} D`
      : `${years} Year${years !== 1 ? 's' : ''}`;

  return { ageLabel, isUnderage: years < 18, dob };
};
