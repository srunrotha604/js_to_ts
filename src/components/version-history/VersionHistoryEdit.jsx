import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Modal, { useModal } from '../common/modal';
import { updateVersion, deleteVersion } from '../../pages/version-history/versionexport';

const VersionHistoryEdit = ({ version, onClose, onDeleted, onUpdated }) => {
  const { modalRef, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      version: '',
      description: '',
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => openModal(), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (version?.uuid) {
      reset({
        version: version.version || '',
        description: version.description || '',
      });
      if (version.releaseDate) {
        setSelectedDate(new Date(version.releaseDate));
      }
    }
  }, [version, reset]);

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const dateObj =
        selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

      const payload = {
        uuid: version.uuid,
        releaseDate: dateObj,
        version: formData.version,
        description: formData.description,
      };

      const res = await updateVersion(payload);
      toast.success(res?.message || 'Version updated successfully!');

      const updatedData = {
        ...version,
        ...payload,
        ...(res?.data || {}),
      };

      onUpdated?.(updatedData);

      closeModal();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error updating version.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    try {
      setSubmitting(true);
      const res = await deleteVersion({ uuid: version.uuid });
      toast.success('Version deleted successfully!');
      onDeleted?.(version.uuid);
      closeModal();
      onClose();
    } catch (error) {
      toast.error('Error deleting version.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!version?.uuid) return null;

  return (
    <Modal ref={modalRef} title="Detail Version" size="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container defult-background">
          <div className="row mb-3">
            <div className="col">
              <label>Release Date:</label>
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showYearDropdown
                showMonthDropdown
                shouldCloseOnSelect
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a Date"
                readOnly
              />
            </div>
            <div className="col">
              <label>Version:</label>
              <input
                type="text"
                {...register('version', { required: true })}
                className="form-control"
                placeholder="Version"
                readOnly
              />
              {errors.version && (
                <span className="text-danger">Version is required</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label>Description:</label>
            <textarea
              {...register('description')}
              className="form-control"
              placeholder="Description"
              rows="12"
              readOnly
            />
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <div>
              {/* <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update'}
              </button> */}

              <button
                type="button"
                className="btn btn-danger"
                onClick={onDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default VersionHistoryEdit;
