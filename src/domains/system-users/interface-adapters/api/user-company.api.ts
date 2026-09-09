import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { UserCompanyResponse } from '../../entities';

export const fetchUserCompany = (params: {
  application_code: string | null;
  user_code: string | null;
}) =>
  fetchDataAsync<UserCompanyResponse>(ROUTE_API.eChanelUserCompany, {
    params,
  });
