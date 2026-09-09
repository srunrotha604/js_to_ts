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
