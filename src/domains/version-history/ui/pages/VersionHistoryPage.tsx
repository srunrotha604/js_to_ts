import axios from 'axios';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from '../../../../utils/route-util';
import type { VersionItem } from '../../entities';
import { fetchVersionList } from '../../interface-adapters';
import { formatVersionDescription } from '../../use-cases';
import VersionHistoryEdit from '../components/VersionHistoryEdit';
import VersionHistoryForm from '../components/VersionHistoryForm';

const VersionHistoryPage = () => {
  const [editItem, setEditItem] = useState<VersionItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [versionList, setVersionList] = useState<VersionItem[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigate = useNavigate();
  const getList = async () => {
    try {
      const response = await fetchVersionList();
      if (response?.status === 200) {
        const data = response.data;
        setVersionList(data?.list || []);
      } else if (response?.list) {
        setVersionList(response.list || []);
      } else {
        toast.warning('No data found.');
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(error.response.data?.message || 'Bad Request');
        } else if (error.response?.status === 403) {
          toast.error(error.response.data || 'Forbidden');
        } else if (error.response?.status === 404) {
          navigate(ROUTE_PATH.notFound);
        } else {
          toast.error('Failed to load configuration.');
        }
      } else {
        toast.error('Failed to load configuration.');
      }
    }
  };

  useEffect(() => {
    getList();
  }, [refreshFlag]);

  const handleOpenEdit = (version: VersionItem) => {
    setShowModal(false);
    setTimeout(() => {
      setEditItem(version);
      setShowModal(true);
    }, 0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleNewVersionAdded = () => {
    setRefreshFlag((prev) => !prev);
  };

  const handleVersionDeleted = (deletedUuid: string) => {
    setVersionList((prev) => prev.filter((v) => v.uuid !== deletedUuid));
  };

  const handleVersionUpdated = (updatedVersion: VersionItem) => {
    setVersionList((prev) =>
      prev.map((v) =>
        v.uuid === updatedVersion.uuid ? { ...v, ...updatedVersion } : v
      )
    );

    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="container p-4 mt-3 defult-background">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>Version History</h2>
        <VersionHistoryForm onCreated={handleNewVersionAdded} />
      </div>
      <ul className="list-group mt-3">
        {versionList.map((item) => (
          <li key={item.uuid} className="list-group-item">
            <h5
              className="text-primary pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenEdit(item)}
            >
              {item.version}{' '}
              <small className="text-muted">
                ({new Date(item.releaseDate).toLocaleDateString()})
              </small>
            </h5>

            <ul
              className="mb-0"
              style={{ listStyleType: 'none', paddingLeft: 0 }}
            >
              {formatVersionDescription(item.description).map(
                (line, idx) => (
                  <li key={idx}>{line}</li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
      {showModal && (
        <VersionHistoryEdit
          key={editItem?.uuid || editItem?.version}
          version={editItem}
          onClose={handleCloseModal}
          onDeleted={handleVersionDeleted}
          onUpdated={handleVersionUpdated}
        />
      )}
    </div>
  );
};

export default VersionHistoryPage;
