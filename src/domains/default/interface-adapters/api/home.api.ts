import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';

export const processCustomerTransactions = (
  data: { transaction: string[]; status: string | null; remark?: string },
  isDeleted: boolean
) =>
  fetchDataAsync(
    isDeleted ? ROUTE_API.operationCustomerDelete : ROUTE_API.operationCustomer,
    { data, method: 'POST' }
  );
