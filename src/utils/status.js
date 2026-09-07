export const STATUS = {
  All: 'All',
  Draft: 'Draft',
  Approved: 'Approved',
  BM_Rejected: 'BM-Rejected',
  DRI_Rejected: 'DRI-Rejected',
  Confirmed: 'Confirmed',
  Submitted: 'Submitted',
  BM_Rejected_Draft: 'BM-Rejected-Draft',
  Confirmed_Deleted: 'Confirmed_Deleted',
};

export const RECORDSTATUS = {
  Active: 'Active',
  Disable: 'Disable',
};

const lsTransactionStatusReminderKey = 'lsTransactionStatusReminder';
export const isTransactionStatusCountChanged = (status, transactionTotal) => {
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

export const NOTIFICATION_PATH = {
  Approved: `${window.location.origin}`,
};
