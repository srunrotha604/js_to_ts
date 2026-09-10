import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
export const logClientError = (data: {
  hostname: string;
  pathname: string;
  message: string;
  body: string;
  email: string;
}) => HttpUtil.post(ROUTE_API.log, data);
