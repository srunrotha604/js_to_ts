import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { MultiValue, SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import type { SelectOption } from '../../../../@type/report';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { BranchProjectOption } from '../../entities';
import {
  createBranchProject,
  fetchBranchProjectOptions,
} from '../../interface-adapters';
import {
  buildBranchProjectCreateDto,
  filterPoliciesByProjectKey,
  validateRequiredFields,
} from '../../use-cases';

const BranchProjectCreatePage = () => {
  document.title = 'E-CHANNEL PORTAL | project | import';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();

  const [optionProject, setOptionProject] = useState<BranchProjectOption[]>([]);
  const [selectedProject, setSelectdProject] = useState('');
  const [optionPolicies, setOptionPolicies] = useState<SelectOption[]>([]);
  const [selectedPolicies, setSelectdPolicies] = useState<string[]>([]);

  const getList = () => {
    fetchBranchProjectOptions(params.key ?? '').then((res) => {
      switch (res?.status) {
        case 200:
          setOptionProject(res?.data?.options ?? []);
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.notFound);
      }
    });
  };

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (validateRequiredFields([selectedProject, selectedPolicies])) {
      createBranchProject(
        buildBranchProjectCreateDto(params.key, selectedProject, selectedPolicies)
      ).then((res) => {
        switch (res?.status) {
          case 200:
            navigate(ROUTE_PATH.branchProject(params.key ?? ''));
            break;
          case 400:
            toast.error(res?.data?.message);
            break;
          case 403:
            toast.error(String(res?.data));
            break;
          default:
            navigate(ROUTE_PATH.notFound);
        }
      });
    }
    e.preventDefault();
  };

  useEffect(() => {
    getList();
  }, []);

  const projectHandleChange = (value: SingleValue<BranchProjectOption>) => {
    setSelectdProject(value?.value ?? '');
    setOptionPolicies(filterPoliciesByProjectKey(optionProject, value?.value ?? ''));
  };
  const PoliciesHandleChange = (value: MultiValue<SelectOption> | null) => {
    setSelectdPolicies(Array.isArray(value) ? value.map((x) => x.value) : []);
  };

  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.branchProject(params.key ?? ''));
  };

  return (
    <React.Fragment>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Project import</h2>
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
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label required">Policies</label>
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

export default BranchProjectCreatePage;
