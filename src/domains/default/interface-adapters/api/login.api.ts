import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { LoginResponse } from '../../entities';
export const login = (data: { userName: string; Password: string }) =>
  fetchData<LoginResponse>(ROUTE_API.login, data, 'POST');
