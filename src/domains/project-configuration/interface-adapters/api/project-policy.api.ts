import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  ProjectPolicyListResponse,
  ProjectPolicyOptionResponse,
} from '../../entities';

export const fetchProjectPolicyList = (projectKey: string) =>
  HttpUtil.get<ProjectPolicyListResponse>(
    ROUTE_API.operationProjectPolicyByKey(projectKey)
  );

export const deleteProjectPolicy = (data: { transactionCode: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.operationProjectPolicy, data);

export const fetchProjectPolicyOptions = () =>
  HttpUtil.get<ProjectPolicyOptionResponse>(
    ROUTE_API.coreSystemOperationPolicy
  );

export const createProjectPolicy = (data: {
  projectFamily?: string;
  policyCode: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.operationProjectPolicy, data);
