import React, { useState, useEffect } from 'react';
import Modal from '../components/common/modal';
import IssueDateDetailModal from './IssueDateDetailModal';
import { fetchDataAsync } from '../services/$service';

const IssueDateModal = ({ open, closeModal, modalRef, item, onStatusChange, arrCustomer, onUpdate }) => {
  const [issueStatus, setIssueStatus] = useState(null);
  const [showDetailIssueModal, setShowDetailIssueModal] = useState(false);
  const [remark, setRemark] = useState(''); // 🆕 Add dynamic remark state

  const hasIssueDate = !!item?.customerIssueDate?.issueDate;
  const datalist = item?.issueDateStatus;

  useEffect(() => {
    if (open) {
      setIssueStatus(item?.issueDateStatus ?? null);

      // Optionally get a default remark from the item
      const existingRemark = item?.customerIssueDate?.remark || '';
      setRemark(existingRemark);
    }
  }, [item, open]);

  const updateCardConfirmation = async (status) => {
    const secureCode = item?.customerIssueDate?.secureCode;
    
    if (!secureCode) return;

    try {
      const response = await fetchDataAsync('/operation-customer/card-confirmation', {
        method: 'PUT',
        data: {
          secureCode,
          remark: remark || '',
          status,
        },
      });

      if (response?.status === 200) {
        onStatusChange?.(status);

        if (typeof onUpdate === 'function') {
          const cardNumber = item?.customerIssueDate?.cardNumber;
          if (cardNumber) {
            onUpdate(cardNumber);
          }
        }
      } else {
        console.error('Update failed:', response?.data?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error during update:', err.message);
    }
  };

  const handleYes = async () => {
    await updateCardConfirmation('confirm');
    setIssueStatus(true);
    closeModal();
    setTimeout(() => setShowDetailIssueModal(true), 150);
  };

  const handleNo = async () => {
    await updateCardConfirmation('cancel');
    setIssueStatus(false);
    closeModal();
  };

  return (
    <>
      {open && (
        <Modal ref={modalRef} title="Date of Issue Card" closeButton onClose={closeModal}>
          <div>
            {hasIssueDate ? (
              <>
                <div className="mb-3 pb-1">
                  <p>Would you like to receive this issue card?</p>
                  <label className="form-label">Remark:</label>
                  <textarea
                    className="form-control"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={3}
                    placeholder="Enter a remark..."
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={handleNo}>No</button>
                  <button className="btn btn-primary" onClick={handleYes}>Yes</button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <p>No issue date is available for this card.</p>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {showDetailIssueModal && (
        <IssueDateDetailModal
          key="issue-detail-modal"
          open={showDetailIssueModal}
          onClose={() => setShowDetailIssueModal(false)}
          item={item}
          arrCustomer={arrCustomer}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
};

export default IssueDateModal;
