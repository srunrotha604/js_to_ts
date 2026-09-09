import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  BranchProjectDetailResponse,
  BranchProjectListResponse,
  BranchProjectOptionsResponse,
  MessageResponse,
} from '../../entities';

export const fetchBranchProjectOptions = (branchKey: string) =>
  fetchData<BranchProjectOptionsResponse>(
    ROUTE_API.opertionBranchProjectByKey(branchKey),
    {},
    'GET'
  );

export const fetchBranchProjectList = (branchKey: string) =>
  fetchData<BranchProjectListResponse>(
    ROUTE_API.opertionBranchProjectByKey(branchKey),
    {},
    'GET'
  );

export const fetchBranchProjectDetail = (key: string) =>
  fetchData<BranchProjectDetailResponse>(
    ROUTE_API.opertionBranchProjectByKey(key),
    {},
    'GET'
  );

export const createBranchProject = (data: {
  branchFamily?: string;
  projectFamily: string;
  policies: string;
}) => fetchData<MessageResponse>(ROUTE_API.opertionBranchProject, data, 'POST');

export const updateBranchProject = (data: {
  transactionCode?: string;
  policies: string;
}) => fetchData<MessageResponse>(ROUTE_API.opertionBranchProject, data, 'PUT');

export const deleteBranchProject = (data: { transactionCode: string }) =>
  fetchData<MessageResponse>(ROUTE_API.opertionBranchProject, data, 'DELETE');
