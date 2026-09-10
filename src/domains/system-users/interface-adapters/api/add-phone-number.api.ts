import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse } from '../../entities';

export const addUserPhoneNumber = (data: {
  uuid?: string;
  phoneNumber: string;
}) =>
  HttpUtil.post<MessageResponse>(
    ROUTE_API.eChanelUserAddPhoneNumber,
    data
  );

export const addDataEntryPhoneNumber = (data: {
  uuid?: string;
  phoneNumber: string;
}) =>
  HttpUtil.post<MessageResponse>(
    ROUTE_API.eChanelDataEntryAddPhoneNumber,
    data
  );
