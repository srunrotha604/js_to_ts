export const buildBranchAccessDto = (
  applicationFamily: string | null | undefined,
  companyFamily: string | null | undefined,
  userCode: string | null | undefined,
  branchFamily: string
) => ({
  applicationFamily,
  companyFamily,
  userCode,
  branchFamily,
});
