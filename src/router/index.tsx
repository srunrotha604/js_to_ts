import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts';
import { ROUTE_PATH } from '../utils/route-util';
const Login = lazy(() => import('../pages/default/LoginPage'));
const HomePage = lazy(() => import('../pages/default/HomePage'));
const LogoutPage = lazy(() => import('../pages/default/LogoutPage'));
const Error404Page = lazy(() => import('../pages/error_handle/Error404Page'));
const Error500Page = lazy(() => import('../pages/error_handle/Error500Page'));
export default function AllRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route
        path={ROUTE_PATH.root}
        element={token ? <Layout /> : <Navigate to={ROUTE_PATH.login} />}
      >
        <Route path={ROUTE_PATH.root} element={<HomePage />} />
        <Route path={ROUTE_PATH.dashboard} element={<HomePage />} />
        <Route path={ROUTE_PATH.logout} element={<LogoutPage />} />
      </Route>
      <Route
        path={ROUTE_PATH.login}
        element={token ? <Navigate to={ROUTE_PATH.root} /> : <Login />}
      />
      <Route path={ROUTE_PATH.error404} element={<Error404Page />} />
      <Route path={ROUTE_PATH.error500} element={<Error500Page />} />
      <Route path="*" element={<Navigate to={ROUTE_PATH.login} />} />
    </Routes>
  );
}
