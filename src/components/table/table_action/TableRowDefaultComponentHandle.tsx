import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { fetchDataAsync } from '../../../services/$service';

interface TableRowDefaultComponentHandleProps {
  data?: unknown;
  success: () => void;
  uuid?: string;
  route: string;
  method?: string;
}

const TableRowDefaultComponentHandle = (props: TableRowDefaultComponentHandleProps) => {
  const { data, success, uuid, route, method } = props;
  const { showErrorResponseMessage } = useMessage();
  const onSubmit = async () => {
    try {
      const data = {
        uuid: uuid,
      };
      await fetchDataAsync(route, {
        data,
        method: method ? method : 'post',
      });
      toast.success('Success!');
      success();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    }
  };
  return (
    <span
      className={`${
        !data ? 'text-danger' : 'text-primary'
      } text-underline mr-5`}
      onClick={onSubmit}
    >
      {!data ? '' : 'Default'}
    </span>
  );
};

export default TableRowDefaultComponentHandle;
