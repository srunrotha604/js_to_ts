import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  MessageResponse,
  ProductListResponse,
  ProductOptionsResponse,
} from '../../entities';

export const fetchProductList = () =>
  HttpUtil.get<ProductListResponse>(ROUTE_API.operationProduct);

export const fetchProductByKey = (key: string) =>
  HttpUtil.get<ProductListResponse>(ROUTE_API.operationProductByKey(key));

export const fetchProductOptions = () =>
  HttpUtil.get<ProductOptionsResponse>(ROUTE_API.operationProductProduct);

export const createProduct = (data: {
  productsequenceCode: string;
  productCode: string;
  productName: string;
}) => HttpUtil.post<MessageResponse>(ROUTE_API.operationProduct, data);

export const updateProduct = (data: {
  transactionCode?: string;
  productCode: string;
  productName: string;
}) => HttpUtil.put<MessageResponse>(ROUTE_API.operationProduct, data);

export const deleteProduct = (data: { transactionCode: string }) =>
  HttpUtil.delete<MessageResponse>(ROUTE_API.operationProduct, data);
