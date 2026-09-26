export interface NotificationItem {
  id: number;
  module: 'OperationCustomer' | 'OperationCustomerBatch' | string;
  eventType: 'Created' | 'Updated' | 'StatusChanged' | string;
  status: string;
  isDeleteFlow: boolean;
  transationCode?: string | null;
  transationNumber?: string | null;
  batchNumber?: string | null;
  itemCount: number;
  message: string;
  remark?: string | null;
  createdAt: string;
  isRead: boolean;
  actionRequired: boolean;
}

export interface NotificationListResponse {
  list: NotificationItem[];
  totalDocs: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
