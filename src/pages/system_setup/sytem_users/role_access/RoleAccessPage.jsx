import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Loading from '../../../../components/Loading';
import { fetchData } from '../../../../services/$service';
import Select from 'react-select';
import Modal, { useModal } from '../../../../components/common/modal';

const RoleAccessPage = () => {
  document.title = 'E-CHANNEL PORTAL | Role access';
  const navigate = useNavigate();

  const { modalRef, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [arrList, setArrList] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [listAccess, setListAccess] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const getList = () => {
    fetchData('/application-role/access', {}, 'GET').then((res) => {
      if (res?.status == 200) {
        setLoading(true);
        setArrList(res?.data?.list);
        setListAccess(res?.data?.access);
        setLoading(false);
      }
    });
  };

  const funcButtonHandleClickExecute = (e) => {
    const data = {
      transactionCode: selectedRole,
      access: selectedAccess.toString(),
      process: selectedProcess.toString(),
    };
    fetchData('/application-role/access', data, 'PUT').then((res) => {
      switch (res.status) {
        case 200:
          toast.success(res.data.message);
          closeModal();
          getList();
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
    e.preventDefault();
  };

  const accessHandleChange = (e) => {
    setSelectedAccess(Array.isArray(e) ? e.map((x) => x.value) : []);
    selectedAccess && JSON.stringify(selectedAccess, null, 2);
  };

  const processHandleChange = (e) => {
    setSelectedProcess(Array.isArray(e) ? e.map((x) => x.value) : []);
    selectedProcess && JSON.stringify(selectedProcess, null, 2);
  };

  useEffect(() => {
    getList();
  }, []);

  const PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(arrList?.length / PER_PAGE);
  return (
    <React.Fragment>
      <Loading value={loading} />
      <Modal ref={modalRef} title={'Access & Process'} size="xl">
        <div className="mb-3">
          <label className="form-label required">Access</label>
          <div>
            <Select
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              placeholder="Select Option"
              value={listAccess.filter((obj) =>
                selectedAccess.includes(obj.value)
              )}
              options={listAccess}
              onChange={accessHandleChange}
              isMulti
              isClearable
              closeMenuOnSelect={false}
            />
            <div className="invalid-feedback">Please select User!</div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label required">Process</label>
          <div>
            <Select
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              placeholder="Select Option"
              value={listAccess.filter((obj) =>
                selectedProcess.includes(obj.value)
              )}
              options={listAccess}
              onChange={processHandleChange}
              isMulti
              isClearable
              closeMenuOnSelect={false}
            />
            <div className="invalid-feedback">Please select User!</div>
          </div>
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={funcButtonHandleClickExecute}
          >
            Submit
          </button>
        </div>
      </Modal>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Role Access</h2>
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
                        <th>ROLE NAME</th>
                        <th>ACCESS</th>
                        <th>PROCESS</th>
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
                              <td className="text-muted">{item.roleName}</td>
                              <td className="text-muted">{item.access}</td>
                              <td className="text-muted">{item.process}</td>
                              <td
                                className="text-underline text-primary"
                                onClick={() => {
                                  openModal();
                                  setSelectedRole(item?.transactionCode);
                                  setSelectedAccess(item?.access);
                                  setSelectedProcess(item?.process);
                                }}
                              >
                                Change
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
    </React.Fragment>
  );
};

export default RoleAccessPage;
