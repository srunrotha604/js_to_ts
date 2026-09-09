import type {
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../customer/entities';
import type { BatchDetailInfo } from './batch-detail.types';

/**
 * The real shape returned by `${ROUTE_API.operationCustomerBatch}/` when
 * fetching a batch's transaction list: a standard paginated transaction
 * list response plus the batch metadata envelope (`details`).
 */
export interface BatchTransactionListResponse {
  list?: CustomerTransaction[];
  total?: TransactionTotalCounts[];
  totalDocs?: number;
  details?: BatchDetailInfo;
}
