import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { BranchListResponse, MessageResponse } from '../../entities';

export const fetchBranchList = () =>
  HttpUtil.get<BranchListResponse>(ROUTE_API.opertionBranch);

export const createBranch = (data: {
  branchCode: string;
  branchName: string;
  contacts: string;
  phone: string;
  mobileOne: string;
  mobileTwo: string;
  email: string;
  website: string;
  address: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.opertionBranch, data);

export const assignBranchAdmin = (data: {
  branchCode: string;
  value: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.opertionBranchAdmin, data);
