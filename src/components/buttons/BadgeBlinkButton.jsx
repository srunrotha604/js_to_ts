import { fetchData } from '../../services/$service';
import Modal, { useModal } from '../common/modal';
import CancelButton from './CancelButton';
import DeleteButton from './DeleteButton';
import { toast } from 'react-toastify';

const BadgeBlinkButton = (props) => {
  // class: bg-blue,bg-azure,bg-indigo,bg-purple,bg-pink,bg-red,bg-orange,bg-yellow,bg-lime,bg-green,bg-teal,bg-cyan
  const { label, style, value, uuid, onClick, api } = props;
  const { modalRef, openModal, closeModal } = useModal();
  const actionHandleClick = () => {
    const data = {
      uuid: uuid,
    };
    fetchData(api, data, 'Post').then((res) => {
      if (res?.status === 200) {
        onClick();
        closeModal();
        toast.success(res?.data?.message);
      }
    });
  };
  return (
    <>
      <Modal ref={modalRef} title={'Action Confirm?'} size="sm">
        <h4 className="text-wrap">{`Are your sure to active " ${value}"?`}</h4>
        <div className="btn-list d-flex justify-content-around">
          <DeleteButton
            onClick={() => {
              actionHandleClick();
            }}
            Tooltip="Save change"
          />
          <CancelButton onClick={() => closeModal()} />
        </div>
      </Modal>
      <button
        className="btn position-relative"
        onClick={() => {
          openModal();
        }}
      >
        {label}
        <span className={`badge ${style} badge-notification badge-blink`} />
      </button>
    </>
  );
};

export default BadgeBlinkButton;
