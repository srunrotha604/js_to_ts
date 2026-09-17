export interface ListLoginLog {
  datas: LogData[];
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface LogData {
  userName: string;
  environment: string;
  loginTime: string;
  logoutTime: string;
  loginStatus: string;
  failureReason: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
  logoutReason: string;
}
