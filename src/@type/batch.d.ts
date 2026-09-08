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
  status?: string;
  projectCode?: string;
  productCode?: string;
  inputter?: string;
  inputBranch?: string;
}

export interface ProductOption {
  productsequenceCode?: string;
  productCode?: string;
  productName?: string;
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

export interface BatchCustomerRow {
  rowNumber?: number;
  surName?: string;
  firstName?: string;
  gender?: string;
  telNo?: string;
  dateOfBirth?: string;
  nicPassport?: string;
  parentId?: string;
  customerId?: string;
  nation?: string;
  physicalCard?: string;
  openingDate?: string;
}

export interface BatchCustomerListResult {
  list?: BatchCustomerRow[];
  existingList?: BatchCustomerRow[];
  duplicateList?: BatchCustomerRow[];
  errorList?: BatchCustomerRow[];
  totalRecord?: number;
  totalExistingRecord?: number;
  totalDuplicateRecord?: number;
  totalErrorRecord?: number;
  message?: string;
}
