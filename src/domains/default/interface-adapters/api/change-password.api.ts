import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse } from '../../entities';
export const changePassword = (data: {
  password: string;
  newPassword: string;
  confirmPassword: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.loginChangePassword, data);
