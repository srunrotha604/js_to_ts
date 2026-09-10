import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type { ForgotPasswordResponse } from '../../entities';
export const requestForgotPassword = (data: { email: string }) =>
  HttpUtil.post<ForgotPasswordResponse>(ROUTE_API.loginForgotPassword, data);

export const confirmForgotPasswordCode = (data: {
  email: string;
  keyCode: string;
  otpCode: string;
}) => HttpUtil.post<ForgotPasswordResponse>(ROUTE_API.loginConfirmCode, data);

export const requestForgotPasswordViaSms = (data: {
  email: string;
  keyCode: string;
  phoneNumber: string;
  viaSMSCode: string;
}) => HttpUtil.post<ForgotPasswordResponse>(ROUTE_API.loginViaSms, data);

export const confirmForgotPasswordChange = (data: {
  keyCode: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  HttpUtil.post<ForgotPasswordResponse>(
    ROUTE_API.loginConfirmChangePassword,
    data
  );
