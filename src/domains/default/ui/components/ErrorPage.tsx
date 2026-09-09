import { useEffect } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { HiOutlineFaceFrown } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { ROUTE_PATH } from '../../../../utils/route-util';
import { logClientError } from '../../interface-adapters';
import { buildClientErrorLogDto } from '../../use-cases';

const ErrorPage = ({ error }: FallbackProps) => {
  document.title = 'Something went wrong';
  const { user, selectedCompany, selectedBranch, permission } = useAuth();

  useEffect(() => {
    const sendErrorLog = async () => {
      const errorBody = buildClientErrorLogDto(error, {
        email: user?.email,
        selectedBranchLabel: selectedBranch?.label,
        selectedCompanyLabel: selectedCompany?.label,
        permission,
      });
      try {
        if (import.meta.env.PROD) {
          await logClientError(errorBody);
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
