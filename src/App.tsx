import React from 'react';
import { ToastContainer } from 'react-toastify';
// import './App.css';

import AxiosInterceptor from './components/AxiosInterceptor.jsx';

// Default
// Error_handle

// Version History

// Report
import { BrowserRouter as Router } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext.jsx';
import AllRoutes from './router/index.tsx';

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
      <Router basename={import.meta.env.BASE_URL}>
        {/* <BrowserRouter basename={import.meta.env.BASE_URL}> */}
        <AxiosInterceptor>
          <AuthContextProvider>
            {/* <HeaderPage />
            <SideBarPage /> */}
            {/* <Routes>
              <Route
                path="/login"
                element={
                  <PrivateRoute auth={true} redirect="/dashboard">
                    <LoginPage />
                  </PrivateRoute>
                }
              />
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



                <Route
                  path="/dashboard/version"
                  element={<VersionHandlePage />}
                />

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
            <FooterPage /> */}
            <AllRoutes />
          </AuthContextProvider>
        </AxiosInterceptor>
        {/* </BrowserRouter> */}
      </Router>
    </React.Fragment>
  );
}

export default App;
