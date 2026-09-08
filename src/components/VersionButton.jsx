// components/VersionButton.jsx
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchDataAsync } from '../services/$service'; // adjust the path if needed
import { ROUTE_API } from '../utils/route-util';

const VersionButton = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const getVersion = async () => {
      try {
        const res = await fetchDataAsync(ROUTE_API.applicationVersionActive);
        setVersion(res.data?.list?.[0]?.version || '');
      } catch (err) {
        console.error('Error fetching version:', err);
      }
    };
    getVersion();
  }, []);

  return version ? (
    <Typography variant="body2" color="textPrimary">
      Version {version}
    </Typography>
  ) : null;
};

export default VersionButton;
