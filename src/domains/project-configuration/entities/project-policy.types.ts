import type { SelectOption } from '../../../@type/report';

export interface PolicyOption extends SelectOption {
  keyCode?: string;
}

export interface ProjectPolicyOptionResponse {
  product?: SelectOption[];
  policy?: PolicyOption[];
  message?: string;
}

export interface ProjectPolicyItem {
  transactionCode?: string;
  projectLabel?: string;
  policyCode?: string;
  insuredName?: string;
  status?: string;
}

export interface ProjectPolicyListResponse {
  list?: ProjectPolicyItem[];
  message?: string;
}
