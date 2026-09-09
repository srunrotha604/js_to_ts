import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  DataEntryListResponse,
  MessageResponse,
  RoleOptionsResponse,
} from '../../entities';

export const fetchDataEntryList = (branchName: string | undefined) =>
  fetchData<DataEntryListResponse>(
    `${ROUTE_API.eChanelDataEntry}?branchName=${branchName}`,
    {},
    'GET'
  );

export const fetchDataEntryRoleOptions = () =>
  fetchData<RoleOptionsResponse>(ROUTE_API.eChanelDataEntryAccess, {}, 'GET');

export const createDataEntry = (data: {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  phone: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelDataEntry, data, 'POST');

export const importDataEntry = (data: { email: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelDataEntryImport, data, 'POST');

export const toggleDataEntryStatus = (data: { key?: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelDataEntryStatus, data, 'POST');

export const deleteDataEntry = (data: { key?: string }) =>
  fetchData<MessageResponse>(ROUTE_API.eChanelDataEntry, data, 'DELETE');
