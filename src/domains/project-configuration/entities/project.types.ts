export interface ProjectItem {
  key?: string;
  transactionCode?: string;
  projectName?: string;
  applicationName?: string;
  applicationCode?: string;
  moduleName?: string;
  description?: string;
  status?: string;
}

export interface ProjectListResponse {
  list?: ProjectItem[];
  message?: string;
}
