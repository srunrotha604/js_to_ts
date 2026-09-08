import type { UserProfile } from './profile';
import type { CompanyBranchOption, SelectOption } from './report';
import type { AuthModuleState } from './module';

export interface LoginResponse {
  token?: string;
  refreshToken?: string;
  company?: string;
  branch?: string;
  message?: string;
}

export interface PermissionSet {
  process?: Record<string, unknown>;
  access?: Record<string, unknown>;
  driAdmin?: boolean;
}

export interface AuthToken {
  token?: string;
  refreshToken?: string;
  company?: string;
  branch?: string;
  login_return_url?: string;
  hostName?: string;
}

export interface AuthContextValue {
  loading: boolean;
  hasPermissionProccessTransaction: (
    execution: string | string[],
    condition?: 'and' | 'or'
  ) => boolean;
  hasPermissionAccessTransaction: (
    execution: string | string[],
    condition?: 'and' | 'or'
  ) => boolean;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  user: UserProfile | null;
  isUserDRIAdmin: boolean;
  appName: string;
  menu: unknown[];
  company: CompanyBranchOption[] | null;
  selectedBranch: SelectOption | null | undefined;
  selectedCompany: CompanyBranchOption | null | undefined;
  permission: PermissionSet | null;
  module: AuthModuleState | null;
  token: AuthToken | null;
  mode: string;
}

export interface ForgotPasswordResponse {
  keyCode?: string;
  phoneNumber?: string;
  viaSMSCode?: string;
  attempt?: number;
  message?: string;
}
