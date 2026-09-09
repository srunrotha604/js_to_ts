import { serializeCsvList } from './serialize-csv-list';

export const buildBranchProjectCreateDto = (
  branchFamily: string | undefined,
  projectFamily: string,
  selectedPolicies: string[]
) => ({
  branchFamily,
  projectFamily,
  policies: serializeCsvList(selectedPolicies),
});
