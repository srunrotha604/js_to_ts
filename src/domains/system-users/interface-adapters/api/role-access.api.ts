import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, RoleAccessListResponse } from '../../entities';

export const fetchRoleAccessList = () =>
  fetchData<RoleAccessListResponse>(
    ROUTE_API.applicationRoleAccess,
    {},
    'GET'
  );

export const updateRoleAccess = (data: {
  transactionCode: string;
  access: string;
  process: string;
}) =>
  fetchData<MessageResponse>(ROUTE_API.applicationRoleAccess, data, 'PUT');
