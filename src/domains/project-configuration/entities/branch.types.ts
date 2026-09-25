import type { SelectOption } from '../../../@type/report';
export interface BranchItem {
  transactionCode?: string;
  intermediaryCode?: string;
  intermediaryName?: string;
  contacts?: string;
  phone?: string;
  mobileOne?: string;
  mobileTwo?: string;
  email?: string;
  website?: string;
  address?: string;
  admin?: string;
  adminValue?: string[];
  status?: string;
}
export interface BranchListResponse {
  list?: BranchItem[];
  user?: SelectOption[];
  message?: string;
}
