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
import Spinner, { useSpinner } from '../../common/Spinner.jsx';
import TransactionDetail from '../../transaction/TransactionDetail';

const CustomerEditReview = (props) => {
  const { user, selectedBranch, selectedCompany } = useAuth();
  const { handleBackStep, handleSubmitted, productName } = props;
  const { handleSubmit, getValues } = useFormContext();
  const formData = getValues();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { openModal, closeModal, modalRef } = useModal();
  const { hasPermissionProccessTransaction } = useAuth();
  const params = useParams();

  const onSubmit = async (data) => {
    const isDraft = data.saveDraft === true;
    const status = isDraft ? STATUS.Draft : STATUS.Submitted;

    try {
      openSpinner();

      const summaryData = {
        transactionCode: data.transactionCode,
        sureName: data.sureName,
        firstName: data.firstName,
        telNo: data.telNo,
        position: data.position,
        projectCode: data.project.value,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        nicPassport: data.nicPassport,
        nation: data.nation.nationality,
        physicalCard: data.physicalCard.toString(),
        policies: data.policy.value,
        transactionNumber: data.transactionNumber,
        status,
        productCode: params.productCode,
        customerId: data.customerId,
        parentId: data?.parentId,
        openingDate: data.openingDate,
      };

      const response = await fetchDataAsync('/operation-customer', {
        method: 'PUT',
        data: summaryData,
      });

      delay([
        closeSpinner,
        () => {
          const msg = isDraft
            ? 'Draft saved successfully'
            : 'Record created successfully';
          toast.success(msg);
          handleSubmitted(response.data, summaryData);
          closeModal();
        },
      ]);
    } catch (error) {
      delay(() => {
        closeSpinner();

        const baseMsg = isDraft
          ? 'Failed to save draft'
          : 'Failed to create record';

        handleApiError(error, baseMsg);
      });
    }
  };

  return (
    <div className="page-wrapper justify-content-center">
      <div className="page-body">
        <div className="container-xl py-2">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-transaction-title text-center mb-3">
                    <span className="transaction-approved">REVIEW</span>
                  </h2>
                  <form>
                    <div className="row justify-content-center">
                      <div className="col-md-12">
                        <ReviewDetail
                          data={{
                            ...formData,
                            productName,
                            inputter: user?.displayName,
                            inputBranch: selectedBranch?.label,
                            inputCompany: selectedCompany?.label,
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-footer">
                      <div className="btn-list">
                        <button
                          className="btn btn-secondary d-none d-sm-inline-block"
                          onClick={handleBackStep}
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
            onSubmit({ ...data, saveDraft: true });
          })}
          onConfirm={handleSubmit((data) => {
            onSubmit({ ...data, saveDraft: false });
          })}
        />
      </div>
    </div>
  );
};

const ReviewDetail = ({ data }) => {
  return (
    <TransactionDetail
      physicalCard={data?.physicalCard}
      firstName={data?.firstName}
      sureName={data?.sureName}
      telNo={data?.telNo}
      gender={data?.gender}
      position={data?.position}
      nation={data?.nation?.nationality}
      nicPassport={data?.nicPassport}
      projectName={data?.project?.label}
      dateOfBirth={data?.dateOfBirth}
      policies={data?.policy.value}
      policyName={data?.policy.policyName}
      inputCompany={data?.inputCompany}
      inputBranch={data?.inputBranch}
      inputter={data?.inputter}
      productName={data?.productName}
      customerId={data?.customerId}
      parentId={data?.parentId}
      openingDate={data?.openingDate}
    />
  );
};

export default CustomerEditReview;
