// import axios from 'axios';
// import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import ApproveRejectConfirmationModal from '../../../../components/common/ActionConfirmationModal';
// import Button from '../../../../components/common/Button';
// import Modal, { useModal } from '../../../../components/common/modal/index';
// import Spinner, { useSpinner } from '../../../../components/common/Spinner';
// import type { TransactionTabListHandle } from '../../../../components/transaction/TransactionTable';
// import { useAuth } from '../../../../context/AuthContext';
// import { delay } from '../../../../utils/delay';
// import { pluralize } from '../../../../utils/pluralize';
// import { ROUTE_PATH } from '../../../../utils/route-util';
// import type { TransactionTotalCounts } from '../../../customer/entities';
// import { STATUS } from '../../../customer/entities';
// import {
//   fetchCustomerTransactionList,
//   useTransactionTabSelect,
// } from '../../../customer/interface-adapters';
// import ComponentStatus from '../../../customer/ui/components/ComponentStatus';
// import CustomerBatchProcessModal from '../../../customer/ui/components/transaction-table/CustomerBatchProcessModal';
// import CustomerTransactionSelect from '../../../customer/ui/components/transaction-table/CustomerTransactionSelect';
// import CustomerTransactionTable from '../../../customer/ui/components/transaction-table/CustomerTransactionTable';
// import { getConfirmedMessageText } from '../../../customer/use-cases/get-confirm-message-text';
// import { isTransactionStatusCountChanged } from '../../../customer/use-cases/transaction-status-tracking';
// import { actions } from '../../../customer/use-cases/workflow-actions';
// import { processCustomerTransactions } from '../../interface-adapters';

// const HomePage = () => {
//   document.title = 'E-CHANNEL PORTAL | Home';

//   const { hasPermissionAccessTransaction, isUserDRIAdmin } = useAuth();
//   const navTab = useMemo(
//     () => [
//       {
//         label: STATUS.All,
//         status: STATUS.All,
//         getTotal: (total?: TransactionTotalCounts) => total?.total,
//       },
//       {
//         label: STATUS.Draft,
//         status: STATUS.Draft,
//         getTotal: (total?: TransactionTotalCounts) => total?.draft,
//         hidden: !hasPermissionAccessTransaction('draft'),
//       },
//       {
//         label: STATUS.Submitted,
//         status: STATUS.Submitted,
//         getTotal: (total?: TransactionTotalCounts) => total?.submitted,
//         hidden: !hasPermissionAccessTransaction('submitted'),
//       },
//       {
//         label: STATUS.Approved,
//         status: STATUS.Approved,
//         getTotal: (total?: TransactionTotalCounts) => total?.approved,
//         hidden: !hasPermissionAccessTransaction('approved'),
//       },
//       {
//         label: STATUS.BM_Rejected,
//         status: STATUS.BM_Rejected,
//         getTotal: (total?: TransactionTotalCounts) => total?.bmReject,
//         hidden: !hasPermissionAccessTransaction('bmRejected'),
//       },
//       {
//         label: STATUS.Confirmed,
//         status: STATUS.Confirmed,
//         type: 'Single,Batch',
//         getTotal: (total?: TransactionTotalCounts) => total?.confirmed,
//         hidden: !hasPermissionAccessTransaction('confirmed'),
//       },
//       {
//         label: STATUS.DRI_Rejected,
//         status: STATUS.DRI_Rejected,
//         getTotal: (total?: TransactionTotalCounts) => total?.driReject,
//         hidden: !hasPermissionAccessTransaction('driRejected'),
//       },
//       {
//         label: 'Deleted-END',
//         status: STATUS.Confirmed_Deleted,
//         type: 'Delete',
//         getTotal: (total?: TransactionTotalCounts) => total?.confirmedDeleted,
//         hidden: !hasPermissionAccessTransaction('confirmed'),
//       },
//     ],
//     [hasPermissionAccessTransaction]
//   );

//   const {
//     handleSelectTransaction,
//     handleRemoveCustomerFromList,
//     handleSelectAllInCurrentList,
//     resetSelectedTransaction,
//     isSelectedAllInCurrentList,
//     isSelectedItem,
//     selectedTransaction,
//     resetSelected,
//     selectedAll,
//     setSelectedAll,
//     selectedCustomerList,
//     setSelectedCustomerList,
//     selectDeletedTransaction,
//   } = useTransactionTabSelect();

//   const getSelectedCustomerList = async () => {
//     try {
//       const data = await fetchCustomerTransactionList({
//         transaction: selectedTransaction.join(','),
//         pageSize: selectedTransaction.length,
//       });
//       setSelectedCustomerList(data?.list ?? []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [searchParams] = useSearchParams();
//   const { hasPermissionProccessTransaction } = useAuth();
//   const { closeModal, openModal, modalRef, open } = useModal();

//   const [isApprove, setIsApprove] = useState<boolean | null>(null);
//   const [processStatus, setProcessStatus] = useState<string | null>(null);
//   const {
//     closeModal: closeActionModal,
//     openModal: openActionModal,
//     modalRef: actionModalRef,
//   } = useModal();

//   const { spinnerState, openSpinner, closeSpinner } = useSpinner();
//   const handleProcessSelected = async () => {
//     openSpinner({ title: 'Loading...' });
//     await getSelectedCustomerList();
//     delay([closeSpinner, openModal]);
//   };

//   const tabListRef = useRef<TransactionTabListHandle | null>(null);
//   const handleProcess = async (rejectRemark?: string) => {
//     try {
//       closeActionModal();
//       openSpinner({ title: 'Processing...' });
//       const summaryData: {
//         transaction: string[];
//         status: string | null;
//         remark?: string;
//       } = {
//         transaction: selectedTransaction,
//         status: processStatus,
//       };

//       const isDeleted = selectDeletedTransaction;

//       if (rejectRemark) {
//         summaryData.remark = rejectRemark;
//       }

//       await processCustomerTransactions(summaryData, isDeleted);

//       toast.success(
//         `${selectedCustomerList.length} ${pluralize(
//           'transaction',
//           selectedCustomerList.length
//         )} has been ${processStatus}!`
//       );
//       tabListRef.current?.getList();
//       resetSelected();
//       delay([closeSpinner, closeModal]);
//     } catch (error) {
//       toast.error(
//         axios.isAxiosError(error) ? error.response?.data?.message : undefined
//       );
//       delay(closeSpinner);
//     }
//   };
//   useEffect(() => {
//     if (open && selectedCustomerList.length <= 0) {
//       closeModal();
//       resetSelected();
//     }
//   }, [selectedCustomerList]);

//   const {
//     modalRef: popupInfoModalRef,
//     openModal: openPopupInfoModal,
//     closeModal: closePopupInfoModal,
//     data: popupInfoData,
//   } = useModal<TransactionTotalCounts>();

//   return (
//     <div
//       className="container-xl full-height-dashboard-container overflow-auto"
//       style={{ height: '0', overflow: 'hidden', display: 'flex' }}
//     >
//       <CustomerTransactionTable
//         tab={navTab}
//         onFetchSuccess={(data: {
//           data?: { total?: TransactionTotalCounts[] };
//         }) => {
//           const transactionTotal = data?.data?.total?.[0] ?? {};
//           if (!isUserDRIAdmin) {
//             const isChanged = isTransactionStatusCountChanged(
//               'driReject',
//               transactionTotal as Record<string, number>
//             );

//             if (isChanged) {
//               openPopupInfoModal(transactionTotal);
//             }
//           }
//         }}
//         ref={tabListRef}
//         typeFilter={({ tabStatus }: { tabStatus: string }) => {
//           return (
//             [STATUS.Confirmed, STATUS.Confirmed_Deleted].includes(tabStatus) ===
//             false
//           );
//         }}
//         renderExtraFilter={({ tabStatus }: { tabStatus: string }) => {
//           return (
//             <div
//               style={{ flex: 1 }}
//               className="btn-list mx-2 align-items-center"
//             >
//               {tabStatus !== STATUS.All && (
//                 <>
//                   <CustomerTransactionSelect
//                     title="Click to Process Selected"
//                     disableSelectAll
//                     onClick={handleProcessSelected}
//                     isSelectedAll={selectedAll}
//                     onClearSelect={resetSelectedTransaction}
//                     onSelectAll={setSelectedAll}
//                     totalSelected={selectedTransaction?.length}
//                   />
//                 </>
//               )}
//             </div>
//           );
//         }}
//         enableCheckbox={({ tabStatus }: { tabStatus: string }) => {
//           if (!actions[tabStatus]) return false;

//           return actions[tabStatus].some((action) =>
//             hasPermissionProccessTransaction(action.action)
//           );
//         }}
//         onTabChange={resetSelectedTransaction}
//         handleSelectAllInCurrentList={handleSelectAllInCurrentList}
//         handleSelectItem={handleSelectTransaction}
//         isSelectedItem={isSelectedItem}
//         isSelectedAllInCurrentList={isSelectedAllInCurrentList}
//       />
//       <div>
//         <ApproveRejectConfirmationModal
//           key={selectedTransaction?.join(',')}
//           closeModal={closeActionModal}
//           modalRef={actionModalRef}
//           isApprove={isApprove}
//           confirmMessageText={getConfirmedMessageText({
//             status: processStatus,
//             selectedCustomerList,
//           })}
//           onApprove={handleProcess}
//           onReject={handleProcess}
//         />
//         <CustomerBatchProcessModal
//           loading={spinnerState.loading}
//           data={{
//             selectedCustomerList,
//             tabStatus: searchParams.get('status'),
//           }}
//           handleRemoveCustomer={handleRemoveCustomerFromList}
//           closeModal={closeModal}
//           ref={modalRef}
//           actions={actions[
//             `${searchParams.get('status') ?? STATUS.Confirmed}${
//               selectDeletedTransaction ? '_Deleted' : ''
//             }`
//           ]?.map(
//             (action) =>
//               hasPermissionProccessTransaction(action.action) && (
//                 <Button
//                   variant={action.reject ? 'danger' : 'primary'}
//                   key={action.status}
//                   onClick={() => {
//                     setIsApprove(action.confirm ?? false);
//                     setProcessStatus(action.status);
//                     openActionModal();
//                   }}
//                 >
//                   {action.label}
//                 </Button>
//               )
//           )}
//         />
//         <Spinner {...spinnerState} />
//         <PopupInfo
//           data={popupInfoData}
//           onClose={closePopupInfoModal}
//           ref={popupInfoModalRef}
//         />
//       </div>
//     </div>
//   );
// };

// interface PopupInfoProps {
//   data: TransactionTotalCounts | null;
//   onClose: () => void;
// }

// const PopupInfo = forwardRef<HTMLDivElement, PopupInfoProps>(
//   ({ data, onClose }, ref) => {
//     const navigate = useNavigate();
//     return (
//       <Modal
//         size="sm"
//         title={'Task Reminder'}
//         bodyClassName="d-flex flex-column pt-3 pb-3"
//         content={
//           <>
//             <div
//               style={{
//                 fontSize: '22px',
//                 display: 'inline-flex',
//                 justifyContent: 'center',
//                 marginBottom: '18px',
//               }}
//             >
//               <ComponentStatus status="DRI-Rejected" />
//               <span style={{ margin: '0 6px' }}>
//                 {`( ${data?.driReject} )`}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//               <Button
//                 onClick={() => {
//                   navigate(
//                     `${ROUTE_PATH.dashboard}?status=${STATUS.DRI_Rejected}`
//                   );
//                   onClose();
//                 }}
//               >
//                 View
//               </Button>
//             </div>
//           </>
//         }
//         ref={ref}
//       ></Modal>
//     );
//   }
// );

// export default HomePage;
const HomePage = () => {
  return <div>Hello</div>;
};
export default HomePage;
