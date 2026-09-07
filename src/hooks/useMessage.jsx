import { toast } from 'react-toastify';

const useMessage = () => {
  const showSuccessResponseMessage = (response) => {
    toast.success(response?.data?.message || response?.message || 'Success');
  };

  const showErrorResponseMessage = (error) => {
    console.log('response', error);
    if (error?.status === 401 || error?.response?.status === 401) {
      toast.error('Session expired, please login again');
      return;
    }
    toast.error(
      error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        'Something Wrong'
    );
  };

  return {
    showSuccessResponseMessage,
    showErrorResponseMessage,
  };
};

export default useMessage;
