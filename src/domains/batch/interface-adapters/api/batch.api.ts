import type { FileWithPath } from 'react-dropzone';
import { fetchDataAsync, fileUpload } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { CustomerListResponse } from '../../../customer/entities';
import type { BatchCustomerListResult } from '../../entities';

export const uploadBatchExcel = (
  files: FileWithPath[],
  data: { ProjectCode?: string; Policies?: string; ProductCode: string }
) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append('files', item);
  });
  formData.append('data', JSON.stringify(data));

  return fileUpload<BatchCustomerListResult>(
    ROUTE_API.operationCustomerBatchUpload,
    formData,
    'POST'
  );
};

export const submitBatchCustomerList = async (data: Record<string, unknown>) => {
  const response = await fetchDataAsync(ROUTE_API.operationCustomerBatch, {
    data,
    method: 'POST',
  });
  return response?.data;
};

export const fetchBatchTransactionList = async (
  batchNumber: string,
  params: Record<string, unknown>
) => {
  const response = await fetchDataAsync<CustomerListResponse>(
    `${ROUTE_API.operationCustomerBatch}?batchNumber=${batchNumber}`,
    { params }
  );
  return response?.data ?? null;
};

export const processBatchTransactions = async (data: Record<string, unknown>) => {
  const response = await fetchDataAsync(ROUTE_API.operationCustomerBatch, {
    data,
    method: 'POST',
  });
  return response?.data;
};
