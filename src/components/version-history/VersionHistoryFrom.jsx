import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Modal, { useModal } from '../../components/common/modal';
import CustomDatePicker from '../../components/form/CustomDatePicker';
import { useAuth } from '../../context/AuthContext';
import { createNewVersion } from '../../pages/version-history/versionexport';

const VersionHistoryForm = ({ onCreated }) => {
  const { modalRef, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  document.title = 'Alt-Fa APIs Admin System | System user-company';

  useEffect(() => {
    const handleFocusIn = (e) => {
      if (e.target.closest('[data-tabler-disable-focus]')) e.stopPropagation();
    };
    document.addEventListener('focusin', handleFocusIn, true);
    return () => document.removeEventListener('focusin', handleFocusIn, true);
  }, []);

  const onSubmit = async (formData) => {
    if (!selectedDate) {
      toast.error('Release Date is required');
      return;
    }

    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    const pad = (n) => n.toString().padStart(2, '0');
    const releaseDateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

    try {
      setSubmitting(true);
      const data = await createNewVersion({
        releaseDate: releaseDateStr,
        version: formData.version,
        description: formData.description,
      });

      toast.success('Version created successfully!');
      closeModal();
      reset();
      setSelectedDate(null);

      window.dispatchEvent(new Event('versionUpdated'));

      if (onCreated) {
        onCreated({
          version: formData.version,
          description: formData.description,
          releaseDate: releaseDateStr,
        });
      }
    } catch (error) {
      toast.error('Failed to create version');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal ref={modalRef} title="Create Version" size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container defult-background">
            <div className="row mb-3">
              <div className="col">
                <label className="form-label required">Release Date:</label>
                <div data-tabler-disable-focus>
                  <CustomDatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    required={true}
                  />
                </div>
              </div>
              <div className="col">
                <label className="form-label required">Version:</label>
                <input
                  type="text"
                  {...register('version', { required: true })}
                  className="form-control"
                  placeholder="Version"
                />
                {errors.version && (
                  <span className="text-danger">Version is required</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea
                {...register('description')}
                className="form-control"
                placeholder="Description"
                rows="11"
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary me-2" disabled={submitting}>
                {submitting ? 'Saving...' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeModal}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <button className="btn btn-primary" onClick={openModal}>
        Create Version
        <span className="badge badge-notification badge-blink" />
      </button>
    </>
  );
};

export default VersionHistoryForm;
