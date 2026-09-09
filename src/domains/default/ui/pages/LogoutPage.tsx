import { useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { performLogout } from '../../use-cases';

const LogoutPage = () => {
  const { clearUser } = useAuth();

  useEffect(() => {
    performLogout(clearUser);
  }, []);

  return null;
};

export default LogoutPage;
