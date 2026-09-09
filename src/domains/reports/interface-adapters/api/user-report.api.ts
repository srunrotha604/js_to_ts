import { fetchDataAsync } from '../../../../services/$service';
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
  fetchDataAsync<UserReportListResponse>(ROUTE_API.exportOperationUser, {
    params: { ...params, type: 'filter' },
  });

export const exportUserReportList = (params: UserReportListParams) =>
  fetchDataAsync<Blob>(ROUTE_API.exportOperationUser, {
    params: { ...params, type: 'export' },
    responseType: 'blob',
  });
