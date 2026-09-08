import { useEffect } from 'react';
import { HiOutlineFaceFrown } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchDataAsync } from '../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';

const ErrorPage = ({ error }) => {
  document.title = 'Something wen wrong';
  const { user, selectedCompany, selectedBranch, permission } = useAuth();

  useEffect(() => {
    const sendErrorLog = async () => {
      const errorBody = {
        hostname: window.location.hostname,
        pathname: window.location.href,
        message: error.message,
        body: JSON.stringify({
          error: error.stack,
          access: localStorage.getItem('e_chanel_storage'),
          permission,
          selectedBranch: selectedBranch?.label || null,
          selectedCompany: selectedCompany?.label || null,
        }),
        email: user?.email || '',
      };
      try {
        if (import.meta.env.PROD) {
          await fetchDataAsync(ROUTE_API.log, {
            method: 'POST',
            data: errorBody,
          });
        } else {
          console.log(errorBody);
        }
      } catch (error) {
        console.log(error);
      }
    };

    sendErrorLog();
  }, []);
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container py-4 full-height-dashboard-container d-flex justify-content-center ">
      <div className="empty">
        <p className="mb-0 text-muted" style={{ fontSize: '140px' }}>
          <HiOutlineFaceFrown />
        </p>
        <div className="empty-header">Something went wrong</div>
        <p className="empty-title text-center">
          Sorry, something went wrong there.
          <br />
          You may need to refresh the page or try again later
        </p>
        <div className="empty-action btn-list">
          <Link to={ROUTE_PATH.dashboard} className="btn btn-primary">
            Take me home
          </Link>
          <button onClick={handleRefresh} className="btn btn-secondary">
            Refresh page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
