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
