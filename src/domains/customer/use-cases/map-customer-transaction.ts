import type { CustomerTransaction, CustomerTransactionRaw } from '../entities';
export const mapCustomerTransaction = (
  raw: CustomerTransactionRaw
): CustomerTransaction => {
  const { transationCode, transationNumber, dateofBirth, deleted, ...rest } =
    raw;
  return {
    ...rest,
    transactionCode: transationCode,
    transactionNumber: transationNumber,
    dateOfBirth: dateofBirth,
    deleted: deleted === true || deleted === 'true',
  };
};
