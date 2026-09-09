import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../utils/route-util';
function Error500Page() {
  document.title = 'Error 500';
  return (
    <div className="container-tight py-4">
      <div className="empty">
        <div className="empty-header">500</div>
        <p className="empty-title">Oops… You just no permission to this page</p>
        <p className="empty-subtitle text-muted">
          We are sorry but you don't have permission to access this page
        </p>
        <div className="empty-action">
          <Link to={ROUTE_PATH.dashboard} className="btn btn-primary">
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
              <line x1={5} y1={12} x2={19} y2={12} />
              <line x1={5} y1={12} x2={11} y2={18} />
              <line x1={5} y1={12} x2={11} y2={6} />
            </svg>
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error500Page;
