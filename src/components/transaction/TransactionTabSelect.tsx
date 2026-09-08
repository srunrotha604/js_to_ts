import clsx from 'clsx';
import { useState } from 'react';
import { MdClear } from 'react-icons/md';
import { toast } from 'react-toastify';
import type { CustomerTransaction } from '../../@type/batch';
import { pluralize } from '../../utils/pluralize';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';

interface TransactionTabSelectProps {
  totalSelected?: number;
  isSelectedAll?: boolean;
  onSelectAll?: (checked: boolean) => void;
  onClearSelect?: () => void;
  disableSelectAll?: boolean;
  onClick?: () => void;
  title?: string;
}

const TransactionTabSelect = ({
  totalSelected,
  isSelectedAll,
  onSelectAll,
  onClearSelect,
  disableSelectAll = false,
  onClick,
  title = undefined,
}: TransactionTabSelectProps) => {
  return totalSelected && totalSelected > 0 ? (
    <div className="btn-list align-items-center">
      <h3
        title={title}
        className={clsx(
          'mb-0 ml-5 d-flex align-items-center ',
          onClick && 'btn btn-outline-primary'
        )}
        onClick={onClick}
      >
        {totalSelected} {pluralize('transaction', totalSelected)} selected
      </h3>
      <Button
        className="btn-circle-sm"
        size="sm"
        variant="danger"
        onClick={onClearSelect}
      >
        <MdClear />
      </Button>
    </div>
  ) : (
    !disableSelectAll && (
      <label className="cursor-pointer d-flex align-items-center">
        <Checkbox
          checked={isSelectedAll}
          onChange={onSelectAll ?? (() => {})}
        />
        <h3 className="mb-0 d-inline-block">Select All</h3>
      </label>
    )
  );
};

export const useTransactionTabSelect = () => {
  const [selectedCustomerList, setSelectedCustomerList] = useState<
    CustomerTransaction[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string[]>([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectDeletedTransaction, setSelectDeletedTransaction] =
    useState(false);

  const handleSelectTransaction = (
    transaction?: CustomerTransaction | null
  ) => {
    if (!transaction) return;
    setSelectedAll(false);
    const isTransactionDeleted = transaction.deleted;

    if (selectedTransaction.length > 0) {
      if (
        (isTransactionDeleted && !selectDeletedTransaction) ||
        (!isTransactionDeleted && selectDeletedTransaction)
      ) {
        toast.error("Can't select deleted and non-deleted transactions");
        return;
      }
    } else {
      if (isTransactionDeleted) {
        setSelectDeletedTransaction(true);
      } else {
        setSelectDeletedTransaction(false);
      }
    }

    if (selectedTransaction.includes(transaction?.transactionNumber ?? '')) {
      setSelectedTransaction(
        selectedTransaction.filter((t) => t !== transaction?.transactionNumber)
      );
    } else {
      setSelectedTransaction([
        ...selectedTransaction,
        transaction?.transactionNumber ?? '',
      ]);
    }
  };

  const resetSelected = () => {
    setSelectedAll(false);
    setSelectedCustomerList([]);
    setSelectedTransaction([]);
  };

  const resetSelectedCustomerList = () => {
    setSelectedCustomerList([]);
  };

  const resetSelectedTransaction = () => {
    setSelectedTransaction([]);
  };

  const resetSelectedAll = () => {
    setSelectedAll(false);
  };

  const handleSelectAllInCurrentList = (
    checked: boolean,
    transactionList: CustomerTransaction[]
  ) => {
    setSelectedAll(false);
    if (transactionList.length === 0) return;

    let isTransactionDeleted = transactionList?.[0].deleted;
    if (selectedTransaction.length > 0) {
      isTransactionDeleted = selectDeletedTransaction;
    } else {
      if (isTransactionDeleted) {
        setSelectDeletedTransaction(true);
      } else {
        setSelectDeletedTransaction(false);
      }
    }

    if (checked) {
      setSelectedTransaction((prev) => {
        const selectTransaction = transactionList
          ?.filter((t) => t.deleted === isTransactionDeleted)
          .map((t) => t.transactionNumber ?? '');

        return Array.from(new Set([...prev, ...selectTransaction]));
      });
    } else {
      setSelectedTransaction((prev) => {
        const tempPrev = [...prev];
        return tempPrev.filter(
          (item) =>
            !transactionList.map((t) => t.transactionNumber).includes(item)
        );
      });
    }
  };

  const handleRemoveCustomerFromList = (customer: CustomerTransaction) => {
    const tempSelectedCustomerList = selectedCustomerList.filter(
      (c) => c.transactionNumber !== customer.transactionNumber
    );
    setSelectedCustomerList(tempSelectedCustomerList);
    if (!selectedAll) {
      setSelectedTransaction(
        selectedTransaction.filter((c) => c !== customer.transactionNumber)
      );
    } else {
      setSelectedAll(false);
      setSelectedTransaction(
        tempSelectedCustomerList.map((c) => c.transactionNumber ?? '')
      );
    }
  };

  return {
    selectedCustomerList,
    setSelectedCustomerList,
    selectedTransaction,
    setSelectedTransaction,
    selectedAll,
    setSelectedAll,
    resetSelected,
    resetSelectedCustomerList,
    resetSelectedTransaction,
    resetSelectedAll,
    isSelectedAllInCurrentList: (transactionList?: CustomerTransaction[]) => {
      return !!(
        transactionList &&
        transactionList.length > 0 &&
        transactionList.every((t) =>
          selectedTransaction.includes(t?.transactionNumber ?? '')
        )
      );
    },
    isSelectedItem: (transaction?: CustomerTransaction | null) => {
      return selectedTransaction.includes(transaction?.transactionNumber ?? '');
    },
    isEnableItem: (transaction?: CustomerTransaction | null) => {
      if (selectedTransaction.length === 0) return true;
      return (
        (transaction?.deleted && selectDeletedTransaction) ||
        (!transaction?.deleted && !selectDeletedTransaction)
      );
    },
    handleSelectAllInCurrentList,
    handleSelectTransaction,
    handleRemoveCustomerFromList,
    selectDeletedTransaction,
  };
};
export default TransactionTabSelect;
