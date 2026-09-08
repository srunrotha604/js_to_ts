import { Box } from '@mui/system';
import { Outlet } from 'react-router-dom';
import FooterPage from '../pages/default/FooterPage';
import HeaderPage from '../pages/default/HeaderPage';
import SideBarPage from '../pages/default/SideBarPage';

export default function Layout() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <HeaderPage />
          <SideBarPage />
          {/* <Toolbar /> */}
          <Outlet />
        </Box>
      </Box>
      <FooterPage />
    </>
  );
}
