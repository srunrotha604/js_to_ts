import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse } from '../../entities';
export const changePassword = (data: {
  password: string;
  newPassword: string;
  confirmPassword: string;
}) => fetchData<MessageResponse>(ROUTE_API.loginChangePassword, data, 'POST');
