import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/common/PrivateRoute';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts';
import { ROUTE_PATH } from '../utils/route-util';
const Login = lazy(() => import('../pages/default/LoginPage'));
const HomePage = lazy(() => import('../pages/default/HomePage'));
const LogoutPage = lazy(() => import('../pages/default/LogoutPage'));
const Error404Page = lazy(() => import('../pages/error_handle/Error404Page'));
const Error500Page = lazy(() => import('../pages/error_handle/Error500Page'));
const ProjectPage = lazy(
  () =>
    import('../pages/system_setup/project_configuration/project/ProjectPage')
);
const BranchPage = lazy(
  () => import('../pages/system_setup/project_configuration/branch/BranchPage')
);
const ProductPage = lazy(
  () =>
    import('../pages/system_setup/project_configuration/product/ProductPage')
);
const UserPage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserPage')
);
const RoleAccessPage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserRolePage')
);
const DataEntryPage = lazy(
  () =>
    import(
      '../pages/system_setup/sytem_users/bm_create_data_entry/DataEntryPage'
    )
);
const ForgotPasswordPage = lazy(
  () => import('../pages/default/ForgotPasswordPage')
);
const ProjectCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/project/ProjectCreatePage'
    )
);
const ProjectEditPage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/project/ProjectEditPage'
    )
);
const ProjectPolicyPage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/project_policy/ProjectPolicyPage'
    )
);
const ProjectPolicyCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/project_policy/ProjectPolicyCreatePage'
    )
);
const BranchCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/branch/BranchCreatePage'
    )
);
const BranchProjectPage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/branch/BranchProjectPage'
    )
);
const BranchProjectCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/branch/BranchProjectCreatePage'
    )
);
const BranchProjectEditPage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/branch/BranchProjectEditPage'
    )
);
const UserCreatePage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserCreatePage')
);
const UserEditPage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserEditPage')
);
const UserRolePage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserRolePage')
);
const UserRoleCreatePage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserRoleCreatePage')
);
const CompanyForm = lazy(
  () => import('../pages/system_setup/sytem_users/user/CompanyForm')
);
const BranchForm = lazy(
  () => import('../pages/system_setup/sytem_users/user/BranchForm')
);
const UserAccessBranchPage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserAccessBranchPage')
);
const UserAccessStatusPage = lazy(
  () => import('../pages/system_setup/sytem_users/user/UserAccessStatusPage')
);
const DataEntryCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/sytem_users/bm_create_data_entry/DataEntryCreatePage'
    )
);
const DataEntryImportPage = lazy(
  () =>
    import(
      '../pages/system_setup/sytem_users/bm_create_data_entry/DataEntryImportPage'
    )
);
const ProductCreatePage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/product/ProductCreatePage'
    )
);
const ProductEditPage = lazy(
  () =>
    import(
      '../pages/system_setup/project_configuration/product/ProductEditPage'
    )
);
const InsuranceProductPage = lazy(
  () => import('../domains/customer/ui/pages/InsuranceProductPage')
);
const CustomerPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerPage')
);
const CustomerCreatePage = lazy(
  () => import('../domains/customer/ui/pages/CustomerCreatePage')
);
const CustomerEditPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerEditPage')
);
const CustomerDeletePage = lazy(
  () => import('../domains/customer/ui/pages/CustomerDeletePage')
);
const CustomerTransationDetailPage = lazy(
  () => import('../domains/customer/ui/pages/CustomerTransationDetailPage')
);
const BatchRegisterPage = lazy(
  () => import('../domains/batch/ui/pages/BatchRegisterPage')
);
const BatchDetailPage = lazy(
  () => import('../domains/batch/ui/pages/BatchDetailPage')
);
const VersionHandlePage = lazy(() => import('../pages/version-history/index'));
const CustomerReportPage = lazy(
  () => import('../pages/reports/customer_report/CustomerReportPage')
);
const UserReportPage = lazy(() => import('../pages/reports/UserRportPage'));
const ProfilePage = lazy(() => import('../pages/default/ProfilePage'));
const ChangePasswordPage = lazy(
  () => import('../pages/default/ChangePasswordPage')
);
const SwitchBranchPage = lazy(
  () => import('../pages/default/SwitchBranchPage')
);
const ContactUsPage = lazy(() => import('../pages/default/ContactUsPage'));
export default function AllRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="full-height-container"></div>;
  }

  return (
    <Routes>
      <Route
        path={ROUTE_PATH.root}
        element={user ? <Layout /> : <Navigate to={ROUTE_PATH.login} />}
      >
        <Route path={ROUTE_PATH.root} element={<HomePage />} />
        <Route path={ROUTE_PATH.dashboard} element={<HomePage />} />
        <Route path={ROUTE_PATH.logout} element={<LogoutPage />} />
        <Route path={ROUTE_PATH.project} element={<ProjectPage />} />
        <Route path={ROUTE_PATH.branch} element={<BranchPage />} />
        <Route path={ROUTE_PATH.product} element={<ProductPage />} />
        <Route path={ROUTE_PATH.user} element={<UserPage />} />
        <Route path={ROUTE_PATH.roleAccess} element={<RoleAccessPage />} />
        <Route path={ROUTE_PATH.dataEntry} element={<DataEntryPage />} />
        <Route
          path={ROUTE_PATH.projectCreate}
          element={<ProjectCreatePage />}
        />
        <Route
          path={ROUTE_PATH.projectEdit(':key')}
          element={<ProjectEditPage />}
        />
        <Route
          path={ROUTE_PATH.projectPolicy(':key')}
          element={<ProjectPolicyPage />}
        />
        <Route
          path={ROUTE_PATH.projectPolicyCreate(':key')}
          element={<ProjectPolicyCreatePage />}
        />
        <Route path={ROUTE_PATH.branch} element={<BranchPage />} />
        <Route path={ROUTE_PATH.branchCreate} element={<BranchCreatePage />} />
        <Route
          path={ROUTE_PATH.branchProject(':key')}
          element={<BranchProjectPage />}
        />
        <Route
          path={ROUTE_PATH.branchProjectCreate(':key')}
          element={<BranchProjectCreatePage />}
        />
        <Route
          path={ROUTE_PATH.branchProjectEdit(':key')}
          element={<BranchProjectEditPage />}
        />
        <Route path={ROUTE_PATH.userCreate} element={<UserCreatePage />} />
        <Route path={ROUTE_PATH.userEdit(':key')} element={<UserEditPage />} />
        <Route path={ROUTE_PATH.userRole(':key')} element={<UserRolePage />} />
        <Route
          path={ROUTE_PATH.userRoleCreate(':key')}
          element={<UserRoleCreatePage />}
        />
        <Route path={ROUTE_PATH.userCompany} element={<CompanyForm />} />
        <Route path={ROUTE_PATH.userCompanyBranch} element={<BranchForm />} />
        <Route
          path={ROUTE_PATH.userAccessBranch(
            ':applicationId',
            ':companyCode',
            ':userCode'
          )}
          element={<UserAccessBranchPage />}
        />
        <Route
          path={ROUTE_PATH.userAccessStatus(':userCode')}
          element={<UserAccessStatusPage />}
        />
        <Route
          path={ROUTE_PATH.dataEntryCreate}
          element={<DataEntryCreatePage />}
        />
        <Route
          path={ROUTE_PATH.dataEntryImport}
          element={<DataEntryImportPage />}
        />
        <Route
          path={ROUTE_PATH.productCreate}
          element={<ProductCreatePage />}
        />
        <Route
          path={ROUTE_PATH.productEdit(':key')}
          element={<ProductEditPage />}
        />
        <Route
          path={ROUTE_PATH.customerCreate}
          element={<InsuranceProductPage />}
        />
        <Route path={ROUTE_PATH.customer(':key')} element={<CustomerPage />} />
        <Route
          path={ROUTE_PATH.customerCreateWithProduct(':key')}
          element={<CustomerCreatePage />}
        />
        <Route
          path={ROUTE_PATH.customerEdit(':key', ':productCode')}
          element={<CustomerEditPage />}
        />
        <Route
          path={ROUTE_PATH.customerDelete}
          element={<CustomerDeletePage />}
        />
        <Route
          path={ROUTE_PATH.customerTransaction(':key')}
          element={<CustomerTransationDetailPage />}
        />
        <Route
          path={ROUTE_PATH.batchRegister}
          element={<BatchRegisterPage />}
        />
        <Route
          path={ROUTE_PATH.customerBatch(':key')}
          element={<BatchDetailPage />}
        />
        <Route path={ROUTE_PATH.version} element={<VersionHandlePage />} />
        <Route
          path={ROUTE_PATH.customerReport}
          element={<CustomerReportPage />}
        />
        <Route path={ROUTE_PATH.userReport} element={<UserReportPage />} />
        <Route path={ROUTE_PATH.profile} element={<ProfilePage />} />
        <Route
          path={ROUTE_PATH.changePassword}
          element={<ChangePasswordPage />}
        />
        <Route path={ROUTE_PATH.switchBranch} element={<SwitchBranchPage />} />
        <Route path={ROUTE_PATH.contactUs} element={<ContactUsPage />} />
      </Route>
      <Route path={ROUTE_PATH.error404} element={<Error404Page />} />
      <Route path={ROUTE_PATH.error500} element={<Error500Page />} />
      <Route
        path={ROUTE_PATH.forgotPassword}
        element={<ForgotPasswordPage />}
      />
      <Route
        path={ROUTE_PATH.login}
        element={
          user ? (
            <Navigate to={ROUTE_PATH.root} />
          ) : (
            <PrivateRoute auth={true} redirect="/dashboard">
              <Login />
            </PrivateRoute>
          )
        }
      />
    </Routes>
  );
}
