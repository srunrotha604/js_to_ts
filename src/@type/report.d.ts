export interface SelectOption {
  label: string;
  value: string;
  hidden?: boolean;
}

export interface CompanyBranchOption extends SelectOption {
  branch?: SelectOption[];
  logo?: string;
}

export interface UserReportItem {
  deleted?: boolean;
  userName?: string;
  email?: string;
  role?: string;
  branch?: string;
  dateRegisterd?: string;
  createedBy?: string;
  status?: string;
}

export interface UserReportListResponse {
  totalDocs?: number;
  list?: UserReportItem[];
}

export interface CustomerReportItem {
  transactionNumber?: string;
  batchNumber?: string;
  sureName?: string;
  firstName?: string;
  projectCode?: string;
  productCode?: string;
  inputDateTime?: string;
  inputter?: string;
  inputBranch?: string;
  customerIssueDate?: { issueDate?: string };
  status?: string;
  deleted?: boolean;
}

export interface CustomerReportListResponse {
  list?: CustomerReportItem[];
}
