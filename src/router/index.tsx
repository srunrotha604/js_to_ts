import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts';
import { ROUTE_PATH } from '../utils/route-util';
const Login = lazy(() => import('../pages/default/LoginPage'));
const HomePage = lazy(() => import('../pages/default/HomePage'));
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
      </Route>
      <Route
        path={ROUTE_PATH.login}
        element={token ? <Navigate to={ROUTE_PATH.root} /> : <Login />}
      />
    </Routes>
  );
}
