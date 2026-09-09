import type { SelectOption } from '../../../@type/report';

export interface RoleAccessItem {
  transactionCode?: string;
  roleName?: string;
  access?: string;
  process?: string;
}

export interface RoleAccessListResponse {
  list?: RoleAccessItem[];
  access?: SelectOption[];
  message?: string;
}
