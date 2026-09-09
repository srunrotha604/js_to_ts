import { formatDay } from '../../../utils/format-day';

export interface BuildCustomerReportExportFilenameInput {
  dateRange: { startDate: Date | null; endDate: Date | null };
  issueDateRange: { startIssueDate: Date | null; endIssueDate: Date | null };
}

const safeFormat = (d: Date | null | undefined, f: string) =>
  d ? formatDay(d, f) : '';

export const buildCustomerReportExportFilename = ({
  dateRange,
  issueDateRange,
}: BuildCustomerReportExportFilenameInput) => {
  const label =
    issueDateRange?.startIssueDate && issueDateRange?.endIssueDate
      ? `customer_export card_issue_date ${safeFormat(
          issueDateRange.startIssueDate,
          'DD-MM-YY'
        )} ${safeFormat(issueDateRange.endIssueDate, 'DD-MM-YY')}`
      : `customer_export ${safeFormat(
          dateRange?.startDate,
          'DD-MM-YY'
        )} ${safeFormat(dateRange?.endDate, 'DD-MM-YY')}`;

  return `${label}.xlsx`;
};
