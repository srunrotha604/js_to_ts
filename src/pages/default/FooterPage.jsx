import { useAuth } from '../../context/AuthContext';
import { contactUs } from '../../utils/contact';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDataAsync } from '../../services/$service';
import { getCurrentVersion } from '../../pages/version-history/versionexport';

const FooterPage = () => {
  const navigate = useNavigate();
  const [version, setVersion] = useState('');
  const { user } = useAuth();
  const VersionButton = () => {
    navigate('/dashboard/version');
  }

  const loadVersion = async () => {
    try {
      const res = await getCurrentVersion();
      const newVersion = res?.data?.version || res?.version || '';
      setVersion(newVersion);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  // useEffect(() => {
  //   if (!user) return;
  //   loadVersion();

  //   const handleVersionUpdated = () => {
  //     loadVersion();
  //   };

  //   window.addEventListener('versionUpdated', handleVersionUpdated);

  //   return () => {
  //     window.removeEventListener('versionUpdated', handleVersionUpdated);
  //   };
  // }, [user]);

  useEffect(() => {
    if (user) {
      loadVersion();
    }

    const handleVersionUpdated = () => {
      if (user) loadVersion();
    };

    window.addEventListener('versionUpdated', handleVersionUpdated);

    return () => {
      window.removeEventListener('versionUpdated', handleVersionUpdated);
    };
  }, [user]);

  return (
    <footer className="footer footer-transparent d-print-none py-1">
      <div className="container-xl">
        <div className="row text-center align-items-center">
          {/* <div className="col-lg-auto ms-lg-auto">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                <a href="./docs/index.html" className="link-secondary">
                  Documentation
                </a>
              </li>
              <li className="list-inline-item">
              <a href="./license.html" className="link-secondary">
                  License
                </a>
              </li>
            </ul>
          </div> */}
          <div className="col-12 col-md-6 d-flex justify-content-md-start">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                Copyright © 2022
                <span className="link-secondary">
                  {` ${user?.companyName || 'E-CHANNEL PORTAL'} `}
                </span>
                All rights reserved
              </li>
              {version && (
                <div className="list-inline-item pointer" onClick={VersionButton}>
                  <span style={{ fontSize: '14px', cursor: 'pointer' }}>
                    Version {version}
                  </span>
                </div>
              )}
            </ul>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end">
            <div className="mb-0 text-primary text-left">
              <div className="my-1">
                Customer Support : {contactUs.customerService?.phone?.[0]}
              </div>
              <div className="mb-1">
                Technical Support : {contactUs.technicalSupport?.phone?.[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterPage;
