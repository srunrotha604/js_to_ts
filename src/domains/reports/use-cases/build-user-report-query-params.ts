import { formatDay } from '../../../utils/format-day';
import type { SelectOption } from '../../../@type/report';

export interface BuildUserReportQueryParamsInput {
  status: SelectOption[];
  selectedBranch: SelectOption[];
  date: { startDate: Date | null; endDate: Date | null };
}

export const buildUserReportQueryParams = ({
  status,
  selectedBranch,
  date,
}: BuildUserReportQueryParamsInput) => ({
  status: status?.map((item) => item.value).join(',') || '',
  branchName: selectedBranch?.map((item) => item.value).join(',') || '',
  startDate: date?.startDate ? formatDay(date.startDate, 'YYYYMMDD') : null,
  endDate: date?.endDate ? formatDay(date.endDate, 'YYYYMMDD') : null,
});
