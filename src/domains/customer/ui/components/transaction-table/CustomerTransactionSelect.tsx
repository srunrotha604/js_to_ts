import clsx from 'clsx';
import { MdClear } from 'react-icons/md';
import Button from '../../../../../components/common/Button';
import Checkbox from '../../../../../components/common/Checkbox';
import { pluralize } from '../../../../../utils/pluralize';

interface TransactionTabSelectProps {
  totalSelected?: number;
  isSelectedAll?: boolean;
  onSelectAll?: (checked: boolean) => void;
  onClearSelect?: () => void;
  disableSelectAll?: boolean;
  onClick?: () => void;
  title?: string;
}

const CustomerTransactionSelect = ({
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

export default CustomerTransactionSelect;
