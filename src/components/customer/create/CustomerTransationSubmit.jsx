import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ROUTE_PATH } from '../../../utils/route-util';
import { STATUS } from '../../../utils/status.js';
import TransactionDetail from '../../transaction/TransactionDetail';

const CostomerTransationSubmit = (props) => {
  const { data, productName } = props;
  const { getValues } = useFormContext();
  const { user, selectedBranch, selectedCompany } = useAuth();

  const navigate = useNavigate();
  const formData = getValues();

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl  py-4">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-7">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    TRANSACTION{' '}
                    <span className="transaction-submitted"> SUBMITTED</span>
                  </h2>
                  <div className="row justify-content-center">
                    <div className="col-md-12 py-2 px-2">
                      <ReviewDetail
                        data={{
                          ...data,
                          ...formData,
                          productName,
                          inputter: user?.displayName,
                          inputBranch: selectedBranch?.label,
                          inputCompany: selectedCompany?.label,
                          inputDateTime: data?.transactionDateTime,
                          status: STATUS.Submitted,
                          transactionNumber: data?.transaction,
                        }}
                      />
                    </div>
                  </div>{' '}
                  <div className="btn-list">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => {
                        navigate(ROUTE_PATH.dashboard);
                      }}
                    >
                      Go to Home
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        navigate(ROUTE_PATH.customerCreate);
                      }}
                    >
                      Add New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewDetail = ({ data }) => {
  return (
    <TransactionDetail
      {...data}
      policyName={data?.policy.policyName}
      remark=""
      firstName={data?.firstName}
      sureName={data?.sureName}
      telNo={data?.telNo}
      gender={data?.gender}
      position={data?.position}
      nation={data?.nation?.nationality}
      nicPassport={data?.identifyNumber || data?.nicPassport}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      policies={data?.policy.value}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      openingDate={data?.openingDate}
      parentId={data?.parentId}
      customerId={data?.childrenId}
    />
  );
};

export default CostomerTransationSubmit;
