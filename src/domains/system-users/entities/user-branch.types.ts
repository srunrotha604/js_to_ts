import type { SelectOption } from '../../../@type/report';

export interface UserBranchDetail {
  appName?: string;
  companyName?: string;
  givenName?: string;
  surName?: string;
  userName?: string;
}

export interface UserBranchListItem {
  uuid?: string;
  branch?: string;
  active?: boolean;
  default?: boolean;
}

export interface UserBranchResponse {
  detail?: UserBranchDetail;
  list?: UserBranchListItem[];
}

export interface UserBranchCategoryResponse {
  company?: SelectOption[];
}
