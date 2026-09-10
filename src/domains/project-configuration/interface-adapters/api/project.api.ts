import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, ProjectListResponse } from '../../entities';

export const fetchProjectList = () =>
  fetchData<ProjectListResponse>(ROUTE_API.operationProject, {}, 'GET');

export const fetchProjectByKey = (key: string) =>
  fetchData<ProjectListResponse>(
    ROUTE_API.operationProjectByKey(key),
    {},
    'GET'
  );

export const createProject = (data: { projectName: string }) =>
  fetchData<MessageResponse>(ROUTE_API.operationProject, data, 'POST');

export const updateProject = (data: {
  transactionCode?: string;
  projectName: string;
}) => fetchData<MessageResponse>(ROUTE_API.operationProject, data, 'PUT');
