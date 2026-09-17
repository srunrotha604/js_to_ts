export const buildFilterLogdDto = (
  pageNumber: number,
  pageSize: number,
  orderBy: string,
  search: string
) => ({
  pageNumber,
  pageSize,
  orderBy,
  search,
});
