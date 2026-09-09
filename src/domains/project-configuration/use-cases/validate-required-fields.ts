export const validateRequiredFields = (
  values: Array<string | unknown[]>
): boolean =>
  values.every((value) =>
    Array.isArray(value) ? value.length > 0 : value !== ''
  );
