export const buildChangePasswordDto = (
  password: string,
  newPassword: string,
  confirmPassword: string
) => ({
  password,
  newPassword,
  confirmPassword,
});
