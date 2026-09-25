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

// Response of POST /auth/forgot-password on success.
export interface ForgotPasswordRequestResponse {
  message?: string;
  token?: string;
  smsToken?: string;
  expirationInMinutes?: number;
  forgotPasswordViaSMS?: boolean;
  securityPolicy?: SecurityPolicy;
}

// Shared response shape for the other steps in the flow (confirm-code,
// forgot-password-via-sms) and for error bodies (which only carry `message`).
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
