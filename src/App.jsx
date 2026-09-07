import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';

import AxiosInterceptor from './components/AxiosInterceptor';

// Default
import HeaderPage from './pages/default/HeaderPage';
import FooterPage from './pages/default/FooterPage';
import HomePage from './pages/default/HomePage';
import LoginPage from './pages/default/LoginPage';
import ProfilePage from './pages/default/ProfilePage';
import ChangePasswordPage from './pages/default/ChangePasswordPage';
import ForgotPasswordPage from './pages/default/ForgotPasswordPage';
import SwitchBranchPage from './pages/default/SwitchBranchPage';
// Error_handle
import Error404Page from './pages/error_handle/Error404Page';
import Error500Page from './pages/error_handle/Error500Page';

import ProjectPage from './pages/system_setup/project_configuration/project/ProjectPage';
import ProjectCreatePage from './pages/system_setup/project_configuration/project/ProjectCreatePage';
import ProjectEditPage from './pages/system_setup/project_configuration/project/ProjectEditPage';
import ProjectPolicyPage from './pages/system_setup/project_configuration/project_policy/ProjectPolicyPage';
import ProjectPolicyCreatePage from './pages/system_setup/project_configuration/project_policy/ProjectPolicyCreatePage';
import BranchPage from './pages/system_setup/project_configuration/branch/BranchPage';
import BranchCreatePage from './pages/system_setup/project_configuration/branch/BranchCreatePage';
import BranchProjectPage from './pages/system_setup/project_configuration/branch/BranchProjectPage';
import BranchProjectCreatePage from './pages/system_setup/project_configuration/branch/BranchProjectCreatePage';
import BranchProjectEditPage from './pages/system_setup/project_configuration/branch/BranchProjectEditPage';

import UserPage from './pages/system_setup/sytem_users/user/UserPage';
import UserCreatePage from './pages/system_setup/sytem_users/user/UserCreatePage';
import UserEditPage from './pages/system_setup/sytem_users/user/UserEditPage';
import UserRolePage from './pages/system_setup/sytem_users/user/UserRolePage';
import UserRoleCreatePage from './pages/system_setup/sytem_users/user/UserRoleCreatePage';
import CompanyForm from './pages/system_setup/sytem_users/user/CompanyForm.jsx';
import BranchForm from './pages/system_setup/sytem_users/user/BranchForm.jsx';
import UserAccessBranchPage from './pages/system_setup/sytem_users/user/UserAccessBranchPage';
import UserAccessStatusPage from './pages/system_setup/sytem_users/user/UserAccessStatusPage';
import RoleAccessPage from './pages/system_setup/sytem_users/role_access/RoleAccessPage';

import ProductPage from './pages/system_setup/project_configuration/product/ProductPage';
import ProductCreatePage from './pages/system_setup/project_configuration/product/ProductCreatePage';

import InsuranceProductPage from './pages/customer/InsuranceProductPage';
import CustomerPage from './pages/customer/CustomerPage';
import CustomerCreatePage from './pages/customer/CustomerCreatePage';
import CustomerEditPage from './pages/customer/CustomerEditPage';

import BatchRegister from './pages/batch-register/BatchRegister';
// Version History
import VersionHandlePage from './pages/version-history/index';

// Report
import CustomerReportPage from './pages/reports/customer_report/CustomerReportPage';
import UserReportPage from './pages/reports/UserRportPage';
import AuthContextProvider from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import SideBarPage from './pages/default/SideBarPage';
import CustomerTransationDetailPage from './pages/customer/CustomerTransationDetailPage';
import BatchDetailPage from './pages/batch-register/BatchDetailPage';
import CustomerDeletePage from './pages/customer/CustomerDeletePage';
import LogoutPage from './pages/default/LogoutPage.jsx';
import RouteWithErrorBoundary from './components/RouteWithErrorBoundary.jsx';
import ProductEditPage from './pages/system_setup/project_configuration/product/ProductEditPage.jsx';
import ContactUsPage from './pages/default/ContactUsPage';
import DataEntryPage from './pages/system_setup/sytem_users/bm_create_data_entry/DataEntryPage';
import DataEntryCreatePage from './pages/system_setup/sytem_users/bm_create_data_entry/DataEntryCreatePage';
import DataEntryImportPage from './pages/system_setup/sytem_users/bm_create_data_entry/DataEntryImportPage';

function App() {
  return (
    <React.Fragment key="MyAppKeyCode">
      <ToastContainer
        {...{
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }}
      />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AxiosInterceptor>
          <AuthContextProvider>
            <HeaderPage />
            <SideBarPage />
            <Routes>
              <Route
                path="/login"
                element={
                  <PrivateRoute auth={true} redirect="/dashboard">
                    <LoginPage />
                  </PrivateRoute>
                }
              />
              {/* Application */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute auth={false} redirect="/login">
                    <RouteWithErrorBoundary />
                  </PrivateRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="/dashboard/project" element={<ProjectPage />} />
                <Route
                  path="/dashboard/project/create"
                  element={<ProjectCreatePage />}
                />
                <Route
                  path="/dashboard/project/edit/:key"
                  element={<ProjectEditPage />}
                />
                <Route
                  path="/dashboard/project/policy/:key"
                  element={<ProjectPolicyPage />}
                />
                <Route
                  path="/dashboard/project/policy/create/:key"
                  element={<ProjectPolicyCreatePage />}
                />
                <Route path="/dashboard/branch" element={<BranchPage />} />
                <Route
                  path="/dashboard/branch/create"
                  element={<BranchCreatePage />}
                />
                <Route
                  path="/dashboard/branch/project/:key"
                  element={<BranchProjectPage />}
                />
                <Route
                  path="/dashboard/branch/project/create/:key"
                  element={<BranchProjectCreatePage />}
                />
                <Route
                  path="/dashboard/branch/project/edit/:key"
                  element={<BranchProjectEditPage />}
                />

                <Route path="/dashboard/user" element={<UserPage />} />

                <Route
                  path="/dashboard/user/create"
                  element={<UserCreatePage />}
                />
                <Route
                  path="/dashboard/user/edit/:key"
                  element={<UserEditPage />}
                />
                <Route
                  path="/dashboard/user/role/:key"
                  element={<UserRolePage />}
                />
                <Route
                  path="/dashboard/user/role/create/:key"
                  element={<UserRoleCreatePage />}
                />
                <Route
                  path="/dashboard/user/company"
                  element={<CompanyForm />}
                />
                <Route
                  path="/dashboard/user/company/branch"
                  element={<BranchForm />}
                />
                <Route
                  path="/dashboard/user/branch/:applicationId/:companyCode/:userCode"
                  element={<UserAccessBranchPage />}
                />
                <Route
                  path="/dashboard/user/role/transaction/:userCode"
                  element={<UserAccessStatusPage />}
                />
                <Route
                  path="/dashboard/role-access"
                  element={<RoleAccessPage />}
                />

                <Route
                  path="/dashboard/data-entry"
                  element={<DataEntryPage />}
                />
                <Route
                  path="/dashboard/data-entry/create"
                  element={<DataEntryCreatePage />}
                />
                <Route
                  path="/dashboard/data-entry/import"
                  element={<DataEntryImportPage />}
                />
                <Route path="/dashboard/product" element={<ProductPage />} />
                <Route
                  path="/dashboard/product/create"
                  element={<ProductCreatePage />}
                />
                <Route
                  path="/dashboard/product/edit/:key"
                  element={<ProductEditPage />}
                />

                <Route
                  path="/dashboard/customer/create"
                  element={<InsuranceProductPage />}
                />
                <Route
                  path="/dashboard/customer/:key"
                  element={<CustomerPage />}
                />
                <Route
                  path="/dashboard/customer/create/:key"
                  element={<CustomerCreatePage />}
                />
                <Route
                  path="/dashboard/customer/edit/:key/:productCode"
                  element={<CustomerEditPage />}
                />
                <Route
                  path="/dashboard/customer/delete"
                  element={<CustomerDeletePage />}
                />
                <Route
                  path="/dashboard/customer/transaction/:key"
                  element={<CustomerTransationDetailPage />}
                />
                <Route
                  path="/dashboard/batch-register"
                  element={<BatchRegister />}
                />
                <Route
                  path="/dashboard/customer/batch/:key"
                  element={<BatchDetailPage />}
                />

                {/* Handle Version */}

                <Route
                  path="/dashboard/version"
                  element={<VersionHandlePage />}
                />
                {/* Report */}
                <Route
                  path="/dashboard/customer-report"
                  element={<CustomerReportPage />}
                />
                <Route
                  path="/dashboard/user-report"
                  element={<UserReportPage />}
                />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route
                  path="/dashboard/change-password"
                  element={<ChangePasswordPage />}
                />
                <Route
                  path="/dashboard/switch-branch"
                  element={<SwitchBranchPage />}
                />
                <Route path="/dashboard/logout" element={<LogoutPage />} />
                <Route
                  path="/dashboard/contact-us"
                  element={<ContactUsPage />}
                />
              </Route>
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/error404" element={<Error404Page />} />
              <Route path="/error500" element={<Error500Page />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
            <FooterPage />
          </AuthContextProvider>
        </AxiosInterceptor>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
