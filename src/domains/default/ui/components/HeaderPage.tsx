import { Link, useLocation } from 'react-router-dom';
import companyLogo from '../../../../assets/DaraInsurancePlc.png';
import userIcon from '../../../../assets/default-user.png';
import companyLogoFull from '../../../../assets/logo-full.jpg';
import { useAuth } from '../../../../context/AuthContext';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { performLogout } from '../../use-cases';

const HeaderPage = () => {
  const { user, clearUser, mode } = useAuth();
  const signOut = () => {
    performLogout(clearUser);
  };
  const location = useLocation();
  const isAuthenticatePage = !location.pathname.includes(ROUTE_PATH.dashboard);
  return (
    <header className="sticky-top navbar-expand-lg  d-print-none">
      <div className="navbar navbar-light">
        <div className="container-xl">
          <button
            className="navbar-toggler d-sm-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbarToggleExternalContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 p-0 pe-md-3">
            <Link to={ROUTE_PATH.dashboard}>
              {isAuthenticatePage ? (
                <img
                  src={companyLogoFull}
                  style={{
                    width: '180px',
                    height: '44px',
                    objectFit: 'contain',
                  }}
                  alt={'logo'}
                  className="navbar-brand-image"
                />
              ) : (
                <img
                  src={user?.logo ?? companyLogo}
                  width={110}
                  height={32}
                  alt={'logo'}
                  className="navbar-brand-image"
                />
              )}
              {!isAuthenticatePage && (
                <>
                  <div
                    style={{ marginLeft: '0.5rem', display: 'inline-block' }}
                    className={'text-primary-blue'}
                  >
                    {user?.companyName || 'E-CHANNEL PORTAL'}
                  </div>
                  {mode != 'Production' ? (
                    <span className="badge bg-indigo-lt mb-2 ml-5">
                      {mode} mode
                    </span>
                  ) : (
                    ''
                  )}
                </>
              )}
            </Link>
          </div>
          <div className="navbar-nav flex-row order-md-last">
            {user && (
              <div className="nav-item dropdown" role="button">
                <div
                  className="nav-link d-flex lh-1 text-reset p-0 "
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <img
                    src={user?.profileImage ?? userIcon}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = userIcon;
                    }}
                    alt="Profile User"
                    className="profile-image w-4"
                  />
                  <div className="d-none d-xl-block ps-2">
                    <div>{user?.displayName}</div>
                    <div className="mt-1 small text-muted">
                      {user?.policyName}
                    </div>
                  </div>
                </div>
                <div
                  style={{ zIndex: 9999 }}
                  className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                >
                  {user ? (
                    <>
                      <Link to={ROUTE_PATH.profile} className="dropdown-item">
                        Profile
                      </Link>
                      <div className="dropdown-divider" />
                      <Link to={ROUTE_PATH.contactUs} className="dropdown-item">
                        Contact Us
                      </Link>
                      <Link
                        to={ROUTE_PATH.changePassword}
                        className="dropdown-item"
                      >
                        Change password
                      </Link>
                      <div
                        className="dropdown-item cursor-pointer"
                        onClick={signOut}
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to={ROUTE_PATH.login} className="dropdown-item">
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderPage;
