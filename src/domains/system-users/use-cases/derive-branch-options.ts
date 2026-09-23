import type { Company } from '../../../@type/profile';
import type { SelectOption } from '../../../@type/report';

export const deriveBranchOptions = (
  company: Company[] | null | undefined,
  storageKey = 'e_chanel_storage'
): SelectOption[] => {
  const storedValue = localStorage.getItem(storageKey);
  const tokenText = storedValue ? JSON.parse(storedValue) : null;
  const companyDetails = company?.find(
    (item) => item?.companyCode === tokenText?.company
  );

  return (
    companyDetails?.branch?.map((item) => ({
      value: item.branchCode,
      label: item.branchName,
    })) ?? []
  );
};
