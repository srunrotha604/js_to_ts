import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData } from '../../../../services/$service';
import Select from 'react-select';
import { ROUTE_PATH } from '../../../../utils/route-util';

const UserEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | user - create';
  const navigate = useNavigate();
  const params = useParams();

  const [textEmail, setTextEmail] = useState('');
  const [arrList, setArrList] = useState([]);
  const [textFirstName, setTextFirstName] = useState('');
  const [textLastName, setTextLastName] = useState('');
  const [RoleCategory, setOptionBranch] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  const getList = () => {
    fetchData(
      `/e-chanel-user?transaction=${params.key}&branchName=`,
      {},
      'GET'
    ).then((res) => {
      switch (res.status) {
        case 200:
          // eslint-disable-next-line no-case-declarations
          const dataList = res?.data?.list[0];
          setArrList(dataList);
          console.log(arrList);
          setTextEmail(dataList.email);
          setTextFirstName(dataList.givenName);
          setTextLastName(dataList.sureName);
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
    fetchData('/e-chanel-user/access', {}, 'GET').then((res) => {
      switch (res.status) {
        case 200:
          setOptionBranch(res?.data?.role);

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
  };
  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (textEmail === '') {
      messages.push(true);
    }
    if (textFirstName === '') {
      messages.push(true);
    }
    if (textLastName === '') {
      messages.push(true);
    }
    if (selectedRole === '') {
      messages.push(true);
    } else {
      if (messages.length < 1) {
        let data = {
          key: params.key,
          role: selectedRole,
        };

        fetchData('/e-chanel-user', data, 'PUT').then((res) => {
          switch (res.status) {
            case 200:
              toast.success(res.data.message);
              navigate(ROUTE_PATH.user);
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

  useEffect(() => {
    getList();
  }, []);

  const emailHandleChange = (event) => {
    setTextEmail(event.target.value);
  };
  const firstNameHandleChange = (event) => {
    setTextFirstName(event.target.value);
  };
  const lastNameHandleChange = (event) => {
    setTextLastName(event.target.value);
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };

  const roleHandleChange = (e) => {
    setSelectedRole(e.value);
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">User #create new</h2>
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
                    <label className="form-label required">Email</label>
                    <div>
                      <input
                        type="email"
                        className={
                          textEmail !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Email"
                        onChange={emailHandleChange}
                        value={textEmail}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">First name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          textFirstName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="First name"
                        onChange={firstNameHandleChange}
                        value={textFirstName}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Last name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          textLastName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Last name"
                        onChange={lastNameHandleChange}
                        value={textLastName}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Role</label>
                    <div>
                      <Select
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.body}
                        value={RoleCategory.find(function (option) {
                          return option.value === selectedRole;
                        })}
                        onChange={roleHandleChange}
                        options={RoleCategory}
                        required
                      />
                      <div className="invalid-feedback">
                        Please select Role!
                      </div>
                    </div>
                  </div>
                  {module[0]?.status === 'A' ? (
                    <div className="form-footer">
                      <button
                        className="btn btn-primary"
                        onClick={funcButtonHandleClickExecute}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserEditPage;
