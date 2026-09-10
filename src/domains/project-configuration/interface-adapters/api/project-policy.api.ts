import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  ProjectPolicyListResponse,
  ProjectPolicyOptionResponse,
} from '../../entities';

export const fetchProjectPolicyList = (projectKey: string) =>
  fetchData<ProjectPolicyListResponse>(
    ROUTE_API.operationProjectPolicyByKey(projectKey),
    {},
    'GET'
  );

export const deleteProjectPolicy = (data: { transactionCode: string }) =>
  fetchData<MessageResponse>(ROUTE_API.operationProjectPolicy, data, 'DELETE');

export const fetchProjectPolicyOptions = () =>
  fetchData<ProjectPolicyOptionResponse>(
    ROUTE_API.coreSystemOperationPolicy,
    {},
    'GET'
  );

export const createProjectPolicy = (data: {
  projectFamily?: string;
  policyCode: string;
}) =>
  fetchData<MessageResponse>(ROUTE_API.operationProjectPolicy, data, 'POST');
