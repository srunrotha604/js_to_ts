import React, { useEffect, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../../../utils/route-util';

const UserAccessStatusPage = () => {
  document.title = 'E-CHANNEL PORTAL | user access status';
  const navigate = useNavigate();
  const params = useParams();
  const [value, setValue] = useState('');
  const [admin, setAdmin] = useState('');
  const [optionsAccess, setOptionsAccess] = useState([]);
  const [selectedAccessValue, setSelectedAccessValue] = useState([]);
  const [optionsProcess, setOptionsProcess] = useState([]);
  const [selectedProcessValue, setSelectedProcessValue] = useState([]);

  const getList = () => {
    fetchData(
      `${ROUTE_API.eChanelUserAccess}/` + params.userCode,
      {},
      'GET'
    ).then((res) => {
      switch (res.status) {
        case 200:
          setValue(res?.data?.role[0].value);
          setOptionsAccess(res?.data?.access);
          setOptionsProcess(res?.data?.access);
          setAdmin(res?.data?.role[0].keyCode);
          setSelectedAccessValue(res?.data?.role[0]?.label);
          setSelectedProcessValue(res?.data?.role[0]?.labelSecond);
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(res?.data);
          break;
        default:
          redirect(ROUTE_PATH.error404);
      }
    });
  };

  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedAccessValue === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      const data = {
        transactionCode: value,
        accessStatus: selectedAccessValue.toString(),
        processStatus: selectedProcessValue.toString(),
        adminBranch: admin,
      };
      fetchData(ROUTE_API.eChanelUserAccess, data, 'POST').then((res) => {
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
            redirect(ROUTE_PATH.error404);
        }
      });
    }
    e.preventDefault();
  };

  useEffect(() => {
    getList();
  }, []);

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };

  const accessHandleChange = (e) => {
    setSelectedAccessValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    selectedAccessValue && JSON.stringify(selectedAccessValue, null, 2);
  };

  const processHandleChange = (e) => {
    setSelectedProcessValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    selectedProcessValue && JSON.stringify(selectedProcessValue, null, 2);
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User transaction</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="form-label">Access transaction</div>
                    <Select
                      placeholder="Select Option"
                      value={optionsAccess.filter((obj) =>
                        selectedAccessValue.includes(obj.value)
                      )}
                      options={optionsAccess}
                      onChange={accessHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-label">Process transaction</div>
                    <Select
                      placeholder="Select Option"
                      value={optionsProcess.filter((obj) =>
                        selectedProcessValue.includes(obj.value)
                      )}
                      options={optionsProcess}
                      onChange={processHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={admin === 'true'}
                        onChange={(e) => {
                          setAdmin(e.target.checked.toString());
                        }}
                      />
                      <span className="form-check-label">Admin branch</span>
                    </label>
                  </div>
                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserAccessStatusPage;
