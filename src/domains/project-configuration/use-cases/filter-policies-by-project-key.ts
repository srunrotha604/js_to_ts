import type { SelectOption } from '../../../@type/report';
import type { BranchProjectOption } from '../entities';

export const filterPoliciesByProjectKey = (
  projects: BranchProjectOption[],
  key: string
): SelectOption[] =>
  projects.find((item) => item.value === key)?.policies ?? [];
