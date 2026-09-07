import { Tooltip } from 'react-tooltip';

const TableCellStatusHandle = (props) => {
  const { onClick, active } = props;
  return (
    <td>
      <>
        <a
          className="cursor-pointer table-cell-icon-action"
          data-tooltip-id="delete-tooltip"
          data-tooltip-content="Status"
          onClick={() => onClick()}
        >
          {active ? (
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

export default TableCellStatusHandle;
