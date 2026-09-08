import type { SelectOption } from './report';
export interface MessageResponse {
  message?: string;
}
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
export interface PolicyOption extends SelectOption {
  keyCode?: string;
}

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
export interface ProductItem {
  transactionCode?: string;
  productsequenceCode?: string;
  productCode?: string;
  productName?: string;
  status?: string;
}

export interface ProductListResponse {
  list?: ProductItem[];
  message?: string;
}

export interface ProductOptionsResponse {
  options?: SelectOption[];
  message?: string;
}
export interface ProjectItem {
  key?: string;
  transactionCode?: string;
  projectName?: string;
  applicationName?: string;
  applicationCode?: string;
  moduleName?: string;
  description?: string;
  status?: string;
}

export interface ProjectListResponse {
  list?: ProjectItem[];
  message?: string;
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
