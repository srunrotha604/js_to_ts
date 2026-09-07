import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Loading from "../../../../components/Loading";
import { fetchData } from "../../../../services/$service";
import { useAuth } from "../../../../context/AuthContext.jsx";
import Select from "react-select";
import { selectCustomStyles } from "../../../../components/transaction/TransactionTabList";
import TableCellAction from "../../../../components/form/TableCellAction";
import TableBreakBar from "../../../../components/table/table_action/TableBreakBar.jsx";
import TableCellTextDeleteConfirm from "../../../../components/table/table_action/TableCellTextDeleteConfirm.jsx";
import TableCellStatusCodeHandle from "../../../../components/form/TableCellStatusCodeHandle.jsx";
import AddPhoneNumber from "./components/AddPhoneNumber.jsx";

const UserPage = () => {
  document.title = "E-CHANNEL PORTAL | user";
  const navigate = useNavigate();
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [arrList, setArrList] = useState([]);
  const [optionBranch, setOptionBranch] = useState([]);
  const [selectedBranch, setSelectdBranch] = useState("");
  const getList = () => {
    fetchData(
      "/e-chanel-user?branchName=" + selectedBranch.toString(),
      {},
      "GET",
    ).then((res) => {
      if (res?.status == 200) {
        setLoading(true);
        setArrList(res?.data?.list);
        setLoading(false);
      }
    });
  };

  const branchHandleChange = (data) => {
    setSelectdBranch(data.value);
    fetchData(
      "/e-chanel-user?branchName=" + data.value.toString(),
      {},
      "GET",
    ).then((res) => {
      if (res.status == 200) {
        setLoading(true);
        setArrList(res?.data?.list);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getList();
    const e_chanel_storage = localStorage.getItem("e_chanel_storage");
    const token_text = JSON.parse(e_chanel_storage);
    const companyDetails = company?.find(
      (item) => item?.value === token_text?.company,
    );
    const tempBranch = companyDetails?.branch || [];

    setOptionBranch(tempBranch);
  }, []);

  const createNewHandleClick = () => {
    navigate("/dashboard/user/create");
  };

  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const filteredList = arrList?.filter((item) => {
    const search = query.toLowerCase().trim();

    return search === ""
      ? true
      : item.userName?.toLowerCase()?.includes(search) ||
          item.email?.toLowerCase()?.includes(search) ||
          item.givenName?.toLowerCase()?.includes(search) ||
          item.sureName?.toLowerCase()?.includes(search) ||
          item.phone?.toLowerCase()?.includes(search);
  });

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(filteredList?.length / PER_PAGE);

  return (
    <>
      <Loading value={loading} />
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <div>
                    <button
                      className="btn btn-primary d-none d-sm-inline-block"
                      onClick={getList}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-refresh"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                      </svg>
                      Reload
                    </button>
                    <button
                      className="btn btn-primary d-sm-none btn-icon"
                      onClick={getList}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-refresh"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={createNewHandleClick}
                  >
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
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Create user
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-input-field"
                    aria-label="Create new category"
                    onClick={createNewHandleClick}
                  >
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
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="row align-items-center mb-2">
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <div>
                    <Select
                      menuPortalTarget={document.body}
                      value={optionBranch.find(function (option) {
                        return option.value === selectedBranch;
                      })}
                      onChange={branchHandleChange}
                      options={optionBranch}
                      styles={selectCustomStyles}
                      required
                    />
                  </div>
                  <div className="input-icon">
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
                      cursor="pointer"
                      type="text"
                      className="form-control"
                      placeholder="Search…"
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setCurrentPage(0);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th>USER NAME</th>
                        <th>EMAIL</th>
                        <th>PHONE NUMBER</th>
                        <th>DISPLAY NAME</th>
                        <th>ROLE</th>
                        <th>TYPE</th>
                        <th style={{ width: "10%" }}>STATUS</th>
                        <th style={{ width: "15%" }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList
                        ?.slice(offset, offset + PER_PAGE)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-muted">{item.userName}</td>
                            <td className="text-muted">{item.email}</td>
                            <td className="cursor-pointer">
                              {item?.phone == "" ? (
                                <AddPhoneNumber
                                  item={item}
                                  success={() => getList()}
                                />
                              ) : (
                                <AddPhoneNumber
                                  item={item}
                                  success={() => getList()}
                                />
                              )}
                            </td>
                            <td className="text-muted">
                              {item.givenName} {item.sureName}
                            </td>
                            <td className="text-muted">{item.roleName}</td>
                            <td className="text-muted">{item.userType}</td>
                            <TableCellStatusCodeHandle status={item?.status} />
                            <TableCellAction>
                              <Link
                                to={`/dashboard/user/company?uuid=${item?.transactionCode}&appMember=${item?.applicationCode}`}
                              >
                                Company
                              </Link>
                              <TableBreakBar />
                              <Link
                                to={
                                  "/dashboard/user/edit/" +
                                  item?.transactionCode
                                }
                              >
                                Edit
                              </Link>
                              {item?.deleted ? (
                                <>
                                  <TableBreakBar />
                                  <TableCellTextDeleteConfirm
                                    success={() => getList()}
                                    uuid={item?.transactionCode}
                                    route="/e-chanel-user"
                                    title="Delete User"
                                    message={`Confirm delete user: ${item.givenName} ${item.sureName}?`}
                                    data={{
                                      uuid: item?.transactionCode,
                                    }}
                                  />
                                </>
                              ) : (
                                ""
                              )}
                            </TableCellAction>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <p className="m-0 text-muted">
                    Total <span>{arrList && arrList && arrList.length}</span>{" "}
                    entries
                  </p>
                  <ReactPaginate
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
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <polyline points="9 6 15 12 9 18" />
                        </svg>
                      </div>
                    }
                    pageCount={pageCount}
                    marginPagesDisplayed={3}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination m-0 ms-auto"}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserPage;
