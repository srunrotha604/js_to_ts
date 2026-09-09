export interface NormalizeIssueDateRangeInput {
  startDate?: Date | null;
  endDate?: Date | null;
  startIssueDate?: Date | null;
  endIssueDate?: Date | null;
}

export const normalizeIssueDateRange = (
  payload: NormalizeIssueDateRangeInput = {}
) => {
  const { startDate, endDate, startIssueDate, endIssueDate } = payload;

  return {
    startIssueDate: startIssueDate ?? startDate ?? null,
    endIssueDate: endIssueDate ?? endDate ?? null,
  };
};
