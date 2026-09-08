import React, { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData } from '../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../utils/route-util';

const BatchGroupCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | batch data - create';
  const navigate = useNavigate();
  const [module] = useState(
    JSON.parse(localStorage.getItem('batch_menu_storage'))
  );

  const [textEmail, setTextEmail] = useState('');

  const [textFirstName, setTextFirstName] = useState('');
  const [textLastName, setTextLastName] = useState('');
  const [options, setOptions] = useState([]);
  const [optionsAccess, setOptionsAccess] = useState([]);
  const [selectedAccessValue, setSelectedAccessValue] = useState([]);

  const getList = () => {
    fetchData(ROUTE_API.eChanelUserAccess, {}, 'GET').then((res) => {
      switch (res.status) {
        case 200:
          setOptions(res?.data?.role);
          setOptionsAccess(res?.data?.access);
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
    if (textEmail === '') {
      messages.push(true);
    }
    if (textFirstName === '') {
      messages.push(true);
    }
    if (textLastName === '') {
      messages.push(true);
    } else {
      if (messages.length < 1) {
        let data = {
          email: textEmail,
          givenName: textFirstName,
          sureName: textLastName,
          actionStatus: selectedAccessValue.toString(),
        };

        fetchData('/e-chanel-user', data, 'POST').then((res) => {
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
              redirect(ROUTE_PATH.error404);
          }
        });
      }
    }
    e.preventDefault();
  };

  useEffect(() => {
    if (!module) {
      navigate(ROUTE_PATH.error404);
    } else if (module && module[4]?.status === 'A') {
      getList();
    }
  }, []);

  const emailHandleChange = (event) => {
    setTextEmail(event.target.value);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.user);
  };
  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Batch data create new</h2>
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
                    <label className="form-label required">Name</label>
                    <div>
                      <input
                        type="email"
                        className={
                          textEmail !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Name ..."
                        onChange={emailHandleChange}
                        value={textEmail}
                        required
                      />
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

export default BatchGroupCreatePage;
