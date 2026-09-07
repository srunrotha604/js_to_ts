import { useState, useEffect } from "react";
import Modal from "../components/common/modal";
import { fetchDataAsync } from "../services/$service";

const IssueDateDetailModal = ({ open, onClose, modalRef, item }) => {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!open || !item?.customerIssueDate?.cardNumber) return;

    const fetchDetail = async () => {
      try {
        const secureCode = item.customerIssueDate?.cardNumber;
        const res = await fetchDataAsync(
          `/operation-customer/card-confirmation?secureCode=${secureCode}`
        );
        setDetail(res?.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch confirmation:", err);
      }
    };

    fetchDetail();
  }, [open, item]);

  if (!open || !item) return null;

  return (
    <Modal ref={modalRef} title="Date of Issue Card" closeButton onClose={onClose}>
      <div className="pb-1">
        <p>
          <strong className="mx-2">Insured Name:</strong>{" "}
          {`${item?.sureName || ""} ${item?.firstName || ""}`.trim()}
        </p>
        <p>
          <strong className="mx-2">Issue Date Card:</strong>
          {item?.customerIssueDate?.issueDate || "N/A"}
        </p>
        <p>
          <strong className="mx-2">Confirm by:</strong>
          {detail?.inputter || "N/A"}
        </p>
        <p>
          <strong className="mx-2">Collected on:</strong>
          {detail?.creationDate
            ? new Date(detail.creationDate)
              .toLocaleString('en-GB', {
                hour12: true,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
              .replace('am', 'AM')
              .replace('pm', 'PM')
            : "N/A"}
        </p>
        <div className="d-flex">
          <p className="mb-1 mx-2">
            <strong>Remark:</strong>
          </p>
          <p>{detail?.remark || "N/A"}</p>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IssueDateDetailModal;