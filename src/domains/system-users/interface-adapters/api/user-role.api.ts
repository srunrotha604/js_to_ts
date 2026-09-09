import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  ApplicationOptionsResponse,
  MessageResponse,
  SystemUserRoleOptionsResponse,
  UserRoleListResponse,
} from '../../entities';

export const fetchUserRoleList = (key: string) =>
  fetchData<UserRoleListResponse>(
    ROUTE_API.eChanelUserRoleByKey(key),
    {},
    'GET'
  );

export const deleteUserRole = (data: { key: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelUserRole, data, 'DELETE');

export const createUserRole = (data: {
  applicationFamily: string;
  roleFamily: string;
  userCode?: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelUserRole, data, 'POST');

export const fetchApplicationOptions = (key: string) =>
  fetchData<ApplicationOptionsResponse>(
    ROUTE_API.dataOptionApplication(key),
    {},
    'GET'
  );

export const fetchSystemUserRoleOptions = (value: string) =>
  fetchData<SystemUserRoleOptionsResponse>(
    ROUTE_API.dataOptionSystemUserRole(value),
    {},
    'GET'
  );
