import type { CompanyBranchOption, SelectOption } from '../../../@type/report';

export const filterBranchesByCompany = (
  companies: CompanyBranchOption[] | null | undefined,
  companyValue: string
): SelectOption[] =>
  companies?.find((item) => item.value === companyValue)?.branch ?? [];
