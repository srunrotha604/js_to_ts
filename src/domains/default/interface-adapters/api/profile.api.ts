import { ResProfile } from '../../../../@type/profile';
import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse } from '../../entities';
export const fetchCurrentUserProfile = () =>
  HttpUtil.get<ResProfile>(ROUTE_API.getProfile);
export const uploadProfileAvatar = (formData: FormData) =>
  HttpUtil.patch<MessageResponse>(ROUTE_API.systemUser, formData);
export const saveProfileInfo = (data: {
  userCode: string;
  email1: string;
  // email2: string;
  // phone1: string;
  // phone2: string;
  // website1: string;
  // website2: string;
  // address1: string;
  // address2: string;
  // otherContact: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.systemUserInfo, data);
