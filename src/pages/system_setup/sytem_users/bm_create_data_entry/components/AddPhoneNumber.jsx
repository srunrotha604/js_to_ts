import { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { toast } from 'react-toastify';
import ButtonGroup from '../../../../../components/buttons/ButtonGroup';
import CancelButton from '../../../../../components/buttons/CancelButton';
import SubmitButton from '../../../../../components/Buttons/SubmitButton';
import Modal, { useModal } from '../../../../../components/common/modal';
import { fetchDataAsync } from '../../../../../services/$service';
import { ROUTE_API } from '../../../../../utils/route-util';

const AddPhoneNumber = (props) => {
  const { item, success } = props;
  const { modalRef, openModal, closeModal } = useModal();
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    try {
      const data = {
        uuid: item?.userCode,
        phoneNumber: phone,
      };
      await fetchDataAsync(ROUTE_API.eChanelDataEntryAddPhoneNumber, {
        data,
        method: 'post',
      });
      toast.success('Success!');
      success();
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Modal ref={modalRef} title={'Add Phone Number'} size="lg">
        <div className="mb-3">
          <label className="form-label">Phone number</label>
          <PatternFormat
            cursor="pointer"
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
          openModal(), setPhone(item?.phone);
        }}
      >
        {item?.phone == '' ? '+ Add phone number' : item?.phone}
      </span>
    </>
  );
};

export default AddPhoneNumber;
