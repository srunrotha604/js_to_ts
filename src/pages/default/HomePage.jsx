import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal.jsx';
import Button from '../../components/common/Button.jsx';
import Modal, { useModal } from '../../components/common/modal/index.jsx';
import Spinner, { useSpinner } from '../../components/common/Spinner.jsx';
import ComponentStatus from '../../components/customer/ComponentStatus';
import TransactionBatchProccessModal from '../../components/transaction/TransactionBatchProccessModal.jsx';
import TransactionTabList from '../../components/transaction/TransactionTabList';
import TransactionTabSelect, {
  useTransactionTabSelect,
} from '../../components/transaction/TransactionTabSelect.jsx';
import { useAuth } from '../../context/AuthContext';
import { fetchDataAsync } from '../../services/$service';
import { actions } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { getConfirmedMessageText } from '../../utils/get-confirm-message-text';
import { pluralize } from '../../utils/pluralize';
import { ROUTE_PATH } from '../../utils/route-util';
import { STATUS, isTransactionStatusCountChanged } from '../../utils/status';

const HomePage = () => {
  document.title = 'E-CHANNEL PORTAL | Home';

  const { hasPermissionAccessTransaction, isUserDRIAdmin } = useAuth();
  const navTab = useMemo(
    () => [
      {
        label: STATUS.All,
        status: STATUS.All,
        getTotal: (total) => total?.total,
      },
      {
        label: STATUS.Draft,
        status: STATUS.Draft,
        getTotal: (total) => total?.draft,
        hidden: !hasPermissionAccessTransaction('draft'),
      },
      {
        label: STATUS.Submitted,
        status: STATUS.Submitted,
        getTotal: (total) => total?.submitted,
        hidden: !hasPermissionAccessTransaction('submitted'),
      },
      {
        label: STATUS.Approved,
        status: STATUS.Approved,
        getTotal: (total) => total?.approved,
        hidden: !hasPermissionAccessTransaction('approved'),
      },
      {
        label: STATUS.BM_Rejected,
        status: STATUS.BM_Rejected,
        getTotal: (total) => total?.bmReject,
        hidden: !hasPermissionAccessTransaction('bmRejected'),
      },
      {
        label: STATUS.Confirmed,
        status: STATUS.Confirmed,
        type: 'Single,Batch',
        getTotal: (total) => total?.confirmed,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
      {
        label: STATUS.DRI_Rejected,
        status: STATUS.DRI_Rejected,
        getTotal: (total) => total?.driReject,
        hidden: !hasPermissionAccessTransaction('driRejected'),
      },
      {
        label: 'Deleted-END',
        status: STATUS.Confirmed_Deleted,
        type: 'Delete',
        getTotal: (total) => total?.confirmedDeleted,
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
  } = useTransactionTabSelect();

  const getSelectedCustomerList = async () => {
    try {
      let response;
      response = await fetchDataAsync('/operation-customer', {
        params: {
          transaction: selectedTransaction.join(','),
          pageSize: selectedTransaction.length,
        },
      });
      setSelectedCustomerList(response?.data?.list);
    } catch (error) {
      console.log(error);
    }
  };

  const [searchParams] = useSearchParams();
  const { hasPermissionProccessTransaction } = useAuth();
  const { closeModal, openModal, modalRef, open } = useModal();

  const [isApprove, setIsApprove] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);
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

  const tabListRef = useRef(null);
  const handleProcess = async (rejectRemark) => {
    try {
      closeActionModal();
      openSpinner({ title: 'Processing...' });
      const summaryData = {
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
      tabListRef.current.getList();
      resetSelected();
      delay([closeSpinner, closeModal]);
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
  } = useModal();

  return (
    <div
      className="container-xl full-height-dashboard-container overflow-auto"
      style={{ height: '0', overflow: 'hidden', display: 'flex' }}
    >
      <TransactionTabList
        tab={navTab}
        onFetchSuccess={(data) => {
          const transactionTotal = data?.data?.total?.[0] ?? {};
          if (!isUserDRIAdmin) {
            const isChanged = isTransactionStatusCountChanged(
              'driReject',
              transactionTotal
            );

            if (isChanged) {
              openPopupInfoModal(transactionTotal);
            }
          }
        }}
        ref={tabListRef}
        typeFilter={({ tabStatus }) => {
          return (
            [STATUS.Confirmed, STATUS.Confirmed_Deleted].includes(tabStatus) ===
            false
          );
        }}
        renderExtraFilter={({ tabStatus }) => {
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
        enableCheckbox={({ tabStatus }) => {
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
                    setIsApprove(action.confirm);
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

// eslint-disable-next-line react/display-name
const PopupInfo = forwardRef(({ data, onClose }, ref) => {
  const navigate = useNavigate();
  return (
    <Modal
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
    ></Modal>
  );
});

export default HomePage;
