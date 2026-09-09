import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, UserAccessDetailResponse } from '../../entities';

export const fetchUserAccessDetail = (userCode: string) =>
  fetchData<UserAccessDetailResponse>(
    ROUTE_API.eChanelUserAccessByCode(userCode),
    {},
    'GET'
  );

export const saveUserAccessStatus = (data: {
  transactionCode: string;
  accessStatus: string;
  processStatus: string;
  adminBranch: string;
}) => fetchData<MessageResponse>(ROUTE_API.eChanelUserAccess, data, 'POST');

export const checkBranchManagerConflict = (branchKey: string) =>
  fetchData<MessageResponse>(
    `${ROUTE_API.branchManager}?transaction=${branchKey}`,
    {},
    'GET'
  );
