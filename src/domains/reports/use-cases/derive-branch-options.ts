import type { Company } from '../../../@type/profile';
import type { SelectOption } from '../../../@type/report';
import { STORAGE_KEY } from '../../../utils/storage-key';
export const deriveBranchOptions = (
  company: Company[] | null | undefined,
  storageKey = STORAGE_KEY
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
