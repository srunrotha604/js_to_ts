import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  ProductListResponse,
  ProjectCategoryResponse,
} from '../../entities';

export const fetchProductList = () =>
  fetchData<ProductListResponse>(ROUTE_API.operationCustomerProduct, {}, 'GET');

export const fetchProductAndPoliciesBySequenceCode = (
  productSequenceCode: string
) =>
  fetchData<ProductListResponse & ProjectCategoryResponse>(
    `${ROUTE_API.operationCustomerProduct}/${productSequenceCode}`,
    {},
    'GET'
  );

export const fetchPoliciesByProductCode = (productCode: string) =>
  fetchData<ProjectCategoryResponse>(
    `${ROUTE_API.operationCustomerProduct}/${productCode}`,
    {},
    'GET'
  );
