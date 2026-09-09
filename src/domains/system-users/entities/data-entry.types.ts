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
