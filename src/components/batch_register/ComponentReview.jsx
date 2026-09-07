import { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useFormContext } from "react-hook-form";
import { fetchDataAsync } from "../../services/$service";
import { useModal } from "../common/modal";
import ActionSaveDraftConfirmationModal from "../common/ActionSaveDraftConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import { formatDay } from "../../utils/format-day";
import Spinner, { useSpinner } from "../common/Spinner.jsx";
import useMessage from "../../hooks/useMessage.jsx";
import { useNavigate } from "react-router-dom";
import { STATUS } from "../../utils/status.js";

const TAB = {
  New: "New",
  Duplicate: "Duplicate",
  Invalid: "Invalid",
  Existing: "Existing",
};

const ComponentReview = (props) => {
  const { customerList, handleReviewBackStep, product } = props;
  const { getValues } = useFormContext();
  const { hasPermissionProccessTransaction } = useAuth();
  const reviewDetails = getValues();
  const navigate = useNavigate();
  const { spinnerState, openSpinner, closeSpinner } = useSpinner();
  const { showErrorResponseMessage } = useMessage();

  const handleSubmit = async ({ isDraft }) => {
    try {
      openSpinner();
      const data = {
        customerList: customerList?.list,
        project: reviewDetails.project.value,
        policy: reviewDetails.policy.value,
        productCode: product,
        status: isDraft ? STATUS.Draft : STATUS.Submitted,
      };

      await fetchDataAsync("/operation-customer/batch", {
        data,
        method: "POST",
      });
      if (isDraft) {
        toast.success("Draft saved successfully");
      } else {
        toast.success("Batch Customer saved successfully");
      }
      navigate("/dashboard");
      closeModal();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    } finally {
      closeSpinner();
    }
  };

  const [arrList, setArrList] = useState(customerList.list);

  const [tabStatus, setTabStatus] = useState(TAB.New);

  const navTab = [
    { label: TAB.New, status: TAB.New, total: customerList.totalRecord },
    {
      label: TAB.Existing,
      status: TAB.Existing,
      total: customerList.totalExistingRecord,
    },
    {
      label: TAB.Duplicate,
      status: TAB.Duplicate,
      total: customerList.totalDuplicateRecord,
    },
    {
      label: TAB.Invalid,
      status: TAB.Invalid,
      total: customerList.totalErrorRecord,
    },
  ];

  const tabHandleClick = (value) => {
    setTabStatus(value);
    setCurrentPage(0);
    switch (value) {
      case TAB.New:
        setArrList(customerList.list);
        break;
      case TAB.Existing:
        setArrList(customerList.existingList);
        break;
      case TAB.Duplicate:
        setArrList(customerList.duplicateList);
        break;
      case TAB.Invalid:
        setArrList(customerList.errorList);
        break;
    }
  };

  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(arrList.length / PER_PAGE);

  const { modalRef, openModal, closeModal } = useModal();

  const customerDataList = arrList?.slice(offset, offset + PER_PAGE);
  let duplicated = {};
  if (tabStatus === TAB.Duplicate) {
    duplicated = generateColorForDuplicateItem(arrList);
  }

  return (
    <div className="page-wrapper">
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-md-12 col-lg-12">
              <div className="card p-3">
                <div className="row row-cards">
                  <div className="col-12">
                    <h2 className="card-transaction-title text-center mb-3">
                      <span>REVIEW</span>
                    </h2>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Project</label>
                        </div>
                        <input
                          className="form-control"
                          value={reviewDetails?.project?.label}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Policy</label>
                        </div>
                        <input
                          className="form-control"
                          value={reviewDetails?.policy?.value}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <ul
                          className="nav nav-tabs card-header-tabs"
                          data-bs-toggle="tabs"
                        >
                          {navTab.map((item, index) => {
                            return (
                              <li className="nav-item" key={index}>
                                <a
                                  href={`#${item.status}`}
                                  onClick={() => tabHandleClick(item.status)}
                                  className={`nav-link ${
                                    tabStatus === item.status ? "active" : ""
                                  }`}
                                  data-bs-toggle="tab"
                                >
                                  {item.label}
                                  <span className="badge badge-light ml-5">
                                    {item.total}
                                  </span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="card-body">
                        <div className="tab-content">
                          <div className="tab-pane active show">
                            <div>
                              <div className="row align-items-right mb-2">
                                <div className="col-auto ms-auto d-print-none">
                                  <div className="btn-list"></div>
                                </div>
                              </div>
                              <div className="col-12 overflow-auto ">
                                <table className=" table table-vcenter card-table">
                                  <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>SURNAME</th>
                                      <th>FIRST NAME</th>
                                      <th>GENDER</th>
                                      <th>TEL NO.</th>
                                      <th>DATE OF BIRTH</th>
                                      <th>NIC/PASSPORT</th>
                                      <th>Parent ID</th>
                                      <th>Children ID</th>
                                      <th>NATION</th>
                                      <th>PHYSICAL CARD</th>
                                      <th>OPENING DATE</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {customerDataList.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.rowNumber}</td>
                                        <td className="text-muted">
                                          {item.surName}
                                        </td>
                                        <td className="text-muted">
                                          {item.firstName}
                                        </td>
                                        <td className="text-muted">
                                          {item.gender}
                                        </td>
                                        <td className="text-muted">
                                          {item.telNo}
                                        </td>
                                        <td className="text-muted">
                                          {item.dateOfBirth
                                            ? formatDay(
                                                item.dateOfBirth,
                                                "DD/MM/YYYY",
                                              )
                                            : "N/A"}
                                        </td>
                                        <td
                                          className="text-dark"
                                          style={{
                                            background:
                                              duplicated?.nic?.get(
                                                item.nicPassport,
                                              ) || "white",
                                          }}
                                        >
                                          {item.nicPassport}
                                        </td>
                                        <td className="text-muted">
                                          {item.parentId || "N/A"}
                                        </td>
                                        <td
                                          className="text-dark"
                                          style={{
                                            background:
                                              duplicated?.customerId?.get(
                                                item.customerId,
                                              ) || "white",
                                          }}
                                        >
                                          {item.customerId}
                                        </td>
                                        <td className="text-muted">
                                          {item.nation}
                                        </td>
                                        <td className="text-muted">
                                          {item.physicalCard}
                                        </td>
                                        <td className="text-muted">
                                          {item.openingDate
                                            ? formatDay(
                                                item.openingDate,
                                                "DD/MM/YYYY",
                                              )
                                            : "N/A"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div className="d-flex align-items-center mt-2">
                                  <div className="m-0 text-muted">
                                    Total <span>{arrList.length}</span> entries
                                  </div>
                                  <ReactPaginate
                                    forcePage={currentPage}
                                    previousLabel={
                                      <div>
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
                                        prev
                                      </div>
                                    }
                                    nextLabel={
                                      <div>
                                        next
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
                                    pageCount={pageCount || 1}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={3}
                                    onPageChange={handlePageClick}
                                    containerClassName={
                                      "pagination m-0 ms-auto"
                                    }
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
                                </div>
                              </div>
                              <div className="form-footer">
                                <div className="btn-list">
                                  <button
                                    onClick={handleReviewBackStep}
                                    className="btn btn-secondary"
                                    type="button"
                                  >
                                    Back
                                  </button>
                                  <button
                                    className="btn btn-primary"
                                    type="button"
                                    disabled={customerList?.totalRecord <= 0}
                                    onClick={openModal}
                                  >
                                    Submit
                                  </button>
                                  <Spinner {...spinnerState} />
                                  <ActionSaveDraftConfirmationModal
                                    modalRef={modalRef}
                                    closeModal={closeModal}
                                    confirm={hasPermissionProccessTransaction(
                                      "submitted",
                                    )}
                                    saveDraft={hasPermissionProccessTransaction(
                                      "draft",
                                    )}
                                    onSaveDraft={() => {
                                      handleSubmit({ isDraft: true });
                                    }}
                                    onConfirm={handleSubmit}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const duplicatedColorCode = [
  "#EBB99A",
  "#CDFC92",
  "#E6A9D9",
  "#ACD8E6",
  "#E4F4A4",
  "#CFCFE0",
  "#FBD1A6",
  "#98E6D2",
  "#C096F6",
  "#B4F4C6",
  "#FFA390",
  "#AEDEF4",
  "#E9A9F1",
  "#A3F3E3",
  "#C7E19A",
  "#D9D9A2",
  "#E1A2F5",
  "#F5C5A2",
  "#B5E5E5",
  "#D3B5B5",
];

const generateColorForDuplicateItem = (data) => {
  return data.reduce(
    (acc, item) => {
      if (!acc.nic.has(item.nicPassport)) {
        acc.nic.set(item.nicPassport, null);
      } else if (!acc.nic.get(item.nicPassport)) {
        acc.nic.set(item.nicPassport, duplicatedColorCode[acc.nicColor]);
        if (acc.nicColor < duplicatedColorCode.length) {
          acc.nicColor += 1;
        } else {
          acc.nicColor = 0;
        }
      }

      if (!acc.customerId.has(item.customerId)) {
        acc.customerId.set(item.customerId, null);
      } else if (!acc.customerId.get(item.customerId)) {
        acc.customerId.set(
          item.customerId,
          duplicatedColorCode[acc.customerIdColor],
        );
        if (acc.customerIdColor < duplicatedColorCode.length) {
          acc.customerIdColor += 1;
        } else {
          acc.customerIdColor = 0;
        }
      }

      return acc;
    },
    { nic: new Map(), customerId: new Map(), nicColor: 1, customerIdColor: 0 },
  );
};

export default ComponentReview;
