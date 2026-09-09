import { registerLogoutHandler } from '../../../context/AuthContext';

const lsTransactionStatusReminderKey = 'lsTransactionStatusReminder';

export const isTransactionStatusCountChanged = (
  status: string,
  transactionTotal: Record<string, number>
) => {
  const lsTransactionStatus = localStorage.getItem(
    lsTransactionStatusReminderKey
  );
  if (
    transactionTotal &&
    typeof transactionTotal === 'object' &&
    Object.keys(transactionTotal).length > 0
  ) {
    localStorage.setItem(
      lsTransactionStatusReminderKey,
      JSON.stringify(transactionTotal)
    );
  }

  if (!lsTransactionStatus) {
    if (transactionTotal?.[status] > 0) return true;
    return false;
  }

  const _transactionTotal = JSON.parse(lsTransactionStatus);
  if (
    _transactionTotal?.[status] >= 0 &&
    transactionTotal?.[status] >= 0 &&
    _transactionTotal?.[status] < transactionTotal?.[status]
  ) {
    return true;
  }

  return false;
};

export const clearTransactionStatusCount = () => {
  localStorage.removeItem(lsTransactionStatusReminderKey);
};

registerLogoutHandler(clearTransactionStatusCount);

export const NOTIFICATION_PATH = {
  Approved: `${window.location.origin}`,
};
