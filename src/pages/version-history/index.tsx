import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VersionHistoryEdit from '../../components/version-history/VersionHistoryEdit';
import VersionHistoryForm from '../../components/version-history/VersionHistoryFrom';
import { getVersionList } from '../../pages/version-history/versionexport';
import { ROUTE_PATH } from '../../utils/route-util';

const VersionHistoryPage = () => {
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [arrProject, setArrProject] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigate = useNavigate();
  const getList = async () => {
    try {
      const response = await getVersionList();
      if (response?.status === 200) {
        const data = response.data;
        setArrProject(data?.list || []);
        setVersionList(data?.list || []);
      } else if (response?.list) {
        setArrProject(response.list || []);
        setVersionList(response.list || []);
      } else {
        toast.warning('No data found.');
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);

      if (error.response?.status === 400) {
        toast.error(error.response.data?.message || 'Bad Request');
      } else if (error.response?.status === 403) {
        toast.error(error.response.data || 'Forbidden');
      } else if (error.response?.status === 404) {
        navigate(ROUTE_PATH.notFound);
      } else {
        toast.error('Failed to load configuration.');
      }
    }
  };

  useEffect(() => {
    getList();
  }, [refreshFlag]);

  const handleOpenEdit = (version) => {
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

  const handleNewVersionAdded = (newVersion) => {
    if (!newVersion || !newVersion.uuid) {
      setRefreshFlag((prev) => !prev);
      return;
    }

    setVersionList((prev) => {
      if (prev.some((v) => v.uuid === newVersion.uuid)) return prev;
      return [newVersion, ...prev];
    });
  };

  const handleVersionDeleted = (deletedUuid) => {
    setVersionList((prev) => prev.filter((v) => v.uuid !== deletedUuid));
  };

  const handleVersionUpdated = (updatedVersion) => {
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
              {(item.description || '')
                .split(/\n|(?:\r?\n)|(?:- )/g)
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map((line, idx) => (
                  <li key={idx}>{line.endsWith('.') ? line : line + '.'}</li>
                ))}
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
