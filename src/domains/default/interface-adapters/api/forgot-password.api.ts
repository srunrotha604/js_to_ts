import { fetchData } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type { ForgotPasswordResponse } from '../../entities';
export const requestForgotPassword = (data: { email: string }) =>
  fetchData<ForgotPasswordResponse>(
    ROUTE_API.loginForgotPassword,
    data,
    'POST'
  );

export const confirmForgotPasswordCode = (data: {
  email: string;
  keyCode: string;
  otpCode: string;
}) =>
  fetchData<ForgotPasswordResponse>(ROUTE_API.loginConfirmCode, data, 'POST');

export const requestForgotPasswordViaSms = (data: {
  email: string;
  keyCode: string;
  phoneNumber: string;
  viaSMSCode: string;
}) => fetchData<ForgotPasswordResponse>(ROUTE_API.loginViaSms, data, 'POST');

export const confirmForgotPasswordChange = (data: {
  keyCode: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}) =>
  fetchData<ForgotPasswordResponse>(
    ROUTE_API.loginConfirmChangePassword,
    data,
    'POST'
  );
