export const buildForgotPasswordRequestDto = (email: string) => ({ email });

export const buildConfirmCodeDto = (
  email: string,
  keyCode: string,
  otpCode: string
) => ({
  email,
  keyCode,
  otpCode,
});

export const buildViaSmsDto = (
  email: string,
  keyCode: string,
  phoneNumber: string,
  viaSMSCode: string
) => ({
  email,
  keyCode,
  phoneNumber,
  viaSMSCode,
});

export const buildConfirmChangePasswordDto = (
  keyCode: string,
  email: string,
  newPassword: string,
  confirmPassword: string
) => ({
  keyCode,
  email,
  newPassword,
  confirmPassword,
});
