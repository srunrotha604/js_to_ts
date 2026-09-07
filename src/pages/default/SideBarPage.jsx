import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Select from 'react-select';
import Modal, { useModal } from '../../components/common/modal';
import { useAuth } from '../../context/AuthContext';
import { useModulePermission } from '../../context/module/ModuleContext';
import { ROUTE_PATH } from '../../utils/route-util';

const SideBarPage = () => {
  const {
    company,
    selectedCompany: selectedCompanyContext,
    user,
    fetchUser,
  } = useAuth();

  const { hasMainMenuPermission, hasMenuPermission } = useModulePermission();

  const location = useLocation();
  const pathName = location.pathname?.split('/dashboard/')[1];

  const [selectedCompany, setSelectdCompany] = useState('');
  const [optionBranch, setOptionBranch] = useState([]);
  const [selectedBranch, setSelectdBranch] = useState('');

  const funcButtonHandleClickExecute = async (e) => {
    if (selectedCompany && selectedBranch) {
      let alt_fa_storage = localStorage.getItem('e_chanel_storage');
      let token_text = JSON.parse(alt_fa_storage);
      const alt_fa_token = {
        token: token_text.token,
        refreshToken: token_text.refreshToken,
        company: selectedCompany,
        branch: selectedBranch,
      };
      localStorage.removeItem('e_chanel_storage');
      localStorage.setItem('e_chanel_storage', JSON.stringify(alt_fa_token));
      await fetchUser();
      closeModal();
    }
    e.preventDefault();
  };

  const companyHandleChange = (data) => {
    setSelectdCompany(data.value);
    const companyItem = company?.find((item) => item.value === data.value);
    setOptionBranch(companyItem.branch);
  };

  const branchHandleChange = (data) => {
    setSelectdBranch(data.value);
  };

  const { modalRef, openModal, closeModal } = useModal();

  const operationShow = () => {
    let alt_fa_storage = localStorage.getItem('e_chanel_storage');
    let token_text = JSON.parse(alt_fa_storage);

    let companyDetails = company?.find(
      (item) => item?.value === token_text?.company
    );

    let BranchDetails = companyDetails?.branch?.find(
      (item) => item?.value === token_text?.branch
    );
    return (
      <div
        className="d-none d-lg-flex ps-2 cursor-pointer align-items-center"
        onClick={openModal}
      >
        <div style={{ marginRight: '10px' }}>
          <img
            src={companyDetails?.logo}
            alt="company-logo"
            style={{ width: 120, height: 45, objectFit: 'contain' }}
          />
        </div>
        <div>
          <div className="mt-1 small text-muted">{companyDetails?.label}</div>
          <div className="mt-1 small text-muted">{BranchDetails?.label}</div>
        </div>
      </div>
    );
  };

  const userMenu = () => {
    return (
      <div>
        <div className="navbar-nav">
          {hasMainMenuPermission('mn9') && (
            <CustomNavItemLink
              to={ROUTE_PATH.dashboard}
              end
              label="Home"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#5F5F5F"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="5 12 3 12 12 3 21 12 19 12" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
              }
            />
          )}

          <>
            {hasMainMenuPermission('mn10') && (
              <div
                className={
                  pathName === 'project' ||
                  pathName === 'branch' ||
                  pathName === 'product' ||
                  pathName === 'user' ||
                  pathName === 'data-entry'
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  to={ROUTE_PATH.dashboard}
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#5F5F5F"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                      <circle cx={12} cy={12} r={3} />
                    </svg>
                  </span>
                  <span className="nav-link-title">System setup</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-rows">
                    {[
                      { label: 'Project', path: 'project', code: 'm9' },
                      { label: 'Branch', path: 'branch', code: 'm21' },
                      { label: 'Product', path: 'product', code: 'm22' },
                      { label: 'User', path: 'user', code: 'm10' },
                      {
                        label: 'Role access',
                        path: 'role-access',
                        code: 'm23',
                      },
                      { label: 'Data entry', path: 'data-entry', code: 'm24' },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {hasMainMenuPermission('mn11') && (
              <div
                className={
                  pathName?.includes('customer/create') ||
                  pathName?.includes('customer/delete') ||
                  pathName?.includes('batch-register')
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#5F5F5F"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx={9} cy={7} r={4} />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 11h6m-3 -3v6" />
                    </svg>
                  </span>
                  <span className="nav-link-title">Customer</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-column">
                    {[
                      {
                        label: 'Register',
                        path: 'customer/create',
                        code: 'm12',
                      },
                      {
                        label: 'Batch register',
                        path: 'batch-register',
                        code: 'm13',
                      },
                      { label: 'Delete', path: 'customer/delete', code: 'm14' },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {hasMainMenuPermission('mn13') && (
              <div
                className={
                  pathName === 'customer-report'
                    ? 'nav-item dropdown active'
                    : 'nav-item dropdown'
                }
              >
                <Link
                  to={ROUTE_PATH.dashboard}
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-label="Open user menu"
                >
                  <span className="nav-link-icon d-none d-md-inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="#5F5F5F"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
                      <path d="M18 14v4h4" />
                      <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
                      <rect x={8} y={3} width={6} height={4} rx={2} />
                      <circle cx={18} cy={18} r={4} />
                      <path d="M8 11h4" />
                      <path d="M8 15h3" />
                    </svg>
                  </span>
                  <span className="nav-link-title">Report</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-start dropdown-menu">
                  <div className="dropdown-menu-column">
                    {[
                      {
                        label: 'Customer Report',
                        path: 'customer-report',
                        code: 'm11',
                      },
                      {
                        label: 'User Report',
                        path: 'user-report',
                        code: 'm20',
                      },
                    ].map((menu) => {
                      return (
                        hasMenuPermission(menu.code) && (
                          <Link
                            key={menu.path}
                            className={
                              pathName === menu.path
                                ? 'dropdown-item active'
                                : 'dropdown-item'
                            }
                            to={`${ROUTE_PATH.dashboard}/${menu.path}`}
                          >
                            {menu.label}
                          </Link>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (company && selectedCompanyContext) {
      companyHandleChange(selectedCompanyContext);
    }
  }, [company]);

  if (!user) return null;

  return (
    <React.Fragment>
      <div className="sticky-top" style={{ top: '56px' }}>
        <div className="navbar-expand-sm">
          <div className="navbar-expand-sm">
            <div className="collapse navbar-collapse" id="navbar-menu">
              <div className="navbar navbar-light">
                <div className="container-xl">
                  {userMenu('')}
                  <div className="my-2 my-md-0 my-0 flex-grow-1 flex-grow-0 flex-md-grow-0 ">
                    {operationShow('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal ref={modalRef} title={'Switch branch'}>
        <div className="mb-3">
          <label className="form-label required">Company</label>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            value={company?.find(function (option) {
              return option.value === selectedCompany;
            })}
            onChange={companyHandleChange}
            options={company}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label required">Branch</label>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            value={optionBranch.find(function (option) {
              return option.value === selectedBranch;
            })}
            onChange={branchHandleChange}
            options={optionBranch}
            required
          />
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary w-100"
            onClick={funcButtonHandleClickExecute}
          >
            Switch branch
          </button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const CustomNavItemLink = ({
  children,
  icon,
  label,
  to,
  dropdown,
  ...props
}) => {
  return (
    <NavLink
      to={to}
      className={clsx('nav-link nav-item d-flex flex-row', { dropdown })}
      {...props}
    >
      <span className="nav-link-icon d-none d-md-inline-block">{icon}</span>
      <span className="nav-link-title">{label}</span>
      {children}
    </NavLink>
  );
};

export default SideBarPage;
