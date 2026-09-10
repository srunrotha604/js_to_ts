import { fetchData, fileUpload } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, UserProfileResponse } from '../../entities';
export const fetchCurrentUserProfile = () =>
  fetchData<UserProfileResponse>(ROUTE_API.login, {}, 'GET');
export const uploadProfileAvatar = (formData: FormData) =>
  fileUpload<MessageResponse>(ROUTE_API.systemUser, formData, 'PATCH');
export const saveProfileInfo = (data: {
  userCode: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  website1: string;
  website2: string;
  address1: string;
  address2: string;
  otherContact: string;
}) => fetchData<MessageResponse>(ROUTE_API.systemUserInfo, data, 'POST');
