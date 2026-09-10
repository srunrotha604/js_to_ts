import type {
  CustomerTransaction,
  TransactionTotalCounts,
} from '../../customer/entities';
import type { BatchDetailInfo } from './batch-detail.types';
export interface BatchTransactionListResponse {
  list?: CustomerTransaction[];
  total?: TransactionTotalCounts[];
  totalDocs?: number;
  details?: BatchDetailInfo;
}
