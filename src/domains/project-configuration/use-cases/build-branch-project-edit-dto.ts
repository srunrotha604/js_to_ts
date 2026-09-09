import { serializeCsvList } from './serialize-csv-list';

export const buildBranchProjectEditDto = (
  transactionCode: string | undefined,
  selectedPolicies: string[]
) => ({
  transactionCode,
  policies: serializeCsvList(selectedPolicies),
});
