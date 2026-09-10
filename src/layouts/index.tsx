import { Box } from '@mui/system';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import ErrorPage from '../domains/default/ui/components/ErrorPage';
import FooterPage from '../domains/default/ui/components/FooterPage';
import HeaderPage from '../domains/default/ui/components/HeaderPage';
import SideBarPage from '../domains/default/ui/components/SideBarPage';

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
