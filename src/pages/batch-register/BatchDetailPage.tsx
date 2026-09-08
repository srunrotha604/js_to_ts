import type { Dispatch, ForwardRefExoticComponent, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import type {
  BatchDetail,
  CustomerListResponse,
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../@type/batch';
import ApproveRejectConfirmationModal from '../../components/common/ActionConfirmationModal';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';
import LabelValueList from '../../components/common/LabelValueList';
import { useModal } from '../../components/common/modal/index';
import Spinner, { useSpinner } from '../../components/common/Spinner';
import TransactionNumber from '../../components/common/TransactionNumber';
import TransactionBatchProccessModalRaw from '../../components/transaction/TransactionBatchProccessModal';
import TransactionNumberTableItem from '../../components/transaction/TransactionNumberTableItem';
import TransactionTabListRaw from '../../components/transaction/TransactionTabList';
import TransactionTabSelect, {
  useTransactionTabSelect,
} from '../../components/transaction/TransactionTabSelect';
import { useAuth } from '../../context/AuthContext';
import useLoading from '../../hooks/useLoading';
import useMessage from '../../hooks/useMessage';
import { fetchDataAsync } from '../../services/$service';
import { actions } from '../../utils/actions';
import { delay } from '../../utils/delay';
import { formatDay } from '../../utils/format-day';
import { getConfirmedMessageText } from '../../utils/get-confirm-message-text';
import { pluralize } from '../../utils/pluralize';
import { ROUTE_API } from '../../utils/route-util';
import { STATUS } from '../../utils/status';

// TransactionTabList / TransactionBatchProccessModal are large, widely-shared
// forwardRef components still in plain JS; cast locally so their prop types
// don't collapse to an empty object here without touching their shared source.
const TransactionTabList =
  TransactionTabListRaw as ForwardRefExoticComponent<any>;
const TransactionBatchProccessModal =
  TransactionBatchProccessModalRaw as ForwardRefExoticComponent<any>;

const BatchDetailPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { key } = useParams();
  const { hasPermissionAccessTransaction, hasPermissionProccessTransaction } =
    useAuth();
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
  const [batchDetail, setBatchDetail] = useState<BatchDetail | null>(null);
  const [currentTabStatus, setCurrentTabStatus] = useState<string | null>(
    null
  );

  const { openSpinner, closeSpinner, spinnerState } = useSpinner();

  const navTab = useMemo(() => {
    return [
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
        getTotal: (total: TransactionTotalCounts) => total?.confirmed,
        hidden: !hasPermissionAccessTransaction('confirmed'),
      },
      {
        label: STATUS.DRI_Rejected,
        status: STATUS.DRI_Rejected,
        getTotal: (total: TransactionTotalCounts) => total?.driReject,
        hidden: !hasPermissionAccessTransaction('driRejected'),
      },
    ].filter((item) => !item.hidden);
  }, [hasPermissionAccessTransaction]);

  const getSelectedCustomerList = async () => {
    try {
      let response;
      if (selectedAll) {
        response = await fetchDataAsync<CustomerListResponse>(
          `${ROUTE_API.operationCustomerBatch}?batchNumber=${key}`,
          {
            params: {
              status: currentTabStatus,
              pageSize: batchDetail?.totalDocs,
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
      return response?.data?.list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const details = batchDetail?.details;

  const listDetail = [
    {
      label: 'Project',
      value: details?.projectName,
    },
    {
      label: 'Product',
      value: details?.productName,
    },
    {
      label: 'Policy No.',
      value: details?.policies,
    },
    {
      label: 'Company Name',
      value: details?.inputCompany,
    },
    {
      label: 'Branch',
      value: details?.inputBranch,
    },
    {
      label: 'Data Inputed',
      value: details?.inputter,
    },
  ];

  const goBack = () => {
    navigate(-1);
  };

  const handleProcess = async (rejectRemark?: string) => {
    try {
      openSpinner();
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

      await fetchDataAsync(ROUTE_API.operationCustomerBatch, {
        data: summaryDate,
        method: 'POST',
      });

      toast.success(
        `${selectedCustomerList.length} ${pluralize(
          'transaction',
          selectedCustomerList.length
        )} has been ${processStatus}!`
      );
      closeActionModal();
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

  useEffect(() => {
    openSpinner();
  }, []);

  const [processLoading, startProcessLoading, stopProcessLoading] =
    useLoading();

  const { showErrorResponseMessage } = useMessage();
  const handleProcessSelected = async () => {
    try {
      openSpinner();
      startProcessLoading();
      const customer = await getSelectedCustomerList();
      if ((customer?.length ?? 0) <= 0) return;
      delay([closeSpinner, openModal]);
    } catch (error) {
      showErrorResponseMessage(error);
      delay(closeSpinner);
    } finally {
      stopProcessLoading();
    }
  };

  const hasAction =
    currentTabStatus && actions[currentTabStatus]
      ? actions[currentTabStatus].some((action) =>
          hasPermissionProccessTransaction(action.action)
        )
      : false;

  return (
    <div className="page-wrapper container-xl batch-detail-container">
      <div
        className="overflow-hidden mt-3 mb-1"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <div className="card">
          <div className="card-header py-2 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
            <div className="d-flex align-items-center">
              <h3 className="mb-0">Batch Detail </h3>
              <div className="mx-2">
                <TransactionNumber
                  label="Batch Number"
                  disableGutter
                  disableLabel
                  transactionNumber={batchDetail?.details?.batchNumber}
                />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <p className="mb-0">Date</p>
              <div className="mx-2 text-primary-blue ">
                <b>{formatDay(batchDetail?.details?.inputDateTime)}</b>
              </div>
            </div>
          </div>
          <div className="card-body py-2">
            <LabelValueList list={listDetail} columnClassName="col-md-4" />
          </div>
        </div>
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
            tab={navTab}
            onRowClick={handleSelectTransaction}
            ref={tabListRef}
            url={`${ROUTE_API.operationCustomerBatch}/`}
            extraParams={`batchNumber=${key}`}
            onFetchSuccess={({
              data,
              tabStatus,
            }: {
              data: BatchDetail;
              tabStatus: string;
            }) => {
              setBatchDetail(data);
              setCurrentTabStatus(tabStatus);
              delay(closeSpinner);
            }}
            onFetchFail={() => {
              closeSpinner();
            }}
            typeFilter={false}
            path={location.pathname}
            branchFilter={false}
            defaultTab={navTab?.[0]?.status || STATUS.Submitted}
            onTabChange={resetSelectedTransaction}
            renderExtraFilter={() => {
              return (
                <div
                  style={{ flex: 1 }}
                  className="btn-list mx-2 align-items-center"
                >
                  {hasAction && (
                    <TransactionTabSelect
                      isSelectedAll={selectedAll}
                      onClearSelect={resetSelectedTransaction}
                      onSelectAll={setSelectedAll}
                      totalSelected={selectedTransaction?.length}
                      onClick={handleProcessSelected}
                    />
                  )}
                </div>
              );
            }}
            renderTableHead={(transactionList: CustomerTransaction[]) => {
              return (
                <>
                  {hasAction && (
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
                  )}
                  <th>TRANSACTION</th>
                  <th>Name</th>
                  <th>Tel No.</th>
                  <th>Gender</th>
                  {/* <th>Position</th> */}
                  <th>Nationality</th>
                  <th>NIC/Passport</th>
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
                  {hasAction && (
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
                  )}
                  <td
                    className="text-primary"
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
                  <td className="text-muted">{item.telNo}</td>
                  <td className="text-muted">{item.gender}</td>
                  {/* <td className="text-muted">{item.position}</td> */}
                  <td className="text-muted">{item.nation}</td>
                  <td className="text-muted">{item.nicPassport}</td>
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
            hidden={!hasAction}
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
              actions={actions[searchParams.get('status') ?? 'Draft']?.map(
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

export default BatchDetailPage;
