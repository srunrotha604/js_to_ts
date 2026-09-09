import type { SelectOption } from '../../../@type/report';

export interface ProductItem {
  transactionCode?: string;
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
  options?: SelectOption[];
  message?: string;
}
