export const paginateCustomerReportList = <T>(
  list: T[],
  pageNumber: number,
  pageSize: number
): { items: T[]; total: number } => {
  const total = list.length;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return { items: list.slice(startIndex, endIndex), total };
};
