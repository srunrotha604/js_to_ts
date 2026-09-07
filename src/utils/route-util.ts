/*--- app routes ---*/
const ROUTE_PATH = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  forgotPassword: '/forgot-password',
  error404: '/error404',
  error500: '/error500',
  notFound: '/404',

  profile: '/dashboard/profile',
  changePassword: '/dashboard/change-password',
  switchBranch: '/dashboard/switch-branch',
  logout: '/dashboard/logout',
  contactUs: '/dashboard/contact-us',
  version: '/dashboard/version',
  customerReport: '/dashboard/customer-report',
  userReport: '/dashboard/user-report',
  batchRegister: '/dashboard/batch-register',
  roleAccess: '/dashboard/role-access',

  project: '/dashboard/project',
  projectCreate: '/dashboard/project/create',
  projectEdit: (key: string | number) => `/dashboard/project/edit/${key}`,
  projectPolicy: (key: string | number) => `/dashboard/project/policy/${key}`,
  projectPolicyCreate: (key: string | number) =>
    `/dashboard/project/policy/create/${key}`,

  branch: '/dashboard/branch',
  branchCreate: '/dashboard/branch/create',
  branchProject: (key: string | number) => `/dashboard/branch/project/${key}`,
  branchProjectCreate: (key: string | number) =>
    `/dashboard/branch/project/create/${key}`,
  branchProjectEdit: (key: string | number) =>
    `/dashboard/branch/project/edit/${key}`,

  user: '/dashboard/user',
  userCreate: '/dashboard/user/create',
  userEdit: (key: string | number) => `/dashboard/user/edit/${key}`,
  userRole: (key: string | number) => `/dashboard/user/role/${key}`,
  userRoleCreate: (key: string | number) =>
    `/dashboard/user/role/create/${key}`,
  userCompany: '/dashboard/user/company',
  userCompanyBranch: '/dashboard/user/company/branch',
  userCompanyDetail: (applicationId: string | number, userCode: string | number) =>
    `/dashboard/user/company/${applicationId}/${userCode}`,
  userAccessBranch: (
    applicationId: string | number,
    companyCode: string | number,
    userCode: string | number,
  ) => `/dashboard/user/branch/${applicationId}/${companyCode}/${userCode}`,
  userAccessStatus: (userCode: string | number) =>
    `/dashboard/user/role/transaction/${userCode}`,

  dataEntry: '/dashboard/data-entry',
  dataEntryCreate: '/dashboard/data-entry/create',
  dataEntryImport: '/dashboard/data-entry/import',

  product: '/dashboard/product',
  productCreate: '/dashboard/product/create',
  productEdit: (key: string | number) => `/dashboard/product/edit/${key}`,

  customerCreate: '/dashboard/customer/create',
  customer: (key: string | number) => `/dashboard/customer/${key}`,
  customerCreateWithProduct: (productCode: string | number) =>
    `/dashboard/customer/create/${productCode}`,
  customerEdit: (key: string | number, productCode: string | number) =>
    `/dashboard/customer/edit/${key}/${productCode}`,
  customerDelete: '/dashboard/customer/delete',
  customerTransaction: (key: string | number) =>
    `/dashboard/customer/transaction/${key}`,
  customerBatch: (key: string | number) => `/dashboard/customer/batch/${key}`,

  batchCreate: '/dashboard/batch/create',
};
/*--- api routes  ---*/
const ROUTE_API = {
  root: import.meta.env.VITE_API_URL,
};

export { ROUTE_API, ROUTE_PATH };
