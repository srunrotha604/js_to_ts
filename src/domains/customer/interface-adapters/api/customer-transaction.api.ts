import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { CustomerListResponse, CustomerTransaction } from '../../entities';
import type {
  DuplicateCheckIdentifiers,
  DuplicateCustomerResult,
} from '../../use-cases/check-duplicate-customer';

export const fetchCustomerDuplicateCheck = async (
  identifiers: DuplicateCheckIdentifiers
) => {
  const response = await HttpUtil.get<DuplicateCustomerResult>(
    ROUTE_API.operationCustomerDuplicate,
    { params: identifiers }
  );
  return response?.data ?? null;
};

export const fetchCustomerTransactionByCode = async (
  transactionCode: string
) => {
  const response = await HttpUtil.get<{ list?: CustomerTransaction[] }>(
    `${ROUTE_API.operationCustomer}?transactionCode=${transactionCode}`
  );
  return response?.data?.list?.[0] ?? null;
};

export const fetchCustomerTransactionList = async (
  params: Record<string, unknown>
) => {
  const response = await HttpUtil.get<CustomerListResponse>(
    ROUTE_API.operationCustomer,
    { params }
  );
  return response?.data ?? null;
};

export const createCustomerTransaction = async (
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.post(ROUTE_API.operationCustomer, data);
  return response?.data;
};

export const updateCustomerTransaction = async (
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.put(ROUTE_API.operationCustomer, data);
  return response?.data;
};

export const deleteCustomerTransactions = async (
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.post(
    ROUTE_API.operationCustomerDelete,
    data
  );
  return response?.data;
};

export const processCustomerTransaction = async (
  isDeleted: boolean,
  data: Record<string, unknown>
) => {
  const response = await HttpUtil.post(
    `${ROUTE_API.operationCustomer}${isDeleted ? '/delete' : ''}`,
    data
  );
  return response?.data;
};
