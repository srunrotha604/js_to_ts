import React from 'react';

const useLoading = () => {
  const [loading, setLoading] = React.useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return [loading, startLoading, stopLoading, setLoading] as const;
};

export default useLoading;
