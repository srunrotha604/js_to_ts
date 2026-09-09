import type { SelectOption } from '../../../@type/report';

export interface BranchProjectOption extends SelectOption {
  policies?: SelectOption[];
}

export interface BranchProjectOptionsResponse {
  options?: BranchProjectOption[];
  message?: string;
}

export interface BranchProjectDetailItem {
  transactionCode?: string;
  branchFamily?: string;
  projectFamily?: string;
  policies?: string;
}

export interface BranchProjectDetailResponse {
  options?: BranchProjectOption[];
  list?: BranchProjectDetailItem[];
  message?: string;
}

export interface BranchProjectListItem {
  transactionCode?: string;
  branchCode?: string;
  branchName?: string;
  projectLabel?: string;
  policies?: string;
  status?: string;
}

export interface BranchProjectListResponse {
  list?: BranchProjectListItem[];
  message?: string;
}
