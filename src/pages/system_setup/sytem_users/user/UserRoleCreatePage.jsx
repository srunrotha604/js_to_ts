import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../services/$service';
import { ROUTE_PATH } from '../../../../utils/route-util';

const UserRoleCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | user role create';
  const navigate = useNavigate();
  const params = useParams();

  const [optionApplication, setOptionApplication] = useState([]);
  const [optionRole, setOptionRole] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const getApplicationList = () => {
    fetchData('/DataOption/application/' + params.key, {}, 'GET').then(
      (res) => {
        switch (res.status) {
          case 200:
            setOptionApplication(res?.data?.application);
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            navigate(ROUTE_PATH.error404);
        }
      }
    );
  };

  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedApplication === '') {
      messages.push(true);
    }
    if (selectedRole === '') {
      messages.push(true);
    } else {
      if (messages.length < 1) {
        let data = {
          applicationFamily: selectedApplication,
          roleFamily: selectedRole,
          userCode: params.key,
        };

        fetchData('/e-chanel-user/role', data, 'POST').then((res) => {
          switch (res.status) {
            case 200:
              toast.success(res.data.message);
              navigate(ROUTE_PATH.userRole(params.key));
              break;
            case 400:
              toast.error(res?.data?.message);
              break;
            case 403:
              toast.error(res?.data);
              break;
            default:
              navigate(ROUTE_PATH.error404);
          }
        });
      }
    }
    e.preventDefault();
  };

  const applicationHandleChange = (e) => {
    setSelectedApplication(e.value);

    fetchData('/DataOption/system-user-role/' + e.value, {}, 'GET').then(
      (res) => {
        switch (res.status) {
          case 200:
            setOptionRole(res?.data?.options);
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            navigate(ROUTE_PATH.error404);
        }
      }
    );
  };

  const roleHandleChange = (e) => {
    setSelectedRole(e.value);
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.userRole(params.key));
  };

  useEffect(() => {
    getApplicationList();
  }, []);

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
    valueContainer: (provided) => ({
      ...provided,
    }),

    input: (provided) => ({
      ...provided,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '33px',
    }),
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Add role</h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              <div className="card-body">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label required">Application</label>
                    <div>
                      <Select
                        value={optionApplication.filter(function (option) {
                          return option.value === selectedApplication;
                        })}
                        onChange={applicationHandleChange}
                        options={optionApplication}
                        styles={customStyles}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select application!
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Role</label>
                    <div>
                      <Select
                        value={optionRole.filter(function (option) {
                          return option.value === selectedRole;
                        })}
                        onChange={roleHandleChange}
                        options={optionRole}
                        styles={customStyles}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Role!
                      </div>
                    </div>
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

export default UserRoleCreatePage;
