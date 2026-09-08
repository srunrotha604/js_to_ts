import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { fetchDataAsync } from '../../../services/$service';
import ButtonGroup from '../../buttons/ButtonGroup';
import CancelButton from '../../buttons/CancelButton';
import SubmitButton from '../../buttons/SubmitButton';
import Modal, { useModal } from '../../common/modal';

const TableCellTextDeleteConfirm = (props) => {
  const { success, route, title, message, data } = props;
  const { modalRef, openModal, closeModal } = useModal();
  const { showErrorResponseMessage } = useMessage();

  const onSubmit = async () => {
    try {
      await fetchDataAsync(route, {
        data,
        method: 'delete',
      });
      toast.success('Success!');
      closeModal();
      success();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    }
  };
  return (
    <>
      <Modal ref={modalRef} title={title} size="sm">
        <label className="mb-3">{message}</label>
        <ButtonGroup>
          <SubmitButton tooltip="Submit" onClick={() => onSubmit()} />

          <CancelButton tooltip="Cancel" onClick={() => closeModal()} />
        </ButtonGroup>
      </Modal>
      <span
        className="text-danger t-udl"
        onClick={() => {
          openModal();
        }}
      >
        Delete
      </span>
    </>
  );
};

export default TableCellTextDeleteConfirm;
