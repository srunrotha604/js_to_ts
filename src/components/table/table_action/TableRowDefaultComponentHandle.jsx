import { toast } from 'react-toastify';
import { fetchDataAsync } from '../../../services/$service';
import useMessage from '../../../hooks/useMessage';

const TableRowDefaultComponentHandle = (props) => {
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
