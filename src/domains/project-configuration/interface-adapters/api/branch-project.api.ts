import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  BranchProjectDetailResponse,
  BranchProjectListResponse,
  BranchProjectOptionsResponse,
  MessageResponse,
} from '../../entities';

export const fetchBranchProjectOptions = (branchKey: string) =>
  HttpUtil.get<BranchProjectOptionsResponse>(
    ROUTE_API.opertionBranchProjectByKey(branchKey)
  );

export const fetchBranchProjectList = (branchKey: string) =>
  HttpUtil.get<BranchProjectListResponse>(
    ROUTE_API.opertionBranchProjectByKey(branchKey)
  );

export const fetchBranchProjectDetail = (key: string) =>
  HttpUtil.get<BranchProjectDetailResponse>(
    ROUTE_API.opertionBranchProjectByKey(key)
  );

export const createBranchProject = (data: {
  branchFamily?: string;
  projectFamily: string;
  policies: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.opertionBranchProject, data);

export const updateBranchProject = (data: {
  transactionCode?: string;
  policies: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.opertionBranchProject, data);

export const deleteBranchProject = (data: { transactionCode: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.opertionBranchProject, data);
