import { toast } from 'react-toastify';

export const toastPromise = (promise) =>
  toast.promise(promise, {
    pending: 'Saving...',
    success: 'Saved successfully!',
    error: 'Something went wrong!',
  });
