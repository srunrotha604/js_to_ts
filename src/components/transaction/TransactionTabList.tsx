import axios from 'axios';
import clsx from 'clsx';
import type { ChangeEvent, MouseEvent, ReactNode } from 'react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactPaginate from 'react-paginate';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import type { StylesConfig } from 'react-select';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from 'use-debounce';
import type {
  CustomerListResponse,
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../@type/batch';
import type { SelectOption } from '../../@type/report';
import '../../assets/style/custom_style.css';
import ComponentStatus from '../../components/customer/ComponentStatus';
import IssueDateDetailModal from '../../components/IssueDateDetailModal';
import IssueDateModal from '../../components/IssueDateModal';
import TransactionDetailModal from '../../components/transaction/TransactionDetailModal';
import { useAuth } from '../../context/AuthContext';
import useMessage from '../../hooks/useMessage';
import { fetchData, fetchDataAsync } from '../../services/$service';
import { delay } from '../../utils/delay';
import { formatDay } from '../../utils/format-day';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';
import Modal, { useModal } from '../common/modal/index';
import Spinner, { useSpinner } from '../common/Spinner';
import TransactionNumberTableItem from './TransactionNumberTableItem';

const STATUS = {
  All: 'All',
  Draft: 'Draft',
  Approved: 'Approved',
  BM_Rejected: 'BM-Rejected',
  DRI_Rejected: 'DRI-Rejected',
  Confirmed: 'Confirmed',
  Submitted: 'Submitted',
  BM_Rejected_Draft: 'BM-Rejected-Draft',
};

const TYPE = {
  All: 'All',
  Batch: 'Batch',
  Single: 'Single',
  Delete: 'Delete',
};

export const typeOptions = [
  { value: TYPE.All, label: TYPE.All },
  { value: TYPE.Single, label: TYPE.Single },
  { value: TYPE.Batch, label: TYPE.Batch },
  { value: TYPE.Delete, label: TYPE.Delete },
];

interface FetchResultPayload {
  data?: CustomerListResponse;
  tabStatus: string;
}

interface NavigateListParams {
  status?: string;
  branch?: string;
  pageNum?: number;
  rowPerPage?: number;
  search?: string;
  type?: string;
}

export interface TransactionTabItem {
  status?: string;
  type?: string;
  label: string;
  hidden?: boolean;
  getTotal: (total?: TransactionTotalCounts) => number | string | undefined;
}

export interface TransactionTabListHandle {
  getList: () => void;
}

interface TransactionTabListProps {
  title?: ReactNode;
  tab?: TransactionTabItem[];
  branchFilter?: boolean;
  renderTableHead?: (list: CustomerTransaction[]) => ReactNode;
  renderTableBody?: (args: {
    index: number;
    item: CustomerTransaction;
    handleShowTransactionDetail: (item: CustomerTransaction) => void;
  }) => ReactNode;
  path?: string;
  url?: string;
  extraParams?: string;
  renderExtraFilter?: (args: {
    tabStatus: string;
    total?: TransactionTotalCounts;
    totalDocs?: number | null;
  }) => ReactNode;
  onTabChange?: (status: string) => void;
  defaultTab?: string;
  onFetchSuccess?: (payload: FetchResultPayload) => void;
  onFetchFail?: (payload: FetchResultPayload) => void;
  disableRowClick?: boolean;
  onRowClick?: (item: CustomerTransaction) => void;
  typeFilter?: boolean | ((args: { tabStatus: string }) => boolean);
  isSelectedAllInCurrentList?: (list: CustomerTransaction[]) => boolean;
  handleSelectAllInCurrentList?: (
    checked: boolean,
    list: CustomerTransaction[]
  ) => void;
  handleSelectItem?: (item: CustomerTransaction) => void;
  isSelectedItem?: (item: CustomerTransaction) => boolean;
  enableCheckbox?: boolean | ((args: { tabStatus: string }) => boolean);
  enableItemCheckbox?: boolean | ((item: CustomerTransaction) => boolean);
}
const TransactionTabList = forwardRef<
  TransactionTabListHandle,
  TransactionTabListProps
>(
  (
    {
      title,
      tab,
      branchFilter = true,
      renderTableHead,
      renderTableBody,
      path = ROUTE_PATH.dashboard,
      url = `${ROUTE_API.operationCustomer}`,
      extraParams = '',
      renderExtraFilter,
      onTabChange,
      defaultTab = STATUS.All,
      onFetchSuccess,
      onFetchFail,
      disableRowClick = false,
      onRowClick,
      typeFilter = true,
      isSelectedAllInCurrentList,
      handleSelectAllInCurrentList,
      handleSelectItem,
      isSelectedItem,
      enableCheckbox = false,
      enableItemCheckbox = true,
    },
    ref
  ) => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const { hasPermissionProccessTransaction, company } = useAuth();
    const [arrCustomer, setArrCustomer] = useState<CustomerTransaction[]>([]);
    const [, setStatusMap] = useState<Record<string, string | undefined>>({});
    const [arrDetails, setArrDetails] = useState<CustomerTransaction>({});
    const [total, setTotal] = useState<TransactionTotalCounts | undefined>(
      undefined
    );
    const [totalDocs, setTotalDocs] = useState<number | null>(null);
    const [branch, setBranch] = useState<SelectOption[]>([]);
    const { openModal, modalRef } = useModal();
    const [selectedBranch, setSelectedBranch] = useState<
      SelectOption | undefined
    >({
      label: 'All',
      value: 'All',
    });
    const [type, setType] = useState<SelectOption | undefined>({
      value: 'All',
      label: 'All',
    });
    const [tabStatus, setTabStatus] = useState(defaultTab);
    const navigate = useNavigate();
    const [rowPerPage, setRowPerPage] = useState(25);
    const [pageNum, setPageNum] = useState(1);
    const { showErrorResponseMessage } = useMessage();
    const tableRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const resetTableScroll = (position = 0) => {
      if (tableRef.current) {
        tableRef.current.scrollTop = position;
      }
    };

    const navigateList = (params: NavigateListParams = {}) => {
      navigate(
        {
          pathname: path,
          search: createSearchParams({
            status: params.status ?? tabStatus ?? '',
            branch: params.branch ?? selectedBranch?.value ?? '',
            pageNum: String(params.pageNum ?? pageNum),
            rowPerPage: String(params.rowPerPage ?? rowPerPage),
            search: params.search ?? searchRef.current?.value ?? '',
            type: params.type ?? type?.value ?? '',
          }).toString(),
        },
        { replace: true }
      );
    };

    const getList = async (
      status: string,
      branch: string,
      rowPerPage: number,
      pageNum: number,
      search: string,
      type: string,
      { signal }: { signal?: AbortSignal | null } = { signal: null }
    ) => {
      setLoading(true);
      const listStatus =
        status === 'All' || status.length === -1 ? '' : `${status}`;
      const listBranch =
        branch === 'All' || branch.length === -1 ? '' : `${branch}`;
      const listType = type === 'All' || branch.length === -1 ? '' : `${type}`;

      try {
        const res = await fetchDataAsync<CustomerListResponse>(
          `${url}?${extraParams}&status=${listStatus}&branchName=${listBranch}&pageSize=${rowPerPage}&pageNumber=${pageNum}&search=${search}&${
            typeFilter ? `type=${listType}` : ''
          }`,
          { signal: signal ?? undefined }
        );

        setArrCustomer(res?.data?.list ?? []);
        setTotal(res?.data?.total?.[0]);
        const tempTotalDocs = res?.data?.totalDocs;
        setTotalDocs(tempTotalDocs ?? null);
        const totalPage = Math.ceil((tempTotalDocs ?? 0) / rowPerPage);

        if (totalPage > 0 && totalPage < pageNum) {
          navigateList({ pageNum: totalPage });
        }

        onFetchSuccess?.({ data: res?.data, tabStatus: listStatus });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        onFetchFail?.({
          data: (error as { data?: CustomerListResponse })?.data,
          tabStatus: listStatus,
        });
        showErrorResponseMessage(error);
      } finally {
        setLoading(false);
      }
    };

    const getListDetails = (transactionCode?: string) => {
      return fetchData<CustomerListResponse>(
        `${ROUTE_API.operationCustomer}?transactionCode=` + transactionCode,
        {},
        'GET'
      ).then((res) => {
        switch (res?.status) {
          case 200:
            setArrDetails(res?.data?.list?.[0] ?? {});
            return res?.data?.list?.[0];
          case 400:
            showErrorResponseMessage(res);
            break;
          default:
            break;
        }
      });
    };

    const navigateToDetailPage = (transactionCode?: string) => {
      navigate(ROUTE_PATH.customerTransaction(transactionCode ?? ''));
    };

    const processTransaction = (
      status: string | string[],
      item: CustomerTransaction
    ) => {
      if (hasPermissionProccessTransaction(status)) {
        navigateToDetailPage(item.transactionCode);
      } else {
        handleShowTransactionDetail(item);
      }
    };

    const {
      modalRef: issueDateModalRef,
      open: isIssueDateModalOpen,
      openModal: openIssueDateModal,
      closeModal: closeIssueDateModal,
      data: issueDateItem,
    } = useModal<CustomerTransaction>();

    const {
      modalRef: issueDateDetailModalRef,
      open: isIssueDateDetailModalOpen,
      openModal: openIssueDateDetailModal,
      closeModal: closeIssueDateDetailModal,
      data: issueDateDetailItem,
    } = useModal<CustomerTransaction>();

    const handleRecordClick = async (item: CustomerTransaction) => {
      switch (item.status) {
        case STATUS.Submitted:
          processTransaction(['approved', 'bmRejected'], item);
          break;
        case STATUS.Draft:
          if (hasPermissionProccessTransaction(['draft', 'submitted'])) {
            navigate(
              ROUTE_PATH.customerEdit(
                item.transactionCode ?? '',
                item.coreProductCode ?? ''
              )
            );
          } else {
            handleShowTransactionDetail(item);
          }
          break;
        case STATUS.Approved:
          processTransaction(['confirmed', 'driRejected'], item);
          break;
        case STATUS.BM_Rejected:
          processTransaction('draft', item);
          break;
        case STATUS.Confirmed:
        case STATUS.DRI_Rejected:
          navigateToDetailPage(item.transactionCode);
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    };

    const handleShowTransactionDetail = async (item: CustomerTransaction) => {
      const result = await getListDetails(item.transactionCode);
      if (result) {
        openModal();
      }
    };

    const { spinnerState, openSpinner, closeSpinner } = useSpinner();

    const tabHandleClick = (value: string, type?: string) => {
      navigateList({ status: value, pageNum: 1, type: type ? type : '' });
      setTotalDocs(0);
      onTabChange && onTabChange(value);
    };

    const branchSelectedHandleChange = (data: SelectOption | null) => {
      navigateList({ branch: data?.value });
    };

    const handleChangeRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
      const tempRowPerPage = Number(e.target.value);
      setRowPerPage(tempRowPerPage);
      navigateList({ rowPerPage: tempRowPerPage, pageNum: 1 });
    };

    const handleChangePageNum = (e: { selected: number }) => {
      setPageNum(Number(e.selected) + 1);
      navigateList({ pageNum: Number(e.selected) + 1 });
    };

    const handleTypeChange = (data: SelectOption | null) => {
      navigateList({ type: data?.value });
    };

    useEffect(() => {
      if (company) {
        const e_chanel_storage = localStorage.getItem('e_chanel_storage');
        const token_text = e_chanel_storage
          ? JSON.parse(e_chanel_storage)
          : null;
        const companyDetails = company?.find(
          (item) => item?.value === token_text?.company
        );
        const tempBranch: SelectOption[] = [
          { value: STATUS.All, label: STATUS.All },
          ...(companyDetails?.branch || []),
        ];
        setBranch(tempBranch);
        if (searchParams.get('branch')) {
          const branch = searchParams.get('branch');
          setSelectedBranch(tempBranch.find((item) => item.value === branch));
        }
      }
    }, [company]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getList: () => {
            getList(
              tabStatus,
              selectedBranch?.value ?? 'All',
              rowPerPage,
              pageNum,
              searchRef.current?.value ?? '',
              type?.value ?? 'All'
            );
          },
        };
      },
      [tabStatus, selectedBranch, rowPerPage, pageNum, type]
    );

    useEffect(() => {
      let tempStatus = searchParams.get('status') ?? defaultTab;
      let tempBranch = searchParams.get('branch') ?? 'All';
      let tempPageNum = Number(searchParams.get('pageNum') ?? 1);
      let tempRowPerPage = Number(searchParams.get('rowPerPage') ?? 25);
      let tempSearch = searchParams.get('search') ?? '';
      let tempType = searchParams.get('type') || 'All';
      const abortController = new AbortController();
      if (branch.length > 0) {
        setTabStatus(tempStatus);
        setSelectedBranch(branch?.find((item) => item?.value === tempBranch));
        setType(typeOptions.find((item) => item.value === tempType));
        setPageNum(tempPageNum);
        setRowPerPage(tempRowPerPage);
        if (searchRef.current) {
          searchRef.current.value = tempSearch;
        }
        getList(
          tempStatus.replace('_Deleted', ''),
          tempBranch,
          tempRowPerPage,
          tempPageNum,
          tempSearch,
          tempType,
          { signal: abortController.signal }
        );
        resetTableScroll();
      }
    }, [searchParams, branch]);

    const debounceSearch = useDebouncedCallback((value: string) => {
      navigateList({ pageNum: 1, search: value });
    }, 400);

    const {
      modalRef: transactionLogModalRef,
      open: transactionLogModalOpen,
      openModal: openTransactionLogModal,
      closeModal: closeTransactionLogModal,
    } = useModal();

    const isEnableCheckbox =
      typeof enableCheckbox === 'function'
        ? enableCheckbox({ tabStatus })
        : enableCheckbox;

    const isEnableTypeFilter =
      typeof typeFilter === 'function' ? typeFilter({ tabStatus }) : typeFilter;

    const handleIssueDateClick = async (
      e: MouseEvent,
      item?: CustomerTransaction
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (!item) return;

      try {
        const status = item?.customerCardConfirmation?.status;

        setStatusMap((prev) => ({
          ...prev,
          [item.uuid ?? '']: status,
        }));

        if (status === 'green') {
          openIssueDateDetailModal(item);
        } else {
          openIssueDateModal(item);
        }
      } catch (error) {
        console.error('Error fetching issue date data:', error);
      }
    };

    const refreshCardStatus = (cardNumber?: string) => {
      if (!cardNumber) return;

      setArrCustomer((prev) =>
        prev.map((item) => {
          const itemCard =
            item?.customerIssueDate?.cardNumber ??
            item?.customerCardConfirmation?.cardNumber;

          if (itemCard !== cardNumber) return item;

          const nextIssueDate =
            item?.customerIssueDate?.issueDate ?? new Date().toISOString();

          return {
            ...item,
            customerIssueDate: {
              ...(item.customerIssueDate || {}),
              status: 'green',
              issueDate: nextIssueDate,
            },
            customerCardConfirmation: {
              ...(item.customerCardConfirmation || {}),
              status: 'green',
            },
          };
        })
      );
    };

    return (
      <>
        <div className="page-wrapper">
          <div className="card overflow-hidden mt-3 mb-1" style={{ flex: 1 }}>
            <div className="card-header">
              {tab && tab.length > 0 ? (
                <ul
                  className="nav nav-tabs card-header-tabs"
                  data-bs-toggle="tabs"
                >
                  {tab?.map((item, index) => {
                    if (item.hidden) return null;
                    return (
                      <li className="nav-item" key={index}>
                        <a
                          href={`#${item.status}`}
                          onClick={() =>
                            tabHandleClick(item.status ?? '', item.type)
                          }
                          className={`nav-link text-${item.label} ${
                            tabStatus === item.status ? 'active' : ''
                          }`}
                          data-bs-toggle="tab"
                        >
                          <b>{item.label}</b>
                          <span
                            className={`badge bg-${item.label} badge-light ml-5`}
                          >
                            {item.getTotal(total) ?? '0'}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                title
              )}
            </div>
            <div className="overflow-auto d-flex flex-grow-1">
              <div className="d-flex flex-column" style={{ flex: 1 }}>
                <div className={'d-flex mb-3 px-2 pt-3'}>
                  <div
                    className={clsx('btn-list w-100', {
                      'justify-content-end': !renderExtraFilter,
                    })}
                  >
                    {renderExtraFilter &&
                      renderExtraFilter({ tabStatus, total, totalDocs })}
                    {isEnableTypeFilter && (
                      <label
                        className="d-flex align-items-center mx-1 cursor-pointer"
                        style={{
                          minWidth: '200px',
                          maxWidth: '400px',
                          overflow: 'hidden',
                        }}
                      >
                        <b className="mx-2">Type:</b>
                        <Select
                          value={type}
                          onChange={handleTypeChange}
                          options={typeOptions}
                          menuPortalTarget={document.body}
                          styles={selectCustomStyles}
                        />
                      </label>
                    )}
                    {branchFilter && (
                      <label
                        className="d-flex align-items-center mx-1 cursor-pointer"
                        style={{
                          minWidth: '200px',
                          maxWidth: '400px',
                          overflow: 'hidden',
                        }}
                      >
                        <b className="mx-2">Branch:</b>
                        <Select
                          value={selectedBranch}
                          onChange={branchSelectedHandleChange}
                          options={branch}
                          menuPortalTarget={document.body}
                          styles={selectCustomStyles}
                        />
                      </label>
                    )}

                    <div className="input-icon mx-2">
                      <span className="input-icon-addon">
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
                          <circle cx={10} cy={10} r={7} />
                          <line x1={21} y1={21} x2={15} y2={15} />
                        </svg>
                      </span>
                      <input
                        ref={searchRef}
                        type="text"
                        className="form-control"
                        placeholder="Search…"
                        onChange={(e) => {
                          debounceSearch(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  ref={tableRef}
                  className="card-table table-responsive border-top"
                  style={{ flex: 1 }}
                >
                  <table className="table  table-vcenter table-hover">
                    <thead className="position-sticky top-0 ">
                      <tr>
                        {renderTableHead ? (
                          renderTableHead(arrCustomer)
                        ) : (
                          <>
                            {isEnableCheckbox && (
                              <th className="p-0">
                                <label
                                  style={{ padding: '12px 12px 12px 24px' }}
                                  className="w-100 cursor-pointer"
                                >
                                  <Checkbox
                                    disableGutter
                                    checked={
                                      !!isSelectedAllInCurrentList &&
                                      isSelectedAllInCurrentList(arrCustomer)
                                    }
                                    onChange={(checked) => {
                                      handleSelectAllInCurrentList &&
                                        handleSelectAllInCurrentList(
                                          checked,
                                          arrCustomer
                                        );
                                    }}
                                  />
                                </label>
                              </th>
                            )}
                            <th>TRANSACTION</th>
                            <th>BATCH No.</th>
                            <th>INSURED NAME</th>
                            <th>PROJECT</th>
                            <th>PRODUCT</th>
                            <th>DATE</th>
                            <th>USER</th>
                            <th>BRANCH</th>
                            <th>DATE OF ISSUE CARD</th>
                            <th style={{ width: '10%' }}>STATUS</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && arrCustomer?.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="text-center">
                            No result found
                          </td>
                        </tr>
                      ) : null}
                      {loading ? (
                        <tr>
                          <td colSpan={11} style={{ background: '#f8fafc' }}>
                            <div className="d-flex justify-content-center">
                              <span
                                className="spinner-border spinner-border-sm d-block mx-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        arrCustomer?.map((item, index) => {
                          const isCompleted =
                            item?.customerCardConfirmation?.status === 'green';
                          const hasIssueDate =
                            !!item?.customerIssueDate?.issueDate;
                          const isDisabled = !isCompleted && !hasIssueDate;
                          const isEnableItemCheckbox =
                            typeof enableItemCheckbox === 'function'
                              ? enableItemCheckbox(item)
                              : enableItemCheckbox;
                          return (
                            <tr
                              style={{
                                background: item.deleted
                                  ? 'rgb(247 219 219 / 45%)'
                                  : '',
                              }}
                              key={index}
                              onClick={() => {
                                disableRowClick
                                  ? null
                                  : onRowClick
                                  ? onRowClick(item)
                                  : handleRecordClick(item);
                              }}
                              role="button"
                            >
                              {renderTableBody ? (
                                renderTableBody({
                                  index,
                                  item,
                                  handleShowTransactionDetail,
                                })
                              ) : (
                                <>
                                  {isEnableCheckbox && (
                                    <td
                                      className="p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <label
                                        style={{
                                          padding: '12px 12px 12px 24px',
                                        }}
                                        className="w-100 cursor-pointer"
                                      >
                                        <Checkbox
                                          disableGutter
                                          checked={
                                            !!isSelectedItem &&
                                            isSelectedItem(item)
                                          }
                                          onChange={() => {
                                            handleSelectItem &&
                                              handleSelectItem(item);
                                          }}
                                          disabled={!isEnableItemCheckbox}
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
                                  <td
                                    className={clsx({
                                      'text-underline': item.batchNumber,
                                      'text-secondary': item.batchNumber,
                                    })}
                                    title={
                                      item.batchNumber
                                        ? 'Click to process batch transaction'
                                        : undefined
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!item.batchNumber)
                                        return handleRecordClick(item);
                                      navigate(
                                        ROUTE_PATH.customerBatch(
                                          item.batchNumber
                                        )
                                      );
                                    }}
                                  >
                                    {item?.batchNumber || 'N/A'}
                                  </td>
                                  <td className="text-muted">
                                    {item.sureName + ' ' + item.firstName}
                                  </td>
                                  <td className="text-muted">
                                    {item.projectCode}
                                  </td>
                                  <td className="text-muted">
                                    {item.productCode}
                                  </td>
                                  <td className="text-muted">
                                    {formatDay(item.inputDateTime)}
                                  </td>
                                  <td className="text-muted">
                                    {item.inputter}
                                  </td>
                                  <td className="text-muted">
                                    {item.inputBranch}
                                  </td>
                                  <td className="text-muted text-center">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        if (isDisabled) return;
                                        handleIssueDateClick(e, item);
                                      }}
                                      disabled={isDisabled}
                                      className={`issue_btn_status btn ${
                                        isCompleted
                                          ? 'btn-outline-success'
                                          : hasIssueDate
                                          ? 'btn-outline-info'
                                          : 'btn-outline-warning'
                                      }`}
                                      title={
                                        isDisabled ? 'Not Yet Issue' : 'Open'
                                      }
                                    >
                                      {isCompleted
                                        ? 'Completed'
                                        : item.customerIssueDate?.issueDate
                                        ? new Date(
                                            item.customerIssueDate.issueDate
                                          ).toLocaleDateString('en-GB')
                                        : 'Not Yet Issue'}
                                    </button>
                                  </td>
                                  <td
                                    className={clsx(
                                      'text-bold',
                                      'text-underline'
                                    )}
                                  >
                                    <ComponentStatus
                                      deleted={item.deleted}
                                      status={item.status}
                                    />
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="py-2 border-top border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center mx-2">
                    <label className="mx-2">Row per page :</label>
                    <select
                      value={rowPerPage}
                      onChange={handleChangeRowPerPage}
                      className="form-select w-auto"
                      aria-label="multiple select example"
                    >
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  <div className="mx-4">
                    {!!totalDocs && totalDocs > 0 && (
                      <span className="text-muted">
                        {(Number(pageNum) - 1) * rowPerPage + 1} -{' '}
                        {Number(pageNum) * rowPerPage > totalDocs
                          ? totalDocs
                          : Number(pageNum) * rowPerPage}{' '}
                        of {totalDocs}
                      </span>
                    )}
                  </div>
                  <div className="mx-2">
                    {!!totalDocs && totalDocs > 0 && (
                      <ReactPaginate
                        forcePage={pageNum - 1 ? pageNum - 1 : 0}
                        previousLabel={
                          <div className="mx-1">
                            <svg
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
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <polyline points="15 6 9 12 15 18" />
                            </svg>
                          </div>
                        }
                        nextLabel={
                          <div className="mx-1">
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
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <polyline points="9 6 15 12 9 18" />
                            </svg>
                          </div>
                        }
                        pageCount={Math.ceil(totalDocs / rowPerPage)}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={3}
                        onPageChange={handleChangePageNum}
                        containerClassName={'pagination m-0 ml-auto'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <TransactionLogsModal
            onClose={closeTransactionLogModal}
            open={transactionLogModalOpen}
            openSpinner={openSpinner}
            closeSpinner={closeSpinner}
            ref={transactionLogModalRef}
            transactionNo={arrDetails.transactionNumber}
          />
          <TransactionDetailModal data={arrDetails} ref={modalRef}>
            <ShowLogsButton onClick={() => openTransactionLogModal()} />
          </TransactionDetailModal>
          <Spinner {...spinnerState} />
        </div>

        <IssueDateModal
          open={isIssueDateModalOpen}
          closeModal={closeIssueDateModal}
          modalRef={issueDateModalRef}
          item={issueDateItem}
          arrCustomer={arrCustomer}
          onUpdate={refreshCardStatus}
        />

        <IssueDateDetailModal
          open={isIssueDateDetailModalOpen}
          onClose={closeIssueDateDetailModal}
          modalRef={issueDateDetailModalRef}
          item={issueDateDetailItem}
        />
      </>
    );
  }
);

interface ShowLogsButtonProps {
  onClick?: () => void;
  variant?: string;
}

export const ShowLogsButton = ({ onClick, variant }: ShowLogsButtonProps) => {
  return (
    <Button onClick={onClick} variant={variant} size={'sm'}>
      Show Logs
    </Button>
  );
};

interface TransactionLogItem {
  createdDate?: string;
  createdBy?: string;
  action?: string;
}

interface TransactionLogsModalProps {
  transactionNo?: string;
  open?: boolean;
  onClose: () => void;
  openSpinner: (arg?: { title?: string }) => void;
  closeSpinner: () => void;
}

export const TransactionLogsModal = forwardRef<
  HTMLDivElement,
  TransactionLogsModalProps
>(({ transactionNo, open, onClose, openSpinner, closeSpinner }, ref) => {
  const [detail, setDetail] = useState<TransactionLogItem[]>([]);

  const getDetails = async () => {
    try {
      openSpinner();
      const response = await fetchDataAsync<{ list?: TransactionLogItem[] }>(
        `${ROUTE_API.operationLog}?transaction=${transactionNo}`
      );
      setDetail(response?.data?.list ?? []);
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

  useEffect(() => {
    if (open) {
      getDetails();
    }
    return () => {
      onClose();
    };
  }, [open]);

  return (
    <>
      <Modal
        size="lg"
        title={'Logs'}
        bodyClassName="p-0"
        content={
          <table className="table">
            <thead className="position-sticky top-0 ">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {detail?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.createdDate}</td>
                  <td>{item?.createdBy}</td>
                  <td>
                    <ComponentStatus status={item.action} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        ref={ref}
      ></Modal>
    </>
  );
});

export const selectCustomStyles: StylesConfig<any, boolean> = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    boxShadow: undefined,
    cursor: 'pointer',
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
  valueContainer: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    maxWidth: '90%',
    overflow: 'hidden',
  }),
  menu: (base) => {
    const { width, ...css } = base;
    return { ...css, minWidth: '300px' };
  },
};

export default TransactionTabList;
