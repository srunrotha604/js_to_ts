import { HttpUtil } from '../../../../utils/http-util';
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
  HttpUtil.get<CustomerReportListResponse>(ROUTE_API.customerReport, {
    params,
  });

export const exportCustomerReportList = (params: CustomerReportQueryParams) =>
  HttpUtil.get<Blob>(ROUTE_API.exportOperationCustomer, {
    params,
    responseType: 'blob',
  });
