import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LogoutPage = () => {
  const { clearUser } = useAuth();

  useEffect(() => {
    clearUser();
  }, []);

  return null;
};

export default LogoutPage;
