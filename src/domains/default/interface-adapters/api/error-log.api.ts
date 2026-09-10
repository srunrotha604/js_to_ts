import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
export const logClientError = (data: {
  hostname: string;
  pathname: string;
  message: string;
  body: string;
  email: string;
}) => fetchDataAsync(ROUTE_API.log, { method: 'POST', data });
