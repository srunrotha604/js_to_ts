import { fetchData, fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  UserAccessBranchListResponse,
  UserBranchCategoryResponse,
  UserBranchResponse,
} from '../../entities';

export interface BranchAccessQuery {
  app?: string | null;
  company?: string | null;
  user?: string | null;
}

export const fetchUserBranch = (params: BranchAccessQuery) =>
  fetchDataAsync<UserBranchResponse>(ROUTE_API.eChanelUserBranch, { params });

export const fetchUserBranchCategory = (params: BranchAccessQuery) =>
  fetchDataAsync<UserBranchCategoryResponse>(
    ROUTE_API.eChanelUserBranchCategory,
    { params }
  );

export const createUserBranchAccess = (data: {
  applicationFamily?: string | null;
  companyFamily?: string | null;
  userCode?: string | null;
  branchFamily: string;
}) =>
  fetchDataAsync(ROUTE_API.eChanelUserBranch, { data, method: 'post' });

export const setDefaultUserBranchAccess = (data: {
  transactionCode?: string;
  applicationFamily?: string | null;
  companyFamily?: string | null;
  userCode?: string | null;
}) => fetchDataAsync(ROUTE_API.eChanelUserBranch, { data, method: 'put' });

export const fetchUserAccessBranchList = (
  applicationId: string,
  companyCode: string,
  userCode: string
) =>
  fetchData<UserAccessBranchListResponse>(
    `${ROUTE_API.eChanelUserBranch}/${applicationId}/${companyCode}/${userCode}`,
    {},
    'GET'
  );

export const addUserAccessBranch = (data: {
  applicationFamily?: string;
  companyFamily?: string;
  userCode?: string;
  branchFamily: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelUserBranch, data, 'POST');

export const removeUserAccessBranch = (data: { transactionCode: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelUserBranch, data, 'DELETE');

export const setDefaultUserAccessBranch = (data: {
  transactionCode?: string;
  applicationFamily?: string;
  companyFamily?: string;
  userCode?: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelUserBranch, data, 'PUT');
