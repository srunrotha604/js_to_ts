import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  ApplicationOptionsResponse,
  MessageResponse,
  SystemUserRoleOptionsResponse,
  UserRoleListResponse,
} from '../../entities';

export const fetchUserRoleList = (key: string) =>
  HttpUtil.get<UserRoleListResponse>(ROUTE_API.eChanelUserRoleByKey(key));

export const deleteUserRole = (data: { key: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.eChanelUserRole, data);

export const createUserRole = (data: {
  applicationFamily: string;
  roleFamily: string;
  userCode?: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.eChanelUserRole, data);

export const fetchApplicationOptions = (key: string) =>
  HttpUtil.get<ApplicationOptionsResponse>(
    ROUTE_API.dataOptionApplication(key)
  );

export const fetchSystemUserRoleOptions = (value: string) =>
  HttpUtil.get<SystemUserRoleOptionsResponse>(
    ROUTE_API.dataOptionSystemUserRole(value)
  );
