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

export const RECORDSTATUS = {
  Active: 'Active',
  Disable: 'Disable',
};
