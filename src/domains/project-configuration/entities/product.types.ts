import type { ProductSelectOption } from '../../../@type/report';

export interface ProductItem {
  transationCode?: string;
  productsequenceCode?: string;
  productCode?: string;
  productName?: string;
  status?: string;
}

export interface ProductListResponse {
  list?: ProductItem[];
  message?: string;
}

export interface ProductOptionsResponse {
  options?: ProductSelectOption[];
  message?: string;
}
