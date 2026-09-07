import { Link, useLocation } from 'react-router-dom';
import companyLogo from '../../assets/DaraInsurancePlc.png';
import userIcon from '../../assets/default-user.png';
import companyLogoFull from '../../assets/logo-full.jpg';
import { useAuth } from '../../context/AuthContext';
import { ROUTE_PATH } from '../../utils/route-util';

const HeaderPage = () => {
  const { user, clearUser, mode } = useAuth();
  const signOut = () => {
    localStorage.removeItem('e_chanel_storage');
    clearUser();
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
            {/* <a
            href="?theme=dark"
            className="nav-link px-0 hide-theme-dark"
            title="Enable dark mode"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            </svg>
          </a>
          <a
            href="?theme=light"
            className="nav-link px-0 hide-theme-light"
            title="Enable light mode"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx={12} cy={12} r={4} />
              <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
            </svg>
          </a> */}
            {/* <div className="nav-item dropdown d-none d-md-flex me-3">
            <Link
              to="/dashboard/"
              className="nav-link px-0"
              data-bs-toggle="dropdown"
              tabIndex={-1}
              aria-label="Show notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
              </svg>
              <span className="badge bg-red" />
            </Link>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-card">
              <div className="card">
                <div className="card-body">notifications</div>
              </div>
            </div>
          </div> */}
            {user && (
              <div className="nav-item dropdown" role="button">
                <div
                  className="nav-link d-flex lh-1 text-reset p-0 "
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <img
                    src={user?.profileImage ?? userIcon}
                    onError={(e) => {
                      e.target.src = userIcon;
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
                      {/* <Link to="/dashboard/switch-branch" className="dropdown-item">
                    Switch branch
                  </Link> */}
                      <Link
                        to={ROUTE_PATH.contactUs}
                        className="dropdown-item"
                        target={'_blank'}
                      >
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
