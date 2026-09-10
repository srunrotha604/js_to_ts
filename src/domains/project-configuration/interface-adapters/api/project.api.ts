import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, ProjectListResponse } from '../../entities';

export const fetchProjectList = () =>
  HttpUtil.get<ProjectListResponse>(ROUTE_API.operationProject);

export const fetchProjectByKey = (key: string) =>
  HttpUtil.get<ProjectListResponse>(ROUTE_API.operationProjectByKey(key));

export const createProject = (data: { projectName: string }) =>
  HttpUtil.post<MessageResponse>(ROUTE_API.operationProject, data);

export const updateProject = (data: {
  transactionCode?: string;
  projectName: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.operationProject, data);
