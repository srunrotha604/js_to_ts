import type { MouseEventHandler } from 'react';

interface TableCellStatusProps {
  active?: boolean;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
}

const TableCellStatus = (props: TableCellStatusProps) => {
  const { active, onClick } = props;
  return (
    <td
      className={`${!active ? 'text-danger' : 'text-primary'} text-underline`}
      onClick={onClick}
    >
      {!active ? 'Disable' : 'Active'}
    </td>
  );
};

export default TableCellStatus;
