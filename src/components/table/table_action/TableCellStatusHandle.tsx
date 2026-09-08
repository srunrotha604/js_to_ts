import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { fetchDataAsync } from '../../../services/$service';

interface TableCellStatusHandleProps {
  active?: boolean;
  success: () => void;
  uuid?: string;
  route: string;
}

const TableCellStatusHandle = (props: TableCellStatusHandleProps) => {
  const { active, success, uuid, route } = props;
  const { showErrorResponseMessage } = useMessage();

  const onSubmit = async () => {
    try {
      const data = {
        uuid: uuid,
      };
      await fetchDataAsync(route, {
        data,
        method: 'POST',
      });
      toast.success('Success!');
      success();
    } catch (error) {
      showErrorResponseMessage(error);
      console.log(error);
    }
  };

  return (
    <td
      className={`${!active ? 'text-danger' : 'text-primary'} text-underline`}
      onClick={onSubmit}
    >
      {!active ? 'Disable' : 'Active'}
    </td>
  );
};

export default TableCellStatusHandle;
