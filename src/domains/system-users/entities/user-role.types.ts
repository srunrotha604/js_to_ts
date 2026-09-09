import type { SelectOption } from '../../../@type/report';

export interface ApplicationOptionsResponse {
  application?: SelectOption[];
  message?: string;
}

export interface SystemUserRoleOptionsResponse {
  options?: SelectOption[];
  message?: string;
}

export interface UserRoleItem {
  key?: string;
  userCode?: string;
  applicationFamily?: string;
  applicationFamilyLabel?: string;
  roleFamilyLabel?: string;
  status?: string;
}

export interface UserRoleListResponse {
  item?: UserRoleItem[];
  message?: string;
}
