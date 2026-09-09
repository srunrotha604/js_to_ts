import type { PolicyOption } from '../entities';

export const filterPoliciesByProductKey = (
  policies: PolicyOption[],
  productKey: string
): PolicyOption[] =>
  policies.filter((item) => item.keyCode === productKey);
