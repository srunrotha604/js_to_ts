import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { UserCompanyResponse } from '../../entities';

export const fetchUserCompany = (params: {
  application_code: string | null;
  user_code: string | null;
}) =>
  HttpUtil.get<UserCompanyResponse>(ROUTE_API.eChanelUserCompany, {
    params,
  });
