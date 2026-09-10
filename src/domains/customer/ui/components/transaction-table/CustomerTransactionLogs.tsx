import axios from 'axios';
import { forwardRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../../../components/common/Button';
import Modal from '../../../../../components/common/modal';
import { fetchDataAsync } from '../../../../../services/$service';
import { delay } from '../../../../../utils/delay';
import { ROUTE_API } from '../../../../../utils/route-util';
import ComponentStatus from '../ComponentStatus';
interface ShowLogsButtonProps {
  onClick?: () => void;
  variant?: string;
}
export const ShowLogsButton = ({ onClick, variant }: ShowLogsButtonProps) => {
  return (
    <Button onClick={onClick} variant={variant} size={'sm'}>
      Show Logs
    </Button>
  );
};
interface TransactionLogItem {
  createdDate?: string;
  createdBy?: string;
  action?: string;
}
interface TransactionLogsModalProps {
  transactionNo?: string;
  open?: boolean;
  onClose: () => void;
  openSpinner: (arg?: { title?: string }) => void;
  closeSpinner: () => void;
}
export const TransactionLogsModal = forwardRef<
  HTMLDivElement,
  TransactionLogsModalProps
>(({ transactionNo, open, onClose, openSpinner, closeSpinner }, ref) => {
  const [detail, setDetail] = useState<TransactionLogItem[]>([]);
  const getDetails = async () => {
    try {
      openSpinner();
      const response = await fetchDataAsync<{ list?: TransactionLogItem[] }>(
        `${ROUTE_API.operationLog}?transaction=${transactionNo}`
      );
      setDetail(response?.data?.list ?? []);
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) ? error.response?.data?.message : undefined
      );
    } finally {
      delay(() => {
        closeSpinner();
      });
    }
  };

  useEffect(() => {
    if (open) {
      getDetails();
    }
    return () => {
      onClose();
    };
  }, [open]);

  return (
    <>
      <Modal
        size="lg"
        title={'Logs'}
        bodyClassName="p-0"
        content={
          <table className="table">
            <thead className="position-sticky top-0 ">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {detail?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.createdDate}</td>
                  <td>{item?.createdBy}</td>
                  <td>
                    <ComponentStatus status={item.action} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        ref={ref}
      ></Modal>
    </>
  );
});
