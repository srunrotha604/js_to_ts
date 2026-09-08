export interface LoginResponse {
  token?: string;
  refreshToken?: string;
  company?: string;
  branch?: string;
  message?: string;
}

export interface ForgotPasswordResponse {
  keyCode?: string;
  phoneNumber?: string;
  viaSMSCode?: string;
  attempt?: number;
  message?: string;
}
