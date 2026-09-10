export interface MessageResponse {
  message?: string;
}

export interface UserProfile {
  userCode?: string;
  profileImage?: string;
  displayName?: string;
  policyName?: string;
  logo?: string;
  companyName?: string;
  email?: string;
  email1?: string;
  email2?: string;
  phone1?: string;
  phone2?: string;
  website1?: string;
  website2?: string;
  otherContact?: string;
  address1?: string;
  address2?: string;
}
export interface Profile {
  mode: any;
  userProfile: UserProfileNew;
  access: Access;
  application: Application;
  version: Version;
  company: Company[];
  menuItems: MenuItem[];
  module: Module[];
  processAccess: ProcessAccess;
  productAuthorizedLimits: ProductAuthorizedLimits;
}

export interface UserProfileNew {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  avatar: string;
  avatarUrl: string;
  uuid: any;
}

export interface Access {
  companyBranchAccess: CompanyBranchAccess;
}

export interface CompanyBranchAccess {
  company: string;
  branch: string;
}

export interface Application {
  applicationName: string;
  roleName: string;
}

export interface Version {
  releaseDate: string;
  version: string;
  description: string;
  commitSha: string;
  environment: string;
  buildTime: string;
  highlights: string[];
  fixes: any[];
  notes: string;
  docsLabel: string;
  docsUrl: string;
}

export interface Company {
  companyCode: string;
  companyName: string;
  companyLogo: string;
  companyLogoUrl: string;
  branch: Branch[];
}

export interface Branch {
  companyCode: string;
  branchCode: string;
  branchName: string;
}

export interface MenuItem {
  name: string;
  code: string;
  type: string;
  active: boolean;
}

export interface Module {
  code: string;
  name: string;
  parameter: string;
  permission: Permission[];
}

export interface Permission {
  parameter: string;
  method: string;
  active: boolean;
}

export interface ProcessAccess {
  strictProcess: any[];
  strictAccess: any[];
}

export interface ProductAuthorizedLimits {}
