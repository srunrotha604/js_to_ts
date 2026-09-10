import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { MessageResponse, UserAccessDetailResponse } from '../../entities';

export const fetchUserAccessDetail = (userCode: string) =>
  HttpUtil.get<UserAccessDetailResponse>(
    ROUTE_API.eChanelUserAccessByCode(userCode)
  );

export const saveUserAccessStatus = (data: {
  transactionCode: string;
  accessStatus: string;
  processStatus: string;
  adminBranch: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.eChanelUserAccess, data);

export const checkBranchManagerConflict = (branchKey: string) =>
  HttpUtil.get<MessageResponse>(
    `${ROUTE_API.branchManager}?transaction=${branchKey}`
  );
