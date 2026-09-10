export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  company: string;
  branch: string;
  expiration: string;
  tokenExpiration: string;
  message?: string;
}
