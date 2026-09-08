import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useModal } from '../../components/common/modal';
import { useAuth } from '../../context/AuthContext';
import { fetchDataAsync } from '../../services/$service';

import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal';
import Button from '../../components/common/Button';
import Spinner, { useSpinner } from '../../components/common/Spinner.jsx';
import TransactionDetailCard, {
  TransactionDetailCardContainer,
} from '../../components/transaction/TransactionDetailCard';
import {
  ShowLogsButton,
  TransactionLogsModal,
} from '../../components/transaction/TransactionTabList';
import { actions } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { getConfirmedMessageText } from '../../utils/get-confirm-message-text';
import { handleApiError } from '../../utils/handleApiError';

const CustomerTransationDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { hasPermissionProccessTransaction } = useAuth();

  const [detail, setDetail] = useState(null);
  const [processStatus, setProccessStatus] = useState(null);
  const status = detail?.status;

  document.title = `E-CHANNEL PORTAL | Transaction ${status} Detail`;
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();

  const getDetails = async () => {
    try {
      openSpinner();
      const response = await fetchDataAsync(
        `/operation-customer?transactionCode=${params.key}`
      );
      setDetail(response?.data?.list[0]);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      delay(() => {
        closeSpinner();
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleProcess = async (rejectRemark) => {
    try {
      openSpinner({ title: 'Processing...' });
      const summaryDate = {
        transaction: [detail.transactionNumber],
        status: processStatus,
      };
      const isDeleted = detail?.deleted;

      if (rejectRemark) {
        summaryDate.remark = rejectRemark;
      }

      await fetchDataAsync(`/operation-customer${isDeleted ? '/delete' : ''}`, {
        data: summaryDate,
        method: 'POST',
      });

      toast.success(
        `transaction number: ${detail.transactionNumber} has been ${processStatus}!`
      );
      delay(() => {
        closeSpinner();
      });
      delay(() => {
        goBack();
      }, 600);
    } catch (error) {
      delay(() => {
        closeSpinner();
        handleApiError(error, processStatus);
      });
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const { openModal, closeModal, modalRef } = useModal();
  const [isApprove, setIsApprove] = useState(null);
  const {
    modalRef: transactionLogModalRef,
    open: transactionLogModalOpen,
    openModal: openTransactionLogModal,
    closeModal: closeTransactionLogModal,
  } = useModal();

  return (
    <TransactionDetailCardContainer>
      <div className="position-relative">
        {detail && (
          <>
            <TransactionLogsModal
              onClose={closeTransactionLogModal}
              open={transactionLogModalOpen}
              openSpinner={openSpinner}
              closeSpinner={closeSpinner}
              ref={transactionLogModalRef}
              transactionNo={detail.transactionNumber}
            />
            <TransactionDetailCard
              data={detail}
              actions={actions[
                `${status}${detail.deleted ? '_Deleted' : ''}`
              ]?.map(
                (action) =>
                  hasPermissionProccessTransaction(action.action) && (
                    <Button
                      variant={action.reject ? 'danger' : 'primary'}
                      key={action.status}
                      onClick={() => {
                        setIsApprove(action.confirm);
                        setProccessStatus(action.status);
                        openModal();
                      }}
                    >
                      {action.label}
                    </Button>
                  )
              )}
            >
              <ShowLogsButton
                variant={'outlined'}
                onClick={() => openTransactionLogModal()}
              />
            </TransactionDetailCard>
            <ApproveRejectConfirmationModal
              closeModal={closeModal}
              modalRef={modalRef}
              isApprove={isApprove}
              confirmMessageText={getConfirmedMessageText({
                status: processStatus,
              })}
              onApprove={handleProcess}
              onReject={handleProcess}
            />
          </>
        )}
        <Spinner {...spinnerState} />
      </div>
    </TransactionDetailCardContainer>
  );
};

export default CustomerTransationDetailPage;
