export interface ForgotPasswordResponse {
  keyCode?: string;
  phoneNumber?: string;
  viaSMSCode?: string;
  attempt?: number;
  message?: string;
}
