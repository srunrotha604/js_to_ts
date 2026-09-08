import { Box } from '@mui/system';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import FooterPage from '../pages/default/FooterPage';
import HeaderPage from '../pages/default/HeaderPage';
import SideBarPage from '../pages/default/SideBarPage';
import ErrorPage from '../pages/error_handle/ErrorPage';

export default function Layout() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <HeaderPage />
          <SideBarPage />
          <ErrorBoundary FallbackComponent={ErrorPage} key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <FooterPage />
    </>
  );
}
