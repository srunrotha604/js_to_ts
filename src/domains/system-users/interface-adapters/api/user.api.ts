import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  RoleOptionsResponse,
  UserListResponse,
} from '../../entities';

export const fetchUserList = (branchName: string) =>
  HttpUtil.get<UserListResponse>(
    `${ROUTE_API.eChanelUser}?branchName=${branchName}`
  );

export const fetchUserByCode = (key: string) =>
  HttpUtil.get<UserListResponse>(
    `${ROUTE_API.eChanelUser}?transaction=${key}&branchName=`
  );

export const fetchUserRoleOptions = () =>
  HttpUtil.get<RoleOptionsResponse>(ROUTE_API.eChanelUserAccess);

export const createUser = (data: {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  branch: string;
  phone: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.eChanelUser, data);

export const updateUser = (data: { key?: string; role: string }) =>
  HttpUtil.put<MessageResponse>(ROUTE_API.eChanelUser, data);
