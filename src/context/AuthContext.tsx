import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { AuthContextValue, AuthToken, PermissionSet } from '../@type/auth';
import type { Company, Module, Profile, UserProfile } from '../@type/profile';
import { openSessionStream } from '../domains/default/interface-adapters';
import { HttpUtil } from '../utils/http-util';
import { ROUTE_API, ROUTE_PATH } from '../utils/route-util';
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

interface PermissionAccessResponse extends PermissionSet {
  driAdmin?: boolean;
}

const fetchPermissionAccess = async () => {
  const URL = ROUTE_API.operationCustomerAccess;
  return HttpUtil.get<PermissionAccessResponse>(URL);
};

const fetchUserInfo = async () => {
  const URL = ROUTE_API.getProfile;
  return HttpUtil.get<Profile>(URL);
};

const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const closeSessionStreamRef = useRef<(() => void) | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserDRIAdmin, setIsUserDRIAdmin] = useState(false);
  const [menu, setMenu] = useState<unknown[]>([]);
  const [company, setCompany] = useState<Company[] | null>(null);
  const [permission, setPermission] = useState<PermissionSet | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [mode, setMode] = useState('');
  const [module, setModule] = useState<Module[] | null>(null);

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
    return () => {
      closeSessionStreamRef.current?.();
    };
  }, []);

  const startSessionStream = () => {
    closeSessionStreamRef.current?.();
    closeSessionStreamRef.current = null;

    const e_chanel_storage = localStorage.getItem('e_chanel_storage');
    const storedToken = e_chanel_storage
      ? JSON.parse(e_chanel_storage).token
      : null;
    if (!storedToken) return;

    closeSessionStreamRef.current = openSessionStream(() => {
      toast.error('Your session has expired. Please log in again.');
      localStorage.removeItem('e_chanel_storage');
      clearUser();
      navigate(ROUTE_PATH.logout, { replace: true });
    });
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const responseUser = await fetchUserInfo();
      const responsePermission = await fetchPermissionAccess();
      const e_chanel_storage = localStorage.getItem('e_chanel_storage');
      setToken(e_chanel_storage ? JSON.parse(e_chanel_storage) : null);
      const tempCompany = responseUser?.data.company;
      const tempUser = responseUser?.data?.userProfile;
      const tempMenu = responseUser?.data?.menuItems;
      setModule(responseUser?.data.module || []);
      setIsUserDRIAdmin(responsePermission?.data?.driAdmin ?? false);
      setCompany(tempCompany ?? null);
      setUser(tempUser ?? null);
      setMenu(tempMenu ?? []);
      setPermission(responsePermission?.data ?? null);
      setMode(responseUser?.data?.mode ?? '');
      startSessionStream();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCompany = company?.find(
    (item) => item.companyCode === token?.company
  );

  const selectedBranch = selectedCompany?.branch?.find(
    (item) => item.branchCode === token?.branch
  );
  const clearUser = () => {
    closeSessionStreamRef.current?.();
    closeSessionStreamRef.current = null;
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
