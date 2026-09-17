import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { ListLoginLog } from '../../entities';
export const getLoginLogs = (data: {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  search: string;
}) => HttpUtil.get<ListLoginLog>(ROUTE_API.getLoginLogs, { params: data });
