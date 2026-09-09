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
