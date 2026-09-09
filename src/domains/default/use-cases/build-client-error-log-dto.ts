export interface BuildClientErrorLogDtoContext {
  email?: string;
  selectedBranchLabel?: string;
  selectedCompanyLabel?: string;
  permission: unknown;
}

export const buildClientErrorLogDto = (
  error: Error,
  context: BuildClientErrorLogDtoContext
) => ({
  hostname: window.location.hostname,
  pathname: window.location.href,
  message: error.message,
  body: JSON.stringify({
    error: error.stack,
    access: localStorage.getItem('e_chanel_storage'),
    permission: context.permission,
    selectedBranch: context.selectedBranchLabel || null,
    selectedCompany: context.selectedCompanyLabel || null,
  }),
  email: context.email || '',
});
