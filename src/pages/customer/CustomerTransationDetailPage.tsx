import axios from 'axios';
import type { ForwardRefExoticComponent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type {
  CustomerListResponse,
  CustomerTransaction,
} from '../../@type/batch';
import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal';
import Button from '../../components/common/Button';
import { useModal } from '../../components/common/modal';
import Spinner, { useSpinner } from '../../components/common/Spinner';
import TransactionDetailCard, {
  TransactionDetailCardContainer,
} from '../../components/transaction/TransactionDetailCard';
import {
  ShowLogsButton,
  TransactionLogsModal as TransactionLogsModalRaw,
} from '../../components/transaction/TransactionTabList';
import { useAuth } from '../../context/AuthContext';
import { fetchDataAsync } from '../../services/$service';
import { actions } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { getConfirmedMessageText } from '../../utils/get-confirm-message-text';
import { handleApiError } from '../../utils/handleApiError';
import { ROUTE_API } from '../../utils/route-util';
const TransactionLogsModal =
  TransactionLogsModalRaw as ForwardRefExoticComponent<any>;

const CustomerTransationDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { hasPermissionProccessTransaction } = useAuth();

  const [detail, setDetail] = useState<CustomerTransaction | null>(null);
  const [processStatus, setProccessStatus] = useState<string | null>(null);
  const status = detail?.status;

  document.title = `E-CHANNEL PORTAL | Transaction ${status} Detail`;
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();

  const getDetails = async () => {
    try {
      openSpinner();
      const response = await fetchDataAsync<CustomerListResponse>(
        `${ROUTE_API.operationCustomer}?transactionCode=${params.key}`
      );
      setDetail(response?.data?.list?.[0] ?? null);
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) ? error.response?.data?.message : undefined
      );
    } finally {
      delay(() => {
        closeSpinner();
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleProcess = async (rejectRemark?: string) => {
    if (!detail) return;
    try {
      openSpinner({ title: 'Processing...' });
      const summaryDate: {
        transaction: (string | undefined)[];
        status: string | null;
        remark?: string;
      } = {
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
        if (axios.isAxiosError(error)) {
          handleApiError(error, processStatus ?? undefined);
        }
      });
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const { openModal, closeModal, modalRef } = useModal();
  const [isApprove, setIsApprove] = useState<boolean | null>(null);
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
                        setIsApprove(action.confirm ?? false);
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
