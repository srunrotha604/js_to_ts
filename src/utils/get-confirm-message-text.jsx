import { pluralize } from './pluralize';

export const getConfirmedMessageText = ({
  status,
  selectedCustomerList = [],
}) => {
  const tempStatus = {
    'BM-Rejected-Draft': 'draft',
    'DRI-Rejected-Draft': 'draft',
    Submitted: 'submit',
    Approved: 'approve',
    Deleted: 'delete',
    'BM-Rejected': 'bm-reject',
    Confirmed: 'confirm',
    'DRI-Rejected': 'dri-reject',
  };
  const proccessStatus = tempStatus?.[status] ?? 'approve';

  return (
    <p className="fs-4">
      Are you sure you want to <b>{proccessStatus}</b>{' '}
      {`${selectedCustomerList.length > 1 ? 'these' : 'this'}`}{' '}
      <b>
        {selectedCustomerList.length > 0 ? selectedCustomerList.length : ''}
      </b>{' '}
      {pluralize('transaction', selectedCustomerList?.length)}?
    </p>
  );
};
