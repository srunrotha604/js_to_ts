import { formatDay } from '../../../utils/format-day';
import type { SelectOption } from '../../../@type/report';

export interface BuildCustomerReportQueryParamsInput {
  type: SelectOption[];
  status: SelectOption[];
  date: { startDate: Date | null; endDate: Date | null };
  issueDateRange: { startIssueDate: Date | null; endIssueDate: Date | null };
  expirePolicy: boolean;
  selectedBranch: SelectOption[];
  selectedProject: SelectOption[];
}

const safeFormat = (d: Date | null | undefined, f: string) =>
  d ? formatDay(d, f) : '';

export const buildCustomerReportQueryParams = ({
  type,
  status,
  date,
  issueDateRange,
  expirePolicy,
  selectedBranch,
  selectedProject,
}: BuildCustomerReportQueryParamsInput) => ({
  type: type?.map((item) => item.value).join(',') || '',
  status: status?.map((item) => item.value).join(',') || '',
  startDate: safeFormat(date?.startDate, 'YYYYMMDD'),
  endDate: safeFormat(date?.endDate, 'YYYYMMDD'),
  startIssueDate: safeFormat(issueDateRange?.startIssueDate, 'YYYYMMDD'),
  endIssueDate: safeFormat(issueDateRange?.endIssueDate, 'YYYYMMDD'),
  expirePolicy: expirePolicy ? 'true' : 'false',
  branchName: selectedBranch?.map((item) => item.value).join(',') || '',
  projectName: selectedProject?.map((item) => item.value).join(',') || '',
});
