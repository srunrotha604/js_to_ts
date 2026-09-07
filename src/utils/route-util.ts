/*--- app routes ---*/
const ROUTE_PATH = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  product: '/product',
  productNew: '/product/new',
  productDetail: '/product/:id',
  deleteProduct: '/delete'
};
/*--- api routes  ---*/
const ROUTE_API = {
  root: import.meta.env.VITE_API_URL,
  getProfile: '/api/v1/auth/profile',
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  refreshToken: '/api/v1/auth/refresh',
  streamTicket: '/api/v1/auth/stream-ticket',
  sessionStream: '/api/v1/auth/session-stream',
  products: '/api/v1/operation-products',
};

export { ROUTE_API, ROUTE_PATH };

