export interface ForgotPasswordResponse {
  keyCode?: string;
  phoneNumber?: string;
  viaSMSCode?: string;
  attempt?: number;
  message?: string;
  token?: string;
  smsToken?: string;
  expirationInMinutes?: number;
  forgotPasswordViaSMS?: boolean;
}
