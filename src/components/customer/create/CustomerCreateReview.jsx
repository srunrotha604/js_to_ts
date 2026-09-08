import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { fetchDataAsync } from '../../../services/$service';
import { delay } from '../../../utils/delay';
import { handleApiError } from '../../../utils/handleApiError';
import { STATUS } from '../../../utils/status';
import ActionSaveDraftConfirmationModal from '../../common/ActionSaveDraftConfirmationModal';
import { useModal } from '../../common/modal';
import Spinner, { useSpinner } from '../../common/Spinner';
import TransactionDetail from '../../transaction/TransactionDetail';

const CustomerCreateReview = (props) => {
  const { user, selectedBranch, selectedCompany } = useAuth();
  const { handleBackStep, handleSubmitted, productName } = props;
  const { handleSubmit, getValues } = useFormContext();
  const { hasPermissionProccessTransaction } = useAuth();
  const formData = getValues();
  const params = useParams();
  const { openModal, closeModal, modalRef } = useModal();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();

  const onSubmit = async (data, { suppressSuccessToast = false } = {}) => {
    try {
      openSpinner();
      const summaryData = {
        sureName: data?.sureName,
        firstName: data?.firstName,
        telNo: data?.telNo,
        projectCode: data?.project?.value,
        gender: data?.gender,
        dateOfBirth: data?.dateOfBirth,
        nicPassport: data?.identifyNumber,
        nation: data?.nation?.nationality,
        physicalCard: data?.physicalCard?.toString(),
        policies: data?.policy?.value,
        productCode: params.key,
        status: data.status || STATUS.Submitted,
        customerId: data?.childrenId,
        parentId: data?.parentId,
        openingDate: data?.openingDate,
      };
      const response = await fetchDataAsync('/operation-customer', {
        method: 'POST',
        data: summaryData,
      });
      delay([
        closeSpinner,
        () => {
          if (!suppressSuccessToast) {
            const msg =
              data.status === 'Draft'
                ? 'Draft saved successfully'
                : 'Record created successfully';
            toast.success(msg);
          }
          handleSubmitted(response.data, summaryData);
          closeModal();
        },
      ]);
    } catch (error) {
      delay(() => {
        closeSpinner();

        const baseMsg =
          data.status === 'Draft'
            ? 'Failed to save draft'
            : 'Failed to create record';

        const status = error?.response?.status;

        if (status === 400) {
          toast.error(`${baseMsg}. The record already exists.`);
          return;
        }

        handleApiError(error, baseMsg);
      });
    }
  };

  return (
    <div className="page-wrapper justify-content-center">
      <div className="page-body py-2">
        <div className="container-xl">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    <span>REVIEW</span>
                  </h2>
                  <form>
                    <ReviewDetail
                      data={{
                        ...formData,
                        productName,
                        inputter: user?.displayName,
                        inputBranch: selectedBranch?.label,
                        inputCompany: selectedCompany?.label,
                      }}
                    />
                    <div className="form-footer">
                      <div className="btn-list">
                        <button
                          onClick={handleBackStep}
                          className="btn btn-secondary"
                          type="button"
                        >
                          Back
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={openModal}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Spinner {...spinnerState} />
        <ActionSaveDraftConfirmationModal
          modalRef={modalRef}
          closeModal={closeModal}
          confirm={hasPermissionProccessTransaction('submitted')}
          saveDraft={hasPermissionProccessTransaction('draft')}
          onSaveDraft={handleSubmit((data) => {
            data.status = 'Draft';
            onSubmit(data, { suppressSuccessToast: true });
          })}
          onConfirm={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

const ReviewDetail = ({ data }) => {
  return (
    <TransactionDetail
      physicalCard={data?.physicalCard}
      firstName={data?.firstName.toUpperCase()}
      sureName={data?.sureName.toUpperCase()}
      telNo={data?.telNo}
      gender={data?.gender}
      nation={data?.nation?.nationality}
      nicPassport={data?.identifyNumber}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      policies={data?.policy.value}
      policyName={data?.policy.policyName}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      customerId={data?.childrenId}
      parentId={data?.parentId}
      openingDate={data?.openingDate}
    />
  );
};

export default CustomerCreateReview;
