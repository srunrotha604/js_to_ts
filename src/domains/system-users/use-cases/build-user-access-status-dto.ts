import { serializeCsvList } from './serialize-csv-list';

export const buildUserAccessStatusDto = (
  transactionCode: string,
  accessStatus: string[],
  processStatus: string[],
  adminBranch: string
) => ({
  transactionCode,
  accessStatus: serializeCsvList(accessStatus),
  processStatus: serializeCsvList(processStatus),
  adminBranch,
});
