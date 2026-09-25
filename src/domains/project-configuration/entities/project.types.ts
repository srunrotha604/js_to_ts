export interface ProjectItem {
  docEntry: number;
  transationCode: string;
  projectName: string;
  status: string;
  inputter: string;
  inputDateTime: string;
}
export interface ProjectListResponse {
  list?: ProjectItem[];
  message?: string;
}
