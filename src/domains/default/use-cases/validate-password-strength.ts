const PASSWORD_STRENGTH_PATTERN =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const validatePasswordStrength = (password: string): boolean =>
  PASSWORD_STRENGTH_PATTERN.test(password);
