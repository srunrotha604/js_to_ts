import type { CustomerTransaction } from '../entities';

export interface DuplicateCustomerResult {
  totalDocs?: number;
  list?: CustomerTransaction[];
}

export interface DuplicateCheckIdentifiers {
  nicPassport?: string;
  customerId?: string;
}

export const hasDuplicatePolicies = (result: DuplicateCustomerResult | null) =>
  !!result?.totalDocs && result.totalDocs > 0;
