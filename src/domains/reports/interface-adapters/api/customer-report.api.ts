import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { CustomerReportListResponse } from '../../entities';

export interface CustomerReportQueryParams {
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  startIssueDate: string;
  endIssueDate: string;
  expirePolicy: string;
  branchName: string;
  projectName: string;
}

export const fetchCustomerReportList = (params: CustomerReportQueryParams) =>
  fetchDataAsync<CustomerReportListResponse>(ROUTE_API.customerReport, {
    params,
  });

export const exportCustomerReportList = (
  params: CustomerReportQueryParams
) =>
  fetchDataAsync<Blob>(ROUTE_API.exportOperationCustomer, {
    params,
    responseType: 'blob',
  });
