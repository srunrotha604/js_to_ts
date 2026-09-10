import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, RoleAccessListResponse } from '../../entities';

export const fetchRoleAccessList = () =>
  HttpUtil.get<RoleAccessListResponse>(ROUTE_API.applicationRoleAccess);

export const updateRoleAccess = (data: {
  transactionCode: string;
  access: string;
  process: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.applicationRoleAccess, data);
