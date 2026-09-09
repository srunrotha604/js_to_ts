import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  ProductListResponse,
  ProductOptionsResponse,
} from '../../entities';

export const fetchProductList = () =>
  fetchData<ProductListResponse>(ROUTE_API.operationProduct, {}, 'GET');

export const fetchProductByKey = (key: string) =>
  fetchData<ProductListResponse>(ROUTE_API.operationProductByKey(key), {}, 'GET');

export const fetchProductOptions = () =>
  fetchData<ProductOptionsResponse>(
    ROUTE_API.operationProductProduct,
    {},
    'GET'
  );

export const createProduct = (data: {
  productsequenceCode: string;
  productCode: string;
  productName: string;
}) => fetchData<MessageResponse>(ROUTE_API.operationProduct, data, 'POST');

export const updateProduct = (data: {
  transactionCode?: string;
  productCode: string;
  productName: string;
}) => fetchData<MessageResponse>(ROUTE_API.operationProduct, data, 'PUT');

export const deleteProduct = (data: { transactionCode: string }) =>
  fetchData<MessageResponse>(ROUTE_API.operationProduct, data, 'DELETE');
