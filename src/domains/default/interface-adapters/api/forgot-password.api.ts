import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  ForgotPasswordRequestResponse,
  ForgotPasswordResponse,
} from '../../entities';
export const requestForgotPassword = (data: { email: string }) =>
  HttpUtil.post<ForgotPasswordRequestResponse>(
    ROUTE_API.loginForgotPassword,
    data
  );

export const confirmForgotPasswordCode = (data: {
  email: string;
  token: string;
  otpCode: string;
}) => HttpUtil.post<ForgotPasswordResponse>(ROUTE_API.loginConfirmCode, data);

export const requestForgotPasswordViaSms = (data: {
  email: string;
  token: string;
  smsToken: string;
}) => HttpUtil.post<ForgotPasswordResponse>(ROUTE_API.loginViaSms, data);

export const confirmForgotPasswordChange = (data: {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}) =>
  HttpUtil.post<ForgotPasswordResponse>(
    ROUTE_API.loginConfirmChangePassword,
    data
  );
