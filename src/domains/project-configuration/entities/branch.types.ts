import type { SelectOption } from '../../../@type/report';

export interface BranchItem {
  transactionCode?: string;
  branchCode?: string;
  branchName?: string;
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
