import type { SelectOption } from './report';

export interface MessageResponse {
  message?: string;
}

/* ---------- data entry (bm_create_data_entry) ---------- */

export interface RoleOptionsResponse {
  role?: SelectOption[];
  message?: string;
}

export interface DataEntryItem {
  transactionCode?: string;
  userCode?: string;
  userName?: string;
  email?: string;
  phone?: string;
  givenName?: string;
  sureName?: string;
  roleName?: string;
  userType?: string;
  status?: string;
  deleted?: boolean;
}

export interface DataEntryListResponse {
  list?: DataEntryItem[];
  message?: string;
}

/* ---------- role access ---------- */

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

/* ---------- user branch / company forms ---------- */

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

export interface UserCompanyDetail {
  appName?: string;
  givenName?: string;
  surName?: string;
  userName?: string;
}

export interface UserCompanyListItem {
  uuid?: string;
  company?: string;
  companyMember?: string;
  active?: boolean;
  default?: boolean;
}

export interface UserCompanyResponse {
  detail?: UserCompanyDetail;
  list?: UserCompanyListItem[];
}

/* ---------- user access branch / status ---------- */

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

/* ---------- user CRUD ---------- */

export interface UserItem {
  transactionCode?: string;
  applicationCode?: string;
  userCode?: string;
  userName?: string;
  email?: string;
  phone?: string;
  givenName?: string;
  sureName?: string;
  roleName?: string;
  userType?: string;
  status?: string;
  deleted?: boolean;
}

export interface UserListResponse {
  list?: UserItem[];
  message?: string;
}

/* ---------- user role ---------- */

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
