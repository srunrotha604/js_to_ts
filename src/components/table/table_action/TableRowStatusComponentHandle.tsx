import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import { fetchDataAsync } from '../../../services/$service';

interface TableRowStatusComponentHandleProps {
  active?: boolean;
  success: () => void;
  uuid?: string;
  route: string;
}

const TableRowStatusComponentHandle = (
  props: TableRowStatusComponentHandleProps
) => {
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
    <span
      className={`${
        !active ? 'text-danger' : 'text-primary'
      } text-underline mr-5`}
      onClick={onSubmit}
    >
      {!active ? 'Disable' : 'Active'}
    </span>
  );
};

export default TableRowStatusComponentHandle;
