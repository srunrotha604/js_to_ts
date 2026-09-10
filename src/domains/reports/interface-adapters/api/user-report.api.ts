import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { UserReportListResponse } from '../../entities';

export interface UserReportListParams {
  status: string;
  branchName: string;
  startDate: string | null;
  endDate: string | null;
}

export const fetchUserReportList = (
  params: UserReportListParams & { pageNumber: number; pageSize: number }
) =>
  HttpUtil.get<UserReportListResponse>(ROUTE_API.exportOperationUser, {
    params: { ...params, type: 'filter' },
  });

export const exportUserReportList = (params: UserReportListParams) =>
  HttpUtil.get<Blob>(ROUTE_API.exportOperationUser, {
    params: { ...params, type: 'export' },
    responseType: 'blob',
  });
