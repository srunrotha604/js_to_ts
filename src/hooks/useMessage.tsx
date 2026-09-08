import { toast } from 'react-toastify';

interface ApiResponseLike {
  data?: { message?: string };
  message?: string;
}

interface ApiErrorLike {
  status?: number;
  message?: string;
  data?: { message?: string };
  response?: {
    status?: number;
    data?: { message?: string };
  };
}

const useMessage = () => {
  const showSuccessResponseMessage = (response: unknown) => {
    const res = response as ApiResponseLike;
    toast.success(res?.data?.message || res?.message || 'Success');
  };

  const showErrorResponseMessage = (error: unknown) => {
    console.log('response', error);
    const err = error as ApiErrorLike;
    if (err?.status === 401 || err?.response?.status === 401) {
      toast.error('Session expired, please login again');
      return;
    }
    toast.error(
      err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        'Something Wrong'
    );
  };

  return {
    showSuccessResponseMessage,
    showErrorResponseMessage,
  };
};

export default useMessage;
