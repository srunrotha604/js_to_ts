export interface SecurityPolicy {
  policyCode?: string;
  policyName?: string;
  minimumPasswordLength?: number;
  maximumPasswordLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigit?: boolean;
  requireSpecialCharacter?: boolean;
  preventCommonPasswords?: boolean;
  preventPasswordReuse?: boolean;
  passwordHistoryCount?: number;
  passwordExpirationDays?: number;
}
export interface ForgotPasswordRequestResponse {
  message?: string;
  token?: string;
  smsToken?: string;
  expirationInMinutes?: number;
  forgotPasswordViaSMS?: boolean;
  securityPolicy?: SecurityPolicy;
}
export interface ForgotPasswordResponse {
  success?: boolean;
  keyCode?: string;
  phoneNumber?: string;
  viaSMSCode?: string;
  attempt?: number;
  message?: string;
  error?: string;
  token?: string;
  smsToken?: string;
  expirationInMinutes?: number;
  forgotPasswordViaSMS?: boolean;
  securityPolicy?: SecurityPolicy;
}
