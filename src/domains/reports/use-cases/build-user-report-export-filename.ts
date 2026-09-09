import { formatDay } from '../../../utils/format-day';

export const buildUserReportExportFilename = (date: Date = new Date()) =>
  `user_export ${formatDay(date, 'DD-MM-YY')}.xlsx`;
