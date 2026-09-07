import DeleteButton from "../buttons/DeleteButton";
import CancelButton from "../buttons/CancelButton";
import Modal, { useModal } from "../common/modal";

const TableCellStatus = (props) => {
  const { onClick, statusOnClick, status } = props;
  const { modalRef, openModal, closeModal } = useModal();
  return (
    <td>
      <Modal ref={modalRef} title={"Status Confirm?"} size="sm">
        <h4 className="mb-4">Are your sure change status?</h4>
        <div className="btn-list d-flex justify-content-end">
          <DeleteButton
            onClick={() => {
              statusOnClick();
              closeModal();
            }}
          />
          <CancelButton onClick={closeModal} />
        </div>
      </Modal>
      <>
        <a
          className="cursor-pointer table-cell-icon-action"
          data-tooltip-id="delete-tooltip"
          data-tooltip-content="Status"
          onClick={() => (onClick, openModal())}
        >
          {status === "Active" ? (
            <td className="text-primary">{status}</td>
          ) : (
            <td className="text-danger">{status}</td>
          )}
        </a>
      </>
    </td>
  );
};

export default TableCellStatus;
