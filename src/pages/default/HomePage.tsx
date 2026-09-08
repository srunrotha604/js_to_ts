import type {
  ComponentType,
  Dispatch,
  ForwardRefExoticComponent,
  SetStateAction,
} from 'react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import type {
  CustomerListResponse,
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../@type/batch';
import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal';
import Button from '../../components/common/Button';
import ModalRaw, { useModal } from '../../components/common/modal/index';
import Spinner, { useSpinner } from '../../components/common/Spinner';
import ComponentStatus from '../../components/customer/ComponentStatus';
import TransactionBatchProccessModalRaw from '../../components/transaction/TransactionBatchProccessModal';
import TransactionTabListRaw from '../../components/transaction/TransactionTabList';
import TransactionTabSelectRaw, {
  useTransactionTabSelect,
} from '../../components/transaction/TransactionTabSelect';
import { useAuth } from '../../context/AuthContext';
import { fetchDataAsync } from '../../services/$service';
import { actions } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { getConfirmedMessageText } from '../../utils/get-confirm-message-text';
import { pluralize } from '../../utils/pluralize';
import { ROUTE_PATH } from '../../utils/route-util';
import { STATUS, isTransactionStatusCountChanged } from '../../utils/status';

// TransactionTabList / TransactionBatchProccessModal / TransactionTabSelect / Modal
// are large, widely-shared components still in plain JS; cast locally so their
// prop types don't collapse to an empty object here without touching their
// shared source (same pattern used in BatchDetailPage.tsx).
const TransactionTabList =
  TransactionTabListRaw as ForwardRefExoticComponent<any>;
const TransactionBatchProccessModal =
  TransactionBatchProccessModalRaw as ForwardRefExoticComponent<any>;
const TransactionTabSelect = TransactionTabSelectRaw as ComponentType<any>;
const TypedModal = ModalRaw as unknown as ForwardRefExoticComponent<
  React.RefAttributes<HTMLDivElement> & {
    title?: React.ReactNode;
    content?: React.ReactNode;
    children?: React.ReactNode;
    actions?: React.ReactNode;
    size?: 'sm' | 'lg' | 'xl';
    bodyClassName?: string;
    headerClassName?: string;
    closeButton?: boolean;
    noTransition?: boolean;
  }
>;

const HomePage = () => {
  document.title = 'E-CHANNEL PORTAL | Home';

  const { hasPermissionAccessTransaction, isUserDRIAdmin } = useAuth();
  const navTab = useMemo(
    () => [
      {
        label: STATUS.All,
        status: STATUS.All,
        getTotal: (total: TransactionTotalCounts) => total?.total,
      },
      {
        label: STATUS.Draft,
        status: STATUS.Draft,
        getTotal: (total: TransactionTotalCounts) => total?.draft,
        hidden: !hasPermissionAccessTransaction('draft'),
      },
      {
        label: STATUS.Submitted,
        status: STATUS.Submitted,
        getTotal: (total: TransactionTotalCounts) => total?.submitted,
        hidden: !hasPermissionAccessTransaction('submitted'),
      },
      {
        label: STATUS.Approved,
        status: STATUS.Approved,
        getTotal: (total: TransactionTotalCounts) => total?.approved,
        hidden: !hasPermissionAccessTransaction('approved'),
      },
      {
        label: STATUS.BM_Rejected,
        status: STATUS.BM_Rejected,
        getTotal: (total: TransactionTotalCounts) => total?.bmReject,
        hidden: !hasPermissionAccessTransaction('bmRejected'),
      },
      {
        label: STATUS.Confirmed,
        status: STATUS.Confirmed,
        type: 'Single,Batch',
        getTotal: (total: TransactionTotalCounts) => total?.confirmed,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
      {
        label: STATUS.DRI_Rejected,
        status: STATUS.DRI_Rejected,
        getTotal: (total: TransactionTotalCounts) => total?.driReject,
        hidden: !hasPermissionAccessTransaction('driRejected'),
      },
      {
        label: 'Deleted-END',
        status: STATUS.Confirmed_Deleted,
        type: 'Delete',
        getTotal: (total: TransactionTotalCounts) => total?.confirmedDeleted,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
    ],
    [hasPermissionAccessTransaction]
  );

  const {
    handleSelectTransaction,
    handleRemoveCustomerFromList,
    handleSelectAllInCurrentList,
    resetSelectedTransaction,
    isSelectedAllInCurrentList,
    isSelectedItem,
    selectedTransaction,
    resetSelected,
    selectedAll,
    setSelectedAll,
    selectedCustomerList,
    setSelectedCustomerList,
    selectDeletedTransaction,
  } = useTransactionTabSelect() as unknown as {
    handleSelectTransaction: (transaction: CustomerTransaction) => void;
    handleRemoveCustomerFromList: (customer: CustomerTransaction) => void;
    handleSelectAllInCurrentList: (
      checked: boolean,
      transactionList: CustomerTransaction[]
    ) => void;
    resetSelectedTransaction: () => void;
    isSelectedAllInCurrentList: (
      transactionList: CustomerTransaction[]
    ) => boolean;
    isSelectedItem: (transaction: CustomerTransaction) => boolean;
    selectedTransaction: string[];
    resetSelected: () => void;
    selectedAll: boolean;
    setSelectedAll: Dispatch<SetStateAction<boolean>>;
    selectedCustomerList: CustomerTransaction[];
    setSelectedCustomerList: Dispatch<SetStateAction<CustomerTransaction[]>>;
    selectDeletedTransaction: boolean;
  };

  const getSelectedCustomerList = async () => {
    try {
      let response;
      response = await fetchDataAsync<CustomerListResponse>(
        '/operation-customer',
        {
          params: {
            transaction: selectedTransaction.join(','),
            pageSize: selectedTransaction.length,
          },
        }
      );
      setSelectedCustomerList(response?.data?.list ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const [searchParams] = useSearchParams();
  const { hasPermissionProccessTransaction } = useAuth();
  const { closeModal, openModal, modalRef, open } = useModal();

  const [isApprove, setIsApprove] = useState<boolean | null>(null);
  const [processStatus, setProcessStatus] = useState<string | null>(null);
  const {
    closeModal: closeActionModal,
    openModal: openActionModal,
    modalRef: actionModalRef,
  } = useModal();

  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const handleProcessSelected = async () => {
    openSpinner({ title: 'Loading...' });
    await getSelectedCustomerList();
    delay([closeSpinner, openModal]);
  };

  const tabListRef = useRef<{ getList: () => void } | null>(null);
  const handleProcess = async (rejectRemark?: string) => {
    try {
      closeActionModal();
      openSpinner({ title: 'Processing...' });
      const summaryData: {
        transaction: string[];
        status: string | null;
        remark?: string;
      } = {
        transaction: selectedTransaction,
        status: processStatus,
      };

      const isDeleted = selectDeletedTransaction;

      if (rejectRemark) {
        summaryData.remark = rejectRemark;
      }

      await fetchDataAsync(`/operation-customer${isDeleted ? '/delete' : ''}`, {
        data: summaryData,
        method: 'POST',
      });

      toast.success(
        `${selectedCustomerList.length} ${pluralize(
          'transaction',
          selectedCustomerList.length
        )} has been ${processStatus}!`
      );
      tabListRef.current?.getList();
      resetSelected();
      delay([closeSpinner, closeModal]);
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) ? error.response?.data?.message : undefined
      );
      delay(closeSpinner);
    }
  };

  // close modal when no customer selected
  useEffect(() => {
    if (open && selectedCustomerList.length <= 0) {
      closeModal();
      resetSelected();
    }
  }, [selectedCustomerList]);

  const {
    modalRef: popupInfoModalRef,
    openModal: openPopupInfoModal,
    closeModal: closePopupInfoModal,
    data: popupInfoData,
  } = useModal() as unknown as {
    modalRef: React.RefObject<HTMLDivElement>;
    openModal: (data?: TransactionTotalCounts) => void;
    closeModal: () => void;
    data: TransactionTotalCounts | null;
  };

  return (
    <div
      className="container-xl full-height-dashboard-container overflow-auto"
      style={{ height: '0', overflow: 'hidden', display: 'flex' }}
    >
      <TransactionTabList
        tab={navTab}
        onFetchSuccess={(data: { data?: { total?: TransactionTotalCounts[] } }) => {
          const transactionTotal = data?.data?.total?.[0] ?? {};
          if (!isUserDRIAdmin) {
            const isChanged = isTransactionStatusCountChanged(
              'driReject',
              transactionTotal as Record<string, number>
            );

            if (isChanged) {
              openPopupInfoModal(transactionTotal);
            }
          }
        }}
        ref={tabListRef}
        typeFilter={({ tabStatus }: { tabStatus: string }) => {
          return (
            [STATUS.Confirmed, STATUS.Confirmed_Deleted].includes(tabStatus) ===
            false
          );
        }}
        renderExtraFilter={({ tabStatus }: { tabStatus: string }) => {
          return (
            <div
              style={{ flex: 1 }}
              className="btn-list mx-2 align-items-center"
            >
              {tabStatus !== STATUS.All && (
                <TransactionTabSelect
                  title="Click to Process Selected"
                  disableSelectAll
                  onClick={handleProcessSelected}
                  isSelectedAll={selectedAll}
                  onClearSelect={resetSelectedTransaction}
                  onSelectAll={setSelectedAll}
                  totalSelected={selectedTransaction?.length}
                />
              )}
            </div>
          );
        }}
        enableCheckbox={({ tabStatus }: { tabStatus: string }) => {
          if (!actions[tabStatus]) return false;

          return actions[tabStatus].some((action) =>
            hasPermissionProccessTransaction(action.action)
          );
        }}
        // enableItemCheckbox={isEnableItem}
        onTabChange={resetSelectedTransaction}
        handleSelectAllInCurrentList={handleSelectAllInCurrentList}
        handleSelectItem={handleSelectTransaction}
        isSelectedItem={isSelectedItem}
        isSelectedAllInCurrentList={isSelectedAllInCurrentList}
      />
      <div>
        <ApproveRejectConfirmationModal
          key={selectedTransaction?.join(',')}
          closeModal={closeActionModal}
          modalRef={actionModalRef}
          isApprove={isApprove}
          confirmMessageText={getConfirmedMessageText({
            status: processStatus,
            selectedCustomerList,
          })}
          onApprove={handleProcess}
          onReject={handleProcess}
        />
        <TransactionBatchProccessModal
          loading={spinnerState.loading}
          data={{
            selectedCustomerList,
            tabStatus: searchParams.get('status'),
          }}
          handleRemoveCustomer={handleRemoveCustomerFromList}
          closeModal={closeModal}
          ref={modalRef}
          actions={actions[
            `${searchParams.get('status') ?? STATUS.Confirmed}${
              selectDeletedTransaction ? '_Deleted' : ''
            }`
          ]?.map(
            (action) =>
              hasPermissionProccessTransaction(action.action) && (
                <Button
                  variant={action.reject ? 'danger' : 'primary'}
                  key={action.status}
                  onClick={() => {
                    setIsApprove(action.confirm ?? false);
                    setProcessStatus(action.status);
                    openActionModal();
                  }}
                >
                  {action.label}
                </Button>
              )
          )}
        />
        <Spinner {...spinnerState} />
        <PopupInfo
          data={popupInfoData}
          onClose={closePopupInfoModal}
          ref={popupInfoModalRef}
        />
      </div>
    </div>
  );
};

interface PopupInfoProps {
  data: TransactionTotalCounts | null;
  onClose: () => void;
}

// eslint-disable-next-line react/display-name
const PopupInfo = forwardRef<HTMLDivElement, PopupInfoProps>(
  ({ data, onClose }, ref) => {
    const navigate = useNavigate();
    return (
    <TypedModal
      size="sm"
      title={'Task Reminder'}
      bodyClassName="d-flex flex-column pt-3 pb-3"
      content={
        <>
          <div
            style={{
              fontSize: '22px',
              display: 'inline-flex',
              justifyContent: 'center',
              marginBottom: '18px',
            }}
          >
            <ComponentStatus status="DRI-Rejected" />
            <span style={{ margin: '0 6px' }}>
              {' '}
              {`( ${data?.driReject} )`}{' '}
            </span>{' '}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => {
                navigate(
                  `${ROUTE_PATH.dashboard}?status=${STATUS.DRI_Rejected}`
                );
                onClose();
              }}
            >
              View
            </Button>
          </div>
        </>
      }
      ref={ref}
    ></TypedModal>
  );
  }
);

export default HomePage;
