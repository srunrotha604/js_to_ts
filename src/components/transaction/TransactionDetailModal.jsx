import { forwardRef } from "react";
import Modal from "../common/modal";
import TransactionDetail from "./TransactionDetail";

// eslint-disable-next-line react/display-name
const TransactionDetailModal = forwardRef(
  ({ data, actions, children }, ref) => {
    const {
      status,
      inputDateTime,
      firstName,
      sureName,
      telNo,
      position,
      dateOfBirth,
      nation,
      nicPassport,
      physicalCard,
      productCode,
      policies,
      inputCompany,
      inputBranch,
      inputter,
      transactionNumber,
      productName,
      gender,
      remark,
      projectName,
      deleted,
      policyName,
      customerId,
      openingDate,
      parentId,
    } = data || {};

    return (
      <Modal
        size="lg"
        title={"Transaction Detail"}
        ref={ref}
        bodyClassName="px-3 py-2 pb-3"
        headerClassName="px-4"
        actions={actions}
      >
        <TransactionDetail
          transactionNumber={transactionNumber}
          status={status}
          inputDateTime={inputDateTime}
          firstName={firstName}
          sureName={sureName}
          telNo={telNo}
          position={position}
          dateOfBirth={dateOfBirth}
          nation={nation}
          nicPassport={nicPassport}
          physicalCard={physicalCard}
          remark={remark}
          productCode={productCode}
          policies={policies}
          inputCompany={inputCompany}
          inputBranch={inputBranch}
          inputter={inputter}
          productName={productName}
          gender={gender}
          projectName={projectName}
          deleted={deleted}
          customerId={customerId}
          parentId={parentId}
          policyName={policyName}
          openingDate={openingDate}
        >
          {children}
        </TransactionDetail>
      </Modal>
    );
  },
);

export default TransactionDetailModal;
