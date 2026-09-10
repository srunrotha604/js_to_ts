import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
export const submitContactUs = (data: { phone: string; message: string }) =>
  HttpUtil.post(ROUTE_API.logContactUs, data);
