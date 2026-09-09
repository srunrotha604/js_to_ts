import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  RoleOptionsResponse,
  UserListResponse,
} from '../../entities';

export const fetchUserList = (branchName: string) =>
  fetchData<UserListResponse>(
    `${ROUTE_API.eChanelUser}?branchName=${branchName}`,
    {},
    'GET'
  );

export const fetchUserByCode = (key: string) =>
  fetchData<UserListResponse>(
    `${ROUTE_API.eChanelUser}?transaction=${key}&branchName=`,
    {},
    'GET'
  );

export const fetchUserRoleOptions = () =>
  fetchData<RoleOptionsResponse>(ROUTE_API.eChanelUserAccess, {}, 'GET');

export const createUser = (data: {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  branch: string;
  phone: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelUser, data, 'POST');

export const updateUser = (data: { key?: string; role: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelUser, data, 'PUT');
