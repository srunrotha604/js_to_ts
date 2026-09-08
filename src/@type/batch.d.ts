export interface TransactionTotalCounts {
  total?: number;
  draft?: number;
  submitted?: number;
  approved?: number;
  bmReject?: number;
  confirmed?: number;
  driReject?: number;
  confirmedDeleted?: number;
}

export interface BatchDetailInfo {
  batchNumber?: string;
  inputDateTime?: string;
  projectName?: string;
  productName?: string;
  policies?: string;
  inputCompany?: string;
  inputBranch?: string;
  inputter?: string;
}

export interface BatchDetail {
  details?: BatchDetailInfo;
  totalDocs?: number;
}

export interface CustomerListResponse {
  list?: CustomerTransaction[];
}

export interface CustomerTransaction {
  transactionCode?: string;
  transactionNumber?: string;
  sureName?: string;
  firstName?: string;
  telNo?: string;
  gender?: string;
  nation?: string;
  nicPassport?: string;
  deleted?: boolean;
}

export interface ProductOption {
  productsequenceCode?: string;
  productCode?: string;
}

export interface ProductListResponse {
  list?: ProductOption[];
  message?: string;
}

export interface ProjectPolicyOption {
  label?: string;
  value?: string;
  policies?: { label?: string; value?: string }[];
}

export interface ProjectCategoryResponse {
  category?: ProjectPolicyOption[];
  message?: string;
}
