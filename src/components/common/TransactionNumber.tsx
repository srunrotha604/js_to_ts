import clsx from 'clsx';
import { toast } from 'react-toastify';
import { copyTextToClipboard } from '../../utils/copy-text-to-clipboard';

interface TransactionNumberProps {
  transactionNumber?: string;
  label?: string;
  disableLabel?: boolean;
  disableGutter?: boolean;
}

const TransactionNumber = ({
  transactionNumber,
  label = 'Transaction No.',
  disableLabel = false,
  disableGutter = false,
}: TransactionNumberProps) => {
  return (
    <div className={clsx('fs-5 text-dark', { ['mb-2']: !disableGutter })}>
      {!disableLabel ? label : ''}{' '}
      <b>
        <span
          className="fs-4 text-primary-blue d-inline-block text-underline"
          onClick={() => {
            toast.success(`${label} ${transactionNumber} Copied to Clipboard`);
            copyTextToClipboard(transactionNumber ?? '');
          }}
        >
          {transactionNumber}
          <CopyIcon />
        </span>
      </b>
    </div>
  );
};

const CopyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-copy"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
    </svg>
  );
};

export default TransactionNumber;
