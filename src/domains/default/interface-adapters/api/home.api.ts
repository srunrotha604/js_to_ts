import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
export const processCustomerTransactions = (
  data: { transaction: string[]; status: string | null; remark?: string },
  isDeleted: boolean
) =>
  HttpUtil.post(
    isDeleted ? ROUTE_API.operationCustomerDelete : ROUTE_API.operationCustomer,
    data
  );
