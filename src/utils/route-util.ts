/*--- app routes ---*/
const ROUTE_PATH = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
};
/*--- api routes  ---*/
const ROUTE_API = {
  root: import.meta.env.VITE_API_URL,
};

export { ROUTE_API, ROUTE_PATH };
