import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const LogoutPage = () => {
  const { clearUser } = useAuth();

  useEffect(() => {
    clearUser();
  }, []);

  return null;
};

export default LogoutPage;
