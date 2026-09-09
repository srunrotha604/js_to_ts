import axios from 'axios';
import { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { toast } from 'react-toastify';
import ButtonGroup from '../../../../components/buttons/ButtonGroup';
import CancelButton from '../../../../components/buttons/CancelButton';
import SubmitButton from '../../../../components/buttons/SubmitButton';
import Modal, { useModal } from '../../../../components/common/modal';
import { buildAddPhoneNumberDto } from '../../use-cases';

interface AddPhoneNumberModalItem {
  userCode?: string;
  phone?: string;
}

interface AddPhoneNumberModalProps {
  item: AddPhoneNumberModalItem;
  success: () => void;
  onSubmit: (data: { uuid?: string; phoneNumber: string }) => Promise<unknown>;
}

const AddPhoneNumberModal = ({
  item,
  success,
  onSubmit,
}: AddPhoneNumberModalProps) => {
  const { modalRef, openModal, closeModal } = useModal();
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    try {
      await onSubmit(buildAddPhoneNumberDto(item?.userCode, phone));
      toast.success('Success!');
      success();
      closeModal();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message);
      console.log(message);
    }
  };

  return (
    <>
      <Modal ref={modalRef} title={'Add Phone Number'} size="lg">
        <div className="mb-3">
          <label className="form-label">Phone number</label>
          <PatternFormat
            type="text"
            className="form-control"
            placeholder="### ## ## ## #"
            onChange={(e) => setPhone(e?.target?.value)}
            value={phone}
            required
            max={10}
            format="### ## ## ## #"
          />
        </div>

        <ButtonGroup>
          <SubmitButton tooltip="Submit" onClick={() => handleSubmit()} />
          <CancelButton tooltip="Cancel" onClick={() => closeModal()} />
        </ButtonGroup>
      </Modal>
      <span
        className="badge bg-azure"
        onClick={() => {
          openModal(), setPhone(item?.phone ?? '');
        }}
      >
        {item?.phone == '' ? '+ Add phone number' : item?.phone}
      </span>
    </>
  );
};

export default AddPhoneNumberModal;
