export const buildForgotPasswordRequestDto = (email: string) => ({ email });

export const buildConfirmCodeDto = (
  email: string,
  token: string,
  otpCode: string
) => ({
  email,
  token,
  otpCode,
});

export const buildViaSmsDto = (
  email: string,
  token: string,
  smsToken: string
) => ({
  email,
  token,
  smsToken,
});

export const buildConfirmChangePasswordDto = (
  email: string,
  token: string,
  password: string,
  confirmPassword: string
) => ({
  email,
  token,
  password,
  confirmPassword,
});
