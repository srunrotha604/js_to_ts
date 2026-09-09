export const parseCsvList = (value: string): string[] =>
  (value ?? '').split(',').filter(Boolean);
