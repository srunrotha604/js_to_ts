import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { CustomerListResponse, CustomerTransaction } from '../../entities';
import type {
  DuplicateCheckIdentifiers,
  DuplicateCustomerResult,
} from '../../use-cases/check-duplicate-customer';

export const fetchCustomerDuplicateCheck = async (
  identifiers: DuplicateCheckIdentifiers
) => {
  const response = await fetchDataAsync<DuplicateCustomerResult>(
    ROUTE_API.operationCustomerDuplicate,
    { params: identifiers }
  );
  return response?.data ?? null;
};

export const fetchCustomerTransactionByCode = async (
  transactionCode: string
) => {
  const response = await fetchDataAsync<{ list?: CustomerTransaction[] }>(
    `${ROUTE_API.operationCustomer}?transactionCode=${transactionCode}`
  );
  return response?.data?.list?.[0] ?? null;
};

export const fetchCustomerTransactionList = async (
  params: Record<string, unknown>
) => {
  const response = await fetchDataAsync<CustomerListResponse>(
    ROUTE_API.operationCustomer,
    { params }
  );
  return response?.data ?? null;
};

export const createCustomerTransaction = async (
  data: Record<string, unknown>
) => {
  const response = await fetchDataAsync(ROUTE_API.operationCustomer, {
    method: 'POST',
    data,
  });
  return response?.data;
};

export const updateCustomerTransaction = async (
  data: Record<string, unknown>
) => {
  const response = await fetchDataAsync(ROUTE_API.operationCustomer, {
    method: 'PUT',
    data,
  });
  return response?.data;
};

export const deleteCustomerTransactions = async (
  data: Record<string, unknown>
) => {
  const response = await fetchDataAsync(ROUTE_API.operationCustomerDelete, {
    method: 'POST',
    data,
  });
  return response?.data;
};

export const processCustomerTransaction = async (
  isDeleted: boolean,
  data: Record<string, unknown>
) => {
  const response = await fetchDataAsync(
    `${ROUTE_API.operationCustomer}${isDeleted ? '/delete' : ''}`,
    { method: 'POST', data }
  );
  return response?.data;
};
