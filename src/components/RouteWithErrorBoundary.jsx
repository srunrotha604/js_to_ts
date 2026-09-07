import ErrorPage from '../pages/error_handle/ErrorPage.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

const RouteWithErrorBoundary = () => {
  const location = useLocation();
  return (
    <ErrorBoundary FallbackComponent={ErrorPage} key={location.pathname}>
      <Outlet />
    </ErrorBoundary>
  );
};

export default RouteWithErrorBoundary;
