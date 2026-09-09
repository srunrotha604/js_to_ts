import { serializeCsvList } from './serialize-csv-list';

export const buildBranchAdminAssignDto = (
  branchCode: string,
  selectedAdminValue: string[]
) => ({
  branchCode,
  value: serializeCsvList(selectedAdminValue),
});
