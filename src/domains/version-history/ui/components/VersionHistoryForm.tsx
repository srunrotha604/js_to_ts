import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CustomDatePicker from '../../../../components/form/CustomDatePicker';
import Modal, { useModal } from '../../../../components/common/modal';
import type { VersionItem } from '../../entities';
import { createVersion } from '../../interface-adapters';
import { formatReleaseDate } from '../../use-cases';

interface VersionFormValues {
  version: string;
  description: string;
}
interface VersionHistoryFormProps {
  onCreated?: (version: Omit<VersionItem, 'uuid'>) => void;
}

const VersionHistoryForm = ({ onCreated }: VersionHistoryFormProps) => {
  const { modalRef, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VersionFormValues>();

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).closest('[data-tabler-disable-focus]')) {
        e.stopPropagation();
      }
    };
    document.addEventListener('focusin', handleFocusIn, true);
    return () => document.removeEventListener('focusin', handleFocusIn, true);
  }, []);

  const onSubmit = async (formData: VersionFormValues) => {
    if (!selectedDate) {
      toast.error('Release Date is required');
      return;
    }

    const releaseDateStr = formatReleaseDate(new Date(selectedDate));

    try {
      setSubmitting(true);
      await createVersion({
        releaseDate: releaseDateStr,
        version: formData.version,
        description: formData.description,
      });

      toast.success('Version created successfully!');
      closeModal();
      reset();
      setSelectedDate(null);

      window.dispatchEvent(new Event('versionUpdated'));

      onCreated?.({
        version: formData.version,
        description: formData.description,
        releaseDate: releaseDateStr,
      });
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
                rows={11}
              />
            </div>

            <div className="text-end">
              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={submitting}
              >
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
