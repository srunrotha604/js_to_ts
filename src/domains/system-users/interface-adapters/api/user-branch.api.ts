import { HttpUtil } from '../../../../utils/http-util';
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
  HttpUtil.get<UserBranchResponse>(ROUTE_API.eChanelUserBranch, {
    params,
  });

export const fetchUserBranchCategory = (params: BranchAccessQuery) =>
  HttpUtil.get<UserBranchCategoryResponse>(
    ROUTE_API.eChanelUserBranchCategory,
    { params }
  );

export const createUserBranchAccess = (data: {
  applicationFamily?: string | null;
  companyFamily?: string | null;
  userCode?: string | null;
  branchFamily: string;
}) => HttpUtil.post(ROUTE_API.eChanelUserBranch, data);

export const setDefaultUserBranchAccess = (data: {
  transactionCode?: string;
  applicationFamily?: string | null;
  companyFamily?: string | null;
  userCode?: string | null;
}) => HttpUtil.put(ROUTE_API.eChanelUserBranch, data);

export const fetchUserAccessBranchList = (
  applicationId: string,
  companyCode: string,
  userCode: string
) =>
  HttpUtil.get<UserAccessBranchListResponse>(
    `${ROUTE_API.eChanelUserBranch}/${applicationId}/${companyCode}/${userCode}`
  );

export const addUserAccessBranch = (data: {
  applicationFamily?: string;
  companyFamily?: string;
  userCode?: string;
  branchFamily: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.eChanelUserBranch, data);

export const removeUserAccessBranch = (data: { transactionCode: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.eChanelUserBranch, data);

export const setDefaultUserAccessBranch = (data: {
  transactionCode?: string;
  applicationFamily?: string;
  companyFamily?: string;
  userCode?: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.eChanelUserBranch, data);
