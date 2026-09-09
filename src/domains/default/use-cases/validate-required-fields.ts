export const validateRequiredFields = (values: string[]): boolean =>
  values.every((value) => value !== '');
