import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Select from "react-select";
import ComponentStatus from "../../components/customer/ComponentStatus";
import { fetchData, fetchDataAsync } from "../../services/$service";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import TransactionDetailModal from "../../components/transaction/TransactionDetailModal";
import ReactPaginate from "react-paginate";
import { formatDay } from "../../utils/format-day";
import Modal, { useModal } from "../common/modal/index.jsx";
import useMessage from "../../hooks/useMessage.jsx";
import Checkbox from "../common/Checkbox.jsx";
import Spinner, { useSpinner } from "../common/Spinner.jsx";
import axios from "axios";
import TransactionNumberTableItem from "./TransactionNumberTableItem.jsx";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { delay } from "../../utils/delay";
import IssueDateModal from "../../components/IssueDateModal";
import IssueDateDetailModal from "../../components/IssueDateDetailModal";
import "../../assets/style/custom_style.css";
import { ROUTE_PATH } from "../../utils/route-util";

const STATUS = {
  All: "All",
  Draft: "Draft",
  Approved: "Approved",
  BM_Rejected: "BM-Rejected",
  DRI_Rejected: "DRI-Rejected",
  Confirmed: "Confirmed",
  Submitted: "Submitted",
  BM_Rejected_Draft: "BM-Rejected-Draft",
};

const TYPE = {
  All: "All",
  Batch: "Batch",
  Single: "Single",
  Delete: "Delete",
};

export const typeOptions = [
  { value: TYPE.All, label: TYPE.All },
  { value: TYPE.Single, label: TYPE.Single },
  { value: TYPE.Batch, label: TYPE.Batch },
  { value: TYPE.Delete, label: TYPE.Delete },
];

export const recordOptions = [
  { value: TYPE.Active, label: TYPE.Active },
  { value: TYPE.Disable, label: TYPE.Disable },
];
//eslint-disable-next-line react/display-name
const TransactionTabList = forwardRef(
  (
    {
      title,
      tab,
      branchFilter = true,
      renderTableHead,
      renderTableBody,
      path = ROUTE_PATH.dashboard,
      url = "/operation-customer",
      extraParams = "",
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
    ref,
  ) => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const { hasPermissionProccessTransaction, company } = useAuth();
    const [arrCustomer, setArrCustomer] = useState([]);
    const [, setStatusMap] = useState({});
    const [arrDetails, setArrDetails] = useState({});
    const [total, setTotal] = useState([]);
    const [totalDocs, setTotalDocs] = useState(null);
    const [branch, setBranch] = useState([]);
    const { openModal, modalRef } = useModal();
    const [selectedBranch, setSelectedBranch] = useState({
      label: "All",
      value: "All",
    });
    const [type, setType] = useState({ value: "All", label: "All" });
    const [tabStatus, setTabStatus] = useState(defaultTab);
    // const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const [rowPerPage, setRowPerPage] = useState(25);
    const [pageNum, setPageNum] = useState(1);
    const { showErrorResponseMessage } = useMessage();
    const tableRef = useRef(null);
    const searchRef = useRef(null);

    const resetTableScroll = (position = 0) => {
      if (tableRef.current) {
        tableRef.current.scrollTop = position;
      }
    };

    const getList = async (
      status,
      branch,
      rowPerPage,
      pageNum,
      search,
      type,
      { signal } = { signal: null },
    ) => {
      setLoading(true);
      const listStatus =
        status === "All" || status.length === -1 ? "" : `${status}`;
      const listBranch =
        branch === "All" || branch.length === -1 ? "" : `${branch}`;
      const listType = type === "All" || branch.length === -1 ? "" : `${type}`;

      try {
        const res = await fetchDataAsync(
          `${url}?${extraParams}&status=${listStatus}&branchName=${listBranch}&pageSize=${rowPerPage}&pageNumber=${pageNum}&search=${search}&${
            typeFilter ? `type=${listType}` : ""
          }`,
          { signal },
        );

        setArrCustomer(res?.data?.list);
        setTotal(res?.data?.total[0]);
        const tempTotalDocs = res?.data?.totalDocs;
        setTotalDocs(tempTotalDocs);
        const totalPage = Math.ceil(tempTotalDocs / rowPerPage);

        if (totalPage > 0 && totalPage < pageNum) {
          navigateList({ pageNum: totalPage });
        }

        onFetchSuccess &&
          onFetchSuccess({ data: res?.data, tabStatus: listStatus });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        onFetchFail &&
          onFetchFail({ data: error?.data, tabStatus: listStatus });
        showErrorResponseMessage(error);
      } finally {
        setLoading(false);
      }
    };

    const getListDetails = (transactionCode) => {
      return fetchData(
        "/operation-customer?transactionCode=" + transactionCode,
        {},
        "GET",
      ).then((res) => {
        switch (res.status) {
          case 200:
            setArrDetails(res?.data?.list[0]);
            return res?.data?.list[0];
          case 400:
            showErrorResponseMessage(res);
            break;
          default:
            break;
        }
      });
    };

    const navigateToDetailPage = (transactionCode) => {
      navigate(ROUTE_PATH.customerTransaction(transactionCode));
    };

    const processTransaction = (status, item) => {
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
    } = useModal();

    const {
      modalRef: issueDateDetailModalRef,
      open: isIssueDateDetailModalOpen,
      openModal: openIssueDateDetailModal,
      closeModal: closeIssueDateDetailModal,
      data: issueDateDetailItem,
    } = useModal();

    const handleRecordClick = async (item) => {
      switch (item.status) {
        case STATUS.Submitted:
          processTransaction(["approved", "bmRejected"], item);
          break;
        case STATUS.Draft:
          if (hasPermissionProccessTransaction(["draft", "submitted"])) {
            navigate(
              ROUTE_PATH.customerEdit(
                item.transactionCode,
                item.coreProductCode,
              ),
            );
          } else {
            handleShowTransactionDetail(item);
          }
          break;
        case STATUS.Approved:
          processTransaction(["confirmed", "driRejected"], item);
          break;
        case STATUS.BM_Rejected:
          processTransaction("draft", item);
          break;
        case STATUS.Confirmed:
        case STATUS.DRI_Rejected:
          navigateToDetailPage(item.transactionCode);
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    };

    const handleShowTransactionDetail = async (item) => {
      const result = await getListDetails(item.transactionCode, item.status);
      if (result) {
        openModal();
      }
    };

    const navigateList = (params) => {
      navigate(
        {
          pathname: path,
          search: createSearchParams({
            status: tabStatus,
            branch: selectedBranch.value,
            pageNum,
            rowPerPage,
            search: searchRef.current.value,
            type: type?.value,
            // startDate: formatDay(date?.startDate, 'YYYY-MM-DD'),
            // endDate: formatDay(date?.endDate, 'YYYY-MM-DD'),
            ...params,
          }).toString(),
        },
        { replace: true },
      );
    };

    const { spinnerState, openSpinner, closeSpinner } = useSpinner();

    const tabHandleClick = (value, type) => {
      navigateList({ status: value, pageNum: 1, type: type ? type : "" });
      setTotalDocs(0);
      onTabChange && onTabChange(value);
    };

    const branchSelectedHandleChange = (data) => {
      navigateList({ branch: data.value });
    };

    const handleChangeRowPerPage = (e) => {
      const tempRowPerPage = e.target.value;
      setRowPerPage(tempRowPerPage);
      navigateList({ rowPerPage: tempRowPerPage, pageNum: 1 });
    };

    const handleChangePageNum = (e) => {
      setPageNum(Number(e.selected) + 1);
      navigateList({ pageNum: Number(e.selected) + 1 });
    };

    const handleTypeChange = (data) => {
      navigateList({ type: data.value });
    };

    useEffect(() => {
      if (company) {
        const e_chanel_storage = localStorage.getItem("e_chanel_storage");
        const token_text = JSON.parse(e_chanel_storage);
        const companyDetails = company?.find(
          (item) => item?.value === token_text?.company,
        );
        const tempBranch = [
          { value: STATUS.All, label: STATUS.All },
          ...(companyDetails?.branch || []),
        ];
        setBranch(tempBranch);
        if (searchParams.get("branch")) {
          const branch = searchParams.get("branch");
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
              selectedBranch.value,
              rowPerPage,
              pageNum,
              searchRef.current.value,
              type,
              // date.startDate,
              // date.endDate
            );
          },
        };
      },
      [
        tabStatus,
        selectedBranch,
        rowPerPage,
        pageNum,
        type,
        // date
      ],
    );

    useEffect(() => {
      let tempStatus = searchParams.get("status") ?? defaultTab;
      let tempBranch = searchParams.get("branch") ?? "All";
      let tempPageNum = searchParams.get("pageNum") ?? 1;
      let tempRowPerPage = searchParams.get("rowPerPage") ?? 25;
      let tempSearch = searchParams.get("search") ?? "";
      let tempType = searchParams.get("type") || "All";
      // let tempStartDate = searchParams.get('startDate')
      //   ? new Date(searchParams.get('startDate'))
      //   : new Date();
      // let tempEndDate = searchParams.get('endDate')
      //   ? new Date(searchParams.get('endDate'))
      //   : new Date();
      const abortController = new AbortController();
      if (branch.length > 0) {
        setTabStatus(tempStatus);
        setSelectedBranch(branch?.find((item) => item?.value === tempBranch));
        setType(typeOptions.find((item) => item.value === tempType));
        setPageNum(tempPageNum);
        setRowPerPage(tempRowPerPage);
        // setDate({ startDate: tempStartDate, endDate: tempEndDate });
        if (searchRef.current) {
          searchRef.current.value = tempSearch;
        }
        getList(
          tempStatus.replace("_Deleted", ""),
          tempBranch,
          tempRowPerPage,
          tempPageNum,
          tempSearch,
          tempType,
          { signal: abortController.signal },

          // tempStartDate,
          // tempEndDate
        );
        resetTableScroll();
      }
      // return () => {
      //   abortController.abort();
      // };
    }, [searchParams, branch]);

    // useEffect(() => {
    //   const id = setInterval(
    //     () => {
    //       getList(
    //         tabStatus,
    //         selectedBranch.value,
    //         rowPerPage,
    //         pageNum,
    //         searchRef.current.value,
    //         type.value
    //         // date.startDate,
    //         // date.endDate
    //       );
    //     },
    //     300000 // 5 minutes
    //   );

    //   return () => {
    //     clearInterval(id);
    //   };
    // }, [
    //   tabStatus,
    //   selectedBranch,
    //   rowPerPage,
    //   pageNum,
    //   type,
    //   // date
    // ]);

    const debounceSearch = useDebouncedCallback(
      // function
      (value) => {
        navigateList({ pageNum: 1, search: value });
      },
      // delay in ms
      400,
    );

    const {
      modalRef: transactionLogModalRef,
      open: transactionLogModalOpen,
      openModal: openTransactionLogModal,
      closeModal: closeTransactionLogModal,
    } = useModal();

    // const handleStatusChange = (newStatus) => {
    //   console.log("Status changed to:", newStatus);
    // };

    const isEnableCheckbox =
      typeof enableCheckbox === "function"
        ? enableCheckbox({ tabStatus })
        : enableCheckbox;

    const isEnableTypeFilter =
      typeof typeFilter === "function" ? typeFilter({ tabStatus }) : typeFilter;

    const handleIssueDateClick = async (e, item) => {
      e.preventDefault();
      e.stopPropagation();

      if (!item) return;

      try {
        setStatusMap((prev) => ({
          ...prev,
          [item.uuid]: status,
        }));

        const status = item?.customerCardConfirmation?.status;

        if (status === "green") {
          openIssueDateDetailModal(item);
        } else {
          openIssueDateModal(item);
        }
      } catch (error) {
        console.error("Error fetching issue date data:", error);
      }
    };

    const refreshCardStatus = (cardNumber) => {
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
              status: "green",
              issueDate: nextIssueDate,
            },
            customerCardConfirmation: {
              ...(item.customerCardConfirmation || {}),
              status: "green",
            },
          };
        }),
      );
    };

    return (
      <>
        <div className="page-wrapper">
          <div className="card overflow-hidden mt-3 mb-1" style={{ flex: 1 }}>
            <div className="card-header">
              {tab?.length > 0 ? (
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
                          onClick={() => tabHandleClick(item.status, item.type)}
                          className={`nav-link text-${item.label} ${
                            tabStatus === item.status ? "active" : ""
                          }`}
                          data-bs-toggle="tab"
                        >
                          <b>{item.label}</b>
                          <span
                            className={`badge bg-${item.label} badge-light ml-5`}
                          >
                            {item.getTotal(total) ?? "0"}
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
                <div className={"d-flex mb-3 px-2 pt-3"}>
                  <div
                    className={clsx("btn-list w-100", {
                      "justify-content-end": !renderExtraFilter,
                    })}
                  >
                    {renderExtraFilter &&
                      renderExtraFilter({ tabStatus, total, totalDocs })}
                    {isEnableTypeFilter && (
                      <label
                        className="d-flex align-items-center mx-1 cursor-pointer"
                        style={{
                          minWidth: "200px",
                          maxWidth: "400px",
                          overflow: "hidden",
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
                          minWidth: "200px",
                          maxWidth: "400px",
                          overflow: "hidden",
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
                                  style={{ padding: "12px 12px 12px 24px" }}
                                  className="w-100 cursor-pointer"
                                >
                                  <Checkbox
                                    disableGutter
                                    checked={
                                      isSelectedAllInCurrentList &&
                                      isSelectedAllInCurrentList(arrCustomer)
                                    }
                                    onChange={(checked) => {
                                      handleSelectAllInCurrentList &&
                                        handleSelectAllInCurrentList(
                                          checked,
                                          arrCustomer,
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
                            <th style={{ width: "10%" }}>STATUS</th>
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
                          <td colSpan={11} style={{ background: "#f8fafc" }}>
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
                            item?.customerCardConfirmation?.status === "green";
                          const hasIssueDate =
                            !!item?.customerIssueDate?.issueDate;
                          const isDisabled = !isCompleted && !hasIssueDate;
                          const isEnableItemCheckbox =
                            typeof enableItemCheckbox === "function"
                              ? enableItemCheckbox(item)
                              : enableItemCheckbox;
                          return (
                            <tr
                              style={{
                                background: item.deleted
                                  ? "rgb(247 219 219 / 45%)"
                                  : "",
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
                                          padding: "12px 12px 12px 24px",
                                        }}
                                        className="w-100 cursor-pointer"
                                      >
                                        <Checkbox
                                          disableGutter
                                          checked={
                                            isSelectedItem &&
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
                                    title={"Click to view transaction detail"}
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
                                      "text-underline": item.batchNumber,
                                      "text-secondary": item.batchNumber,
                                    })}
                                    title={
                                      item.batchNumber &&
                                      "Click to process batch transaction"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!item.batchNumber)
                                        return handleRecordClick(item);
                                      navigate(
                                        ROUTE_PATH.customerBatch(
                                          item.batchNumber,
                                        ),
                                      );
                                    }}
                                  >
                                    {item?.batchNumber || "N/A"}
                                  </td>
                                  <td className="text-muted">
                                    {item.sureName + " " + item.firstName}
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
                                          ? "btn-outline-success"
                                          : hasIssueDate
                                          ? "btn-outline-info"
                                          : "btn-outline-warning"
                                      }`}
                                      title={
                                        isDisabled ? "Not Yet Issue" : "Open"
                                      }
                                    >
                                      {isCompleted
                                        ? "Completed"
                                        : hasIssueDate
                                        ? new Date(
                                            item.customerIssueDate.issueDate,
                                          ).toLocaleDateString("en-GB")
                                        : "Not Yet Issue"}
                                    </button>
                                  </td>
                                  <td
                                    className={clsx(
                                      "text-bold",
                                      "text-underline",
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
                    {totalDocs > 0 && (
                      <span className="text-muted">
                        {(Number(pageNum) - 1) * rowPerPage + 1} -{" "}
                        {Number(pageNum) * rowPerPage > totalDocs
                          ? totalDocs
                          : Number(pageNum) * rowPerPage}{" "}
                        of {totalDocs}
                      </span>
                    )}
                  </div>
                  <div className="mx-2">
                    {totalDocs > 0 && (
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
                        containerClassName={"pagination m-0 ml-auto"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
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
          // onStatusChange={handleStatusChange}
          onUpdate={refreshCardStatus}
        />

        <IssueDateDetailModal
          open={isIssueDateDetailModalOpen}
          onClose={closeIssueDateDetailModal}
          modalRef={issueDateDetailModalRef}
          item={issueDateDetailItem}
          arrCustomer={arrCustomer}
          // onStatusChange={handleStatusChange}
          onUpdate={refreshCardStatus}
        />
      </>
    );
  },
);

export const ShowLogsButton = ({ onClick, variant }) => {
  return (
    <Button onClick={onClick} variant={variant} size={"sm"}>
      Show Logs
    </Button>
  );
};

// eslint-disable-next-line react/display-name
export const TransactionLogsModal = forwardRef(
  ({ transactionNo, open, onClose, openSpinner, closeSpinner }, ref) => {
    // const { modalRef, openModal, open, closeModal } = useModal();
    const [detail, setDetail] = useState([]);

    useEffect(() => {
      if (open) {
        getDetails();
      }
      return () => {
        onClose();
      };
    }, [open]);

    const getDetails = async () => {
      try {
        openSpinner();
        const response = await fetchDataAsync(
          `/operation-customer/log?transaction=${transactionNo}`,
        );
        setDetail(response?.data?.list);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        delay(() => {
          closeSpinner();
        });
      }
    };

    return (
      <>
        <Modal
          size="lg"
          title={"Logs"}
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
  },
);

export const selectCustomStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    boxShadow: state.isFocused ? null : null,
    cursor: "pointer",
  }),
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  valueContainer: (provided) => ({
    ...provided,
    // maxWidth: '300px',
    whiteSpace: "nowrap",
    // minWidth: '50px',
    flexWrap: "nowrap",
    // textOverflow: 'ellipsis',
    maxWidth: "90%",
    // whiteSpace: "nowrap",
    overflow: "hidden",
  }),
  // eslint-disable-next-line no-unused-vars
  menu: ({ width, ...css }) => ({ ...css, minWidth: "300px" }),
};

export default TransactionTabList;
