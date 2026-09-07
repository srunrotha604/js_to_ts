// components/VersionButton.jsx
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { fetchDataAsync } from '../services/$service'; // adjust the path if needed

const VersionButton = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const getVersion = async () => {
      try {
        const res = await fetchDataAsync('/application-version/active');
        setVersion(res.data?.list?.[0]?.version || '');
      } catch (err) {
        console.error("Error fetching version:", err);
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
