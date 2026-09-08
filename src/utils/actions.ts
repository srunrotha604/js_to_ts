export interface ActionItem {
  action: string;
  status: string;
  label: string;
  confirm?: boolean;
  reject?: boolean;
}

export const actions: Record<string, ActionItem[]> = {
  Draft: [
    {
      action: 'submitted',
      status: 'Submitted',
      label: 'Submit',
      confirm: true,
    },
    {
      action: 'submitted',
      status: 'Deleted',
      label: 'Delete',
      confirm: true,
      reject: true,
    },
  ],
  Submitted: [
    { action: 'approved', status: 'Approved', label: 'Approve', confirm: true },
    {
      action: 'bmRejected',
      status: 'BM-Rejected',
      label: 'Reject',
      reject: true,
    },
  ],
  Submitted_Deleted: [
    { action: 'approved', status: 'Approved', label: 'Approve', confirm: true },
    {
      action: 'bmRejected',
      status: 'BM-Rejected',
      label: 'Reject',
      reject: true,
    },
  ],
  Approved: [
    {
      action: 'confirmed',
      status: 'Confirmed',
      label: 'Confirm',
      confirm: true,
    },
    {
      action: 'driRejected',
      status: 'DRI-Rejected',
      label: 'Reject',
      reject: true,
    },
  ],
  Approved_Deleted: [
    {
      action: 'confirmed',
      status: 'Confirmed',
      label: 'Confirm',
      confirm: true,
    },
    {
      action: 'driRejected',
      status: 'DRI-Rejected',
      label: 'Reject',
      reject: true,
    },
  ],
  'BM-Rejected': [
    {
      action: 'draft',
      status: 'BM-Rejected-Draft',
      label: 'Draft',
      confirm: true,
    },
    {
      action: 'submitted',
      status: 'Deleted',
      label: 'Delete',
      confirm: true,
      reject: true,
    },
  ],
  'DRI-Rejected': [
    {
      action: 'draft',
      status: 'DRI-Rejected-Draft',
      label: 'Draft',
      confirm: true,
    },
    {
      action: 'submitted',
      status: 'Deleted',
      label: 'Delete',
      confirm: true,
      reject: true,
    },
  ],
};
