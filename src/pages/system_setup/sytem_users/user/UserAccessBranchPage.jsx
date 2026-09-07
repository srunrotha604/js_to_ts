import { useState, useEffect } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { fetchData } from '../../../../services/$service';

const UserAccessBranchPage = () => {
  document.title = 'E-CHANNEL PORTAL | user access branch';
  const navigate = useNavigate();
  const params = useParams();
  const [arrList, setArrList] = useState([]);
  const [transactionCode, setTransationCode] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [options, setOptions] = useState([]);

  const getList = () => {
    let route =
      '/e-chanel-user/branch/' +
      params.applicationId +
      '/' +
      params.companyCode +
      '/' +
      params.userCode;
    let method = 'GET';

    fetchData(route, {}, method).then((res) => {
      switch (res.status) {
        case 200:
          setArrList(res?.data?.list);
          setOptions(res?.data?.options);
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          navigate('/error404');
      }
    });
  };

  const addCompanyHandleExecute = () => {
    let messages = [];
    if (selectedValue === '') {
      messages.push(true);
      toast.error('Please select company!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
    if (messages.length < 1) {
      let data = {
        applicationFamily: params.applicationId,
        companyFamily: params.companyCode,
        userCode: params.userCode,
        branchFamily: selectedValue,
      };

      fetchData('/e-chanel-user/branch', data, 'POST').then((res) => {
        switch (res.status) {
          case 200:
            toast.success(res.data.message);
            getList();
            setSelectedValue('');
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            redirect('/error404');
        }
      });
    }
  };

  const funcRemoveHandleClickExecute = () => {
    let data = {
      transactionCode: transactionCode,
    };
    fetchData('/e-chanel-user/branch', data, 'DELETE').then((res) => {
      switch (res.status) {
        case 200:
          toast.success(res.data.message);
          getList();
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          redirect('/error404');
      }
    });
  };

  const makeDefaultBranchHandleClickExecute = (item) => {
    let data = {
      transactionCode: item.transactionCode,
      applicationFamily: item.applicationFamily,
      companyFamily: item.companyFamily,
      userCode: params.userCode,
    };
    fetchData('/e-chanel-user/branch', data, 'PUT').then((res) => {
      switch (res.status) {
        case 200:
          toast.success(res.data.message);
          getList();
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          redirect('/error404');
      }
    });
  };

  const getRecordHandleClick = (option, item) => {
    switch (option) {
      case 'delete':
        setTransationCode(item.transactionCode);
        break;
      default:
        navigate('/error404');
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const goBackHandleClick = () => {
    navigate(
      '/dashboard/user/company/' + params.applicationId + '/' + params.userCode
    );
  };

  const companyHandleChange = (e) => {
    setSelectedValue(e.value);
  };

  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  let offset = currentPage * PER_PAGE;
  let pageCount = Math.ceil(arrList.length / PER_PAGE);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      minHeight: '35px',
      height: '35px',
      boxShadow: state.isFocused ? null : null,
    }),
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? '#999999' : null,
        color: '#333333',
      };
    },
    valueContainer: (provided, state) => ({
      ...provided,
    }),

    input: (provided, state) => ({
      ...provided,
    }),
    indicatorSeparator: (state) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '33px',
    }),
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User access branch</h2>
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
                  <>
                    <button
                      className="btn btn-primary d-none d-sm-inline-block"
                      onClick={goBackHandleClick}
                    >
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
                        <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                      </svg>
                      Back
                    </button>
                    <button
                      className="btn btn-primary d-sm-none btn-icon"
                      onClick={goBackHandleClick}
                    >
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
                        <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                      </svg>
                    </button>
                  </>
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-add-company"
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
                    Add branch
                  </button>
                  <button
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-add-company"
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
            <div className="row row-cards">
              <div className="col-12">
                <div className="card">
                  <table className="table table-vcenter card-table">
                    <thead>
                      <tr>
                        <th style={{ width: '5%' }}>#</th>
                        <th>COMPANY</th>
                        <th>BRANCH</th>
                        <th>DEFAULT BRANCH</th>
                        <th style={{ width: '10%' }}>STATUS</th>
                        <th style={{ width: '15%' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arrList &&
                        arrList
                          .slice(offset, offset + PER_PAGE)
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-muted">
                                {item.companyLabel}
                              </td>
                              <td className="text-muted">{item.branchLabel}</td>
                              <td className="text-muted">
                                {item.defaultBranch === 'A' ? 'Defalut' : ''}
                              </td>
                              {item.status === 'Active' ? (
                                <td className="text-primary">{item.status}</td>
                              ) : (
                                <td className="text-danger">{item.status}</td>
                              )}
                              <td>
                                <span
                                  data-bs-toggle="modal"
                                  data-bs-target="#modal-remove"
                                  className="cursor-pointer text-red text-underline"
                                  onClick={() =>
                                    getRecordHandleClick('delete', item)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-trash"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#ff2825"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <line x1={4} y1={7} x2={20} y2={7} />
                                    <line x1={10} y1={11} x2={10} y2={17} />
                                    <line x1={14} y1={11} x2={14} y2={17} />
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                  </svg>
                                </span>
                                <span>
                                  <span
                                    className="cursor-pointer text-red text-underline"
                                    onClick={() =>
                                      makeDefaultBranchHandleClickExecute(item)
                                    }
                                  >
                                    {item.defaultCompany === 'A' ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-trash"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="#ff2825"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <line x1={4} y1={7} x2={20} y2={7} />
                                        <line x1={10} y1={11} x2={10} y2={17} />
                                        <line x1={14} y1={11} x2={14} y2={17} />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-checkbox"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="#6f32be"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <polyline points="9 11 12 14 20 6" />
                                        <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                                      </svg>
                                    )}
                                  </span>
                                </span>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <p className="m-0 text-muted">
                    Total <span>{arrList && arrList && arrList.length}</span>{' '}
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
                    containerClassName={'pagination m-0 ms-auto'}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal modal-blur fade"
        id="modal-add-company"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add branch</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="form-group mb-3 ">
                  <label className="form-label">Branch</label>
                  <div>
                    <Select
                      defaultValue={selectedValue}
                      onChange={companyHandleChange}
                      options={options}
                      styles={customStyles}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn me-auto" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-primary ms-auto"
                data-bs-dismiss="modal"
                onClick={addCompanyHandleExecute}
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
                  <path d="M5 12l5 5l10 -10" />
                </svg>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal modal-blur fade"
        id="modal-remove"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
            <div className="modal-status bg-danger" />
            <div className="modal-body py-4">
              <div className="text-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon mb-2 text-danger icon-lg"
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
                  <path d="M12 9v2m0 4v.01" />
                  <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                </svg>
                <h3>Are you sure?</h3>
                <div className="text-muted">Do you really want to remove?</div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="w-100">
                <div className="row">
                  <div className="col">
                    <button className="btn w-100" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-danger w-100"
                      data-bs-dismiss="modal"
                      onClick={funcRemoveHandleClickExecute}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccessBranchPage;
