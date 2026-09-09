import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type {
  MessageResponse,
  ProjectListResponse,
} from '../../../../@type/project_configuration';
import { fetchData } from '../../../../services/$service';
import { ROUTE_API, ROUTE_PATH } from '../../../../utils/route-util';

const ProjectEditPage = () => {
  document.title = 'E-CHANNEL PORTAL | project | create';
  const navigate = useNavigate();
  const params = useParams<{ key: string }>();

  const [projectName, setProjectName] = useState('');

  const getList = () => {
    fetchData<ProjectListResponse>(
      `${ROUTE_API.operationProject}/` + params.key,
      {},
      'GET'
    ).then((res) => {
      switch (res?.status) {
        case 200:
          let data = res?.data?.list?.[0];
          setProjectName(data?.projectName ?? '');
          break;
        case 400:
          toast.error(res?.data?.message);
          break;
        case 403:
          toast.error(String(res?.data));
          break;
        default:
          navigate(ROUTE_PATH.error404);
      }
    });
  };

  const funcButtonHandleClickExecute = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    let messages = [];
    if (projectName === '') {
      messages.push(true);
    }
    if (messages.length < 1) {
      let data = {
        transactionCode: params.key,
        projectName: projectName,
      };
      fetchData<MessageResponse>(ROUTE_API.operationProject, data, 'PUT').then(
        (res) => {
          switch (res?.status) {
            case 200:
              toast.success(res?.data?.message);
              navigate(ROUTE_PATH.project);
              break;
            case 400:
              toast.error(res?.data?.message);
              break;
            case 403:
              toast.error(String(res?.data));
              break;
            default:
              navigate(ROUTE_PATH.error404);
          }
        }
      );
    }
    e.preventDefault();
  };

  const projectNameHandleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(event.target.value);
  };
  const goBackHandleClick = () => {
    navigate(ROUTE_PATH.project);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="page-title">Project create</h2>
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
                    <label className="form-label required">Project name</label>
                    <div>
                      <input
                        type="text"
                        className={
                          projectName !== ''
                            ? 'form-control'
                            : 'form-control is-invalid is-invalid-lite'
                        }
                        placeholder="Project name"
                        onChange={projectNameHandleChange}
                        value={projectName}
                        required
                      />
                    </div>
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
    </>
  );
};

export default ProjectEditPage;
