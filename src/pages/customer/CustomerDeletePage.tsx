import type {
  ComponentType,
  Dispatch,
  ForwardRefExoticComponent,
  SetStateAction,
} from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import type {
  CustomerListResponse,
  CustomerTransaction,
} from '../../@type/batch';
import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';
import { useModal } from '../../components/common/modal';
import Spinner, { useSpinner } from '../../components/common/Spinner.jsx';
import TransactionBatchProccessModalRaw from '../../components/transaction/TransactionBatchProccessModal';
import TransactionNumberTableItem from '../../components/transaction/TransactionNumberTableItem.jsx';
import TransactionTabListRaw from '../../components/transaction/TransactionTabList';
import TransactionTabSelectRaw, {
  useTransactionTabSelect,
} from '../../components/transaction/TransactionTabSelect';
import { useAuth } from '../../context/AuthContext';
import useLoading from '../../hooks/useLoading';
import useMessage from '../../hooks/useMessage.jsx';
import { fetchDataAsync } from '../../services/$service';
import type { ActionItem } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { pluralize } from '../../utils/pluralize';
import { ROUTE_PATH } from '../../utils/route-util';
import { STATUS } from '../../utils/status';

// TransactionTabList / TransactionBatchProccessModal / TransactionTabSelect are
// large, widely-shared components still in plain JS; cast locally so their
// prop types don't collapse to an empty object here without touching their
// shared source (same pattern used in BatchDetailPage.tsx / HomePage.tsx).
const TransactionTabList =
  TransactionTabListRaw as ForwardRefExoticComponent<any>;
const TransactionBatchProccessModal =
  TransactionBatchProccessModalRaw as ForwardRefExoticComponent<any>;
const TransactionTabSelect = TransactionTabSelectRaw as ComponentType<any>;

const CustomerDeletePage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { key } = useParams();
  const { hasPermissionProccessTransaction } = useAuth();
  const navigate = useNavigate();
  const tabListRef = useRef<{ getList: () => void } | null>(null);

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
  };

  const { closeModal, openModal, modalRef, open } = useModal();
  const {
    closeModal: closeActionModal,
    openModal: openActionModal,
    modalRef: actionModalRef,
  } = useModal();
  const [isApprove, setIsApprove] = useState<boolean | null>(null);
  const [processStatus, setProccessStatus] = useState<string | null>(null);
  const [totalDocs, setTotalDocs] = useState<number | null>(null);
  const [currentTabStatus, setCurrentTabStatus] = useState<string | null>(
    null
  );

  const getSelectedCustomerList = async () => {
    try {
      let response;
      if (selectedAll) {
        response = await fetchDataAsync<CustomerListResponse>(
          `/operation-customer`,
          {
            params: {
              status: currentTabStatus,
              pageSize: totalDocs,
            },
          }
        );
      } else {
        response = await fetchDataAsync<CustomerListResponse>(
          '/operation-customer',
          {
            params: {
              transaction: selectedTransaction.join(','),
              pageSize: selectedTransaction.length,
            },
          }
        );
      }
      setSelectedCustomerList(response?.data?.list ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    navigate(ROUTE_PATH.dashboard);
  };

  const handleProcess = async (rejectRemark?: string) => {
    try {
      closeActionModal();
      openSpinner({ title: 'Processing...' });
      const summaryDate: {
        status: string | null;
        batchNumber?: string;
        transaction?: string[];
        remark?: string;
      } = {
        status: processStatus,
      };

      if (selectedAll) {
        summaryDate.batchNumber = key;
      } else {
        summaryDate.transaction = selectedTransaction;
      }

      if (rejectRemark) {
        summaryDate.remark = rejectRemark;
      }

      await fetchDataAsync('/operation-customer/delete', {
        data: summaryDate,
        method: 'POST',
      });

      toast.success(
        `${selectedCustomerList.length} ${pluralize(
          'transaction',
          selectedCustomerList.length
        )} has been ${processStatus}!`
      );
      closeModal();
      tabListRef.current?.getList();
      resetSelected();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) ? error.response?.data?.message : undefined
      );
    } finally {
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

  const [processLoading, startProcessLoading, stopProcessLoading] =
    useLoading();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { showErrorResponseMessage } = useMessage();
  const handleProcessSelected = async () => {
    try {
      openSpinner();
      startProcessLoading();
      await getSelectedCustomerList();
      openModal();
    } catch (error) {
      showErrorResponseMessage(error);
    } finally {
      stopProcessLoading();
      delay(closeSpinner);
    }
  };

  return (
    <div className="page-wrapper full-height-dashboard-container-fixed container-xl">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          className="mb-2"
          style={{
            flexGrow: 1,
            height: '0px',
            overflow: 'auto',
            display: 'flex',
          }}
        >
          <TransactionTabList
            title={<h2 className="mb-0">Customer List</h2>}
            onRowClick={handleSelectTransaction}
            ref={tabListRef}
            onFetchSuccess={({
              data,
              tabStatus,
            }: {
              data?: { totalDocs?: number };
              tabStatus: string;
            }) => {
              setTotalDocs(data?.totalDocs ?? null);
              setCurrentTabStatus(tabStatus);
            }}
            extraParams="type=Single,Batch"
            typeFilter={false}
            path={location.pathname}
            defaultTab={STATUS.Confirmed}
            onTabChange={resetSelectedTransaction}
            renderExtraFilter={() => {
              return (
                <div
                  style={{ flex: 1 }}
                  className="btn-list mx-2 align-items-center"
                >
                  <TransactionTabSelect
                    disableSelectAll
                    isSelectedAll={selectedAll}
                    onClearSelect={resetSelectedTransaction}
                    onSelectAll={setSelectedAll}
                    totalSelected={selectedTransaction?.length}
                    onClick={handleProcessSelected}
                  />
                </div>
              );
            }}
            renderTableHead={(transactionList: CustomerTransaction[]) => {
              return (
                <>
                  <th className="p-0">
                    <label
                      style={{ padding: '12px 12px 12px 24px' }}
                      className="w-100 cursor-pointer"
                    >
                      <Checkbox
                        disableGutter
                        checked={isSelectedAllInCurrentList(transactionList)}
                        onChange={(checked: boolean) => {
                          handleSelectAllInCurrentList(
                            checked,
                            transactionList
                          );
                        }}
                      />
                    </label>
                  </th>
                  <th>TRANSACTION</th>
                  <th>Name</th>
                  <th>PROJECT</th>
                  <th>PRODUCT</th>
                  <th>USER</th>
                  <th>BRANCH</th>
                </>
              );
            }}
            renderTableBody={({
              item,
              handleShowTransactionDetail,
            }: {
              item: CustomerTransaction;
              handleShowTransactionDetail: (item: CustomerTransaction) => void;
            }) => {
              return (
                <>
                  <td
                    className="p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <label
                      style={{ padding: '12px 12px 12px 24px' }}
                      className="w-100 cursor-pointer"
                    >
                      <Checkbox
                        disableGutter
                        checked={isSelectedItem(item)}
                        onChange={() => {
                          handleSelectTransaction(item);
                        }}
                      />
                    </label>
                  </td>
                  <td
                    title={'Click to view transaction detail'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowTransactionDetail(item);
                    }}
                  >
                    <TransactionNumberTableItem
                      transactionNumber={item.transactionNumber}
                    />
                  </td>
                  <td className="text-muted">
                    {item.sureName + ' ' + item.firstName}
                  </td>
                  <td className="text-muted">{item.projectCode}</td>
                  <td className="text-muted">{item.productCode}</td>
                  <td className="text-muted">{item.inputter}</td>
                  <td className="text-muted">{item.inputBranch}</td>
                </>
              );
            }}
          />
        </div>
        <div className="btn-list">
          <Button variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            disabled={
              (!selectedAll && selectedTransaction.length === 0) ||
              processLoading
            }
            onClick={handleProcessSelected}
            loading={processLoading}
            loadingText="Processing..."
          >
            Process Selected
          </Button>
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
              data={{
                selectedCustomerList,
                tabStatus: searchParams.get('status'),
              }}
              handleRemoveCustomer={handleRemoveCustomerFromList}
              closeModal={closeModal}
              ref={modalRef}
              actions={actions[
                searchParams.get('status') ?? STATUS.Confirmed
              ]?.map(
                (action) =>
                  hasPermissionProccessTransaction(action.action) && (
                    <Button
                      variant={action.reject ? 'danger' : 'primary'}
                      key={action.status}
                      onClick={() => {
                        setIsApprove(action.confirm ?? false);
                        setProccessStatus(action.status);
                        openActionModal();
                      }}
                    >
                      {action.label}
                    </Button>
                  )
              )}
            />
            <Spinner {...spinnerState} />
          </div>
        </div>
      </div>
    </div>
  );
};

const actions: Record<string, ActionItem[]> = {
  Confirmed: [
    { action: 'submitted', status: 'Submitted', label: 'Delete', reject: true },
  ],
};

const getConfirmedMessageText = ({
  status,
  selectedCustomerList,
}: {
  status: string | null;
  selectedCustomerList: CustomerTransaction[];
}) => {
  const tempStatus: Record<string, string> = {
    Submitted: 'delete',
  };

  const proccessStatus = (status && tempStatus[status]) ?? 'delete';

  return (
    <p className="fs-4">
      Are you sure you want to <b>{proccessStatus}</b>{' '}
      {`${selectedCustomerList.length > 1 ? 'these' : 'this'}`}{' '}
      <b>
        {selectedCustomerList.length > 0 ? selectedCustomerList.length : ''}
      </b>
      {pluralize('transaction', selectedCustomerList?.length)}?
    </p>
  );
};

export default CustomerDeletePage;
