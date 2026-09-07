import React, { useState, useEffect } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { fetchData } from '../../../../services/$service';

const BranchProjectEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | project | edit';
  const navigate = useNavigate();
  const params = useParams();

  const [optionProject, setOptionProject] = useState([]);
  const [selectedProject, setSelectdProject] = useState('');
  const [optionPolicies, setOptionPolicies] = useState([]);
  const [selectedPolicies, setSelectdPolicies] = useState('');
  const [branch, setBranch] = useState('');

  const getList = () => {
    fetchData('/opertion-branch/project/' + params.key, {}, 'GET').then(
      (res) => {
        switch (res.status) {
          case 200:
            {
              let project = res?.data?.options;
              setOptionProject(res?.data?.options);
              setSelectdProject(res?.data?.list[0]?.projectFamily);
              setBranch(res?.data?.list[0]?.branchFamily);
              let policiesItem = project.find(
                (item) => item.value === res?.data?.list[0]?.projectFamily
              );
              setOptionPolicies(policiesItem.policies);
              setSelectdPolicies(res?.data?.list[0]?.policies);
            }
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            redirect('/404');
        }
      }
    );
  };

  const funcButtonHandleClickExecute = (e) => {
    let messages = [];
    if (selectedProject === '') {
      messages.push(true);
    }
    if (selectedProject === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      let data = {
        transactionCode: params.key,
        policies: selectedPolicies.toString(),
      };
      fetchData('/opertion-branch/project', data, 'PUT').then((res) => {
        switch (res.status) {
          case 200:
            navigate('/dashboard/branch/project/' + branch);
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(res?.data);
            break;
          default:
            navigate('/404');
        }
      });
    }
    e.preventDefault();
  };

  useEffect(() => {
    getList();
  }, []);

  const projectHandleChange = (e) => {
    setSelectdProject(e.value);
    let policiesItem = optionProject?.find((item) => item.value === e.value);
    setOptionPolicies(policiesItem?.policies);
  };
  const PoliciesHandleChange = (e) => {
    setSelectdPolicies(Array.isArray(e) ? e.map((x) => x.value) : []);
    selectedPolicies && JSON.stringify(selectedPolicies, null, 2);
  };

  const goBackHandleClick = () => {
    navigate('/dashboard/branch/project/' + branch);
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Project Edit</h2>
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
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label className="form-label required">Project name</label>
                    <Select
                      value={optionProject?.filter(function (option) {
                        return option.value === selectedProject;
                      })}
                      onChange={projectHandleChange}
                      options={optionProject}
                      required
                      isDisabled
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Polocies</label>
                    <Select
                      placeholder="Select Option"
                      value={optionPolicies.filter((obj) =>
                        selectedPolicies.includes(obj.value)
                      )}
                      options={optionPolicies}
                      onChange={PoliciesHandleChange}
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
                    />
                  </div>

                  <div className="form-footer">
                    <button
                      className="btn btn-primary"
                      onClick={funcButtonHandleClickExecute}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-check"
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
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
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

export default BranchProjectEditPage;
