import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  DataEntryListResponse,
  MessageResponse,
  RoleOptionsResponse,
} from '../../entities';

export const fetchDataEntryList = (branchName: string | undefined) =>
  HttpUtil.get<DataEntryListResponse>(
    `${ROUTE_API.eChanelDataEntry}?branchName=${branchName}`
  );

export const fetchDataEntryRoleOptions = () =>
  HttpUtil.get<RoleOptionsResponse>(ROUTE_API.eChanelDataEntryAccess);

export const createDataEntry = (data: {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  phone: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.eChanelDataEntry, data);

export const importDataEntry = (data: { email: string }) =>
  HttpUtil.post<MessageResponse>(ROUTE_API.eChanelDataEntryImport, data);

export const toggleDataEntryStatus = (data: { key?: string }) =>
  HttpUtil.post<MessageResponse>(ROUTE_API.eChanelDataEntryStatus, data);

export const deleteDataEntry = (data: { key?: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.eChanelDataEntry, data);
