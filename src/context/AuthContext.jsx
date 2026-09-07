import { createContext, useContext, useEffect, useState } from 'react';
import { fetchDataAsync } from '../services/$service';
import { clearTransactionStatusCount } from '../utils/status';
import ModuleContextProvider from './module/ModuleContext';

const AuthContext = createContext({
  loading: true,
  hasPermissionProccessTransaction: () => {},
  hasPermissionAccessTransaction: () => {},
  clearUser: () => {},
  fetchUser: () => {},
  user: null,
  isUserDRIAdmin: false,
  appName: '',
  menu: [],
  company: null,
  selectedBranch: null,
  selectedCompany: null,
  permission: null,
  module: [],
  token: null,
});

const fetchPermissionAccess = async () => {
  const URL = '/operation-customer/access';
  return fetchDataAsync(URL);
};

const fetchUserInfo = async () => {
  const URL = '/login';
  return fetchDataAsync(URL);
};

const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserDRIAdmin, setIsUserDRIAdmin] = useState(false);
  const [menu, setMenu] = useState([]);
  const [company, setCompany] = useState(null);
  const [permission, setPermission] = useState(null);
  const [token, setToken] = useState(null);
  const [mode, setMode] = useState('');
  const [module, setModule] = useState(null);

  const hasPermissionProccessTransaction = (execution, condition = 'and') => {
    if (Array.isArray(execution)) {
      if (condition === 'or') {
        return execution.some((item) => !!permission?.process?.[item]);
      }
      return execution.every((item) => !!permission?.process?.[item]);
    }
    return !!permission?.process?.[execution];
  };

  const hasPermissionAccessTransaction = (execution, condition = 'and') => {
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
      setToken(JSON.parse(e_chanel_storage));
      const tempCompany = responseUser?.data?.company;
      const tempUser = responseUser?.data?.userProfile?.[0];
      const tempMenu = responseUser?.data?.mainMenu;
      setModule({
        mainMenu: responseUser?.data?.mainMenu,
        menu: responseUser?.data?.menu,
        module: responseUser?.data?.module,
      });
      setIsUserDRIAdmin(responsePermission?.data?.driAdmin);
      setCompany(tempCompany);
      setUser(tempUser);
      setMenu(tempMenu);
      setPermission(responsePermission?.data);
      setMode(responseUser?.data?.mode);
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
    clearTransactionStatusCount();
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
