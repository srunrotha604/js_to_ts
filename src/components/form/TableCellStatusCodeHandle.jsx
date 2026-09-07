import { Tooltip } from 'react-tooltip';

const TableCellStatusCodeHandle = (props) => {
  const { onClick, status } = props;
  return (
    <td>
      <>
        <a
          className="cursor-pointer table-cell-icon-action"
          data-tooltip-id="delete-tooltip"
          data-tooltip-content="Status"
          onClick={() => onClick()}
        >
          {status === 'Active' ? (
            <td className="text-primary">Active</td>
          ) : (
            <td className="text-danger">Disable</td>
          )}
          <Tooltip id="delete-tooltip" />
        </a>
      </>
    </td>
  );
};

export default TableCellStatusCodeHandle;
