import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse } from '../../entities';

export const addUserPhoneNumber = (data: {
  uuid?: string;
  phoneNumber: string;
}) =>
  fetchDataAsync<MessageResponse>(ROUTE_API.eChanelUserAddPhoneNumber, {
    data,
    method: 'post',
  });

export const addDataEntryPhoneNumber = (data: {
  uuid?: string;
  phoneNumber: string;
}) =>
  fetchDataAsync<MessageResponse>(ROUTE_API.eChanelDataEntryAddPhoneNumber, {
    data,
    method: 'post',
  });
