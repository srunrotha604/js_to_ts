export interface TransactionTotalCounts {
  draft?: number;
  submitted?: number;
  approved?: number;
  bmReject?: number;
  confirmed?: number;
  driReject?: number;
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
