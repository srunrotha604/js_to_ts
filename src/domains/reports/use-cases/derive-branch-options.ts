import type { CompanyBranchOption, SelectOption } from '../../../@type/report';

export const deriveBranchOptions = (
  company: CompanyBranchOption[] | null | undefined,
  storageKey = 'e_chanel_storage'
): SelectOption[] => {
  const storedValue = localStorage.getItem(storageKey);
  const tokenText = storedValue ? JSON.parse(storedValue) : null;
  const companyDetails = company?.find(
    (item) => item?.value === tokenText?.company
  );

  return companyDetails?.branch || [];
};
