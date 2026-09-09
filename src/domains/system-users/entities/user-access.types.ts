import type { SelectOption } from '../../../@type/report';

export interface UserAccessBranchItem {
  transactionCode?: string;
  companyLabel?: string;
  branchLabel?: string;
  defaultBranch?: string;
  defaultCompany?: string;
  status?: string;
  applicationFamily?: string;
  companyFamily?: string;
}

export interface UserAccessBranchListResponse {
  list?: UserAccessBranchItem[];
  options?: SelectOption[];
  message?: string;
}

export interface UserAccessRoleOption extends SelectOption {
  keyCode?: string;
  labelSecond?: string;
}

export interface UserAccessDetailResponse {
  role?: UserAccessRoleOption[];
  access?: SelectOption[];
  message?: string;
}
