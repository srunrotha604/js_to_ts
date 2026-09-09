import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextValue, AuthToken, PermissionSet } from '../@type/auth';
import type { AuthModuleState } from '../@type/module';
import type { UserProfile } from '../@type/profile';
import type { CompanyBranchOption } from '../@type/report';
import { fetchDataAsync } from '../services/$service';
import { ROUTE_API } from '../utils/route-util';
import ModuleContextProvider from './module/ModuleContext';

const logoutHandlers = new Set<() => void>();
export const registerLogoutHandler = (fn: () => void) => {
  logoutHandlers.add(fn);
  return () => logoutHandlers.delete(fn);
};

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  hasPermissionProccessTransaction: () => false,
  hasPermissionAccessTransaction: () => false,
  clearUser: () => {},
  fetchUser: async () => {},
  user: null,
  isUserDRIAdmin: false,
  appName: '',
  menu: [],
  company: null,
  selectedBranch: null,
  selectedCompany: null,
  permission: null,
  module: null,
  token: null,
  mode: '',
});

interface UserInfoResponse {
  company?: CompanyBranchOption[];
  userProfile?: UserProfile[];
  mainMenu?: AuthModuleState['mainMenu'];
  menu?: AuthModuleState['menu'];
  module?: AuthModuleState['module'];
  mode?: string;
}

interface PermissionAccessResponse extends PermissionSet {
  driAdmin?: boolean;
}

const fetchPermissionAccess = async () => {
  const URL = ROUTE_API.operationCustomerAccess;
  return fetchDataAsync<PermissionAccessResponse>(URL);
};

const fetchUserInfo = async () => {
  const URL = ROUTE_API.login;
  return fetchDataAsync<UserInfoResponse>(URL);
};

const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserDRIAdmin, setIsUserDRIAdmin] = useState(false);
  const [menu, setMenu] = useState<unknown[]>([]);
  const [company, setCompany] = useState<CompanyBranchOption[] | null>(null);
  const [permission, setPermission] = useState<PermissionSet | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [mode, setMode] = useState('');
  const [module, setModule] = useState<AuthModuleState | null>(null);

  const hasPermissionProccessTransaction = (
    execution: string | string[],
    condition: 'and' | 'or' = 'and'
  ): boolean => {
    if (Array.isArray(execution)) {
      if (condition === 'or') {
        return execution.some((item) => !!permission?.process?.[item]);
      }
      return execution.every((item) => !!permission?.process?.[item]);
    }
    return !!permission?.process?.[execution];
  };

  const hasPermissionAccessTransaction = (
    execution: string | string[],
    condition: 'and' | 'or' = 'and'
  ): boolean => {
    if (Array.isArray(execution)) {
      if (condition === 'or') {
        return execution.some((item) => !!permission?.access?.[item]);
      }
      return execution.every((item) => !!permission?.access?.[item]);
    }
    return !!permission?.access?.[execution];
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const responseUser = await fetchUserInfo();
      const responsePermission = await fetchPermissionAccess();
      const e_chanel_storage = localStorage.getItem('e_chanel_storage');
      setToken(e_chanel_storage ? JSON.parse(e_chanel_storage) : null);
      const tempCompany = responseUser?.data?.company;
      const tempUser = responseUser?.data?.userProfile?.[0];
      const tempMenu = responseUser?.data?.mainMenu;
      setModule({
        mainMenu: responseUser?.data?.mainMenu,
        menu: responseUser?.data?.menu,
        module: responseUser?.data?.module,
      });
      setIsUserDRIAdmin(responsePermission?.data?.driAdmin ?? false);
      setCompany(tempCompany ?? null);
      setUser(tempUser ?? null);
      setMenu(tempMenu ?? []);
      setPermission(responsePermission?.data ?? null);
      setMode(responseUser?.data?.mode ?? '');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCompany = company?.find(
    (item) => item.value === token?.company
  );

  const selectedBranch = selectedCompany?.branch?.find(
    (item) => item.value === token?.branch
  );
  const clearUser = () => {
    setUser(null);
    setMenu([]);
    setCompany(null);
    setPermission(null);
    setToken(null);
    setIsUserDRIAdmin(false);
    logoutHandlers.forEach((fn) => fn());
  };
  const appName = 'E-channel Portal';
  return (
    <AuthContext.Provider
      value={{
        hasPermissionProccessTransaction,
        hasPermissionAccessTransaction,
        user,
        mode,
        menu,
        company,
        selectedCompany,
        selectedBranch,
        loading,
        fetchUser,
        clearUser,
        permission,
        isUserDRIAdmin,
        appName,
        module,
        token,
      }}
    >
      <ModuleContextProvider {...module}>{children}</ModuleContextProvider>
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
export default AuthContextProvider;
