import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { BranchListResponse, MessageResponse } from '../../entities';

export const fetchBranchList = () =>
  fetchData<BranchListResponse>(ROUTE_API.opertionBranch, {}, 'GET');

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
}) => fetchData<MessageResponse>(ROUTE_API.opertionBranch, data, 'POST');

export const assignBranchAdmin = (data: {
  branchCode: string;
  value: string;
}) => fetchData<MessageResponse>(ROUTE_API.opertionBranchAdmin, data, 'PUT');
